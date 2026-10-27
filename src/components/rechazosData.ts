/* ==========================================================================
   Demo de la app "Rechazos de defectos de calidad" (Power Apps + Power Automate)
   de Renault Sofasa. Todas las piezas, precios, operarios y registros son
   FICTICIOS y se generan aquí para la demostración.
   ========================================================================== */

export type Area = 'Ensamble' | 'Soldadura';

export interface Uet {
  id: string;
  name: string;
  area: Area;
}

/** UET que rechazan piezas: el valor del rechazo se carga a la UET que la estaba ensamblando o soldando */
export const UETS: Uet[] = [
  { id: 'trim', name: 'Trim', area: 'Ensamble' },
  { id: 'mecanica', name: 'Mecánica', area: 'Ensamble' },
  { id: 'final', name: 'Final', area: 'Ensamble' },
  { id: 'entregas', name: 'Entregas', area: 'Ensamble' },
  { id: 'laterales', name: 'Laterales', area: 'Soldadura' },
  { id: 'piso', name: 'Piso', area: 'Soldadura' },
  { id: 'cierre', name: 'Cierre de carrocería', area: 'Soldadura' },
];

export const uetById = (id: string) => UETS.find((u) => u.id === id)!;
export const uetLabel = (u: Uet) => `${u.area} · ${u.name}`;

export interface Piece {
  /** Identificador que lleva la etiqueta de la pieza (se lee con la cámara) */
  code: string;
  part: string;
  name: string;
  price: number;
  /** UET donde se usa la pieza */
  uets: string[];
}

export const PIECES: Piece[] = [
  { code: 'PZ-40218', part: '8201-4471', name: 'Bisagra de puerta delantera', price: 46_500, uets: ['trim', 'laterales'] },
  { code: 'PZ-40377', part: '8201-5532', name: 'Moldura de puerta trasera', price: 58_900, uets: ['trim', 'final'] },
  { code: 'PZ-40452', part: '8201-6094', name: 'Tapizado de puerta delantera', price: 265_000, uets: ['trim'] },
  { code: 'PZ-40519', part: '8201-1187', name: 'Arnés eléctrico de tablero', price: 785_000, uets: ['trim', 'final'] },
  { code: 'PZ-40633', part: '8201-2210', name: 'Soporte de motor', price: 214_000, uets: ['mecanica'] },
  { code: 'PZ-40708', part: '8201-2390', name: 'Manguera de radiador', price: 97_300, uets: ['mecanica'] },
  { code: 'PZ-40781', part: '8201-3305', name: 'Faro delantero izquierdo', price: 690_000, uets: ['final', 'entregas'] },
  { code: 'PZ-40846', part: '8201-3418', name: 'Parachoques delantero', price: 845_000, uets: ['final', 'entregas'] },
  { code: 'PZ-40912', part: '8201-3702', name: 'Espejo retrovisor derecho', price: 312_000, uets: ['final', 'entregas'] },
  { code: 'PZ-41027', part: '8201-0815', name: 'Refuerzo de pilar B', price: 176_500, uets: ['laterales'] },
  { code: 'PZ-41093', part: '8201-0922', name: 'Panel lateral izquierdo', price: 1_420_000, uets: ['laterales', 'cierre'] },
  { code: 'PZ-41158', part: '8201-0640', name: 'Travesaño trasero', price: 333_000, uets: ['piso'] },
  { code: 'PZ-41224', part: '8201-0701', name: 'Piso trasero', price: 1_120_000, uets: ['piso'] },
  { code: 'PZ-41301', part: '8201-1033', name: 'Panel de techo', price: 980_000, uets: ['cierre'] },
  { code: 'PZ-41376', part: '8201-1092', name: 'Capó', price: 1_240_000, uets: ['cierre', 'final'] },
];

export const REASONS = [
  'Golpe / abolladura',
  'Deformación',
  'Rayón',
  'Soldadura defectuosa',
  'Pieza incompleta',
  'Fuera de tolerancia',
  'Óxido',
];

export interface Rejection {
  id: string;
  at: Date;
  uet: string;
  piece: Piece;
  qty: number;
  reason: string;
  operator: string;
  /** Segundos que tomó registrarlo desde el escaneo */
  seconds: number;
}

/** Minutos que tomaba antes cada rechazo: llevar la pieza a la UET de Calidad y calcular su valor a mano */
export const MANUAL_MINUTES = 25;

export const OPERATORS = ['C. Arango', 'J. Restrepo', 'M. Giraldo', 'S. Henao', 'V. Montoya', 'D. Ospina'];

export const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const valueOf = (r: Pick<Rejection, 'piece' | 'qty'>) => r.piece.price * r.qty;

export const piecesFor = (uetId: string) => PIECES.filter((p) => p.uets.includes(uetId));

// Generador pseudoaleatorio con semilla: los registros del día son iguales en cada carga
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** Rechazos registrados más temprano en el día (antes de abrir la demo) */
export const buildInitialRejections = (): Rejection[] => {
  const rand = seeded(20251104);
  const now = new Date();
  const list: Rejection[] = [];
  for (let i = 0; i < 14; i++) {
    const uet = UETS[Math.floor(rand() * UETS.length)];
    const options = piecesFor(uet.id);
    const piece = options[Math.floor(rand() * options.length)];
    list.push({
      id: `RC-${String(2041 + i)}`,
      at: new Date(now.getTime() - (14 - i) * (17 + Math.floor(rand() * 14)) * 60000),
      uet: uet.id,
      piece,
      qty: rand() < 0.75 ? 1 : 2,
      reason: REASONS[Math.floor(rand() * REASONS.length)],
      operator: OPERATORS[Math.floor(rand() * OPERATORS.length)],
      seconds: 6 + Math.floor(rand() * 9),
    });
  }
  return list.reverse();
};

export const fmtTime = (d: Date) => d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
