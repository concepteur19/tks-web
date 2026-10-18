import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ExperienceConfigurator from '../../src/features/selection/ExperienceConfigurator.tsx';
import QuantityStepper from '../../src/features/selection/QuantityStepper.tsx';
import LineCustomizer from '../../src/features/selection/LineCustomizer.tsx';
import QuickAdd from '../../src/features/selection/QuickAdd.tsx';
import StayBadge from '../../src/features/selection/StayBadge.tsx';
import Toasts from '../../src/features/selection/Toasts.tsx';
import { ADDED_FLASH_MS } from '../../src/features/selection/feedback.tsx';
import RequestBar from '../../src/features/selection/RequestBar.tsx';
import StayPage from '../../src/features/selection/StayPage.tsx';
import { $draft } from '../../src/features/selection/draft.ts';
import { $selection, add, clear, hydrate, remove } from '../../src/features/selection/store.ts';
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
    // « Ajouté ✓ » un instant (009), bouton déjà bloqué ; « Déjà dans mon séjour » ensuite.
    expect(screen.getByTestId('add-to-stay').textContent).toBe('Ajouté ✓');
    expect(screen.getByTestId('add-to-stay')).toHaveProperty('disabled', true);
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
    // La ligne se replie d'abord (009), puis disparaît à la fin de la transition.
    const line = screen.getByTestId('stay-line');
    expect(line.hasAttribute('data-leaving')).toBe(true);
    expect($selection.get().items).toHaveLength(1);
    fireEvent.transitionEnd(line);
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
    expect(screen.getByTestId('quick-add').textContent).toBe('Ajouté ✓');
  });
});

describe('réglage avant ajout : parcours (005) et véhicules (006)', () => {
  it('parcours : part de 2 personnes, ne descend pas en dessous et ajoute le nombre choisi', async () => {
    const { container } = render(
      <LineCustomizer
        service={service('essentiel-de-kribi')}
        locale="fr"
        title="L'Essentiel de Kribi"
        buttonLabel="Personnaliser ce parcours"
      />,
    );
    const less = screen.getByRole('button', { name: 'Diminuer : Nombre de personnes' });
    const more = screen.getByRole('button', { name: 'Augmenter : Nombre de personnes' });
    expect(less).toHaveProperty('disabled', true);
    fireEvent.click(more);
    fireEvent.click(more);
    fireEvent.click(
      screen.getByRole('button', { name: "Personnaliser ce parcours : L'Essentiel de Kribi" }),
    );
    expect($selection.get().items).toEqual([
      { serviceId: 'essentiel-de-kribi', quantities: [4], optionIds: [] },
    ]);
    const results = await axe.run(container, AXE);
    expect(results.violations).toEqual([]);
  });

  it('véhicule : règle véhicules et jours dans leurs bornes, puis ajoute la ligne', async () => {
    const { container } = render(
      <LineCustomizer
        service={service('vehicule-premium')}
        locale="fr"
        title="Premium"
        buttonLabel="Ajouter à mon séjour"
      />,
    );
    expect(screen.getByText('Nombre de véhicules')).toBeTruthy();
    expect(screen.getByText('Nombre de jours')).toBeTruthy();
    const fewerVehicles = screen.getByRole('button', { name: 'Diminuer : Nombre de véhicules' });
    const moreVehicles = screen.getByRole('button', { name: 'Augmenter : Nombre de véhicules' });
    const moreDays = screen.getByRole('button', { name: 'Augmenter : Nombre de jours' });
    expect(fewerVehicles).toHaveProperty('disabled', true);
    for (let i = 0; i < 6; i += 1) fireEvent.click(moreVehicles);
    expect(moreVehicles).toHaveProperty('disabled', true);
    for (let i = 0; i < 4; i += 1) fireEvent.click(fewerVehicles);
    for (let i = 0; i < 3; i += 1) fireEvent.click(moreDays);
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter à mon séjour : Premium' }));
    expect($selection.get().items).toEqual([
      { serviceId: 'vehicule-premium', quantities: [1, 4], optionIds: [] },
    ]);
    const results = await axe.run(container, AXE);
    expect(results.violations).toEqual([]);
  });
});

