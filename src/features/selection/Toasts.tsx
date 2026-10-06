/** Confirmations et annonces de la sélection (FR-SEL-8), en région `aria-live`. */
import { useStore } from '@nanostores/preact';
import { useEffect, useState } from 'preact/hooks';
import { localize, t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import type { SelectionEvent } from './selection.ts';
import { $lastEvent, getCatalog } from './store.ts';

type Props = { locale: Locale };
const DURATION_MS = 3500;

export function describe(
  event: SelectionEvent,
  locale: Locale,
  title: (id: string) => string,
): string {
  switch (event.type) {
    case 'added':
      return t(locale, 'toast.added', { title: title(event.serviceId) });
    case 'merged':
      return event.capped
        ? t(locale, 'toast.capped', { title: title(event.serviceId) })
        : t(locale, 'toast.updated', { title: title(event.serviceId) });
    case 'updated':
      return t(locale, 'toast.updated', { title: title(event.serviceId) });
    case 'alreadyThere':
      return t(locale, 'toast.alreadyThere', { title: title(event.serviceId) });
    case 'removed':
      return t(locale, 'toast.removed', { title: title(event.serviceId) });
    case 'cleared':
      return t(locale, 'toast.cleared');
    case 'purged':
      return t(locale, 'toast.purged', { count: event.serviceIds.length });
    case 'storageUnavailable':
      return t(locale, 'toast.storageUnavailable');
  }
}

export default function Toasts({ locale }: Props) {
  const event = useStore($lastEvent);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!event) return;
    const catalog = getCatalog();
    const title = (id: string) => {
      const service = catalog.get(id);
      return service ? localize(service.title, locale) : id;
    };
    setMessage(describe(event, locale, title));
    if (event.type === 'storageUnavailable') return;
    const timer = setTimeout(() => setMessage(''), DURATION_MS);
    return () => clearTimeout(timer);
  }, [event]);
  return (
    <div
      class="pointer-events-none fixed inset-x-4 bottom-[calc(var(--size-tabbar)+var(--size-sticky-cta)+--spacing(2))] flex justify-center lg:bottom-6"
      style="z-index: var(--z-toast)"
      aria-live="polite"
      role="status"
      data-testid="toast"
    >
      {message && <p class="bg-fg text-bg shadow-card rounded-md px-4 py-3 text-sm">{message}</p>}
    </div>
  );
}
