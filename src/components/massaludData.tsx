import React from 'react';
import { TALENT_PHI_URL } from '../utils/textHighlight';

/* ==========================================================================
   Demo del módulo "Registro Horario" del ERP The Efficient Business System
   de Farmacias MasSalud. Todos los datos son FICTICIOS y se generan aquí
   para la demostración; no hay conexión con ningún sistema real.
   ========================================================================== */

export interface DemoEmployee {
  name: string;
  code: number;
  dept: string;
  expected: string; // HH:MM
}

export interface DemoRecord {
  id: string;
  employee: DemoEmployee;
  date: Date;
  iso: string; // YYYY-MM-DD
  markedSec: number;
  lateMin: number; // 0 = a tiempo
}

export const FICTITIOUS_TIP = 'Empleado ficticio para demostración';

export const EMPLOYEES: DemoEmployee[] = [
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

export const DEPARTMENTS = Array.from(new Set(EMPLOYEES.map((e) => e.dept)));

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MONTH_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

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

export const fmtSec = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};

export const pad = (n: number) => String(n).padStart(2, '0');

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

export const ALL_RECORDS = buildRecords();

/** Aviso de derechos reservados para Talent Phi, mostrado en los avisos y vistas de la demo. */
export const RightsNotice: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`msd-rights ${className}`.trim()}>
    © Todos los derechos reservados son reservados para{' '}
    <a href={TALENT_PHI_URL} target="_blank" rel="noopener noreferrer">
      Talent Phi
    </a>
    .
  </p>
);

/** Nombre de empleado con tooltip "Empleado ficticio para demostración". */
export const EmployeeName: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => (
  <span className={`msd-tip ${className}`.trim()} tabIndex={0} data-tooltip={FICTITIOUS_TIP}>
    {name}
    <span className="msd-sr-only"> ({FICTITIOUS_TIP})</span>
  </span>
);
