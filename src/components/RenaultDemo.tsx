import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  CircleCheck,
  CircleX,
  Clock,
  Factory,
  FilePlus,
  Inbox,
  Info,
  LayoutDashboard,
  ListChecks,
  Search,
  Send,
  ShieldCheck,
  Timer,
  UserCog,
  Users,
  Wallet,
  Workflow,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/renault-demo.css';
import { DemoNotice } from './DemoNotice';
import { RenaultFlow } from './RenaultFlow';

import {
  ActivityItem,
  ChangeRequest,
  ChangeType,
  CHANGE_TYPES,
  DEPARTMENTS,
  DeptId,
  EMPLOYEES,
  HR_MANAGER,
  POSITIONS,
  Role,
  RequestStage,
  STAGE_LABEL,
  Shift,
  TOTAL_EMPLOYEES,
  buildInitialActivity,
  buildInitialRequests,
  dept,
  fmtDateTime,
  fmtDuration,
  formatCOP,
  needsIncoming,
  salaryOf,
  stageOf,
} from './renaultData';

/* Demo de la app de Power Apps "Cambios de Estructura y Nómina" de Renault Sofasa.
   Todos los datos son ficticios; ver renaultData.ts. */

interface RenaultDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'panel' | 'bandeja' | 'solicitudes' | 'nueva';
type Step = 'rrhh' | 'outgoing' | 'incoming';

// short: etiqueta de la barra inferior en celular, donde no caben los nombres largos
const NAV: { id: View; label: string; short: string; icon: React.ReactNode }[] = [
  { id: 'panel', label: 'Panel', short: 'Panel', icon: <LayoutDashboard size={18} /> },
  { id: 'bandeja', label: 'Mis aprobaciones', short: 'Aprobaciones', icon: <Inbox size={18} /> },
  { id: 'solicitudes', label: 'Solicitudes', short: 'Solicitudes', icon: <ListChecks size={18} /> },
  { id: 'nueva', label: 'Nueva solicitud', short: 'Nueva', icon: <FilePlus size={18} /> },
];

const roleLabel = (role: Role) => (role === 'rrhh' ? `Recursos Humanos · ${HR_MANAGER}` : `Jefe de ${dept(role).name} · ${dept(role).boss}`);

const initials = (name: string) =>
  name
    .split(' ')
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((n) => n[0])
    .join('');

/** Pasos que el rol actual puede aprobar en una solicitud */
const actionableSteps = (r: ChangeRequest, role: Role): Step[] => {
  if (stageOf(r) === 'rrhh') return role === 'rrhh' ? ['rrhh'] : [];
  if (stageOf(r) !== 'jefes' || role === 'rrhh') return [];
  const steps: Step[] = [];
  if (r.outgoing.status === 'pendiente' && r.employee.dept === role) steps.push('outgoing');
  if (needsIncoming(r) && r.incoming.status === 'pendiente' && r.toDept === role) steps.push('incoming');
  return steps;
};

const STEP_LABEL: Record<Step, string> = {
  rrhh: 'Aprobar como RRHH',
  outgoing: 'Aprobar salida (jefe actual)',
  incoming: 'Aprobar llegada (jefe nuevo)',
};

const StageBadge: React.FC<{ stage: RequestStage }> = ({ stage }) => (
  <span className={`rsd-badge rsd-badge--${stage}`}>{STAGE_LABEL[stage]}</span>
);

const ChangeSummary: React.FC<{ r: ChangeRequest }> = ({ r }) => (
  <span className="rsd-move">
    <span className={`rsd-dept-chip rsd-dept-chip--${r.employee.dept}`}>{dept(r.employee.dept).short}</span>
    <ArrowRight size={14} aria-label="hacia" />
    <span className={`rsd-dept-chip rsd-dept-chip--${r.toDept}`}>{dept(r.toDept).short}</span>
  </span>
);

