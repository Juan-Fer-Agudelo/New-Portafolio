import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Braces,
  Bug,
  CalendarClock,
  Check,
  CircleAlert,
  Code2,
  FlaskConical,
  GitMerge,
  Globe,
  Inbox,
  Info,
  Lock,
  Mail,
  Maximize,
  Pencil,
  Route,
  Search,
  Signpost,
  Table,
  TriangleAlert,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/simex-demo.css';
import { DemoNotice } from './DemoNotice';

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

type NodeStatus = 'idle' | 'running' | 'success';
type Tab = 'editor' | 'executions' | 'outlook';

interface Ctx {
  date: Date;
  fail: boolean;
  /** Tasas que efectivamente publicó la fuente (7 si se simula la fuente incompleta) */
  rates: Rate[];
}

interface FlowNode {
  id: string;
  name: string;
  kind: string;
  icon: React.ReactNode;
  color: string;
  x: number;
  y: number;
  /** Alto del nodo (Switch y Merge son más altos por sus 10 salidas/entradas) */
  h?: number;
  trigger?: boolean;
  /** Código de moneda si el nodo pertenece a una rama */
  lane?: string;
  params: (ctx: Ctx) => [string, React.ReactNode][];
  code?: string;
  output: (ctx: Ctx) => Record<string, unknown>[];
}

interface Edge {
  from: string;
  to: string;
  /** Salida del nodo origen (Switch: 0–9 · If: 0 = true, 1 = false) */
  out?: number;
  /** Entrada del nodo destino (Merge: 0–9) */
  in?: number;
}

/* ---------------------------------------------------------------- Geometría del lienzo */

const N = 64; // tamaño de un nodo
const LANE_TOP = 120;
const LANE_GAP = 92;
const laneY = (i: number) => LANE_TOP + i * LANE_GAP;
const MID = laneY(4.5) + N / 2; // centro vertical del flujo
const TALL = LANE_GAP * 9 + 64; // alto de Switch y Merge
const TALL_Y = laneY(0);
const W = 2240;
const H = laneY(9) + 272;

const hour12 = `${SEND_HOUR > 12 ? SEND_HOUR - 12 : SEND_HOUR}:00 ${SEND_HOUR >= 12 ? 'p. m.' : 'a. m.'}`;
const mailSubject = (d: Date) => `Tasas de cambio ${isoDate(d)} · 10 monedas a COP`;
const alertSubject = (d: Date) => `⚠ Tasas incompletas ${isoDate(d)}`;
const curr = (code: string) => CURRENCIES.find((c) => c.code === code)!;

const rowsOf = (ctx: Ctx) => ctx.rates.map((r) => ({ moneda: r.name, codigo: r.code, valor: r.raw }));
const copOf = (ctx: Ctx) =>
  ctx.rates.map((r) => ({ codigo: r.code, moneda: r.name, tasa_cop: Number(r.cop.toFixed(4)), fecha: isoDate(ctx.date) }));
const has = (ctx: Ctx, code: string) => ctx.rates.some((r) => r.code === code);

const laneCode = (code: string) => `// ${curr(code).name}: "4.048,35" -> 4048.35
const v = $json.valor;
return [{
  json: {
    codigo:   '${code}',
    moneda:   '${curr(code).name}',
    tasa_cop: Number(v.replace(/\\./g, '')
                      .replace(',', '.')),
    fecha:    $('Fecha (Bogotá)').item.json.fecha,
  },
}];`;

const TABLE_JS = `// Tabla HTML para el cuerpo del correo de Outlook
const filas = $input.all().map(({ json: t }) => \`
  <tr>
    <td>\${t.moneda}</td>
    <td>\${t.codigo}</td>
    <td align="right">$ \${t.tasa_cop.toLocaleString('es-CO')}</td>
  </tr>\`).join('');

return [{ json: {
  asunto: \`Tasas de cambio \${$json.fecha} · 10 monedas a COP\`,
  html:   \`<table>\${filas}</table>\`,
} }];`;

/* ---------------------------------------------------------------- Nodos */

