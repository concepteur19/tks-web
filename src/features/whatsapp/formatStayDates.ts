/**
 * Dates du séjour en toutes lettres, pour le message et Mon séjour (010) : « du 12 au 16 décembre
 * 2026 », « 12 to 16 December 2026 ». Sans arrivée choisie, l'ancien texte libre, sinon rien.
 */
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import type { Stay } from '../selection/selection.ts';

const LANGUAGE: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB' };

function format(iso: string, locale: Locale, parts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LANGUAGE[locale], { ...parts, timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

const FULL: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

export function formatStayDates(stay: Stay, locale: Locale): string | undefined {
  const { arrival, departure } = stay;
  if (!arrival) return stay.dates;
  const to = departure ? format(departure, locale, FULL) : undefined;
  if (!departure || !to)
    return t(locale, 'message.datesFrom', { from: format(arrival, locale, FULL) });
  if (departure === arrival) return to;
  const sameYear = arrival.slice(0, 4) === departure.slice(0, 4);
  const sameMonth = sameYear && arrival.slice(5, 7) === departure.slice(5, 7);
  const from = sameMonth
    ? format(arrival, locale, { day: 'numeric' })
    : sameYear
      ? format(arrival, locale, { day: 'numeric', month: 'long' })
      : format(arrival, locale, FULL);
  return t(locale, 'message.datesRange', { from, to });
}
