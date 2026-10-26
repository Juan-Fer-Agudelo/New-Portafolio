/* ==========================================================================
   Demo del mapa de trazabilidad de AGVs del departamento de Ensamble
   (Renault Sofasa). El plano está simplificado a partir del layout de planta
   y todos los AGVs, entregas y tiempos son FICTICIOS; la simulación corre
   en el navegador, sin conexión con ningún sistema real.
   ========================================================================== */

export type Pt = [number, number];
export type Cargo = 'pdi' | 'pdd' | 'pti' | 'ptd' | 'llantas' | 'parabrisas';
export type RouteId = 'puertas' | 'llantas' | 'parabrisas';

/** Áreas del plano (coordenadas en un lienzo de 1160 × 660) */
export interface Area {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: 'uet' | 'dli' | 'gray' | 'black' | 'supply';
  /** Etiqueta en vertical (Mecanic lateral, Motores) */
  vertical?: boolean;
  /** UET destino de los AGVs (se resalta) */
  target?: boolean;
  /** Zona donde cargan los AGVs de esa ruta (borde punteado del color de la ruta) */
  source?: RouteId;
}

export const AREAS: Area[] = [
  { label: 'TK', x: 0, y: 108, w: 76, h: 80, tone: 'dli' },
  { label: 'TRIM', x: 78, y: 108, w: 252, h: 80, tone: 'uet' },
  { label: '', x: 331, y: 84, w: 98, h: 102, tone: 'gray' },
  { label: 'MECANIC', x: 430, y: 84, w: 240, h: 56, tone: 'uet' },
  { label: 'MECANIC', x: 630, y: 84, w: 40, h: 156, tone: 'uet', vertical: true },
  { label: 'MECANIC', x: 542, y: 240, w: 130, h: 56, tone: 'uet' },
  { label: '', x: 425, y: 140, w: 28, h: 66, tone: 'dli' },
  { label: 'FINAL', x: 50, y: 236, w: 476, h: 58, tone: 'uet', target: true },
  { label: 'MOTORES', x: 660, y: 330, w: 48, h: 128, tone: 'uet', vertical: true },
  { label: 'MULTINIVEL\nSOLDADURA', x: 906, y: 60, w: 168, h: 160, tone: 'gray' },
  { label: 'SUMINISTRO\nENSAMBLE\n(DLI)', x: 134, y: 375, w: 156, h: 168, tone: 'supply' },
  { label: 'KIT', x: 6, y: 375, w: 88, h: 148, tone: 'dli' },
  { label: 'KIT\nFINAL', x: 302, y: 375, w: 85, h: 176, tone: 'dli' },
  { label: 'KIT\nAÉREA', x: 408, y: 375, w: 85, h: 176, tone: 'dli' },
  { label: 'KIT M03', x: 504, y: 375, w: 146, h: 70, tone: 'dli' },
  { label: 'KIT M01', x: 511, y: 459, w: 164, h: 84, tone: 'gray' },
  { label: 'LLANTAS', x: 806, y: 405, w: 124, h: 108, tone: 'black' },
  { label: 'PARABRISAS-\nLUNETAS', x: 953, y: 413, w: 180, h: 64, tone: 'uet', source: 'parabrisas' },
  { label: '', x: 1110, y: 477, w: 22, h: 138, tone: 'uet' },
  { label: '', x: 994, y: 566, w: 130, h: 64, tone: 'uet' },
];

