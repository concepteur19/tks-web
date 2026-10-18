/**
 * Actions d'une fiche de parcours (010, FR-009) : nombre de personnes (départ : voyageurs du
 * séjour, borné par le parcours), ajout au séjour au tarif du parcours, et « Personnaliser ce
 * parcours » sur WhatsApp avec le nombre choisi. Message : `buildTourRequestMessage` (pur).
 */
import { useState } from 'preact/hooks';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { buildWhatsAppUrl } from '../../lib/whatsapp.ts';
import { buildTourRequestMessage } from '../whatsapp/buildTourRequestMessage.ts';
import { useAddedFlash } from './feedback.tsx';
import type { IslandService } from './islandCatalog.ts';
import QuantityStepper from './QuantityStepper.tsx';
import { defaultLine, quantityRuleOf } from './selection.ts';
import { $selection, add } from './store.ts';

type Props = {
  service: IslandService;
  locale: Locale;
  title: string;
  /** Adresse absolue de la fiche, reprise dans le message. */
  url: string;
  whatsappNumber: string;
};

export default function TourActions({ service, locale, title, url, whatsappNumber }: Props) {
  const line = defaultLine(service, $selection.get().stay.travelers);
  const persons = quantityRuleOf(service).dimensions.find(
    (dimension) => dimension.kind === 'persons',
  );
  const [count, setCount] = useState(line.quantities[0] ?? persons?.default ?? 2);
  const [flashing, notify] = useAddedFlash();
  const label = t(locale, 'detail.dimension.persons');
  const href = buildWhatsAppUrl(
    whatsappNumber,
    buildTourRequestMessage({ title, persons: count, url, locale }),
  );
  return (
    <div class="space-y-4" data-testid="tour-actions">
      {persons && (
        <div>
          <p class="text-fg mb-1 text-sm font-medium">{label}</p>
          <QuantityStepper
            value={count}
            min={persons.min}
            max={persons.max}
            label={label}
            locale={locale}
            onChange={setCount}
          />
        </div>
      )}
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="press bg-brand text-brand-contrast inline-flex min-h-12 items-center justify-center rounded-md px-5 font-semibold"
          aria-label={`${t(locale, 'stay.add')} : ${title}`}
          data-guide="add"
          onClick={() => notify(add({ ...line, quantities: persons ? [count] : [] }))}
        >
          {flashing ? t(locale, 'stay.added') : t(locale, 'stay.add')}
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          class="press border-border text-fg inline-flex min-h-12 items-center justify-center rounded-md border px-5 font-semibold"
        >
          {t(locale, 'packages.customise')}
        </a>
      </div>
    </div>
  );
}
