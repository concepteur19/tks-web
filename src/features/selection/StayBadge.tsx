/** Compteur de Mon séjour (FR-027), sur l'onglet et l'icône de l'en-tête. */
import { useStore } from '@nanostores/preact';
import { useEffect } from 'preact/hooks';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { $selection, hydrate } from './store.ts';

type Props = { locale: Locale };

export default function StayBadge({ locale }: Props) {
  const selection = useStore($selection);
  useEffect(() => {
    hydrate();
  }, []);
  const count = selection.items.length;
  if (count === 0) return null;
  return (
    <span
      class="rounded-pill bg-brand text-2xs text-brand-contrast absolute -top-1.5 -right-2.5 flex size-4 items-center justify-center font-bold"
      data-testid="stay-badge"
    >
      {count}
      <span class="sr-only">{t(locale, 'stay.badge', { count })}</span>
    </span>
  );
}
