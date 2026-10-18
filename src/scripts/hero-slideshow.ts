/**
 * Diaporama du hero (010, FR-011) : une photo toutes les 6 secondes, en fondu. Aucun défilement
 * sous « réduire les animations » ni quand l'onglet est caché ; bouton Pause visible (WCAG 2.2.2).
 * Sans JavaScript, la première photo reste seule et le bouton caché.
 */
import { prefersReducedMotion } from '../lib/motion.ts';

/** Intervalle entre deux photos : un rythme de lecture, pas une durée d'animation. */
const INTERVAL_MS = 6000;

const hero = document.querySelector('[data-section="hero"]');
const more = hero?.querySelector<HTMLTemplateElement>('template[data-hero-more]');
const button = hero?.querySelector<HTMLButtonElement>('[data-testid="hero-pause"]');

function startSlideshow(root: Element, toggle: HTMLButtonElement): void {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  let index = 0;
  let paused = false;
  let timer: number | undefined;

  const ready = (slide: HTMLElement) => slide.querySelector('img')?.complete !== false;
  const next = () => {
    const following = slides[(index + 1) % slides.length]!;
    // Photo pas encore chargée : on reste sur la précédente, sans trou (cas limite de la spec).
    if (!ready(following)) return;
    slides[index]!.removeAttribute('data-active');
    index = (index + 1) % slides.length;
    following.setAttribute('data-active', '');
  };
  const start = () => {
    if (timer === undefined && !paused && !document.hidden) {
      timer = window.setInterval(next, INTERVAL_MS);
    }
  };
  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
  };

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    if (paused) stop();
    else start();
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

if (hero && more && button && !prefersReducedMotion()) {
  // Les photos suivantes n'entrent dans la page qu'une fois la première affichée.
  const insert = () => {
    hero.querySelector('[data-slide]')!.after(more.content);
    startSlideshow(hero, button);
  };
  if (document.readyState === 'complete') insert();
  else window.addEventListener('load', insert, { once: true });
}
