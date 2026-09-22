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
  const { t, lang } = useLang();
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

        {/* Sección de Credenciales & Medallas */}
        <div className="about-credentials animate-on-scroll">
          <h2 className="about-subsection-title">{a.credentialsTitle}</h2>
          <div className="badges-grid">
            {CREDENTIALS.map((cred, i) => (
              <div key={i} className="badge-card">
                <img
                  src={cred.image}
                  alt={lang === 'en' ? cred.titleEn : cred.title}
                  className="badge-image"
                  loading="lazy"
                />
                <h3 className="badge-title">{lang === 'en' ? cred.titleEn : cred.title}</h3>
                <span className="badge-issuer">{cred.issuer}</span>
                {cred.url && (
                  <a className="credential-link" href={cred.url} target="_blank" rel="noopener noreferrer">
                    {lang === 'en' ? 'View credential' : 'Ver credencial'} &rarr;
                  </a>
                )}
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
