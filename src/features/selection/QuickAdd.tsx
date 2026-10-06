/** Ajout en un geste depuis une carte (FR-002) : valeurs par défaut, sans option. */
import { useStore } from '@nanostores/preact';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import type { IslandService } from './islandCatalog.ts';
import { defaultLine, isDuplicable } from './selection.ts';
import { $selection, add } from './store.ts';

type Props = { service: IslandService; locale: Locale; title: string };

export default function QuickAdd({ service, locale, title }: Props) {
  const selection = useStore($selection);
  const serviceId = service.id;
  const line = defaultLine(service);
  const blocked =
    selection.items.some((item) => item.serviceId === serviceId) &&
    !isDuplicable(service, line.tierId);
  return (
    <button
      type="button"
      class="bg-brand text-brand-contrast disabled:bg-fg-muted inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-semibold"
      disabled={blocked}
      aria-label={`${blocked ? t(locale, 'stay.alreadyThere') : t(locale, 'stay.add')} : ${title}`}
      onClick={() => add(line)}
      data-testid="quick-add"
    >
      {blocked ? t(locale, 'stay.alreadyThere') : t(locale, 'stay.addShort')}
    </button>
  );
}
