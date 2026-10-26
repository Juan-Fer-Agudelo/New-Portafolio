/* ==========================================================================
   Demo de la app "Cambios de Estructura y Nómina" (Power Apps) de Renault
   Sofasa. Todos los empleados, salarios y solicitudes son FICTICIOS y se
   generan aquí para la demostración; no hay conexión con ningún sistema real.
   ========================================================================== */

export type DeptId = 'soldadura' | 'pintura' | 'ensamble' | 'dli';
export type Shift = 1 | 2;
export type ChangeType = 'ascenso' | 'nivel' | 'jefe' | 'traslado';
export type Role = 'rrhh' | DeptId;
export type ApprovalStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Department {
  id: DeptId;
  name: string;
  short: string;
  boss: string;
  /** Personas por turno: [turno 1, turno 2] */
  headcount: [number, number];
}

export interface Employee {
  id: number;
  name: string;
  dept: DeptId;
  shift: Shift;
  position: string;
  level: number;
}

export interface Approval {
  status: ApprovalStatus;
  at?: Date;
}

export interface ChangeRequest {
  id: string;
  employee: Employee;
  type: ChangeType;
  toDept: DeptId;
  toShift: Shift;
  toPosition: string;
  toLevel: number;
  createdAt: Date;
  reason: string;
  rrhh: Approval;
  /** Jefe del departamento actual del empleado */
  outgoing: Approval;
  /** Jefe del departamento destino (solo si cambia de departamento) */
  incoming: Approval;
  payrollAt?: Date;
}

export interface ActivityItem {
  id: string;
  at: Date;
  text: string;
  kind: 'request' | 'approve' | 'reject' | 'notify' | 'payroll';
}

export const DEPARTMENTS: Department[] = [
  { id: 'soldadura', name: 'Soldadura', short: 'SOL', boss: 'Hernán Restrepo', headcount: [136, 132] },
  { id: 'pintura', name: 'Pintura', short: 'PIN', boss: 'Marcela Ospina', headcount: [108, 106] },
  { id: 'ensamble', name: 'Ensamble', short: 'ENS', boss: 'Julián Cardona', headcount: [152, 150] },
  { id: 'dli', name: 'DLI · Logística Industrial', short: 'DLI', boss: 'Natalia Zapata', headcount: [86, 84] },
];

export const TOTAL_EMPLOYEES = DEPARTMENTS.reduce((s, d) => s + d.headcount[0] + d.headcount[1], 0); // 954

export const HR_MANAGER = 'Liliana Mejía';

export const dept = (id: DeptId) => DEPARTMENTS.find((d) => d.id === id)!;

export const CHANGE_TYPES: Record<ChangeType, string> = {
  nivel: 'Subida de nivel',
  ascenso: 'Ascenso de cargo',
  jefe: 'Nombramiento como jefe',
  traslado: 'Traslado de departamento',
};

/** Salario base mensual ficticio por nivel (COP). El nivel 6 corresponde a jefatura. */
export const SALARY_BY_LEVEL: Record<number, number> = {
  1: 1_950_000,
  2: 2_380_000,
  3: 2_870_000,
  4: 3_420_000,
  5: 4_150_000,
  6: 5_900_000,
};

export const POSITIONS = [
  'Operario de producción',
  'Operario especializado',
  'Técnico de proceso',
  'Líder de línea',
  'Supervisor de turno',
  'Jefe de área',
];

export const EMPLOYEES: Employee[] = [
  { id: 10482, name: 'Andrés Felipe Gómez', dept: 'soldadura', shift: 1, position: 'Operario especializado', level: 2 },
  { id: 10517, name: 'Daniela Arango', dept: 'soldadura', shift: 2, position: 'Técnico de proceso', level: 3 },
  { id: 10533, name: 'Sebastián Henao', dept: 'soldadura', shift: 1, position: 'Operario de producción', level: 1 },
  { id: 10601, name: 'Valeria Montoya', dept: 'pintura', shift: 1, position: 'Operario de producción', level: 1 },
  { id: 10644, name: 'Camilo Echeverri', dept: 'pintura', shift: 2, position: 'Líder de línea', level: 4 },
  { id: 10672, name: 'Juliana Betancur', dept: 'pintura', shift: 1, position: 'Técnico de proceso', level: 3 },
  { id: 10715, name: 'Santiago Vélez', dept: 'ensamble', shift: 2, position: 'Operario especializado', level: 2 },
  { id: 10738, name: 'Manuela Giraldo', dept: 'ensamble', shift: 1, position: 'Supervisor de turno', level: 5 },
  { id: 10760, name: 'Mateo Londoño', dept: 'ensamble', shift: 1, position: 'Operario de producción', level: 1 },
  { id: 10791, name: 'Laura Castaño', dept: 'ensamble', shift: 2, position: 'Líder de línea', level: 4 },
  { id: 10823, name: 'Esteban Quintero', dept: 'dli', shift: 1, position: 'Operario de producción', level: 1 },
  { id: 10859, name: 'Paula Ramírez', dept: 'dli', shift: 2, position: 'Operario especializado', level: 2 },
];

export const salaryOf = (level: number) => SALARY_BY_LEVEL[level] ?? SALARY_BY_LEVEL[1];

export const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const needsIncoming = (r: Pick<ChangeRequest, 'employee' | 'toDept'>) => r.employee.dept !== r.toDept;

export type RequestStage = 'rrhh' | 'jefes' | 'aplicado' | 'rechazado';

