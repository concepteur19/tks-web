import { describe, expect, it } from 'vitest';
import { cardPrice } from '../../src/features/estimation/cardPrice.ts';

describe('cardPrice', () => {
  it('reprend un prix ferme tel quel', () => {
    expect(cardPrice({ pricing: { kind: 'fixed', amount: 5000, unit: 'per_person' } })).toEqual({
      kind: 'fixed',
      amount: 5000,
      unit: 'per_person',
    });
  });

  it('reprend un prix « à partir de » tel quel', () => {
    expect(cardPrice({ pricing: { kind: 'from', amount: 15000, unit: 'per_night' } })).toEqual({
      kind: 'from',
      amount: 15000,
      unit: 'per_night',
    });
  });

  it('renvoie « sur devis » pour un prix sur devis', () => {
    expect(cardPrice({ pricing: { kind: 'quote' } })).toEqual({ kind: 'quote' });
  });

  it('affiche le plus petit tarif chiffré en « à partir de » (campement Bagyeli)', () => {
    expect(
      cardPrice({
        tiers: [
          { pricing: { kind: 'fixed', amount: 20000, unit: 'per_group' } },
          { pricing: { kind: 'fixed', amount: 7500, unit: 'per_person' } },
          { pricing: { kind: 'quote' } },
        ],
      }),
    ).toEqual({ kind: 'from', amount: 7500, unit: 'per_person' });
  });

  it('renvoie « sur devis » quand aucun tarif n’est chiffré', () => {
    expect(
      cardPrice({ tiers: [{ pricing: { kind: 'quote' } }, { pricing: { kind: 'quote' } }] }),
    ).toEqual({ kind: 'quote' });
  });

  it('renvoie « sur devis » pour un service sans prix ni tarif', () => {
    expect(cardPrice({})).toEqual({ kind: 'quote' });
  });
});
