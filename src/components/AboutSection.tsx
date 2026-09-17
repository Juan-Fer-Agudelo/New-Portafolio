import React from 'react';

interface AboutSectionProps {
  onOpenEnfoque: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEnfoque }) => {
  return (
    <section id="about" className="section-reveal">
      <div className="about-inner">
        <h2 className="about-heading animate-on-scroll">
          Trabajemos juntos<span className="dot">.</span>
        </h2>

        {/* Línea corta horizontal en teal (~50px de ancho, 3px de alto) */}
        <div className="about-teal-line animate-on-scroll" data-delay="1"></div>

        <p className="about-description animate-on-scroll" data-delay="2">
          Desde diseño de interacción hasta sistemas de diseño escalables, aplicaciones de página
          única hasta algo más experimental con WebGL. Ayudo a personas increíbles a construir
          proyectos web ambiciosos pero accesibles — <strong>entre más atrevido, mejor</strong>.
        </p>

        <div className="animate-on-scroll" data-delay="3">
          <button className="btn-outline" id="enfoque-btn" onClick={onOpenEnfoque}>
            <svg className="btn-stroke-svg" aria-hidden="true">
              <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
            </svg>
            <span className="btn-content">
              <span>Sobre mi enfoque</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
