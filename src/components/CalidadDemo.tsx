import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, BarChart3, Car, ChevronRight, Database, Flame, Info, LayoutDashboard, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/calidad-demo.css';
import { DemoNotice } from './DemoNotice';

import {
  DATA,
  DEFECT_TYPES,
  DPU_TARGET,
  DefectRecord,
  DefectType,
  SHIFT_HOURS,
  Shift,
  UETS,
  UetId,
  ZONES,
  Zone,
  fmtNum,
  fmtShortDate,
} from './calidadData';

/* Demo del reporte de Looker Studio de calidad de pintura (Renault Sofasa):
   indicadores clave y mapa de calor de las 4 UET de Ensamble.
   Todos los datos son ficticios; ver calidadData.ts. */

interface CalidadDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type Page = 'kpis' | 'heatmap';
type Period = 7 | 30 | 90;
type Cross = 'zone' | 'type' | 'hour';

interface Filters {
  period: Period;
  shift: Shift | 0;
  uet: UetId | '';
  type: DefectType | '';
}

interface Tip {
  x: number;
  y: number;
  content: React.ReactNode;
}
type SetTip = (t: Tip | null) => void;

// Rampa secuencial de un solo tono (naranja → rojo oscuro): más oscuro = más defectos
const HEAT = ['#fdeee6', '#fcd3bd', '#f9b391', '#f48d62', '#e8683b', '#cc4b22', '#a33716', '#7a2810'];
const heatColor = (v: number, max: number) => (v <= 0 ? '#f6f6f4' : HEAT[Math.min(HEAT.length - 1, Math.floor((v / max) * HEAT.length))]);
const heatInk = (v: number, max: number) => (v / max > 0.5 ? '#fff' : '#3c2a22');

const uetName = (id: UetId) => UETS.find((u) => u.id === id)!.name;

/** Ancho disponible de un contenedor (los gráficos se dibujan en SVG a su tamaño real) */
const useWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
};

/** true en pantallas angostas (celular), y se actualiza si cambia el tamaño */
const useNarrow = (query = '(max-width: 600px)') => {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return narrow;
};

/** Datos del periodo actual y del anterior (para comparar los indicadores) */
const slice = (f: Filters, offset: number) => {
  const days = DATA.days.slice(DATA.days.length - f.period * (offset + 1), DATA.days.length - f.period * offset);
  const from = days[0].getTime();
  const to = days[days.length - 1].getTime();
  const inRange = (d: Date) => d.getTime() >= from && d.getTime() <= to;
  const production = DATA.production.filter((p) => inRange(p.date) && (!f.shift || p.shift === f.shift));
  const defects = DATA.defects.filter(
    (d) => inRange(d.date) && (!f.shift || d.shift === f.shift) && (!f.uet || d.uet === f.uet) && (!f.type || d.type === f.type)
  );
  return { days, production, defects };
};

const kpisOf = (s: ReturnType<typeof slice>) => {
  const vehicles = s.production.reduce((a, p) => a + p.vehicles, 0);
  // Vehículos con al menos un defecto, estimados por turno
  const byShift = new Map<string, number>();
  s.defects.forEach((d) => byShift.set(`${d.iso}-${d.shift}`, (byShift.get(`${d.iso}-${d.shift}`) ?? 0) + 1));
  const defective = s.production.reduce((a, p) => {
    const k = byShift.get(`${p.iso}-${p.shift}`) ?? 0;
    return a + p.vehicles * (1 - Math.pow(1 - 1 / p.vehicles, k));
  }, 0);
  return {
    vehicles,
    defects: s.defects.length,
    dpu: vehicles ? s.defects.length / vehicles : 0,
    ftt: vehicles ? (1 - defective / vehicles) * 100 : 0,
    critical: s.defects.filter((d) => d.severity === 'Crítico').length,
  };
};

const countBy = <K extends string | number>(items: DefectRecord[], key: (d: DefectRecord) => K) => {
  const m = new Map<K, number>();
  items.forEach((d) => m.set(key(d), (m.get(key(d)) ?? 0) + 1));
  return m;
};

