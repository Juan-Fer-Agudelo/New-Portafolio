import React from 'react';
import { PageView } from '../types';
import { useLang } from '../i18n/LangContext';
import { Background } from './Background';

interface HomeFooterProps {
  onNavigate: (view: PageView, hash?: string) => void;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ onNavigate }) => {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="site-footer">
      <Background />
      <div className="footer-inner">
        <p className="footer-copyright">{f.copyright}</p>
        <div className="footer-links">
          <a
            href="#hero"
            className="nav-home-top-link"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {f.scrollTop}
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {f.about}
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#proyectos"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {f.projects}
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#work"
            className="footer-work-trigger"
            style={{ color: '#682ae9', fontWeight: 600 }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('work');
            }}
          >
            Mi trabajo &rarr;
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {f.contact}
          </a>
        </div>
      </div>
    </footer>
  );
};
