import React from 'react';

export const SynthwaveIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 340 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Sol estilo synthwave con franjas */}
    <circle cx="170" cy="140" r="64" fill="#ff71ce" opacity="0.85" />
    <mask id="sun-stripes">
      <circle cx="170" cy="140" r="64" fill="#ffffff" />
      <rect x="90" y="132" width="160" height="4" fill="#000000" />
      <rect x="90" y="142" width="160" height="6" fill="#000000" />
      <rect x="90" y="154" width="160" height="8" fill="#000000" />
      <rect x="90" y="168" width="160" height="10" fill="#000000" />
      <rect x="90" y="184" width="160" height="14" fill="#000000" />
    </mask>
    <circle cx="170" cy="140" r="64" fill="#fdf076" mask="url(#sun-stripes)" />

    {/* Montañas de vector */}
    <polygon points="40,220 120,130 200,220" fill="rgba(255, 113, 206, 0.2)" stroke="#ff71ce" strokeWidth="2" />
    <polygon points="140,220 220,110 300,220" fill="rgba(1, 205, 254, 0.2)" stroke="#01cdfe" strokeWidth="2" />
    <polygon points="100,220 170,140 240,220" fill="rgba(5, 255, 161, 0.15)" stroke="#05ffa1" strokeWidth="1.8" />

    {/* Rejilla de perspectiva Synthwave */}
    <line x1="20" y1="220" x2="320" y2="220" stroke="#01cdfe" strokeWidth="2.5" />
    <line x1="20" y1="235" x2="320" y2="235" stroke="#01cdfe" strokeWidth="1.8" />
    <line x1="20" y1="255" x2="320" y2="255" stroke="#01cdfe" strokeWidth="1.6" />
    <line x1="20" y1="280" x2="320" y2="280" stroke="#01cdfe" strokeWidth="1.4" />
    <line x1="20" y1="310" x2="320" y2="310" stroke="#01cdfe" strokeWidth="1.2" />

    {/* Rayas de fuga */}
    <line x1="170" y1="220" x2="170" y2="320" stroke="#01cdfe" strokeWidth="1.8" />
    <line x1="170" y1="220" x2="110" y2="320" stroke="#01cdfe" strokeWidth="1.8" />
    <line x1="170" y1="220" x2="230" y2="320" stroke="#01cdfe" strokeWidth="1.8" />
    <line x1="170" y1="220" x2="50" y2="320" stroke="#01cdfe" strokeWidth="1.6" />
    <line x1="170" y1="220" x2="290" y2="320" stroke="#01cdfe" strokeWidth="1.6" />
    <line x1="170" y1="220" x2="0" y2="280" stroke="#01cdfe" strokeWidth="1.4" />
    <line x1="170" y1="220" x2="340" y2="280" stroke="#01cdfe" strokeWidth="1.4" />

    {/* Silueta de Palmera */}
    <path d="M75,220 Q70,165 95,120" stroke="#ff71ce" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M95,120 Q80,105 50,115" stroke="#ff71ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M95,120 Q105,95 85,75" stroke="#ff71ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M95,120 Q115,100 135,105" stroke="#ff71ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M95,120 Q120,120 130,135" stroke="#ff71ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M95,120 Q85,125 65,140" stroke="#ff71ce" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const TornisIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 340 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ventana de viewport */}
    <rect x="50" y="45" width="240" height="230" rx="8" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2.4" />
    <line x1="50" y1="75" x2="290" y2="75" stroke="var(--color-primary)" strokeWidth="1.8" />
    <circle cx="68" cy="60" r="3.5" fill="#ffd7df" stroke="var(--color-primary)" strokeWidth="1.4" />
    <circle cx="80" cy="60" r="3.5" fill="#ffd7df" stroke="var(--color-primary)" strokeWidth="1.4" />
    <circle cx="92" cy="60" r="3.5" fill="#ffd7df" stroke="var(--color-primary)" strokeWidth="1.4" />

    {/* Bounding box punteado de estado de scroll */}
    <rect x="75" y="95" width="190" height="155" rx="4" stroke="#ff8ca3" strokeWidth="1.8" strokeDasharray="5,5" fill="rgba(255, 215, 223, 0.25)" />

    {/* Coordenadas X/Y y radar de posición */}
    <line x1="170" y1="95" x2="170" y2="250" stroke="var(--color-primary)" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.5" />
    <line x1="75" y1="172" x2="265" y2="172" stroke="var(--color-primary)" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.5" />

    {/* Ondas concéntricas de pulso */}
    <circle cx="170" cy="172" r="42" stroke="var(--color-accent)" strokeWidth="1.6" opacity="0.4" strokeDasharray="4,3" />
    <circle cx="170" cy="172" r="24" stroke="var(--color-accent)" strokeWidth="1.8" opacity="0.7" />
    <circle cx="170" cy="172" r="6" fill="var(--color-primary)" />

    {/* Puntero del mouse que genera la suscripción */}
    <polygon points="170,172 170,198 178,190 190,204 195,199 184,186 195,186" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />

    {/* Badge numérico de 60fps */}
    <rect x="205" y="52" width="72" height="18" rx="9" fill="var(--color-primary)" />
    <text x="241" y="65" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      60.0 FPS
    </text>
  </svg>
);

