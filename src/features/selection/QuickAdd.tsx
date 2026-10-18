/** Ajout en un geste depuis une carte (FR-002) : valeurs par défaut, sans option. */
import { useStore } from '@nanostores/preact';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { useAddedFlash } from './feedback.tsx';
import type { IslandService } from './islandCatalog.ts';
import { defaultLine, isDuplicable } from './selection.ts';
import { $selection, add } from './store.ts';

type Props = {
  service: IslandService;
  locale: Locale;
  title: string;
  /** Bouton pleine largeur « Ajouter à mon séjour » (cartes de formule, 005). */
  wide?: boolean;
};

export default function QuickAdd({ service, locale, title, wide = false }: Props) {
  const selection = useStore($selection);
  const [flashing, notify] = useAddedFlash();
  const serviceId = service.id;
  // Les personnes partent du nombre de voyageurs du séjour (010).
  const line = defaultLine(service, selection.stay.travelers);
  const blocked =
    selection.items.some((item) => item.serviceId === serviceId) &&
    !isDuplicable(service, line.tierId);
  return (
    <button
      type="button"
      class={`press bg-brand text-brand-contrast ${flashing ? '' : 'disabled:bg-fg-muted'} inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-semibold ${wide ? 'w-full' : ''}`}
      disabled={blocked}
      aria-label={`${blocked && !flashing ? t(locale, 'stay.alreadyThere') : t(locale, 'stay.add')} : ${title}`}
      onClick={() => notify(add(line))}
      data-testid="quick-add"
      data-guide="add"
    >
      {flashing
        ? t(locale, 'stay.added')
        : blocked
          ? t(locale, 'stay.alreadyThere')
          : t(locale, wide ? 'stay.add' : 'stay.addShort')}
    </button>
  );
}
