import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, CloudUpload, Database, Info, Minus, Plus, Tablet, Users, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/seleccion-demo.css';
import { DemoNotice } from './DemoNotice';

import {
  Aspirant,
  GROUPS,
  Grade,
  Jornada,
  PENDING_GROUP,
  PSYCH_LABEL,
  PSYCH_TONE,
  Psych,
  RAC5,
  RULES,
  SCHOOLS,
  Station,
  VERDICT_LABEL,
  Verdict,
  buildAspirants,
  draftFor,
  fmtTime,
  placementOf,
  quality,
  school,
  verdictOf,
} from './seleccionData';

/* Demo de la app de selección de operarios (React Native en tablets): los maestros de cada
   escuela de destreza y las psicólogas de la RAC 5 califican a los aspirantes y el sistema
   calcula en qué áreas de la fábrica quedan. Todo es ficticio; ver seleccionData.ts. */

interface SeleccionDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type Base = Station | 'rac5';
type View = 'tablet' | 'rrhh';
type ResultFilter = 'Todos' | 'Aptos' | 'En espera' | 'No aptos' | 'En proceso';

const TONE_CLASS: Record<Verdict | 'pendiente', string> = { apto: 'sld-tone--ok', medio: 'sld-tone--mid', no: 'sld-tone--bad', pendiente: 'sld-tone--none' };

