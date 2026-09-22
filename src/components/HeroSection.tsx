import React from 'react';
import { RobbAvatar } from './RobbAvatar';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero">
      <div className="page-container hero-container">
        <div className="hero-grid">
          {/* Columna Izquierda: Texto Principal Robb Owen */}
          <div className="hero-text-col">
            <h1 className="hero-title">
              <span className="hero-line">
                <span className="hero-word" style={{ '--w-idx': 0 } as React.CSSProperties}>
                  Hi,
                </span>
                &nbsp;
                <span className="hero-word" style={{ '--w-idx': 1 } as React.CSSProperties}>
                  my
                </span>
              </span>
              <br />
              <span className="hero-line">
                <span className="hero-word" style={{ '--w-idx': 2 } as React.CSSProperties}>
                  name
                </span>
                &nbsp;
                <span className="hero-word" style={{ '--w-idx': 3 } as React.CSSProperties}>
                  is
                </span>
                &nbsp;
                <span className="hero-word" style={{ '--w-idx': 4 } as React.CSSProperties}>
                  <strong>Juan</strong>
                  <span className="dot">.</span>
                </span>
              </span>
            </h1>

            <p className="hero-subtitle">
              Soy un <strong>desarrollador creativo independiente</strong> de{' '}
              <br className="hero-sub-br" />
              Medellín, Colombia.
            </p>
          </div>

          {/* Columna Derecha: Avatar Animado Interactivo */}
          <div className="hero-illustration-col">
            <div className="hero-avatar-stage" id="hero-avatar-container">
              {/* Franja de rayas diagonales Robb Owen */}
              <div className="hero-avatar-backdrop-stripes" aria-hidden="true"></div>
              <RobbAvatar />
            </div>
          </div>
        </div>
      </div>

      {/* Centro-abajo: Indicador de scroll con línea vertical */}
      <a
        href="#about"
        className="hero-scroll-indicator"
        aria-label="Scroll to next section"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="hero-scroll-label">
          SCRO<span className="scroll-accent">LL</span>
        </span>
        <div className="hero-scroll-line" id="hero-scroll-line"></div>
      </a>
    </section>
  );
};
