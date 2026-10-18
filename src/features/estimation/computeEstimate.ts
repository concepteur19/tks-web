/**
 * Estimation d'une sélection (FR-EST-1 à 7, data-model 004). Une seule règle pour la fiche,
 * la page Mon séjour et le message WhatsApp (FR-018). Fonction pure, couverte à 100 %.
 */
import type { PriceUnit, QuantityDimension } from '../../content/schemas.ts';
import type { LocalizedString } from '../../i18n/types.ts';
import type { Catalog } from '../selection/islandCatalog.ts';
import { pricingOf, quantityRuleOf, type Selection } from '../selection/selection.ts';

export type EstimateLine = {
  serviceId: string;
  title: LocalizedString;
  quantities: number[];
  dimensions: {
    kind: QuantityDimension['kind'];
    label?: LocalizedString | undefined;
    labelOne?: LocalizedString | undefined;
  }[];
  tier?: { id: string; label: LocalizedString } | undefined;
  /** Sessions (US6) : 1 hors prestation qui compte des personnes. */
  sessions: number;
  pricingKind: 'fixed' | 'from' | 'quote';
  unit: PriceUnit | null;
  unitAmount: number | null;
  options: { id: string; title: LocalizedString; amount: number | null }[];
  lineAmount: number | null;
  overCapacity: boolean;
};

export type PriceEstimate = {
  lines: EstimateLine[];
  total: number;
  quoteCount: number;
  hasFromPrices: boolean;
  isQuoteOnly: boolean;
  currency: 'XAF';
};

export function computeEstimate(
  selection: Pick<Selection, 'items'>,
  catalog: Catalog,
): PriceEstimate {
  const lines: EstimateLine[] = [];
  for (const item of selection.items) {
    const service = catalog.get(item.serviceId);
    if (!service) continue;
    const rule = quantityRuleOf(service, item.tierId);
    const pricing = pricingOf(service, item.tierId);
    const tier = service.tiers?.find((entry) => entry.id === item.tierId);
    const sessions = item.sessions ?? 1;
    const personsIndex = rule.dimensions.findIndex((dimension) => dimension.kind === 'persons');
    const persons = personsIndex === -1 ? undefined : item.quantities[personsIndex];

    const priced = pricing && pricing.kind !== 'quote' ? pricing : undefined;
    const overCapacity =
      priced?.maxCapacity !== undefined && persons !== undefined && persons > priced.maxCapacity;
    // Sur un prix de groupe, le nombre de personnes ne multiplie pas le prix (capacité seulement).
    const multiplier = rule.dimensions.reduce((product, dimension, index) => {
      if (priced?.unit === 'per_group' && dimension.kind === 'persons') return product;
      return product * (item.quantities[index] ?? dimension.default);
    }, 1);

    const options = item.optionIds.flatMap((id) => {
      const option = catalog.get(id);
      if (!option) return [];
      const optionPricing = option.pricing;
      const amount =
        optionPricing && optionPricing.kind !== 'quote'
          ? (optionPricing.unit === 'per_person'
              ? optionPricing.amount * (persons ?? 1)
              : optionPricing.amount) * sessions
          : null;
      return [{ id, title: option.title, amount }];
    });

    const isQuote = !priced || overCapacity;
    const optionsTotal = options.reduce((sum, option) => sum + (option.amount ?? 0), 0);
    lines.push({
      serviceId: service.id,
      title: service.title,
      quantities: [...item.quantities],
      dimensions: rule.dimensions.map((dimension) => ({
        kind: dimension.kind,
        ...(dimension.kind === 'units'
          ? {
              label: dimension.label,
              ...(dimension.labelOne ? { labelOne: dimension.labelOne } : {}),
            }
          : {}),
      })),
      ...(tier ? { tier: { id: tier.id, label: tier.label } } : {}),
      sessions,
      pricingKind: isQuote ? 'quote' : priced.kind,
      unit: priced ? priced.unit : null,
      unitAmount: priced ? priced.amount : null,
      options,
      lineAmount: isQuote ? null : priced.amount * multiplier * sessions + optionsTotal,
      overCapacity,
    });
  }
  const quoteCount = lines.filter((line) => line.lineAmount === null).length;
  return {
    lines,
    total: lines.reduce((sum, line) => sum + (line.lineAmount ?? 0), 0),
    quoteCount,
    hasFromPrices: lines.some((line) => line.pricingKind === 'from'),
    isQuoteOnly: quoteCount === lines.length,
    currency: 'XAF',
  };
}
