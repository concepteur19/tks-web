/**
 * Règles de la sélection « Mon séjour » (FR-SEL-1 à 7, data-model 004). Fonctions pures, sans
 * Astro, Preact ni DOM, couvertes à 100 % (constitution, principe III). Le store ne fait que
 * les appliquer.
 */
import type { Pricing, QuantityRule } from '../../content/schemas.ts';
import type { Catalog, IslandService, IslandTier } from './islandCatalog.ts';

export const SELECTION_VERSION = 1;
export const MAX_AGE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DATES_LENGTH = 80;
const MAX_TRAVELERS = 50;

export type SelectedLine = {
  serviceId: string;
  quantities: number[];
  tierId?: string | undefined;
  optionIds: string[];
};

export type Stay = { dates?: string | undefined; travelers?: number | undefined };

export type Selection = {
  version: typeof SELECTION_VERSION;
  items: SelectedLine[];
  stay: Stay;
  updatedAt: string;
};

export type SelectionEvent =
  | { type: 'added' | 'updated' | 'alreadyThere' | 'removed'; serviceId: string }
  | { type: 'merged'; serviceId: string; capped: boolean }
  | { type: 'cleared' }
  | { type: 'purged'; serviceIds: string[] }
  | { type: 'storageUnavailable' };

export type Result = { selection: Selection; event: SelectionEvent };

export function emptySelection(now: Date): Selection {
  return { version: SELECTION_VERSION, items: [], stay: {}, updatedAt: now.toISOString() };
}

/** Tarif choisi, s'il existe. */
function tierOf(service: IslandService, tierId: string | undefined) {
  return tierId === undefined ? undefined : service.tiers?.find((tier) => tier.id === tierId);
}

/** Règle de quantité effective : celle du tarif choisi, sinon celle du service. */
export function quantityRuleOf(service: IslandService, tierId?: string): QuantityRule {
  return tierOf(service, tierId)?.quantity ?? service.quantity;
}

/** Prix effectif : celui du tarif choisi, sinon celui du service. */
export function pricingOf(service: IslandService, tierId?: string): Pricing | undefined {
  return tierOf(service, tierId)?.pricing ?? service.pricing;
}

/** Une ligne sans quantité ou sur devis ne se duplique pas (FR-SEL-4). */
export function isDuplicable(service: IslandService, tierId?: string): boolean {
  return (
    quantityRuleOf(service, tierId).dimensions.length > 0 &&
    pricingOf(service, tierId)?.kind !== 'quote'
  );
}

/** Ramène chaque quantité dans ses bornes ; une valeur absente ou illisible prend la valeur par défaut. */
export function clampQuantities(rule: QuantityRule, quantities: readonly number[]): number[] {
  return rule.dimensions.map((dimension, index) => {
    const value = quantities[index];
    if (typeof value !== 'number' || !Number.isFinite(value)) return dimension.default;
    return Math.min(dimension.max, Math.max(dimension.min, Math.round(value)));
  });
}

/** Ligne par défaut : quantités par défaut, tarif le moins cher, aucune option (ajout rapide). */
export function defaultLine(service: IslandService): SelectedLine {
  type PricedTier = IslandTier & { pricing: Exclude<Pricing, { kind: 'quote' }> };
  const priced = (service.tiers ?? [])
    .filter((tier): tier is PricedTier => tier.pricing.kind !== 'quote')
    .sort((a, b) => a.pricing.amount - b.pricing.amount);
  const tierId = priced[0]?.id ?? service.tiers?.[0]?.id;
  const rule = quantityRuleOf(service, tierId);
  return {
    serviceId: service.id,
    quantities: rule.dimensions.map((dimension) => dimension.default),
    ...(tierId !== undefined ? { tierId } : {}),
    optionIds: [],
  };
}

function normalize(line: SelectedLine, service: IslandService, catalog: Catalog): SelectedLine {
  const tierId = tierOf(service, line.tierId)?.id;
  return {
    serviceId: service.id,
    quantities: clampQuantities(quantityRuleOf(service, tierId), line.quantities),
    ...(tierId !== undefined ? { tierId } : {}),
    optionIds: [...new Set(line.optionIds)].filter((id) => catalog.get(id)?.isOption === true),
  };
}

const touch = (selection: Selection, items: SelectedLine[], now: Date): Selection => ({
  ...selection,
  items,
  updatedAt: now.toISOString(),
});

const sameLine = (a: SelectedLine, b: SelectedLine) =>
  a.tierId === b.tierId &&
  a.quantities.join() === b.quantities.join() &&
  [...a.optionIds].sort().join() === [...b.optionIds].sort().join();

