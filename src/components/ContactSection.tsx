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
  const { t } = useLang();
  const c = t.contact;
  const toast = t.toast;

  const handleCopyEmail = async () => {
    const email = 'hola@juandev.co';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      onShowToast(toast.emailCopied);
    } catch {
      onShowToast(toast.emailManual);
    }
  };

  return (
    <section id="contacto" className="section-reveal">
      <div className="contact-inner">
        <h2 className="contact-heading animate-on-scroll">
          {c.heading}<span className="dot">?</span>
        </h2>

        <p className="contact-subtext animate-on-scroll" data-delay="1">
          {c.subtext}<strong>hola@juandev.co</strong>{c.subtextEnd}
        </p>

        <div className="contact-actions-row animate-on-scroll" data-delay="2">
          <button
            className="btn-outline"
            id="contact-modal-btn"
            onClick={onOpenContactModal}
          >
            <svg className="btn-stroke-svg" aria-hidden="true">
              <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
            </svg>
            <span className="btn-content">
              <span>{c.btnSend}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
          </button>

          <button
            className="email-copy-pill"
            id="copy-email-btn"
            onClick={handleCopyEmail}
            title="Click para copiar correo al portapapeles"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>hola@juandev.co</span>
          </button>
        </div>

        <div className="contact-social-grid animate-on-scroll" data-delay="3">
          <a href="https://github.com/robb0wen" target="_blank" rel="noopener noreferrer" className="social-link">GITHUB &rarr;</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">X / TWITTER &rarr;</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LINKEDIN &rarr;</a>
          <a href="https://codepen.io" target="_blank" rel="noopener noreferrer" className="social-link">CODEPEN &rarr;</a>
        </div>
      </div>
    </section>
  );
};