const MAIN: FlowNode[] = [
  {
    id: 'trigger',
    name: `Lun–Vie ${hour12}`,
    kind: 'Schedule Trigger',
    icon: <CalendarClock size={28} />,
    color: '#ff6d5a',
    x: 60,
    y: MID - N / 2,
    trigger: true,
    params: () => [
      ['Regla', 'Expresión cron'],
      ['Expresión', <code key="c">{CRON}</code>],
      ['Zona horaria', 'America/Bogota (UTC −05:00)'],
      ['Se ejecuta', `Lunes a viernes a las ${hour12}`],
    ],
    output: (ctx) => [
      { timestamp: `${isoDate(ctx.date)}T${SEND_HOUR}:00:02.118-05:00`, 'Readable date': fmtDate(ctx.date), Hour: String(SEND_HOUR) },
    ],
  },
  {
    id: 'fecha',
    name: 'Fecha (Bogotá)',
    kind: 'Edit Fields (Set)',
    icon: <Pencil size={26} />,
    color: '#7b8cff',
    x: 210,
    y: MID - N / 2,
    params: () => [
      ['Campo', <code key="f">fecha</code>],
      ['Valor', <code key="v">{"{{ $now.setZone('America/Bogota').toFormat('yyyy-LL-dd') }}"}</code>],
    ],
    output: (ctx) => [{ fecha: isoDate(ctx.date) }],
  },
  {
    id: 'http',
    name: 'Consultar web oficial',
    kind: 'HTTP Request',
    icon: <Globe size={28} />,
    color: '#8b9cff',
    x: 360,
    y: MID - N / 2,
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
        'content-type': 'text/html; charset=utf-8',
        data: `<!DOCTYPE html><html lang="es">…<table id="tasas">… (${ctx.rates.length} filas, 38,4 KB)`,
      },
    ],
  },
  {
    id: 'html',
    name: 'Extraer filas de tasas',
    kind: 'HTML · Extract',
    icon: <Code2 size={28} />,
    color: '#ff9b52',
    x: 510,
    y: MID - N / 2,
    params: () => [
      ['Operación', 'Extract HTML Content'],
      ['Selector CSS', <code key="s">table#tasas tbody tr</code>],
      ['Campos', 'moneda · codigo · valor'],
      ['Dividir en ítems', 'Sí (un ítem por fila)'],
    ],
    output: rowsOf,
  },
  {
    id: 'switch',
    name: 'Moneda',
    kind: 'Switch · 10 reglas',
    icon: <Route size={28} />,
    color: '#5cc6ff',
    x: 690,
    y: TALL_Y,
    h: TALL,
    params: () => [
      ['Modo', 'Rules'],
      ['Valor a evaluar', <code key="v">{'{{ $json.codigo }}'}</code>],
      ...CURRENCIES.map((c, i): [string, React.ReactNode] => [`Salida ${i}`, `codigo = "${c.code}" → ${c.name}`]),
    ],
    output: rowsOf,
  },
  {
    id: 'merge',
    name: 'Unir monedas',
    kind: 'Merge · 10 entradas',
    icon: <GitMerge size={28} />,
    color: '#5cc6ff',
    x: 1300,
    y: TALL_Y,
    h: TALL,
    params: () => [
      ['Modo', 'Append'],
      ['Entradas', '10 (una por moneda)'],
      ['Orden', 'Mismo orden del módulo de tasas de Epicor'],
    ],
    output: copOf,
  },
  {
    id: 'if',
    name: '¿Llegaron las 10?',
    kind: 'If',
    icon: <Signpost size={28} />,
    color: '#3ecf8e',
    x: 1460,
    y: MID - N / 2,
    params: () => [
      ['Condición 1', <code key="a">{'{{ $input.all().length }}  =  10'}</code>],
      ['Condición 2', <code key="b">{'{{ $json.tasa_cop }}  >  0'}</code>],
      ['Combinar', 'AND'],
      ['true', 'Se genera la tabla y se envía al responsable'],
      ['false', 'Se envía una alerta para revisar la fuente'],
    ],
    output: copOf,
  },
  {
    id: 'tabla',
    name: 'Tabla HTML del correo',
    kind: 'Code · JavaScript',
    icon: <Table size={26} />,
    color: '#ff9b52',
    x: 1640,
    y: MID - 150,
    params: () => [['Modo', 'Run Once for All Items']],
    code: TABLE_JS,
    output: (ctx) => [{ asunto: mailSubject(ctx.date), html: `<table>… ${ctx.rates.length} filas …</table>` }],
  },
  {
    id: 'mail',
    name: 'Enviar tasas del día',
    kind: 'Microsoft Outlook · Send',
    icon: <Mail size={28} />,
    color: '#3b9cff',
    x: 1820,
    y: MID - 150,
    params: (ctx) => [
      ['Recurso', 'Message → Send'],
      ['Para', `${RECIPIENT.name} <${RECIPIENT.email}>`],
      ['Asunto', <code key="s">{'{{ $json.asunto }}'}</code>],
      ['Cuerpo (HTML)', <code key="b">{'{{ $json.html }}'}</code>],
      ['Vista previa del asunto', mailSubject(ctx.date)],
    ],
    output: (ctx) => [
      {
        id: `AAMkAGI2${isoDate(ctx.date).replace(/-/g, '')}THjAAA=`,
        subject: mailSubject(ctx.date),
        toRecipients: [RECIPIENT.email],
        sentDateTime: `${isoDate(ctx.date)}T${SEND_HOUR}:00:09-05:00`,
      },
    ],
  },
  {
    id: 'alert',
    name: 'Alerta: faltan tasas',
    kind: 'Microsoft Outlook · Send',
    icon: <TriangleAlert size={28} />,
    color: '#ff5c5c',
    x: 1640,
    y: MID + 100,
    params: (ctx) => [
      ['Recurso', 'Message → Send'],
      ['Para', `${RECIPIENT.email}; ${AREA_BOSS.email}`],
      ['Asunto', alertSubject(ctx.date)],
      ['Importancia', 'Alta'],
    ],
    output: (ctx) => [
      {
        id: `AAMkAGI2${isoDate(ctx.date).replace(/-/g, '')}ALRT=`,
        subject: alertSubject(ctx.date),
        toRecipients: [RECIPIENT.email, AREA_BOSS.email],
        faltantes: MISSING_ON_FAILURE,
      },
    ],
  },
  {
    id: 'errtrigger',
    name: 'Si el flujo falla',
    kind: 'Error Trigger',
    icon: <Bug size={28} />,
    color: '#ff6d5a',
    x: 1640,
    y: laneY(9) + 92,
    trigger: true,
    params: () => [['Se activa', 'Cuando cualquier nodo del workflow termina en error (p. ej. la web oficial no responde)']],
    output: () => [],
  },
  {
    id: 'errmail',
    name: 'Avisar error',
    kind: 'Microsoft Outlook · Send',
    icon: <Mail size={28} />,
    color: '#ff5c5c',
    x: 1820,
    y: laneY(9) + 92,
    params: () => [
      ['Para', `${RECIPIENT.email}; ${AREA_BOSS.email}`],
      ['Asunto', <code key="s">{'Error en flujo de tasas: {{ $json.execution.error.message }}'}</code>],
    ],
    output: () => [],
  },
];

