/** Le visiteur a-t-il demandé moins d'animations ? Faux hors navigateur (rendu, tests jsdom). */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
