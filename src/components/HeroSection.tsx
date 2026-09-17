import React from 'react';
import { RobbAvatar } from './RobbAvatar';
import { useLang } from '../i18n/LangContext';

export const HeroSection: React.FC = () => {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section id="hero">
      <div className="page-container hero-container">
        <div className="hero-grid">
          {/* Columna Izquierda: Texto Principal */}
          <div className="hero-text-col">
            <h1 className="hero-title">
              <span className="hero-line">
                <span className="hero-word" style={{ '--w-idx': 0 } as React.CSSProperties}>
                  {h.greeting.split(' ')[0]}
                </span>
                &nbsp;
                <span className="hero-word" style={{ '--w-idx': 1 } as React.CSSProperties}>
                  {h.greeting.split(' ')[1]}
                </span>
              </span>
              <br />
              <span className="hero-line">
                <span className="hero-word" style={{ '--w-idx': 2 } as React.CSSProperties}>
                  {h.nameLine.split(' ')[0]}
                </span>
                &nbsp;
                <span className="hero-word" style={{ '--w-idx': 3 } as React.CSSProperties}>
                  {h.nameLine.split(' ')[1]}
                </span>
                &nbsp;
                <span className="hero-word" style={{ '--w-idx': 4 } as React.CSSProperties}>
                  <strong>{h.name}</strong>
                  <span className="dot">.</span>
                </span>
              </span>
            </h1>

            <p className="hero-subtitle">
              {h.subtitle} <strong>{h.role}</strong>{' '}
              <br className="hero-sub-br" />
              {h.location}
            </p>
          </div>

          {/* Columna Derecha: Avatar Animado Interactivo */}
          <div className="hero-illustration-col">
            <div className="hero-avatar-stage" id="hero-avatar-container">
              <div className="hero-avatar-backdrop-stripes" aria-hidden="true"></div>
              <RobbAvatar />
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#about"
        className="hero-scroll-indicator"
        aria-label="Scroll to next section"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="hero-scroll-label">{h.scroll}</span>
        <div className="hero-scroll-line" id="hero-scroll-line"></div>
      </a>
    </section>
  );
};
