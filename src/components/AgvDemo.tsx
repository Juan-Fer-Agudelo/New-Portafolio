import React, { useEffect, useRef, useState } from 'react';
import { Activity, BatteryMedium, Clock, Info, MapPin, Pause, Play, Radio, Truck, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/agv-demo.css';
import { DemoNotice } from './DemoNotice';

import {
  AREAS,
  CARGO,
  EXTRA_TRACKS,
  FLEET,
  NODES,
  ROUTES,
  RouteId,
  Stop,
  geometryOf,
  nearestNode,
  pointAt,
} from './agvData';

/* Demo del mapa de trazabilidad en tiempo real de los AGVs que llevan puertas
   (Suministro Ensamble · DLI → Final) y llantas (Llantas → Final).
   Todo es una simulación con datos ficticios; ver agvData.ts. */

interface AgvDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'moving' | 'stopped' | 'waiting';
type Filter = 'all' | RouteId;

interface AgvState {
  id: string;
  cargo: (typeof FLEET)[number]['cargo'];
  route: RouteId;
  s: number;
  phase: Phase;
  stop: Stop | null;
  timer: number;
  loaded: boolean;
  battery: number;
  deliveries: number;
  lastDeliveryAt: number | null;
  cycles: number[];
}

interface LogItem {
  id: number;
  t: number;
  text: string;
  kind: 'carga' | 'entrega';
}

const SPEED = 70; // px por segundo simulado
const LOOKAHEAD = 30;
const CLEARANCE = 22;
const BASELINE = { doors: 516, tires: 148, windshields: 92 }; // entregas "del día" antes de abrir la demo

const ROUTE_IDS = Object.keys(ROUTES) as RouteId[];
const GEOM = Object.fromEntries(ROUTE_IDS.map((r) => [r, geometryOf(ROUTES[r].points)])) as Record<RouteId, ReturnType<typeof geometryOf>>;

/** "6 puertas del. der.", "4 juegos de llantas", "4 parabrisas y lunetas" */
const loadText = (cargo: AgvState['cargo']) => {
  const c = CARGO[cargo];
  return c.unit === 'puertas' ? `${c.units} puertas ${c.short.toLowerCase()}` : `${c.units} ${c.unit}`;
};
const stopDistance = (route: RouteId, st: Stop) => GEOM[route].cum[st.at];

const initialFleet = (): AgvState[] =>
  FLEET.map((f) => {
    const g = GEOM[f.route];
    const s = f.start * g.total;
    // Los que ya pasaron la carga y aún no llegan a la entrega van cargados
    const entrega = stopDistance(f.route, ROUTES[f.route].stops[1]);
    return {
      id: f.id,
      cargo: f.cargo,
      route: f.route,
      s,
      phase: 'moving',
      stop: null,
      timer: 0,
      loaded: s < entrega,
      battery: 62 + Math.round(f.start * 35),
      deliveries: 0,
      lastDeliveryAt: null,
      cycles: [],
    };
  });

const fmtClock = (base: number, t: number) =>
  new Date(base + t * 1000).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const statusOf = (a: AgvState) => {
  if (a.phase === 'stopped') return a.stop?.kind === 'carga' ? 'Cargando' : 'Descargando en Final';
  if (a.phase === 'waiting') return 'Esperando paso';
  return a.loaded ? 'En ruta a Final' : 'Retornando vacío';
};

/** Versión corta del estado para la lista de la flota (el detalle muestra la completa) */
const statusShort = (a: AgvState) => {
  if (a.phase === 'stopped') return a.stop?.kind === 'carga' ? 'Cargando' : 'Descargando';
  if (a.phase === 'waiting') return 'Esperando';
  return a.loaded ? 'En ruta' : 'Retornando';
};

export const AgvDemo: React.FC<AgvDemoProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'notice' | 'app'>('notice');
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [, setFrame] = useState(0);
  const fleet = useRef<AgvState[]>(initialFleet());
  const log = useRef<LogItem[]>([]);
  const simT = useRef(0);
  const baseTime = useRef(Date.now());
  const logId = useRef(0);
  const ctrl = useRef({ running, speed });
  ctrl.current = { running, speed };
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    setScreen('notice');
    setRunning(true);
    setSpeed(1);
    setFilter('all');
    setSelected(null);
    fleet.current = initialFleet();
    log.current = [];
    simT.current = 0;
    baseTime.current = Date.now();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Bucle de simulación: avanza cada AGV, respeta distancias y paradas
  useEffect(() => {
    if (!isOpen || screen !== 'app') return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const real = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (ctrl.current.running) {
        // Subpasos para que a velocidad x4 las paradas y distancias sigan siendo precisas
        const steps = ctrl.current.speed;
        for (let k = 0; k < steps; k++) step(real);
        setFrame((f) => (f + 1) % 1_000_000);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, screen]);

  const pushLog = (text: string, kind: LogItem['kind']) => {
    log.current = [{ id: ++logId.current, t: simT.current, text, kind }, ...log.current].slice(0, 40);
  };

  const step = (dt: number) => {
    simT.current += dt;
    const agvs = fleet.current;
    const pos = agvs.map((a) => pointAt(ROUTES[a.route].points, GEOM[a.route], a.s));

    // ¿Qué AGVs tienen a otro justo delante?
    const blockedBy = agvs.map((a, i) => {
      const g = GEOM[a.route];
      const ahead = pointAt(ROUTES[a.route].points, g, a.s + LOOKAHEAD);
      return agvs.findIndex((_, j) => {
        if (j === i) return false;
        const dAhead = Math.hypot(pos[j].x - ahead.x, pos[j].y - ahead.y);
        const dSelf = Math.hypot(pos[j].x - pos[i].x, pos[j].y - pos[i].y);
        return dAhead < CLEARANCE && dSelf > dAhead;
      });
    });

    agvs.forEach((a, i) => {
      if (a.phase === 'stopped') {
        a.timer -= dt;
        if (a.timer > 0) return;
        const st = a.stop!;
        if (st.kind === 'carga') {
          a.loaded = true;
          a.battery = Math.min(100, a.battery + 9);
          pushLog(`${a.id} cargó ${loadText(a.cargo)} en ${st.label}`, 'carga');
        } else {
          a.loaded = false;
          a.deliveries += 1;
          if (a.lastDeliveryAt !== null) a.cycles = [...a.cycles.slice(-4), simT.current - a.lastDeliveryAt];
          a.lastDeliveryAt = simT.current;
          pushLog(`${a.id} entregó ${loadText(a.cargo)} en ${st.label}`, 'entrega');
        }
        a.phase = 'moving';
        a.stop = null;
        a.s += 0.5;
        return;
      }

      const blocker = blockedBy[i];
      // Si dos AGVs se bloquean mutuamente en un cruce, pasa el de menor número
      if (blocker !== -1 && !(blockedBy[blocker] === i && i < blocker)) {
        a.phase = 'waiting';
        return;
      }

      a.phase = 'moving';
      const g = GEOM[a.route];
      const from = a.s % g.total;
      const to = from + SPEED * dt;
      const hit = ROUTES[a.route].stops.find((st) => {
        const d = stopDistance(a.route, st);
        return (from < d && to >= d) || (from < d + g.total && to >= d + g.total);
      });
      a.battery = Math.max(15, a.battery - dt * 0.12);
      if (hit) {
        a.s = stopDistance(a.route, hit);
        a.phase = 'stopped';
        a.stop = hit;
        a.timer = hit.seconds;
      } else {
        a.s = to % g.total;
      }
    });
  };

  const agvs = fleet.current;
  const doorsDelivered = BASELINE.doors + agvs.filter((a) => a.route === 'puertas').reduce((n, a) => n + a.deliveries * 6, 0);
  const tiresDelivered = BASELINE.tires + agvs.filter((a) => a.route === 'llantas').reduce((n, a) => n + a.deliveries, 0);
  const windshieldsDelivered =
    BASELINE.windshields + agvs.filter((a) => a.route === 'parabrisas').reduce((n, a) => n + a.deliveries * 4, 0);
  const allCycles = agvs.flatMap((a) => a.cycles);
  const avgCycle = allCycles.length ? allCycles.reduce((x, y) => x + y, 0) / allCycles.length : 0;
  const moving = agvs.filter((a) => a.phase === 'moving').length;
  const sel = agvs.find((a) => a.id === selected) ?? null;

  if (!isOpen) return null;

  if (screen === 'notice') {
    return (
      <DemoNotice
        id="agd-notice-title"
        eyebrow="Renault Sofasa · Ensamble"
        title="Mapa en tiempo real con datos ficticios"
        points={[
          'AGVs de puertas: llevan puertas delanteras y traseras, izquierdas y derechas, desde Suministro Ensamble (UET del DLI) hasta Final.',
          'AGVs de llantas: llevan los juegos de llantas desde la zona de Llantas hasta Final.',
          'AGVs de parabrisas: llevan parabrisas y lunetas desde la zona de Parabrisas-Lunetas hasta Final.',
          'Haz clic en un AGV para seguirlo; pausa o acelera la simulación desde los controles del mapa.',
        ]}
        actions={[{ label: 'Abrir el mapa', onClick: () => setScreen('app') }]}
        onClose={onClose}
      >
        Este mapa se hizo junto con el equipo de fabricación de Ensamble de Renault Sofasa para seguir en tiempo real a los
        AGVs. Es una recreación para el portafolio: el plano está simplificado y los AGVs, entregas y tiempos que verás son{' '}
        <strong>ficticios</strong>.
      </DemoNotice>
    );
  }

  const dim = (route: RouteId) => filter !== 'all' && filter !== route;
  const clock = fmtClock(baseTime.current, simT.current);

  return createPortal(
    <div className="agd-overlay" role="dialog" aria-modal="true" aria-label="Demo del mapa de trazabilidad de AGVs (datos ficticios)">
      <div className="agd-app">
        <header className="agd-bar">
          <span className="agd-logo" aria-hidden="true">
            <Radio size={18} />
          </span>
          <div className="agd-bar-title">
            <strong>Trazabilidad de AGVs · Ensamble</strong>
            <span>Planta Envigado · mapa en tiempo real</span>
          </div>
          <span className="agd-badge">
            <Info size={13} /> Datos ficticios
          </span>
          <span className={`agd-live ${running ? '' : 'agd-live--paused'}`}>
            <span className="agd-live-dot" aria-hidden="true" /> {running ? 'EN VIVO' : 'PAUSADO'} · {clock}
          </span>
          <button className="agd-close" onClick={onClose} aria-label="Cerrar demostración">
            <X size={18} />
          </button>
        </header>

        <section className="agd-kpis" aria-label="Indicadores en tiempo real">
          <div className="agd-kpi">
            <span>
              <Truck size={14} /> AGVs en movimiento
            </span>
            <strong>
              {moving} <small>/ {agvs.length}</small>
            </strong>
          </div>
          <div className="agd-kpi">
            <span>
              <MapPin size={14} /> Puertas entregadas a Final
            </span>
            <strong>{doorsDelivered.toLocaleString('es-CO')}</strong>
          </div>
          <div className="agd-kpi">
            <span>
              <MapPin size={14} /> Juegos de llantas entregados
            </span>
            <strong>{tiresDelivered.toLocaleString('es-CO')}</strong>
          </div>
          <div className="agd-kpi">
            <span>
              <MapPin size={14} /> Parabrisas y lunetas entregados
            </span>
            <strong>{windshieldsDelivered.toLocaleString('es-CO')}</strong>
          </div>
          <div className="agd-kpi">
            <span>
              <Clock size={14} /> Ciclo promedio por AGV
            </span>
            <strong>{avgCycle ? `${Math.floor(avgCycle / 60)}:${String(Math.round(avgCycle % 60)).padStart(2, '0')} min` : 'Calculando…'}</strong>
          </div>
        </section>

        <div className="agd-main">
          <section className="agd-map-card">
            <div className="agd-map-head">
              <div className="agd-seg" role="group" aria-label="Filtrar AGVs">
                {(
                  [
                    ['all', 'Todos'],
                    ['puertas', 'Puertas'],
                    ['llantas', 'Llantas'],
                    ['parabrisas', 'Parabrisas'],
                  ] as [Filter, string][]
                ).map(([f, l]) => (
                  <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="agd-controls">
                <button className="agd-play" onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pausar' : 'Reanudar'}>
                  {running ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="agd-seg" role="group" aria-label="Velocidad">
                  {[1, 2, 4].map((v) => (
                    <button key={v} aria-pressed={speed === v} onClick={() => setSpeed(v)}>
                      x{v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="agd-map-scroll">
              <svg className="agd-map" viewBox="0 0 1160 660" role="img" aria-label="Plano de Ensamble con la posición de cada AGV">
                <rect width="1160" height="660" fill="#ffffff" />
                {AREAS.map((a, i) => (
                  <g
                    key={i}
                    className={`agd-area agd-area--${a.tone} ${a.target ? 'agd-area--target' : ''} ${a.source ? `agd-area--src-${a.source}` : ''}`}
                  >
                    <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={a.tone === 'black' ? 3 : 2} />
                    {a.label &&
                      (a.vertical ? (
                        <text
                          x={a.x + a.w / 2}
                          y={a.y + a.h / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(90 ${a.x + a.w / 2} ${a.y + a.h / 2})`}
                        >
                          {a.label}
                        </text>
                      ) : (
                        <text x={a.x + a.w / 2} y={a.y + a.h / 2} textAnchor="middle">
                          {a.label.split('\n').map((part, k, arr) => (
                            <tspan key={k} x={a.x + a.w / 2} dy={k === 0 ? `${-(arr.length - 1) * 0.6 + 0.35}em` : '1.2em'}>
                              {part}
                            </tspan>
                          ))}
                        </text>
                      ))}
                  </g>
                ))}

                {EXTRA_TRACKS.map((t, i) => (
                  <polyline key={i} points={t.map((p) => p.join(',')).join(' ')} className="agd-track agd-track--extra" />
                ))}
                {ROUTE_IDS.map((r) => (
                  <polygon
                    key={r}
                    points={ROUTES[r].points.map((p) => p.join(',')).join(' ')}
                    className={`agd-track agd-track--${r} ${dim(r) ? 'agd-dim' : ''}`}
                  />
                ))}

                {NODES.map((n) => (
                  <g key={n.id} className="agd-node">
                    <circle cx={n.x} cy={n.y} r={4} />
                    <text x={n.x} y={n.y > 200 ? n.y + 14 : n.y - 8} textAnchor="middle">
                      {n.id}
                    </text>
                  </g>
                ))}

                {/* Muelles de carga y estaciones de entrega */}
                {ROUTE_IDS.map((r) =>
                  ROUTES[r].stops.map((st) => {
                    const [x, y] = ROUTES[r].points[st.at];
                    return (
                      <g key={`${r}-${st.at}`} className={`agd-stop agd-stop--${st.kind} ${dim(r) ? 'agd-dim' : ''}`}>
                        <rect x={x - 9} y={y - 9} width={18} height={18} rx={4} />
                        <text x={x} y={y + 4} textAnchor="middle">
                          {st.kind === 'carga' ? 'C' : 'E'}
                        </text>
                      </g>
                    );
                  })
                )}

                {/* AGVs */}
                {agvs.map((a) => {
                  const p = pointAt(ROUTES[a.route].points, GEOM[a.route], a.s);
                  const isSel = selected === a.id;
                  return (
                    <g
                      key={a.id}
                      className={`agd-agv agd-agv--${a.route} ${a.loaded ? 'agd-agv--loaded' : ''} ${dim(a.route) ? 'agd-dim' : ''}`}
                      transform={`translate(${p.x} ${p.y})`}
                      onClick={() => setSelected(isSel ? null : a.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${a.id}, ${CARGO[a.cargo].label}, ${statusOf(a)}`}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(isSel ? null : a.id)}
                    >
                      {isSel && <circle r={20} className="agd-agv-ring" />}
                      {a.phase === 'waiting' && <circle r={15} className="agd-agv-wait" />}
                      <g transform={`rotate(${p.angle})`}>
                        <rect x={-13} y={-8} width={26} height={16} rx={4} className="agd-agv-body" />
                        <path d="M9,-4 L13,0 L9,4" className="agd-agv-nose" />
                      </g>
                      <text y={-14} textAnchor="middle" className="agd-agv-label">
                        {a.id.slice(4)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="agd-legend">
              <span>
                <i className="agd-sw agd-sw--puertas" /> AGV de puertas
              </span>
              <span>
                <i className="agd-sw agd-sw--llantas" /> AGV de llantas
              </span>
              <span>
                <i className="agd-sw agd-sw--parabrisas" /> AGV de parabrisas
              </span>
              <span>
                <i className="agd-sw agd-sw--empty" /> Vacío (borde) · relleno = cargado
              </span>
              <span>
                <i className="agd-sw agd-sw--carga">C</i> Carga · <i className="agd-sw agd-sw--entrega">E</i> Entrega en Final
              </span>
            </div>
          </section>

          <aside className="agd-side">
            {sel ? (
              <section className="agd-panel agd-detail">
                <div className="agd-panel-head">
                  <h3>{sel.id}</h3>
                  <button className="agd-link" onClick={() => setSelected(null)}>
                    Ver flota
                  </button>
                </div>
                <dl>
                  <div>
                    <dt>Carga</dt>
                    <dd>{CARGO[sel.cargo].label}</dd>
                  </div>
                  <div>
                    <dt>Ruta</dt>
                    <dd>{ROUTES[sel.route].name}</dd>
                  </div>
                  <div>
                    <dt>Estado</dt>
                    <dd>
                      <span className={`agd-status agd-status--${sel.phase}`}>{statusOf(sel)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Último nodo</dt>
                    <dd>
                      {(() => {
                        const p = pointAt(ROUTES[sel.route].points, GEOM[sel.route], sel.s);
                        return nearestNode(p.x, p.y).id;
                      })()}
                    </dd>
                  </div>
                  <div>
                    <dt>Batería</dt>
                    <dd>
                      <span className="agd-battery">
                        <span style={{ width: `${sel.battery}%` }} />
                      </span>{' '}
                      {Math.round(sel.battery)} %
                    </dd>
                  </div>
                  <div>
                    <dt>Entregas en esta sesión</dt>
                    <dd>{sel.deliveries}</dd>
                  </div>
                </dl>
              </section>
            ) : (
              <section className="agd-panel">
                <div className="agd-panel-head">
                  <h3>
                    <Activity size={16} /> Flota
                  </h3>
                  <span className="agd-muted">Clic para seguir</span>
                </div>
                <ul className="agd-fleet">
                  {agvs.map((a) => (
                    <li key={a.id} className={dim(a.route) ? 'agd-dim' : ''}>
                      <button onClick={() => setSelected(a.id)} title={`${a.id} · ${CARGO[a.cargo].label} · ${statusOf(a)}`}>
                        <i className={`agd-sw agd-sw--${a.route} ${a.loaded ? '' : 'agd-sw--hollow'}`} />
                        <span className="agd-fleet-id">{a.id}</span>
                        <span className="agd-fleet-cargo">{CARGO[a.cargo].short}</span>
                        <span className={`agd-status agd-status--${a.phase} ${!a.loaded && a.phase === 'moving' ? 'agd-status--empty' : ''}`}>
                          {statusShort(a)}
                        </span>
                        <span className="agd-fleet-bat">
                          <BatteryMedium size={13} aria-hidden="true" /> {Math.round(a.battery)}%
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="agd-panel agd-log-panel">
              <div className="agd-panel-head">
                <h3>Eventos</h3>
                <span className="agd-muted">{log.current.length ? 'Últimos movimientos' : 'Esperando la primera entrega…'}</span>
              </div>
              <ul className="agd-log" aria-live="polite">
                {log.current.slice(0, 12).map((l) => (
                  <li key={l.id} className={`agd-log-item agd-log-item--${l.kind}`}>
                    <time>{fmtClock(baseTime.current, l.t)}</time>
                    <span>{l.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>,
    document.body
  );
};
