import React, { useState, useEffect } from 'react';
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
  const [activeCvIdx, setActiveCvIdx] = useState<number | null>(null);

  // Descarga una imagen individual por URL
  const handleDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descarga ambas imágenes del CV
  const handleDownloadBoth = () => {
    if (CV_IMAGES[0]) {
      handleDownloadImage(CV_IMAGES[0], 'CV-Juan-Fernando-Agudelo-Pag1.png');
    }
    if (CV_IMAGES[1]) {
      setTimeout(() => {
        handleDownloadImage(CV_IMAGES[1], 'CV-Juan-Fernando-Agudelo-Pag2.png');
      }, 350);
    }
  };

  // Manejo de teclas ESC, Flecha Izquierda y Derecha en el lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeCvIdx === null) return;
      if (e.key === 'Escape') {
        setActiveCvIdx(null);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveCvIdx((prev) => (prev !== null && prev < CV_IMAGES.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveCvIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : CV_IMAGES.length - 1));
      }
    };

    if (activeCvIdx !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCvIdx]);

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

        {/* Sección de CV (imágenes PNG con zoom y descarga) */}
        <div className="about-cv animate-on-scroll">
          <div className="about-cv-header">
            <h2 className="about-subsection-title">{a.cvTitle}</h2>
            <div className="about-cv-header-actions">
              <button
                type="button"
                className="about-cv-download"
                onClick={handleDownloadBoth}
                title="Descargar ambas páginas en formato PNG"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>{lang === 'en' ? 'Download CV (2 Pages PNG)' : 'Descargar CV (2 Páginas PNG)'} &darr;</span>
              </button>
              {CV_PDF_URL && (
                <a className="about-cv-download" href={CV_PDF_URL} target="_blank" rel="noopener noreferrer" download>
                  {a.cvDownload} (PDF) &darr;
                </a>
              )}
            </div>
          </div>

          {CV_IMAGES.length > 0 ? (
            <div className="cv-images-grid">
              {CV_IMAGES.map((img, i) => (
                <div key={i} className="cv-card-wrapper">
                  <div
                    className="cv-image-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveCvIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveCvIdx(i);
                      }
                    }}
                    title={lang === 'en' ? `Click to enlarge Page ${i + 1}` : `Clic para ampliar Página ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`CV página ${i + 1}`}
                      className="cv-image"
                      loading="lazy"
                    />
                    <div className="cv-image-hover-overlay">
                      <div className="cv-zoom-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        <span>{lang === 'en' ? 'Click to enlarge' : 'Clic para ampliar'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cv-card-footer">
                    <span className="cv-card-page-label">
                      {lang === 'en' ? `Page ${i + 1} of ${CV_IMAGES.length}` : `Página ${i + 1} de ${CV_IMAGES.length}`}
                    </span>
                    <button
                      type="button"
                      className="cv-card-btn-download"
                      onClick={() => handleDownloadImage(img, `CV-Juan-Fernando-Agudelo-Pag${i + 1}.png`)}
                      title={lang === 'en' ? `Download Page ${i + 1}` : `Descargar Página ${i + 1}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>{lang === 'en' ? `Download Pág. ${i + 1}` : `Descargar Pág. ${i + 1}`}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cv-empty">
              <p>{a.cvEmpty}</p>
            </div>
          )}
        </div>

        {/* Modal Lightbox de Ampliación de CV */}
        {activeCvIdx !== null && (
          <div
            className="cv-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Visualizador de CV ampliado"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveCvIdx(null);
            }}
          >
            <div className="cv-lightbox-modal">
              {/* Barra superior del visor */}
              <div className="cv-lightbox-topbar">
                <div className="cv-lightbox-page-indicator">
                  <span className="cv-lightbox-dot" aria-hidden="true"></span>
                  <span>
                    {lang === 'en'
                      ? `Page ${activeCvIdx + 1} of ${CV_IMAGES.length}`
                      : `Página ${activeCvIdx + 1} de ${CV_IMAGES.length}`}
                  </span>
                </div>

                <div className="cv-lightbox-actions">
                  <button
                    type="button"
                    className="cv-lightbox-action-btn"
                    onClick={() =>
                      handleDownloadImage(
                        CV_IMAGES[activeCvIdx],
                        `CV-Juan-Fernando-Agudelo-Pag${activeCvIdx + 1}.png`
                      )
                    }
                    title={lang === 'en' ? 'Download this page' : 'Descargar esta página'}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>{lang === 'en' ? 'Download Page' : 'Descargar Página'}</span>
                  </button>

                  <button
                    type="button"
                    className="cv-lightbox-action-btn primary"
                    onClick={handleDownloadBoth}
                    title={lang === 'en' ? 'Download both pages' : 'Descargar ambas páginas'}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>{lang === 'en' ? 'Download Both (PNG)' : 'Descargar Ambas (PNG)'}</span>
                  </button>

                  <button
                    type="button"
                    className="cv-lightbox-close-btn"
                    onClick={() => setActiveCvIdx(null)}
                    aria-label="Cerrar visor"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Contenedor central de la imagen con flechas de navegación */}
              <div className="cv-lightbox-body">
                {CV_IMAGES.length > 1 && (
                  <button
                    type="button"
                    className="cv-lightbox-nav-arrow prev"
                    onClick={() =>
                      setActiveCvIdx((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : CV_IMAGES.length - 1
                      )
                    }
                    aria-label="Página anterior"
                    title="Página anterior (Flecha Izq.)"
                  >
                    &#8249;
                  </button>
                )}

                <div className="cv-lightbox-img-wrap">
                  <img
                    src={CV_IMAGES[activeCvIdx]}
                    alt={`CV ampliado página ${activeCvIdx + 1}`}
                    className="cv-lightbox-img"
                  />
                </div>

                {CV_IMAGES.length > 1 && (
                  <button
                    type="button"
                    className="cv-lightbox-nav-arrow next"
                    onClick={() =>
                      setActiveCvIdx((prev) =>
                        prev !== null && prev < CV_IMAGES.length - 1 ? prev + 1 : 0
                      )
                    }
                    aria-label="Página siguiente"
                    title="Página siguiente (Flecha Der.)"
                  >
                    &#8250;
                  </button>
                )}
              </div>

              {/* Selector de miniaturas en la parte inferior */}
              {CV_IMAGES.length > 1 && (
                <div className="cv-lightbox-thumbnails">
                  {CV_IMAGES.map((thumb, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`cv-lightbox-thumb-btn ${idx === activeCvIdx ? 'active' : ''}`}
                      onClick={() => setActiveCvIdx(idx)}
                      aria-label={`Ver página ${idx + 1}`}
                    >
                      <img src={thumb} alt={`Miniatura página ${idx + 1}`} />
                      <span>{lang === 'en' ? `Page ${idx + 1}` : `Pág. ${idx + 1}`}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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

export default AboutView;

