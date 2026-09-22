import React, { useEffect } from 'react';
import { PageView } from '../types';
import { useLang } from '../i18n/LangContext';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: PageView, hash?: string) => void;
  onOpenContact: () => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenContact,
}) => {
  const { t } = useLang();
  const m = t.menuOverlay;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent, view: PageView, hash?: string) => {
    e.preventDefault();
    onClose();
    onNavigate(view, hash);
  };

  return (
    <div
      className={`menu-overlay ${isOpen ? 'active' : ''}`}
      id="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal"
    >
      {/* Barra superior: Logo + | + CLOSE a la izquierda, HIRE ME a la derecha */}
      <div className="menu-header-bar">
        <button
          className="menu-close-action"
          id="menu-close-btn"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <svg
            className="menu-logo-svg"
            viewBox="0 0 54 30"
            fill="none"
            stroke="#682ae9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,26 18,10 32,26" />
            <polyline points="14,26 38,3 52,26" />
            <line x1="2" y1="26" x2="52" y2="26" />
          </svg>
          <span className="menu-header-divider" aria-hidden="true">|</span>
          <span className="menu-close-label">{m.close}</span>
        </button>

        <a
          href="#contacto"
          className="menu-hire-link"
          id="menu-hire-btn"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            setTimeout(onOpenContact, 350);
          }}
          aria-label="Contrátame"
        >
          <svg
            className="menu-hire-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#682ae9"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>{m.hireMe}</span>
        </a>
      </div>

      {/* Fila de acento: barra púrpura horizontal + 5 iconos sociales */}
      <div className="menu-sub-row">
        <div className="menu-accent-bar" aria-hidden="true"></div>
        <div className="menu-social-group">
          {/* Instagram */}
          <a
            href="https://instagram.com/juanfer2351"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-social-icon"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          {/* GitHub */}
          <a
            href="https://github.com/Juan-Fer-Agudelo"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-social-icon"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          {/* Email */}
          <a
            href="mailto:juanfeeragudelo475@gmail.com"
            className="menu-social-icon"
            aria-label="Email"
            title="Email"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              setTimeout(onOpenContact, 350);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Navegación principal en lista exacta */}
      <nav className="menu-nav-body">
        <ul className="menu-nav-list">
          <li className="menu-nav-row">
            <a
              href="#hero"
              className="menu-nav-title menu-item-link"
              onClick={(e) => handleLinkClick(e, 'home', '#hero')}
            >
              {m.home}
            </a>
            <p className="menu-nav-desc">{m.homeDesc}</p>
          </li>
          <li className="menu-nav-row">
            <a
              href="#proyectos"
              className="menu-nav-title menu-item-link"
              id="menu-work-link"
              onClick={(e) => handleLinkClick(e, 'home', '#proyectos')}
            >
              {m.work}
            </a>
            <p className="menu-nav-desc">{m.workDesc}</p>
          </li>
          <li className="menu-nav-row">
            <a
              href="#about"
              className="menu-nav-title menu-item-link"
              onClick={(e) => handleLinkClick(e, 'about')}
            >
              {m.about}
            </a>
            <p className="menu-nav-desc">{m.aboutDesc}</p>
          </li>
          <li className="menu-nav-row">
            <a
              href="#skills"
              className="menu-nav-title menu-item-link"
              onClick={(e) => handleLinkClick(e, 'skills')}
            >
              {m.skills}
            </a>
            <p className="menu-nav-desc">{m.skillsDesc}</p>
          </li>
          <li className="menu-nav-row">
            <a
              href="#writing"
              className="menu-nav-title menu-item-link"
              onClick={(e) => handleLinkClick(e, 'home', '#writing')}
            >
              {m.writing}
            </a>
            <p className="menu-nav-desc">{m.writingDesc}</p>
          </li>
        </ul>
      </nav>
    </div>
  );
};

