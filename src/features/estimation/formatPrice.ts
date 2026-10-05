import type { Locale } from '../../i18n/types.ts';

/**
 * Formatage des montants — FR-I18N-7, FR-EST-6, FR-EUR-1 à 3.
 * Le FCFA reste la devise de référence ; l'euro n'est qu'un équivalent indicatif,
 * calculé à la parité fixe stockée dans src/content/site/currency.json.
 * Fonctions pures, réutilisées par l'estimation de la feature 004.
 */

const INTL_LOCALES: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB' };
const NBSP = ' ';

function assertAmount(amount: number): void {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new RangeError(`montant invalide : ${amount}, entier strictement positif attendu`);
  }
}

/** « 100 000 FCFA » en français, « 100,000 FCFA » en anglais, sans coupure de ligne. */
export function formatXaf(amount: number, locale: Locale): string {
  assertAmount(amount);
  return `${new Intl.NumberFormat(INTL_LOCALES[locale]).format(amount)}${NBSP}FCFA`;
}

/** « ≈ 38,11 € » en français, « ≈ €38.11 » en anglais : toujours deux décimales. */
export function formatEurEquivalent(amount: number, locale: Locale, eurToXaf: number): string {
  assertAmount(amount);
  if (!(eurToXaf > 0)) throw new RangeError(`taux invalide : ${eurToXaf}`);
  const euros = new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / eurToXaf);
  return `≈${NBSP}${euros}`;
}
