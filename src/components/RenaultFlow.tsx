import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Braces,
  Check,
  CircleX,
  Clock,
  Diamond,
  FlaskConical,
  Grid3x3,
  Info,
  Mail,
  Maximize,
  Minus,
  Plus,
  Reply,
  Search,
  Split,
  Table,
  UserRound,
  X,
} from 'lucide-react';
import '../styles/renault-flow.css';

import {
  CHANGE_TYPES,
  ChangeRequest,
  HR_MANAGER,
  dept,
  formatCOP,
  needsIncoming,
  salaryOf,
} from './renaultData';

/* Réplica del flujo de Power Automate que se dispara cuando la app de Power Apps envía una
   solicitud de cambio: aprobación de RRHH y correos al jefe actual y al jefe nuevo.
   Todo es una simulación con datos ficticios; ver renaultData.ts. */

interface RenaultFlowProps {
  requests: ChangeRequest[];
  initialId?: string;
  onBack: () => void;
  onClose: () => void;
}

type StepId = 'trigger' | 'init' | 'jefeActual' | 'jefeNuevo' | 'aprobacion' | 'condicion' | 'mailSale' | 'mailLlega' | 'mailArea' | 'nomina' | 'mailRechazo' | 'respuesta';
type Status = 'idle' | 'running' | 'waiting' | 'success' | 'skipped';
type Tab = 'disenador' | 'correos';

