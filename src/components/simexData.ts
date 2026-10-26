/* ==========================================================================
   Demo del flujo de n8n "Tasas de cambio → Outlook" de Simex (Colombia).
   Todas las tasas, fechas, correos y personas son FICTICIOS y se generan
   aquí para la demostración; no hay conexión con ningún sistema real.
   ========================================================================== */

/** Hora local (Bogotá) en que se dispara el flujo, de lunes a viernes */
export const SEND_HOUR = 19;
export const CRON = `0 ${SEND_HOUR} * * 1-5`;

export const RECIPIENT = { name: 'Carolina Duque', role: 'Responsable de divisas · Contabilidad', email: 'c.duque@empresa-demo.co' };
export const AREA_BOSS = { name: 'Mauricio Salazar', role: 'Jefe de Contabilidad', email: 'm.salazar@empresa-demo.co' };

export interface Currency {
  code: string;
  name: string;
  country: string;
  /** Tasa base ficticia en pesos colombianos */
  base: number;
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dólar estadounidense', country: 'Estados Unidos', base: 4048.35, decimals: 2 },
  { code: 'EUR', name: 'Euro', country: 'Unión Europea', base: 4611.9, decimals: 2 },
  { code: 'GBP', name: 'Libra esterlina', country: 'Reino Unido', base: 5397.6, decimals: 2 },
  { code: 'JPY', name: 'Yen japonés', country: 'Japón', base: 26.84, decimals: 4 },
  { code: 'CNY', name: 'Yuan chino', country: 'China', base: 562.3, decimals: 2 },
  { code: 'BRL', name: 'Real brasileño', country: 'Brasil', base: 741.85, decimals: 2 },
  { code: 'ARS', name: 'Peso argentino', country: 'Argentina', base: 3.4118, decimals: 4 },
  { code: 'PEN', name: 'Sol peruano', country: 'Perú', base: 1089.4, decimals: 2 },
  { code: 'SEK', name: 'Corona sueca', country: 'Suecia', base: 397.55, decimals: 2 },
  { code: 'MXN', name: 'Peso mexicano', country: 'México', base: 218.7, decimals: 2 },
];

export interface Rate {
  code: string;
  name: string;
  cop: number;
  /** Variación porcentual frente al día hábil anterior */
  change: number;
  raw: string;
}

// Generador pseudoaleatorio con semilla: la misma fecha siempre da las mismas tasas
const seeded = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const daySeed = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

// Mezcla la semilla para que días consecutivos no den valores casi idénticos
const hashSeed = (n: number) => {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) % 2147483646 || 1;
};

const rawRate = (c: Currency, d: Date, i: number) => {
  const next = seeded(hashSeed(daySeed(d) * 31 + i));
  next();
  const r = next();
  return c.base * (1 + (r - 0.5) * 0.012);
};

export const prevWeekday = (d: Date) => {
  const p = new Date(d);
  do p.setDate(p.getDate() - 1);
  while (p.getDay() === 0 || p.getDay() === 6);
  return p;
};

/** Formato colombiano tal como aparece en la web: 4.048,35 */
export const fmtCO = (n: number, decimals = 2) =>
  n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export const ratesFor = (d: Date): Rate[] => {
  const prev = prevWeekday(d);
  return CURRENCIES.map((c, i) => {
    const cop = rawRate(c, d, i);
    const before = rawRate(c, prev, i);
    return { code: c.code, name: c.name, cop, change: ((cop - before) / before) * 100, raw: fmtCO(cop, c.decimals) };
  });
};

/** Monedas que "no habían publicado" cuando se simula la fuente incompleta */
export const MISSING_ON_FAILURE = ['ARS', 'SEK', 'MXN'];

/** Últimos días hábiles a la hora del disparo, del más reciente al más antiguo */
export const lastExecutions = (count: number) => {
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), SEND_HOUR, 0, 2);
  if (d > now || d.getDay() === 0 || d.getDay() === 6) d = prevWeekday(d);
  const list: Date[] = [];
  for (let i = 0; i < count; i++) {
    list.push(d);
    d = prevWeekday(d);
  }
  return list;
};

export const fmtDate = (d: Date) => d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
