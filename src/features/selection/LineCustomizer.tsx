/**
 * Réglage des quantités avant l'ajout au séjour : nombre de personnes d'un parcours (005, FR-010),
 * véhicules et jours d'une catégorie de véhicule (006, FR-005). Un sélecteur par dimension, dans
 * ses bornes ; aucune règle ici : bornes et fusion viennent de la sélection.
 */
import { useState } from 'preact/hooks';
import { localize, t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import type { QuantityDimension } from '../../content/schemas.ts';
import { useAddedFlash } from './feedback.tsx';
import type { IslandService } from './islandCatalog.ts';
import QuantityStepper from './QuantityStepper.tsx';
import { defaultLine, quantityRuleOf } from './selection.ts';
import { $selection, add } from './store.ts';

type Props = { service: IslandService; locale: Locale; title: string; buttonLabel: string };

export default function LineCustomizer({ service, locale, title, buttonLabel }: Props) {
  const line = defaultLine(service, $selection.get().stay.travelers);
  const { dimensions } = quantityRuleOf(service, line.tierId);
  const [quantities, setQuantities] = useState(line.quantities);
  const [flashing, notify] = useAddedFlash();
  const labelOf = (dimension: QuantityDimension) =>
    dimension.kind === 'units'
      ? t(locale, 'detail.dimension.units', { label: localize(dimension.label, locale) })
      : t(locale, `detail.dimension.${dimension.kind}`);
  return (
    <div class="flex flex-wrap items-end justify-between gap-3" data-testid="line-customizer">
      {dimensions.map((dimension, index) => (
        <div key={dimension.kind}>
          <p class="text-fg mb-1 text-sm font-medium">{labelOf(dimension)}</p>
          <QuantityStepper
            value={quantities[index] ?? dimension.default}
            min={dimension.min}
            max={dimension.max}
            label={labelOf(dimension)}
            locale={locale}
            onChange={(value) =>
              setQuantities(quantities.map((current, i) => (i === index ? value : current)))
            }
          />
        </div>
      ))}
      <button
        type="button"
        class="press bg-brand text-brand-contrast inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold"
        aria-label={`${buttonLabel} : ${title}`}
        data-guide="add"
        onClick={() => notify(add({ ...line, quantities }))}
      >
        {flashing ? t(locale, 'stay.added') : buttonLabel}
      </button>
    </div>
  );
}
