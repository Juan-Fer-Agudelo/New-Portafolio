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
  Lock,
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

/* ==========================================================================
   Demo del módulo "Registro Horario" del ERP The Efficient Business System
   de Farmacias MasSalud. Todos los datos son FICTICIOS y se generan aquí
   para la demostración; no hay conexión con ningún sistema real.
   ========================================================================== */

interface DemoEmployee {
  name: string;
  code: number;
  dept: string;
  expected: string; // HH:MM
}

interface DemoRecord {
  id: string;
  employee: DemoEmployee;
  date: Date;
  iso: string; // YYYY-MM-DD
  markedSec: number;
  lateMin: number; // 0 = a tiempo
}

const FICTITIOUS_TIP = 'Empleado ficticio para demostración';

const EMPLOYEES: DemoEmployee[] = [
  { name: 'Valentina Rojas', code: 16, dept: 'Dependientes', expected: '07:45' },
  { name: 'Mateo Peralta', code: 21, dept: 'Dependientes', expected: '07:45' },
  { name: 'Camila Báez', code: 24, dept: 'Caja', expected: '08:00' },
  { name: 'Luis Almonte', code: 31, dept: 'Farmacia', expected: '07:30' },
  { name: 'Sofía Guzmán', code: 33, dept: 'Caja', expected: '08:00' },
  { name: 'Andrés Tejada', code: 38, dept: 'Almacén', expected: '07:00' },
  { name: 'Paola Núñez', code: 42, dept: 'Farmacia', expected: '07:30' },
  { name: 'Kevin Mejía', code: 47, dept: 'Dependientes', expected: '07:45' },
  { name: 'Daniela Rosario', code: 52, dept: 'Administración', expected: '08:30' },
  { name: 'Ramón Cabrera', code: 55, dept: 'Almacén', expected: '07:00' },
  { name: 'Yesenia Polanco', code: 61, dept: 'Dependientes', expected: '07:45' },
  { name: 'Jorge Familia', code: 64, dept: 'Administración', expected: '08:30' },
];

const DEPARTMENTS = Array.from(new Set(EMPLOYEES.map((e) => e.dept)));

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Generador pseudoaleatorio con semilla: los datos son iguales en cada carga
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const toSec = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 3600 + m * 60;
};

const fmtSec = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};

const pad = (n: number) => String(n).padStart(2, '0');

const buildRecords = (): DemoRecord[] => {
  const rand = seeded(20261023);
  const records: DemoRecord[] = [];
  for (let day = 1; day <= 23; day++) {
    const date = new Date(2026, 9, day);
    if (date.getDay() === 0) continue; // domingo cerrado
    EMPLOYEES.forEach((employee) => {
      const late = rand() < 0.32;
      const offset = late
        ? (1 + Math.floor(rand() * 24)) * 60 + Math.floor(rand() * 60)
        : -Math.floor(rand() * 14 * 60);
      records.push({
        id: `${employee.code}-${day}`,
        employee,
        date,
        iso: `2026-10-${pad(day)}`,
        markedSec: toSec(employee.expected) + offset,
        lateMin: late ? Math.floor(offset / 60) : 0,
      });
    });
  }
  // Más recientes primero
  return records.sort((a, b) => b.date.getTime() - a.date.getTime() || a.employee.code - b.employee.code);
};

const ALL_RECORDS = buildRecords();

const EmployeeName: React.FC<{ name: string }> = ({ name }) => (
  <span className="msd-tip" tabIndex={0} data-tooltip={FICTITIOUS_TIP}>
    {name}
    <span className="msd-sr-only"> ({FICTITIOUS_TIP})</span>
  </span>
);

interface MasSaludDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasSaludDemo: React.FC<MasSaludDemoProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'notice' | 'demo'>('notice');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tableOpen, setTableOpen] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const noticeBtnRef = useRef<HTMLButtonElement>(null);
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
    setTimeout(() => noticeBtnRef.current?.focus(), 50);
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
    return createPortal(
      <div
        className="msd-overlay msd-overlay--center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="msd-notice-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="msd-notice">
          <button className="msd-notice-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
          <span className="msd-notice-icon" aria-hidden="true">
            <Lock size={22} />
          </span>
          <h2 id="msd-notice-title" className="msd-notice-title">
            ERP de uso empresarial privado
          </h2>
          <p className="msd-notice-text">
            The Efficient Business System es el ERP interno de Farmacias MasSalud y su uso es empresarial y
            privado. Para esta demostración se realizó una copia del módulo con información de ejemplo:
            todos los empleados, códigos y marcaciones que verás son ficticios.
          </p>
          <ul className="msd-notice-list">
            <li>Marcación de huella en Nteco → Zapier → alerta de llegada tarde en Slack del jefe.</li>
            <li>La misma marcación se registra en el módulo Registro Horario del ERP.</li>
            <li>Solo Recursos Humanos y la Gerencia General tienen acceso a este módulo.</li>
          </ul>
          <button ref={noticeBtnRef} className="msd-btn-primary" onClick={() => setStep('demo')}>
            Ver demostración
          </button>
        </div>
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
                          <td className="msd-td-name">
                            <EmployeeName name={r.employee.name} />
                          </td>
                          <td className="msd-td-code">{r.employee.code}</td>
                          <td>
                            {DAY_NAMES[r.date.getDay()]}, {r.date.getDate()} {MONTH_SHORT[r.date.getMonth()]}
                          </td>
                          <td>{r.employee.expected}:00</td>
                          <td>{fmtSec(r.markedSec)}</td>
                          <td>
                            {r.lateMin > 0 ? (
                              <span className="msd-status msd-status--late">Llegó tarde ({r.lateMin} min)</span>
                            ) : (
                              <span className="msd-status msd-status--ok">A tiempo</span>
                            )}
                          </td>
                          <td className="msd-td-dept">{r.employee.dept}</td>
                          <td>
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
          </main>
        </div>
      </div>
    </div>,
    document.body
  );
};
