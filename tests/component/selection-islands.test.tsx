import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import ExperienceConfigurator from '../../src/features/selection/ExperienceConfigurator.tsx';
import QuantityStepper from '../../src/features/selection/QuantityStepper.tsx';
import QuickAdd from '../../src/features/selection/QuickAdd.tsx';
import RequestBar from '../../src/features/selection/RequestBar.tsx';
import StayPage from '../../src/features/selection/StayPage.tsx';
import { $draft } from '../../src/features/selection/draft.ts';
import { $selection, add, clear, hydrate } from '../../src/features/selection/store.ts';
import { CATALOG, SERVICES } from '../fixtures/catalog.ts';

const plain = (value: string | null) => (value ?? '').replace(/[\s\u202f\u00a0]+/g, ' ');
const options = SERVICES.filter((service) => service.isOption);
const service = (id: string) => CATALOG.get(id)!;
const AXE = {
  rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
} as const;

beforeEach(() => {
  hydrate(CATALOG);
  clear();
  $draft.set(null);
});
afterEach(cleanup);

describe('sélecteur de quantité', () => {
  it('respecte ses bornes et nomme ses boutons', () => {
    let value = 1;
    const { rerender } = render(
      <QuantityStepper
        value={value}
        min={1}
        max={2}
        label="Nombre de personnes"
        locale="fr"
        onChange={(v) => (value = v)}
      />,
    );
    expect(screen.getByRole('button', { name: 'Diminuer : Nombre de personnes' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter : Nombre de personnes' }));
    expect(value).toBe(2);
    rerender(
      <QuantityStepper
        value={2}
        min={1}
        max={2}
        label="Nombre de personnes"
        locale="fr"
        onChange={(v) => (value = v)}
      />,
    );
    expect(screen.getByRole('button', { name: 'Augmenter : Nombre de personnes' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '99' } });
    expect(value).toBe(2);
  });
});

describe('configurateur de fiche et barre d’action', () => {
  const mount = (id: string) =>
    render(
      <div>
        <ExperienceConfigurator service={service(id)} options={options} locale="fr" />
        <RequestBar
          service={service(id)}
          options={options}
          locale="fr"
          variant="card"
          pageUrl={`https://kibreeze.com/experiences/${id}`}
          whatsappNumber="237697135388"
          eurToXaf={655.957}
        />
      </div>,
    );

  it('met le total à jour avec les quantités et les options', async () => {
    const { container } = mount('excursion-en-pirogue');
    expect(plain(screen.getByTestId('draft-total').textContent)).toBe('35 000 FCFA');
    fireEvent.click(screen.getByLabelText(/^Guide touristique/));
    expect(plain(screen.getByTestId('draft-total').textContent)).toBe('40 000 FCFA');
    expect((await axe.run(container, AXE)).violations.map((v) => v.id)).toEqual([]);
  });

  it('ajoute la configuration au séjour, puis bloque le doublon d’une ligne sans quantité', () => {
    mount('feu-de-plage');
    fireEvent.click(screen.getByTestId('add-to-stay'));
    expect($selection.get().items.map((item) => item.serviceId)).toEqual(['feu-de-plage']);
    expect(screen.getByTestId('add-to-stay').textContent).toBe('Déjà dans mon séjour');
  });

  it('propose les tarifs et passe sur devis pour le tarif groupe', () => {
    mount('campement-bagyeli');
    fireEvent.click(screen.getByLabelText(/^Groupe/));
    expect(screen.getByTestId('request-card').textContent).toContain('Sur devis');
  });
});

describe('page Mon séjour', () => {
  const page = () =>
    render(
      <StayPage
        locale="fr"
        whatsappNumber="237697135388"
        eurToXaf={655.957}
        experiencesHref="/experiences"
        emptyImage={{ src: '/vide.webp', width: 560, height: 560 }}
      />,
    );

  it('affiche l’état vide', () => {
    page();
    expect(screen.getByTestId('stay-empty').textContent).toContain('Votre séjour est vide');
  });

  it('liste les lignes, le total, les prestations sur devis et le rappel', async () => {
    add({ serviceId: 'excursion-en-pirogue', quantities: [6], optionIds: ['guide-touristique'] });
    add({ serviceId: 'jet-ski', quantities: [], optionIds: [] });
    const { container } = page();
    expect(screen.getAllByTestId('stay-line')).toHaveLength(2);
    const total = plain(screen.getAllByTestId('stay-total')[0]!.textContent);
    expect(total).toContain('Total indicatif');
    expect(total).toContain('40 000 FCFA');
    expect(total).toContain('+ 1 prestation sur devis');
    expect(container.textContent).toContain('Ajoutez vos dates');
    expect((await axe.run(container, AXE)).violations.map((v) => v.id)).toEqual([]);
  });

  it('affiche « tout sur devis » sans montant', () => {
    add({ serviceId: 'jet-ski', quantities: [], optionIds: [] });
    add({ serviceId: 'bateau-de-plaisance', quantities: [], optionIds: [] });
    page();
    expect(plain(screen.getAllByTestId('stay-total')[0]!.textContent)).toBe(
      'Total : sur devis (2 prestations)',
    );
  });

  it('retire une ligne', () => {
    add({ serviceId: 'quad', quantities: [1], optionIds: [] });
    page();
    fireEvent.click(screen.getByRole('button', { name: 'Retirer Quad de mon séjour' }));
    expect($selection.get().items).toEqual([]);
  });
});

describe('ajout rapide pleine largeur (005)', () => {
  it('affiche « Ajouter à mon séjour », ajoute la formule, puis la bloque', () => {
    render(
      <QuickAdd service={service('formule-evasion')} locale="fr" title="Formule Évasion" wide />,
    );
    const button = screen.getByTestId('quick-add');
    expect(button.textContent).toBe('Ajouter à mon séjour');
    expect(button.className).toContain('w-full');
    fireEvent.click(button);
    expect($selection.get().items).toEqual([
      { serviceId: 'formule-evasion', quantities: [], optionIds: [] },
    ]);
    expect(screen.getByTestId('quick-add').textContent).toBe('Déjà dans mon séjour');
  });
});