interface Step {
  id: StepId;
  title: string;
  connector: string;
  icon: React.ReactNode;
  color: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

interface SentMail {
  id: string;
  kind: 'aprobacion' | 'sale' | 'llega' | 'area' | 'rechazo';
  to: string;
  toEmail: string;
  subject: string;
  at: Date;
}

const DOMAIN = 'empresa-demo.co';
const emailOf = (name: string) => {
  const parts = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(' ');
  return `${parts[0][0]}.${parts[parts.length - 1]}@${DOMAIN}`;
};
const HR_EMAIL = emailOf(HR_MANAGER);
const fmtTime = (d: Date) => d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', second: '2-digit' });

/** Pasos del flujo para una solicitud (los textos y datos cambian según la solicitud) */
const stepsFor = (r: ChangeRequest, rejected: boolean): Record<StepId, Step> => {
  const from = dept(r.employee.dept);
  const to = dept(r.toDept);
  const moving = needsIncoming(r);
  const solicitud = {
    id: r.id,
    empleado: r.employee.name,
    codigo: r.employee.id,
    tipo: CHANGE_TYPES[r.type],
    departamentoActual: from.name,
    departamentoNuevo: to.name,
    cargoNuevo: `${r.toPosition} · N${r.toLevel}`,
    turnoNuevo: r.toShift,
    salarioActual: salaryOf(r.employee.level),
    salarioNuevo: salaryOf(r.toLevel),
  };
  const profile = (name: string, area: string) => ({ displayName: name, mail: emailOf(name), jobTitle: `Jefe de ${area}`, department: area });
  return {
    trigger: {
      id: 'trigger',
      title: 'Cuando Power Apps envía la solicitud',
      connector: 'Power Apps (V2)',
      icon: <Diamond size={16} />,
      color: '#742774',
      inputs: { Origen: 'App «Cambios de Estructura y Nómina»', Parámetros: 'solicitudId (texto), creadaPor (correo)' },
      outputs: { solicitudId: r.id, creadaPor: emailOf(from.boss) },
    },
    init: {
      id: 'init',
      title: 'Inicializar variable · Solicitud',
      connector: 'Variables',
      icon: <Braces size={16} />,
      color: '#770bd6',
      inputs: { Nombre: 'Solicitud', Tipo: 'Objeto' },
      outputs: solicitud,
    },
    jefeActual: {
      id: 'jefeActual',
      title: 'Obtener perfil del jefe actual (V2)',
      connector: 'Office 365 Users',
      icon: <UserRound size={16} />,
      color: '#d83b01',
      inputs: { Usuario: `Jefe de ${from.name}` },
      outputs: profile(from.boss, from.name),
    },
    jefeNuevo: {
      id: 'jefeNuevo',
      title: 'Obtener perfil del jefe nuevo (V2)',
      connector: 'Office 365 Users',
      icon: <UserRound size={16} />,
      color: '#d83b01',
      inputs: { Usuario: `Jefe de ${to.name}` },
      outputs: profile(to.boss, to.name),
    },
    aprobacion: {
      id: 'aprobacion',
      title: 'Iniciar y esperar una aprobación · RRHH',
      connector: 'Approvals',
      icon: <BadgeCheck size={16} />,
      color: '#0078d4',
      inputs: {
        'Tipo de aprobación': 'Aprobar/rechazar: primero en responder',
        Título: `${CHANGE_TYPES[r.type]} de ${r.employee.name} (${r.id})`,
        'Asignado a': HR_EMAIL,
      },
      outputs: { outcome: rejected ? 'Reject' : 'Approve', respondedBy: HR_MANAGER, comments: rejected ? 'Falta soporte del cambio' : 'Aprobado' },
    },
    condicion: {
      id: 'condicion',
      title: '¿RRHH aprobó?',
      connector: 'Condición',
      icon: <Split size={16} />,
      color: '#484644',
      inputs: { Expresión: "outputs('Aprobación_RRHH')?['body/outcome']  es igual a  'Approve'" },
      outputs: { resultado: !rejected },
    },
    mailSale: {
      id: 'mailSale',
      title: 'Enviar correo (V2) · Jefe actual',
      connector: 'Office 365 Outlook',
      icon: <Mail size={16} />,
      color: '#0078d4',
      inputs: { Para: emailOf(from.boss), Asunto: `Sale de tu área: ${r.employee.name} pasa a ${to.name}` },
      outputs: { status: 200, enviado: true },
    },
    mailLlega: {
      id: 'mailLlega',
      title: 'Enviar correo (V2) · Jefe nuevo',
      connector: 'Office 365 Outlook',
      icon: <Mail size={16} />,
      color: '#0078d4',
      inputs: { Para: emailOf(to.boss), Asunto: `Llega a tu área: ${r.employee.name} desde ${from.name}` },
      outputs: { status: 200, enviado: true },
    },
    mailArea: {
      id: 'mailArea',
      title: 'Enviar correo (V2) · Jefe del área',
      connector: 'Office 365 Outlook',
      icon: <Mail size={16} />,
      color: '#0078d4',
      inputs: { Para: emailOf(from.boss), Asunto: `Cambio en tu área: ${CHANGE_TYPES[r.type].toLowerCase()} de ${r.employee.name}` },
      outputs: { status: 200, enviado: true },
    },
    nomina: {
      id: 'nomina',
      title: 'Registrar novedad de nómina',
      connector: 'Tabla de novedades',
      icon: <Table size={16} />,
      color: '#107c41',
      inputs: { Empleado: r.employee.id, 'Salario nuevo': formatCOP(salaryOf(r.toLevel)), Vigencia: 'Próximo corte de nómina' },
      outputs: { status: 'Registrada', diferencia: formatCOP(salaryOf(r.toLevel) - salaryOf(r.employee.level)) },
    },
    mailRechazo: {
      id: 'mailRechazo',
      title: 'Enviar correo (V2) · Solicitud rechazada',
      connector: 'Office 365 Outlook',
      icon: <Mail size={16} />,
      color: '#a4262c',
      inputs: { Para: emailOf(from.boss), Asunto: `Solicitud rechazada: ${r.id}` },
      outputs: { status: 200, enviado: true },
    },
    respuesta: {
      id: 'respuesta',
      title: 'Responder a Power Apps',
      connector: 'Power Apps',
      icon: <Reply size={16} />,
      color: '#742774',
      inputs: { estado: rejected ? 'Rechazada' : moving ? 'Aprobada · jefes notificados' : 'Aprobada · jefe notificado' },
      outputs: { status: 200 },
    },
  };
};

/** Orden de ejecución y momento (ms) en que arranca cada paso */
const planFor = (r: ChangeRequest, rejected: boolean): [StepId, number, number][] => {
  const moving = needsIncoming(r);
  const plan: [StepId, number, number][] = [
    ['trigger', 0, 450],
    ['init', 600, 350],
    ['jefeActual', 1100, 500],
  ];
  let t = 1100;
  if (moving) plan.push(['jefeNuevo', (t += 650), 500]);
  plan.push(['aprobacion', (t += 650), 2200]); // espera la respuesta de RRHH
  plan.push(['condicion', (t += 2400), 300]);
  t += 450;
  if (rejected) {
    plan.push(['mailRechazo', t, 600], ['respuesta', t + 800, 300]);
  } else {
    if (moving) plan.push(['mailSale', t, 600], ['mailLlega', t, 700]); // rama paralela
    else plan.push(['mailArea', t, 600]);
    plan.push(['nomina', t + 850, 500], ['respuesta', t + 1500, 300]);
  }
  return plan;
};

export const RenaultFlow: React.FC<RenaultFlowProps> = ({ requests, initialId, onBack, onClose }) => {
  const [requestId, setRequestId] = useState(initialId ?? requests[0]?.id);
  const [rejected, setRejected] = useState(false);
  const [tab, setTab] = useState<Tab>('disenador');
  const [status, setStatus] = useState<Partial<Record<StepId, Status>>>({});
  const [running, setRunning] = useState(false);
  const [mails, setMails] = useState<SentMail[]>([]);
  const [openStep, setOpenStep] = useState<StepId | null>(null);
  const [openMail, setOpenMail] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const timers = useRef<number[]>([]);

  const r = requests.find((x) => x.id === requestId) ?? requests[0];
  const steps = stepsFor(r, rejected);
  const moving = needsIncoming(r);
  const from = dept(r.employee.dept);
  const to = dept(r.toDept);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const reset = () => {
    clear();
    setStatus({});
    setMails([]);
    setRunning(false);
    setOpenStep(null);
    setOpenMail(null);
  };

  const showMails = () => {
    setOpenStep(null);
    setTab('correos');
  };

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const run = () => {
    reset();
    setRunning(true);
    setTab('disenador');
    const plan = planFor(r, rejected);
    const mail = (m: Omit<SentMail, 'id' | 'at'>) =>
      setMails((prev) => [...prev, { ...m, id: `${m.kind}-${Date.now()}`, at: new Date() }]);
    // Correo que envía cada paso de Outlook al terminar
    const mailOf: Partial<Record<StepId, Omit<SentMail, 'id' | 'at'>>> = {
      mailSale: { kind: 'sale', to: from.boss, toEmail: emailOf(from.boss), subject: String(steps.mailSale.inputs.Asunto) },
      mailLlega: { kind: 'llega', to: to.boss, toEmail: emailOf(to.boss), subject: String(steps.mailLlega.inputs.Asunto) },
      mailArea: { kind: 'area', to: from.boss, toEmail: emailOf(from.boss), subject: String(steps.mailArea.inputs.Asunto) },
      mailRechazo: { kind: 'rechazo', to: from.boss, toEmail: emailOf(from.boss), subject: String(steps.mailRechazo.inputs.Asunto) },
    };

    plan.forEach(([id, start, dur]) => {
      at(start, () => setStatus((s) => ({ ...s, [id]: id === 'aprobacion' ? 'waiting' : 'running' })));
      at(start + dur, () => {
        setStatus((s) => ({ ...s, [id]: 'success' }));
        const m = mailOf[id];
        if (m) mail(m);
      });
    });
    // El correo de aprobación le llega a RRHH apenas empieza la espera
    const approvalStart = plan.find(([id]) => id === 'aprobacion')![1];
    at(approvalStart + 250, () =>
      mail({ kind: 'aprobacion', to: HR_MANAGER, toEmail: HR_EMAIL, subject: `Aprobación requerida: ${steps.aprobacion.inputs.Título}` })
    );
    // Los pasos de la rama que no se ejecuta quedan marcados como omitidos
    const executed = new Set(plan.map(([id]) => id));
    const branch: StepId[] = ['mailSale', 'mailLlega', 'mailArea', 'nomina', 'mailRechazo'];
    const end = Math.max(...plan.map(([, s, d]) => s + d));
    at(end, () => {
      setStatus((s) => ({ ...s, ...Object.fromEntries(branch.filter((b) => !executed.has(b)).map((b) => [b, 'skipped'])) }));
      setRunning(false);
    });
  };

  // Al cambiar de solicitud o del caso de rechazo, se limpia la ejecución anterior
  useEffect(() => {
    reset();
  }, [requestId, rejected]); // eslint-disable-line react-hooks/exhaustive-deps

  const st = (id: StepId) => status[id] ?? 'idle';
  const ran = Object.keys(status).length > 0;

  const card = (id: StepId) => {
    const s = steps[id];
    const state = st(id);
    return (
      <button
        key={id}
        className={`rpf-card rpf-card--${state} ${openStep === id ? 'rpf-card--open' : ''}`}
        style={{ ['--c' as string]: s.color }}
        onClick={() => setOpenStep(id)}
        aria-label={`${s.title} (${s.connector})`}
      >
        <span className="rpf-card-icon">{s.icon}</span>
        <span className="rpf-card-text">
          <strong>{s.title}</strong>
          <span>{s.connector}</span>
        </span>
        <span className="rpf-card-state" aria-hidden="true">
          {state === 'success' && <Check size={13} strokeWidth={3} />}
          {state === 'running' && <span className="rpf-spin" />}
          {state === 'waiting' && <Clock size={13} />}
          {state === 'skipped' && <Minus size={13} />}
        </span>
      </button>
    );
  };
  const link = (key: string) => (
    <span key={key} className="rpf-link" aria-hidden="true">
      <i className="rpf-plus">
        <Plus size={11} />
      </i>
    </span>
  );

  const approvalWaiting = st('aprobacion') === 'waiting';
  const step = openStep ? steps[openStep] : null;
  const mail = mails.find((m) => m.id === openMail) ?? mails[mails.length - 1] ?? null;

  return (
    <div className="rpf-root">
      {/* Barra superior de Power Automate */}
      <header className="rpf-top">
        <Grid3x3 size={18} aria-hidden="true" />
        <strong className="rpf-brand">Power Automate</strong>
        <span className="rpf-search" aria-hidden="true">
          <Search size={14} /> Buscar
        </span>
        <span className="rpf-env">
          <span>Entornos</span>
          <strong>Renault Sofasa (demo)</strong>
        </span>
        <span className="rpf-badge">
          <Info size={13} /> Datos ficticios
        </span>
        <button className="rpf-close" onClick={onClose} aria-label="Cerrar demostración">
          <X size={18} />
        </button>
      </header>

      <div className="rpf-sub">
        <button className="rpf-back" onClick={onBack}>
          <ArrowLeft size={16} /> Volver a la app
        </button>
        <span className="rpf-flow-name">Cambios de estructura · Aprobación y avisos</span>
        <div className="rpf-tabs" role="tablist" aria-label="Vistas del flujo">
          <button role="tab" aria-selected={tab === 'disenador'} onClick={() => setTab('disenador')}>
            Diseñador
          </button>
          <button role="tab" aria-selected={tab === 'correos'} onClick={() => showMails()}>
            <Mail size={14} /> Correos {mails.length > 0 && <em>{mails.length}</em>}
          </button>
        </div>
      </div>

      <div className="rpf-controls">
        <label className="rpf-select">
          <span>Solicitud</span>
          <select value={requestId} onChange={(e) => setRequestId(e.target.value)} disabled={running}>
            {requests.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id} · {x.employee.name} · {CHANGE_TYPES[x.type]}
              </option>
            ))}
          </select>
        </label>
        <label className="rpf-toggle">
          <input type="checkbox" checked={rejected} onChange={(e) => setRejected(e.target.checked)} disabled={running} />
          Simular rechazo de RRHH
        </label>
        <button className="rpf-test" onClick={run} disabled={running}>
          <FlaskConical size={16} /> {running ? 'Ejecutando…' : 'Probar flujo'}
        </button>
      </div>

      {approvalWaiting && (
        <div className="rpf-banner" role="status">
          <Clock size={16} />
          <span>Esperando la respuesta de {HR_MANAGER} (RRHH)… el correo de aprobación ya está en su bandeja.</span>
        </div>
      )}
      {!running && ran && (
        <div className={`rpf-banner ${rejected ? 'rpf-banner--bad' : 'rpf-banner--ok'}`} role="status">
          {rejected ? <CircleX size={16} /> : <Check size={16} />}
          <span>
          {rejected
            ? 'Ejecución correcta: RRHH rechazó y se avisó al jefe actual.'
            : moving
              ? `Ejecución correcta: se enviaron 3 correos (RRHH, ${from.boss} y ${to.boss}).`
              : `Ejecución correcta: se enviaron 2 correos (RRHH y ${from.boss}).`}
          </span>
          <button onClick={() => showMails()}>Ver correos</button>
        </div>
      )}

      <div className="rpf-body">
      {tab === 'disenador' ? (
        <div className="rpf-canvas">
          <div className="rpf-flow" style={{ transform: `scale(${zoom})` }}>
            {card('trigger')}
            {link('l1')}
            {card('init')}
            {link('l2')}
            {moving ? (
              <>
                {/* Rama paralela: se consultan los dos perfiles al mismo tiempo */}
                <div className="rpf-parallel">
                  {card('jefeActual')}
                  {card('jefeNuevo')}
                </div>
              </>
            ) : (
              card('jefeActual')
            )}
            {link('l3')}
            {card('aprobacion')}
            {link('l4')}

            <div className={`rpf-cond rpf-cond--${st('condicion')}`}>
              <button className="rpf-cond-head" onClick={() => setOpenStep('condicion')}>
                <Split size={15} /> Condición · ¿RRHH aprobó?
                {st('condicion') === 'success' && <Check size={13} strokeWidth={3} />}
              </button>
              <div className="rpf-branches">
                <div className={`rpf-branch rpf-branch--true ${ran && rejected ? 'rpf-branch--off' : ''}`}>
                  <span className="rpf-branch-tag">Verdadero</span>
                  {moving ? (
                    <div className="rpf-parallel">
                      {card('mailSale')}
                      {card('mailLlega')}
                    </div>
                  ) : (
                    card('mailArea')
                  )}
                  {link('l5')}
                  {card('nomina')}
                </div>
                <div className={`rpf-branch rpf-branch--false ${ran && !rejected ? 'rpf-branch--off' : ''}`}>
                  <span className="rpf-branch-tag">Falso</span>
                  {card('mailRechazo')}
                </div>
              </div>
            </div>

            {link('l6')}
            {card('respuesta')}
          </div>

          <div className="rpf-zoom">
            <button onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} aria-label="Acercar">
              <Plus size={16} />
            </button>
            <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))} aria-label="Alejar">
              <Minus size={16} />
            </button>
            <button onClick={() => setZoom(1)} aria-label="Tamaño original">
              <Maximize size={15} />
            </button>
          </div>
        </div>
      ) : (
        <MailView mails={mails} selected={mail} onSelect={setOpenMail} r={r} rejected={rejected} approved={st('condicion') === 'success'} />
      )}

      {step && (
        <aside className="rpf-panel" role="dialog" aria-label={step.title}>
          <header style={{ ['--c' as string]: step.color }}>
            <span className="rpf-card-icon">{step.icon}</span>
            <div>
              <strong>{step.title}</strong>
              <span>{step.connector}</span>
            </div>
            <button className="rpf-close rpf-close--dark" onClick={() => setOpenStep(null)} aria-label="Cerrar panel">
              <X size={16} />
            </button>
          </header>
          <h4>Entradas</h4>
          <dl>
            {Object.entries(step.inputs).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{String(v)}</dd>
              </div>
            ))}
          </dl>
          <h4>Salidas</h4>
          {st(step.id) === 'success' ? (
            <pre>{JSON.stringify(step.outputs, null, 2)}</pre>
          ) : (
            <p className="rpf-muted">
              {st(step.id) === 'skipped' ? 'Este paso no se ejecutó: el flujo tomó la otra rama.' : 'Pulsa «Probar flujo» para ver las salidas de este paso.'}
            </p>
          )}
        </aside>
      )}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- Correos */

