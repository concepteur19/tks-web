import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';

/**
 * Message de « Demander ce service » (FR-019, FR-WA-6) : salue Kibreeze, nomme l'expérience
 * et donne l'adresse de sa fiche, dans la langue de la page. La feature 004 y ajoutera les
 * quantités et options choisies. Fonction pure, couverte à 100 %.
 */
export function buildServiceRequestMessage({
  title,
  url,
  locale,
}: {
  title: string;
  url: string;
  locale: Locale;
}): string {
  return t(locale, 'whatsapp.serviceRequest', { title, url });
}