/** Nodos numerados del sistema de guiado (como en el plano) */
export const NODES: { id: number; x: number; y: number }[] = [
  { id: 121, x: 25, y: 192 },
  { id: 120, x: 54, y: 190 },
  { id: 119, x: 81, y: 190 },
  { id: 183, x: 112, y: 190 },
  { id: 182, x: 146, y: 190 },
  { id: 181, x: 178, y: 190 },
  { id: 180, x: 212, y: 190 },
  { id: 179, x: 242, y: 190 },
  { id: 178, x: 268, y: 190 },
  { id: 177, x: 293, y: 190 },
  { id: 176, x: 330, y: 192 },
  { id: 122, x: 112, y: 215 },
  { id: 123, x: 146, y: 215 },
  { id: 124, x: 180, y: 215 },
  { id: 125, x: 212, y: 215 },
  { id: 126, x: 244, y: 215 },
  { id: 127, x: 268, y: 215 },
  { id: 128, x: 293, y: 215 },
  { id: 129, x: 330, y: 215 },
  { id: 130, x: 408, y: 190 },
  { id: 131, x: 408, y: 168 },
  { id: 132, x: 409, y: 52 },
  { id: 133, x: 487, y: 48 },
  { id: 134, x: 688, y: 48 },
  { id: 135, x: 716, y: 96 },
  { id: 136, x: 715, y: 264 },
];

/** Líneas de guiado decorativas del plano (sin AGVs) */
export const EXTRA_TRACKS: Pt[][] = [
  [
    [125, 580],
    [125, 320],
    [600, 320],
    [715, 308],
  ],
  [
    [750, 28],
    [750, 560],
    [960, 560],
    [1060, 480],
  ],
  [
    [388, 28],
    [750, 28],
  ],
  [
    [388, 28],
    [388, 212],
  ],
];

export interface Stop {
  /** Índice del punto de la ruta donde el AGV se detiene */
  at: number;
  kind: 'carga' | 'entrega';
  label: string;
  seconds: number;
}

export interface Route {
  id: RouteId;
  name: string;
  points: Pt[];
  stops: Stop[];
}

/* Ruta de puertas: Suministro Ensamble (DLI) → anillo superior → nodos de Final → regreso por el lado izquierdo */
const DOORS: Pt[] = [
  [212, 505], // 0 · muelle de carga en Suministro Ensamble
  [212, 330],
  [600, 322],
  [715, 306],
  [716, 96], // 135
  [688, 48], // 134
  [487, 48], // 133
  [409, 52], // 132
  [408, 168], // 131
  [408, 190], // 130
  [330, 192], // 176
  [178, 190], // 11 · estación de entrega en Final (nodo 181)
  [25, 192], // 121
  [22, 214],
  [72, 318],
  [105, 340],
  [105, 578],
  [212, 578],
];

/* Ruta de llantas: zona de Llantas → pasillo derecho → anillo superior → nodos de Final → regreso por el sur */
const TIRES: Pt[] = [
  [800, 468], // 0 · muelle de carga en Llantas
  [752, 468],
  [752, 130],
  [716, 96], // 135
  [688, 48], // 134
  [487, 48], // 133
  [409, 52], // 132
  [408, 168], // 131
  [408, 190], // 130
  [330, 192], // 176
  [268, 190], // 10 · estación de entrega en Final (nodo 178)
  [268, 215], // 127
  [330, 215], // 129
  [540, 215],
  [540, 308],
  [715, 312],
  // Carril de regreso paralelo al de ida para no cruzarse de frente
  [776, 340],
  [776, 452],
];

/* Ruta de parabrisas y lunetas: zona de Parabrisas → pasillo sur → pasillo derecho → anillo superior →
   nodos de Final → regreso por el sur y el carril paralelo */
const WINDSHIELDS: Pt[] = [
  [1060, 497], // 0 · muelle de carga en Parabrisas-Lunetas
  [1000, 560],
  [752, 560],
  [752, 130],
  [716, 96], // 135
  [688, 48], // 134
  [487, 48], // 133
  [409, 52], // 132
  [408, 168], // 131
  [408, 190], // 130
  [330, 192], // 176
  [293, 190], // 11 · estación de entrega en Final (nodo 177)
  [293, 215], // 128
  [330, 215], // 129
  [540, 215],
  [540, 308],
  [715, 312],
  [776, 340],
  [776, 522],
  [960, 522],
];

