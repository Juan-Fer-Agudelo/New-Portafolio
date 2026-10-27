/* ==========================================================================
   Demo de la app (React Native, en tablets) del proceso de selección de
   operarios de Renault Sofasa: escuelas de destreza + RAC 5 (psicología).
   Todos los aspirantes, maestros, calificaciones y tiempos son FICTICIOS.
   ========================================================================== */

export type Station = 'ensamble' | 'dli' | 'soldadura' | 'pintura';
export type Jornada = 'Mañana' | 'Tarde';
export type Verdict = 'apto' | 'medio' | 'no';
export type Psych = 'favorable' | 'observaciones' | 'desfavorable';

export interface School {
  id: Station;
  name: string;
  test: string;
  /** Tiempo estándar de la prueba, en segundos */
  standard: number;
  masters: [string, string];
}

/** Las 4 escuelas de destreza, en el orden en que las recorren los grupos */
export const SCHOOLS: School[] = [
  { id: 'ensamble', name: 'Ensamble', test: 'Montaje de un subconjunto con torque', standard: 180, masters: ['Jaime Ospina', 'Lucía Bedoya'] },
  { id: 'dli', name: 'DLI', test: 'Armado de un kit de piezas (picking)', standard: 150, masters: ['Óscar Muñoz', 'Paola Quintero'] },
  { id: 'soldadura', name: 'Soldadura', test: 'Puntos de soldadura en probeta', standard: 240, masters: ['Ricardo Gil', 'Sandra Velásquez'] },
  { id: 'pintura', name: 'Pintura', test: 'Aplicación uniforme en panel de prueba', standard: 210, masters: ['Andrés Toro', 'Mónica Rendón'] },
];

export const RAC5 = { name: 'RAC 5', test: 'Evaluación psicológica', psychologists: ['Catalina Ríos', 'Natalia Uribe'] as [string, string] };

export const school = (id: Station) => SCHOOLS.find((s) => s.id === id)!;

/** Reglas de evaluación: calidad mínima (promedio de los 2 maestros) y tiempo frente al estándar */
export const RULES = { aptoQuality: 8, medioQuality: 6, medioTimeFactor: 1.2 };

export interface Grade {
  /** Calidad 0–10 de cada maestro */
  q1: number;
  q2: number;
  /** Tiempo de la prueba en segundos */
  time: number;
}

export interface Aspirant {
  id: string;
  name: string;
  doc: string;
  jornada: Jornada;
  group: string;
  grades: Partial<Record<Station, Grade>>;
  rac5?: Psych;
}

export const quality = (g: Grade) => (g.q1 + g.q2) / 2;

export const verdictOf = (station: Station, g: Grade): Verdict => {
  const std = school(station).standard;
  const q = quality(g);
  if (q >= RULES.aptoQuality && g.time <= std) return 'apto';
  if (q >= RULES.medioQuality && g.time <= std * RULES.medioTimeFactor) return 'medio';
  return 'no';
};

export const VERDICT_LABEL: Record<Verdict, string> = { apto: 'Apto', medio: 'Medianamente apto', no: 'No apto' };
export const PSYCH_LABEL: Record<Psych, string> = { favorable: 'Favorable', observaciones: 'Con observaciones', desfavorable: 'No favorable' };
export const PSYCH_TONE: Record<Psych, Verdict> = { favorable: 'apto', observaciones: 'medio', desfavorable: 'no' };

export type Placement = { tone: Verdict | 'pendiente'; label: string };

/** Lo que calcula el sistema con las 4 escuelas y la RAC 5 */
export const placementOf = (a: Aspirant): Placement => {
  const done = SCHOOLS.every((s) => a.grades[s.id]) && a.rac5;
  if (!done) return { tone: 'pendiente', label: 'En proceso' };
  if (a.rac5 === 'desfavorable') return { tone: 'no', label: 'No apto (RAC 5)' };
  const verdicts = SCHOOLS.map((s) => ({ s, v: verdictOf(s.id, a.grades[s.id]!) }));
  const green = verdicts.filter((x) => x.v === 'apto').map((x) => x.s.name);
  if (green.length === SCHOOLS.length) return { tone: 'apto', label: 'Apto para todas las áreas' };
  if (green.length) return { tone: 'apto', label: `Apto para ${green.join(', ')}` };
  if (verdicts.some((x) => x.v === 'medio')) return { tone: 'medio', label: 'En espera · llamar si se necesita' };
  return { tone: 'no', label: 'No apto para ninguna área' };
};

