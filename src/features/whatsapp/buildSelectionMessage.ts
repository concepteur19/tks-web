/**
 * Message récapitulatif envoyé sur WhatsApp (FR-WA-3 à 5, FR-I18N-6). Intention `quote` depuis
 * Mon séjour, `single` depuis une fiche. Fonction pure, couverte à 100 % ; gabarits dans les
 * dictionnaires.
 */
import type { EstimateLine, PriceEstimate } from '../estimation/computeEstimate.ts';
import { formatXaf } from '../estimation/formatPrice.ts';
import { localize, t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import type { Stay } from '../selection/selection.ts';
import { buildServiceRequestMessage } from './buildServiceRequestMessage.ts';

export const MAX_ENCODED_LENGTH = 1800;

export type SelectionMessageInput = {
  estimate: PriceEstimate;
  stay?: Stay | undefined;
  intent: 'quote' | 'single';
  locale: Locale;
  /** Intention `single` : adresse absolue de la fiche. */
  url?: string | undefined;
};

/** Quantités en toutes lettres : « 6 personnes », « 2 véhicules × 3 jours ». */
export function describeQuantities(line: EstimateLine, locale: Locale): string {
  const parts = line.dimensions.map((dimension, index) => {
    const count = line.quantities[index] ?? 0;
    if (dimension.kind === 'units') {
      return `${count} ${dimension.label ? localize(dimension.label, locale) : ''}`.trim();
    }
    return t(locale, `quantity.${dimension.kind}`, { count });
  });
  if (line.tier)
    parts.unshift(t(locale, 'message.tier', { label: localize(line.tier.label, locale) }));
  return parts.join(' × ');
}

/** Deux-points typographique : espace avant en français, pas en anglais. */
const colon = (locale: Locale) => (locale === 'fr' ? ' : ' : ': ');

function amountText(amount: number | null, locale: Locale): string {
  return amount === null ? t(locale, 'message.onQuote') : formatXaf(amount, locale);
}

function lineText(line: EstimateLine, locale: Locale): string {
  const quantities = describeQuantities(line, locale);
  const title = `${localize(line.title, locale)}${quantities ? ` — ${quantities}` : ''}`;
  const head = `• ${title}${colon(locale)}${amountText(line.lineAmount, locale)}`;
  const options = line.options.map(
    (option) =>
      `  + ${localize(option.title, locale)}${colon(locale)}${amountText(option.amount, locale)}`,
  );
  return [head, ...options].join('\n');
}

function totalText(estimate: PriceEstimate, locale: Locale): string {
  if (estimate.isQuoteOnly) return t(locale, 'message.quoteOnly', { count: estimate.quoteCount });
  const key = estimate.hasFromPrices ? 'message.totalEstimated' : 'message.totalIndicative';
  const total = t(locale, key, { amount: formatXaf(estimate.total, locale) });
  return estimate.quoteCount > 0
    ? `${total} ${t(locale, 'message.quoteSuffix', { count: estimate.quoteCount })}`
    : total;
}

export function buildSelectionMessage({
  estimate,
  stay = {},
  intent,
  locale,
  url,
}: SelectionMessageInput): string {
  const firstTitle = estimate.lines[0] ? localize(estimate.lines[0].title, locale) : '';
  const intro =
    intent === 'single'
      ? buildServiceRequestMessage({ title: firstTitle, url: url ?? '', locale })
      : t(locale, 'message.introQuote');
  const header = [intro];
  if (stay.dates) header.push(t(locale, 'message.dates', { dates: stay.dates }));
  if (stay.travelers) header.push(t(locale, 'message.travelers', { count: stay.travelers }));

  const compose = (shown: number) => {
    const lines = estimate.lines.slice(0, shown).map((line) => lineText(line, locale));
    const hidden = estimate.lines.length - shown;
    if (hidden > 0) lines.push(t(locale, 'message.more', { count: hidden }));
    return [
      header.join('\n'),
      lines.join('\n'),
      totalText(estimate, locale),
      t(locale, 'message.closing'),
    ]
      .filter((block) => block !== '')
      .join('\n\n');
  };

  let shown = estimate.lines.length;
  let message = compose(shown);
  while (shown > 1 && encodeURIComponent(message).length > MAX_ENCODED_LENGTH) {
    shown -= 1;
    message = compose(shown);
  }
  return message;
}
