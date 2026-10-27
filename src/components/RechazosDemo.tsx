import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeDollarSign,
  Bell,
  Calculator,
  CheckCircle2,
  Clock,
  Database,
  Info,
  Minus,
  Plus,
  ScanLine,
  Smartphone,
  Timer,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/rechazos-demo.css';
import { DemoNotice } from './DemoNotice';

import {
  MANUAL_MINUTES,
  Piece,
  REASONS,
  Rejection,
  UETS,
  buildInitialRejections,
  fmtTime,
  formatCOP,
  piecesFor,
  uetById,
  uetLabel,
  valueOf,
} from './rechazosData';

/* Demo de la app de rechazos de defectos de calidad (Renault Sofasa): el operario escanea la
   pieza defectuosa, Power Automate obtiene su precio y lo registra al instante en la base de
   datos de la UET de Calidad. Todo es ficticio; ver rechazosData.ts. */

interface RechazosDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type AreaFilter = 'Todas' | 'Ensamble' | 'Soldadura';

const OPERATOR = 'Operario T1 · Cód. 10533';

const FLOW = [
  { title: 'Escaneo en Power Apps', sub: 'Lee el identificador de la pieza', icon: <ScanLine size={16} /> },
  { title: 'Obtener precio de la pieza', sub: 'Catálogo de piezas', icon: <BadgeDollarSign size={16} /> },
  { title: 'Calcular valor del rechazo', sub: 'Cantidad × precio unitario', icon: <Calculator size={16} /> },
  { title: 'Agregar fila · BD Calidad', sub: 'Base de datos de la UET de Calidad', icon: <Database size={16} /> },
  { title: 'Avisar a Calidad', sub: 'Notificación del nuevo rechazo', icon: <Bell size={16} /> },
];

const fmtMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h} h ${m} min` : `${m} min`;
};

export const RechazosDemo: React.FC<RechazosDemoProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'notice' | 'app'>('notice');
  const [rejections, setRejections] = useState<Rejection[]>([]);
  const [uet, setUet] = useState('trim');
  const [scanning, setScanning] = useState(false);
  const [piece, setPiece] = useState<Piece | null>(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [qty, setQty] = useState(1);
  const [flowStep, setFlowStep] = useState(-1);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [area, setArea] = useState<AreaFilter>('Todas');
  const scanStart = useRef(0);
  const scanCount = useRef(0);
  const counter = useRef(2055);
  const timers = useRef<number[]>([]);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => {
    if (!isOpen) return;
    setScreen('notice');
    setRejections(buildInitialRejections());
    setUet('trim');
    setPiece(null);
    setScanning(false);
    setFlowStep(-1);
    setHighlight(null);
    setToast('');
    setArea('Todas');
    counter.current = 2055;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clear();
    };
  }, [isOpen]);

  const scan = () => {
    clear();
    setPiece(null);
    setScanning(true);
    setFlowStep(-1);
    scanStart.current = Date.now();
    at(1300, () => {
      // Cada escaneo lee una pieza distinta de las que usa la UET
      const options = piecesFor(uet);
      setPiece(options[scanCount.current++ % options.length]);
      setScanning(false);
      setReason(REASONS[0]);
      setQty(1);
    });
  };

  const register = () => {
    if (!piece) return;
    const id = `RC-${counter.current++}`;
    const seconds = Math.max(4, Math.round((Date.now() - scanStart.current) / 1000) + 2);
    const record: Rejection = { id, at: new Date(), uet, piece, qty, reason, operator: 'S. Henao', seconds };
    FLOW.forEach((_, i) => at(i * 480, () => setFlowStep(i)));
    at(FLOW.length * 480, () => {
      setFlowStep(FLOW.length);
      setRejections((prev) => [record, ...prev]);
      setHighlight(id);
      setPiece(null);
      setToast(`${id} registrado en ${seconds} s · ${formatCOP(valueOf(record))} cargado a ${uetById(uet).name}`);
    });
    at(FLOW.length * 480 + 4200, () => setToast(''));
  };

  const visible = useMemo(
    () => rejections.filter((r) => area === 'Todas' || uetById(r.uet).area === area),
    [rejections, area]
  );
  const total = visible.reduce((s, r) => s + valueOf(r), 0);
  const avgSeconds = visible.length ? visible.reduce((s, r) => s + r.seconds, 0) / visible.length : 0;
  const savedMinutes = visible.reduce((s, r) => s + MANUAL_MINUTES - r.seconds / 60, 0);
  const byUet = UETS.filter((u) => area === 'Todas' || u.area === area)
    .map((u) => ({ u, value: visible.filter((r) => r.uet === u.id).reduce((s, r) => s + valueOf(r), 0) }))
    .sort((a, b) => b.value - a.value);
  const maxUet = Math.max(1, ...byUet.map((x) => x.value));
  const busy = scanning || (flowStep >= 0 && flowStep < FLOW.length);

  if (!isOpen) return null;

  if (screen === 'notice') {
    return (
      <DemoNotice
        id="rzd-notice-title"
        eyebrow="Renault Sofasa · Power Apps + Power Automate"
        title="App interna con datos ficticios"
        compare={{
          before: `El operario llevaba la pieza defectuosa hasta la UET de Calidad y calculaba su valor a mano: unos ${MANUAL_MINUTES} min por pieza.`,
          after: 'Escanea el identificador de la pieza y el rechazo, con su valor, llega al instante a la base de datos de Calidad.',
          afterLabel: 'Con la app',
        }}
        points={[
          'Elige la UET que rechaza (Ensamble o Soldadura): el valor de la pieza se carga a esa UET.',
          'Pulsa «Escanear pieza», marca el motivo y registra el rechazo.',
          'Mira cómo Power Automate obtiene el precio y lo guarda en la base de datos de la UET de Calidad.',
        ]}
        actions={[{ label: 'Abrir la app', onClick: () => setScreen('app') }]}
        onClose={onClose}
      >
        En Renault Sofasa el tiempo es el recurso más valioso: cada minuto que un operario pierde es producción que no se
        hace. Esta es una recreación para el portafolio: las piezas, precios y registros que verás son{' '}
        <strong>ficticios</strong>.
      </DemoNotice>
    );
  }

  const u = uetById(uet);

  return createPortal(
    <div className="rzd-overlay" role="dialog" aria-modal="true" aria-label="Demo de rechazos de defectos de calidad (datos ficticios)">
      <div className="rzd-app">
        <header className="rzd-bar">
          <span className="rzd-logo" aria-hidden="true">
            <ScanLine size={18} />
          </span>
          <div className="rzd-bar-title">
            <strong>Rechazos de defectos de calidad</strong>
            <span>Planta Envigado · Ensamble y Soldadura</span>
          </div>
          <span className="rzd-badge">
            <Info size={13} /> Datos ficticios
          </span>
          <button className="rzd-close" onClick={onClose} aria-label="Cerrar demostración">
            <X size={18} />
          </button>
        </header>

        <div className="rzd-main">
          {/* App del operario (Power Apps en el celular) */}
          <section className="rzd-phone-col" aria-label="App del operario">
            <p className="rzd-col-title">
              <Smartphone size={15} /> App del operario · Power Apps
            </p>
            <div className="rzd-phone">
              <div className="rzd-phone-head">
                <strong>Rechazos de Calidad</strong>
                <span>{OPERATOR}</span>
              </div>
              <div className="rzd-phone-body">
                <label className="rzd-field">
                  <span>UET que rechaza</span>
                  <select
                    value={uet}
                    disabled={busy}
                    onChange={(e) => {
                      setUet(e.target.value);
                      setPiece(null);
                    }}
                  >
                    {(['Ensamble', 'Soldadura'] as const).map((a) => (
                      <optgroup key={a} label={a}>
                        {UETS.filter((x) => x.area === a).map((x) => (
                          <option key={x.id} value={x.id}>
                            {uetLabel(x)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>

                <div className={`rzd-viewfinder ${scanning ? 'rzd-viewfinder--scanning' : ''} ${piece ? 'rzd-viewfinder--done' : ''}`}>
                  <span className="rzd-corner rzd-corner--tl" />
                  <span className="rzd-corner rzd-corner--tr" />
                  <span className="rzd-corner rzd-corner--bl" />
                  <span className="rzd-corner rzd-corner--br" />
                  <span className="rzd-barcode" aria-hidden="true" />
                  {scanning && <span className="rzd-laser" aria-hidden="true" />}
                  <span className="rzd-vf-text">
                    {scanning ? 'Leyendo etiqueta…' : piece ? `✓ ${piece.code}` : 'Apunta a la etiqueta de la pieza'}
                  </span>
                </div>

                <button className="rzd-btn rzd-btn--scan" onClick={scan} disabled={busy}>
                  <ScanLine size={18} /> {piece ? 'Escanear otra pieza' : 'Escanear pieza'}
                </button>

                {piece && (
                  <div className="rzd-piece">
                    <div className="rzd-piece-top">
                      <strong>{piece.name}</strong>
                      <span>
                        N.º de parte {piece.part} · {piece.code}
                      </span>
                    </div>
                    <div className="rzd-piece-price">
                      <span>Precio unitario</span>
                      <strong>{formatCOP(piece.price)}</strong>
                    </div>

                    <span className="rzd-label">Motivo del rechazo</span>
                    <div className="rzd-chips">
                      {REASONS.map((r) => (
                        <button key={r} className={reason === r ? 'rzd-chip rzd-chip--on' : 'rzd-chip'} onClick={() => setReason(r)} disabled={busy}>
                          {r}
                        </button>
                      ))}
                    </div>

                    <div className="rzd-qty-row">
                      <span className="rzd-label">Cantidad</span>
                      <div className="rzd-qty">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={busy || qty <= 1} aria-label="Menos">
                          <Minus size={14} />
                        </button>
                        <strong aria-live="polite">{qty}</strong>
                        <button onClick={() => setQty((q) => Math.min(9, q + 1))} disabled={busy} aria-label="Más">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="rzd-total">
                      <span>Valor a cargar a {u.name}</span>
                      <strong>{formatCOP(piece.price * qty)}</strong>
                    </div>

                    <button className="rzd-btn rzd-btn--send" onClick={register} disabled={busy}>
                      <CheckCircle2 size={18} /> Registrar rechazo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="rzd-right">
            {/* Flujo de Power Automate que procesa el escaneo */}
            <section className="rzd-card" aria-label="Flujo de Power Automate">
              <div className="rzd-card-head">
                <h3>Flujo de Power Automate</h3>
                <span className="rzd-muted">
                  {flowStep < 0 ? 'Se ejecuta al registrar un rechazo' : flowStep >= FLOW.length ? 'Ejecución correcta' : 'Ejecutando…'}
                </span>
              </div>
              <ol className="rzd-flow">
                {FLOW.map((f, i) => {
                  const state = flowStep < 0 || i > flowStep ? 'idle' : i === flowStep && flowStep < FLOW.length ? 'running' : 'done';
                  return (
                    <li key={f.title} className={`rzd-step rzd-step--${state}`}>
                      <span className="rzd-step-icon">{state === 'done' ? <CheckCircle2 size={16} /> : f.icon}</span>
                      <span className="rzd-step-text">
                        <strong>{f.title}</strong>
                        <span>{f.sub}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Base de datos de la UET de Calidad */}
            <section className="rzd-card" aria-label="Base de datos de la UET de Calidad">
              <div className="rzd-card-head">
                <h3>
                  <Database size={16} /> Base de datos · UET de Calidad
                </h3>
                <div className="rzd-seg" role="group" aria-label="Filtrar por área">
                  {(['Todas', 'Ensamble', 'Soldadura'] as AreaFilter[]).map((a) => (
                    <button key={a} aria-pressed={area === a} onClick={() => setArea(a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rzd-kpis">
                <div className="rzd-kpi">
                  <span>Rechazos hoy</span>
                  <strong>{visible.length}</strong>
                </div>
                <div className="rzd-kpi">
                  <span>Valor rechazado hoy</span>
                  <strong>{formatCOP(total)}</strong>
                </div>
                <div className="rzd-kpi">
                  <span>
                    <Timer size={13} /> Tiempo de registro
                  </span>
                  <strong>{Math.round(avgSeconds)} s</strong>
                  <small>Antes: ~{MANUAL_MINUTES} min por pieza</small>
                </div>
                <div className="rzd-kpi rzd-kpi--accent">
                  <span>
                    <Clock size={13} /> Tiempo de operario ahorrado hoy
                  </span>
                  <strong>{fmtMinutes(savedMinutes)}</strong>
                  <small>Tiempo que vuelve a la línea de producción</small>
                </div>
              </div>

              <h4 className="rzd-sub">Valor rechazado por UET</h4>
              <div className="rzd-ubars">
                {byUet.map(({ u: x, value }) => (
                  <div key={x.id} className="rzd-ubar">
                    <span className="rzd-ubar-name">{uetLabel(x)}</span>
                    <span className="rzd-ubar-track">
                      <span style={{ width: `${(value / maxUet) * 100}%` }} />
                    </span>
                    <span className="rzd-ubar-val">{formatCOP(value)}</span>
                  </div>
                ))}
              </div>

              <h4 className="rzd-sub">Últimos rechazos registrados</h4>
              <div className="rzd-table-wrap">
                <table className="rzd-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Registro</th>
                      <th>Pieza</th>
                      <th>UET</th>
                      <th>Motivo</th>
                      <th>Cant.</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.slice(0, 8).map((r) => (
                      <tr key={r.id} className={r.id === highlight ? 'rzd-row--new' : ''}>
                        {/* data-label: en celular cada fila se muestra como tarjeta */}
                        <td data-label="Hora">{fmtTime(r.at)}</td>
                        <td className="rzd-td-id">{r.id}</td>
                        <td className="rzd-td-piece">
                          <strong>{r.piece.name}</strong>
                          <span>{r.piece.part}</span>
                        </td>
                        <td data-label="UET">{uetLabel(uetById(r.uet))}</td>
                        <td data-label="Motivo">{r.reason}</td>
                        <td data-label="Cantidad">{r.qty}</td>
                        <td className="rzd-td-value" data-label="Valor">
                          {formatCOP(valueOf(r))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visible.length === 0 && <p className="rzd-muted rzd-empty">No hay rechazos para esta área.</p>}
              </div>
            </section>
          </div>
        </div>

        <div className={`rzd-toast ${toast ? 'rzd-toast--show' : ''}`} role="status" aria-live="polite">
          <CheckCircle2 size={16} aria-hidden="true" /> {toast}
        </div>
      </div>
    </div>,
    document.body
  );
};
