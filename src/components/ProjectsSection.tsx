import React from 'react';
import { ProjectItem } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  isSearchOpen?: boolean;
  setIsSearchOpen?: (open: boolean) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  searchQuery = '',
  setSearchQuery,
  isSearchOpen = false,
  setIsSearchOpen,
}) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = normalizedQuery
    ? PROJECTS_DATA.filter((project) => {
        const haystack = [
          project.title,
          project.type,
          project.subtitle,
          project.description,
          project.organization ?? '',
          ...project.techStack,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : PROJECTS_DATA;

  return (
    <section id="proyectos" className="section-reveal open-source-section">
      <div className="open-source-container">
        {/* Cabecera de la sección */}
        <div className="open-source-header-row animate-on-scroll">
          <div className="open-source-header-text">
            <h2 className="open-source-heading">
              Mis Proyectos<span className="dot">.</span>
            </h2>
            <p className="open-source-subtext">
              Una selección de plataformas web, e-commerce, aplicaciones móviles,
              soluciones de inteligencia artificial y proyectos de automatización que
              he construido para clientes y empresas.
            </p>
          </div>

          {/* Franja decorativa de rayas diagonales */}
          <div className="open-source-stripes-box" aria-hidden="true"></div>
        </div>

        {/* Buscador */}
        {isSearchOpen && setSearchQuery && (
          <div className="projects-search-wrap animate-on-scroll">
            <input
              id="search-input-field"
              type="text"
              className="projects-search-input"
              placeholder="Busca por tecnología, nombre o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {setIsSearchOpen && (
              <button
                className="projects-search-close"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                aria-label="Cerrar búsqueda"
              >
                &times;
              </button>
            )}
          </div>
        )}

        {/* Lista de proyectos */}
        <div className="open-source-projects-list">
          {filteredProjects.length === 0 ? (
            <p className="projects-no-results">
              No se encontraron proyectos para "{searchQuery}".
            </p>
          ) : (
            filteredProjects.map((project, idx) => (
              <React.Fragment key={project.id}>
                <article className="open-source-item project-card-item animate-on-scroll">
                  <div className="project-card-header">
                    <span className="project-card-number">{project.number}</span>
                    <span className="project-card-type">{project.type}</span>
                  </div>

                  <div className="project-card-body">
                    <h3 className="open-source-title">
                      {project.title}
                      <span className="dot">.</span>
                    </h3>

                    <div className="project-card-meta">
                      {project.organization && (
                        <span className="project-card-org">{project.organization}</span>
                      )}
                      {project.date && (
                        <span className="project-card-date">{project.date}</span>
                      )}
                    </div>

                    <p className="open-source-desc">{project.description}</p>

                    <div className="project-card-tech">
                      {project.techStack.slice(0, 6).map((tech) => (
                        <span key={tech} className="project-tech-tag">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 6 && (
                        <span className="project-tech-tag project-tech-more">
                          +{project.techStack.length - 6}
                        </span>
                      )}
                    </div>

                    <div className="open-source-action">
                      <button
                        className="btn-striped"
                        onClick={() => onSelectProject(project)}
                      >
                        Ver detalles
                      </button>
                      {project.url && (
                        <a
                          className="project-card-visit"
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visitar sitio &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </article>

                {idx < filteredProjects.length - 1 && (
                  <div className="open-source-divider" aria-hidden="true"></div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
