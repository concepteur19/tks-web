import type { Pricing, PriceUnit } from '../../content/schemas.ts';

/**
 * Prix affiché sur une carte (data-model 002) : le prix du service s'il en a un ; sinon le plus
 * petit tarif chiffré, présenté « à partir de » ; « sur devis » si rien n'est chiffré.
 * Fonction pure, couverte à 100 % (constitution, principe III).
 */
export type CardPrice =
  { kind: 'fixed' | 'from'; amount: number; unit: PriceUnit } | { kind: 'quote' };

type Priced = { pricing?: Pricing | undefined; tiers?: { pricing: Pricing }[] | undefined };

export function cardPrice(service: Priced): CardPrice {
  if (service.pricing) {
    const { pricing } = service;
    return pricing.kind === 'quote'
      ? { kind: 'quote' }
      : { kind: pricing.kind, amount: pricing.amount, unit: pricing.unit };
  }
  const priced = (service.tiers ?? [])
    .map((tier) => tier.pricing)
    .filter((pricing): pricing is Exclude<Pricing, { kind: 'quote' }> => pricing.kind !== 'quote')
    .sort((a, b) => a.amount - b.amount);
  const lowest = priced[0];
  return lowest ? { kind: 'from', amount: lowest.amount, unit: lowest.unit } : { kind: 'quote' };
}
