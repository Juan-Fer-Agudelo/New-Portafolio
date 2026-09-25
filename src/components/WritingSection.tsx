import React, { useState, useEffect } from 'react';
import { WRITING_ARTICLES } from '../data/portfolioData';
import { useLang } from '../i18n/LangContext';
import { WritingArticle } from '../types';
import { getPublishedArticles } from '../data/blogStore';

interface WritingSectionProps {
  onSelectArticle: (article: WritingArticle) => void;
}

export const WritingSection: React.FC<WritingSectionProps> = ({ onSelectArticle }) => {
  const { t } = useLang();
  const w = t.writing;

  // Combina los artículos estáticos con los creados desde el panel admin
  const [articles, setArticles] = useState<WritingArticle[]>(WRITING_ARTICLES);

  useEffect(() => {
    const refresh = () => {
      const stored = getPublishedArticles();
      setArticles([...stored, ...WRITING_ARTICLES]);
    };
    refresh();
    window.addEventListener('blog-posts-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('blog-posts-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <section id="writing" className="section-reveal" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="projects-header-row animate-on-scroll">
        <div className="projects-header-text">
          <h2 className="projects-heading" style={{ fontFamily: "var(--font-slab, 'Zilla Slab', Georgia, serif)" }}>
            {w.heading}<span className="dot">.</span>
          </h2>
          <p className="projects-subtext">{w.subtext}</p>
        </div>
        <div
          className="projects-dots-decoration pattern-dots parallax-target"
          data-parallax-speed="0.04"
          aria-hidden="true"
        ></div>
      </div>

      <div className="writing-articles-list">
        {articles.map((article, idx) => {
          return (
            <article
              key={article.id}
              className="writing-card animate-on-scroll"
              data-delay={idx > 0 ? String(idx) : undefined}
              role="button"
              tabIndex={0}
              onClick={() => onSelectArticle(article)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectArticle(article);
                }
              }}
            >
              <div className="writing-meta">
                <span className="writing-date">{article.date}</span>
                <span className="writing-tag">{article.tag}</span>
              </div>
              <h3 className="writing-title">{article.title}</h3>
              <p className="writing-excerpt">{article.excerpt}</p>
              <div className="writing-footer">
                <span className="writing-readtime">{article.readTime}</span>
                <span className="writing-arrow" aria-hidden="true">&rarr;</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
