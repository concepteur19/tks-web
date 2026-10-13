/**
 * « Personnaliser ce parcours » (005, FR-010) : nombre de personnes, jamais sous le minimum du
 * parcours, puis ajout au séjour. Aucune règle ici : bornes et fusion viennent de la sélection.
 */
import { useState } from 'preact/hooks';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import type { IslandService } from './islandCatalog.ts';
import QuantityStepper from './QuantityStepper.tsx';
import { defaultLine, quantityRuleOf } from './selection.ts';
import { add } from './store.ts';

type Props = { service: IslandService; locale: Locale; title: string };

export default function TourCustomizer({ service, locale, title }: Props) {
  const persons = quantityRuleOf(service).dimensions.find(
    (dimension) => dimension.kind === 'persons',
  );
  const [count, setCount] = useState(persons?.default ?? 2);
  const label = t(locale, 'detail.dimension.persons');
  return (
    <div class="flex flex-wrap items-end justify-between gap-3" data-testid="tour-customizer">
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
      <button
        type="button"
        class="bg-brand text-brand-contrast inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold"
        aria-label={`${t(locale, 'packages.customise')} : ${title}`}
        onClick={() => add({ ...defaultLine(service), quantities: persons ? [count] : [] })}
      >
        {t(locale, 'packages.customise')}
      </button>
    </div>
  );
}
