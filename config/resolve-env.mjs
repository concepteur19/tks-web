/**
 * Résolution des variables publiques du site, au moment de la construction.
 *
 * Ordre de priorité, du plus fort au plus faible :
 *   1. la variable explicitement définie, en local ou chez l'hébergeur ;
 *   2. l'adresse que Cloudflare fournit automatiquement à chaque construction ;
 *   3. une valeur de repli versionnée dans le dépôt.
 *
 * Ces deux valeurs sont publiques : elles finissent dans le HTML. Aucune n'est
 * un secret, ce qui rend le repli acceptable. Le format reste vérifié par
 * src/lib/env.ts, qui fait échouer la construction sur une valeur invalide.
 */

/** Numéro WhatsApp officiel de TKS, réponse E1 du questionnaire client. */
export const DEFAULT_WHATSAPP_NUMBER = '237697135388';

/** Adresse utilisée quand rien d'autre n'est disponible, en développement. */
export const DEFAULT_SITE_URL = 'http://localhost:4321';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function withoutTrailingSlash(value) {
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ value: string, source: 'explicit' | 'cloudflare' | 'default' }}
 */
export function resolveSiteUrl(env = {}) {
  const explicit = clean(env.PUBLIC_SITE_URL);
  if (explicit) return { value: withoutTrailingSlash(explicit), source: 'explicit' };

  // Cloudflare expose l'adresse de la construction en cours : l'adresse du
  // projet en production, celle de l'aperçu sur une autre branche.
  const cloudflare = clean(env.CF_PAGES_URL);
  if (cloudflare) return { value: withoutTrailingSlash(cloudflare), source: 'cloudflare' };

  return { value: DEFAULT_SITE_URL, source: 'default' };
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ value: string, source: 'explicit' | 'default' }}
 */
export function resolveWhatsAppNumber(env = {}) {
  const explicit = clean(env.PUBLIC_WHATSAPP_NUMBER);
  if (explicit) return { value: explicit, source: 'explicit' };
  return { value: DEFAULT_WHATSAPP_NUMBER, source: 'default' };
}
