import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlarmClockOff,
  ArrowUpDown,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Info,
  LayoutGrid,
  Map as MapIcon,
  Moon,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/massalud-demo.css';

import {
  ALL_RECORDS,
  DAY_NAMES,
  DEPARTMENTS,
  DemoEmployee,
  EmployeeName,
  MONTH_SHORT,
  fmtSec,
} from './massaludData';
import { MasSaludSlack } from './MasSaludSlack';
import { RightsNotice } from './massaludData';
import { DemoNotice } from './DemoNotice';

/* Demo del ERP de Farmacias MasSalud (módulo Registro Horario + alertas en Slack).
   Todos los datos son ficticios; ver massaludData.tsx. */

interface MasSaludDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasSaludDemo: React.FC<MasSaludDemoProps> = ({ isOpen, onClose }) => {
  // notice → aviso inicial · demo → ERP · slack-notice → aviso de datos ficticios · slack → canal de Slack
  const [step, setStep] = useState<'notice' | 'demo' | 'slack-notice' | 'slack'>('notice');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tableOpen, setTableOpen] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Reinicia al abrir, bloquea el scroll del fondo y cierra con Escape
  useEffect(() => {
    if (!isOpen) return;
    setStep('notice');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.clearInterval(timer);
    };
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_RECORDS.filter(
      (r) =>
        (!q || r.employee.name.toLowerCase().includes(q)) &&
        (!dept || r.employee.dept === dept) &&
        (!from || r.iso >= from) &&
        (!to || r.iso <= to)
    );
  }, [search, dept, from, to]);

  const lateRecords = filtered.filter((r) => r.lateMin > 0);
  const kpis = {
    lateCount: lateRecords.length,
    lateEmployees: new Set(lateRecords.map((r) => r.employee.code)).size,
    lateMinutes: lateRecords.reduce((sum, r) => sum + r.lateMin, 0),
    punctuality: filtered.length
      ? Math.round(((filtered.length - lateRecords.length) / filtered.length) * 100)
      : 0,
  };

  // Resumen por empleado, ordenado por minutos de tardanza
  const summary = useMemo(() => {
    const map = new Map<number, { employee: DemoEmployee; total: number; late: number; minutes: number }>();
    filtered.forEach((r) => {
      const row = map.get(r.employee.code) ?? { employee: r.employee, total: 0, late: 0, minutes: 0 };
      row.total += 1;
      if (r.lateMin > 0) {
        row.late += 1;
        row.minutes += r.lateMin;
      }
      map.set(r.employee.code, row);
    });
    return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
  }, [filtered]);

  const maxMinutes = Math.max(1, ...summary.map((s) => s.minutes));

  if (!isOpen) return null;

  const clock = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const today = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  // Se renderiza en <body> para que ningún contenedor con transform/animación afecte al position: fixed
  if (step === 'notice') {
    return (
      <DemoNotice
        id="msd-notice-title"
        eyebrow="Farmacias MasSalud · Zapier + Slack"
        title="ERP de uso empresarial privado"
        points={[
          'Marcación de huella en Nteco → Zapier → alerta de llegada tarde en Slack del jefe.',
          'La misma marcación se registra en el módulo Registro Horario del ERP.',
          'Solo Recursos Humanos y la Gerencia General tienen acceso a este módulo.',
        ]}
        actions={[
          { label: 'Ver demostración del ERP', onClick: () => setStep('demo') },
          { label: 'Ver alertas en Slack', onClick: () => setStep('slack-notice') },
        ]}
        footer={<RightsNotice />}
        onClose={onClose}
      >
        The Efficient Business System es el ERP interno de Farmacias MasSalud y su uso es empresarial y privado. Para
        esta demostración se realizó una copia del módulo con información de ejemplo: todos los empleados, códigos y
        marcaciones que verás son ficticios.
      </DemoNotice>
    );
  }

  if (step === 'slack-notice') {
    return (
      <DemoNotice
        id="msd-slack-notice-title"
        eyebrow="Farmacias MasSalud · Slack"
        icon="info"
        title="Antes de continuar: todos los datos son ficticios"
        highlight={
          <>
            Los nombres, departamentos, horas y mensajes que vas a ver en Slack <strong>no son reales</strong>. Se
            crearon solo para esta demostración y no corresponden a ningún empleado de Farmacias MasSalud.
          </>
        }
        actions={[
          { label: 'Entendido, ver Slack', onClick: () => setStep('slack') },
          { label: 'Ir al ERP', onClick: () => setStep('demo') },
        ]}
        footer={<RightsNotice />}
        onClose={onClose}
      >
        La vista recrea el canal privado <strong>#registro-de-horario</strong>. Cada vez que un empleado marca su huella
        en Nteco y llega después de su hora límite, Zapier publica automáticamente una alerta como estas para que el jefe
        se entere en tiempo real.
      </DemoNotice>
    );
  }

  if (step === 'slack') {
    return createPortal(
      <div className="msd-overlay" role="dialog" aria-modal="true" aria-label="Demo de alertas en Slack (datos ficticios)">
        <MasSaludSlack onBack={() => setStep('demo')} onClose={onClose} />
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="msd-overlay" role="dialog" aria-modal="true" aria-label="Demo Registro Horario MasSalud">
      <div className="msd-app">
        {/* Barra lateral */}
        <aside className="msd-sidebar">
          <div className="msd-brand">
            <span className="msd-brand-cross" aria-hidden="true">
              <Plus size={30} strokeWidth={4} />
            </span>
            <span className="msd-brand-text">
              <span className="msd-brand-small">Farmacias</span>
              <span className="msd-brand-big">
                MAS<span>SALUD</span>
              </span>
            </span>
            <span className="msd-brand-collapse" aria-hidden="true">
              <ChevronLeft size={16} />
            </span>
          </div>

          <div className="msd-clock">
            <strong>{clock}</strong>
            <span>{today}</span>
          </div>

          <div className="msd-cash-btn" aria-hidden="true">
            <Wallet size={16} />
            <span>Cierre de Caja</span>
            <Plus size={16} />
          </div>

          <div className="msd-tiles" aria-hidden="true">
            <span className="msd-tile">
              <LayoutGrid size={18} />
              Principal
            </span>
            <span className="msd-tile">
              <CalendarDays size={18} />
              Horarios
            </span>
            <span className="msd-tile">
              <MapIcon size={18} />
              Planograma
            </span>
          </div>

          <nav className="msd-nav" aria-label="Menú del ERP (demostración)">
            <span className="msd-nav-item">
              <ShoppingCart size={16} /> Ventas <ChevronRight size={15} className="msd-nav-caret" />
            </span>
            <span className="msd-nav-item">
              <Wallet size={16} /> Caja <ChevronRight size={15} className="msd-nav-caret" />
            </span>
            <span className="msd-nav-item">
              <Users size={16} /> Gestión de Empleados <ChevronRight size={15} className="msd-nav-caret" />
            </span>
            <span className="msd-nav-item">
              <ArrowUpDown size={16} /> Tasa de Cambio
            </span>
            <span className="msd-nav-item msd-nav-item--active" aria-current="page">
              <AlarmClockOff size={16} /> Registro Horario
            </span>
            <span className="msd-nav-item">
              <CalendarClock size={16} /> Reglas de Horario
            </span>
            <span className="msd-nav-section">Configuración</span>
            <span className="msd-nav-item">
              <Settings size={16} /> Configuración
            </span>
          </nav>
        </aside>

        {/* Contenido principal */}
        <div className="msd-main">
          <header className="msd-topbar">
            <span className="msd-topbar-title">MasSalud</span>
            <span className="msd-demo-badge">
              <Info size={14} /> Datos ficticios
            </span>
            <div className="msd-topbar-actions">
              <button className="msd-slack-link" onClick={() => setStep('slack-notice')}>
                Ver alertas en Slack
              </button>
              <span className="msd-icon-btn" aria-hidden="true">
                <RefreshCw size={17} />
              </span>
              <span className="msd-icon-btn" aria-hidden="true">
                <Moon size={17} />
              </span>
              <span className="msd-user">
                <span className="msd-avatar">GG</span>
                <span className="msd-user-text">
                  <strong>Gerencia General</strong>
                  <span>Administrator</span>
                </span>
                <ChevronDown size={16} />
              </span>
              <button className="msd-close" onClick={onClose} aria-label="Cerrar demostración">
                <X size={20} />
              </button>
            </div>
          </header>

          <main className="msd-content">
            <div className="msd-page-head">
              <div>
                <h2 className="msd-page-title">
                  <AlarmClockOff size={24} /> Registro Horario
                </h2>
                <p className="msd-page-sub">Registro de marcaciones biométricas y control de asistencia</p>
              </div>
              <div className="msd-month">
                <button className="msd-square-btn" disabled aria-label="Mes anterior">
                  <ChevronLeft size={16} />
                </button>
                <strong>Octubre De 2026</strong>
                <button className="msd-square-btn" disabled aria-label="Mes siguiente">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* En móvil el botón de la barra superior no cabe: se muestra aquí a todo el ancho */}
            <button className="msd-slack-cta" onClick={() => setStep('slack-notice')}>
              <span className="msd-slack-cta-icon" aria-hidden="true">
                #
              </span>
              <span className="msd-slack-cta-text">
                <strong>Ver alertas en Slack</strong>
                <span>Notificaciones de llegada tarde enviadas por Zapier</span>
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>

            <div className="msd-access">
              <ShieldCheck size={16} />
              Módulo restringido: visible solo para Recursos Humanos y Gerencia General.
            </div>

            {/* Indicadores clave */}
            <section className="msd-kpis" aria-label="Indicadores clave">
              <div className="msd-kpi">
                <span>Llegadas tarde</span>
                <strong>{kpis.lateCount}</strong>
              </div>
              <div className="msd-kpi">
                <span>Empleados con tardanza</span>
                <strong>{kpis.lateEmployees}</strong>
              </div>
              <div className="msd-kpi">
                <span>Minutos acumulados</span>
                <strong>{kpis.lateMinutes} min</strong>
              </div>
              <div className="msd-kpi">
                <span>Puntualidad</span>
                <strong>{kpis.punctuality}%</strong>
              </div>
            </section>

            {/* Filtros */}
            <div className="msd-filters">
              <div className="msd-range">
                <label className="msd-sr-only" htmlFor="msd-from">
                  Desde
                </label>
                <input
                  id="msd-from"
                  type="date"
                  className="msd-input"
                  min="2026-10-01"
                  max="2026-10-31"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
                <span className="msd-range-sep">a</span>
                <label className="msd-sr-only" htmlFor="msd-to">
                  Hasta
                </label>
                <input
                  id="msd-to"
                  type="date"
                  className="msd-input"
                  min="2026-10-01"
                  max="2026-10-31"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <label className="msd-sr-only" htmlFor="msd-search">
                Buscar por nombre
              </label>
              <input
                id="msd-search"
                type="search"
                className="msd-input msd-input--search"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label className="msd-sr-only" htmlFor="msd-dept">
                Departamento
              </label>
              <select id="msd-dept" className="msd-input" value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="">Todos los departamentos</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Resumen por empleado */}
            <section className="msd-card">
              <div className="msd-card-head msd-card-head--static">
                <Users size={18} />
                <h3>Empleados</h3>
                <span className="msd-count">{summary.length}</span>
              </div>
              <div className="msd-emp-grid">
                {summary.map((s) => (
                  <div key={s.employee.code} className="msd-emp">
                    <span className="msd-emp-avatar" aria-hidden="true">
                      {s.employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                    <div className="msd-emp-body">
                      <EmployeeName name={s.employee.name} />
                      <span className="msd-emp-meta">
                        Cód. {s.employee.code} · {s.employee.dept}
                      </span>
                      <div className="msd-emp-bar" aria-hidden="true">
                        <span style={{ width: `${(s.minutes / maxMinutes) * 100}%` }} />
                      </div>
                      <span className="msd-emp-stats">
                        {s.late} tardanzas · {s.minutes} min · {s.total} marcaciones
                      </span>
                    </div>
                  </div>
                ))}
                {summary.length === 0 && <p className="msd-empty">No hay empleados con estos filtros.</p>}
              </div>
            </section>

            {/* Registro de fichajes */}
            <section className="msd-card">
              <button
                className="msd-card-head"
                onClick={() => setTableOpen((v) => !v)}
                aria-expanded={tableOpen}
              >
                <Clock size={18} />
                <h3>Registro de fichajes</h3>
                <span className="msd-count">{filtered.length}</span>
                {tableOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {tableOpen && (
                <div className="msd-table-wrap">
                  <table className="msd-table">
                    <thead>
                      <tr>
                        <th>Empleado</th>
                        <th>Código</th>
                        <th>Fecha</th>
                        <th>Hora esperada</th>
                        <th>Hora de marcación</th>
                        <th>Estado</th>
                        <th>Area/Dpto</th>
                        <th>
                          <span className="msd-sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.id}>
                          {/* data-label: en celular cada fichaje se muestra como tarjeta */}
                          <td className="msd-td-name">
                            <EmployeeName name={r.employee.name} />
                          </td>
                          <td className="msd-td-code" data-label="Código">
                            {r.employee.code}
                          </td>
                          <td data-label="Fecha">
                            {DAY_NAMES[r.date.getDay()]}, {r.date.getDate()} {MONTH_SHORT[r.date.getMonth()]}
                          </td>
                          <td data-label="Hora esperada">{r.employee.expected}:00</td>
                          <td data-label="Marcación">{fmtSec(r.markedSec)}</td>
                          <td className="msd-td-status">
                            {r.lateMin > 0 ? (
                              <span className="msd-status msd-status--late">Llegó tarde ({r.lateMin} min)</span>
                            ) : (
                              <span className="msd-status msd-status--ok">A tiempo</span>
                            )}
                          </td>
                          <td className="msd-td-dept" data-label="Área">
                            {r.employee.dept}
                          </td>
                          <td className="msd-td-actions">
                            <span className="msd-trash" aria-hidden="true">
                              <Trash2 size={15} />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && <p className="msd-empty">No hay marcaciones con estos filtros.</p>}
                </div>
              )}
            </section>

            <RightsNotice />
          </main>
        </div>
      </div>
    </div>,
    document.body
  );
};