export const SeleccionDemo: React.FC<SeleccionDemoProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'notice' | 'app'>('notice');
  const [view, setView] = useState<View>('tablet');
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [base, setBase] = useState<Base>('ensamble');
  const [group, setGroup] = useState(PENDING_GROUP);
  const [draft, setDraft] = useState<Record<string, Grade>>({});
  const [psychDraft, setPsychDraft] = useState<Record<string, Psych>>({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');
  const [jornada, setJornada] = useState<Jornada | 'Todas'>('Todas');
  const [result, setResult] = useState<ResultFilter>('Todos');
  const [flash, setFlash] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    setScreen('notice');
    setView('tablet');
    setAspirants(buildAspirants());
    setBase('ensamble');
    setGroup(PENDING_GROUP);
    setJornada('Todas');
    setResult('Todos');
    setFlash([]);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, [isOpen]);

  const members = useMemo(() => aspirants.filter((a) => a.group === group), [aspirants, group]);

  // Al cambiar de escuela o de grupo, la tablet carga lo ya calificado o una propuesta para ajustar
  useEffect(() => {
    if (!members.length) return;
    if (base === 'rac5') {
      setPsychDraft(Object.fromEntries(members.map((a) => [a.id, a.rac5 ?? 'favorable'])));
    } else {
      const proposal = draftFor(base, members.map((a) => a.id));
      setDraft(Object.fromEntries(members.map((a) => [a.id, a.grades[base] ?? proposal[a.id]])));
    }
  }, [base, group, members.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = () => {
    setSending(true);
    timers.current.push(
      window.setTimeout(() => {
        setAspirants((prev) =>
          prev.map((a) => {
            if (a.group !== group) return a;
            return base === 'rac5' ? { ...a, rac5: psychDraft[a.id] } : { ...a, grades: { ...a.grades, [base]: draft[a.id] } };
          })
        );
        setSending(false);
        setFlash(members.map((a) => a.id));
        setToast(`Calificaciones del grupo ${group} enviadas a la base de datos de RRHH`);
        timers.current.push(window.setTimeout(() => setToast(''), 3800));
      }, 1100)
    );
  };

  const setGrade = (id: string, patch: Partial<Grade>) => setDraft((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  if (!isOpen) return null;

  if (screen === 'notice') {
    return (
      <DemoNotice
        id="sld-notice-title"
        eyebrow="Renault Sofasa · React Native"
        title="App interna con datos ficticios"
        points={[
          'Los aspirantes llegan en dos jornadas (mañana y tarde), en grupos de 4, y pasan por 5 bases: las escuelas de destreza de Ensamble, DLI, Soldadura y Pintura, y la RAC 5 con las psicólogas de RRHH.',
          'En cada escuela, 2 maestros califican la calidad y se mide el tiempo frente al estándar desde su tablet.',
          'En la base de datos de RRHH cada área aparece en verde (apto), amarillo (medianamente apto, en espera) o rojo (no apto).',
        ]}
        actions={[{ label: 'Abrir la app', onClick: () => setScreen('app') }]}
        onClose={onClose}
      >
        App en React Native usada en las tablets de las escuelas de destreza durante el proceso de selección de nuevos operarios
        de fabricación. Es una recreación para el portafolio: los aspirantes, maestros y calificaciones que verás son{' '}
        <strong>ficticios</strong>.
      </DemoNotice>
    );
  }

  const isRac = base === 'rac5';
  const sc = isRac ? null : school(base);
  const graded = isRac ? members.every((a) => a.rac5) : members.every((a) => a.grades[base]);

  const visible = aspirants.filter((a) => {
    if (jornada !== 'Todas' && a.jornada !== jornada) return false;
    const p = placementOf(a);
    if (result === 'Aptos') return p.tone === 'apto';
    if (result === 'En espera') return p.tone === 'medio';
    if (result === 'No aptos') return p.tone === 'no';
    if (result === 'En proceso') return p.tone === 'pendiente';
    return true;
  });
  const placements = aspirants.map(placementOf);
  const count = (tone: Verdict | 'pendiente') => placements.filter((p) => p.tone === tone).length;
  const allAreas = placements.filter((p) => p.label === 'Apto para todas las áreas').length;

  return createPortal(
    <div className="sld-overlay" role="dialog" aria-modal="true" aria-label="Demo de selección de operarios (datos ficticios)">
      <div className="sld-app">
        <header className="sld-top">
          <span className="sld-logo" aria-hidden="true">
            <Users size={18} />
          </span>
          <div className="sld-top-title">
            <strong>Selección de operarios</strong>
            <span>Escuelas de destreza · RAC 5</span>
          </div>
          <div className="sld-views" role="tablist" aria-label="Vistas">
            <button role="tab" aria-selected={view === 'tablet'} aria-label="Tablet del maestro" onClick={() => setView('tablet')}>
              <Tablet size={15} /> <span className="sld-long">Tablet del maestro</span>
              <span className="sld-short">Tablet</span>
            </button>
            <button role="tab" aria-selected={view === 'rrhh'} aria-label="Base de datos RRHH" onClick={() => setView('rrhh')}>
              <Database size={15} /> <span className="sld-long">Base de datos RRHH</span>
              <span className="sld-short">RRHH</span>
            </button>
          </div>
          <span className="sld-badge">
            <Info size={13} /> Datos ficticios
          </span>
          <button className="sld-close" onClick={onClose} aria-label="Cerrar demostración">
            <X size={18} />
          </button>
        </header>

        {view === 'tablet' ? (
          <main className="sld-stage">
            {/* Tablet con la app en React Native */}
            <div className="sld-tablet">
              <div className="sld-tab-bar">
                <strong>{isRac ? 'RAC 5 · Psicología (RRHH)' : 'Escuelas de destreza'}</strong>
                <span>{isRac ? `Psicólogas: ${RAC5.psychologists.join(' y ')}` : `Maestros: ${sc!.masters.join(' y ')}`}</span>
              </div>

              <div className="sld-tab-body">
                <div className="sld-bases" role="tablist" aria-label="Base">
                  {SCHOOLS.map((s, i) => (
                    <button key={s.id} role="tab" aria-selected={base === s.id} onClick={() => setBase(s.id)} disabled={sending}>
                      <em>{i + 1}</em> {s.name}
                    </button>
                  ))}
                  <button role="tab" aria-selected={isRac} onClick={() => setBase('rac5')} disabled={sending}>
                    <em>5</em> {RAC5.name}
                  </button>
                </div>

                <div className="sld-context">
                  <div>
                    <span>Prueba</span>
                    <strong>{isRac ? RAC5.test : sc!.test}</strong>
                  </div>
                  {!isRac && (
                    <div>
                      <span>Requisitos</span>
                      <strong>
                        Calidad ≥ {RULES.aptoQuality} · tiempo ≤ {fmtTime(sc!.standard)}
                      </strong>
                    </div>
                  )}
                  <label>
                    <span>Grupo</span>
                    <select value={group} onChange={(e) => setGroup(e.target.value)} disabled={sending}>
                      {GROUPS.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id} · {g.jornada}
                          {g.id === PENDING_GROUP ? ' (por calificar)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="sld-people">
                  {members.map((a) => {
                    if (isRac) {
                      const p = psychDraft[a.id];
                      return (
                        <article key={a.id} className="sld-person">
                          <div className="sld-person-head">
                            <strong>{a.name}</strong>
                            <span>
                              {a.id} · {a.doc}
                            </span>
                          </div>
                          <div className="sld-psych" role="radiogroup" aria-label={`Concepto de ${a.name}`}>
                            {(Object.keys(PSYCH_LABEL) as Psych[]).map((k) => (
                              <button
                                key={k}
                                role="radio"
                                aria-checked={p === k}
                                className={p === k ? `sld-psych-opt ${TONE_CLASS[PSYCH_TONE[k]]}` : 'sld-psych-opt'}
                                onClick={() => setPsychDraft((d) => ({ ...d, [a.id]: k }))}
                                disabled={sending}
                              >
                                {PSYCH_LABEL[k]}
                              </button>
                            ))}
                          </div>
                        </article>
                      );
                    }
                    const g = draft[a.id];
                    if (!g) return null;
                    const v = verdictOf(base as Station, g);
                    return (
                      <article key={a.id} className="sld-person">
                        <div className="sld-person-head">
                          <strong>{a.name}</strong>
                          <span>
                            {a.id} · {a.doc}
                          </span>
                        </div>
                        <div className="sld-scores">
                          <Stepper label={`Calidad · ${sc!.masters[0].split(' ')[0]}`} value={g.q1} min={0} max={10} onChange={(q1) => setGrade(a.id, { q1 })} disabled={sending} />
                          <Stepper label={`Calidad · ${sc!.masters[1].split(' ')[0]}`} value={g.q2} min={0} max={10} onChange={(q2) => setGrade(a.id, { q2 })} disabled={sending} />
                          <Stepper
                            label="Tiempo"
                            value={g.time}
                            min={30}
                            max={900}
                            step={10}
                            format={fmtTime}
                            onChange={(time) => setGrade(a.id, { time })}
                            disabled={sending}
                          />
                        </div>
                        <div className={`sld-verdict ${TONE_CLASS[v]}`}>
                          <span>
                            Calidad {quality(g).toLocaleString('es-CO', { maximumFractionDigits: 1 })} · {fmtTime(g.time)}{' '}
                            {g.time <= sc!.standard ? 'dentro del estándar' : 'sobre el estándar'}
                          </span>
                          <strong>{VERDICT_LABEL[v]}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="sld-send-row">
                  <span className="sld-muted">{graded ? 'Este grupo ya tiene calificación aquí: puedes corregirla y reenviarla.' : 'Grupo pendiente de calificar.'}</span>
                  <button className="sld-send" onClick={send} disabled={sending}>
                    <CloudUpload size={18} /> {sending ? 'Enviando…' : 'Enviar calificaciones a RRHH'}
                  </button>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main className="sld-db">
            <div className="sld-db-head">
              <div>
                <h2>Base de datos · Recursos Humanos</h2>
                <p className="sld-muted">Aspirantes a operario · el sistema calcula su ubicación con las 4 escuelas y la RAC 5</p>
              </div>
              <div className="sld-filters">
                <div className="sld-seg" role="group" aria-label="Jornada">
                  {(['Todas', 'Mañana', 'Tarde'] as const).map((j) => (
                    <button key={j} aria-pressed={jornada === j} onClick={() => setJornada(j)}>
                      {j}
                    </button>
                  ))}
                </div>
                <label>
                  <span className="sld-sr-only">Resultado</span>
                  <select value={result} onChange={(e) => setResult(e.target.value as ResultFilter)}>
                    {(['Todos', 'Aptos', 'En espera', 'No aptos', 'En proceso'] as ResultFilter[]).map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <section className="sld-kpis" aria-label="Resumen">
              <div className="sld-kpi">
                <span>Aspirantes</span>
                <strong>{aspirants.length}</strong>
              </div>
              <div className="sld-kpi sld-kpi--ok">
                <span>Aptos para todas las áreas</span>
                <strong>{allAreas}</strong>
              </div>
              <div className="sld-kpi sld-kpi--ok">
                <span>Aptos para al menos un área</span>
                <strong>{count('apto')}</strong>
              </div>
              <div className="sld-kpi sld-kpi--mid">
                <span>En espera</span>
                <strong>{count('medio')}</strong>
              </div>
              <div className="sld-kpi sld-kpi--bad">
                <span>No aptos</span>
                <strong>{count('no')}</strong>
              </div>
              <div className="sld-kpi">
                <span>En proceso</span>
                <strong>{count('pendiente')}</strong>
              </div>
            </section>

            <p className="sld-legend">
              <i className="sld-dot sld-tone--ok" /> Apto <i className="sld-dot sld-tone--mid" /> Medianamente apto (en espera)
              <i className="sld-dot sld-tone--bad" /> No apto <i className="sld-dot sld-tone--none" /> Pendiente
            </p>

            <div className="sld-table-wrap">
              <table className="sld-table">
                <thead>
                  <tr>
                    <th>Aspirante</th>
                    {SCHOOLS.map((s) => (
                      <th key={s.id}>{s.name}</th>
                    ))}
                    <th>{RAC5.name}</th>
                    <th>Ubicación</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((a) => {
                    const p = placementOf(a);
                    return (
                      <tr key={a.id} className={flash.includes(a.id) ? 'sld-row--new' : ''}>
                        <td className="sld-td-name">
                          <strong>{a.name}</strong>
                          <span>
                            {a.group} · {a.jornada}
                          </span>
                        </td>
                        {SCHOOLS.map((s) => {
                          const g = a.grades[s.id];
                          const v = g ? verdictOf(s.id, g) : null;
                          return (
                            <td key={s.id} data-label={s.name} className={`sld-cell ${TONE_CLASS[v ?? 'pendiente']}`}>
                              {g ? (
                                <>
                                  <strong>{VERDICT_LABEL[v!]}</strong>
                                  <span>
                                    {quality(g).toLocaleString('es-CO', { maximumFractionDigits: 1 })} · {fmtTime(g.time)}
                                  </span>
                                </>
                              ) : (
                                <span>Pendiente</span>
                              )}
                            </td>
                          );
                        })}
                        <td data-label={RAC5.name} className={`sld-cell ${TONE_CLASS[a.rac5 ? PSYCH_TONE[a.rac5] : 'pendiente']}`}>
                          {a.rac5 ? <strong>{PSYCH_LABEL[a.rac5]}</strong> : <span>Pendiente</span>}
                        </td>
                        <td className={`sld-place ${TONE_CLASS[p.tone]}`}>
                          <strong>{p.label}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {visible.length === 0 && <p className="sld-muted sld-empty">No hay aspirantes con estos filtros.</p>}
            </div>
          </main>
        )}

        <div className={`sld-toast ${toast ? 'sld-toast--show' : ''}`} role="status" aria-live="polite">
          <CheckCircle2 size={16} aria-hidden="true" /> {toast}
          {toast && (
            <button onClick={() => setView('rrhh')} className="sld-toast-btn">
              Ver en RRHH
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/** Control − valor + para las calificaciones en la tablet */
const Stepper: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  disabled?: boolean;
}> = ({ label, value, min, max, step = 1, format = String, onChange, disabled }) => (
  <div className="sld-stepper">
    <span>{label}</span>
    <div>
      <button onClick={() => onChange(Math.max(min, value - step))} disabled={disabled || value <= min} aria-label={`Bajar ${label}`}>
        <Minus size={14} />
      </button>
      <strong>{format(value)}</strong>
      <button onClick={() => onChange(Math.min(max, value + step))} disabled={disabled || value >= max} aria-label={`Subir ${label}`}>
        <Plus size={14} />
      </button>
    </div>
  </div>
);
