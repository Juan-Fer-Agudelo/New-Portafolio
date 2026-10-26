/* ==========================================================================
   Demo del reporte de Looker Studio "Calidad de pintura" de Renault Sofasa.
   Todos los vehículos, defectos y fechas son FICTICIOS y se generan aquí
   para la demostración; no hay conexión con ningún sistema real.
   ========================================================================== */

export type UetId = 'trim' | 'mecanica' | 'final' | 'entregas';
export type Shift = 1 | 2;
export type Severity = 'Menor' | 'Mayor' | 'Crítico';

/** Las 4 UET (Unidad Elemental de Trabajo) de Ensamble, en el orden de la línea */
export const UETS: { id: UetId; name: string }[] = [
  { id: 'trim', name: 'Trim' },
  { id: 'mecanica', name: 'Mecánica' },
  { id: 'final', name: 'Final' },
  { id: 'entregas', name: 'Entregas' },
];

export const ZONES = [
  'Capó',
  'Techo',
  'Puerta del. izq.',
  'Puerta del. der.',
  'Puerta tras. izq.',
  'Puerta tras. der.',
  'Guardafangos',
  'Portón trasero',
  'Parachoques del.',
  'Parachoques tras.',
] as const;
export type Zone = (typeof ZONES)[number];

export const DEFECT_TYPES = [
  'Rayón',
  'Golpe / abolladura',
  'Desconchado',
  'Inclusión (grumo)',
  'Escurrido',
  'Piel de naranja',
  'Cráter',
  'Diferencia de tono',
] as const;
export type DefectType = (typeof DEFECT_TYPES)[number];

export const SHIFT_HOURS = ['1.ª h', '2.ª h', '3.ª h', '4.ª h', '5.ª h', '6.ª h', '7.ª h', '8.ª h'];

/** Meta de defectos por unidad (DPU) del departamento */
export const DPU_TARGET = 0.35;

export interface DefectRecord {
  id: string;
  date: Date;
  iso: string;
  shift: Shift;
  hour: number;
  uet: UetId;
  zone: Zone;
  type: DefectType;
  severity: Severity;
  vin: string;
}

export interface ShiftProduction {
  date: Date;
  iso: string;
  shift: Shift;
  vehicles: number;
}

// Generador pseudoaleatorio con semilla: los datos son iguales en cada carga
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const pick = <T,>(rand: () => number, items: readonly T[], weights: number[]) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
};

// Peso de cada UET y, dentro de cada UET, dónde y qué tipo de defecto aparece más
const UET_WEIGHT = [0.4, 0.22, 0.26, 0.12];
const ZONE_WEIGHTS: Record<UetId, number[]> = {
  //          capó techo pDI  pDD  pTI  pTD  guard portón pchD pchT
  trim: [2, 3, 14, 17, 10, 11, 3, 4, 2, 2],
  mecanica: [16, 2, 3, 3, 2, 2, 13, 3, 9, 6],
  final: [4, 3, 5, 5, 4, 4, 5, 12, 13, 14],
  entregas: [6, 9, 4, 4, 4, 4, 5, 5, 6, 6],
};
const TYPE_WEIGHTS: Record<UetId, number[]> = {
  //         rayón golpe desc incl escur piel cráter tono
  trim: [30, 14, 16, 6, 3, 3, 2, 2],
  mecanica: [16, 24, 18, 6, 3, 3, 3, 2],
  final: [22, 18, 14, 7, 4, 4, 3, 3],
  entregas: [10, 6, 6, 14, 10, 10, 8, 9],
};
// Más defectos en la primera hora y al final del turno
const HOUR_WEIGHTS = [16, 11, 10, 10, 11, 12, 14, 17];

export const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** 180 días hábiles de producción hacia atrás (para comparar periodos de hasta 90 días) */
const build = () => {
  const rand = seeded(20251015);
  const production: ShiftProduction[] = [];
  const defects: DefectRecord[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  for (let i = 1; days.length < 180; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.unshift(d);
  }
  let n = 0;
  days.forEach((date, di) => {
    const iso = isoOf(date);
    // La DPU baja con el tiempo: el tablero permitió atacar las zonas más críticas
    const baseDpu = 0.56 - (di / days.length) * 0.24;
    ([1, 2] as Shift[]).forEach((shift) => {
      const vehicles = 108 + Math.floor(rand() * 13);
      production.push({ date, iso, shift, vehicles });
      const dpu = baseDpu * (shift === 2 ? 1.08 : 1) * (0.8 + rand() * 0.4);
      const count = Math.round(vehicles * dpu);
      for (let k = 0; k < count; k++) {
        const uet = pick(rand, UETS, UET_WEIGHT).id;
        const sev = rand();
        defects.push({
          id: `D${++n}`,
          date,
          iso,
          shift,
          hour: SHIFT_HOURS.indexOf(pick(rand, SHIFT_HOURS, HOUR_WEIGHTS)),
          uet,
          zone: pick(rand, ZONES, ZONE_WEIGHTS[uet]),
          type: pick(rand, DEFECT_TYPES, TYPE_WEIGHTS[uet]),
          severity: sev < 0.7 ? 'Menor' : sev < 0.95 ? 'Mayor' : 'Crítico',
          vin: `VF1RJ${String(Math.floor(rand() * 900000) + 100000)}`,
        });
      }
    });
  });
  return { days, production, defects };
};

export const DATA = build();

export const fmtNum = (n: number, d = 0) => n.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtShortDate = (d: Date) => d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
