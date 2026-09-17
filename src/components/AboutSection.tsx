import React from 'react';

interface AboutSectionProps {
  onOpenEnfoque: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEnfoque }) => {
  return (
    <section id="about" className="section-reveal about-section">
      {/* Línea vertical decorativa superior que conecta con el scroll del hero */}
      <div className="section-vertical-line" aria-hidden="true"></div>

      <div className="about-inner">
        <h2 className="about-heading animate-on-scroll">
          Let's work together<span className="dot">.</span>
        </h2>

        {/* Línea corta horizontal en teal (~50px de ancho, 3px de alto) */}
        <div className="about-teal-line animate-on-scroll" data-delay="1"></div>

        <p className="about-description animate-on-scroll" data-delay="2">
          From interaction design to scaleable design systems, single-page apps to
          something more experimental with WebGL. I help awesome people to build
          ambitious yet accessible web projects - <strong>the wilder, the better</strong>.
        </p>

        <div className="about-actions animate-on-scroll" data-delay="3">
          <button className="btn-striped" id="enfoque-btn" onClick={onOpenEnfoque}>
            About my approach
          </button>
        </div>
      </div>
    </section>
  );
};

