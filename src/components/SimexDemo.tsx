import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Braces,
  CalendarClock,
  Check,
  CircleAlert,
  Code2,
  Combine,
  Globe,
  Info,
  Lock,
  Mail,
  Maximize,
  Minus,
  Play,
  Plus,
  Split,
  TriangleAlert,
  Workflow,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/simex-demo.css';

import {
  AREA_BOSS,
  CRON,
  CURRENCIES,
  MISSING_ON_FAILURE,
  RECIPIENT,
  Rate,
  SEND_HOUR,
  fmtCO,
  fmtDate,
  isoDate,
  lastExecutions,
  ratesFor,
} from './simexData';

/* Demo del flujo de n8n que lleva las tasas de cambio de la web oficial al correo
   de Contabilidad de Simex. Todos los datos son ficticios; ver simexData.ts. */

interface SimexDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type NodeId = 'trigger' | 'http' | 'html' | 'split' | 'code' | 'ifn' | 'agg' | 'mail' | 'alert';
type NodeStatus = 'idle' | 'running' | 'success';

interface Ctx {
  date: Date;
  fail: boolean;
  /** Tasas que efectivamente trae la fuente (7 si se simula la fuente incompleta) */
  rates: Rate[];
}

interface FlowNode {
  id: NodeId;
  name: string;
  kind: string;
  icon: React.ReactNode;
  color: string;
  x: number;
  y: number;
  trigger?: boolean;
  params: (ctx: Ctx) => [string, React.ReactNode][];
  code?: string;
  output: (ctx: Ctx) => Record<string, unknown>[];
}

const NODE = 96;
const CANVAS_W = 1720;
const CANVAS_H = 560;
const ROW = 220;

const hour12 = `${SEND_HOUR > 12 ? SEND_HOUR - 12 : SEND_HOUR}:00 ${SEND_HOUR >= 12 ? 'p. m.' : 'a. m.'}`;

const CODE_JS = `// Normaliza cada tasa a pesos colombianos (COP)
const MONEDAS = ['USD','EUR','GBP','JPY','CNY',
                 'BRL','ARS','PEN','SEK','MXN'];

return $input.all()
  .filter(i => MONEDAS.includes(i.json.codigo))
  .map(i => ({
    json: {
      moneda:   i.json.moneda,
      codigo:   i.json.codigo,
      // "4.048,35" -> 4048.35
      tasa_cop: Number(i.json.valor
                  .replace(/\\./g, '')
                  .replace(',', '.')),
      fecha:    $now.setZone('America/Bogota')
                  .toFormat('yyyy-LL-dd'),
    },
  }));`;

const normalized = (ctx: Ctx) =>
  ctx.rates.map((r) => ({ moneda: r.name, codigo: r.code, tasa_cop: Number(r.cop.toFixed(4)), fecha: isoDate(ctx.date) }));

