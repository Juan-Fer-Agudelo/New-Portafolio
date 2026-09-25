import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { ProjectItem, WritingArticle, ActiveModal, PageView } from '../types';
import { useLang } from '../i18n/LangContext';
import { ARTICLE_AUTHOR } from '../data/portfolioData';
import { renderWithRightsHighlight } from '../utils/textHighlight';

// Configuración de EmailJS - Reemplaza con tus credenciales de https://www.emailjs.com/
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

interface ModalsProps {
  activeModal: ActiveModal;
  selectedProject: ProjectItem | null;
  selectedArticle: WritingArticle | null;
  onClose: () => void;
  onNavigate: (view: PageView, hash?: string) => void;
  onShowToast: (msg: string) => void;
  onEmailSuccess: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
  toastText: string;
  isToastVisible: boolean;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  selectedProject,
  selectedArticle,
  onClose,
  onNavigate,
  onShowToast,
  onEmailSuccess,
  onOpenContact,
  onOpenAbout,
  toastText,
  isToastVisible,
}) => {
  const { t, lang } = useLang();
  const me = t.modals.enfoque;
  const md = t.modals.projectDetail;
  const mc = t.modals.contact;
  const toast = t.toast;

  // Campos localizados del proyecto seleccionado
  const projDetails =
    lang === 'en' && selectedProject?.en
      ? selectedProject.en.details
      : selectedProject?.details;
  const projDate =
    lang === 'en' && selectedProject?.en?.date
      ? selectedProject.en.date
      : selectedProject?.date;

  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: mc.defaultSubject,
    body: mc.defaultBody,
  });
  const [isSending, setIsSending] = useState(false);

  const resetForm = () => {
    setEmailForm({
      name: '',
      email: '',
      subject: mc.defaultSubject,
      body: mc.defaultBody,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    // Verifica que EmailJS esté configurado
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      onShowToast(mc.notConfigured);
      return;
    }

    setIsSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: emailForm.name,
          email: emailForm.email,
          title: emailForm.subject,
          message: emailForm.body,
          // Alias adicionales por si el template usa otros nombres de variable
          from_name: emailForm.name,
          from_email: emailForm.email,
          reply_to: emailForm.email,
          subject: emailForm.subject,
        },
        EMAILJS_PUBLIC_KEY
      );
      resetForm();
      onEmailSuccess();
    } catch (err) {
      const errorMsg =
        err && typeof err === 'object' && 'text' in err
          ? String((err as { text: unknown }).text)
          : 'Error';
      onShowToast(`${mc.errorPrefix}${errorMsg}`);
    } finally {
      setIsSending(false);
    }
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
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card">
          <div className="modal-header-row">
            <h3 className="modal-title" id="enfoque-title">
              {me.title}<span className="dot">.</span>
            </h3>
            <button className="modal-close-icon-btn" id="enfoque-close-btn" onClick={onClose} aria-label="Cerrar modal">
              &times;
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
            {me.body}
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
              <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                <strong>{me.point1Title}</strong> {me.point1}
              </span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
              <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                <strong>{me.point2Title}</strong> {me.point2}
              </span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
              <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                <strong>{me.point3Title}</strong> {me.point3}
              </span>
            </li>
          </ul>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button className="btn-outline" id="enfoque-action-btn" style={{ flex: 1, minWidth: '150px' }} onClick={onClose}>
              <span>{me.btnContinue}</span>
            </button>
            <button
              className="btn-outline"
              id="enfoque-to-work-btn"
              style={{ flex: 1, minWidth: '150px', borderColor: '#682ae9', color: '#682ae9' }}
              onClick={() => { onClose(); onNavigate('work'); }}
            >
              <span>{me.btnWork}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: CONTACTO */}
      <div
        className={`modal-dialog ${activeModal === 'contact' ? 'active' : ''}`}
        id="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card">
          <div className="modal-header-row">
            <h3 className="modal-title" id="contact-form-title">
              {mc.title}<span className="dot">.</span>
            </h3>
            <button className="modal-close-icon-btn" id="contact-modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
              &times;
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '22px' }}>
            {mc.intro}
          </p>
          <form id="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email-name">{mc.labelName}</label>
              <input
                type="text"
                id="email-name"
                className="form-input"
                placeholder={mc.placeholderName}
                required
                value={emailForm.name}
                onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email-from">{mc.labelEmail}</label>
              <input
                type="email"
                id="email-from"
                className="form-input"
                placeholder={mc.placeholderEmail}
                required
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email-subject">{mc.labelSubject}</label>
              <input
                type="text"
                id="email-subject"
                className="form-input"
                placeholder={mc.placeholderSubject}
                required
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email-body">{mc.labelBody}</label>
              <textarea
                id="email-body"
                className="form-textarea"
                placeholder={mc.placeholderBody}
                required
                rows={6}
                value={emailForm.body}
                onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn-outline drawn"
                style={{ flex: 1, borderColor: 'var(--color-muted)', color: 'var(--color-muted)' }}
                onClick={onClose}
                disabled={isSending}
              >
                <span className="btn-content">
                  <span>{mc.btnCancel}</span>
                </span>
              </button>
              <button type="submit" className="btn-outline drawn" style={{ flex: 1 }} disabled={isSending}>
                <svg className="btn-stroke-svg" aria-hidden="true">
                  <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
                </svg>
                <span className="btn-content">
                  <span>{isSending ? mc.btnSending : mc.btnSend}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL: CORREO ENVIADO CON ÉXITO */}
      <div
        className={`modal-dialog ${activeModal === 'email-success' ? 'active' : ''}`}
        id="email-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-success-title"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(78, 205, 196, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '8px auto 20px auto',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </div>
          <h3 className="modal-title" id="email-success-title" style={{ marginBottom: '14px' }}>
            {mc.successTitle}<span className="dot">!</span>
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
            {mc.successBody}
          </p>
          <button
            className="btn-outline drawn"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            <svg className="btn-stroke-svg" aria-hidden="true">
              <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
            </svg>
            <span className="btn-content">
              <span>{mc.btnClose}</span>
            </span>
          </button>
        </div>
      </div>

      {/* MODAL: DETALLE DE PROYECTO */}
      <div
        className={`modal-dialog ${activeModal === 'project-detail' ? 'active' : ''}`}
        id="project-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card">
          <div className="modal-header-row">
            <h3 className="modal-title" id="detail-title">
              {selectedProject?.title || 'Proyecto'}<span className="dot">.</span>
            </h3>
            <button className="modal-close-icon-btn" id="detail-close-btn" onClick={onClose} aria-label="Cerrar modal">
              &times;
            </button>
          </div>
          {selectedProject?.image && (
            <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--color-border-subtle)' }}>
              <img
                src={selectedProject.image}
                alt={`Vista previa de ${selectedProject.title}`}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}
          {(selectedProject?.organization || projDate) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {selectedProject?.organization && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {selectedProject.organization}
                </span>
              )}
              {projDate && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-accent)', fontWeight: 600 }}>
                  {projDate}
                </span>
              )}
            </div>
          )}
          <p id="detail-desc" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
            {renderWithRightsHighlight(projDetails)}
          </p>
          {selectedProject?.techStack && selectedProject.techStack.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '12px' }}>
                {md.techLabel}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--color-body)', background: 'rgba(170, 220, 236, 0.28)', padding: '6px 12px', borderRadius: '6px' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedProject?.url && (
            <a
              href={selectedProject.url}
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
                <span>{md.btnVisit}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </a>
          )}
        </div>
      </div>

      {/* MODAL: DETALLE DE ARTÍCULO (BLOG) */}
      <div
        className={`modal-dialog ${activeModal === 'writing-detail' ? 'active' : ''}`}
        id="writing-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-title"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card modal-card--article">
          <div className="modal-header-row">
            <h3 className="modal-title" id="article-title">
              {selectedArticle?.title}
            </h3>
            <button className="modal-close-icon-btn" id="article-close-btn" onClick={onClose} aria-label="Cerrar modal">
              &times;
            </button>
          </div>

          {selectedArticle && (
            <>
              <div className="writing-meta article-meta-row">
                <span className="writing-date">{selectedArticle.date}</span>
                <span className="writing-tag">{selectedArticle.tag}</span>
                <span className="article-readtime">{selectedArticle.readTime}</span>
              </div>

              <div className="article-author-box">
                <button
                  className="article-author-avatar"
                  onClick={onOpenAbout}
                  aria-label={`Ver perfil de ${ARTICLE_AUTHOR.name}`}
                  style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
                >
                  {ARTICLE_AUTHOR.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </button>
                <div className="article-author-info">
                  <button
                    className="article-author-name"
                    onClick={onOpenAbout}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      color: 'inherit',
                      textAlign: 'left',
                    }}
                    aria-label={`Ver perfil de ${ARTICLE_AUTHOR.name}`}
                  >
                    {ARTICLE_AUTHOR.name}
                  </button>
                  <span className="article-author-role">{ARTICLE_AUTHOR.role}</span>
                  <p className="article-author-bio">{ARTICLE_AUTHOR.bio}</p>
                </div>
              </div>

              {selectedArticle.contentHtml ? (
                <div
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.contentHtml }}
                />
              ) : (
                <div className="article-body">
                  <p className="article-intro">{selectedArticle.excerpt}</p>
                </div>
              )}

              <div className="article-cta">
                <h4 className="article-cta-title">¿Tienes un reto de arquitectura o backend por resolver?</h4>
                <p className="article-cta-text">
                  Ofrezco auditorías de arquitectura y desarrollo de sistemas backend escalables, como consultor
                  freelance o en modalidad de contratación a término indefinido.
                </p>
                <button
                  type="button"
                  className="btn-outline drawn"
                  style={{ width: '100%' }}
                  onClick={onOpenContact}
                >
                  <svg className="btn-stroke-svg" aria-hidden="true">
                    <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
                  </svg>
                  <span className="btn-content">
                    <span>Hablemos de tu proyecto</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* TOAST */}
      <div
        className={`toast-msg ${isToastVisible ? 'active' : ''}`}
        id="toast-notification"
        role="status"
        aria-live="polite"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span id="toast-text">{toastText}</span>
      </div>
    </>
  );
};