const LANES: FlowNode[] = CURRENCIES.flatMap((c, i) => [
  {
    id: `set-${c.code}`,
    name: `${c.code} · ${c.name}`,
    kind: 'Edit Fields (Set)',
    icon: <Pencil size={24} />,
    color: '#7b8cff',
    x: 900,
    y: laneY(i),
    lane: c.code,
    params: () => [
      ['Viene de', `Switch → salida ${i} (codigo = "${c.code}")`],
      ['Campo', <code key="v">valor</code>],
      ['Valor', <code key="e">{'{{ $json.valor.trim() }}'}</code>],
    ],
    output: (ctx: Ctx) => rowsOf(ctx).filter((r) => r.codigo === c.code),
  },
  {
    id: `cop-${c.code}`,
    name: `${c.code} → COP`,
    kind: 'Code · JavaScript',
    icon: <Braces size={24} />,
    color: '#ff9b52',
    x: 1090,
    y: laneY(i),
    lane: c.code,
    params: () => [['Modo', 'Run Once for Each Item']],
    code: laneCode(c.code),
    output: (ctx: Ctx) => copOf(ctx).filter((r) => r.codigo === c.code),
  },
]);

const NODES = [...MAIN, ...LANES];
const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

const EDGES: Edge[] = [
  { from: 'trigger', to: 'fecha' },
  { from: 'fecha', to: 'http' },
  { from: 'http', to: 'html' },
  { from: 'html', to: 'switch' },
  ...CURRENCIES.flatMap((c, i) => [
    { from: 'switch', to: `set-${c.code}`, out: i },
    { from: `set-${c.code}`, to: `cop-${c.code}` },
    { from: `cop-${c.code}`, to: 'merge', in: i },
  ]),
  { from: 'merge', to: 'if' },
  { from: 'if', to: 'tabla', out: 0 },
  { from: 'tabla', to: 'mail' },
  { from: 'if', to: 'alert', out: 1 },
  { from: 'errtrigger', to: 'errmail' },
];

