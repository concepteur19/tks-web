/**
 * Page Mon séjour (FR-019 à FR-024) : lignes modifiables, dates et voyageurs, total, envoi sur
 * WhatsApp, états vide et tout sur devis. Calculs et message viennent des fonctions pures.
 */
import { useStore } from '@nanostores/preact';
import { useEffect, useRef } from 'preact/hooks';
import { computeEstimate, type EstimateLine } from '../estimation/computeEstimate.ts';
import { formatEurEquivalent, formatXaf } from '../estimation/formatPrice.ts';
import { localize, t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { buildWhatsAppUrl, WHATSAPP_ICON_PATH } from '../../lib/whatsapp.ts';
import { buildSelectionMessage, describeQuantities } from '../whatsapp/buildSelectionMessage.ts';
import QuantityStepper from './QuantityStepper.tsx';
import { quantityRuleOf } from './selection.ts';
import { $selection, clear, getCatalog, remove, setStay, update } from './store.ts';

const INFO_ICON =
  'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z';
const TRASH_ICON =
  'M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z';

type Props = {
  locale: Locale;
  whatsappNumber: string;
  eurToXaf: number;
  experiencesHref: string;
  emptyImage: { src: string; width: number; height: number };
};

export default function StayPage({
  locale,
  whatsappNumber,
  eurToXaf,
  experiencesHref,
  emptyImage,
}: Props) {
  const catalog = getCatalog();
  const selection = useStore($selection);
  const dialog = useRef<HTMLDialogElement>(null);
  const estimate = computeEstimate(selection, catalog);
  const empty = estimate.lines.length === 0;

  useEffect(() => {
    document.body.dataset.stayFilled = empty ? 'false' : 'true';
  }, [empty]);

  if (empty) {
    return (
      <section
        class="flex flex-col items-center px-4 pt-6 pb-16 text-center"
        data-testid="stay-empty"
      >
        <h1 class="font-display text-fg self-start text-3xl font-bold">
          {t(locale, 'stay.title')}
        </h1>
        <img
          src={emptyImage.src}
          width={emptyImage.width}
          height={emptyImage.height}
          alt={t(locale, 'stay.emptyAlt')}
          class="mt-8 aspect-square w-70 max-w-full object-cover"
        />
        <h2 class="text-fg mt-6 text-2xl font-bold">{t(locale, 'stay.emptyTitle')}</h2>
        <p class="text-fg-muted mt-2 max-w-70 leading-relaxed">{t(locale, 'stay.emptyText')}</p>
        <a
          href={experiencesHref}
          class="bg-brand text-brand-contrast mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 font-semibold"
        >
          {t(locale, 'home.cta.experiences')}
        </a>
      </section>
    );
  }

  const message = buildSelectionMessage({
    estimate,
    stay: selection.stay,
    intent: 'quote',
    locale,
  });
  const sendHref = buildWhatsAppUrl(whatsappNumber, message);
  const remindStay = !selection.stay.dates || !selection.stay.travelers;

  const line = (entry: EstimateLine) => {
    const service = catalog.get(entry.serviceId);
    if (!service) return null;
    const rule = quantityRuleOf(service, entry.tier?.id);
    const title = localize(entry.title, locale);
    return (
      <li
        key={entry.serviceId}
        class="border-border bg-bg flex gap-3 rounded-md border p-2.5"
        data-testid="stay-line"
      >
        {service.thumbnail && (
          <img
            src={service.thumbnail}
            alt=""
            width={80}
            height={80}
            class="size-20 shrink-0 rounded-md object-cover"
          />
        )}
        <div class="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <a
              href={service.href[locale]}
              class="text-fg text-sm leading-snug font-bold hover:underline"
            >
              {title}
            </a>
            <p class="text-fg-muted text-xs">
              {describeQuantities(entry, locale)}
              {entry.overCapacity && ` — ${t(locale, 'stay.overCapacity')}`}
            </p>
            {entry.options.length > 0 && (
              <p class="text-fg-muted text-xs">
                + {entry.options.map((option) => localize(option.title, locale)).join(', ')}
              </p>
            )}
            {entry.lineAmount === null && (
              <span class="bg-accent-soft text-accent mt-1.5 inline-block rounded-sm px-2 py-1 text-xs font-semibold">
                {t(locale, 'price.quote')}
              </span>
            )}
          </div>
          {rule.dimensions.map((dimension, index) => (
            <QuantityStepper
              key={`${dimension.kind}-${index}`}
              compact
              value={entry.quantities[index] ?? dimension.default}
              min={dimension.min}
              max={dimension.max}
              locale={locale}
              label={`${title} — ${describeQuantities({ ...entry, dimensions: [dimension], quantities: [entry.quantities[index] ?? 0], tier: undefined }, locale)}`}
              onChange={(value) =>
                update(entry.serviceId, {
                  quantities: entry.quantities.map((q, i) => (i === index ? value : q)),
                })
              }
            />
          ))}
        </div>
        <div class="flex shrink-0 flex-col items-end justify-between">
          <button
            type="button"
            class="text-fg-muted hover:text-danger inline-flex size-11 items-center justify-center"
            aria-label={t(locale, 'stay.remove', { title })}
            onClick={() => remove(entry.serviceId)}
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d={TRASH_ICON} />
            </svg>
          </button>
          {entry.lineAmount !== null && (
            <span class="text-brand text-sm font-bold whitespace-nowrap">
              {formatXaf(entry.lineAmount, locale)}
            </span>
          )}
        </div>
      </li>
    );
  };

  const total = estimate.isQuoteOnly ? (
    <div
      class="border-border bg-bg-muted text-fg rounded-md border p-4 font-bold"
      data-testid="stay-total"
    >
      {t(locale, 'message.quoteOnly', { count: estimate.quoteCount })}
    </div>
  ) : (
    <div class="border-border bg-bg-muted rounded-md border p-4" data-testid="stay-total">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-fg text-base font-bold">
          {t(locale, estimate.hasFromPrices ? 'stay.totalEstimated' : 'stay.totalIndicative')}
        </span>
        <span class="text-brand text-2xl font-black tracking-tight">
          {formatXaf(estimate.total, locale)}
        </span>
      </div>
      <p class="text-fg-muted mt-0.5 text-right text-xs">
        {formatEurEquivalent(estimate.total, locale, eurToXaf)} —{' '}
        {t(locale, 'stay.indicativeAmount')}
      </p>
      {estimate.quoteCount > 0 && (
        <p class="border-border text-accent mt-3 border-t pt-2.5 text-xs font-semibold">
          {t(locale, 'stay.plusQuote', { count: estimate.quoteCount })}
        </p>
      )}
      <p class="text-fg-muted mt-2 text-xs leading-relaxed">{t(locale, 'detail.priceNote')}</p>
    </div>
  );

  const actions = (
    <>
      <a
        href={sendHref}
        target="_blank"
        rel="noopener noreferrer"
        class="bg-whatsapp text-whatsapp-ink flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-bold"
        data-testid="send-stay"
        data-guide="send"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d={WHATSAPP_ICON_PATH} />
        </svg>
        {t(locale, 'stay.send')}
      </a>
      <a
        href={experiencesHref}
        class="text-fg-muted mt-1 flex min-h-11 items-center justify-center text-xs underline"
      >
        {t(locale, 'stay.continue')}
      </a>
    </>
  );

  return (
    <div class="mx-auto max-w-(--size-content) px-4 pt-5 pb-[calc(var(--size-sticky-cta)+var(--spacing)*12)] lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 lg:pb-16">
      <div>
        <div class="flex items-baseline justify-between">
          <div>
            <h1 class="font-display text-fg text-2xl leading-none font-bold">
              {t(locale, 'stay.title')}
            </h1>
            <p class="text-fg-muted mt-1 text-sm" data-testid="stay-count">
              {t(locale, 'stay.count', { count: estimate.lines.length })}
            </p>
          </div>
          <button
            type="button"
            class="text-fg-muted min-h-11 text-sm underline"
            onClick={() => dialog.current?.showModal()}
          >
            {t(locale, 'stay.clear')}
          </button>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <label class="block">
            <span class="text-fg mb-1 block text-xs font-semibold">{t(locale, 'stay.dates')}</span>
            <input
              type="text"
              maxLength={80}
              placeholder={t(locale, 'stay.datesPlaceholder')}
              value={selection.stay.dates ?? ''}
              onChange={(event) =>
                setStay({ ...selection.stay, dates: (event.target as HTMLInputElement).value })
              }
              class="border-border bg-bg text-fg min-h-11 w-full rounded-md border px-3 text-sm"
            />
          </label>
          <label class="block">
            <span class="text-fg mb-1 block text-xs font-semibold">
              {t(locale, 'stay.travelers')}
            </span>
            <input
              type="number"
              min={1}
              max={50}
              inputMode="numeric"
              placeholder={t(locale, 'stay.travelersPlaceholder')}
              value={selection.stay.travelers ?? ''}
              onChange={(event) => {
                const value = Number((event.target as HTMLInputElement).value);
                setStay({
                  ...selection.stay,
                  travelers: Number.isFinite(value) ? value : undefined,
                });
              }}
              class="border-border bg-bg text-fg min-h-11 w-full rounded-md border px-3 text-sm"
            />
          </label>
        </div>
        {remindStay && (
          <p class="text-accent mt-2 flex items-start gap-1.5 text-xs font-medium">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="shrink-0"
            >
              <path d={INFO_ICON} />
            </svg>
            {t(locale, 'stay.reminder')}
          </p>
        )}

        <ul class="mt-5 space-y-3">{estimate.lines.map(line)}</ul>
        <div class="mt-6 lg:hidden">{total}</div>
      </div>

      <aside class="hidden lg:block">
        <div class="sticky top-[calc(var(--size-header-desktop)+var(--spacing)*4)] space-y-3">
          {total}
          <div class="flex flex-col">{actions}</div>
        </div>
      </aside>

      <div
        class="border-border bg-bg fixed inset-x-0 bottom-(--size-tabbar) border-t p-3 lg:hidden"
        style="z-index: var(--z-sticky-cta)"
        data-testid="stay-bar"
      >
        {actions}
      </div>

      <dialog ref={dialog} class="bg-bg text-fg backdrop:bg-fg/50 m-auto max-w-sm rounded-md p-6">
        <p class="font-semibold">{t(locale, 'stay.clearConfirm')}</p>
        <div class="mt-5 flex justify-end gap-3">
          <button
            type="button"
            class="min-h-11 px-4 text-sm underline"
            onClick={() => dialog.current?.close()}
          >
            {t(locale, 'stay.cancel')}
          </button>
          <button
            type="button"
            class="bg-brand text-brand-contrast min-h-11 rounded-md px-4 text-sm font-semibold"
            onClick={() => {
              clear();
              dialog.current?.close();
            }}
          >
            {t(locale, 'stay.clearConfirmButton')}
          </button>
        </div>
      </dialog>
    </div>
  );
}
