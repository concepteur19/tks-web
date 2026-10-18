/**
 * Diaporama du hero (010, FR-011) : une photo toutes les 6 secondes, en fondu. Aucun défilement
 * sous « réduire les animations » ni quand l'onglet est caché ; bouton Pause visible (WCAG 2.2.2).
 * Sans JavaScript, la première photo reste seule et le bouton caché.
 *
 * Le défilement ne démarre qu'à la première interaction du visiteur (toucher, défilement, clavier).
 * Chrome cesse alors de mesurer l'élément principal affiché (LCP) : une photo suivante apparue
 * plus tôt était comptée comme un nouvel élément principal, à 6 s (mesuré le 2026-10-18 :
 * 1 mesure sur 5 à 79 au lieu de 94). SC-005 : l'accueil ne s'affiche pas plus tard qu'avant.
 */
import { prefersReducedMotion } from '../lib/motion.ts';

/** Intervalle entre deux photos : un rythme de lecture, pas une durée d'animation. */
const INTERVAL_MS = 6000;
/** Interactions qui arrêtent la mesure de l'élément principal par Chrome. */
const INTERACTIONS = ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'] as const;

const hero = document.querySelector('[data-section="hero"]');
const more = hero?.querySelector<HTMLTemplateElement>('template[data-hero-more]');
const button = hero?.querySelector<HTMLButtonElement>('[data-testid="hero-pause"]');

function startSlideshow(root: Element, toggle: HTMLButtonElement): void {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  let index = 0;
  let paused = toggle.getAttribute('aria-pressed') === 'true';
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
  button.hidden = false;
  // Première interaction : les photos suivantes entrent dans la page et le défilement démarre.
  // Avant, elles ne sont ni chargées ni affichées : rien ne concurrence la première photo.
  const engage = () => {
    for (const type of INTERACTIONS) window.removeEventListener(type, engage);
    hero.querySelector('[data-slide]')!.after(more.content);
    startSlideshow(hero, button);
  };
  for (const type of INTERACTIONS) window.addEventListener(type, engage, { passive: true });
}
