import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GUIDE_KEY } from '../../src/features/guide/guide.ts';
import FirstVisitGuide from '../../src/features/guide/FirstVisitGuide.tsx';
import { $toastVisible } from '../../src/features/selection/Toasts.tsx';
import { $lastEvent, add, clear, hydrate } from '../../src/features/selection/store.ts';
import { CATALOG } from '../fixtures/catalog.ts';

const AXE = {
  rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
} as const;

/** Cible du tuto, rendue « visible » pour jsdom, qui ne calcule aucune mise en page. */
function target(id: string): HTMLElement {
  const element = document.createElement('button');
  element.dataset.guide = id;
  element.textContent = id;
  element.getClientRects = () => [new DOMRect(0, 0, 10, 10)] as unknown as DOMRectList;
  element.getBoundingClientRect = () => new DOMRect(0, 0, 10, 10);
  document.body.append(element);
  return element;
}

const renderGuide = () => render(<FirstVisitGuide locale="fr" delay={0} />);
/** Bulle affichée, effets appliqués. */
async function bubble(): Promise<HTMLElement> {
  const element = await screen.findByTestId('guide');
  // Ouverte hors de `act`, la bulle a ses effets programmés sur l'image suivante.
  await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
  return element;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  hydrate(CATALOG);
  clear();
  $lastEvent.set(null);
  $toastVisible.set(false);
});
afterEach(() => {
  cleanup();
  document.querySelectorAll('[data-guide]').forEach((element) => element.remove());
});

describe('tuto de première visite', () => {
  it('présente les trois étapes, puis se ferme et se mémorise', async () => {
    renderGuide();
    const dialog = await bubble();
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('false');
    expect(dialog.textContent).toContain('Étape 1 sur 3');
    expect(dialog.textContent).toContain('Explorez Kribi');
    fireEvent.click(screen.getByRole('button', { name: 'Suivant' }));
    expect(dialog.textContent).toContain('Composez votre séjour');
    fireEvent.click(screen.getByRole('button', { name: 'Suivant' }));
    expect(dialog.textContent).toContain('Recevez votre devis');
    fireEvent.click(screen.getByRole('button', { name: 'C’est parti'.replace('’', "'") }));
    expect(screen.queryByTestId('guide')).toBeNull();
    expect(localStorage.getItem(GUIDE_KEY)).toBe('done');
  });

  it('se ferme par « Passer » ou par Échap, sans prendre le focus', async () => {
    const before = document.activeElement;
    const { unmount } = renderGuide();
    await bubble();
    expect(document.activeElement).toBe(before);
    fireEvent.click(screen.getByRole('button', { name: 'Passer' }));
    expect(screen.queryByTestId('guide')).toBeNull();
    expect(localStorage.getItem(GUIDE_KEY)).toBe('done');
    unmount();

    localStorage.clear();
    renderGuide();
    await bubble();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('guide')).toBeNull();
  });

  it('passe à l’étape « envoyer » après un ajout au séjour', async () => {
    renderGuide();
    const dialog = await bubble();
    act(() => $lastEvent.set({ type: 'added', serviceId: 'chutes-de-la-lobe' }));
    expect(dialog.textContent).toContain('Étape 3 sur 3');
  });

  it('signale la cible de l’étape : bouton d’ajout, sinon Mon séjour', async () => {
    const explore = target('explore');
    const stay = target('stay');
    renderGuide();
    await bubble();
    expect(explore.hasAttribute('data-guide-active')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Suivant' }));
    expect(explore.hasAttribute('data-guide-active')).toBe(false);
    expect(stay.hasAttribute('data-guide-active')).toBe(true);
    const addButton = target('add');
    fireEvent.click(screen.getByRole('button', { name: 'Suivant' }));
    fireEvent.click(screen.getByRole('button', { name: 'Passer' }));
    expect(addButton.hasAttribute('data-guide-active')).toBe(false);
    expect(stay.hasAttribute('data-guide-active')).toBe(false);
  });

  it('s’efface pendant une notification', async () => {
    renderGuide();
    await bubble();
    act(() => $toastVisible.set(true));
    expect(screen.queryByTestId('guide')).toBeNull();
    act(() => $toastVisible.set(false));
    expect(screen.getByTestId('guide')).toBeTruthy();
  });

  it('ne s’affiche pas si le tuto est fait ou le séjour déjà rempli', async () => {
    localStorage.setItem(GUIDE_KEY, 'done');
    const { unmount } = renderGuide();
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    expect(screen.queryByTestId('guide')).toBeNull();
    unmount();

    localStorage.clear();
    add({ serviceId: 'chutes-de-la-lobe', quantities: [2], optionIds: [] });
    renderGuide();
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    expect(screen.queryByTestId('guide')).toBeNull();
  });

  it('ne produit aucune violation d’accessibilité', async () => {
    const { container } = renderGuide();
    await bubble();
    const results = await axe.run(container, AXE);
    expect(results.violations).toEqual([]);
  });
});
