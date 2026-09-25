import React from 'react';

export const TALENT_PHI_URL = 'https://talentphi.com/';

/**
 * Resalta frases de derechos reservados y menciones de autoría/derechos en el texto,
 * convirtiéndolas en un enlace interactivo hacia el sitio web de Talent Phi.
 */
export const renderWithRightsHighlight = (
  text: string | undefined,
  talentPhiUrl: string = TALENT_PHI_URL
): React.ReactNode => {
  if (!text) return null;

  // Regex que detecta frases de derechos reservados para Talent Phi
  const regex = /(\(?\b(?:Todos los derechos reservados son reservados para Talent Phi|All rights reserved to Talent Phi)\b\)?)/gi;

  const parts = text.split(regex);
  if (parts.length <= 1) return text;

  return (
    <>
      {parts.map((part, idx) => {
        if (regex.test(part)) {
          return (
            <a
              key={idx}
              href={talentPhiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rights-highlight-badge rights-highlight-link"
              title="Visitar Talent Phi"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="rights-highlight-icon"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M15 9.354a4 4 0 1 0 0 5.292"></path>
              </svg>
              <span>{part}</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginLeft: '2px', opacity: 0.85 }}
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};