export const RekishiIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 340 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ventana de navegador con barra de historial */}
    <rect x="40" y="55" width="260" height="210" rx="8" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2.4" />
    <line x1="40" y1="95" x2="300" y2="95" stroke="var(--color-primary)" strokeWidth="1.8" />

    {/* Flechas atrás / adelante */}
    <polyline points="65,75 58,75 62,71 M58,75 L62,79" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="76,75 83,75 79,71 M83,75 L79,79" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />

    {/* Barra de dirección URL */}
    <rect x="95" y="65" width="185" height="20" rx="4" fill="rgba(197, 227, 232, 0.4)" stroke="var(--color-primary)" strokeWidth="1.2" />
    <text x="105" y="79" fill="var(--color-primary)" fontSize="10" fontFamily="monospace" fontWeight="bold">
      https://site.dev/proyectos
    </text>

    {/* Línea de tiempo de estados History (Stack de nodos) */}
    <line x1="75" y1="165" x2="265" y2="165" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4,4" />

    {/* Nodos de historial */}
    <circle cx="95" cy="165" r="14" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2.2" />
    <text x="95" y="169" fill="var(--color-primary)" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      /01
    </text>

    <circle cx="170" cy="165" r="18" fill="#ffd7df" stroke="var(--color-primary)" strokeWidth="2.5" />
    <text x="170" y="170" fill="var(--color-primary)" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      /02
    </text>

    <circle cx="245" cy="165" r="14" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2.2" />
    <text x="245" y="169" fill="var(--color-primary)" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      /03
    </text>

    {/* Curvas bezier de transición de estado */}
    <path d="M95,179 C95,215 170,215 170,183" stroke="#682ae9" strokeWidth="2.2" fill="none" strokeDasharray="3,3" />
    <polygon points="170,183 165,190 175,190" fill="#682ae9" />

    {/* Mini tarjetas de contenido transicionado */}
    <rect x="125" y="218" width="90" height="24" rx="4" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="1.6" />
    <line x1="135" y1="226" x2="175" y2="226" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
    <line x1="135" y1="233" x2="195" y2="233" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const KromaIllustration: React.FC = () => (
  <svg
    className="project-svg-art"
    viewBox="0 0 340 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Rueda / abanico de tokens cromáticos concéntricos */}
    <circle cx="170" cy="160" r="105" stroke="var(--color-primary)" strokeWidth="2.2" strokeDasharray="6,4" fill="none" />

    {/* Swatches circulares de color con borde editorial */}
    <g transform="translate(170, 160)">
      {/* Círculo central */}
      <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2.4" />
      <text x="0" y="4" fill="var(--color-primary)" fontSize="11" fontFamily="var(--font-slab)" fontWeight="bold" textAnchor="middle">
        WCAG
      </text>

      {/* Discos satélite con paletas armónicas */}
      <circle cx="-65" cy="-45" r="22" fill="#ffd7df" stroke="var(--color-primary)" strokeWidth="2" />
      <circle cx="65" cy="-45" r="22" fill="#addded" stroke="var(--color-primary)" strokeWidth="2" />
      <circle cx="75" cy="40" r="22" fill="#fdf076" stroke="var(--color-primary)" strokeWidth="2" />
      <circle cx="-75" cy="40" r="22" fill="#c5e3e8" stroke="var(--color-primary)" strokeWidth="2" />
      <circle cx="0" cy="-80" r="20" fill="#682ae9" stroke="var(--color-primary)" strokeWidth="2" />
      <circle cx="0" cy="80" r="20" fill="#ff71ce" stroke="var(--color-primary)" strokeWidth="2" />

      {/* Conectores ortogonales */}
      <line x1="0" y1="-32" x2="0" y2="-60" stroke="var(--color-primary)" strokeWidth="1.8" />
      <line x1="0" y1="32" x2="0" y2="60" stroke="var(--color-primary)" strokeWidth="1.8" />
      <line x1="-28" y1="-18" x2="-48" y2="-32" stroke="var(--color-primary)" strokeWidth="1.8" />
      <line x1="28" y1="-18" x2="48" y2="-32" stroke="var(--color-primary)" strokeWidth="1.8" />
      <line x1="28" y1="18" x2="52" y2="28" stroke="var(--color-primary)" strokeWidth="1.8" />
      <line x1="-28" y1="18" x2="-52" y2="28" stroke="var(--color-primary)" strokeWidth="1.8" />
    </g>

    {/* Badge de conformidad AAA */}
    <rect x="136" y="272" width="68" height="20" rx="4" fill="var(--color-primary)" />
    <text x="170" y="286" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      RATIO 7:1
    </text>
  </svg>
);
