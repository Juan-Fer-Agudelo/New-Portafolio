import React from 'react';

/**
 * SynthWave '84: Hexágono 3D en perspectiva sobre rejilla cyan (Robb Owen)
 */
export const SynthwaveIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 360 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Rejilla en perspectiva cyan */}
    <g stroke="#aadcec" strokeWidth="2" opacity="0.85">
      {/* Líneas horizontales de fuga */}
      <line x1="120" y1="180" x2="240" y2="180" />
      <line x1="95" y1="195" x2="265" y2="195" />
      <line x1="68" y1="212" x2="292" y2="212" />
      <line x1="38" y1="232" x2="322" y2="232" />
      <line x1="8" y1="255" x2="352" y2="255" strokeWidth="2.5" />

      {/* Líneas convergentes hacia el centro */}
      <line x1="180" y1="170" x2="180" y2="255" />
      <line x1="180" y1="170" x2="135" y2="255" />
      <line x1="180" y1="170" x2="225" y2="255" />
      <line x1="180" y1="170" x2="88" y2="255" />
      <line x1="180" y1="170" x2="272" y2="255" />
      <line x1="180" y1="170" x2="40" y2="255" />
      <line x1="180" y1="170" x2="320" y2="255" />
      <line x1="180" y1="170" x2="8" y2="242" />
      <line x1="180" y1="170" x2="352" y2="242" />
    </g>

    {/* Hexágono vertical SynthWave con borde púrpura e interior teal */}
    <g transform="translate(180, 142)">
      {/* Sombra / doble borde cyan detrás */}
      <polygon
        points="0,-82 68,-42 68,42 0,82 -68,42 -68,-42"
        fill="#f4f9fc"
        stroke="#aadcec"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      {/* Borde exterior púrpura */}
      <polygon
        points="0,-80 66,-40 66,40 0,80 -66,40 -66,-40"
        fill="#f4f9fc"
        stroke="#682ae9"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Borde interior blanco/luz */}
      <polygon
        points="0,-64 52,-32 52,32 0,64 -52,32 -52,-32"
        fill="#ffffff"
        stroke="#682ae9"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Hexágono central hueco / acento cyan */}
      <polygon
        points="0,-48 38,-24 38,24 0,48 -38,24 -38,-24"
        fill="#f4f9fc"
        stroke="#aadcec"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/**
 * Tornis: Torre de vigilancia forestal sobre pilotes con pinos cyan (Robb Owen)
 */
