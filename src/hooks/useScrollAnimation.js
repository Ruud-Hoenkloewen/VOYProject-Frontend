import { useEffect } from 'react';

/**
 * useScrollAnimation
 * Aplica la clase 'visible' a elementos con [data-animate] cuando entran al viewport.
 * Usa Intersection Observer API nativa — sin librerías externas.
 * Anima cada elemento solo una vez (unobserve después de la primera intersección).
 */
export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