/** Punto de salida/entrada de una conexión */
const port = (n: FlowNode, side: 'out' | 'in', idx?: number) => {
  const h = n.h ?? N;
  let y = n.y + h / 2;
  if (n.id === 'switch' && side === 'out' && idx !== undefined) y = laneY(idx) + N / 2;
  if (n.id === 'merge' && side === 'in' && idx !== undefined) y = laneY(idx) + N / 2;
  if (n.id === 'if' && side === 'out' && idx !== undefined) y = n.y + (idx === 0 ? 20 : 44);
  return { x: side === 'out' ? n.x + N : n.x, y };
};

const NOTES = [
  {
    title: '1 · Disparo y consulta',
    text: `De lunes a viernes a las ${hour12} se consulta la web oficial aprobada por el jefe de Contabilidad y se extrae una fila por moneda.`,
    x: 30,
    y: MID - 190,
    w: 600,
    h: 340,
    tone: 'green',
  },
  {
    title: '2 · Un caso por moneda',
    text: 'El Switch envía cada moneda por su propia rama: se limpia el valor y se convierte a pesos colombianos (COP).',
    x: 670,
    y: 18,
    w: 590,
    h: laneY(9) + 110,
    tone: 'blue',
  },
  {
    title: '3 · Validación y envío por Outlook',
    text: 'Si llegaron las 10 tasas se arma la tabla y se envía al responsable de divisas. Si falta alguna, se envía una alerta.',
    x: 1280,
    y: 18,
    w: 760,
    h: laneY(9) - 48,
    tone: 'brown',
  },
  {
    title: 'Manejo de errores',
    text: 'Si la web oficial no responde, el Error Trigger avisa por correo para cargar las tasas a mano.',
    x: 1600,
    y: laneY(9) + 2,
    w: 420,
    h: 230,
    tone: 'red',
  },
];

/* ---------------------------------------------------------------- Ejecución */

const makeCtx = (date: Date, fail: boolean): Ctx => {
  const all = ratesFor(date);
  return { date, fail, rates: fail ? all.filter((r) => !MISSING_ON_FAILURE.includes(r.code)) : all };
};

/** Momento (ms) en que arranca cada nodo dentro de la animación */
const schedule = (ctx: Ctx) => {
  const t: [string, number][] = [
    ['trigger', 0],
    ['fecha', 450],
    ['http', 900],
    ['html', 1500],
    ['switch', 1950],
  ];
  CURRENCIES.forEach((c, i) => {
    if (!has(ctx, c.code)) return;
    t.push([`set-${c.code}`, 2400 + i * 110], [`cop-${c.code}`, 2850 + i * 110]);
  });
  t.push(['merge', 4150], ['if', 4600]);
  if (ctx.fail) t.push(['alert', 5050]);
  else t.push(['tabla', 5050], ['mail', 5500]);
  return t;
};

// En el historial, una de las ejecuciones pasadas muestra el camino de alerta
const FAILED_EXECUTION_INDEX = 4;
const STEP_MS = 380;

