import React, { useEffect, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { Background } from './Background';

interface NavbarProps {
  onOpenMenu: () => void;
  onToggleSearch?: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenu,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, t, toggleLang } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="main-nav">
      <Background />
      {/* Izquierda: Logo geométrico + Divisor + MENU */}
      <div className="nav-left">
        <button
          className="nav-logo-btn"
          id="menu-toggle-btn"
          onClick={onOpenMenu}
          aria-label="Abrir menú de navegación"
        >
          <svg className="nav-logo-icon" viewBox="0 0 56 30" fill="none">
            <polygon
              points="4,26 22,6 40,26"
              fill="#aadcec"
              stroke="#682ae9"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points="20,26 36,6 52,26"
              fill="transparent"
              stroke="#682ae9"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <line
              x1="2" y1="26" x2="54" y2="26"
              stroke="#682ae9"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="nav-divider" aria-hidden="true">|</span>
          <span className="nav-menu-label">{t.nav.menu}</span>
        </button>
      </div>

      {/* Derecha: Toggle de idioma + Icono de globo de diálogo + HIRE ME */}
      <div className="nav-right">
        {/* Toggle ESP / ING */}
        <button
          className="nav-lang-toggle"
          onClick={toggleLang}
          aria-label={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
          title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        >
          <span className={`nav-lang-option ${lang === 'en' ? 'active' : ''}`}>ING</span>
          <span className="nav-lang-sep" aria-hidden="true">/</span>
          <span className={`nav-lang-option ${lang === 'es' ? 'active' : ''}`}>ESP</span>
        </button>

        <a
          href="#contacto"
          className="nav-hire-link"
          id="nav-hire-link"
          onClick={(e) => {
            e.preventDefault();
            onOpenContact();
          }}
          aria-label="Hire me"
        >
          <svg
            className="nav-hire-bubble"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#682ae9"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span className="nav-hire-label">{t.nav.hireMe}</span>
        </a>
      </div>
    </header>
  );
};
