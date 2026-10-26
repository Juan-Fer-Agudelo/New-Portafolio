import React, { useEffect, useRef } from 'react';
import { Info, Lock, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/demo-notice.css';

/* Aviso estándar que se muestra al abrir cualquier demo de "Ver proyecto".
   Todas las demos lo usan para que el pop-up se vea igual en todo el portafolio. */

export interface DemoNoticeAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface DemoNoticeProps {
  /** Id del título, usado por aria-labelledby */
  id: string;
  /** Empresa y herramienta del proyecto, p. ej. "Renault Sofasa · Power Apps" */
  eyebrow: string;
  title: string;
  /** Candado para el aviso de entrada; info (ámbar) para avisos secundarios */
  icon?: 'lock' | 'info';
  /** Párrafo destacado en ámbar (p. ej. "todos los datos son ficticios") */
  highlight?: React.ReactNode;
  children: React.ReactNode;
  compare?: { before: string; after: string; afterLabel?: string };
  points?: React.ReactNode[];
  actions: DemoNoticeAction[];
  footer?: React.ReactNode;
  onClose: () => void;
}

export const DemoNotice: React.FC<DemoNoticeProps> = ({
  id,
  eyebrow,
  title,
  icon = 'lock',
  highlight,
  children,
  compare,
  points,
  actions,
  footer,
  onClose,
}) => {
  const firstActionRef = useRef<HTMLButtonElement>(null);

  // Lleva el foco a la acción principal cada vez que cambia el aviso
  useEffect(() => {
    const t = setTimeout(() => firstActionRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [id]);

  // Se renderiza en <body> para que ningún contenedor con transform/animación afecte al position: fixed
  return createPortal(
    <div
      className="dn-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dn-card">
        <button className="dn-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="dn-head">
          <span className={`dn-icon ${icon === 'info' ? 'dn-icon--info' : ''}`} aria-hidden="true">
            {icon === 'info' ? <Info size={22} /> : <Lock size={22} />}
          </span>
          <span className="dn-eyebrow">{eyebrow}</span>
        </div>

        <h2 id={id} className="dn-title">
          {title}
        </h2>

        {highlight && <p className="dn-highlight">{highlight}</p>}
        <div className="dn-text">{children}</div>

        {compare && (
          <div className="dn-compare">
            <div>
              <span className="dn-tag dn-tag--before">Antes</span>
              <p>{compare.before}</p>
            </div>
            <div>
              <span className="dn-tag dn-tag--after">{compare.afterLabel ?? 'Con la solución'}</span>
              <p>{compare.after}</p>
            </div>
          </div>
        )}

        {points && points.length > 0 && (
          <ul className="dn-points">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}

        <div className="dn-actions">
          {actions.map((a, i) => (
            <button
              key={a.label}
              ref={i === 0 ? firstActionRef : undefined}
              className={(a.variant ?? (i === 0 ? 'primary' : 'secondary')) === 'primary' ? 'dn-btn dn-btn--primary' : 'dn-btn'}
              onClick={a.onClick}
            >
              {a.label}
            </button>
          ))}
        </div>

        {footer}
      </div>
    </div>,
    document.body
  );
};
