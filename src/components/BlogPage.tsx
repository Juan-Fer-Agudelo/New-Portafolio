import React, { useState } from 'react';
import { WRITING_ARTICLES, ARTICLE_AUTHOR } from '../data/portfolioData';
import { WritingArticle } from '../types';

export const BlogPage: React.FC = () => {
  const [selected, setSelected] = useState<WritingArticle | null>(null);

  const openArticle = (article: WritingArticle) => {
    setSelected(article);
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = () => {
    setSelected(null);
    document.body.style.overflow = '';
  };

  return (
    <div className="blog-page">
      {/* Header con logo */}
      <header className="blog-page-topbar">
        <a href="/" className="blog-page-logo" aria-label="Volver al portafolio">
          <svg viewBox="0 0 54 30" fill="none" stroke="#682ae9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="blog-logo-icon">
            <polyline points="2,26 18,10 32,26" />
            <polyline points="14,26 38,3 52,26" />
            <line x1="2" y1="26" x2="52" y2="26" />
          </svg>
          <span className="blog-logo-text">
            JUAN FER <span className="blog-logo-accent">AGUDELO</span>
          </span>
        </a>
        <a href="/" className="blog-page-back-link">&larr; Portafolio</a>
      </header>

      {/* Título grande */}
      <h1 className="blog-page-title">Blog</h1>

      {/* Sección de blogs recientes */}
      <section className="blog-page-section">
        <h2 className="blog-page-section-heading">Blogs recientes</h2>

        <div className="blog-cards-grid">
          {WRITING_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="blog-card"
              role="button"
              tabIndex={0}
              onClick={() => openArticle(article)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openArticle(article);
                }
              }}
            >
              {/* Portada del artículo */}
              <div className="blog-card-cover">
                <span className="blog-card-cover-tag">{article.tag}</span>
                <span className="blog-card-cover-title">{article.title}</span>
                <span className="blog-card-cover-brand">JUAN FER AGUDELO</span>
              </div>

              <div className="blog-card-body">
                <span className="blog-card-date">{article.date}</span>
                <h3 className="blog-card-title">{article.title}</h3>
                <p className="blog-card-excerpt">{article.excerpt}</p>
                <span className="blog-card-readtime">{article.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Modal de detalle del artículo */}
      {selected && (
        <div
          className="modal-dialog active"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeArticle();
          }}
        >
          <div className="modal-card modal-card--article">
            <div className="modal-header-row">
              <h3 className="modal-title">{selected.title}</h3>
              <button className="modal-close-icon-btn" onClick={closeArticle} aria-label="Cerrar">
                &times;
              </button>
            </div>

            <div className="writing-meta article-meta-row">
              <span className="writing-date">{selected.date}</span>
              <span className="writing-tag">{selected.tag}</span>
              <span className="article-readtime">{selected.readTime}</span>
            </div>

            <div className="article-author-box">
              <div className="article-author-avatar" aria-hidden="true">
                {ARTICLE_AUTHOR.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="article-author-info">
                <span className="article-author-name">{ARTICLE_AUTHOR.name}</span>
                <span className="article-author-role">{ARTICLE_AUTHOR.role}</span>
                <p className="article-author-bio">{ARTICLE_AUTHOR.bio}</p>
              </div>
            </div>

            {selected.contentHtml ? (
              <div className="article-body" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
            ) : (
              <div className="article-body">
                <p className="article-intro">{selected.excerpt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
