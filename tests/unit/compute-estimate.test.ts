import { describe, expect, it } from 'vitest';
import { computeEstimate } from '../../src/features/estimation/computeEstimate.ts';
import type { SelectedLine } from '../../src/features/selection/selection.ts';
import { CATALOG } from '../fixtures/catalog.ts';

const line = (serviceId: string, quantities: number[], extra: Partial<SelectedLine> = {}) => ({
  serviceId,
  quantities,
  optionIds: [],
  ...extra,
});
const estimate = (...items: SelectedLine[]) => computeEstimate({ items }, CATALOG);

describe('cas de référence du data-model 004', () => {
  it('pirogue de 6 personnes avec guide : 40 000', () => {
    const result = estimate(
      line('excursion-en-pirogue', [6], { optionIds: ['guide-touristique'] }),
    );
    expect(result.total).toBe(40000);
    expect(result.quoteCount).toBe(0);
    expect(result.lines[0]?.options).toEqual([
      {
        id: 'guide-touristique',
        title: { fr: 'Guide touristique', en: 'Tour guide' },
        amount: 5000,
      },
    ]);
  });

  it('pirogue à 10 personnes, au-delà de 8 : sur devis', () => {
    const result = estimate(line('excursion-en-pirogue', [10]));
    expect(result.lines[0]).toMatchObject({
      pricingKind: 'quote',
      lineAmount: null,
      overCapacity: true,
    });
    expect(result.total).toBe(0);
    expect(result.quoteCount).toBe(1);
  });

  it('chutes pour 2 avec musée par personne : 13 000', () => {
    expect(estimate(line('chutes-de-la-lobe', [2], { optionIds: ['musee-d-art'] })).total).toBe(
      13000,
    );
  });

  it('campement, tarif couple : 20 000 ; tarif groupe : sur devis', () => {
    const couple = estimate(line('campement-bagyeli', [], { tierId: 'couple' }));
    expect(couple.total).toBe(20000);
    expect(couple.lines[0]?.tier).toEqual({ id: 'couple', label: { fr: 'Couple', en: 'Couple' } });
    const group = estimate(line('campement-bagyeli', [], { tierId: 'groupe' }));
    expect(group.quoteCount).toBe(1);
    expect(group.lines[0]?.unit).toBeNull();
  });

  it('quad, 3 sessions : 30 000, avec le libellé de l’unité', () => {
    const result = estimate(line('quad', [3]));
    expect(result.total).toBe(30000);
    expect(result.lines[0]?.dimensions).toEqual([
      {
        kind: 'units',
        label: { fr: 'sessions', en: 'sessions' },
        labelOne: { fr: 'session', en: 'session' },
      },
    ]);
  });

  it('pirogue + chutes pour 2 + jet-ski : 45 000 et 1 sur devis', () => {
    const result = estimate(
      line('excursion-en-pirogue', [4]),
      line('chutes-de-la-lobe', [2]),
      line('jet-ski', []),
    );
    expect(result).toMatchObject({
      total: 45000,
      quoteCount: 1,
      isQuoteOnly: false,
      currency: 'XAF',
    });
  });

  it('jet-ski + bateau de plaisance : tout sur devis', () => {
    expect(estimate(line('jet-ski', []), line('bateau-de-plaisance', []))).toMatchObject({
      total: 0,
      quoteCount: 2,
      isQuoteOnly: true,
    });
  });
});

describe('cas de référence du data-model 006', () => {
  it('Premium, 1 véhicule × 4 jours : 140 000, estimatif', () => {
    const result = estimate(line('vehicule-premium', [1, 4]));
    expect(result.lines[0]?.lineAmount).toBe(140000);
    expect(result.total).toBe(140000);
    expect(result.hasFromPrices).toBe(true);
  });

  it('Yaris, 2 véhicules × 3 jours : 150 000', () => {
    expect(estimate(line('vehicule-yaris', [2, 3])).total).toBe(150000);
  });

  it('transferts et chauffeur privé : sur devis, hors du total', () => {
    const result = estimate(
      line('vehicule-premium', [1, 4]),
      line('transferts', []),
      line('chauffeur-prive', [4]),
    );
    expect(result.total).toBe(140000);
    expect(result.quoteCount).toBe(2);
    expect(result.lines.map((item) => item.lineAmount)).toEqual([140000, null, null]);
  });
});

describe('autres règles', () => {
  it('multiplie le prix par toutes les dimensions et repère les prix « à partir de »', () => {
    const result = estimate(line('location', [2, 3]));
    expect(result.total).toBe(150000);
    expect(result.hasFromPrices).toBe(true);
    expect(result.lines[0]?.dimensions).toEqual([
      { kind: 'units', label: { fr: 'véhicules', en: 'vehicles' } },
      { kind: 'days' },
    ]);
  });

  it('une sélection vide est « tout sur devis », sans total', () => {
    expect(estimate()).toMatchObject({ lines: [], total: 0, quoteCount: 0, isQuoteOnly: true });
  });

  it('une option sur une ligne sur devis laisse la ligne sur devis', () => {
    const result = estimate(line('jet-ski', [], { optionIds: ['guide-touristique'] }));
    expect(result.lines[0]).toMatchObject({ lineAmount: null });
    expect(result.lines[0]?.options[0]?.amount).toBe(5000);
  });

  it('une option par personne compte une personne sur une ligne sans personnes', () => {
    expect(estimate(line('feu-de-plage', [], { optionIds: ['musee-d-art'] })).total).toBe(51500);
  });

  it('ignore une ligne ou une option inconnue, et une option sur devis n’a pas de montant', () => {
    const catalog = new Map(CATALOG);
    catalog.set('option-devis', {
      ...CATALOG.get('guide-touristique')!,
      id: 'option-devis',
      pricing: { kind: 'quote' },
    });
    const result = computeEstimate(
      {
        items: [
          line('inconnu', []),
          line('feu-de-plage', [], { optionIds: ['option-devis', 'disparue'] }),
        ],
      },
      catalog,
    );
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]?.options).toEqual([
      { id: 'option-devis', title: { fr: 'Guide touristique', en: 'Tour guide' }, amount: null },
    ]);
    expect(result.total).toBe(50000);
  });

  it('prend la valeur par défaut d’une quantité manquante', () => {
    expect(estimate(line('chutes-de-la-lobe', [])).total).toBe(10000);
  });
});

describe('sessions (US6)', () => {
  it('chutes pour 4 personnes, 2 sessions : 40 000', () => {
    const result = estimate(line('chutes-de-la-lobe', [4], { sessions: 2 }));
    expect(result.lines[0]?.sessions).toBe(2);
    expect(result.total).toBe(40000);
  });

  it('options multipliées par les sessions', () => {
    const result = estimate(
      line('excursion-en-pirogue', [6], { sessions: 2, optionIds: ['guide-touristique'] }),
    );
    expect(result.lines[0]?.options[0]?.amount).toBe(10000);
    expect(result.total).toBe(80000);
  });

  it('pirogue au-delà de 8 personnes : sur devis, quelles que soient les sessions', () => {
    const result = estimate(line('excursion-en-pirogue', [10], { sessions: 3 }));
    expect(result.lines[0]?.lineAmount).toBeNull();
  });

  it('une ligne sans sessions en compte une', () => {
    expect(estimate(line('quad', [2])).lines[0]?.sessions).toBe(1);
  });
});