export const CalidadDemo: React.FC<CalidadDemoProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'notice' | 'app'>('notice');
  const [page, setPage] = useState<Page>('kpis');
  const [filters, setFilters] = useState<Filters>({ period: 30, shift: 0, uet: '', type: '' });
  const [tip, setTip] = useState<Tip | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    setScreen('notice');
    setPage('kpis');
    setFilters({ period: 30, shift: 0, uet: '', type: '' });
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

  const current = useMemo(() => slice(filters, 0), [filters]);
  const previous = useMemo(() => slice(filters, 1), [filters]);

  if (!isOpen) return null;

  if (screen === 'notice') {
    return (
      <DemoNotice
        id="cqd-notice-title"
        eyebrow="Renault Sofasa · Looker Studio"
        title="Reporte interno con datos ficticios"
        points={[
          'Página 1: indicadores clave de calidad de pintura (DPU, FTT, defectos críticos, Pareto y tendencia).',
          'Página 2: mapa de calor de dónde aparecen los defectos en las 4 UET de Ensamble: Trim, Mecánica, Final y Entregas.',
          'Usa los filtros de periodo, turno, UET y tipo de defecto; pasa el mouse sobre los gráficos para ver el detalle.',
        ]}
        actions={[{ label: 'Abrir el reporte', onClick: () => setScreen('app') }]}
        onClose={onClose}
      >
        Este reporte de Looker Studio se construyó para el departamento de Pintura de Renault Sofasa. Es una recreación
        para el portafolio: todos los vehículos, defectos y cifras que verás son <strong>ficticios</strong>.
      </DemoNotice>
    );
  }

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters((f) => ({ ...f, [k]: v }));
  const range = `${fmtShortDate(current.days[0])} – ${fmtShortDate(current.days[current.days.length - 1])}`;

  return createPortal(
    <div className="cqd-overlay" role="dialog" aria-modal="true" aria-label="Demo del reporte de calidad en Looker Studio (datos ficticios)">
      <div className="cqd-app">
        <header className="cqd-bar">
          <span className="cqd-ls-logo" aria-hidden="true">
            <BarChart3 size={18} />
          </span>
          <div className="cqd-bar-title">
            <strong>Calidad de pintura · Ensamble</strong>
            <span>Looker Studio</span>
          </div>
          <span className="cqd-badge">
            <Info size={13} /> Datos ficticios
          </span>
          <span className="cqd-source">
            <Database size={14} /> calidad_pintura (ficticia)
          </span>
          <button className="cqd-close" onClick={onClose} aria-label="Cerrar demostración">
            <X size={18} />
          </button>
        </header>

        <div className="cqd-body">
          <nav className="cqd-pages" aria-label="Páginas del reporte">
            <button className={page === 'kpis' ? 'cqd-page cqd-page--active' : 'cqd-page'} onClick={() => setPage('kpis')}>
              <LayoutDashboard size={16} /> <span className="cqd-page-long">1 · Indicadores de pintura</span>
              <span className="cqd-page-short">Indicadores</span>
            </button>
            <button className={page === 'heatmap' ? 'cqd-page cqd-page--active' : 'cqd-page'} onClick={() => setPage('heatmap')}>
              <Flame size={16} /> <span className="cqd-page-long">2 · Mapa de calor UET</span>
              <span className="cqd-page-short">Mapa de calor</span>
            </button>
          </nav>

          <main className="cqd-scroll">
            <div className="cqd-report">
              <div className="cqd-report-head">
                <div>
                  <h2>{page === 'kpis' ? 'Indicadores clave · Calidad de pintura' : 'Mapa de calor · Defectos en las UET de Ensamble'}</h2>
                  <p>
                    Planta Envigado · {range} · {current.days.length} días hábiles
                  </p>
                </div>
              </div>

              {/* Controles de filtro en una sola fila, como en Looker Studio */}
              <div className="cqd-filters">
                <div className="cqd-seg" role="group" aria-label="Periodo">
                  {([7, 30, 90] as Period[]).map((p) => (
                    <button key={p} aria-pressed={filters.period === p} onClick={() => set('period', p)}>
                      {p} días
                    </button>
                  ))}
                </div>
                <label>
                  <span>Turno</span>
                  <select value={filters.shift} onChange={(e) => set('shift', Number(e.target.value) as Shift | 0)}>
                    <option value={0}>Todos</option>
                    <option value={1}>Turno 1</option>
                    <option value={2}>Turno 2</option>
                  </select>
                </label>
                <label>
                  <span>UET</span>
                  <select value={filters.uet} onChange={(e) => set('uet', e.target.value as UetId | '')}>
                    <option value="">Todas</option>
                    {UETS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Tipo de defecto</span>
                  <select value={filters.type} onChange={(e) => set('type', e.target.value as DefectType | '')}>
                    <option value="">Todos</option>
                    {DEFECT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              {page === 'kpis' ? (
                <KpiPage current={current} previous={previous} filters={filters} setTip={setTip} />
              ) : (
                <HeatmapPage current={current} filters={filters} setTip={setTip} onUet={(u) => set('uet', u)} />
              )}
            </div>
          </main>
        </div>

        {tip && (
          <div
            className="cqd-tip"
            style={{ left: Math.min(tip.x + 14, window.innerWidth - 260), top: Math.min(tip.y + 16, window.innerHeight - 110) }}
            role="tooltip"
          >
            {tip.content}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

/* ---------------------------------------------------------------- Página 1: indicadores */

const KpiPage: React.FC<{
  current: ReturnType<typeof slice>;
  previous: ReturnType<typeof slice>;
  filters: Filters;
  setTip: SetTip;
}> = ({ current, previous, filters, setTip }) => {
  const k = kpisOf(current);
  const p = kpisOf(previous);

  // En calidad, que la DPU o los defectos bajen es bueno
  const cards: { label: string; value: string; delta: number; goodWhenDown: boolean; note?: string }[] = [
    { label: 'Vehículos inspeccionados', value: fmtNum(k.vehicles), delta: k.vehicles - p.vehicles, goodWhenDown: false },
    { label: 'Defectos de pintura', value: fmtNum(k.defects), delta: k.defects - p.defects, goodWhenDown: true },
    {
      label: 'DPU (defectos por unidad)',
      value: fmtNum(k.dpu, 3),
      delta: k.dpu - p.dpu,
      goodWhenDown: true,
      note: `Meta ${fmtNum(DPU_TARGET, 2)}`,
    },
    { label: 'FTT (sin retoque)', value: `${fmtNum(k.ftt, 1)} %`, delta: k.ftt - p.ftt, goodWhenDown: false },
    { label: 'Defectos críticos', value: fmtNum(k.critical), delta: k.critical - p.critical, goodWhenDown: true },
  ];

  const daily = current.days.map((d) => {
    const prod = current.production.filter((x) => x.date.getTime() === d.getTime()).reduce((a, x) => a + x.vehicles, 0);
    const def = current.defects.filter((x) => x.date.getTime() === d.getTime()).length;
    return { date: d, vehicles: prod, defects: def, dpu: prod ? def / prod : 0 };
  });

  const byType = [...countBy(current.defects, (d) => d.type).entries()].sort((a, b) => b[1] - a[1]);
  const byUet = UETS.map((u) => ({ name: u.name, value: current.defects.filter((d) => d.uet === u.id).length }));
  const recent = [...current.defects].sort((a, b) => b.date.getTime() - a.date.getTime() || b.hour - a.hour).slice(0, 10);

  return (
    <>
      <section className="cqd-cards" aria-label="Indicadores">
        {cards.map((c) => {
          const flat = Math.abs(c.delta) < 1e-9;
          const good = flat ? null : c.delta < 0 === c.goodWhenDown;
          const prevVal = c.label.startsWith('DPU') ? fmtNum(Math.abs(c.delta), 3) : c.label.startsWith('FTT') ? `${fmtNum(Math.abs(c.delta), 1)} pp` : fmtNum(Math.abs(c.delta));
          return (
            <div key={c.label} className="cqd-card">
              <span className="cqd-card-label">{c.label}</span>
              <strong className="cqd-card-value">{c.value}</strong>
              <span className={`cqd-delta ${good === null ? '' : good ? 'cqd-delta--good' : 'cqd-delta--bad'}`}>
                {!flat && (c.delta < 0 ? <ArrowDown size={13} /> : <ArrowUp size={13} />)}
                {flat ? 'Sin cambio' : `${prevVal} vs. periodo anterior`}
              </span>
              {c.note && <span className="cqd-card-note">{c.note}</span>}
            </div>
          );
        })}
      </section>

      <section className="cqd-panel">
        <h3>DPU diaria vs. meta</h3>
        <p className="cqd-panel-sub">Defectos de pintura por vehículo inspeccionado. Más bajo es mejor.</p>
        <TrendChart data={daily} setTip={setTip} />
      </section>

      <div className="cqd-grid-2">
        <section className="cqd-panel">
          <h3>Pareto de defectos por tipo</h3>
          <p className="cqd-panel-sub">Los primeros tipos explican la mayor parte de los defectos.</p>
          <ParetoBars rows={byType} setTip={setTip} />
        </section>
        <section className="cqd-panel">
          <h3>Defectos por UET de Ensamble</h3>
          <p className="cqd-panel-sub">{filters.uet ? `Filtrado: ${uetName(filters.uet)}` : 'En el orden de la línea de ensamble.'}</p>
          <HBars rows={byUet} total={current.defects.length} setTip={setTip} />
        </section>
      </div>

      <section className="cqd-panel">
        <h3>Últimos defectos registrados</h3>
        <div className="cqd-table-wrap">
          <table className="cqd-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Turno</th>
                <th>VIN</th>
                <th>UET</th>
                <th>Zona</th>
                <th>Tipo</th>
                <th>Severidad</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((d) => (
                <tr key={d.id}>
                  {/* data-label: en celular cada fila se muestra como tarjeta */}
                  <td className="cqd-td-date">
                    {fmtShortDate(d.date)} · {SHIFT_HOURS[d.hour]}
                  </td>
                  <td data-label="Turno">T{d.shift}</td>
                  <td className="cqd-mono" data-label="VIN">
                    {d.vin}
                  </td>
                  <td data-label="UET">{uetName(d.uet)}</td>
                  <td data-label="Zona">{d.zone}</td>
                  <td data-label="Tipo">{d.type}</td>
                  <td className="cqd-td-sev">
                    <span className={`cqd-sev cqd-sev--${d.severity === 'Crítico' ? 'crit' : d.severity === 'Mayor' ? 'major' : 'minor'}`}>
                      {d.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && <p className="cqd-empty">No hay defectos con estos filtros.</p>}
        </div>
      </section>
    </>
  );
};

const TrendChart: React.FC<{ data: { date: Date; vehicles: number; defects: number; dpu: number }[]; setTip: SetTip }> = ({
  data,
  setTip,
}) => {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const h = 240;
  const m = { t: 14, r: 16, b: 28, l: 44 };
  const iw = Math.max(10, width - m.l - m.r);
  const ih = h - m.t - m.b;
  const max = Math.max(DPU_TARGET * 1.6, ...data.map((d) => d.dpu)) * 1.08;
  const x = (i: number) => m.l + (data.length < 2 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => m.t + ih - (v / max) * ih;
  const ticks = [0, max / 3, (2 * max) / 3].map((v) => Math.round(v * 100) / 100);
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.dpu)}`).join(' ');
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(iw / 70)));

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = (e.currentTarget as SVGRectElement).getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left) / rect.width) * (data.length - 1));
    const idx = Math.max(0, Math.min(data.length - 1, i));
    const d = data[idx];
    setHover(idx);
    setTip({
      x: e.clientX,
      y: e.clientY,
      content: (
        <>
          <strong>{d.date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
          <span>
            DPU <b>{fmtNum(d.dpu, 3)}</b> {d.dpu <= DPU_TARGET ? '· dentro de la meta' : '· sobre la meta'}
          </span>
          <span>
            {fmtNum(d.defects)} defectos / {fmtNum(d.vehicles)} vehículos
          </span>
        </>
      ),
    });
  };

  return (
    <div ref={ref} className="cqd-chart">
      <svg width={width} height={h} role="img" aria-label="Tendencia diaria de la DPU frente a la meta">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={m.l + iw} y1={y(t)} y2={y(t)} className="cqd-grid" />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" className="cqd-axis">
              {fmtNum(t, 2)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={h - 8} textAnchor="middle" className="cqd-axis">
              {fmtShortDate(d.date)}
            </text>
          ) : null
        )}
        <line x1={m.l} x2={m.l + iw} y1={y(DPU_TARGET)} y2={y(DPU_TARGET)} className="cqd-target" />
        <text x={m.l + iw} y={y(DPU_TARGET) - 6} textAnchor="end" className="cqd-target-label">
          Meta {fmtNum(DPU_TARGET, 2)}
        </text>
        <path d={line} className="cqd-line" />
        {hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={m.t + ih} className="cqd-crosshair" />
            <circle cx={x(hover)} cy={y(data[hover].dpu)} r={5} className="cqd-dot" />
          </>
        )}
        <rect
          x={m.l}
          y={m.t}
          width={iw}
          height={ih}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => {
            setHover(null);
            setTip(null);
          }}
        />
      </svg>
    </div>
  );
};

const ParetoBars: React.FC<{ rows: [string, number][]; setTip: SetTip }> = ({ rows, setTip }) => {
  const total = rows.reduce((a, r) => a + r[1], 0);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  let acc = 0;
  return (
    <div className="cqd-hbars">
      {rows.map(([name, v]) => {
        acc += v;
        const cum = (acc / total) * 100;
        return (
          <div
            key={name}
            className="cqd-hbar"
            onPointerMove={(e) =>
              setTip({
                x: e.clientX,
                y: e.clientY,
                content: (
                  <>
                    <strong>{name}</strong>
                    <span>
                      <b>{fmtNum(v)}</b> defectos · {fmtNum((v / total) * 100, 1)} %
                    </span>
                    <span>Acumulado: {fmtNum(cum, 1)} %</span>
                  </>
                ),
              })
            }
            onPointerLeave={() => setTip(null)}
          >
            <span className="cqd-hbar-name">{name}</span>
            <span className="cqd-hbar-track">
              <span className={`cqd-hbar-fill ${cum <= 80 ? '' : 'cqd-hbar-fill--muted'}`} style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <span className="cqd-hbar-val">
              {fmtNum(v)} <em>{fmtNum(cum, 0)} %</em>
            </span>
          </div>
        );
      })}
      {rows.length === 0 && <p className="cqd-empty">Sin datos.</p>}
      <p className="cqd-legend-note">
        <span className="cqd-swatch" /> Tipos dentro del 80 % acumulado <span className="cqd-swatch cqd-swatch--muted" /> Resto
      </p>
    </div>
  );
};

const HBars: React.FC<{ rows: { name: string; value: number }[]; total: number; setTip: SetTip }> = ({ rows, total, setTip }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="cqd-hbars">
      {rows.map((r) => (
          <div
            key={r.name}
            className="cqd-hbar"
            onPointerMove={(e) =>
              setTip({
                x: e.clientX,
                y: e.clientY,
                content: (
                  <>
                    <strong>UET {r.name}</strong>
                    <span>
                      <b>{fmtNum(r.value)}</b> defectos · {total ? fmtNum((r.value / total) * 100, 1) : 0} % del total
                    </span>
                  </>
                ),
              })
            }
            onPointerLeave={() => setTip(null)}
          >
            <span className="cqd-hbar-name">{r.name}</span>
            <span className="cqd-hbar-track">
              <span className="cqd-hbar-fill" style={{ width: `${(r.value / max) * 100}%` }} />
            </span>
            <span className="cqd-hbar-val">
              {fmtNum(r.value)} <em>{total ? fmtNum((r.value / total) * 100, 0) : 0} %</em>
            </span>
          </div>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- Página 2: mapa de calor */

const CROSS_LABEL: Record<Cross, string> = { zone: 'Zona del vehículo', type: 'Tipo de defecto', hour: 'Hora del turno' };

const HeatmapPage: React.FC<{
  current: ReturnType<typeof slice>;
  filters: Filters;
  setTip: SetTip;
  onUet: (u: UetId | '') => void;
}> = ({ current, filters, setTip, onUet }) => {
  const [cross, setCross] = useState<Cross>('zone');
  // El mapa de calor siempre muestra las 4 UET; el filtro de UET solo resalta la fila
  const defects = useMemo(
    () =>
      DATA.defects.filter(
        (d) =>
          d.date.getTime() >= current.days[0].getTime() &&
          d.date.getTime() <= current.days[current.days.length - 1].getTime() &&
          (!filters.shift || d.shift === filters.shift) &&
          (!filters.type || d.type === filters.type)
      ),
    [current, filters.shift, filters.type]
  );
  const vehicles = current.production.reduce((a, p) => a + p.vehicles, 0);

  const cols: string[] = cross === 'zone' ? [...ZONES] : cross === 'type' ? [...DEFECT_TYPES] : SHIFT_HOURS;
  const colOf = (d: DefectRecord) => (cross === 'zone' ? d.zone : cross === 'type' ? d.type : SHIFT_HOURS[d.hour]);
  const matrix = UETS.map((u) => cols.map((c) => defects.filter((d) => d.uet === u.id && colOf(d) === c).length));
  const max = Math.max(1, ...matrix.flat());
  const rowTotals = matrix.map((r) => r.reduce((a, b) => a + b, 0));
  const colTotals = cols.map((_, j) => matrix.reduce((a, r) => a + r[j], 0));
  const total = rowTotals.reduce((a, b) => a + b, 0);

  // Celda más caliente para el resumen
  let hot = { i: 0, j: 0, v: -1 };
  matrix.forEach((r, i) => r.forEach((v, j) => v > hot.v && (hot = { i, j, v })));
  const topUet = rowTotals.indexOf(Math.max(...rowTotals));

  const selectedUet = filters.uet;
  const zoneCounts = ZONES.map((z) => defects.filter((d) => d.zone === z && (!selectedUet || d.uet === selectedUet)).length);
  const narrow = useNarrow();

  /** Celda del mapa de calor para la UET i y la columna j (la misma en ambas orientaciones) */
  const heatCell = (i: number, j: number, className = '') => {
    const v = matrix[i][j];
    return (
      <td
        key={`${i}-${j}`}
        className={className}
        style={{ background: heatColor(v, max), color: heatInk(v, max) }}
        onPointerMove={(e) =>
          setTip({
            x: e.clientX,
            y: e.clientY,
            content: (
              <>
                <strong>
                  {UETS[i].name} × {cols[j]}
                </strong>
                <span>
                  <b>{fmtNum(v)}</b> defectos
                </span>
                <span>
                  {rowTotals[i] ? fmtNum((v / rowTotals[i]) * 100, 1) : 0} % de la UET · {total ? fmtNum((v / total) * 100, 1) : 0} % del total
                </span>
              </>
            ),
          })
        }
        onPointerLeave={() => setTip(null)}
      >
        {fmtNum(v)}
      </td>
    );
  };

  return (
    <>
      {/* Las 4 UET en el orden de la línea */}
      <section className="cqd-uets" aria-label="Resumen por UET">
        {UETS.map((u, i) => {
          const list = defects.filter((d) => d.uet === u.id);
          const topZone = [...countBy(list, (d) => d.zone).entries()].sort((a, b) => b[1] - a[1])[0];
          const active = selectedUet === u.id;
          return (
            <React.Fragment key={u.id}>
              <button
                className={`cqd-uet ${active ? 'cqd-uet--active' : ''}`}
                aria-pressed={active}
                onClick={() => onUet(active ? '' : u.id)}
              >
                <span className="cqd-uet-step">UET {i + 1}</span>
                <strong>{u.name}</strong>
                <span className="cqd-uet-num">{fmtNum(list.length)}</span>
                <span className="cqd-uet-meta">
                  {total ? fmtNum((list.length / total) * 100, 0) : 0} % · DPU {fmtNum(vehicles ? list.length / vehicles : 0, 3)}
                </span>
                {topZone && <span className="cqd-uet-meta">Zona crítica: {topZone[0]}</span>}
              </button>
              {i < UETS.length - 1 && <ChevronRight size={18} className="cqd-uet-arrow" aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </section>

      {total > 0 && (
        <p className="cqd-insight">
          <Flame size={16} />
          <span>
            <strong>{UETS[topUet].name}</strong> concentra el {fmtNum((rowTotals[topUet] / total) * 100, 0)} % de los defectos.
            El punto más caliente es <strong>{UETS[hot.i].name} × {cols[hot.j]}</strong> con {fmtNum(hot.v)} defectos.
          </span>
        </p>
      )}

      <section className="cqd-panel">
        <div className="cqd-panel-head">
          <div>
            <h3>Mapa de calor: UET × {CROSS_LABEL[cross].toLowerCase()}</h3>
            <p className="cqd-panel-sub">Número de defectos de pintura. Más oscuro = más defectos. Haz clic en una UET para resaltarla.</p>
          </div>
          <div className="cqd-seg" role="group" aria-label="Cruzar las UET por">
            {(Object.keys(CROSS_LABEL) as Cross[]).map((c) => (
              <button key={c} aria-pressed={cross === c} onClick={() => setCross(c)}>
                {CROSS_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="cqd-heat-wrap">
          {narrow ? (
            /* Celular: tabla girada — una fila por zona/tipo/hora y las 4 UET como columnas, para que quepa sin deslizar */
            <table className="cqd-heat cqd-heat--narrow">
              <thead>
                <tr>
                  <th className="cqd-heat-corner">{CROSS_LABEL[cross]}</th>
                  {UETS.map((u) => (
                    <th key={u.id} scope="col" className={selectedUet && selectedUet !== u.id ? 'cqd-heat-dim' : ''}>
                      <button onClick={() => onUet(selectedUet === u.id ? '' : u.id)}>{u.name}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Sin columna Total para que quepa: el total por zona se ve en el vehículo y su top 5 */}
                {cols.map((c, j) => (
                  <tr key={c}>
                    <th scope="row">{c}</th>
                    {UETS.map((u, i) => heatCell(i, j, selectedUet && selectedUet !== u.id ? 'cqd-heat-dim' : ''))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  {rowTotals.map((v, i) => (
                    <td key={i}>{fmtNum(v)}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          ) : (
            <table className="cqd-heat">
              <thead>
                <tr>
                  <th className="cqd-heat-corner">UET</th>
                  {cols.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                  <th scope="col" className="cqd-heat-total">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {UETS.map((u, i) => (
                  <tr key={u.id} className={selectedUet && selectedUet !== u.id ? 'cqd-heat-dim' : ''}>
                    <th scope="row">
                      <button onClick={() => onUet(selectedUet === u.id ? '' : u.id)}>{u.name}</button>
                    </th>
                    {matrix[i].map((_, j) => heatCell(i, j))}
                    <td className="cqd-heat-total">{fmtNum(rowTotals[i])}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  {colTotals.map((v, j) => (
                    <td key={j}>{fmtNum(v)}</td>
                  ))}
                  <td className="cqd-heat-total">{fmtNum(total)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <div className="cqd-scale" aria-hidden="true">
          <span>0</span>
          <span className="cqd-scale-bar">
            {HEAT.map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </span>
          <span>{fmtNum(max)} defectos</span>
        </div>
      </section>

      <section className="cqd-panel">
        <div className="cqd-panel-head">
          <div>
            <h3>
              <Car size={18} /> Zonas del vehículo · {selectedUet ? `UET ${uetName(selectedUet)}` : 'todas las UET'}
            </h3>
            <p className="cqd-panel-sub">Vista superior del vehículo coloreada por número de defectos en cada zona.</p>
          </div>
        </div>
        <CarMap counts={zoneCounts} setTip={setTip} />
      </section>
    </>
  );
};

/** Vista superior simplificada del vehículo: cada zona es un área coloreada por defectos */
const CAR_ZONES: { zone: Zone; d: string; lx: number; ly: number }[] = [
  { zone: 'Parachoques del.', d: 'M40,70 h40 v160 h-40 q-18,0 -18,-20 v-120 q0,-20 18,-20 z', lx: 50, ly: 150 },
  { zone: 'Capó', d: 'M84,74 h112 v152 h-112 z', lx: 140, ly: 150 },
  { zone: 'Guardafangos', d: 'M84,40 h112 v30 h-112 z M84,230 h112 v30 h-112 z', lx: 140, ly: 58 },
  { zone: 'Puerta del. izq.', d: 'M200,40 h110 v58 h-110 z', lx: 255, ly: 69 },
  { zone: 'Puerta del. der.', d: 'M200,202 h110 v58 h-110 z', lx: 255, ly: 231 },
  { zone: 'Techo', d: 'M200,102 h220 v96 h-220 z', lx: 310, ly: 150 },
  { zone: 'Puerta tras. izq.', d: 'M314,40 h106 v58 h-106 z', lx: 367, ly: 69 },
  { zone: 'Puerta tras. der.', d: 'M314,202 h106 v58 h-106 z', lx: 367, ly: 231 },
  { zone: 'Portón trasero', d: 'M424,60 h70 v180 h-70 z', lx: 459, ly: 150 },
  { zone: 'Parachoques tras.', d: 'M498,70 h28 q16,0 16,20 v120 q0,20 -16,20 h-28 z', lx: 520, ly: 150 },
];

const CarMap: React.FC<{ counts: number[]; setTip: SetTip }> = ({ counts, setTip }) => {
  const max = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <div className="cqd-car">
      <svg viewBox="0 0 560 300" role="img" aria-label="Mapa de calor de las zonas del vehículo">
        {CAR_ZONES.map((z) => {
          const v = counts[ZONES.indexOf(z.zone)];
          return (
            <g
              key={z.zone}
              onPointerMove={(e) =>
                setTip({
                  x: e.clientX,
                  y: e.clientY,
                  content: (
                    <>
                      <strong>{z.zone}</strong>
                      <span>
                        <b>{fmtNum(v)}</b> defectos · {total ? fmtNum((v / total) * 100, 1) : 0} %
                      </span>
                    </>
                  ),
                })
              }
              onPointerLeave={() => setTip(null)}
            >
              <path d={z.d} fill={heatColor(v, max)} className="cqd-car-zone" />
              <text x={z.lx} y={z.ly + 4} textAnchor="middle" fill={heatInk(v, max)} className="cqd-car-val">
                {fmtNum(v)}
              </text>
            </g>
          );
        })}
        <text x={20} y={292} className="cqd-axis">
          ◀ Frente
        </text>
        <text x={540} y={292} textAnchor="end" className="cqd-axis">
          Atrás ▶
        </text>
      </svg>
      <ul className="cqd-car-list">
        {CAR_ZONES.map((z) => ({ z, v: counts[ZONES.indexOf(z.zone)] }))
          .sort((a, b) => b.v - a.v)
          .slice(0, 5)
          .map(({ z, v }, i) => (
            <li key={z.zone}>
              <span className="cqd-car-rank">{i + 1}</span>
              <span className="cqd-car-sw" style={{ background: heatColor(v, max) }} />
              <span>{z.zone}</span>
              <b>{fmtNum(v)}</b>
            </li>
          ))}
      </ul>
    </div>
  );
};
