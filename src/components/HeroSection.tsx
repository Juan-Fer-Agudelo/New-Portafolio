import React from 'react';
import { RobbAvatar } from './RobbAvatar';
import { useLang } from '../i18n/LangContext';

export const HeroSection: React.FC = () => {
  const { t } = useLang();
  const h = t.hero;

  // Divide el saludo y la línea del nombre en palabras para la animación escalonada
  const greetingWords = h.greeting.split(' ');
  const nameLineWords = h.nameLine.split(' ');
  let idx = 0;

  return (
    <section id="hero">
      <div className="page-container hero-container">
        <div className="hero-grid">
          {/* Columna Izquierda: Texto Principal */}
          <div className="hero-text-col">
            <h1 className="hero-title">
              <span className="hero-line">
                {greetingWords.map((word, i) => (
                  <React.Fragment key={`g-${i}`}>
                    <span className="hero-word" style={{ '--w-idx': idx++ } as React.CSSProperties}>
                      {word}
                    </span>
                    {i < greetingWords.length - 1 && <>&nbsp;</>}
                  </React.Fragment>
                ))}
              </span>
              <br />
              <span className="hero-line">
                {nameLineWords.map((word, i) => (
                  <React.Fragment key={`n-${i}`}>
                    <span className="hero-word" style={{ '--w-idx': idx++ } as React.CSSProperties}>
                      {word}
                    </span>
                    &nbsp;
                  </React.Fragment>
                ))}
                <span className="hero-word" style={{ '--w-idx': idx++ } as React.CSSProperties}>
                  <strong>{h.name}</strong>
                  <span className="dot">.</span>
                </span>
              </span>
            </h1>

            <p className="hero-subtitle">
              {h.subtitlePrefix}
              <strong>{h.roleBold}</strong>
              {h.subtitleMid}
              <br className="hero-sub-br" />
              {h.location}
            </p>
          </div>

          {/* Columna Derecha: Avatar Animado Interactivo */}
          <div className="hero-illustration-col">
            <div className="hero-avatar-stage" id="hero-avatar-container">
              {/* Franja de rayas diagonales */}
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
