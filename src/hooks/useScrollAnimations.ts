import { useEffect } from 'react';
import { PageView } from '../types';

export function useScrollAnimations(currentView: PageView) {
  useEffect(() => {
    // 1. Reveal and animate-on-scroll observers with forward-looking rootMargin
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '100px 0px 50px 0px',
      threshold: 0.01,
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'visible', 'revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed', 'visible', 'in-view', 'section-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '120px 0px 50px 0px', threshold: 0.01 }
    );

    const btnObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('drawn');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '50px 0px 50px 0px', threshold: 0.05 }
    );

    const sepObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '50px 0px 50px 0px', threshold: 0.05 }
    );

    const checkVisibility = () => {
      const windowH = window.innerHeight;
      document.querySelectorAll('.section-reveal, .animate-on-scroll').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowH + 300 && rect.bottom > -100) {
          el.classList.add('in-view', 'visible', 'revealed', 'section-revealed');
        }
      });
    };

    const observeAll = () => {
      checkVisibility();
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        animateObserver.observe(el);
      });
      document.querySelectorAll('.section-reveal').forEach((el) => {
        sectionObserver.observe(el);
      });
      document.querySelectorAll('.btn-outline').forEach((el) => {
        btnObserver.observe(el);
      });
      document.querySelectorAll('.project-separator').forEach((el) => {
        sepObserver.observe(el);
      });
    };

    // Immediate check and after React mounting
    checkVisibility();
    const timer = setTimeout(observeAll, 60);
    const fallbackTimer = setTimeout(checkVisibility, 400);

    // 2. Parallax effect for decorative elements
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const parallaxTargets = document.querySelectorAll<HTMLElement>('.parallax-target');
          parallaxTargets.forEach((target) => {
            const speed = parseFloat(target.getAttribute('data-parallax-speed') || '0.05');
            target.style.transform = `translateY(${Math.round(scrollY * speed)}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      animateObserver.disconnect();
      sectionObserver.disconnect();
      btnObserver.disconnect();
      sepObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentView]);
}