/** Ajoute une ligne, ou fusionne avec la ligne existante du même service (FR-SEL-2). */
export function addLine(
  selection: Selection,
  line: SelectedLine,
  catalog: Catalog,
  now: Date,
): Result {
  const service = catalog.get(line.serviceId);
  if (!service || service.isOption)
    return { selection, event: { type: 'removed', serviceId: line.serviceId } };
  const incoming = normalize(line, service, catalog);
  const index = selection.items.findIndex((item) => item.serviceId === service.id);
  if (index === -1) {
    return {
      selection: touch(selection, [...selection.items, incoming], now),
      event: { type: 'added', serviceId: service.id },
    };
  }
  const existing = selection.items[index] as SelectedLine;
  let merged: SelectedLine;
  let event: SelectionEvent;
  if (!isDuplicable(service, incoming.tierId) || existing.tierId !== incoming.tierId) {
    if (sameLine(existing, incoming))
      return { selection, event: { type: 'alreadyThere', serviceId: service.id } };
    merged = incoming;
    event = { type: 'updated', serviceId: service.id };
  } else {
    const rule = quantityRuleOf(service, incoming.tierId);
    let capped = false;
    const quantities = rule.dimensions.map((dimension, i) => {
      // Les deux lignes sont normalisées : une quantité par dimension, déjà bornée.
      const before = existing.quantities[i] as number;
      const added = incoming.quantities[i] as number;
      if (dimension.kind !== 'persons' && dimension.kind !== 'units') return added;
      if (before + added > dimension.max) capped = true;
      return Math.min(dimension.max, before + added);
    });
    merged = { ...incoming, quantities };
    event = { type: 'merged', serviceId: service.id, capped };
  }
  const items = selection.items.map((item, i) => (i === index ? merged : item));
  return { selection: touch(selection, items, now), event };
}

/** Modifie une ligne existante : quantités, tarif ou options (FR-SEL-3). */
export function updateLine(
  selection: Selection,
  serviceId: string,
  patch: Partial<Omit<SelectedLine, 'serviceId'>>,
  catalog: Catalog,
  now: Date,
): Result {
  const service = catalog.get(serviceId);
  const existing = selection.items.find((item) => item.serviceId === serviceId);
  if (!service || !existing) return { selection, event: { type: 'removed', serviceId } };
  const updated = normalize({ ...existing, ...patch, serviceId }, service, catalog);
  const items = selection.items.map((item) => (item.serviceId === serviceId ? updated : item));
  return { selection: touch(selection, items, now), event: { type: 'updated', serviceId } };
}

export function removeLine(selection: Selection, serviceId: string, now: Date): Result {
  return {
    selection: touch(
      selection,
      selection.items.filter((item) => item.serviceId !== serviceId),
      now,
    ),
    event: { type: 'removed', serviceId },
  };
}

export function clearSelection(selection: Selection, now: Date): Result {
  return {
    selection: { ...emptySelection(now), stay: selection.stay },
    event: { type: 'cleared' },
  };
}

function cleanStay(stay: unknown): Stay {
  if (!stay || typeof stay !== 'object') return {};
  const { dates, travelers } = stay as Record<string, unknown>;
  const result: Stay = {};
  if (typeof dates === 'string' && dates.trim() !== '') {
    result.dates = dates.trim().slice(0, MAX_DATES_LENGTH);
  }
  if (typeof travelers === 'number' && Number.isInteger(travelers)) {
    if (travelers >= 1 && travelers <= MAX_TRAVELERS) result.travelers = travelers;
  }
  return result;
}

/** Dates (texte libre) et voyageurs (entier 1 à 50), facultatifs (FR-SEL-10). */
export function setStay(selection: Selection, stay: Stay, now: Date): Selection {
  return { ...selection, stay: cleanStay(stay), updatedAt: now.toISOString() };
}

/**
 * Relit une sélection enregistrée : illisible, d'une autre version ou trop ancienne → vide ;
 * lignes d'un service disparu ou d'un tarif disparu → retirées et signalées (FR-SEL-5, FR-SEL-6).
 */
export function parseSelection(
  raw: unknown,
  catalog: Catalog,
  now: Date,
): { selection: Selection; purged: string[] } {
  let data: unknown = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return { selection: emptySelection(now), purged: [] };
    }
  }
  if (!data || typeof data !== 'object') return { selection: emptySelection(now), purged: [] };
  const record = data as Record<string, unknown>;
  const updatedAt = typeof record.updatedAt === 'string' ? Date.parse(record.updatedAt) : NaN;
  if (
    record.version !== SELECTION_VERSION ||
    !Array.isArray(record.items) ||
    Number.isNaN(updatedAt) ||
    now.getTime() - updatedAt > MAX_AGE_DAYS * DAY_MS
  ) {
    return { selection: emptySelection(now), purged: [] };
  }
  const purged: string[] = [];
  const items: SelectedLine[] = [];
  for (const entry of record.items as unknown[]) {
    if (!entry || typeof entry !== 'object') continue;
    const line = entry as Record<string, unknown>;
    const serviceId = typeof line.serviceId === 'string' ? line.serviceId : undefined;
    if (!serviceId || items.some((item) => item.serviceId === serviceId)) continue;
    const service = catalog.get(serviceId);
    const tierId = typeof line.tierId === 'string' ? line.tierId : undefined;
    if (!service || service.isOption || (tierId !== undefined && !tierOf(service, tierId))) {
      purged.push(serviceId);
      continue;
    }
    const optionIds = Array.isArray(line.optionIds)
      ? line.optionIds.filter((id): id is string => typeof id === 'string')
      : [];
    const missing = optionIds.filter((id) => catalog.get(id)?.isOption !== true);
    purged.push(...missing);
    items.push(
      normalize(
        {
          serviceId,
          quantities: Array.isArray(line.quantities) ? (line.quantities as number[]) : [],
          ...(tierId !== undefined ? { tierId } : {}),
          optionIds,
        },
        service,
        catalog,
      ),
    );
  }
  return {
    selection: {
      version: SELECTION_VERSION,
      items,
      stay: cleanStay(record.stay),
      updatedAt: new Date(updatedAt).toISOString(),
    },
    purged,
  };
}
