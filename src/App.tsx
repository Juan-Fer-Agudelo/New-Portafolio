import React, { useState, useEffect } from 'react';
import { PageView, ActiveModal, ProjectItem, WritingArticle } from './types';
import { useLang } from './i18n/LangContext';
import { WRITING_ARTICLES } from './data/portfolioData';
import { getPublishedArticles } from './data/blogStore';
import { Navbar } from './components/Navbar';
import { MenuOverlay } from './components/MenuOverlay';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { HomeFooter } from './components/HomeFooter';
import { WorkView } from './components/WorkView';
import { AboutView } from './components/AboutView';
import { SkillsView } from './components/SkillsView';
import { Modals } from './components/Modals';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useScrollAnimations } from './hooks/useScrollAnimations';

const DEFAULT_DOCUMENT_TITLE = document.title;
const DEFAULT_META_DESCRIPTION =
  document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

export const App: React.FC = () => {
  const isInitialAdmin =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/admin' ||
      window.location.pathname === '/admin/' ||
      window.location.hash === '#admin' ||
      window.location.hash.startsWith('#admin'));

  const [currentView, setCurrentView] = useState<PageView>(isInitialAdmin ? 'admin' : 'home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminLoggedIn') === 'true';
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<WritingArticle | null>(null);
  const [toastText, setToastText] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const { t } = useLang();

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

  // Abre el modal de un artículo del blog a partir de su slug (deep link vía #blog-<slug>)
  const openArticleBySlug = (slug: string) => {
    const allArticles = [...getPublishedArticles(), ...WRITING_ARTICLES];
    const article = allArticles.find((a) => (a.slug || a.id) === slug);
    if (article) {
      setCurrentView('home');
      setSelectedArticle(article);
      setActiveModal('writing-detail');
    }
  };

  // Manejo de hashes y rutas en URL para navegación directa
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/admin' || path === '/admin/' || hash === '#admin') {
        setCurrentView('admin');
        return;
      }

      if (hash.startsWith('#blog-')) {
        openArticleBySlug(hash.replace('#blog-', ''));
      } else if (hash === '#work' || hash === '#proyectos') {
        setCurrentView('home');
        setTimeout(() => {
          const target = document.querySelector('#proyectos');
          target?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash) {
        setCurrentView('home');
        setTimeout(() => {
          const target = document.querySelector(hash);
          target?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/' || window.location.hash === '#admin') {
      setCurrentView('admin');
    } else if (window.location.hash === '#work') {
      setCurrentView('home');
      setTimeout(() => {
        const target = document.querySelector('#proyectos');
        target?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (window.location.hash.startsWith('#blog-')) {
      openArticleBySlug(window.location.hash.replace('#blog-', ''));
    }

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Sincroniza <title> y meta description
  useEffect(() => {
    if (currentView === 'admin') {
      document.title = 'Bienvenido | PERFECT B Aesthetic Medicine';
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', 'Ingreso administrativo PERFECT B Aesthetic Medicine');
      return;
    }

    if (activeModal === 'writing-detail' && selectedArticle) {
      document.title = `${selectedArticle.title} | Juan Fernando Agudelo`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', selectedArticle.metaDescription || selectedArticle.excerpt);
      history.replaceState(null, '', `#blog-${selectedArticle.slug || selectedArticle.id}`);
    } else {
      document.title = DEFAULT_DOCUMENT_TITLE;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', DEFAULT_META_DESCRIPTION);
      if (window.location.hash.startsWith('#blog-')) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [currentView, activeModal, selectedArticle]);

  const handleNavigate = (view: PageView, hash?: string) => {
    if (view === 'admin') {
      setCurrentView('admin');
      history.pushState(null, '', '/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView === 'admin') {
      history.pushState(null, '', '/');
    }

    if (view === 'work' || hash === '#work' || hash === '#proyectos') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.querySelector('#proyectos');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        history.replaceState(null, '', window.location.pathname);
      }, 100);
      return;
    }

    // Navegación a la página "Sobre mí" (vista dedicada)
    if (view === 'about' || hash === '#about') {
      setCurrentView('about');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navegación a la página "Habilidades" (vista dedicada)
    if (view === 'skills' || hash === '#skills') {
      setCurrentView('skills');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Limpia el hash de la URL sin recargar ni saltar
        history.replaceState(null, '', window.location.pathname);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', window.location.pathname);
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

  const handleSelectArticle = (article: WritingArticle) => {
    setSelectedArticle(article);
    setActiveModal('writing-detail');
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

  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem('adminLoggedIn');
          setIsAdminLoggedIn(false);
          setCurrentView('home');
          window.location.href = '/';
        }}
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminLogin
        onBackToHome={() => handleNavigate('home')}
        onLoginSuccess={() => setIsAdminLoggedIn(true)}
      />
    );
  }

  return (
    <>
      {/* Línea fija decorativa en el borde izquierdo */}
      <div className="side-line" aria-hidden="true"></div>

      {/* Marca vertical lateral estilo editorial Robb Owen */}
      <div className="side-brand" aria-hidden="true">
        <span>{t.sideBrand}</span>
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
            <ContactSection
              onOpenContactModal={() => setActiveModal('contact')}
              onShowToast={handleShowToast}
            />
            <HomeFooter onNavigate={handleNavigate} />
          </div>
        ) : currentView === 'about' ? (
          <AboutView
            onNavigate={handleNavigate}
            onOpenContactModal={() => setActiveModal('contact')}
          />
        ) : currentView === 'skills' ? (
          <SkillsView onNavigate={handleNavigate} />
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
        selectedArticle={selectedArticle}
        onClose={() => setActiveModal('none')}
        onNavigate={handleNavigate}
        onShowToast={handleShowToast}
        onEmailSuccess={() => setActiveModal('email-success')}
        onOpenContact={() => setActiveModal('contact')}
        onOpenAbout={() => {
          setActiveModal('none');
          handleNavigate('about');
        }}
        toastText={toastText}
        isToastVisible={isToastVisible}
      />
    </>
  );
};

export default App;
