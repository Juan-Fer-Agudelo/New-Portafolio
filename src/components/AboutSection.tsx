import React from 'react';

interface AboutSectionProps {
  onOpenEnfoque: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEnfoque }) => {
  const handleVerProyectos = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById('proyectos');
    projectsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="section-reveal about-section">
      {/* Línea vertical decorativa superior que conecta con el scroll del hero */}
      <div className="section-vertical-line" aria-hidden="true"></div>

      <div className="about-inner">
        <h2 className="about-heading animate-on-scroll">
          Mis proyectos<span className="dot">.</span>
        </h2>

        {/* Línea corta horizontal en teal (~50px de ancho, 3px de alto) */}
        <div className="about-teal-line animate-on-scroll" data-delay="1"></div>

        <p className="about-description animate-on-scroll" data-delay="2">
          Desde diseño de interacciones hasta sistemas de diseño escalables, aplicaciones
          de una sola página hasta experiencias más experimentales con WebGL. Descubre mi
          experiencia y los proyectos web que he construido - <strong>ambiciosos pero accesibles</strong>.
        </p>

        <div className="about-actions animate-on-scroll" data-delay="3">
          <button className="btn-striped" id="enfoque-btn" onClick={handleVerProyectos}>
            Ver mis proyectos
          </button>
        </div>
      </div>
    </section>
  );
};