describe('retours d’ajout (009)', () => {
  afterEach(() => vi.useRealTimers());

  it('« Ajouté ✓ » un instant, puis le libellé ou « Déjà dans mon séjour »', () => {
    vi.useFakeTimers();
    render(
      <QuickAdd service={service('formule-evasion')} locale="fr" title="Formule Évasion" wide />,
    );
    const button = screen.getByTestId('quick-add');
    fireEvent.click(button);
    expect(button.textContent).toBe('Ajouté ✓');
    expect(button.getAttribute('aria-label')).toBe('Ajouter à mon séjour : Formule Évasion');
    act(() => void vi.advanceTimersByTime(ADDED_FLASH_MS));
    expect(screen.getByTestId('quick-add').textContent).toBe('Déjà dans mon séjour');
  });

  it('réglage avant ajout : « Ajouté ✓ », puis le libellé du bouton', () => {
    vi.useFakeTimers();
    render(
      <LineCustomizer
        service={service('vehicule-premium')}
        locale="fr"
        title="Premium"
        buttonLabel="Ajouter à mon séjour"
      />,
    );
    const button = screen.getByRole('button', { name: 'Ajouter à mon séjour : Premium' });
    fireEvent.click(button);
    expect(button.textContent).toBe('Ajouté ✓');
    act(() => void vi.advanceTimersByTime(ADDED_FLASH_MS));
    expect(button.textContent).toBe('Ajouter à mon séjour');
  });

  it('le compteur rebondit quand le séjour grandit, pas quand il diminue', () => {
    render(<StayBadge locale="fr" />);
    act(() => void add({ serviceId: 'quad', quantities: [1], optionIds: [] }));
    const badge = screen.getByTestId('stay-badge');
    expect(badge.hasAttribute('data-bump')).toBe(true);
    fireEvent.animationEnd(badge);
    expect(badge.hasAttribute('data-bump')).toBe(false);
    act(() => void add({ serviceId: 'jet-ski', quantities: [], optionIds: [] }));
    fireEvent.animationEnd(screen.getByTestId('stay-badge'));
    act(() => void remove('jet-ski'));
    expect(screen.getByTestId('stay-badge').hasAttribute('data-bump')).toBe(false);
  });

  it('les notifications font vibrer une fois à l’ajout, jamais au retrait', () => {
    const vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });
    render(<Toasts locale="fr" />);
    act(() => void add({ serviceId: 'quad', quantities: [1], optionIds: [] }));
    expect(vibrate).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith(15);
    act(() => void add({ serviceId: 'quad', quantities: [1], optionIds: [] }));
    expect(vibrate).toHaveBeenCalledTimes(2);
    act(() => void remove('quad'));
    expect(vibrate).toHaveBeenCalledTimes(2);
    Reflect.deleteProperty(navigator, 'vibrate');
  });

  it('une notification entre puis sort avant de disparaître', () => {
    vi.useFakeTimers();
    render(<Toasts locale="fr" />);
    act(() => void add({ serviceId: 'quad', quantities: [1], optionIds: [] }));
    const message = screen.getByTestId('toast').querySelector('p')!;
    expect(message.getAttribute('data-motion')).toBe('enter');
    act(() => void vi.advanceTimersByTime(3500));
    expect(message.getAttribute('data-motion')).toBe('leave');
    fireEvent.animationEnd(message);
    expect(screen.getByTestId('toast').querySelector('p')).toBeNull();
  });

  it('le chiffre du sélecteur défile dans le sens du changement', () => {
    let value = 2;
    const { rerender } = render(
      <QuantityStepper
        value={value}
        min={1}
        max={5}
        label="Nombre"
        locale="fr"
        onChange={(v) => (value = v)}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Augmenter : Nombre' }));
    rerender(
      <QuantityStepper
        value={value}
        min={1}
        max={5}
        label="Nombre"
        locale="fr"
        onChange={(v) => (value = v)}
      />,
    );
    expect(screen.getByRole('spinbutton').getAttribute('data-roll')).toBe('up');
    fireEvent.click(screen.getByRole('button', { name: 'Diminuer : Nombre' }));
    rerender(
      <QuantityStepper
        value={value}
        min={1}
        max={5}
        label="Nombre"
        locale="fr"
        onChange={(v) => (value = v)}
      />,
    );
    expect(screen.getByRole('spinbutton').getAttribute('data-roll')).toBe('down');
  });
});
