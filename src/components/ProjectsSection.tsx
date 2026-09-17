import React, { useState, useMemo } from 'react';
import { ProjectItem } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';
import {
  SynthwaveIllustration,
  TornisIllustration,
  RekishiIllustration,
  KromaIllustration,
} from './ProjectIllustrations';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
}) => {
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PROJECTS_DATA;
    return PROJECTS_DATA.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderIllustration = (id: string) => {
    switch (id) {
      case 'synthwave':
        return <SynthwaveIllustration />;
      case 'tornis':
        return <TornisIllustration />;
      case 'rekishi':
        return <RekishiIllustration />;
      case 'kroma':
        return <KromaIllustration />;
      default:
        return null;
    }
  };

  return (
    <section id="proyectos" className="section-reveal">
      {/* Cabecera de Sección: Título + Subtexto editorial + Patrón de puntos */}
      <div className="projects-header-row animate-on-scroll">
        <div className="projects-header-text">
          <h2 className="projects-heading">
            Proyectos Seleccionados<span className="dot">.</span>
          </h2>
          <p className="projects-subtext">
            Una colección de herramientas de código abierto, librerías frontend y experimentos
            creativos diseñados con atención al detalle y enfoque artesanal.
          </p>
        </div>

        {/* Patrón de puntos geométrico decorativo */}
        <div
          className="projects-dots-decoration pattern-dots parallax-target"
          data-parallax-speed="0.04"
          aria-hidden="true"
        ></div>
      </div>

      {/* Barra de búsqueda interactiva (desplegable o permanente) */}
      <div
        className="projects-search-bar"
        id="projects-search-bar"
        style={{ display: isSearchOpen || searchQuery ? 'block' : 'none' }}
      >
        <div className="search-input-wrapper">
          <svg
            className="search-input-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input-field"
            id="search-input-field"
            placeholder="Buscar por tecnología, nombre o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Lista de Proyectos */}
      <div className="projects-list-container" id="projects-list">
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-muted)' }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>
              No se encontraron proyectos con el término "{searchQuery}".
            </p>
            <button
              className="btn-outline drawn"
              onClick={() => setSearchQuery('')}
              style={{ display: 'inline-flex' }}
            >
              <span>Mostrar todos los proyectos</span>
            </button>
          </div>
        ) : (
          filteredProjects.map((project, index) => {
            const isReversed = index % 2 === 1;
            const isLast = index === filteredProjects.length - 1;

            return (
              <React.Fragment key={project.id}>
                <article
                  className={`project-row-grid ${isReversed ? 'reversed' : ''} animate-on-scroll`}
                  data-project-id={project.id}
                >
                  {/* Columna de Información */}
                  <div className="project-info-col">
                    <span className="project-meta-label">
                      {project.number} &mdash; {project.type}
                    </span>

                    <h3 className="project-card-title">{project.title}</h3>

                    <h4 className="project-card-subtitle">{project.subtitle}</h4>

                    <p className="project-card-description">{project.description}</p>

                    <div className="project-tags-list">
                      {project.techStack.map((tag) => (
                        <span key={tag} className="project-tag-item">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="project-actions-row">
                      <button
                        className="btn-outline project-detail-btn"
                        onClick={() => onSelectProject(project)}
                      >
                        <svg className="btn-stroke-svg" aria-hidden="true">
                          <rect x="1" y="1" rx="24" ry="24" pathLength="100"></rect>
                        </svg>
                        <span className="btn-content">
                          <span>Ver Detalles y Código</span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </span>
                      </button>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-github-link"
                        aria-label={`Ver código fuente de ${project.title} en GitHub`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Columna Visual: Ilustración en disco hatched */}
                  <div className="project-visual-col">
                    <div className="project-hatched-circle">
                      {renderIllustration(project.id)}
                    </div>
                  </div>
                </article>

                {/* Separador ornamental entre proyectos */}
                {!isLast && (
                  <div className="project-separator" aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="var(--color-primary)"
                      opacity="0.3"
                    >
                      <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </section>
  );
};
