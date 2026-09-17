import React from 'react';
import { ProjectItem } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';
import {
  SynthwaveIllustration,
  TornisIllustration,
  RekishiIllustration,
} from './ProjectIllustrations';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  isSearchOpen?: boolean;
  setIsSearchOpen?: (open: boolean) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
}) => {
  const synthwave = PROJECTS_DATA.find((p) => p.id === 'synthwave') || PROJECTS_DATA[0];
  const tornis = PROJECTS_DATA.find((p) => p.id === 'tornis') || PROJECTS_DATA[1];
  const rekishi = PROJECTS_DATA.find((p) => p.id === 'rekishi') || PROJECTS_DATA[2];

  return (
    <section id="proyectos" className="section-reveal open-source-section">
      <div className="open-source-container">
        {/* Cabecera de Open Source con texto a la izquierda y caja de rayas a la derecha */}
        <div className="open-source-header-row animate-on-scroll">
          <div className="open-source-header-text">
            <h2 className="open-source-heading">
              Open Source<span className="dot">.</span>
            </h2>
            <p className="open-source-subtext">
              From time to time I like to release open source projects to help the wider
              web development community. Below are two of my most popular releases.
            </p>
          </div>

          {/* Franja decorativa de rayas diagonales Robb Owen */}
          <div className="open-source-stripes-box" aria-hidden="true"></div>
        </div>

        {/* Lista de proyectos */}
        <div className="open-source-projects-list">
          {/* Proyecto 1: SynthWave '84 */}
          <article className="open-source-item animate-on-scroll">
            <div className="open-source-art-col">
              <SynthwaveIllustration />
            </div>
            <div className="open-source-info-col">
              <h3 className="open-source-title">
                SynthWave '84<span className="dot">.</span>
              </h3>
              <p className="open-source-desc">
                I'm a big fan of Visual Studio Code, but when I couldn't find a colour
                scheme I liked, I decided to roll my own. SynthWave '84 was the result.
              </p>
              <p className="open-source-desc">
                Since I first posted about its development the theme has proven to be
                wildly popular, passing two million downloads in October 2024.
              </p>
              <div className="open-source-action">
                <button
                  className="btn-striped"
                  onClick={() => onSelectProject(synthwave)}
                >
                  Get SynthWave '84
                </button>
              </div>
            </div>
          </article>

          {/* Divisor horizontal */}
          <div className="open-source-divider" aria-hidden="true"></div>

          {/* Proyecto 2: Tornis */}
          <article className="open-source-item animate-on-scroll">
            <div className="open-source-art-col">
              <TornisIllustration />
            </div>
            <div className="open-source-info-col">
              <h3 className="open-source-title">
                Tornis<span className="dot">.</span>
              </h3>
              <p className="open-source-desc">
                Tornis is a minimal JavaScript library that watches the state of your browser's
                viewport, allowing you to respond whenever something changes.
              </p>
              <p className="open-source-desc">
                Think of it as a data store for your viewport, giving you access to screen size,
                mouse cursor position, scroll position, gyroscope and more.
              </p>
              <div className="open-source-action">
                <button
                  className="btn-striped"
                  onClick={() => onSelectProject(tornis)}
                >
                  Get Tornis
                </button>
              </div>
            </div>
          </article>

          {/* Divisor horizontal */}
          <div className="open-source-divider" aria-hidden="true"></div>

          {/* Proyecto 3: Rekishi */}
          <article className="open-source-item animate-on-scroll">
            <div className="open-source-art-col">
              <RekishiIllustration />
            </div>
            <div className="open-source-info-col">
              <h3 className="open-source-title">
                Rekishi<span className="dot">.</span>
              </h3>
              <p className="open-source-desc">
                Rekishi is a minimal wrapper for the History API that provides additional
                pub/sub functionality.
              </p>
              <p className="open-source-desc">
                If you need to create dynamic transitions between different pages or different
                types of content, then Rekishi can help.
              </p>
              <div className="open-source-action">
                <button
                  className="btn-striped"
                  onClick={() => onSelectProject(rekishi)}
                >
                  Get Rekishi
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
