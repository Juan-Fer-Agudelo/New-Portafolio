import React from 'react';
import { PageView } from '../types';

interface HomeFooterProps {
  onNavigate: (view: PageView, hash?: string) => void;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-copyright">
          &copy; MMXXVI. Portafolio de Juan. Diseñado y construido con precisión artesanal en Medellín, Colombia.
        </p>
        <div className="footer-links">
          <a
            href="#hero"
            className="nav-home-top-link"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Subir al Inicio
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Sobre Mí
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#proyectos"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Proyectos
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
            Work &rarr;
          </a>
          <span style={{ color: 'var(--color-muted)' }}>&bull;</span>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
};
