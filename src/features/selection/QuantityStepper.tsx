/** Sélecteur de quantité : − / valeur saisissable / +, zones tactiles de 44 px (FR-010). */
import { useState } from 'preact/hooks';
import type { Locale } from '../../i18n/types.ts';
import { t } from '../../i18n/t.ts';

type Props = {
  value: number;
  min: number;
  max: number;
  label: string;
  locale: Locale;
  onChange: (value: number) => void;
  compact?: boolean;
};

export default function QuantityStepper({
  value,
  min,
  max,
  label,
  locale,
  onChange,
  compact,
}: Props) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next) || min)));
  // Défilement du chiffre (009) : sens du dernier appui ; la clé relance l'animation.
  const [roll, setRoll] = useState<{ direction: 'up' | 'down'; count: number }>();
  const step = (direction: 'up' | 'down') => {
    setRoll((current) => ({ direction, count: (current?.count ?? 0) + 1 }));
    set(value + (direction === 'up' ? 1 : -1));
  };
  // Compact (maquette 04) : carré bordé de 24 px dans une zone tactile de 44 px.
  const button = compact
    ? 'inline-flex size-11 items-center justify-center text-xs font-bold text-fg disabled:opacity-40 [&>span]:flex [&>span]:size-6 [&>span]:items-center [&>span]:justify-center [&>span]:rounded-sm [&>span]:border [&>span]:border-border [&>span]:bg-bg-muted'
    : 'inline-flex size-11 items-center justify-center rounded-md border border-border bg-bg text-lg font-bold text-fg disabled:opacity-40';
  return (
    <div class="flex items-center gap-1" role="group" aria-label={label}>
      <button
        type="button"
        class={button}
        aria-label={t(locale, 'stepper.decrease', { label })}
        disabled={value <= min}
        onClick={() => step('down')}
      >
        <span aria-hidden="true">−</span>
      </button>
      <span class="inline-flex overflow-hidden">
        <input
          key={roll?.count}
          type="number"
          inputMode="numeric"
          class={
            compact
              ? 'text-fg w-8 bg-transparent text-center text-sm font-semibold'
              : 'text-fg w-12 bg-transparent text-center text-lg font-bold'
          }
          min={min}
          max={max}
          value={value}
          aria-label={label}
          data-roll={roll?.direction}
          onChange={(event) => set(Number((event.target as HTMLInputElement).value))}
        />
      </span>
      <button
        type="button"
        class={button}
        aria-label={t(locale, 'stepper.increase', { label })}
        disabled={value >= max}
        onClick={() => step('up')}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
