/**
 * Mini tuto de première visite (009, FR-001 à FR-003) : quand le montrer, comment passer d'une
 * étape à l'autre, quelle cible signaler, comment s'en souvenir. Fonctions pures, couvertes à
 * 100 % ; l'îlot `FirstVisitGuide` ne fait qu'afficher. Voir specs/009-micro-interactions/data-model.md.
 */

export const GUIDE_KEY = 'kibreeze.guide.v1';
/** Délai d'apparition après l'activation de l'îlot, elle-même différée d'une seconde au plus
 *  (`client:idle`) : la bulle paraît en moins de 2 secondes (spec, US1-1). */
export const GUIDE_DELAY_MS = 600;

export type GuideStatus = 'new' | 'done';
export type GuideStepIndex = 0 | 1 | 2;
export type GuideState = { kind: 'hidden' } | { kind: 'open'; step: GuideStepIndex };
export type GuideEvent = 'next' | 'skip' | 'finish' | 'added';
/** Valeurs de l'attribut `data-guide` posé sur les éléments que le tuto peut signaler. */
export type GuideTargetId = 'explore' | 'add' | 'send' | 'stay';

export const GUIDE_STEPS = [
  { id: 'explore', targets: ['explore'] },
  { id: 'add', targets: ['add', 'stay'] },
  { id: 'send', targets: ['send', 'stay'] },
] as const satisfies readonly { id: string; targets: readonly GuideTargetId[] }[];

export type GuideStepId = (typeof GUIDE_STEPS)[number]['id'];

const LAST_STEP: GuideStepIndex = 2;
const HIDDEN: GuideState = { kind: 'hidden' };

/** Premier passage et séjour vide : un visiteur qui a déjà ajouté quelque chose a compris. */
export function shouldShowGuide({
  status,
  itemCount,
}: {
  status: GuideStatus;
  itemCount: number;
}): boolean {
  return status === 'new' && itemCount === 0;
}

/** État suivant ; `done` indique qu'il faut mémoriser le tuto comme vu. */
export function nextGuideState(
  state: GuideState,
  event: GuideEvent,
): { state: GuideState; done: boolean } {
  if (state.kind === 'hidden') return { state, done: false };
  switch (event) {
    case 'next':
      return state.step === LAST_STEP
        ? { state: HIDDEN, done: true }
        : { state: { kind: 'open', step: (state.step + 1) as GuideStepIndex }, done: false };
    case 'added':
      return { state: { kind: 'open', step: LAST_STEP }, done: false };
    case 'skip':
    case 'finish':
      return { state: HIDDEN, done: true };
  }
}

/** Première cible visible de l'étape, dans son ordre de préférence. */
export function guideTarget(
  step: GuideStepIndex,
  isVisible: (id: GuideTargetId) => boolean,
): GuideTargetId | null {
  return GUIDE_STEPS[step].targets.find((id) => isVisible(id)) ?? null;
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Statut mémorisé : le premier stockage qui répond fait foi (local, puis session, puis mémoire de
 * page). Un stockage absent ou qui refuse passe la main au suivant.
 */
export function readGuideStatus(storages: readonly (StorageLike | undefined)[]): GuideStatus {
  for (const storage of storages) {
    if (!storage) continue;
    try {
      return storage.getItem(GUIDE_KEY) === 'done' ? 'done' : 'new';
    } catch {
      continue;
    }
  }
  return 'new';
}

/** Mémorise le tuto comme vu dans le premier stockage qui accepte l'écriture. */
export function markGuideDone(storages: readonly (StorageLike | undefined)[]): void {
  for (const storage of storages) {
    if (!storage) continue;
    try {
      storage.setItem(GUIDE_KEY, 'done');
      return;
    } catch {
      continue;
    }
  }
}
