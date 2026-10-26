import React from 'react';
import { ProjectItem } from '../types';

type CountryCode = NonNullable<ProjectItem['country']>;

const COUNTRY_NAMES: Record<CountryCode, { es: string; en: string }> = {
  do: { es: 'República Dominicana', en: 'Dominican Republic' },
  us: { es: 'Estados Unidos', en: 'United States' },
  ve: { es: 'Venezuela', en: 'Venezuela' },
  co: { es: 'Colombia', en: 'Colombia' },
};

interface CountryFlagProps {
  country: CountryCode;
  lang?: 'es' | 'en';
}

// Estrella de 5 puntas centrada en (cx, cy) con radio exterior r
const starPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');

/** Dibujo de cada bandera en un viewBox de 30x20 */
const FLAG_ART: Record<CountryCode, React.ReactNode> = {
  // República Dominicana: cuadrantes azul/rojo, cruz blanca y escudo simplificado
  do: (
    <>
      <rect width="30" height="20" fill="#ffffff" />
      <rect x="0" y="0" width="13" height="8" fill="#002D62" />
      <rect x="17" y="0" width="13" height="8" fill="#CE1126" />
      <rect x="0" y="12" width="13" height="8" fill="#CE1126" />
      <rect x="17" y="12" width="13" height="8" fill="#002D62" />
      <rect x="13.6" y="8.4" width="2.8" height="3.2" rx="0.6" fill="#ffffff" stroke="#00843D" strokeWidth="0.5" />
      <rect x="14.2" y="9" width="0.8" height="1" fill="#002D62" />
      <rect x="15" y="9" width="0.8" height="1" fill="#CE1126" />
      <rect x="14.2" y="10" width="0.8" height="1" fill="#CE1126" />
      <rect x="15" y="10" width="0.8" height="1" fill="#002D62" />
    </>
  ),
  // Estados Unidos: 13 franjas rojas y blancas con cantón azul y estrellas
  us: (
    <>
      <rect width="30" height="20" fill="#ffffff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x="0" y={(i * 2 * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect x="0" y="0" width="12" height={(7 * 20) / 13} fill="#3C3B6E" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: row % 2 === 0 ? 5 : 4 }, (_, col) => (
          <polygon
            key={`${row}-${col}`}
            points={starPoints((row % 2 === 0 ? 1.2 : 2.4) + col * 2.4, 1.3 + row * 2.4, 0.7)}
            fill="#ffffff"
          />
        ))
      )}
    </>
  ),
  // Venezuela: amarillo, azul y rojo con arco de 8 estrellas blancas
  ve: (
    <>
      <rect width="30" height="20" fill="#CF142B" />
      <rect width="30" height={40 / 3} fill="#00247D" />
      <rect width="30" height={20 / 3} fill="#FFCC00" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = Math.PI * (1 - (i + 0.5) / 8);
        return (
          <polygon
            key={i}
            points={starPoints(15 + 4.6 * Math.cos(angle), 13.6 - 4.6 * Math.sin(angle), 0.75)}
            fill="#ffffff"
          />
        );
      })}
    </>
  ),
  // Colombia: franjas amarilla (mitad superior), azul y roja
  co: (
    <>
      <rect width="30" height="20" fill="#CE1126" />
      <rect width="30" height="15" fill="#003893" />
      <rect width="30" height="10" fill="#FCD116" />
    </>
  ),
};

/**
 * Bandera en SVG (los emojis de bandera no se ven en Windows).
 * Se muestra junto a la organización del proyecto.
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({ country, lang = 'es' }) => {
  const name = COUNTRY_NAMES[country][lang];
  return (
    <svg className="country-flag" viewBox="0 0 30 20" role="img" aria-label={name}>
      <title>{name}</title>
      {FLAG_ART[country]}
    </svg>
  );
};

export default CountryFlag;
