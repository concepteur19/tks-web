/**
 * Rubrique « Votre réservation » de la fiche (FR-010) : quantités, tarif et options. Écrit la
 * configuration dans `$draft`, lue par la barre d'action. Aucune règle métier ici.
 */
import { useStore } from '@nanostores/preact';
import { useEffect } from 'preact/hooks';
import { formatXaf } from '../estimation/formatPrice.ts';
import { localize, t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { $draft } from './draft.ts';
import QuantityStepper from './QuantityStepper.tsx';
import type { IslandService } from './islandCatalog.ts';
import { defaultLine, quantityRuleOf, type SelectedLine } from './selection.ts';

type Props = { service: IslandService; options: IslandService[]; locale: Locale };

export default function ExperienceConfigurator({ service, options, locale }: Props) {
  const serviceId = service.id;
  const stored = useStore($draft);
  // Rendu serveur et premier rendu : la ligne par défaut, sans attendre l'atome.
  const draft = stored?.serviceId === serviceId ? stored : defaultLine(service);

  useEffect(() => {
    if ($draft.get()?.serviceId !== serviceId) $draft.set(defaultLine(service));
  }, [serviceId]);

  const rule = quantityRuleOf(service, draft.tierId);
  const patch = (change: Partial<SelectedLine>) => $draft.set({ ...draft, ...change });

  const dimensionLabel = (index: number) => {
    const dimension = rule.dimensions[index];
    if (!dimension) return '';
    return dimension.kind === 'units'
      ? t(locale, 'detail.dimension.units', { label: localize(dimension.label, locale) })
      : t(locale, `detail.dimension.${dimension.kind}`);
  };

  return (
    <div class="mt-6 space-y-5" data-testid="configurator">
      <h2 class="text-fg text-base font-bold">{t(locale, 'detail.booking')}</h2>

      {service.tiers && (
        <fieldset>
          <legend class="text-fg mb-2 text-sm font-medium">{t(locale, 'detail.tier')}</legend>
          <div class="flex flex-wrap gap-2">
            {service.tiers.map((tier) => (
              <label
                key={tier.id}
                class={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm ${draft.tierId === tier.id ? 'border-brand text-brand' : 'border-border text-fg'}`}
              >
                <input
                  type="radio"
                  name={`tier-${serviceId}`}
                  class="accent-brand"
                  checked={draft.tierId === tier.id}
                  onChange={() => {
                    const next = quantityRuleOf(service, tier.id);
                    patch({ tierId: tier.id, quantities: next.dimensions.map((d) => d.default) });
                  }}
                />
                {localize(tier.label, locale)}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {rule.dimensions.map((dimension, index) => (
        <div key={`${dimension.kind}-${index}`}>
          <p class="text-fg mb-2 text-sm font-medium">{dimensionLabel(index)}</p>
          <QuantityStepper
            value={draft.quantities[index] ?? dimension.default}
            min={dimension.min}
            max={dimension.max}
            label={dimensionLabel(index)}
            locale={locale}
            onChange={(value) =>
              patch({ quantities: draft.quantities.map((q, i) => (i === index ? value : q)) })
            }
          />
        </div>
      ))}

      {options.length > 0 && (
        <fieldset class="rounded-card border-border bg-bg-muted border p-4" data-testid="options">
          <legend class="sr-only">{t(locale, 'detail.optionsTitle')}</legend>
          <p class="text-fg text-base font-bold" aria-hidden="true">
            {t(locale, 'detail.optionsTitle')}
          </p>
          <div class="divide-border mt-2 divide-y">
            {options.map((option) => {
              const checked = draft.optionIds.includes(option.id);
              const pricing = option.pricing;
              return (
                <label
                  key={option.id}
                  class="flex min-h-11 cursor-pointer items-center justify-between gap-4 py-2"
                >
                  <span class="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      class="accent-brand size-[18px]"
                      checked={checked}
                      onChange={() =>
                        patch({
                          optionIds: checked
                            ? draft.optionIds.filter((id) => id !== option.id)
                            : [...draft.optionIds, option.id],
                        })
                      }
                    />
                    <span class="text-fg text-sm font-medium">
                      {localize(option.title, locale)}
                    </span>
                  </span>
                  {pricing && pricing.kind !== 'quote' && (
                    <span class="text-brand text-sm font-semibold">
                      {formatXaf(pricing.amount, locale)}
                      {pricing.unit === 'per_person' && ` ${t(locale, 'price.unit.per_person')}`}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
