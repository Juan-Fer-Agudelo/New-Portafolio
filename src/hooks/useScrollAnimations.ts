import { useEffect } from 'react';
import { PageView } from '../types';

export function useScrollAnimations(currentView: PageView) {
  useEffect(() => {
    // 1. Reveal and animate-on-scroll observers
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -30px 0px', threshold: 0.05 }
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
      { root: null, rootMargin: '0px 0px -20px 0px', threshold: 0.2 }
    );

    const sepObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -20px 0px', threshold: 0.2 }
    );

    const observeAll = () => {
      document.querySelectorAll('.animate-on-scroll:not(.in-view)').forEach((el) => {
        animateObserver.observe(el);
      });
      document.querySelectorAll('.section-reveal:not(.revealed)').forEach((el) => {
        sectionObserver.observe(el);
      });
      document.querySelectorAll('.btn-outline:not(.drawn)').forEach((el) => {
        btnObserver.observe(el);
      });
      document.querySelectorAll('.project-separator:not(.in-view)').forEach((el) => {
        sepObserver.observe(el);
      });
    };

    // Small delay to allow React DOM mounting
    const timer = setTimeout(observeAll, 100);

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
