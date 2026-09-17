import React from 'react';
import { WRITING_ARTICLES } from '../data/portfolioData';
import { useLang } from '../i18n/LangContext';

export const WritingSection: React.FC = () => {
  const { t } = useLang();
  const w = t.writing;
  const dataArticles = t.data.articles;

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
        {WRITING_ARTICLES.map((article, idx) => {
          const localizedArticle = dataArticles[idx];
          return (
            <article
              key={article.id}
              className="writing-card animate-on-scroll"
              data-delay={idx > 0 ? String(idx) : undefined}
            >
              <div className="writing-meta">
                <span className="writing-date">{localizedArticle?.date ?? article.date}</span>
                <span className="writing-tag">{article.tag}</span>
              </div>
              <h3 className="writing-title">{article.title}</h3>
              <p className="writing-excerpt">{localizedArticle?.excerpt ?? article.excerpt}</p>
              <div className="writing-footer">
                <span className="writing-readtime">{localizedArticle?.readTime ?? article.readTime}</span>
                <span className="writing-arrow" aria-hidden="true">&rarr;</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
