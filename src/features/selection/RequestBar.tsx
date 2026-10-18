/**
 * Barre d'action de la fiche (FR-011) : total de la configuration, « Ajouter à mon séjour » et
 * « Demander ce service ». Variante `bar` (téléphone, fixée) ou `card` (ordinateur, collante).
 */
import { useStore } from '@nanostores/preact';
import { computeEstimate } from '../estimation/computeEstimate.ts';
import { formatEurEquivalent, formatXaf } from '../estimation/formatPrice.ts';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { buildWhatsAppUrl } from '../../lib/whatsapp.ts';
import { buildSelectionMessage } from '../whatsapp/buildSelectionMessage.ts';
import { $draft } from './draft.ts';
import { catalogMap, type IslandService } from './islandCatalog.ts';
import { defaultLine, isDuplicable } from './selection.ts';
import { $selection, add } from './store.ts';

type Props = {
  service: IslandService;
  options: IslandService[];
  locale: Locale;
  variant: 'bar' | 'card';
  pageUrl: string;
  whatsappNumber: string;
  eurToXaf: number;
};

export default function RequestBar({
  service,
  options,
  locale,
  variant,
  pageUrl,
  whatsappNumber,
  eurToXaf,
}: Props) {
  const serviceId = service.id;
  const stored = useStore($draft);
  const selection = useStore($selection);
  // Rendu serveur et premier rendu : la ligne par défaut, sans attendre l'atome.
  const draft = stored?.serviceId === serviceId ? stored : defaultLine(service);
  const catalog = catalogMap([service, ...options]);

  const estimate = computeEstimate({ items: [draft] }, catalog);
  const line = estimate.lines[0];
  const inSelection = selection.items.some((item) => item.serviceId === serviceId);
  const blocked = inSelection && !isDuplicable(service, draft.tierId);
  const href = buildWhatsAppUrl(
    whatsappNumber,
    buildSelectionMessage({ estimate, intent: 'single', locale, url: pageUrl }),
  );

  const price =
    line?.lineAmount === null || !line ? (
      <span class="bg-accent text-bg inline-block rounded-sm px-2 py-1 text-xs font-semibold">
        {t(locale, 'price.quote')}
      </span>
    ) : (
      <>
        <span class="text-brand text-lg leading-none font-bold" data-testid="draft-total">
          {formatXaf(line.lineAmount, locale)}
        </span>
        <span class="text-fg-muted mt-0.5 text-xs">
          {formatEurEquivalent(line.lineAmount, locale, eurToXaf)}
        </span>
      </>
    );

  const actions = (
    <div class={variant === 'bar' ? 'flex flex-col items-center' : 'flex flex-col gap-2'}>
      <button
        type="button"
        class="bg-brand text-brand-contrast disabled:bg-fg-muted inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold"
        disabled={blocked}
        onClick={() => add(draft)}
        data-testid="add-to-stay"
        data-guide="add"
      >
        {blocked ? t(locale, 'stay.alreadyThere') : t(locale, 'stay.add')}
      </button>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        class="text-fg-muted inline-flex min-h-11 items-center justify-center text-xs underline"
        data-testid="request-service"
      >
        {t(locale, 'detail.request')}
      </a>
    </div>
  );

  if (variant === 'bar') {
    return (
      <div
        class="border-border bg-bg fixed inset-x-0 bottom-(--size-tabbar) flex h-(--size-sticky-cta) items-center justify-between gap-3 border-t px-4 lg:hidden"
        style="z-index: var(--z-sticky-cta)"
        data-testid="request-bar"
      >
        <div class="flex flex-col">
          <span class="text-fg-muted text-xs">{t(locale, 'stay.total')}</span>
          {price}
        </div>
        {actions}
      </div>
    );
  }
  return (
    <div class="border-border flex flex-col gap-4 border-t pt-5" data-testid="request-card">
      <div class="flex items-start justify-between gap-3">
        <span class="text-fg text-sm">{t(locale, 'stay.total')}</span>
        <div class="flex flex-col items-end">{price}</div>
      </div>
      {actions}
    </div>
  );
}
