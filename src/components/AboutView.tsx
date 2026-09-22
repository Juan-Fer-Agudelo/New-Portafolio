import React from 'react';
import { PageView } from '../types';
import { useLang } from '../i18n/LangContext';

interface AboutViewProps {
  onNavigate: (view: PageView, hash?: string) => void;
  onOpenContactModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenContactModal }) => {
  const { t } = useLang();
  const a = t.aboutPage;

  return (
    <div id="view-about" className="page-view about-page">
      <section className="about-page-section">
        {/* Encabezado con nombre grande */}
        <header className="about-page-header animate-on-scroll">
          <h1 className="about-page-name">{a.name}</h1>
          <p className="about-page-subtitle">{a.subtitle}</p>
        </header>

        {/* Contenido: foto a la izquierda, texto a la derecha */}
        <div className="about-page-grid">
          <div className="about-page-photo-col animate-on-scroll">
            <div className="about-page-photo-frame">
              {/* Reemplaza el src cuando subas tu foto a src/assets/images/ */}
              <img
                src="/src/assets/images/juan-photo.jpg"
                alt="Juan Fernando Agudelo"
                className="about-page-photo"
                onError={(e) => {
                  // Placeholder si aún no existe la foto
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.about-photo-placeholder')) {
                    const ph = document.createElement('div');
                    ph.className = 'about-photo-placeholder';
                    ph.textContent = 'Tu foto aquí';
                    parent.appendChild(ph);
                  }
                }}
              />
            </div>
          </div>

          <div className="about-page-text-col animate-on-scroll" data-delay="1">
            {a.paragraphs.map((para, idx) => (
              <p key={idx} className="about-page-paragraph">
                {para}
              </p>
            ))}

            <div className="about-page-meta">
              <p className="about-page-represented">
                {a.representedBy}{' '}
                <span className="about-page-represented-name">{a.representedByName}</span>
              </p>
              <button
                className="about-page-bookings-btn"
                type="button"
                onClick={onOpenContactModal}
              >
                {a.bookings}
              </button>
            </div>
          </div>
        </div>

        {/* Botón para volver al inicio */}
        <div className="about-page-back">
          <a
            href="#hero"
            className="nav-return-home-btn"
            style={{ color: '#682ae9', fontWeight: 700, textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', '#hero');
            }}
          >
            &larr; {t.work.backHome}
          </a>
        </div>
      </section>
    </div>
  );
};
