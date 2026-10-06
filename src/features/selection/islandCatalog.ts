/**
 * Catalogue minimal transmis aux îlots (research.md §4) : de quoi calculer et afficher une ligne,
 * rien de plus. Fonction pure, sans Astro ni DOM.
 */
import type { Pricing, QuantityRule } from '../../content/schemas.ts';
import type { Locale, LocalizedString } from '../../i18n/types.ts';

export type IslandTier = {
  id: string;
  label: LocalizedString;
  pricing: Pricing;
  quantity?: QuantityRule | undefined;
};

export type IslandService = {
  id: string;
  title: LocalizedString;
  pricing?: Pricing | undefined;
  tiers?: IslandTier[] | undefined;
  quantity: QuantityRule;
  isOption: boolean;
  thumbnail?: string | undefined;
  href: Record<Locale, string>;
};

export type Catalog = ReadonlyMap<string, IslandService>;

type SourceService = {
  id: string;
  data: {
    title: LocalizedString;
    pricing?: Pricing | undefined;
    tiers?: IslandTier[] | undefined;
    quantity: QuantityRule;
    isOption?: boolean | undefined;
  };
};

export function toIslandCatalog(
  services: SourceService[],
  hrefs: (id: string) => Record<Locale, string>,
  thumbnails: Record<string, string> = {},
): IslandService[] {
  return services.map((service) => ({
    id: service.id,
    title: service.data.title,
    pricing: service.data.pricing,
    tiers: service.data.tiers?.map(({ id, label, pricing, quantity }) => ({
      id,
      label,
      pricing,
      quantity,
    })),
    quantity: service.data.quantity,
    isOption: service.data.isOption === true,
    thumbnail: thumbnails[service.id],
    href: hrefs(service.id),
  }));
}

export function catalogMap(services: IslandService[]): Catalog {
  return new Map(services.map((service) => [service.id, service]));
}