const MailView: React.FC<{
  mails: SentMail[];
  selected: SentMail | null;
  onSelect: (id: string) => void;
  r: ChangeRequest;
  rejected: boolean;
  approved: boolean;
}> = ({ mails, selected, onSelect, r, rejected, approved }) => {
  const [listOpen, setListOpen] = useState(false);
  if (!mails.length)
    return (
      <div className="rpf-mail-empty">
        <Mail size={26} />
        <strong>Todavía no se ha enviado ningún correo</strong>
        <span>Pulsa «Probar flujo» y vuelve aquí para ver lo que recibe RRHH, el jefe actual y el jefe nuevo.</span>
      </div>
    );
  return (
    <div className="rpf-mail">
      <ul className={`rpf-mail-list ${listOpen ? 'rpf-mail-list--open' : ''}`}>
        {mails.map((m) => (
          <li key={m.id}>
            <button
              className={selected?.id === m.id ? 'rpf-mail-item rpf-mail-item--active' : 'rpf-mail-item'}
              onClick={() => {
                onSelect(m.id);
                setListOpen(false);
              }}
            >
              <span className={`rpf-mail-tag rpf-mail-tag--${m.kind}`}>{MAIL_TAG[m.kind]}</span>
              <strong>{m.to}</strong>
              <span>{m.subject}</span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="rpf-mail-read">
          <button className="rpf-mail-back" onClick={() => setListOpen(true)}>
            ← Correos enviados ({mails.length})
          </button>
          <MailBody m={selected} r={r} rejected={rejected} approved={approved} />
        </div>
      )}
    </div>
  );
};

const MAIL_TAG: Record<SentMail['kind'], string> = {
  aprobacion: 'RRHH · Aprobación',
  sale: 'Jefe actual · Sale',
  llega: 'Jefe nuevo · Llega',
  area: 'Jefe del área',
  rechazo: 'Rechazo',
};

const MailBody: React.FC<{ m: SentMail; r: ChangeRequest; rejected: boolean; approved: boolean }> = ({ m, r, rejected, approved }) => {
  const from = dept(r.employee.dept);
  const to = dept(r.toDept);
  const first = m.to.split(' ')[0];
  const row = (k: string, v: React.ReactNode) => (
    <tr key={k}>
      <th>{k}</th>
      <td>{v}</td>
    </tr>
  );

  return (
    <article className="rpf-letter">
      <h3>{m.subject}</h3>
      <div className="rpf-letter-head">
        <span className="rpf-letter-avatar">PA</span>
        <div>
          <strong>Power Automate</strong>
          <span>
            Para: {m.to} &lt;{m.toEmail}&gt;
          </span>
        </div>
        <time>{fmtTime(m.at)}</time>
      </div>

      {m.kind === 'aprobacion' && (
        <div className="rpf-letter-body">
          <p>
            Hola {first}, la app <strong>Cambios de Estructura y Nómina</strong> envió una solicitud que requiere tu aprobación.
          </p>
          <table className="rpf-letter-table">
            <tbody>
              {row('Solicitud', `${r.id} · ${CHANGE_TYPES[r.type]}`)}
              {row('Empleado', `${r.employee.name} (cód. ${r.employee.id})`)}
              {row('Actual', `${from.name} · ${r.employee.position} N${r.employee.level} · Turno ${r.employee.shift}`)}
              {row('Nuevo', `${to.name} · ${r.toPosition} N${r.toLevel} · Turno ${r.toShift}`)}
              {row('Salario', `${formatCOP(salaryOf(r.employee.level))} → ${formatCOP(salaryOf(r.toLevel))}`)}
              {row('Justificación', r.reason)}
            </tbody>
          </table>
          <div className="rpf-letter-actions">
            <span className={`rpf-fake-btn rpf-fake-btn--ok ${approved && !rejected ? 'rpf-fake-btn--chosen' : ''}`}>Aprobar</span>
            <span className={`rpf-fake-btn rpf-fake-btn--bad ${approved && rejected ? 'rpf-fake-btn--chosen' : ''}`}>Rechazar</span>
          </div>
          {approved && (
            <p className={rejected ? 'rpf-letter-bad' : 'rpf-letter-ok'}>
              {rejected ? 'Rechazaste esta solicitud.' : 'Aprobaste esta solicitud. Se avisó a los jefes involucrados.'}
            </p>
          )}
        </div>
      )}

      {m.kind === 'sale' && (
        <div className="rpf-letter-body">
          <p>Hola {first},</p>
          <p>
            RRHH aprobó un cambio de estructura: <strong>{r.employee.name}</strong>, de tu equipo de <strong>{from.name}</strong>,{' '}
            <strong>sale de tu área</strong> y pasa a <strong>{to.name}</strong>.
          </p>
          <div className="rpf-person rpf-person--out">
            <span className="rpf-person-avatar">{initials(r.employee.name)}</span>
            <div>
              <strong>{r.employee.name}</strong>
              <span>
                Cód. {r.employee.id} · {r.employee.position} · Turno {r.employee.shift}
              </span>
            </div>
            <span className="rpf-person-move">
              {from.short} → {to.short}
            </span>
          </div>
          <table className="rpf-letter-table">
            <tbody>
              {row('Destino', `${to.name} · jefe: ${to.boss}`)}
              {row('Cargo en el destino', `${r.toPosition} · Turno ${r.toShift}`)}
              {row('Vigencia', 'Desde el próximo corte de nómina')}
            </tbody>
          </table>
          <p>Por favor coordina la entrega de su puesto y su reemplazo en el turno {r.employee.shift}.</p>
        </div>
      )}

      {m.kind === 'llega' && (
        <div className="rpf-letter-body">
          <p>Hola {first},</p>
          <p>
            RRHH aprobó un cambio de estructura: <strong>{r.employee.name}</strong> <strong>llega a tu área de {to.name}</strong>{' '}
            desde <strong>{from.name}</strong>.
          </p>
          <div className="rpf-person rpf-person--in">
            <span className="rpf-person-avatar">{initials(r.employee.name)}</span>
            <div>
              <strong>{r.employee.name}</strong>
              <span>
                Cód. {r.employee.id} · viene de {from.name} (jefe: {from.boss})
              </span>
            </div>
            <span className="rpf-person-move">
              {from.short} → {to.short}
            </span>
          </div>
          <table className="rpf-letter-table">
            <tbody>
              {row('Cargo', `${r.toPosition} · nivel ${r.toLevel}`)}
              {row('Turno', `Turno ${r.toShift}`)}
              {row('Vigencia', 'Desde el próximo corte de nómina')}
            </tbody>
          </table>
          <p>Por favor prepara su puesto de trabajo, inducción y dotación en {to.name}.</p>
        </div>
      )}

      {m.kind === 'area' && (
        <div className="rpf-letter-body">
          <p>Hola {first},</p>
          <p>
            RRHH aprobó un cambio dentro de tu área de <strong>{from.name}</strong>: {CHANGE_TYPES[r.type].toLowerCase()} de{' '}
            <strong>{r.employee.name}</strong>.
          </p>
          <table className="rpf-letter-table">
            <tbody>
              {row('Antes', `${r.employee.position} · N${r.employee.level}`)}
              {row('Ahora', `${r.toPosition} · N${r.toLevel} · Turno ${r.toShift}`)}
              {row('Vigencia', 'Desde el próximo corte de nómina')}
            </tbody>
          </table>
        </div>
      )}

      {m.kind === 'rechazo' && (
        <div className="rpf-letter-body">
          <p>Hola {first},</p>
          <p>
            RRHH <strong>rechazó</strong> la solicitud {r.id} ({CHANGE_TYPES[r.type].toLowerCase()} de {r.employee.name}).
            Comentario de {HR_MANAGER}: «Falta soporte del cambio».
          </p>
          <p>El empleado se mantiene en {from.name} sin cambios en su cargo ni en su salario.</p>
        </div>
      )}
      <p className="rpf-letter-foot">Correo automático enviado por un flujo de Power Automate · datos ficticios.</p>
    </article>
  );
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((n) => n[0])
    .join('');