export const RenaultDemo: React.FC<RenaultDemoProps> = ({ isOpen, onClose }) => {
  // flow → réplica del flujo de Power Automate que envía la aprobación y los correos
  const [screen, setScreen] = useState<'notice' | 'app' | 'flow'>('notice');
  const [flowFor, setFlowFor] = useState<string | undefined>(undefined);
  const [view, setView] = useState<View>('panel');
  const [role, setRole] = useState<Role>('rrhh');
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<RequestStage | ''>('');
  const toastTimer = useRef<number>();
  const counter = useRef(419);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Reinicia los datos al abrir, bloquea el scroll del fondo y cierra con Escape
  useEffect(() => {
    if (!isOpen) return;
    const initial = buildInitialRequests();
    setRequests(initial);
    setActivity(buildInitialActivity(initial));
    setScreen('notice');
    setView('panel');
    setRole('rrhh');
    setSelectedId(null);
    counter.current = 419;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(toastTimer.current);
    };
  }, [isOpen]);

  const showToast = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3200);
  };

  const log = (items: Omit<ActivityItem, 'id' | 'at'>[]) => {
    const at = new Date();
    setActivity((prev) => [...items.map((it, i) => ({ ...it, at, id: `${at.getTime()}-${i}` })).reverse(), ...prev]);
  };

  const decide = (r: ChangeRequest, step: Step, approve: boolean) => {
    const now = new Date();
    const next: ChangeRequest = { ...r, [step]: { status: approve ? 'aprobado' : 'rechazado', at: now } };
    const from = dept(r.employee.dept);
    const to = dept(r.toDept);
    const who = step === 'rrhh' ? 'RRHH' : step === 'outgoing' ? `${from.boss} (${from.name})` : `${to.boss} (${to.name})`;
    const items: Omit<ActivityItem, 'id' | 'at'>[] = [
      { kind: approve ? 'approve' : 'reject', text: `${who} ${approve ? 'aprobó' : 'rechazó'} ${r.id}` },
    ];

    if (approve && step === 'rrhh') {
      // RRHH aprueba → se avisa en paralelo al jefe actual y al jefe nuevo
      if (needsIncoming(r)) {
        items.push(
          { kind: 'notify', text: `Aviso a ${from.boss}: ${r.employee.name} sale de ${from.name} hacia ${to.name}` },
          { kind: 'notify', text: `Aviso a ${to.boss}: ${r.employee.name} llega a ${to.name} desde ${from.name}` }
        );
      } else {
        items.push({ kind: 'notify', text: `Aviso a ${from.boss}: ${CHANGE_TYPES[r.type].toLowerCase()} de ${r.employee.name}` });
      }
    }

    if (approve && stageOf(next) === 'aplicado') {
      next.payrollAt = now;
      items.push(
        { kind: 'payroll', text: `Novedad de nómina registrada para ${r.employee.name}: ${formatCOP(salaryOf(r.toLevel))}` },
        { kind: 'notify', text: `Aviso a ${r.employee.name}: su cambio quedó aprobado` }
      );
    }
    if (!approve) items.push({ kind: 'notify', text: `Aviso al solicitante: ${r.id} fue rechazada` });

    setRequests((prev) => prev.map((x) => (x.id === r.id ? next : x)));
    log(items);
    showToast(
      !approve
        ? `${r.id} rechazada`
        : next.payrollAt
          ? `${r.id} aprobada · nómina actualizada en ${fmtDuration(r.createdAt, now)}`
          : step === 'rrhh'
            ? `${r.id} aprobada · jefes notificados`
            : `${r.id} aprobada`
    );
  };

  const create = (r: Omit<ChangeRequest, 'id' | 'createdAt' | 'rrhh' | 'outgoing' | 'incoming'>) => {
    const id = `CE-0${counter.current++}`;
    const req: ChangeRequest = {
      ...r,
      id,
      createdAt: new Date(),
      rrhh: { status: 'pendiente' },
      outgoing: { status: 'pendiente' },
      incoming: { status: 'pendiente' },
    };
    setRequests((prev) => [req, ...prev]);
    log([
      { kind: 'request', text: `${id} creada: ${CHANGE_TYPES[r.type]} de ${r.employee.name}` },
      { kind: 'notify', text: `Aviso a RRHH (${HR_MANAGER}): nueva solicitud ${id} por aprobar` },
    ]);
    showToast(`${id} enviada a Recursos Humanos`);
    setRole('rrhh');
    setView('bandeja');
  };

  const inbox = useMemo(
    () => requests.flatMap((r) => actionableSteps(r, role).map((step) => ({ r, step }))),
    [requests, role]
  );

  const pendingByRole = useMemo(() => {
    const roles: Role[] = ['rrhh', ...DEPARTMENTS.map((d) => d.id)];
    return Object.fromEntries(
      roles.map((ro) => [ro, requests.reduce((n, r) => n + actionableSteps(r, ro).length, 0)])
    ) as Record<Role, number>;
  }, [requests]);

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  if (!isOpen) return null;

  const openFlow = (id?: string) => {
    setFlowFor(id);
    setSelectedId(null);
    setScreen('flow');
  };

  // Se renderiza en <body> para que ningún contenedor con transform/animación afecte al position: fixed
  if (screen === 'flow') {
    return createPortal(
      <div className="rsd-overlay" role="dialog" aria-modal="true" aria-label="Flujo de Power Automate de la app (datos ficticios)">
        <RenaultFlow requests={requests} initialId={flowFor} onBack={() => setScreen('app')} onClose={onClose} />
      </div>,
      document.body
    );
  }

  if (screen === 'notice') {
    return (
      <DemoNotice
        id="rsd-notice-title"
        eyebrow="Renault Sofasa · Power Apps"
        title="App interna con datos ficticios"
        compare={{
          before: 'Formato en papel → RRHH → aviso manual al jefe actual y al jefe nuevo. Hasta ~14 h por cambio.',
          after: 'Solicitud digital, aprobación de RRHH y avisos automáticos a ambos jefes. Minutos por cambio.',
          afterLabel: 'Con la app',
        }}
        points={[
          '954 empleados en 2 turnos: Soldadura, Pintura, Ensamble y DLI.',
          'Cambia de rol (RRHH o jefe de área) para aprobar y ver cómo avanza cada solicitud.',
          'Mira el flujo de Power Automate que pide la aprobación a RRHH y avisa por correo al jefe actual y al jefe nuevo.',
        ]}
        actions={[
          { label: 'Abrir la app', onClick: () => setScreen('app') },
          { label: 'Ver el flujo en Power Automate', onClick: () => openFlow() },
        ]}
        onClose={onClose}
      >
        Cambios de Estructura y Nómina es una app de Power Apps de uso interno de la planta de Renault Sofasa. Esta es
        una recreación para el portafolio: todos los empleados, jefes, salarios y solicitudes que verás son{' '}
        <strong>ficticios</strong>.
      </DemoNotice>
    );
  }

  return createPortal(
    <div className="rsd-overlay" role="dialog" aria-modal="true" aria-label="Demo Cambios de Estructura y Nómina (datos ficticios)">
      <div className="rsd-player">
        {/* Barra del reproductor de Power Apps */}
        <div className="rsd-player-bar">
          <span className="rsd-pa-logo" aria-hidden="true" />
          <span className="rsd-player-name">Power Apps</span>
          <span className="rsd-player-sep">|</span>
          <span className="rsd-player-app">Cambios de Estructura y Nómina</span>
          <span className="rsd-demo-badge">
            <Info size={13} /> Datos ficticios
          </span>
          <button className="rsd-close" onClick={onClose} aria-label="Cerrar demostración">
            <X size={18} />
          </button>
        </div>

        <div className="rsd-app">
          <aside className="rsd-sidebar">
            <div className="rsd-brand">
              <span className="rsd-brand-mark" aria-hidden="true">
                <Factory size={20} />
              </span>
              <span className="rsd-brand-text">
                <strong>Planta Envigado</strong>
                <span>Producción · Estructura</span>
              </span>
            </div>
            <nav className="rsd-nav" aria-label="Menú de la app">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  className={`rsd-nav-item ${view === n.id ? 'rsd-nav-item--active' : ''}`}
                  aria-current={view === n.id ? 'page' : undefined}
                  onClick={() => setView(n.id)}
                >
                  {n.icon}
                  <span>{n.label}</span>
                  {n.id === 'bandeja' && pendingByRole[role] > 0 && <span className="rsd-nav-count">{pendingByRole[role]}</span>}
                </button>
              ))}
            </nav>
          </aside>

          <div className="rsd-main">
            <header className="rsd-topbar">
              <h2 className="rsd-view-title">{NAV.find((n) => n.id === view)!.label}</h2>
              <label className="rsd-role">
                <UserCog size={16} aria-hidden="true" />
                <span className="rsd-sr-only">Ver la app como</span>
                <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  <option value="rrhh">RRHH · {HR_MANAGER} ({pendingByRole.rrhh})</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      Jefe {d.short} · {d.boss} ({pendingByRole[d.id]})
                    </option>
                  ))}
                </select>
              </label>
              <button className="rsd-flow-btn" onClick={() => openFlow()}>
                <Workflow size={16} aria-hidden="true" /> Flujo en Power Automate
              </button>
            </header>

            <main className="rsd-content">
              {view === 'panel' && <PanelView requests={requests} activity={activity} onOpen={setSelectedId} />}
              {view === 'bandeja' && (
                <InboxView
                  role={role}
                  items={inbox}
                  pendingByRole={pendingByRole}
                  onRole={setRole}
                  onDecide={decide}
                  onOpen={setSelectedId}
                />
              )}
              {view === 'solicitudes' && (
                <RequestsView
                  requests={requests}
                  search={search}
                  setSearch={setSearch}
                  stage={stageFilter}
                  setStage={setStageFilter}
                  onOpen={setSelectedId}
                />
              )}
              {view === 'nueva' && <NewRequestView onSubmit={create} />}
            </main>
          </div>
        </div>

        {/* Navegación inferior en móvil */}
        <nav className="rsd-tabbar" aria-label="Menú de la app (móvil)">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={view === n.id ? 'rsd-tab--active' : ''}
              aria-current={view === n.id ? 'page' : undefined}
              aria-label={n.label}
              onClick={() => setView(n.id)}
            >
              {n.icon}
              <span>{n.short}</span>
              {n.id === 'bandeja' && pendingByRole[role] > 0 && <span className="rsd-nav-count">{pendingByRole[role]}</span>}
            </button>
          ))}
        </nav>

        {selected && (
          <DetailDrawer
            r={selected}
            role={role}
            onClose={() => setSelectedId(null)}
            onDecide={decide}
            onRole={setRole}
            onFlow={() => openFlow(selected.id)}
          />
        )}

        <div className={`rsd-toast ${toast ? 'rsd-toast--show' : ''}`} role="status" aria-live="polite">
          <CircleCheck size={16} aria-hidden="true" /> {toast}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ---------------------------------------------------------------- Panel */

