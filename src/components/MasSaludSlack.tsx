import React, { useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  AtSign,
  BellOff,
  Bold,
  ChevronDown,
  Code,
  FileText,
  Headphones,
  Italic,
  Link,
  List,
  ListOrdered,
  ListFilter,
  Lock,
  MessageCircle,
  Mic,
  Pilcrow,
  Plus,
  Search,
  SendHorizontal,
  Smile,
  SquareCode,
  SquareSlash,
  Star,
  Strikethrough,
  TextQuote,
  Type,
  Underline,
  UserRound,
  Video,
  X,
} from 'lucide-react';
import { ALL_RECORDS, DemoRecord, EmployeeName, RightsNotice, fmtSec } from './massaludData';

/* Recreación del canal privado #registro-de-horario de Slack, donde Zapier
   publica las alertas de llegada tarde. Todos los datos son FICTICIOS. */

const CHANNEL = 'registro-de-horario';
const SHOWN_DAYS = ['2026-10-21', '2026-10-22', '2026-10-23'];
const DAY_LABEL: Record<string, string> = {
  '2026-10-21': 'miércoles, 21 de octubre',
  '2026-10-22': 'Ayer',
  '2026-10-23': 'Hoy',
};

interface MasSaludSlackProps {
  onBack: () => void;
  onClose: () => void;
}

// `continued`: mensaje seguido del mismo autor; en móvil se agrupa sin repetir avatar ni encabezado (como la app de Slack)
const SlackMessage: React.FC<{ record: DemoRecord; continued?: boolean }> = ({ record, continued = false }) => {
  const hhmm = fmtSec(record.markedSec).slice(0, 5);
  return (
    <article className={`msl-msg${continued ? ' msl-msg--cont' : ''}`}>
      <span className="msl-msg-avatar" aria-hidden="true">
        🕘
      </span>
      <div className="msl-msg-body">
        <div className="msl-msg-head">
          <strong className="msl-msg-author">MassSalud Fichajes</strong>
          <span className="msl-app-badge">APP</span>
          <time className="msl-msg-time">{hhmm}</time>
        </div>
        <p className="msl-line">
          <span aria-hidden="true">⚠️</span> <strong>Registro Horario — Llegada tarde detectada</strong>
        </p>
        <p className="msl-line">
          <span aria-hidden="true">👤</span> <EmployeeName name={record.employee.name} />
        </p>
        <p className="msl-line">
          <span aria-hidden="true">🏬</span> {record.employee.dept}
        </p>
        <p className="msl-line">
          <span aria-hidden="true">🕐</span> Fichó a las {fmtSec(record.markedSec)} (límite: {record.employee.expected}
          :00)
        </p>
        <p className="msl-line">
          <span aria-hidden="true">⏱️</span> Llegó <strong>{record.lateMin} min</strong> tarde
        </p>
        <p className="msl-line">
          <span aria-hidden="true">📅</span> {record.iso}
        </p>
        <span className="msl-sent-by">Sent by Zapier</span>
      </div>
    </article>
  );
};