export const fmtTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

// Generador pseudoaleatorio con semilla: los resultados son iguales en cada carga
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const NAMES = [
  'Juan David Arias', 'Laura Cardona', 'Brayan Gallego', 'Yuliana Pérez', 'Kevin Álvarez', 'Daniela Hoyos',
  'Sebastián Mesa', 'Valentina Zuluaga', 'Cristian Marín', 'Manuela Agudelo', 'Jhon Fredy Ramírez', 'Sara Betancur',
  'Felipe Correa', 'Alejandra Vargas', 'Esteban Montoya', 'Luisa Fernanda Gómez', 'Andrés Castaño', 'Paula Restrepo',
  'Mateo Jaramillo', 'Camila Henao', 'Duván Echeverri', 'Isabela Tobón', 'Santiago Úsuga', 'Mariana Londoño',
];

export const GROUPS: { id: string; jornada: Jornada }[] = [
  { id: 'M-1', jornada: 'Mañana' },
  { id: 'M-2', jornada: 'Mañana' },
  { id: 'M-3', jornada: 'Mañana' },
  { id: 'T-1', jornada: 'Tarde' },
  { id: 'T-2', jornada: 'Tarde' },
  { id: 'T-3', jornada: 'Tarde' },
];

/** El último grupo de la tarde aún no ha sido calificado: es el que se califica en la demo */
export const PENDING_GROUP = 'T-3';

export const suggestGrade = (rand: () => number, station: Station): Grade => {
  const std = school(station).standard;
  const base = 5 + rand() * 5;
  const q = (d: number) => Math.max(3, Math.min(10, Math.round(base + d)));
  return { q1: q(rand() - 0.5), q2: q(rand() - 0.5), time: Math.round((std * (0.75 + rand() * 0.6)) / 5) * 5 };
};

/**
 * Calificación de un aspirante según su destreza general (0–1): así hay personas aptas para todas
 * las áreas, otras para ninguna y otras que quedan aptas para unas y no para otras.
 */
const gradeFor = (rand: () => number, station: Station, skill: number): Grade => {
  const std = school(station).standard;
  const base = 4 + skill * 6 + (rand() - 0.5) * 2.4;
  const q = () => Math.max(3, Math.min(10, Math.round(base + (rand() - 0.5))));
  const factor = 1.3 - skill * 0.5 + (rand() - 0.5) * 0.25;
  return { q1: q(), q2: q(), time: Math.round((std * factor) / 5) * 5 };
};

export const buildAspirants = (): Aspirant[] => {
  const rand = seeded(20250610);
  return NAMES.map((name, i) => {
    const g = GROUPS[Math.floor(i / 4)];
    const pending = g.id === PENDING_GROUP;
    const skill = rand();
    const grades: Partial<Record<Station, Grade>> = {};
    if (!pending) SCHOOLS.forEach((s) => (grades[s.id] = gradeFor(rand, s.id, skill)));
    const r = rand();
    return {
      id: `ASP-${String(301 + i)}`,
      name,
      doc: `CC ···${String(1000 + Math.floor(rand() * 9000))}`,
      jornada: g.jornada,
      group: g.id,
      grades,
      rac5: pending ? undefined : r < 0.7 ? 'favorable' : r < 0.9 ? 'observaciones' : 'desfavorable',
    };
  });
};

/** Calificación inicial que propone la tablet para el grupo pendiente (el maestro la ajusta) */
export const draftFor = (station: Station, ids: string[]): Record<string, Grade> => {
  const rand = seeded(station.length * 7919 + 31);
  return Object.fromEntries(ids.map((id) => [id, suggestGrade(rand, station)]));
};
