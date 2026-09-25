import React from 'react';

/**
 * Resalta frases de derechos reservados y menciones de autoría/derechos en el texto.
 */
export const renderWithRightsHighlight = (text: string | undefined): React.ReactNode => {
  if (!text) return null;

  // Regex que detecta frases de derechos reservados
  const regex = /(\(?\b(?:Todos los derechos reservados son reservados para Talent Phi|All rights reserved to Talent Phi)\b\)?)/gi;

  const parts = text.split(regex);
  if (parts.length <= 1) return text;

  return (
    <>
      {parts.map((part, idx) => {
        if (regex.test(part)) {
          return (
            <strong key={idx} className="rights-highlight-badge">
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
              {part}
            </strong>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};
