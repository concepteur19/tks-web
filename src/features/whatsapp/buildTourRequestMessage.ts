/** Message « Personnaliser ce parcours » (010, FR-009) : parcours, nombre de personnes, adresse. */
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';

export function buildTourRequestMessage({
  title,
  persons,
  url,
  locale,
}: {
  title: string;
  persons: number;
  url: string;
  locale: Locale;
}): string {
  return t(locale, 'packages.customiseMessage', { title, persons, url });
}
