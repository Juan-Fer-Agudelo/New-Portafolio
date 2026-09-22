import React from 'react';
import { useLang } from '../i18n/LangContext';

interface ContactSectionProps {
  onOpenContactModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenContactModal,
  onShowToast,
}) => {
  void onShowToast;
  const { t } = useLang();
  const c = t.contact;

  return (
    <section id="contacto" className="section-reveal">
      <div className="contact-inner">
        <h2 className="contact-heading animate-on-scroll">
          {c.heading}<span className="dot">?</span>
        </h2>

        <p className="contact-subtext animate-on-scroll" data-delay="1">
          {c.subtext}
        </p>

        <div className="contact-actions-row animate-on-scroll" data-delay="2">
          {/* Botón de Contacto Principal Robb Owen */}
          <button
            className="btn-striped"
            id="contact-modal-btn"
            onClick={onOpenContactModal}
          >
            {c.btnSend}
          </button>

          {/* Pill que abre el modal de contacto */}
          <button
            className="email-copy-pill"
            id="copy-email-btn"
            onClick={onOpenContactModal}
            title="Escríbeme un correo"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>juanferagudelo475@gmail.com</span>
          </button>
        </div>

        {/* Links de Redes Sociales */}
        <div className="contact-social-grid animate-on-scroll" data-delay="3">
          <a
            href="https://github.com/Juan-Fer-Agudelo"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            GITHUB &rarr;
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            LINKEDIN &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};


