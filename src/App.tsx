import React, { useState, useEffect } from 'react';
import { PageView, ActiveModal, ProjectItem } from './types';
import { Navbar } from './components/Navbar';
import { MenuOverlay } from './components/MenuOverlay';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { WritingSection } from './components/WritingSection';
import { ContactSection } from './components/ContactSection';
import { HomeFooter } from './components/HomeFooter';
import { WorkView } from './components/WorkView';
import { Modals } from './components/Modals';
import { useScrollAnimations } from './hooks/useScrollAnimations';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [toastText, setToastText] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Hook para animaciones y observadores de intersección y parallax
  useScrollAnimations(currentView);

  // Sincronizar tema de body según vista activa
  useEffect(() => {
    if (currentView === 'work') {
      document.body.classList.add('theme-work');
    } else {
      document.body.classList.remove('theme-work');
    }
  }, [currentView]);

  // Manejo de hashes en URL para navegación directa
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#work') {
        setCurrentView('work');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (currentView === 'work' && hash) {
          setCurrentView('home');
          setTimeout(() => {
            const target = document.querySelector(hash);
            target?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    if (window.location.hash === '#work') {
      setCurrentView('work');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleNavigate = (view: PageView, hash?: string) => {
    setCurrentView(view);
    if (view === 'work') {
      window.location.hash = '#work';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (hash) {
        window.location.hash = hash;
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleShowToast = (msg: string) => {
    setToastText(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3500);
  };

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setActiveModal('project-detail');
  };

  const handleToggleSearch = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setIsSearchOpen(true);
    setTimeout(() => {
      const searchInput = document.getElementById('search-input-field') as HTMLInputElement | null;
      const projectsSection = document.getElementById('proyectos');
      projectsSection?.scrollIntoView({ behavior: 'smooth' });
      searchInput?.focus();
    }, 200);
  };

  return (
    <>
      {/* Línea fija decorativa en el borde izquierdo */}
      <div className="side-line" aria-hidden="true"></div>

      {/* Marca vertical lateral estilo editorial Robb Owen */}
      <div className="side-brand" aria-hidden="true">
        <span>&copy; MMXXVI. Gwneud yn Ne Cymru.</span>
      </div>

      {/* Barra de navegación superior fija */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onToggleSearch={handleToggleSearch}
        onOpenContact={() => setActiveModal('contact')}
      />

      {/* Menú de pantalla completa overlay */}
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpenContact={() => setActiveModal('contact')}
      />

      {/* Contenido Principal */}
      <main className="main-content" id="main-content">
        {currentView === 'home' ? (
          <div id="view-home" className="page-view active">
            <HeroSection />
            <AboutSection onOpenEnfoque={() => setActiveModal('enfoque')} />
            <ProjectsSection
              onSelectProject={handleSelectProject}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />
            <WritingSection />
            <ContactSection
              onOpenContactModal={() => setActiveModal('contact')}
              onShowToast={handleShowToast}
            />
            <HomeFooter onNavigate={handleNavigate} />
          </div>
        ) : (
          <WorkView
            onNavigate={handleNavigate}
            onOpenContactModal={() => setActiveModal('contact')}
          />
        )}
      </main>

      {/* Diálogos modales y notificación toast */}
      <Modals
        activeModal={activeModal}
        selectedProject={selectedProject}
        onClose={() => setActiveModal('none')}
        onNavigate={handleNavigate}
        onShowToast={handleShowToast}
        toastText={toastText}
        isToastVisible={isToastVisible}
      />
    </>
  );
};

export default App;