const PanelView: React.FC<{ requests: ChangeRequest[]; activity: ActivityItem[]; onOpen: (id: string) => void }> = ({
  requests,
  activity,
  onOpen,
}) => {
  const stages = requests.map(stageOf);
  const open = stages.filter((s) => s === 'rrhh' || s === 'jefes').length;
  const applied = requests.filter((r) => r.payrollAt);
  const avgMin = applied.length
    ? applied.reduce((s, r) => s + (r.payrollAt!.getTime() - r.createdAt.getTime()) / 60000, 0) / applied.length
    : 0;
  const payrollDelta = applied.reduce((s, r) => s + salaryOf(r.toLevel) - salaryOf(r.employee.level), 0);

  const pipeline: RequestStage[] = ['rrhh', 'jefes', 'aplicado', 'rechazado'];

  return (
    <>
      <div className="rsd-access">
        <ShieldCheck size={16} /> Solo Recursos Humanos y los jefes de área de Producción tienen acceso a esta app.
      </div>

      <section className="rsd-kpis" aria-label="Indicadores">
        <div className="rsd-kpi">
          <span>
            <Users size={15} /> Empleados en planta
          </span>
          <strong>{TOTAL_EMPLOYEES}</strong>
          <small>2 turnos · 4 departamentos</small>
        </div>
        <div className="rsd-kpi">
          <span>
            <Clock size={15} /> Solicitudes abiertas
          </span>
          <strong>{open}</strong>
          <small>{stages.filter((s) => s === 'rrhh').length} en RRHH · {stages.filter((s) => s === 'jefes').length} con jefes</small>
        </div>
        <div className="rsd-kpi rsd-kpi--accent">
          <span>
            <Timer size={15} /> Tiempo promedio de aprobación
          </span>
          <strong>{avgMin ? fmtDuration(new Date(0), new Date(avgMin * 60000)) : '—'}</strong>
          <small>Antes: hasta ~14 h en papel</small>
        </div>
        <div className="rsd-kpi">
          <span>
            <Wallet size={15} /> Impacto en nómina
          </span>
          <strong>+{formatCOP(payrollDelta)}</strong>
          <small>Mensual, cambios aplicados</small>
        </div>
      </section>

      <section className="rsd-card">
        <div className="rsd-card-head">
          <Factory size={18} />
          <h3>Departamentos de Producción</h3>
        </div>
        <div className="rsd-depts">
          {DEPARTMENTS.map((d) => {
            const total = d.headcount[0] + d.headcount[1];
            const live = requests.filter((r) => needsIncoming(r) && (stageOf(r) === 'rrhh' || stageOf(r) === 'jefes'));
            const out = live.filter((r) => r.employee.dept === d.id).length;
            const inc = live.filter((r) => r.toDept === d.id).length;
            return (
              <div key={d.id} className={`rsd-dept rsd-dept--${d.id}`}>
                <div className="rsd-dept-top">
                  <strong>{d.name}</strong>
                  <span>{total}</span>
                </div>
                <div className="rsd-shift-bar" aria-label={`Turno 1: ${d.headcount[0]}, turno 2: ${d.headcount[1]}`}>
                  <span style={{ width: `${(d.headcount[0] / total) * 100}%` }} />
                </div>
                <div className="rsd-dept-meta">
                  <span>T1 · {d.headcount[0]}</span>
                  <span>T2 · {d.headcount[1]}</span>
                </div>
                <div className="rsd-dept-boss">Jefe: {d.boss}</div>
                <div className="rsd-dept-transit">
                  <span>↑ {out} salen</span>
                  <span>↓ {inc} llegan</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="rsd-two-col">
        <section className="rsd-card">
          <div className="rsd-card-head">
            <ListChecks size={18} />
            <h3>Flujo de solicitudes</h3>
          </div>
          <div className="rsd-pipeline">
            {pipeline.map((s) => (
              <div key={s} className={`rsd-pipe rsd-pipe--${s}`}>
                <strong>{stages.filter((x) => x === s).length}</strong>
                <span>{STAGE_LABEL[s]}</span>
              </div>
            ))}
          </div>
          <ul className="rsd-mini-list">
            {requests.slice(0, 5).map((r) => (
              <li key={r.id}>
                <button onClick={() => onOpen(r.id)}>
                  <span className="rsd-mini-id">{r.id}</span>
                  <span className="rsd-mini-name">{r.employee.name}</span>
                  <ChangeSummary r={r} />
                  <StageBadge stage={stageOf(r)} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rsd-card">
          <div className="rsd-card-head">
            <Bell size={18} />
            <h3>Actividad y avisos</h3>
          </div>
          <ul className="rsd-activity">
            {activity.slice(0, 9).map((a) => (
              <li key={a.id} className={`rsd-act rsd-act--${a.kind}`}>
                <span className="rsd-act-dot" aria-hidden="true" />
                <span className="rsd-act-text">{a.text}</span>
                <time>{fmtDateTime(a.at)}</time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

/* ---------------------------------------------------------------- Bandeja */

const InboxView: React.FC<{
  role: Role;
  items: { r: ChangeRequest; step: Step }[];
  pendingByRole: Record<Role, number>;
  onRole: (role: Role) => void;
  onDecide: (r: ChangeRequest, step: Step, approve: boolean) => void;
  onOpen: (id: string) => void;
}> = ({ role, items, pendingByRole, onRole, onDecide, onOpen }) => {
  const others = (['rrhh', ...DEPARTMENTS.map((d) => d.id)] as Role[]).filter((r) => r !== role && pendingByRole[r] > 0);
  return (
    <>
      <p className="rsd-view-sub">
        Viendo como <strong>{roleLabel(role)}</strong>
      </p>
      {items.length === 0 ? (
        <div className="rsd-empty-card">
          <CircleCheck size={28} />
          <strong>No tienes aprobaciones pendientes</strong>
          {others.length > 0 && (
            <>
              <span>Hay solicitudes esperando a otros responsables:</span>
              <div className="rsd-chip-row">
                {others.map((o) => (
                  <button key={o} className="rsd-chip-btn" onClick={() => onRole(o)}>
                    {o === 'rrhh' ? 'RRHH' : `Jefe ${dept(o).short}`} · {pendingByRole[o]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="rsd-inbox">
          {items.map(({ r, step }) => {
            const from = dept(r.employee.dept);
            const to = dept(r.toDept);
            const diff = salaryOf(r.toLevel) - salaryOf(r.employee.level);
            return (
              <article key={`${r.id}-${step}`} className="rsd-inbox-card">
                <div className="rsd-inbox-head">
                  <span className="rsd-avatar">{initials(r.employee.name)}</span>
                  <div>
                    <strong>{r.employee.name}</strong>
                    <span>
                      {r.id} · {CHANGE_TYPES[r.type]} · hace {fmtDuration(r.createdAt, new Date())}
                    </span>
                  </div>
                </div>
                <p className="rsd-inbox-msg">
                  {step === 'rrhh' && `Solicitud de ${CHANGE_TYPES[r.type].toLowerCase()} para revisar y aprobar.`}
                  {step === 'outgoing' &&
                    (needsIncoming(r)
                      ? `Uno de tus empleados se va a ${to.name} (turno ${r.toShift}).`
                      : `Cambio dentro de tu área: ${r.employee.position} → ${r.toPosition}.`)}
                  {step === 'incoming' && `Llega a tu departamento un empleado desde ${from.name} (turno ${r.employee.shift}).`}
                </p>
                <div className="rsd-inbox-grid">
                  <div>
                    <span>Movimiento</span>
                    <ChangeSummary r={r} />
                  </div>
                  <div>
                    <span>Cargo</span>
                    <strong>{r.toPosition} · N{r.toLevel}</strong>
                  </div>
                  <div>
                    <span>Nuevo salario</span>
                    <strong>
                      {formatCOP(salaryOf(r.toLevel))}
                      {diff > 0 && <em className="rsd-up"> +{Math.round((diff / salaryOf(r.employee.level)) * 100)}%</em>}
                    </strong>
                  </div>
                </div>
                <div className="rsd-inbox-actions">
                  <button className="rsd-btn-ghost" onClick={() => onOpen(r.id)}>
                    Ver detalle
                  </button>
                  <button className="rsd-btn-danger" onClick={() => onDecide(r, step, false)}>
                    <CircleX size={16} /> Rechazar
                  </button>
                  <button className="rsd-btn-primary" onClick={() => onDecide(r, step, true)}>
                    <CircleCheck size={16} /> Aprobar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

/* ---------------------------------------------------------------- Solicitudes */

const RequestsView: React.FC<{
  requests: ChangeRequest[];
  search: string;
  setSearch: (v: string) => void;
  stage: RequestStage | '';
  setStage: (v: RequestStage | '') => void;
  onOpen: (id: string) => void;
}> = ({ requests, search, setSearch, stage, setStage, onOpen }) => {
  const q = search.trim().toLowerCase();
  const rows = requests.filter(
    (r) =>
      (!q || r.employee.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) &&
      (!stage || stageOf(r) === stage)
  );
  return (
    <>
      <div className="rsd-filters">
        <label className="rsd-search">
          <Search size={16} aria-hidden="true" />
          <span className="rsd-sr-only">Buscar</span>
          <input type="search" placeholder="Buscar por nombre o código…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <span className="rsd-sr-only">Estado</span>
          <select className="rsd-input" value={stage} onChange={(e) => setStage(e.target.value as RequestStage | '')}>
            <option value="">Todos los estados</option>
            {(Object.keys(STAGE_LABEL) as RequestStage[]).map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="rsd-card rsd-card--flush">
        <div className="rsd-table-wrap">
          <table className="rsd-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Empleado</th>
                <th>Tipo de cambio</th>
                <th>Movimiento</th>
                <th>Salario</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => onOpen(r.id)}>
                  {/* data-label: en celular cada fila se muestra como tarjeta con la etiqueta de cada dato */}
                  <td className="rsd-td-id">
                    <button onClick={() => onOpen(r.id)}>{r.id}</button>
                  </td>
                  <td className="rsd-td-name">
                    <strong>{r.employee.name}</strong>
                    <span className="rsd-td-sub">
                      {r.employee.position} · T{r.employee.shift}
                    </span>
                  </td>
                  <td data-label="Tipo">{CHANGE_TYPES[r.type]}</td>
                  <td data-label="Movimiento">
                    <ChangeSummary r={r} />
                  </td>
                  <td className="rsd-td-money" data-label="Salario">
                    {formatCOP(salaryOf(r.employee.level))}
                    <span className="rsd-td-sub">→ {formatCOP(salaryOf(r.toLevel))}</span>
                  </td>
                  <td className="rsd-td-stage">
                    <StageBadge stage={stageOf(r)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="rsd-empty">No hay solicitudes con estos filtros.</p>}
        </div>
      </section>
    </>
  );
};

/* ---------------------------------------------------------------- Nueva solicitud */

const NewRequestView: React.FC<{
  onSubmit: (r: Omit<ChangeRequest, 'id' | 'createdAt' | 'rrhh' | 'outgoing' | 'incoming'>) => void;
}> = ({ onSubmit }) => {
  const [employeeId, setEmployeeId] = useState(EMPLOYEES[2].id);
  const employee = EMPLOYEES.find((e) => e.id === employeeId)!;
  const [type, setType] = useState<ChangeType>('traslado');
  const [toDept, setToDept] = useState<DeptId>('pintura');
  const [toShift, setToShift] = useState<Shift>(employee.shift);
  const [toPosition, setToPosition] = useState(employee.position);
  const [toLevel, setToLevel] = useState(employee.level);
  const [reason, setReason] = useState('');

  // Sugiere el destino según el tipo de cambio
  const applyDefaults = (e = employee, t = type) => {
    const posIdx = POSITIONS.indexOf(e.position);
    setToShift(e.shift);
    if (t === 'traslado') {
      setToDept(DEPARTMENTS.find((d) => d.id !== e.dept)!.id);
      setToPosition(e.position);
      setToLevel(e.level);
    } else {
      setToDept(e.dept);
      if (t === 'nivel') {
        setToPosition(e.position);
        setToLevel(Math.min(5, e.level + 1));
      } else if (t === 'ascenso') {
        setToPosition(POSITIONS[Math.min(POSITIONS.length - 2, posIdx + 1)]);
        setToLevel(Math.min(5, e.level + 1));
      } else {
        setToPosition('Jefe de área');
        setToLevel(6);
      }
    }
  };

  const current = salaryOf(employee.level);
  const next = salaryOf(toLevel);
  const diff = next - current;
  const unchanged =
    toDept === employee.dept && toShift === employee.shift && toPosition === employee.position && toLevel === employee.level;
  const valid = !unchanged && reason.trim().length >= 5;
  const moving = toDept !== employee.dept;

  return (
    <form
      className="rsd-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSubmit({ employee, type, toDept, toShift, toPosition, toLevel, reason: reason.trim() });
      }}
    >
      <section className="rsd-card">
        <div className="rsd-card-head">
          <Users size={18} />
          <h3>Empleado</h3>
        </div>
        <div className="rsd-form-grid">
          <label className="rsd-field rsd-field--wide">
            <span>Empleado</span>
            <select
              className="rsd-input"
              value={employeeId}
              onChange={(e) => {
                const emp = EMPLOYEES.find((x) => x.id === Number(e.target.value))!;
                setEmployeeId(emp.id);
                applyDefaults(emp);
              }}
            >
              {EMPLOYEES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} · {e.name}
                </option>
              ))}
            </select>
          </label>
          <div className="rsd-current">
            <div>
              <span>Departamento</span>
              <strong>{dept(employee.dept).name}</strong>
            </div>
            <div>
              <span>Turno</span>
              <strong>Turno {employee.shift}</strong>
            </div>
            <div>
              <span>Cargo / nivel</span>
              <strong>
                {employee.position} · N{employee.level}
              </strong>
            </div>
            <div>
              <span>Salario actual</span>
              <strong>{formatCOP(current)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="rsd-card">
        <div className="rsd-card-head">
          <ArrowRight size={18} />
          <h3>Cambio solicitado</h3>
        </div>
        <fieldset className="rsd-types">
          <legend className="rsd-sr-only">Tipo de cambio</legend>
          {(Object.keys(CHANGE_TYPES) as ChangeType[]).map((t) => (
            <label key={t} className={`rsd-type ${type === t ? 'rsd-type--active' : ''}`}>
              <input
                type="radio"
                name="rsd-type"
                value={t}
                checked={type === t}
                onChange={() => {
                  setType(t);
                  applyDefaults(employee, t);
                }}
              />
              {CHANGE_TYPES[t]}
            </label>
          ))}
        </fieldset>
        <div className="rsd-form-grid">
          <label className="rsd-field">
            <span>Departamento destino</span>
            <select className="rsd-input" value={toDept} onChange={(e) => setToDept(e.target.value as DeptId)}>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="rsd-field">
            <span>Turno</span>
            <select className="rsd-input" value={toShift} onChange={(e) => setToShift(Number(e.target.value) as Shift)}>
              <option value={1}>Turno 1 · 6:00 – 14:00</option>
              <option value={2}>Turno 2 · 14:00 – 22:00</option>
            </select>
          </label>
          <label className="rsd-field">
            <span>Nuevo cargo</span>
            <select className="rsd-input" value={toPosition} onChange={(e) => setToPosition(e.target.value)}>
              {POSITIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="rsd-field">
            <span>Nivel salarial</span>
            <select className="rsd-input" value={toLevel} onChange={(e) => setToLevel(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>
                  N{l} · {formatCOP(salaryOf(l))}
                </option>
              ))}
            </select>
          </label>
          <label className="rsd-field rsd-field--wide">
            <span>Justificación</span>
            <textarea
              className="rsd-input"
              rows={3}
              placeholder="Ej.: refuerzo de la línea por aumento de cadencia…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="rsd-card rsd-impact">
        <div className="rsd-card-head">
          <Wallet size={18} />
          <h3>Impacto en nómina</h3>
        </div>
        <div className="rsd-impact-row">
          <div>
            <span>Actual</span>
            <strong>{formatCOP(current)}</strong>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
          <div>
            <span>Nuevo</span>
            <strong>{formatCOP(next)}</strong>
          </div>
          <div className={`rsd-impact-diff ${diff > 0 ? 'rsd-up' : diff < 0 ? 'rsd-down' : ''}`}>
            {diff === 0 ? 'Sin cambio salarial' : `${diff > 0 ? '+' : ''}${formatCOP(diff)} / mes`}
          </div>
        </div>
        <p className="rsd-impact-note">
          Aprobadores: <strong>RRHH</strong> → <strong>{dept(employee.dept).boss}</strong> (jefe actual)
          {moving && (
            <>
              {' '}y <strong>{dept(toDept).boss}</strong> (jefe nuevo)
            </>
          )}
          . La novedad se registra en nómina al completar las aprobaciones.
        </p>
      </section>

      <div className="rsd-form-actions">
        {unchanged && <span className="rsd-hint">Elige al menos un cambio respecto a la situación actual.</span>}
        {!unchanged && !valid && <span className="rsd-hint">Escribe una justificación para enviar.</span>}
        <button type="submit" className="rsd-btn-primary" disabled={!valid}>
          <Send size={16} /> Enviar a RRHH
        </button>
      </div>
    </form>
  );
};

/* ---------------------------------------------------------------- Detalle */

const DetailDrawer: React.FC<{
  r: ChangeRequest;
  role: Role;
  onClose: () => void;
  onDecide: (r: ChangeRequest, step: Step, approve: boolean) => void;
  onRole: (role: Role) => void;
  onFlow: () => void;
}> = ({ r, role, onClose, onDecide, onRole, onFlow }) => {
  const from = dept(r.employee.dept);
  const to = dept(r.toDept);
  const stage = stageOf(r);
  const mine = actionableSteps(r, role);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), [r.id]);

  const steps: { key: Step | 'payroll'; title: string; who: string; status: string; at?: Date; owner?: Role }[] = [
    { key: 'rrhh', title: 'Aprobación de RRHH', who: HR_MANAGER, status: r.rrhh.status, at: r.rrhh.at, owner: 'rrhh' },
    {
      key: 'outgoing',
      title: needsIncoming(r) ? 'Jefe actual (salida)' : 'Jefe del área',
      who: `${from.boss} · ${from.name}`,
      status: r.rrhh.status === 'aprobado' ? r.outgoing.status : 'espera',
      at: r.outgoing.at,
      owner: from.id,
    },
  ];
  if (needsIncoming(r))
    steps.push({
      key: 'incoming',
      title: 'Jefe nuevo (llegada)',
      who: `${to.boss} · ${to.name}`,
      status: r.rrhh.status === 'aprobado' ? r.incoming.status : 'espera',
      at: r.incoming.at,
      owner: to.id,
    });
  steps.push({
    key: 'payroll',
    title: 'Novedad de nómina',
    who: 'Registro automático',
    status: r.payrollAt ? 'aprobado' : stage === 'rechazado' ? 'cancelado' : 'espera',
    at: r.payrollAt,
  });
  if (stage === 'rechazado')
    steps.forEach((s) => (s.status === 'espera' || s.status === 'pendiente') && (s.status = 'cancelado'));

  return (
    <div className="rsd-drawer-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="rsd-drawer" role="dialog" aria-modal="true" aria-labelledby="rsd-drawer-title">
        <div className="rsd-drawer-head">
          <div>
            <span className="rsd-drawer-id">{r.id}</span>
            <h3 id="rsd-drawer-title">{r.employee.name}</h3>
            <span className="rsd-drawer-sub">
              Cód. {r.employee.id} · {CHANGE_TYPES[r.type]}
            </span>
          </div>
          <button ref={closeRef} className="rsd-close rsd-close--dark" onClick={onClose} aria-label="Cerrar detalle">
            <X size={18} />
          </button>
        </div>

        <StageBadge stage={stage} />

        <div className="rsd-compare">
          <div>
            <span className="rsd-compare-label">Actual</span>
            <strong>{from.name}</strong>
            <span>
              {r.employee.position} · N{r.employee.level}
            </span>
            <span>Turno {r.employee.shift}</span>
            <span className="rsd-compare-money">{formatCOP(salaryOf(r.employee.level))}</span>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
          <div>
            <span className="rsd-compare-label">Nuevo</span>
            <strong>{to.name}</strong>
            <span>
              {r.toPosition} · N{r.toLevel}
            </span>
            <span>Turno {r.toShift}</span>
            <span className="rsd-compare-money">{formatCOP(salaryOf(r.toLevel))}</span>
          </div>
        </div>

        <p className="rsd-reason">
          <strong>Justificación:</strong> {r.reason}
        </p>

        <h4 className="rsd-drawer-section">Aprobaciones</h4>
        <ol className="rsd-timeline">
          {steps.map((s) => (
            <li key={s.key} className={`rsd-step rsd-step--${s.status}`}>
              <span className="rsd-step-dot" aria-hidden="true">
                {s.status === 'aprobado' ? <CircleCheck size={16} /> : s.status === 'rechazado' ? <CircleX size={16} /> : null}
              </span>
              <div className="rsd-step-body">
                <strong>{s.title}</strong>
                <span>{s.who}</span>
                <span className="rsd-step-status">
                  {s.status === 'aprobado' && s.at && `Aprobado ${fmtDateTime(s.at)} · ${fmtDuration(r.createdAt, s.at)} desde la solicitud`}
                  {s.status === 'rechazado' && s.at && `Rechazado ${fmtDateTime(s.at)}`}
                  {s.status === 'pendiente' && 'Pendiente'}
                  {s.status === 'espera' && 'En espera'}
                  {s.status === 'cancelado' && 'Cancelado'}
                </span>
                {s.status === 'pendiente' && s.owner && s.owner !== role && (
                  <button className="rsd-link" onClick={() => onRole(s.owner!)}>
                    Ver como {s.owner === 'rrhh' ? 'RRHH' : dept(s.owner).boss} para aprobar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="rsd-drawer-created">Creada {fmtDateTime(r.createdAt)}</p>
        <button className="rsd-link rsd-drawer-flow" onClick={onFlow}>
          <Workflow size={14} aria-hidden="true" /> Ver el flujo de Power Automate de esta solicitud
        </button>

        {mine.length > 0 && (
          <div className="rsd-drawer-actions">
            {mine.map((step) => (
              <div key={step} className="rsd-drawer-action">
                <button className="rsd-btn-danger" onClick={() => onDecide(r, step, false)}>
                  Rechazar
                </button>
                <button className="rsd-btn-primary" onClick={() => onDecide(r, step, true)}>
                  <CircleCheck size={16} /> {STEP_LABEL[step]}
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};
