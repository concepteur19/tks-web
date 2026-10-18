/**
 * Mini tuto de première visite (009, US1) : une bulle en trois étapes, sans voile ni blocage,
 * au-dessus de la barre à onglets (en haut à droite sur ordinateur). Les règles viennent de
 * `guide.ts` ; l'îlot affiche, signale la cible de l'étape et mémorise la fin du tuto.
 */
import { useStore } from '@nanostores/preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { $toastVisible } from '../selection/Toasts.tsx';
import { $lastEvent, $selection, count } from '../selection/store.ts';
import {
  GUIDE_DELAY_MS,
  GUIDE_STEPS,
  guideTarget,
  markGuideDone,
  nextGuideState,
  readGuideStatus,
  shouldShowGuide,
  type GuideEvent,
  type GuideState,
  type GuideTargetId,
  type StorageLike,
} from './guide.ts';

type Props = { locale: Locale; delay?: number };

const TITLE_ID = 'guide-title';

/** Accès protégé : un navigateur strict peut lever une erreur à la simple lecture du stockage. */
function safe(get: () => Storage): StorageLike | undefined {
  try {
    return get();
  } catch {
    return undefined;
  }
}

/** Repli de dernier recours : au plus une fois par visite, jamais à chaque page… de cette page. */
function memoryStorage(): StorageLike {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
}

const isVisible = (element: Element) => element.getClientRects().length > 0;
const targetsOf = (id: GuideTargetId) => [...document.querySelectorAll(`[data-guide="${id}"]`)];

export default function FirstVisitGuide({ locale, delay = GUIDE_DELAY_MS }: Props) {
  const storages = useMemo(
    () => [safe(() => localStorage), safe(() => sessionStorage), memoryStorage()],
    [],
  );
  const [state, setState] = useState<GuideState>({ kind: 'hidden' });
  const toastVisible = useStore($toastVisible);
  const lastEvent = useStore($lastEvent);

  const dispatch = (event: GuideEvent) =>
    setState((current) => {
      const { state: next, done } = nextGuideState(current, event);
      if (done) markGuideDone(storages);
      return next;
    });

  useEffect(() => {
    const status = readGuideStatus(storages);
    if (!shouldShowGuide({ status, itemCount: count($selection.get()) })) return;
    const timer = setTimeout(() => setState({ kind: 'open', step: 0 }), delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (lastEvent?.type === 'added' || lastEvent?.type === 'merged') dispatch('added');
  }, [lastEvent]);

  useEffect(() => {
    if (state.kind !== 'open') return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && dispatch('skip');
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.kind]);

  // Cible de l'étape : la première visible dans l'ordre de préférence (barre ou menu, bouton
  // d'ajout ou Mon séjour, bouton WhatsApp ou Mon séjour).
  useEffect(() => {
    if (state.kind !== 'open') return;
    const id = guideTarget(state.step, (candidate) => targetsOf(candidate).some(isVisible));
    const element = id ? targetsOf(id).find(isVisible) : undefined;
    element?.setAttribute('data-guide-active', '');
    return () => element?.removeAttribute('data-guide-active');
  }, [state]);

  if (state.kind !== 'open' || toastVisible) return null;
  const step = GUIDE_STEPS[state.step];
  const last = state.step === GUIDE_STEPS.length - 1;
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={TITLE_ID}
      data-testid="guide"
      data-motion="enter"
      class="bg-bg text-fg shadow-lift rounded-card border-border fixed inset-x-4 bottom-[calc(var(--size-tabbar)+var(--size-sticky-cta)+--spacing(2))] border p-4 lg:inset-x-auto lg:top-[calc(var(--size-header-desktop)+--spacing(3))] lg:right-6 lg:bottom-auto lg:w-88"
      style="z-index: var(--z-guide)"
    >
      <p class="text-fg-muted text-xs">{t(locale, 'guide.progress', { n: state.step + 1 })}</p>
      <h2 id={TITLE_ID} class="mt-1 text-base font-bold">
        {t(locale, `guide.${step.id}.title`)}
      </h2>
      <p class="mt-1 text-sm leading-relaxed">{t(locale, `guide.${step.id}.text`)}</p>
      <div class="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          class="press text-fg-muted min-h-11 rounded-md px-3 text-sm font-semibold"
          onClick={() => dispatch('skip')}
        >
          {t(locale, 'guide.skip')}
        </button>
        <button
          type="button"
          class="press bg-brand text-brand-contrast min-h-11 rounded-md px-4 text-sm font-semibold"
          onClick={() => dispatch(last ? 'finish' : 'next')}
        >
          {t(locale, last ? 'guide.done' : 'guide.next')}
        </button>
      </div>
    </div>
  );
}