export const MasSaludSlack: React.FC<MasSaludSlackProps> = ({ onBack, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Alertas de llegada tarde de los últimos 3 días, en orden cronológico
  const groups = useMemo(
    () =>
      SHOWN_DAYS.map((iso) => ({
        iso,
        label: DAY_LABEL[iso],
        records: ALL_RECORDS.filter((r) => r.iso === iso && r.lateMin > 0).sort((a, b) => a.markedSec - b.markedSec),
      })).filter((g) => g.records.length > 0),
    []
  );

  const total = groups.reduce((n, g) => n + g.records.length, 0);

  // Como en Slack, el canal abre mostrando los mensajes más recientes
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div className="msl-app">
      {/* Cabecera móvil (estilo app de Slack) */}
      <header className="msl-mobile-head">
        <button className="msl-mobile-icon" onClick={onBack} aria-label="Volver al ERP">
          <ArrowLeft size={22} />
        </button>
        <div className="msl-mobile-channel">
          <Lock size={17} strokeWidth={2.6} aria-hidden="true" />
          <span className="msl-mobile-channel-text">
            <strong>{CHANNEL}</strong>
            <span>
              2 miembros <ChevronDown size={12} aria-hidden="true" />
            </span>
          </span>
        </div>
        <span className="msl-mobile-icon" aria-hidden="true">
          <ListFilter size={21} />
        </span>
        <span className="msl-mobile-icon" aria-hidden="true">
          <Headphones size={21} />
        </span>
        <button className="msl-mobile-icon" onClick={onClose} aria-label="Cerrar demostración">
          <X size={21} />
        </button>
      </header>

      {/* Barra superior del workspace */}
      <header className="msl-topbar">
        <button className="msl-top-btn" onClick={onBack}>
          <ArrowLeft size={15} /> <span>Volver al ERP</span>
        </button>
        <div className="msl-search" aria-hidden="true">
          <Search size={14} />
          <span>Buscar en MasSalud</span>
        </div>
        <span className="msl-demo-pill">Datos ficticios · Demo</span>
        <button className="msl-top-btn msl-top-btn--icon" onClick={onClose} aria-label="Cerrar demostración">
          <X size={17} />
        </button>
      </header>

      {/* Cabecera del canal */}
      <div className="msl-channel-head">
        <div className="msl-channel-title">
          <Star size={17} aria-hidden="true" />
          <h2>
            <Lock size={15} strokeWidth={2.6} aria-hidden="true" />
            {CHANNEL}
          </h2>
        </div>
        <div className="msl-channel-actions" aria-hidden="true">
          <span>
            <UserRound size={17} /> 2
          </span>
          <span>
            <Headphones size={17} /> <ChevronDown size={13} />
          </span>
          <BellOff size={17} />
          <Search size={17} />
        </div>
      </div>

      <div className="msl-tabs" aria-hidden="true">
        <span className="msl-tab msl-tab--active">
          <MessageCircle size={14} /> Mensajes
        </span>
        <span className="msl-tab">
          <FileText size={14} /> Añadir canvas
        </span>
        <Plus size={16} />
      </div>

      {/* Mensajes */}
      <div className="msl-messages" ref={scrollRef} tabIndex={0} aria-label={`${total} alertas de llegada tarde (datos ficticios)`}>
        <div className="msl-fictitious">
          <strong>Demostración con datos ficticios.</strong> Ninguno de estos empleados ni marcaciones es real.
        </div>

        <div className="msl-channel-intro">
          <h3>
            <Lock size={18} strokeWidth={2.6} aria-hidden="true" /> {CHANNEL}
          </h3>
          <p>
            Canal privado donde Zapier publica una alerta cada vez que un empleado marca su huella en Nteco después
            de su hora límite. {total} alertas en los últimos 3 días.
          </p>
        </div>

        {groups.map((group) => (
          <section key={group.iso} className="msl-day" aria-label={group.label}>
            <div className="msl-divider">
              <span className="msl-day-pill">
                {group.label} <ChevronDown size={12} aria-hidden="true" />
              </span>
            </div>
            {group.records.map((record, i) => (
              <SlackMessage key={record.id} record={record} continued={i > 0} />
            ))}
          </section>
        ))}
      </div>

      {/* Compositor */}
      <footer className="msl-footer">
        <div className="msl-visibility">
          <span className="msl-visibility-logo" aria-hidden="true">
            <Plus size={11} strokeWidth={4} />
          </span>
          <strong>Massalud</strong>&nbsp;puede ver este canal
          <RightsNotice className="msd-rights--inline" />
        </div>
        {/* Compositor móvil */}
        <div className="msl-mobile-composer">
          <span className="msl-mobile-plus" aria-hidden="true">
            <Plus size={20} />
          </span>
          <label className="msd-sr-only" htmlFor="msl-input-mobile">
            Mensaje (deshabilitado en la demostración)
          </label>
          <input
            id="msl-input-mobile"
            className="msl-mobile-input"
            placeholder={`Enviar un mensaje a ${CHANNEL}`}
            disabled
          />
          <Mic size={20} aria-hidden="true" />
        </div>

        <div className="msl-composer">
          <div className="msl-toolbar" aria-hidden="true">
            <Bold size={15} />
            <Italic size={15} />
            <Underline size={15} />
            <Strikethrough size={15} />
            <Pilcrow size={15} />
            <span className="msl-sep" />
            <Link size={15} />
            <ListOrdered size={15} />
            <List size={15} />
            <span className="msl-sep" />
            <TextQuote size={15} />
            <Code size={15} />
            <SquareCode size={15} />
          </div>
          <label className="msd-sr-only" htmlFor="msl-input">
            Mensaje (deshabilitado en la demostración)
          </label>
          <input
            id="msl-input"
            className="msl-input"
            placeholder={`Enviar un mensaje a 🔒${CHANNEL}`}
            disabled
          />
          <div className="msl-composer-bottom" aria-hidden="true">
            <span className="msl-plus">
              <Plus size={15} />
            </span>
            <Type size={15} />
            <Smile size={15} />
            <AtSign size={15} />
            <span className="msl-sep" />
            <Video size={15} />
            <Mic size={15} />
            <span className="msl-sep" />
            <SquareSlash size={15} />
            <span className="msl-send">
              <SendHorizontal size={15} />
              <span className="msl-sep" />
              <ChevronDown size={13} />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