const NODES: FlowNode[] = [
  {
    id: 'trigger',
    name: `Lun–Vie ${hour12}`,
    kind: 'Schedule Trigger',
    icon: <CalendarClock size={34} />,
    color: '#ff6d5a',
    x: 40,
    y: ROW,
    trigger: true,
    params: () => [
      ['Regla', 'Expresión cron'],
      ['Expresión', <code key="c">{CRON}</code>],
      ['Zona horaria', 'America/Bogota (UTC −05:00)'],
      ['Se ejecuta', `Lunes a viernes a las ${hour12}`],
    ],
    output: (ctx) => [
      {
        timestamp: `${isoDate(ctx.date)}T${SEND_HOUR}:00:02.118-05:00`,
        'Readable date': fmtDate(ctx.date),
        Hour: String(SEND_HOUR),
        Timezone: 'America/Bogota (UTC-05:00)',
      },
    ],
  },
  {
    id: 'http',
    name: 'Consultar web oficial',
    kind: 'HTTP Request',
    icon: <Globe size={34} />,
    color: '#0f7ec2',
    x: 230,
    y: ROW,
    params: () => [
      ['Método', 'GET'],
      ['URL', <code key="u">{'{{ $env.FUENTE_TASAS_URL }}'}</code>],
      ['Fuente', 'Web oficial de tasas aprobada por el jefe de Contabilidad'],
      ['Respuesta', 'Texto (HTML)'],
      ['Reintentos', '3 intentos · espera de 60 s'],
    ],
    output: (ctx) => [
      {
        statusCode: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
        data: `<!DOCTYPE html><html lang="es">…<table id="tasas">… (${ctx.rates.length} filas, 38,4 KB)`,
      },
    ],
  },
  {
    id: 'html',
    name: 'Extraer tabla de tasas',
    kind: 'HTML · Extract',
    icon: <Code2 size={34} />,
    color: '#e8833a',
    x: 420,
    y: ROW,
    params: () => [
      ['Operación', 'Extract HTML Content'],
      ['Campo de origen', <code key="d">data</code>],
      ['Clave', <code key="k">tasas</code>],
      ['Selector CSS', <code key="s">table#tasas tbody tr</code>],
      ['Devuelve', 'moneda · codigo · valor (por fila)'],
    ],
    output: (ctx) => [{ tasas: ctx.rates.map((r) => ({ moneda: r.name, codigo: r.code, valor: r.raw })) }],
  },
  {
    id: 'split',
    name: 'Separar por moneda',
    kind: 'Split Out',
    icon: <Split size={34} />,
    color: '#7c5cff',
    x: 610,
    y: ROW,
    params: () => [
      ['Campo a separar', <code key="f">tasas</code>],
      ['Resultado', 'Un ítem por moneda'],
    ],
    output: (ctx) => ctx.rates.map((r) => ({ moneda: r.name, codigo: r.code, valor: r.raw })),
  },
  {
    id: 'code',
    name: 'Convertir a COP',
    kind: 'Code · JavaScript',
    icon: <Braces size={34} />,
    color: '#ff9a00',
    x: 800,
    y: ROW,
    params: () => [
      ['Modo', 'Run Once for All Items'],
      ['Lenguaje', 'JavaScript'],
    ],
    code: CODE_JS,
    output: normalized,
  },
  {
    id: 'ifn',
    name: '¿Llegaron las 10 tasas?',
    kind: 'If',
    icon: <Workflow size={34} />,
    color: '#20b69e',
    x: 990,
    y: ROW,
    params: () => [
      ['Condición 1', <code key="a">{'{{ $items().length }}  es igual a  10'}</code>],
      ['Condición 2', <code key="b">{'{{ $json.tasa_cop }}  es mayor que  0'}</code>],
      ['Combinar', 'AND'],
      ['true', 'Se arma la tabla y se envía al responsable'],
      ['false', 'Se envía una alerta para revisar la fuente'],
    ],
    output: normalized,
  },
  {
    id: 'agg',
    name: 'Armar tabla para Epicor',
    kind: 'Aggregate',
    icon: <Combine size={34} />,
    color: '#3f8ff7',
    x: 1220,
    y: ROW - 120,
    params: () => [
      ['Agregar', 'Todos los ítems en una lista'],
      ['Campo de salida', <code key="o">tasas</code>],
      ['Orden', 'Mismo orden del módulo de Epicor'],
    ],
    output: (ctx) => [{ fecha: isoDate(ctx.date), total: ctx.rates.length, tasas: normalized(ctx) }],
  },
  {
    id: 'mail',
    name: 'Enviar tasas del día',
    kind: 'Microsoft Outlook',
    icon: <Mail size={34} />,
    color: '#0a64c9',
    x: 1440,
    y: ROW - 120,
    params: (ctx) => [
      ['Recurso', 'Message → Send'],
      ['Para', `${RECIPIENT.name} <${RECIPIENT.email}>`],
      ['Asunto', `Tasas de cambio ${isoDate(ctx.date)} · 10 monedas a COP`],
      ['Formato', 'HTML'],
      ['Credencial', 'Outlook · cuenta de automatizaciones'],
    ],
    output: (ctx) => [
      {
        id: `AAMkAGI2${isoDate(ctx.date).replace(/-/g, '')}THjAAA=`,
        subject: `Tasas de cambio ${isoDate(ctx.date)} · 10 monedas a COP`,
        toRecipients: [RECIPIENT.email],
        sentDateTime: `${isoDate(ctx.date)}T${SEND_HOUR}:00:09-05:00`,
      },
    ],
  },
  {
    id: 'alert',
    name: 'Alerta: fuente incompleta',
    kind: 'Microsoft Outlook',
    icon: <TriangleAlert size={34} />,
    color: '#d64545',
    x: 1220,
    y: ROW + 150,
    params: (ctx) => [
      ['Recurso', 'Message → Send'],
      ['Para', `${RECIPIENT.email}; ${AREA_BOSS.email}`],
      ['Asunto', `⚠ Tasas incompletas ${isoDate(ctx.date)}`],
      ['Importancia', 'Alta'],
    ],
    output: (ctx) => [
      {
        id: `AAMkAGI2${isoDate(ctx.date).replace(/-/g, '')}ALRT=`,
        subject: `⚠ Tasas incompletas ${isoDate(ctx.date)}`,
        toRecipients: [RECIPIENT.email, AREA_BOSS.email],
        faltantes: MISSING_ON_FAILURE,
      },
    ],
  },
];

const nodeById = (id: NodeId) => NODES.find((n) => n.id === id)!;

const EDGES: { from: NodeId; to: NodeId; branch?: 'true' | 'false' }[] = [
  { from: 'trigger', to: 'http' },
  { from: 'http', to: 'html' },
  { from: 'html', to: 'split' },
  { from: 'split', to: 'code' },
  { from: 'code', to: 'ifn' },
  { from: 'ifn', to: 'agg', branch: 'true' },
  { from: 'agg', to: 'mail' },
  { from: 'ifn', to: 'alert', branch: 'false' },
];

const pathOf = (ctx: Ctx): NodeId[] =>
  ['trigger', 'http', 'html', 'split', 'code', 'ifn', ...(ctx.fail ? ['alert'] : ['agg', 'mail'])] as NodeId[];

/** Ítems que salen de cada nodo */
const itemCount = (id: NodeId, ctx: Ctx) => (id === 'split' || id === 'code' || id === 'ifn' ? ctx.rates.length : 1);

const makeCtx = (date: Date, fail: boolean): Ctx => {
  const all = ratesFor(date);
  return { date, fail, rates: fail ? all.filter((r) => !MISSING_ON_FAILURE.includes(r.code)) : all };
};

// En el historial, una de las ejecuciones pasadas muestra el camino de alerta
const FAILED_EXECUTION_INDEX = 4;

export const SimexDemo: React.FC<SimexDemoProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'notice' | 'app'>('notice');
  const [tab, setTab] = useState<'editor' | 'executions'>('editor');
  const executions = useMemo(() => lastExecutions(12), []);
  const [ctx, setCtx] = useState<Ctx>(() => makeCtx(executions[0], false));
  const [status, setStatus] = useState<Partial<Record<NodeId, NodeStatus>>>({});
  const [running, setRunning] = useState(false);
  const [openNode, setOpenNode] = useState<NodeId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const noticeBtnRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const openNodeRef = useRef(openNode);
  openNodeRef.current = openNode;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Reinicia al abrir, bloquea el scroll del fondo y cierra con Escape
  useEffect(() => {
    if (!isOpen) return;
    setScreen('notice');
    setTab('editor');
    setCtx(makeCtx(executions[0], false));
    setStatus({});
    setRunning(false);
    setOpenNode(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openNodeRef.current) setOpenNode(null);
      else onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    setTimeout(() => noticeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimers();
    };
  }, [isOpen, executions]);

  // Ajusta el zoom para que el flujo completo quepa en pantalla (con un mínimo legible en móvil)
  const fit = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const z = Math.max(0.55, Math.min(1, (el.clientWidth - 32) / CANVAS_W, (el.clientHeight - 32) / CANVAS_H));
    setFitZoom(z);
    setZoom(z);
  }, []);

  useLayoutEffect(() => {
    if (screen !== 'app' || tab !== 'editor') return;
    fit();
    const ro = new ResizeObserver(fit);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [screen, tab, fit]);

  const run = (fail: boolean) => {
    clearTimers();
    const next = makeCtx(executions[0], fail);
    setCtx(next);
    setStatus({});
    setOpenNode(null);
    setRunning(true);
    const path = pathOf(next);
    path.forEach((id, i) => {
      timers.current.push(window.setTimeout(() => setStatus((s) => ({ ...s, [id]: 'running' })), i * 620));
      timers.current.push(window.setTimeout(() => setStatus((s) => ({ ...s, [id]: 'success' })), i * 620 + 480));
    });
    timers.current.push(window.setTimeout(() => setRunning(false), path.length * 620));
  };

  const loadExecution = (idx: number) => {
    clearTimers();
    const next = makeCtx(executions[idx], idx === FAILED_EXECUTION_INDEX);
    setCtx(next);
    setStatus(Object.fromEntries(pathOf(next).map((id) => [id, 'success'])));
    setRunning(false);
    setTab('editor');
  };

  const executed = (id: NodeId) => status[id] === 'success';

  if (!isOpen) return null;

  // Se renderiza en <body> para que ningún contenedor con transform/animación afecte al position: fixed
  if (screen === 'notice') {
    return createPortal(
      <div
        className="sxd-overlay sxd-overlay--center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sxd-notice-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="sxd-notice">
          <button className="sxd-notice-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
          <span className="sxd-notice-icon" aria-hidden="true">
            <Lock size={22} />
          </span>
          <h2 id="sxd-notice-title" className="sxd-notice-title">
            Flujo interno con datos ficticios
          </h2>
          <p className="sxd-notice-text">
            Este flujo de n8n automatizó una tarea diaria de Contabilidad en Simex (Colombia). Es una recreación para el
            portafolio: las tasas, correos y personas que verás son <strong>ficticios</strong>.
          </p>
          <div className="sxd-notice-compare">
            <div>
              <span className="sxd-tag sxd-tag--before">Antes</span>
              <p>Cada día alguien copiaba a mano 10 tasas desde la web oficial para pasarlas al módulo de Epicor.</p>
            </div>
            <div>
              <span className="sxd-tag sxd-tag--after">Con n8n</span>
              <p>
                De lunes a viernes a las {hour12} el flujo trae las 10 tasas, las convierte a COP y las envía por Outlook.
              </p>
            </div>
          </div>
          <ul className="sxd-notice-list">
            <li>Pulsa <strong>Ejecutar workflow</strong> y abre cualquier nodo para ver su configuración y su salida.</li>
            <li>Prueba también el caso en que la fuente no ha publicado todas las tasas.</li>
          </ul>
          <button ref={noticeBtnRef} className="sxd-btn-run sxd-btn-block" onClick={() => setScreen('app')}>
            Abrir el flujo en n8n
          </button>
        </div>
      </div>,
      document.body
    );
  }

  const node = openNode ? nodeById(openNode) : null;

  return createPortal(
    <div className="sxd-overlay" role="dialog" aria-modal="true" aria-label="Demo del flujo de n8n de tasas de cambio (datos ficticios)">
      <div className="sxd-app">
        {/* Barra lateral de n8n */}
        <aside className="sxd-rail" aria-hidden="true">
          <span className="sxd-rail-logo">n8n</span>
          <span className="sxd-rail-item sxd-rail-item--active">
            <Workflow size={18} />
          </span>
          <span className="sxd-rail-item">
            <CalendarClock size={18} />
          </span>
          <span className="sxd-rail-item">
            <Lock size={18} />
          </span>
        </aside>

        <div className="sxd-main">
          <header className="sxd-top">
            <div className="sxd-top-title">
              <span className="sxd-crumb">Contabilidad /</span>
              <strong>Tasas de cambio → Outlook</strong>
              <span className="sxd-demo-badge">
                <Info size={13} /> Datos ficticios
              </span>
            </div>
            <div className="sxd-tabs" role="tablist" aria-label="Vistas del workflow">
              <button role="tab" aria-selected={tab === 'editor'} onClick={() => setTab('editor')}>
                Editor
              </button>
              <button role="tab" aria-selected={tab === 'executions'} onClick={() => setTab('executions')}>
                Ejecuciones
              </button>
            </div>
            <div className="sxd-top-actions">
              <span className="sxd-active">
                <span className="sxd-switch" aria-hidden="true" /> Activo
              </span>
              <button className="sxd-close" onClick={onClose} aria-label="Cerrar demostración">
                <X size={18} />
              </button>
            </div>
          </header>

          {tab === 'editor' ? (
            <div className="sxd-canvas" ref={canvasRef}>
              <div className="sxd-exec-info">
                <CalendarClock size={14} />
                Ejecución del {fmtDate(ctx.date)} · {hour12}
                {ctx.fail && <span className="sxd-exec-warn">fuente incompleta</span>}
              </div>

              <div className="sxd-stage" style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}>
                <div className="sxd-stage-inner" style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})` }}>
                  <svg className="sxd-edges" width={CANVAS_W} height={CANVAS_H} aria-hidden="true">
                    {EDGES.map((e) => {
                      const a = nodeById(e.from);
                      const b = nodeById(e.to);
                      const x1 = a.x + NODE;
                      const y1 = a.y + NODE / 2 + (e.branch === 'true' ? -18 : e.branch === 'false' ? 18 : 0);
                      const x2 = b.x;
                      const y2 = b.y + NODE / 2;
                      const dx = Math.max(40, (x2 - x1) / 2);
                      const done = executed(e.from) && executed(e.to);
                      const n = itemCount(e.from, ctx);
                      return (
                        <g key={`${e.from}-${e.to}`} className={done ? 'sxd-edge sxd-edge--done' : 'sxd-edge'}>
                          <path d={`M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2 - 6},${y2}`} />
                          <polygon points={`${x2 - 8},${y2 - 5} ${x2},${y2} ${x2 - 8},${y2 + 5}`} />
                          {done && (
                            <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle">
                              {n} {n === 1 ? 'item' : 'items'}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Etiquetas de las salidas del If */}
                  <span className="sxd-branch sxd-branch--true" style={{ left: 990 + NODE + 6, top: ROW + NODE / 2 - 36 }}>
                    true
                  </span>
                  <span className="sxd-branch sxd-branch--false" style={{ left: 990 + NODE + 6, top: ROW + NODE / 2 + 20 }}>
                    false
                  </span>

                  {NODES.map((n) => {
                    const st = status[n.id] ?? 'idle';
                    return (
                      <button
                        key={n.id}
                        className={`sxd-node sxd-node--${st} ${n.trigger ? 'sxd-node--trigger' : ''}`}
                        style={{ left: n.x, top: n.y, ['--c' as string]: n.color }}
                        onClick={() => setOpenNode(n.id)}
                        aria-label={`${n.name} (${n.kind})${st === 'success' ? ', ejecutado' : ''}`}
                      >
                        <span className="sxd-node-box">
                          {n.icon}
                          {st === 'success' && (
                            <span className="sxd-node-ok">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                          {st === 'running' && <span className="sxd-node-spin" />}
                          {n.trigger && <span className="sxd-node-bolt">⚡</span>}
                        </span>
                        <span className="sxd-node-name">{n.name}</span>
                        <span className="sxd-node-kind">{n.kind}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sxd-zoom">
                <button onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} aria-label="Acercar">
                  <Plus size={16} />
                </button>
                <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} aria-label="Alejar">
                  <Minus size={16} />
                </button>
                <button onClick={() => setZoom(fitZoom)} aria-label="Ajustar a la pantalla">
                  <Maximize size={16} />
                </button>
              </div>

              <div className="sxd-run-bar">
                <button className="sxd-btn-run" onClick={() => run(false)} disabled={running}>
                  <Play size={16} fill="currentColor" /> {running ? 'Ejecutando…' : 'Ejecutar workflow'}
                </button>
                <button className="sxd-btn-ghost" onClick={() => run(true)} disabled={running}>
                  <CircleAlert size={16} /> Simular fuente incompleta
                </button>
              </div>
            </div>
          ) : (
            <ExecutionsView executions={executions} onOpen={loadExecution} />
          )}
        </div>

        {node && <NodePanel node={node} ctx={ctx} executed={executed(node.id)} onClose={() => setOpenNode(null)} />}
      </div>
    </div>,
    document.body
  );
};

/* ---------------------------------------------------------------- Ejecuciones */

const ExecutionsView: React.FC<{ executions: Date[]; onOpen: (idx: number) => void }> = ({ executions, onOpen }) => (
  <div className="sxd-execs">
    <p className="sxd-execs-sub">
      Disparo automático: <code>{CRON}</code> · America/Bogota. Abre una ejecución para verla en el editor.
    </p>
    <ul>
      {executions.map((d, i) => {
        const failed = i === FAILED_EXECUTION_INDEX;
        return (
          <li key={d.toISOString()}>
            <button onClick={() => onOpen(i)}>
              <span className={`sxd-exec-dot ${failed ? 'sxd-exec-dot--warn' : ''}`} aria-hidden="true" />
              <span className="sxd-exec-date">
                <strong>{fmtDate(d)}</strong>
                <span>{hour12} · 8,4 s</span>
              </span>
              <span className={`sxd-exec-status ${failed ? 'sxd-exec-status--warn' : ''}`}>
                {failed ? 'Alerta enviada · 7/10 tasas' : 'Correo enviado · 10/10 tasas'}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

/* ---------------------------------------------------------------- Panel del nodo */

const NodePanel: React.FC<{ node: FlowNode; ctx: Ctx; executed: boolean; onClose: () => void }> = ({
  node,
  ctx,
  executed,
  onClose,
}) => {
  const isMail = node.id === 'mail' || node.id === 'alert';
  const [view, setView] = useState<'table' | 'json' | 'email'>(isMail ? 'email' : 'table');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setView(isMail ? 'email' : 'table');
    closeRef.current?.focus();
  }, [node.id, isMail]);

  const items = executed ? node.output(ctx) : [];
  const columns = Array.from(new Set<string>(items.flatMap((it) => Object.keys(it))));
  const cell = (v: unknown) => (typeof v === 'object' ? JSON.stringify(v) : String(v));

  return (
    <div className="sxd-ndv-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sxd-ndv" role="dialog" aria-modal="true" aria-labelledby="sxd-ndv-title">
        <header className="sxd-ndv-head" style={{ ['--c' as string]: node.color }}>
          <span className="sxd-ndv-icon">{node.icon}</span>
          <div>
            <h3 id="sxd-ndv-title">{node.name}</h3>
            <span>{node.kind}</span>
          </div>
          <button ref={closeRef} className="sxd-close sxd-close--dark" onClick={onClose} aria-label="Cerrar nodo">
            <X size={18} />
          </button>
        </header>

        <div className="sxd-ndv-body">
          <section className="sxd-ndv-params">
            <h4>Parámetros</h4>
            <dl>
              {node.params(ctx).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {node.code && <pre className="sxd-code">{node.code}</pre>}
          </section>

          <section className="sxd-ndv-output">
            <div className="sxd-out-head">
              <h4>
                Salida{' '}
                {executed && (
                  <span className="sxd-out-count">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h4>
              {executed && (
                <div className="sxd-seg" role="tablist" aria-label="Formato de salida">
                  {isMail && (
                    <button role="tab" aria-selected={view === 'email'} onClick={() => setView('email')}>
                      Correo
                    </button>
                  )}
                  <button role="tab" aria-selected={view === 'table'} onClick={() => setView('table')}>
                    Tabla
                  </button>
                  <button role="tab" aria-selected={view === 'json'} onClick={() => setView('json')}>
                    JSON
                  </button>
                </div>
              )}
            </div>

            {!executed ? (
              <div className="sxd-out-empty">
                <Play size={22} />
                <strong>Este nodo aún no se ha ejecutado</strong>
                <span>Cierra el panel y pulsa «Ejecutar workflow», o abre una ejecución del historial.</span>
              </div>
            ) : view === 'email' ? (
              <EmailPreview ctx={ctx} alert={node.id === 'alert'} />
            ) : view === 'json' ? (
              <pre className="sxd-json">{JSON.stringify(items.map((json) => ({ json })), null, 2)}</pre>
            ) : (
              <div className="sxd-out-table-wrap">
                <table className="sxd-out-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i}>
                        <td className="sxd-td-idx">{i}</td>
                        {columns.map((c) => (
                          <td key={c}>{cell(it[c])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- Correo de Outlook */

const EmailPreview: React.FC<{ ctx: Ctx; alert: boolean }> = ({ ctx, alert }) => {
  const day = isoDate(ctx.date);
  const missing = CURRENCIES.filter((c) => MISSING_ON_FAILURE.includes(c.code));
  return (
    <article className="sxd-mail">
      <header className="sxd-mail-head">
        <span className="sxd-mail-avatar">n8n</span>
        <div>
          <strong>Automatizaciones Contabilidad</strong>
          <span>
            Para: {RECIPIENT.name}
            {alert && `; ${AREA_BOSS.name}`}
          </span>
        </div>
        <time>
          {ctx.date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} · {hour12}
        </time>
      </header>
      <h5 className="sxd-mail-subject">
        {alert ? `⚠ Tasas incompletas ${day}` : `Tasas de cambio ${day} · 10 monedas a COP`}
      </h5>

      {alert ? (
        <div className="sxd-mail-body">
          <p>Hola {RECIPIENT.name.split(' ')[0]},</p>
          <p>
            A las {hour12} la web oficial solo había publicado <strong>{ctx.rates.length} de 10</strong> tasas. Faltan:
          </p>
          <ul>
            {missing.map((c) => (
              <li key={c.code}>
                {c.name} ({c.code})
              </li>
            ))}
          </ul>
          <p>Por favor revísalas manualmente en la fuente antes de cargarlas en Epicor.</p>
          <p className="sxd-mail-sign">— Flujo automático de n8n</p>
        </div>
      ) : (
        <div className="sxd-mail-body">
          <p>Hola {RECIPIENT.name.split(' ')[0]},</p>
          <p>
            Estas son las tasas de cambio oficiales del {fmtDate(ctx.date)}, listas para cargar en el módulo de tasas de
            Epicor. Todas expresadas en <strong>pesos colombianos (COP)</strong>.
          </p>
          <div className="sxd-mail-table-wrap">
            <table className="sxd-mail-table">
              <thead>
                <tr>
                  <th>Moneda</th>
                  <th>Código</th>
                  <th>1 unidad = COP</th>
                  <th>Var. día</th>
                </tr>
              </thead>
              <tbody>
                {ctx.rates.map((r) => {
                  const c = CURRENCIES.find((x) => x.code === r.code)!;
                  return (
                    <tr key={r.code}>
                      <td>{r.name}</td>
                      <td>
                        <code>{r.code}</code>
                      </td>
                      <td className="sxd-num">$ {fmtCO(r.cop, c.decimals)}</td>
                      <td className={`sxd-num ${r.change >= 0 ? 'sxd-up' : 'sxd-down'}`}>
                        {r.change >= 0 ? '▲' : '▼'} {Math.abs(r.change).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="sxd-mail-sign">— Flujo automático de n8n · Fuente: web oficial de tasas aprobada por Contabilidad</p>
        </div>
      )}
    </article>
  );
};
