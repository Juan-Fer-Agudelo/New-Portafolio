import React from 'react';
import { PageView } from '../types';
import { useLang } from '../i18n/LangContext';
import { CREDENTIALS, CV_IMAGES, CV_PDF_URL } from '../data/credentialsData';
import profilePhoto from '../assets/images/photo.png';

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
              <img
                src={profilePhoto}
                alt="Juan Fernando Agudelo"
                className="about-page-photo"
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

        {/* Sección de Credenciales & Certificaciones */}
        <div className="about-credentials animate-on-scroll">
          <h2 className="about-subsection-title">{a.credentialsTitle}</h2>
          <div className="credentials-grid">
            {CREDENTIALS.map((cred, i) => (
              <div key={i} className="credential-card">
                <div className="credential-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <div className="credential-info">
                  <h3 className="credential-title">{cred.title}</h3>
                  <span className="credential-issuer">{cred.issuer}</span>
                  <span className="credential-date">{cred.date}</span>
                  {cred.url && (
                    <a className="credential-link" href={cred.url} target="_blank" rel="noopener noreferrer">
                      Ver credencial &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de CV (imágenes PNG) */}
        <div className="about-cv animate-on-scroll">
          <div className="about-cv-header">
            <h2 className="about-subsection-title">{a.cvTitle}</h2>
            {CV_PDF_URL && (
              <a className="about-cv-download" href={CV_PDF_URL} target="_blank" rel="noopener noreferrer" download>
                {a.cvDownload} &darr;
              </a>
            )}
          </div>
          {CV_IMAGES.length > 0 ? (
            <div className="cv-images">
              {CV_IMAGES.map((img, i) => (
                <img key={i} src={img} alt={`CV página ${i + 1}`} className="cv-image" loading="lazy" />
              ))}
            </div>
          ) : (
            <div className="cv-empty">
              <p>{a.cvEmpty}</p>
            </div>
          )}
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