export const TornisIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 360 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pinos de fondo en color cyan suave */}
    <g fill="#aadcec" opacity="0.9">
      {/* Pino izquierdo 1 */}
      <polygon points="55,230 40,230 48,185 36,185 48,145 38,145 50,115 62,145 52,145 64,185 52,185 60,230" />
      {/* Pino izquierdo 2 */}
      <polygon points="95,230 80,230 88,175 74,175 88,135 76,135 90,105 104,135 92,135 106,175 92,175 100,230" />
      {/* Pino izquierdo 3 (cerca de la torre) */}
      <polygon points="135,230 120,230 128,190 116,190 128,155 118,155 130,125 142,155 132,155 144,190 132,190 140,230" />
      {/* Pino derecho 1 (cerca de la torre) */}
      <polygon points="225,230 210,230 218,190 206,190 218,155 208,155 220,125 232,155 222,155 234,190 222,190 230,230" />
      {/* Pino derecho 2 */}
      <polygon points="265,230 250,230 258,175 244,175 258,135 246,135 260,105 274,135 262,135 276,175 262,175 270,230" />
      {/* Pino derecho 3 */}
      <polygon points="305,230 290,230 298,185 286,185 298,145 288,145 300,115 312,145 302,145 314,185 302,185 310,230" />
    </g>

    {/* Plataforma base de la torre */}
    <rect x="70" y="228" width="220" height="8" rx="4" fill="#aadcec" stroke="#682ae9" strokeWidth="3" />

    {/* Patas / pilotes de la torre en púrpura */}
    <g stroke="#682ae9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Pilote izquierdo exterior */}
      <line x1="140" y1="120" x2="120" y2="228" />
      {/* Pilote izquierdo interior */}
      <line x1="152" y1="120" x2="138" y2="228" />
      {/* Pilote derecho interior */}
      <line x1="208" y1="120" x2="222" y2="228" />
      {/* Pilote derecho exterior */}
      <line x1="220" y1="120" x2="240" y2="228" />

      {/* Travesaños horizontales */}
      <line x1="133" y1="160" x2="227" y2="160" strokeWidth="3" />
      <line x1="127" y1="195" x2="233" y2="195" strokeWidth="3" />

      {/* Travesaños en cruz / X */}
      <line x1="133" y1="160" x2="233" y2="195" stroke="#aadcec" strokeWidth="2.5" />
      <line x1="227" y1="160" x2="127" y2="195" stroke="#aadcec" strokeWidth="2.5" />
    </g>

    {/* Cabina superior del puesto de vigilancia */}
    <g>
      {/* Plataforma balcón */}
      <rect x="130" y="112" width="100" height="9" rx="2" fill="#aadcec" stroke="#682ae9" strokeWidth="3" />
      {/* Barandilla balcón */}
      <line x1="130" y1="102" x2="230" y2="102" stroke="#682ae9" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="134" y1="102" x2="134" y2="112" stroke="#682ae9" strokeWidth="2" />
      <line x1="150" y1="102" x2="150" y2="112" stroke="#682ae9" strokeWidth="2" />
      <line x1="210" y1="102" x2="210" y2="112" stroke="#682ae9" strokeWidth="2" />
      <line x1="226" y1="102" x2="226" y2="112" stroke="#682ae9" strokeWidth="2" />

      {/* Paredes de la cabina */}
      <rect x="142" y="66" width="76" height="46" fill="#f4f9fc" stroke="#682ae9" strokeWidth="3" />
      {/* Franja de ventanas panorámicas en cyan */}
      <rect x="146" y="72" width="68" height="20" fill="#aadcec" stroke="#682ae9" strokeWidth="2" />
      <line x1="168" y1="72" x2="168" y2="92" stroke="#682ae9" strokeWidth="2" />
      <line x1="192" y1="72" x2="192" y2="92" stroke="#682ae9" strokeWidth="2" />

      {/* Techo piramidal con alero */}
      <polygon
        points="180,32 232,66 128,66"
        fill="#aadcec"
        stroke="#682ae9"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Viga central de techo */}
      <line x1="180" y1="32" x2="180" y2="66" stroke="#682ae9" strokeWidth="2.5" />
    </g>
  </svg>
);

/**
 * Rekishi: Logomarca geométrica con arcos concéntricos y franjas diagonales (Robb Owen)
 */
export const RekishiIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 360 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(180, 130)">
      {/* Escudo / silueta exterior */}
      <path
        d="M-58,58 L-58,-28 C-58,-58 -28,-78 8,-78 C44,-78 72,-50 72,-14 C72,22 44,50 8,50 L-58,50"
        stroke="#682ae9"
        strokeWidth="4"
        fill="#f4f9fc"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arco concéntrico exterior cyan */}
      <path
        d="M-40,32 L-40,-24 C-40,-46 -18,-60 8,-60 C34,-60 54,-40 54,-14 C54,12 34,32 8,32 Z"
        stroke="#aadcec"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arco concéntrico púrpura intermedio */}
      <path
        d="M-40,32 L-40,-24 C-40,-46 -18,-60 8,-60 C34,-60 54,-40 54,-14 C54,12 34,32 8,32 Z"
        stroke="#682ae9"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arco concéntrico interior cyan */}
      <path
        d="M-22,14 L-22,-18 C-22,-32 -8,-42 8,-42 C24,-42 36,-30 36,-14 C36,-2 24,14 8,14 Z"
        stroke="#aadcec"
        strokeWidth="8"
        fill="#aadcec"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Franjas diagonales en la esquina inferior izquierda (Robb Owen icon) */}
      <line x1="-58" y1="36" x2="-22" y2="0" stroke="#682ae9" strokeWidth="4" strokeLinecap="round" />
      <line x1="-58" y1="18" x2="-40" y2="0" stroke="#682ae9" strokeWidth="4" strokeLinecap="round" />
      <line x1="-58" y1="54" x2="-4" y2="0" stroke="#682ae9" strokeWidth="4" strokeLinecap="round" />
      <line x1="-58" y1="58" x2="14" y2="-14" stroke="#aadcec" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

export const KromaIllustration: React.FC = () => <SynthwaveIllustration />;
