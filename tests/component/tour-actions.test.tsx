import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TourActions from '../../src/features/selection/TourActions.tsx';
import { $selection, clear, hydrate, setStay } from '../../src/features/selection/store.ts';
import { CATALOG } from '../fixtures/catalog.ts';

const AXE = {
  rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
} as const;
const URL_ = 'https://kibreeze.example/formules/essentiel-de-kribi';
const mount = () =>
  render(
    <TourActions
      service={CATALOG.get('essentiel-de-kribi')!}
      locale="fr"
      title="L'Essentiel de Kribi"
      url={URL_}
      whatsappNumber="237697135388"
    />,
  );
const link = () => screen.getByRole('link', { name: 'Personnaliser ce parcours' });
const message = () => decodeURIComponent(link().getAttribute('href')!.split('?text=')[1]!);

beforeEach(() => {
  hydrate(CATALOG);
  clear();
  setStay({});
});
afterEach(cleanup);

describe('actions de la fiche de parcours (010)', () => {
  it('part du minimum, ajoute le nombre choisi, et le message suit', async () => {
    const { container } = mount();
    expect(message()).toContain('pour 2 personnes');
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter : Nombre de personnes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter : Nombre de personnes' }));
    expect(message()).toContain('pour 4 personnes');
    expect(message()).toContain(URL_);
    fireEvent.click(screen.getByRole('button', { name: /^Ajouter à mon séjour/ }));
    expect($selection.get().items).toEqual([
      { serviceId: 'essentiel-de-kribi', quantities: [4], optionIds: [] },
    ]);
    expect((await axe.run(container, AXE)).violations).toEqual([]);
  });

  it('part du nombre de voyageurs du séjour', () => {
    setStay({ travelers: 5 });
    mount();
    expect(message()).toContain('pour 5 personnes');
  });
});
