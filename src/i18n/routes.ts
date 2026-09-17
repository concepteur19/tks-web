import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from './types.ts';

/**
 * Table des adresses. Source unique du sélecteur de langue, des liens
 * alternatifs et du plan du site. Voir contracts/routes.md.
 */
export type RouteKey =
  | 'home'
  | 'transport'
  | 'tourism'
  | 'delivery'
  | 'stay'
  | 'contact'
  | 'notFound';

export const ROUTES: Record<RouteKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en/' },
  transport: { fr: '/transport', en: '/en/transport' },
  tourism: { fr: '/tourisme', en: '/en/tourism' },
  delivery: { fr: '/livraison', en: '/en/delivery' },
  stay: { fr: '/sejour', en: '/en/my-trip' },
  contact: { fr: '/contact', en: '/en/contact' },
  notFound: { fr: '/404', en: '/en/404' },
};

/** Routes réellement livrées par la feature 001. Les autres attendent 003 à 006. */
export const IMPLEMENTED_ROUTES: readonly RouteKey[] = ['home', 'notFound'];

function normalize(path: string): string {
  if (path === '/') return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

/** Chemin d'une route dans une langue. */
export function getRoutePath(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** Langue déduite d'un chemin. Tout ce qui n'est pas sous /en/ est français. */
export function getLocaleFromPath(path: string): Locale {
  const normalized = normalize(path);
  const segment = normalized.split('/')[1];
  return segment !== undefined && isLocale(segment) && segment !== DEFAULT_LOCALE
    ? segment
    : DEFAULT_LOCALE;
}

/** Clé de route correspondant à un chemin, ou `undefined` si inconnue. */
export function getRouteKeyFromPath(path: string): RouteKey | undefined {
  const normalized = normalize(path);
  const entries = Object.entries(ROUTES) as [RouteKey, Record<Locale, string>][];
  for (const [key, paths] of entries) {
    for (const locale of LOCALES) {
      if (normalize(paths[locale]) === normalized) return key;
    }
  }
  return undefined;
}

/**
 * Chemin équivalent dans l'autre langue. Un chemin inconnu renvoie la page
 * d'erreur de la langue cible, jamais une adresse inventée.
 */
export function getAlternatePath(path: string, locale: Locale): string {
  const key = getRouteKeyFromPath(path);
  return key ? ROUTES[key][locale] : ROUTES.notFound[locale];
}

/** Les deux adresses d'une même page, pour les liens alternatifs. */
export function getAlternates(path: string): Record<Locale, string> {
  const key = getRouteKeyFromPath(path) ?? 'notFound';
  return { ...ROUTES[key] };
}