export const stageOf = (r: ChangeRequest): RequestStage => {
  if ([r.rrhh, r.outgoing, r.incoming].some((a) => a.status === 'rechazado')) return 'rechazado';
  if (r.rrhh.status === 'pendiente') return 'rrhh';
  if (r.outgoing.status === 'pendiente' || (needsIncoming(r) && r.incoming.status === 'pendiente')) return 'jefes';
  return 'aplicado';
};

export const STAGE_LABEL: Record<RequestStage, string> = {
  rrhh: 'Pendiente RRHH',
  jefes: 'Pendiente jefes',
  aplicado: 'Aplicado en nómina',
  rechazado: 'Rechazado',
};

/** Diferencia en minutos entre dos fechas, como texto corto */
export const fmtDuration = (from: Date, to: Date) => {
  const min = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
};

export const fmtDateTime = (d: Date) =>
  d.toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

// Fechas de ejemplo relativas al momento en que se abre la demo
const ago = (min: number) => new Date(Date.now() - min * 60000);
const emp = (id: number) => EMPLOYEES.find((e) => e.id === id)!;
const done = (min: number): Approval => ({ status: 'aprobado', at: ago(min) });
const pending: Approval = { status: 'pendiente' };

export const buildInitialRequests = (): ChangeRequest[] => [
  {
    id: 'CE-0418',
    employee: emp(10482),
    type: 'traslado',
    toDept: 'pintura',
    toShift: 1,
    toPosition: 'Operario especializado',
    toLevel: 2,
    createdAt: ago(26),
    reason: 'Refuerzo de la cabina de sellado en Pintura por aumento de cadencia.',
    rrhh: pending,
    outgoing: pending,
    incoming: pending,
  },
  {
    id: 'CE-0417',
    employee: emp(10715),
    type: 'nivel',
    toDept: 'ensamble',
    toShift: 2,
    toPosition: 'Operario especializado',
    toLevel: 3,
    createdAt: ago(48),
    reason: 'Certificación interna en torque y ajuste de puertas aprobada.',
    rrhh: pending,
    outgoing: pending,
    incoming: pending,
  },
  {
    id: 'CE-0416',
    employee: emp(10644),
    type: 'jefe',
    toDept: 'dli',
    toShift: 2,
    toPosition: 'Jefe de área',
    toLevel: 6,
    createdAt: ago(95),
    reason: 'Cobertura de la jefatura del turno 2 de Logística Industrial.',
    rrhh: done(71),
    outgoing: done(52),
    incoming: pending,
  },
  {
    id: 'CE-0415',
    employee: emp(10601),
    type: 'ascenso',
    toDept: 'pintura',
    toShift: 1,
    toPosition: 'Técnico de proceso',
    toLevel: 3,
    createdAt: ago(130),
    reason: 'Ascenso por desempeño en control de calidad de acabado.',
    rrhh: done(118),
    outgoing: pending,
    incoming: pending,
  },
  {
    id: 'CE-0414',
    employee: emp(10823),
    type: 'traslado',
    toDept: 'ensamble',
    toShift: 1,
    toPosition: 'Operario de producción',
    toLevel: 1,
    createdAt: ago(310),
    reason: 'Rotación planificada hacia la línea de vestidura.',
    rrhh: done(296),
    outgoing: done(281),
    incoming: done(266),
    payrollAt: ago(266),
  },
  {
    id: 'CE-0413',
    employee: emp(10517),
    type: 'ascenso',
    toDept: 'soldadura',
    toShift: 2,
    toPosition: 'Líder de línea',
    toLevel: 4,
    createdAt: ago(420),
    reason: 'Vacante de líder en la célula de soldadura de carrocería.',
    rrhh: done(402),
    outgoing: done(388),
    incoming: pending,
    payrollAt: ago(388),
  },
  {
    id: 'CE-0412',
    employee: emp(10760),
    type: 'traslado',
    toDept: 'soldadura',
    toShift: 2,
    toPosition: 'Operario de producción',
    toLevel: 1,
    createdAt: ago(560),
    reason: 'Solicitud de cambio de turno por estudios.',
    rrhh: { status: 'rechazado', at: ago(540) },
    outgoing: pending,
    incoming: pending,
  },
];

export const buildInitialActivity = (requests: ChangeRequest[]): ActivityItem[] => {
  const items: ActivityItem[] = [];
  requests.forEach((r) => {
    const from = dept(r.employee.dept);
    const to = dept(r.toDept);
    items.push({ id: `${r.id}-c`, at: r.createdAt, kind: 'request', text: `${r.id} creada: ${CHANGE_TYPES[r.type]} de ${r.employee.name}` });
    if (r.rrhh.at)
      items.push({
        id: `${r.id}-h`,
        at: r.rrhh.at,
        kind: r.rrhh.status === 'rechazado' ? 'reject' : 'approve',
        text: `RRHH ${r.rrhh.status === 'rechazado' ? 'rechazó' : 'aprobó'} ${r.id}`,
      });
    if (r.outgoing.at) items.push({ id: `${r.id}-o`, at: r.outgoing.at, kind: 'approve', text: `${from.boss} (${from.name}) aprobó ${r.id}` });
    if (r.incoming.at) items.push({ id: `${r.id}-i`, at: r.incoming.at, kind: 'approve', text: `${to.boss} (${to.name}) aprobó ${r.id}` });
    if (r.payrollAt) items.push({ id: `${r.id}-p`, at: r.payrollAt, kind: 'payroll', text: `Novedad de nómina registrada para ${r.employee.name}` });
  });
  return items.sort((a, b) => b.at.getTime() - a.at.getTime());
};
