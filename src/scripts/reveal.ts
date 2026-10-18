/**
 * Apparition au défilement et fondu des images (009, FR-006, FR-007). Voir
 * specs/009-micro-interactions/research.md §4.
 *
 * Rien n'est masqué tant que ce script n'a pas tourné : sans JavaScript, tout reste visible. Le
 * premier écran n'est jamais touché ; seuls les éléments situés plus bas attendent d'apparaître.
 * Sous « réduire les animations », le script ne fait rien.
 */
import { prefersReducedMotion } from '../lib/motion.ts';

/** Cascade : au plus 4 vagues (index 0 à 3), soit 3 × 60 + 320 = 500 ms. */
const REVEAL_INDEX_MAX = 3;

function revealOnScroll(): void {
  for (const group of document.querySelectorAll('[data-reveal-group]')) {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element, index) => {
      element.style.setProperty('--reveal-index', String(Math.min(index, REVEAL_INDEX_MAX)));
    });
  }

  const pending = new Set<Element>();
  for (const element of document.querySelectorAll('[data-reveal]')) {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      element.setAttribute('data-reveal-pending', '');
      pending.add(element);
    }
  }
  if (pending.size === 0) return;

  const show = (element: Element) => {
    if (!pending.delete(element)) return;
    observer.unobserve(element);
    element.removeAttribute('data-reveal-pending');
    element.setAttribute('data-revealing', '');
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) show(entry.target);
  });
  pending.forEach((element) => observer.observe(element));

  // Un défilement rapide peut sauter un élément sans qu'il croise l'écran : tout ce qui est passé
  // au-dessus du bas de l'écran apparaît aussi.
  let scheduled = false;
  const sweep = () => {
    scheduled = false;
    for (const element of pending) {
      if (element.getBoundingClientRect().top < window.innerHeight) show(element);
    }
    if (pending.size === 0) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };
  const onScroll = () => {
    if (!scheduled) requestAnimationFrame(sweep);
    scheduled = true;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

function fadeImages(): void {
  for (const image of document.querySelectorAll('img')) {
    // L'image prioritaire et celles qui glissent d'une page à l'autre s'affichent sans attente.
    if (image.complete || image.loading === 'eager' || image.fetchPriority === 'high') continue;
    if (getComputedStyle(image).viewTransitionName !== 'none') continue;
    image.setAttribute('data-fade-pending', '');
    const done = () => {
      image.removeAttribute('data-fade-pending');
      image.setAttribute('data-fading', '');
    };
    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', done, { once: true });
  }
}

if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
  revealOnScroll();
  fadeImages();
}