export const ROUTES: Record<RouteId, Route> = {
  puertas: {
    id: 'puertas',
    name: 'Suministro Ensamble (DLI) → Final',
    points: DOORS,
    stops: [
      { at: 0, kind: 'carga', label: 'Suministro Ensamble (DLI)', seconds: 4 },
      { at: 11, kind: 'entrega', label: 'Final · nodo 181', seconds: 4 },
    ],
  },
  llantas: {
    id: 'llantas',
    name: 'Llantas → Final',
    points: TIRES,
    stops: [
      { at: 0, kind: 'carga', label: 'Zona de Llantas', seconds: 4 },
      { at: 10, kind: 'entrega', label: 'Final · nodo 178', seconds: 3.5 },
    ],
  },
  parabrisas: {
    id: 'parabrisas',
    name: 'Parabrisas-Lunetas → Final',
    points: WINDSHIELDS,
    stops: [
      { at: 0, kind: 'carga', label: 'Parabrisas-Lunetas', seconds: 4 },
      { at: 11, kind: 'entrega', label: 'Final · nodo 177', seconds: 3.5 },
    ],
  },
};

export const CARGO: Record<Cargo, { label: string; short: string; units: number; unit: string }> = {
  pdi: { label: 'Puertas delanteras izquierdas', short: 'Del. izq.', units: 6, unit: 'puertas' },
  pdd: { label: 'Puertas delanteras derechas', short: 'Del. der.', units: 6, unit: 'puertas' },
  pti: { label: 'Puertas traseras izquierdas', short: 'Tras. izq.', units: 6, unit: 'puertas' },
  ptd: { label: 'Puertas traseras derechas', short: 'Tras. der.', units: 6, unit: 'puertas' },
  llantas: { label: 'Llantas', short: 'Llantas', units: 4, unit: 'juegos de llantas' },
  parabrisas: { label: 'Parabrisas y lunetas', short: 'Parabrisas', units: 4, unit: 'parabrisas y lunetas' },
};

/** Flota ficticia: 4 AGVs de puertas (uno por posición) + 3 de llantas + 2 de parabrisas */
export const FLEET: { id: string; cargo: Cargo; route: RouteId; start: number }[] = [
  { id: 'AGV-01', cargo: 'pdi', route: 'puertas', start: 0.02 },
  { id: 'AGV-02', cargo: 'pdd', route: 'puertas', start: 0.27 },
  { id: 'AGV-03', cargo: 'pti', route: 'puertas', start: 0.52 },
  { id: 'AGV-04', cargo: 'ptd', route: 'puertas', start: 0.77 },
  { id: 'AGV-05', cargo: 'llantas', route: 'llantas', start: 0.05 },
  { id: 'AGV-06', cargo: 'llantas', route: 'llantas', start: 0.38 },
  { id: 'AGV-07', cargo: 'llantas', route: 'llantas', start: 0.7 },
  { id: 'AGV-08', cargo: 'parabrisas', route: 'parabrisas', start: 0.15 },
  { id: 'AGV-09', cargo: 'parabrisas', route: 'parabrisas', start: 0.62 },
];

/* ---------------------------------------------------------------- Geometría de rutas */

export interface Geometry {
  /** Distancia acumulada hasta cada punto (la ruta es cerrada) */
  cum: number[];
  total: number;
}

export const geometryOf = (pts: Pt[]): Geometry => {
  const cum = [0];
  for (let i = 1; i <= pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i % pts.length];
    cum.push(cum[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  return { cum, total: cum[cum.length - 1] };
};

/** Posición y ángulo (grados) a una distancia s sobre la ruta cerrada */
export const pointAt = (pts: Pt[], g: Geometry, s: number) => {
  const d = ((s % g.total) + g.total) % g.total;
  let i = 0;
  while (i < pts.length - 1 && g.cum[i + 1] < d) i++;
  const [ax, ay] = pts[i];
  const [bx, by] = pts[(i + 1) % pts.length];
  const seg = g.cum[i + 1] - g.cum[i] || 1;
  const t = (d - g.cum[i]) / seg;
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI, seg: i };
};

export const nearestNode = (x: number, y: number) =>
  NODES.reduce((best, n) => (Math.hypot(n.x - x, n.y - y) < Math.hypot(best.x - x, best.y - y) ? n : best), NODES[0]);
