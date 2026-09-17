import React from 'react';

interface ContactSectionProps {
  onOpenContactModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenContactModal,
  onShowToast,
}) => {
  const handleCopyEmail = async () => {
    const email = 'hello@robbowen.digital';
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
      onShowToast('Copied hello@robbowen.digital to clipboard!');
    } catch {
      onShowToast('Manual copy: hello@robbowen.digital');
    }
  };

  return (
    <section id="contacto" className="section-reveal">
      <div className="contact-inner">
        <h2 className="contact-heading animate-on-scroll">
          Got a project in mind<span className="dot">?</span>
        </h2>

        <p className="contact-subtext animate-on-scroll" data-delay="1">
          I'm currently available for select freelance projects, frontend technical consulting,
          and creative collaborations. Send me a message or connect on the channels below.
        </p>

        <div className="contact-actions-row animate-on-scroll" data-delay="2">
          {/* Botón de Contacto Principal Robb Owen */}
          <button
            className="btn-striped"
            id="contact-modal-btn"
            onClick={onOpenContactModal}
          >
            Send me a message
          </button>

          {/* Pill para copiar correo rápidamente */}
          <button
            className="email-copy-pill"
            id="copy-email-btn"
            onClick={handleCopyEmail}
            title="Click to copy email"
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
            <span>hello@robbowen.digital</span>
          </button>
        </div>

        {/* Links de Redes Sociales */}
        <div className="contact-social-grid animate-on-scroll" data-delay="3">
          <a
            href="https://github.com/robb0wen"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            GITHUB &rarr;
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            X / TWITTER &rarr;
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            LINKEDIN &rarr;
          </a>
          <a
            href="https://codepen.io"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            CODEPEN &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