export const SimexDemo: React.FC<SimexDemoProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'notice' | 'app'>('notice');
  const [tab, setTab] = useState<Tab>('editor');
  const executions = useMemo(() => lastExecutions(12), []);
  // Contexto de cada correo de la bandeja; el primero cambia si se simula la fuente incompleta
  const [latestFail, setLatestFail] = useState(false);
  const inbox = useMemo(
    () => executions.map((d, i) => makeCtx(d, i === 0 ? latestFail : i === FAILED_EXECUTION_INDEX)),
    [executions, latestFail]
  );
  const [ctx, setCtx] = useState<Ctx>(() => makeCtx(executions[0], false));
  const [status, setStatus] = useState<Record<string, NodeStatus>>({});
  const [running, setRunning] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [openNode, setOpenNode] = useState<string | null>(null);
  const [mailIdx, setMailIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
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
    setLatestFail(false);
    setCtx(makeCtx(executions[0], false));
    setStatus({});
    setRunning(false);
    setDelivered(false);
    setOpenNode(null);
    setMailIdx(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openNodeRef.current) setOpenNode(null);
      else onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
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
    const z = Math.max(0.42, Math.min(1, (el.clientWidth - 24) / W, (el.clientHeight - 24) / H));
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
    setLatestFail(fail);
    setStatus({});
    setOpenNode(null);
    setDelivered(false);
    setRunning(true);
    const plan = schedule(next);
    plan.forEach(([id, at]) => {
      timers.current.push(window.setTimeout(() => setStatus((s) => ({ ...s, [id]: 'running' })), at));
      timers.current.push(window.setTimeout(() => setStatus((s) => ({ ...s, [id]: 'success' })), at + STEP_MS));
    });
    const end = plan[plan.length - 1][1] + STEP_MS + 100;
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        setDelivered(true);
      }, end)
    );
  };

  const loadExecution = (idx: number) => {
    clearTimers();
    const next = inbox[idx];
    setCtx(next);
    setStatus(Object.fromEntries(schedule(next).map(([id]) => [id, 'success' as NodeStatus])));
    setRunning(false);
    setDelivered(false);
    setTab('editor');
  };

  const openOutlook = (idx = 0) => {
    setMailIdx(idx);
    setDelivered(false);
    setTab('outlook');
  };

  // Arrastrar el lienzo para desplazarse (como en n8n)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const el = canvasRef.current!;
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const el = canvasRef.current!;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
    el.scrollTop = drag.current.top - (e.clientY - drag.current.y);
  };
  const endDrag = () => (drag.current = null);

  const done = (id: string) => status[id] === 'success';

  if (!isOpen) return null;

  // Se renderiza en <body> para que ningún contenedor con transform/animación afecte al position: fixed
  if (screen === 'notice') {
    return (
      <DemoNotice
        id="sxd-notice-title"
        eyebrow="Simex · n8n + Outlook"
        title="Flujo interno con datos ficticios"
        compare={{
          before: 'Cada día alguien copiaba a mano 10 tasas desde la web oficial para pasarlas al módulo de Epicor.',
          after: `De lunes a viernes a las ${hour12} el flujo procesa las 10 monedas por separado y envía la tabla por Outlook.`,
          afterLabel: 'Con n8n',
        }}
        points={[
          <>
            Pulsa <strong>Test workflow</strong> y abre cualquier nodo para ver su configuración y su salida.
          </>,
          <>
            En la pestaña <strong>Outlook</strong> verás el correo con la tabla de las 10 tasas.
          </>,
        ]}
        actions={[{ label: 'Abrir el flujo en n8n', onClick: () => setScreen('app') }]}
        onClose={onClose}
      >
        Este flujo de n8n automatizó una tarea diaria de Contabilidad en Simex (Colombia). Es una recreación para el
        portafolio: las tasas, correos y personas que verás son <strong>ficticios</strong>.
      </DemoNotice>
    );
  }

  const node = openNode ? nodeById(openNode) : null;

  return createPortal(
    <div className="sxd-overlay" role="dialog" aria-modal="true" aria-label="Demo del flujo de n8n de tasas de cambio (datos ficticios)">
      <div className="sxd-app">
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
            <div className="sxd-tabs" role="tablist" aria-label="Vistas">
              <button role="tab" aria-selected={tab === 'editor'} onClick={() => setTab('editor')}>
                Editor
              </button>
              <button role="tab" aria-selected={tab === 'executions'} onClick={() => setTab('executions')}>
                Ejecuciones
              </button>
              <button role="tab" aria-selected={tab === 'outlook'} onClick={() => openOutlook(mailIdx)}>
                <Mail size={14} /> Outlook
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

          {tab === 'editor' && (
            <div className="sxd-editor">
              <div
                className="sxd-canvas"
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <div className="sxd-stage" style={{ width: W * zoom, height: H * zoom }}>
                  <div className="sxd-stage-inner" style={{ width: W, height: H, transform: `scale(${zoom})` }}>
                    {NOTES.map((n) => (
                      <div
                        key={n.title}
                        className={`sxd-note sxd-note--${n.tone}`}
                        style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
                      >
                        <strong>{n.title}</strong>
                        <p>{n.text}</p>
                      </div>
                    ))}

                    <svg className="sxd-edges" width={W} height={H} aria-hidden="true">
                      {EDGES.map((e) => {
                        const a = port(nodeById(e.from), 'out', e.out);
                        const b = port(nodeById(e.to), 'in', e.in);
                        const dx = Math.max(36, (b.x - a.x) / 2);
                        const ok = done(e.from) && done(e.to);
                        const showCount = ok && !nodeById(e.to).lane && !nodeById(e.from).lane;
                        const count = e.from === 'html' || e.from === 'merge' || e.from === 'if' ? ctx.rates.length : 1;
                        return (
                          <g key={`${e.from}-${e.to}`} className={ok ? 'sxd-edge sxd-edge--done' : 'sxd-edge'}>
                            <path d={`M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x - 5},${b.y}`} />
                            <polygon points={`${b.x - 8},${b.y - 4.5} ${b.x},${b.y} ${b.x - 8},${b.y + 4.5}`} />
                            <circle cx={a.x} cy={a.y} r={4} />
                            {showCount && (
                              <text x={(a.x + b.x) / 2} y={Math.min(a.y, b.y) - 8} textAnchor="middle">
                                {count} {count === 1 ? 'item' : 'items'}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Etiquetas de las salidas del Switch y del If */}
                    {CURRENCIES.map((c, i) => (
                      <span key={c.code} className="sxd-port-label" style={{ left: 690 + N + 8, top: laneY(i) + N / 2 - 17 }}>
                        {c.code}
                      </span>
                    ))}
                    <span className="sxd-port-label sxd-port-label--true" style={{ left: 1460 + N + 8, top: MID - N / 2 + 2 }}>
                      true
                    </span>
                    <span className="sxd-port-label sxd-port-label--false" style={{ left: 1460 + N + 8, top: MID - N / 2 + 46 }}>
                      false
                    </span>

                    {NODES.map((n) => {
                      const st = status[n.id] ?? 'idle';
                      const skipped = n.lane && !running && Object.keys(status).length > 0 && !has(ctx, n.lane);
                      return (
                        <button
                          key={n.id}
                          className={`sxd-node sxd-node--${st} ${n.trigger ? 'sxd-node--trigger' : ''} ${n.h ? 'sxd-node--tall' : ''} ${
                            skipped ? 'sxd-node--skipped' : ''
                          }`}
                          style={{ left: n.x, top: n.y, ['--c' as string]: n.color }}
                          onClick={() => setOpenNode(n.id)}
                          aria-label={`${n.name} (${n.kind})${st === 'success' ? ', ejecutado' : ''}`}
                        >
                          <span className="sxd-node-box" style={n.h ? { height: n.h } : undefined}>
                            {n.icon}
                            {st === 'success' && (
                              <span className="sxd-node-ok">
                                <Check size={11} strokeWidth={3} />
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
              </div>

              <div className="sxd-exec-info">
                <CalendarClock size={14} />
                Ejecución del {fmtDate(ctx.date)} · {hour12}
                {ctx.fail && <span className="sxd-exec-warn">fuente incompleta · 7/10</span>}
              </div>

              <div className="sxd-zoom">
                <button onClick={() => setZoom(fitZoom)} aria-label="Ajustar a la pantalla">
                  <Maximize size={18} />
                </button>
                <button onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} aria-label="Acercar">
                  <ZoomIn size={18} />
                </button>
                <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} aria-label="Alejar">
                  <ZoomOut size={18} />
                </button>
              </div>

              <div className="sxd-run-bar">
                <button className="sxd-btn-run sxd-btn-lg" onClick={() => run(false)} disabled={running}>
                  <FlaskConical size={18} /> {running ? 'Ejecutando…' : 'Test workflow'}
                </button>
                <button className="sxd-btn-ghost" onClick={() => run(true)} disabled={running}>
                  <CircleAlert size={16} /> Simular fuente incompleta
                </button>
              </div>

              {delivered && (
                <div className="sxd-delivered" role="status">
                  <Mail size={18} />
                  <span>
                    {ctx.fail ? 'Alerta enviada' : 'Correo con las 10 tasas entregado'} a {RECIPIENT.name}
                  </span>
                  <button onClick={() => openOutlook(0)}>Ver en Outlook</button>
                  <button className="sxd-delivered-x" onClick={() => setDelivered(false)} aria-label="Cerrar aviso">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'executions' && <ExecutionsView inbox={inbox} onOpen={loadExecution} />}
          {tab === 'outlook' && <OutlookView inbox={inbox} selected={mailIdx} onSelect={setMailIdx} />}
        </div>

        {node && <NodePanel node={node} ctx={ctx} executed={done(node.id)} onClose={() => setOpenNode(null)} />}
      </div>
    </div>,
    document.body
  );
};

/* ---------------------------------------------------------------- Ejecuciones */

const ExecutionsView: React.FC<{ inbox: Ctx[]; onOpen: (idx: number) => void }> = ({ inbox, onOpen }) => (
  <div className="sxd-execs">
    <p className="sxd-execs-sub">
      Disparo automático: <code>{CRON}</code> · America/Bogota. Abre una ejecución para verla en el editor.
    </p>
    <ul>
      {inbox.map((c, i) => (
        <li key={c.date.toISOString()}>
          <button onClick={() => onOpen(i)}>
            <span className={`sxd-exec-dot ${c.fail ? 'sxd-exec-dot--warn' : ''}`} aria-hidden="true" />
            <span className="sxd-exec-date">
              <strong>{fmtDate(c.date)}</strong>
              <span>{hour12} · 8,4 s · {schedule(c).length} nodos ejecutados</span>
            </span>
            <span className={`sxd-exec-status ${c.fail ? 'sxd-exec-status--warn' : ''}`}>
              {c.fail ? 'Alerta enviada · 7/10 tasas' : 'Correo enviado · 10/10 tasas'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

/* ---------------------------------------------------------------- Outlook */

const OutlookView: React.FC<{ inbox: Ctx[]; selected: number; onSelect: (i: number) => void }> = ({
  inbox,
  selected,
  onSelect,
}) => {
  const [showList, setShowList] = useState(false);
  const c = inbox[selected];
  return (
    <div className="sxd-outlook">
      <div className="sxd-ol-bar">
        <span className="sxd-ol-logo">
          <Mail size={16} /> Outlook
        </span>
        <span className="sxd-ol-search">
          <Search size={14} /> Buscar
        </span>
        <span className="sxd-ol-user">
          {RECIPIENT.name.split(' ').map((n) => n[0]).join('')}
        </span>
      </div>
      <div className="sxd-ol-body">
        <nav className="sxd-ol-folders" aria-label="Carpetas (demostración)">
          <span className="sxd-ol-folder sxd-ol-folder--active">
            <Inbox size={15} /> Bandeja de entrada <em>{inbox.length}</em>
          </span>
          <span className="sxd-ol-folder">Tasas de cambio</span>
          <span className="sxd-ol-folder">Enviados</span>
        </nav>

        <ul className={`sxd-ol-list ${showList ? 'sxd-ol-list--open' : ''}`}>
          {inbox.map((m, i) => (
            <li key={m.date.toISOString()}>
              <button
                className={i === selected ? 'sxd-ol-item sxd-ol-item--active' : 'sxd-ol-item'}
                onClick={() => {
                  onSelect(i);
                  setShowList(false);
                }}
              >
                <span className="sxd-ol-from">
                  Automatizaciones Contabilidad
                  <time>{m.date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</time>
                </span>
                <span className={`sxd-ol-subj ${m.fail ? 'sxd-ol-subj--alert' : ''}`}>
                  {m.fail ? alertSubject(m.date) : mailSubject(m.date)}
                </span>
                <span className="sxd-ol-snippet">
                  {m.fail ? `Faltan ${MISSING_ON_FAILURE.join(', ')} en la web oficial…` : `USD $ ${fmtCO(m.rates[0].cop)} · EUR $ ${fmtCO(m.rates[1].cop)} · …`}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sxd-ol-read">
          <button className="sxd-ol-back" onClick={() => setShowList(true)}>
            ← Bandeja de entrada
          </button>
          <EmailPreview ctx={c} />
        </div>
      </div>
    </div>
  );
};

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
  const laneMissing = node.lane && !has(ctx, node.lane);

  return (
    <div className="sxd-ndv-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sxd-ndv" role="dialog" aria-modal="true" aria-labelledby="sxd-ndv-title">
        <header className="sxd-ndv-head" style={{ ['--c' as string]: node.color }}>
          <span className="sxd-ndv-icon">{node.icon}</span>
          <div>
            <h3 id="sxd-ndv-title">{node.name}</h3>
            <span>{node.kind}</span>
          </div>
          <button ref={closeRef} className="sxd-close" onClick={onClose} aria-label="Cerrar nodo">
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
                <FlaskConical size={22} />
                {laneMissing ? (
                  <>
                    <strong>Esta rama no recibió datos</strong>
                    <span>La web oficial aún no había publicado {node.lane} en esta ejecución.</span>
                  </>
                ) : (
                  <>
                    <strong>Este nodo aún no se ha ejecutado</strong>
                    <span>Cierra el panel y pulsa «Test workflow», o abre una ejecución del historial.</span>
                  </>
                )}
              </div>
            ) : view === 'email' ? (
              <EmailPreview ctx={ctx} />
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

/* ---------------------------------------------------------------- Correo */

const EmailPreview: React.FC<{ ctx: Ctx }> = ({ ctx }) => {
  const missing = CURRENCIES.filter((c) => MISSING_ON_FAILURE.includes(c.code));
  return (
    <article className="sxd-mail">
      <h5 className="sxd-mail-subject">{ctx.fail ? alertSubject(ctx.date) : mailSubject(ctx.date)}</h5>
      <header className="sxd-mail-head">
        <span className="sxd-mail-avatar">AC</span>
        <div>
          <strong>Automatizaciones Contabilidad</strong>
          <span>
            Para: {RECIPIENT.name}
            {ctx.fail && `; ${AREA_BOSS.name}`}
          </span>
        </div>
        <time>
          {ctx.date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })} · {hour12}
        </time>
      </header>

      {ctx.fail ? (
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
            Estas son las tasas de cambio oficiales del <strong>{fmtDate(ctx.date)}</strong>, actualizadas y listas para
            cargar en el módulo de tasas de Epicor. Todas expresadas en <strong>pesos colombianos (COP)</strong>.
          </p>
          <div className="sxd-mail-table-wrap">
            <table className="sxd-mail-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Moneda</th>
                  <th>Código</th>
                  <th>1 unidad = COP</th>
                  <th>Var. día</th>
                </tr>
              </thead>
              <tbody>
                {ctx.rates.map((r, i) => (
                  <tr key={r.code}>
                    <td className="sxd-mail-idx">{i + 1}</td>
                    <td>{r.name}</td>
                    <td>
                      <code>{r.code}</code>
                    </td>
                    <td className="sxd-num">$ {fmtCO(r.cop, curr(r.code).decimals)}</td>
                    <td className={`sxd-num ${r.change >= 0 ? 'sxd-up' : 'sxd-down'}`}>
                      {r.change >= 0 ? '▲' : '▼'} {Math.abs(r.change).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sxd-mail-ok">
            <Check size={14} /> 10 de 10 tasas actualizadas · fuente: web oficial aprobada por Contabilidad
          </p>
          <p className="sxd-mail-sign">— Flujo automático de n8n · enviado a las {hour12}</p>
        </div>
      )}
    </article>
  );
};
