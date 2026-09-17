import React, { useState } from 'react';
import { ProjectItem, ActiveModal, PageView } from '../types';

interface ModalsProps {
  activeModal: ActiveModal;
  selectedProject: ProjectItem | null;
  onClose: () => void;
  onNavigate: (view: PageView, hash?: string) => void;
  onShowToast: (msg: string) => void;
  toastText: string;
  isToastVisible: boolean;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  selectedProject,
  onClose,
  onNavigate,
  onShowToast,
  toastText,
  isToastVisible,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    onClose();
    setFormData({ name: '', email: '', message: '' });
    onShowToast(`¡Gracias, ${formData.name}! Mensaje enviado con éxito.`);
  };

  return (
    <>
      {/* MODAL: ENFOQUE CREATIVO */}
      <div
        className={`modal-dialog ${activeModal === 'enfoque' ? 'active' : ''}`}
        id="enfoque-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enfoque-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-card">
          <div className="modal-header-row">
            <h3 className="modal-title" id="enfoque-title">
              Mi Enfoque Creativo<span className="dot">.</span>
            </h3>
            <button
              className="modal-close-icon-btn"
              id="enfoque-close-btn"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-muted)',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}
          >
            Creo que el software web no debe sentirse como una cuadrícula industrial indiferenciada.
            Cada producto merece una voz tipográfica distintiva, micro-interacciones deliberadas y un
            código base artesanal sin excesos.
          </p>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
              <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                <strong>Tipografía primero:</strong> Jerarquía visual estricta y escalas de proporción armónica.
              </span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
              <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                <strong>Rendimiento nativo:</strong> JavaScript vanilla y CSS puro optimizado para 60 cuadros por segundo.
              </span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
              <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                <strong>Espacio negativo deliberado:</strong> Permitir que la interfaz respire sin saturación.
              </span>
            </li>
          </ul>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-outline"
              id="enfoque-action-btn"
              style={{ flex: 1, minWidth: '150px' }}
              onClick={onClose}
            >
              <span>Continuar en Home</span>
            </button>
            <button
              className="btn-outline"
              id="enfoque-to-work-btn"
              style={{ flex: 1, minWidth: '150px', borderColor: '#682ae9', color: '#682ae9' }}
              onClick={() => {
                onClose();
                onNavigate('work');
              }}
            >
              <span>Ver sección Work &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ENVÍAME UN MENSAJE */}
      <div
        className={`modal-dialog ${activeModal === 'contact' ? 'active' : ''}`}
        id="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-card">
          <div className="modal-header-row">
            <h3 className="modal-title" id="contact-form-title">
              Inicia la conversación<span className="dot">.</span>
            </h3>
            <button
              className="modal-close-icon-btn"
              id="contact-modal-close-btn"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>
          <form id="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="client-name">
                Tu Nombre
              </label>
              <input
                type="text"
                id="client-name"
                className="form-input"
                placeholder="ej. Valentina Rossi"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="client-email">
                Tu Correo Electrónico
              </label>
              <input
                type="email"
                id="client-email"
                className="form-input"
                placeholder="ej. valentina@estudio.co"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="client-msg">
                Detalles del Proyecto
              </label>
              <textarea
                id="client-msg"
                className="form-textarea"
                placeholder="Cuéntame sobre tu visión, metas y plazos..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
              <button type="submit" className="btn-outline drawn" style={{ width: '100%' }}>
                <svg className="btn-stroke-svg" aria-hidden="true">
                  <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
                </svg>
                <span className="btn-content">
                  <span>Enviar Mensaje</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL: DETALLE DE PROYECTO */}
      <div
        className={`modal-dialog ${activeModal === 'project-detail' ? 'active' : ''}`}
        id="project-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-card">
          <div className="modal-header-row">
            <h3 className="modal-title" id="detail-title">
              {selectedProject?.title || 'Proyecto'}
              <span className="dot">.</span>
            </h3>
            <button
              className="modal-close-icon-btn"
              id="detail-close-btn"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>
          <p
            id="detail-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-muted)',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}
          >
            {selectedProject?.details}
          </p>
          <div
            style={{
              background: 'rgba(197, 227, 232, 0.25)',
              border: '1px dashed var(--color-primary)',
              padding: '18px',
              marginBottom: '24px',
              borderRadius: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              INSTALACIÓN / ACCESO
            </span>
            <code
              id="detail-code"
              style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--color-primary)' }}
            >
              {selectedProject?.installCode}
            </code>
          </div>
          {selectedProject?.githubUrl && (
            <a
              href={selectedProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline drawn"
              id="detail-action-btn"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <svg className="btn-stroke-svg" aria-hidden="true">
                <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
              </svg>
              <span className="btn-content">
                <span>Visitar Repositorio en GitHub</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </a>
          )}
        </div>
      </div>

      {/* TOAST NOTIFICACIÓN */}
      <div
        className={`toast-msg ${isToastVisible ? 'active' : ''}`}
        id="toast-notification"
        role="status"
        aria-live="polite"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ECDC4"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span id="toast-text">{toastText}</span>
      </div>
    </>
  );
};
