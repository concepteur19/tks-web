import { buildWhatsAppUrl } from '../lib/seo.ts';
import { getRoutePath, IMPLEMENTED_ROUTES, type RouteKey } from './routes.ts';
import { t } from './t.ts';
import type { Locale } from './types.ts';

/**
 * Données de navigation de la coque. Contrat : specs/002-kibreeze-core/contracts/shell.md.
 * Fonctions pures, sans Astro : les composants affichent, ce module décide.
 */

/** Onglets mobiles, dans l'ordre de la maquette validée (FR-LAND-3). */
export const TAB_BAR = ['home', 'experiences', 'accommodation', 'packages', 'stay'] as const;

/** Navigation ordinateur. Mon séjour est rendu à part, en icône avec badge. */
export const DESKTOP_NAV = ['experiences', 'accommodation', 'packages', 'mobility'] as const;

/** Liens du pied de page. « À propos » vise la section #a-propos de Contact. */
export const FOOTER_LINKS = [
  'experiences',
  'accommodation',
  'packages',
  'mobility',
  'contact',
] as const;

export const LEGAL_LINKS = ['legalNotice', 'privacy', 'terms'] as const;

export type ResolvedLink = { kind: 'internal'; href: string } | { kind: 'whatsapp'; href: string };

export function isImplemented(
  key: RouteKey,
  implemented: readonly RouteKey[] = IMPLEMENTED_ROUTES,
): boolean {
  return implemented.includes(key);
}

/** Garde d'une liste les seules pages livrées, dans leur ordre. */
export function visible<K extends RouteKey>(
  keys: readonly K[],
  implemented: readonly RouteKey[] = IMPLEMENTED_ROUTES,
): K[] {
  return keys.filter((key) => implemented.includes(key));
}

/**
 * Lien vers une page qui peut ne pas être livrée : le chemin interne si elle l'est,
 * sinon une conversation WhatsApp préremplie du message générique (FR-009).
 */
export function resolveLink(
  key: RouteKey,
  locale: Locale,
  whatsappNumber: string,
  implemented: readonly RouteKey[] = IMPLEMENTED_ROUTES,
): ResolvedLink {
  if (implemented.includes(key)) return { kind: 'internal', href: getRoutePath(key, locale) };
  return {
    kind: 'whatsapp',
    href: buildWhatsAppUrl(whatsappNumber, t(locale, 'whatsapp.genericMessage')),
  };
}
