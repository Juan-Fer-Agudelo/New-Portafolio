import React from 'react';
import { ARTICLE_AUTHOR } from '../data/portfolioData';
import profilePhoto from '../assets/images/photo.png';

interface ArticleAuthorCardProps {
  /** Fecha del artículo (ej. "SEPTIEMBRE 2026"). */
  date?: string;
  /** Si se define, la foto y el nombre abren el perfil (vista "Sobre mí"). */
  onOpenProfile?: () => void;
}

// "SEPTIEMBRE 2026" -> "Septiembre 2026"
const formatDate = (date: string) =>
  date
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const ArticleAuthorCard: React.FC<ArticleAuthorCardProps> = ({ date, onOpenProfile }) => {
  const photo = (
    <img
      src={profilePhoto}
      alt={`Foto de ${ARTICLE_AUTHOR.name}`}
      className="article-author-photo"
      loading="lazy"
    />
  );

  return (
    <aside className="article-author-card" aria-label="Sobre el autor">
      <div className="article-author-card-head">
        {onOpenProfile ? (
          <button
            type="button"
            className="article-author-photo-btn"
            onClick={onOpenProfile}
            aria-label={`Ver perfil de ${ARTICLE_AUTHOR.name}`}
          >
            {photo}
          </button>
        ) : (
          photo
        )}

        <div className="article-author-card-meta">
          {onOpenProfile ? (
            <button type="button" className="article-author-card-name" onClick={onOpenProfile}>
              {ARTICLE_AUTHOR.name}
            </button>
          ) : (
            <span className="article-author-card-name">{ARTICLE_AUTHOR.name}</span>
          )}

          <span className="article-author-card-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="currentColor" />
              <path
                d="M7 12.5l3.2 3.2L17 9"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {ARTICLE_AUTHOR.role}
          </span>

          {date && <span className="article-author-card-date">Publicado {formatDate(date)}</span>}
        </div>
      </div>

      <p className="article-author-card-bio">{ARTICLE_AUTHOR.bio}</p>

      {ARTICLE_AUTHOR.profileUrl && (
        <p className="article-author-card-link">
          <strong>{ARTICLE_AUTHOR.profileLabel ?? 'Perfil'}:</strong>{' '}
          <a href={ARTICLE_AUTHOR.profileUrl} target="_blank" rel="noopener noreferrer">
            {ARTICLE_AUTHOR.profileHandle ?? ARTICLE_AUTHOR.profileUrl}
          </a>
        </p>
      )}
    </aside>
  );
};
