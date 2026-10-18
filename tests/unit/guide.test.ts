import { describe, expect, it } from 'vitest';
import {
  GUIDE_KEY,
  GUIDE_STEPS,
  guideTarget,
  markGuideDone,
  nextGuideState,
  readGuideStatus,
  shouldShowGuide,
  type GuideState,
  type StorageLike,
} from '../../src/features/guide/guide.ts';

const open = (step: 0 | 1 | 2): GuideState => ({ kind: 'open', step });
const hidden: GuideState = { kind: 'hidden' };

/** Stockage en mémoire ; `broken` simule un stockage qui refuse (navigation privée stricte). */
function storage(
  initial: Record<string, string> = {},
  broken = false,
): StorageLike & {
  data: Record<string, string>;
} {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => {
      if (broken) throw new Error('refusé');
      return data[key] ?? null;
    },
    setItem: (key, value) => {
      if (broken) throw new Error('refusé');
      data[key] = value;
    },
  };
}

describe('quand montrer le tuto', () => {
  it('seulement au premier passage, séjour vide', () => {
    expect(shouldShowGuide({ status: 'new', itemCount: 0 })).toBe(true);
    expect(shouldShowGuide({ status: 'new', itemCount: 2 })).toBe(false);
    expect(shouldShowGuide({ status: 'done', itemCount: 0 })).toBe(false);
  });
});

describe('étapes', () => {
  it('trois étapes, cibles par ordre de préférence', () => {
    expect(GUIDE_STEPS.map((step) => step.id)).toEqual(['explore', 'add', 'send']);
    expect(GUIDE_STEPS.map((step) => step.targets)).toEqual([
      ['explore'],
      ['add', 'stay'],
      ['send', 'stay'],
    ]);
  });

  it('« Suivant » avance, et termine à la dernière étape', () => {
    expect(nextGuideState(open(0), 'next')).toEqual({ state: open(1), done: false });
    expect(nextGuideState(open(1), 'next')).toEqual({ state: open(2), done: false });
    expect(nextGuideState(open(2), 'next')).toEqual({ state: hidden, done: true });
  });

  it('« Passer » et « C’est parti » ferment et mémorisent', () => {
    expect(nextGuideState(open(0), 'skip')).toEqual({ state: hidden, done: true });
    expect(nextGuideState(open(2), 'finish')).toEqual({ state: hidden, done: true });
  });

  it('un ajout au séjour mène à l’étape « envoyer »', () => {
    expect(nextGuideState(open(0), 'added')).toEqual({ state: open(2), done: false });
    expect(nextGuideState(open(1), 'added')).toEqual({ state: open(2), done: false });
    expect(nextGuideState(open(2), 'added')).toEqual({ state: open(2), done: false });
  });

  it('ne fait rien une fois fermé', () => {
    for (const event of ['next', 'skip', 'finish', 'added'] as const) {
      expect(nextGuideState(hidden, event)).toEqual({ state: hidden, done: false });
    }
  });
});

describe('cible signalée', () => {
  it('prend la première cible visible', () => {
    const visible = (ids: string[]) => (id: string) => ids.includes(id);
    expect(guideTarget(0, visible(['explore', 'stay']))).toBe('explore');
    expect(guideTarget(1, visible(['add', 'stay']))).toBe('add');
    expect(guideTarget(1, visible(['stay']))).toBe('stay');
    expect(guideTarget(2, visible(['send', 'stay']))).toBe('send');
    expect(guideTarget(2, visible(['stay']))).toBe('stay');
    expect(guideTarget(2, visible([]))).toBeNull();
  });
});

describe('mémoire', () => {
  it('lit le premier stockage disponible', () => {
    expect(readGuideStatus([storage({ [GUIDE_KEY]: 'done' })])).toBe('done');
    expect(readGuideStatus([storage(), storage({ [GUIDE_KEY]: 'done' })])).toBe('new');
    expect(readGuideStatus([storage({}, true), storage({ [GUIDE_KEY]: 'done' })])).toBe('done');
    expect(readGuideStatus([undefined, storage({ [GUIDE_KEY]: 'done' })])).toBe('done');
  });

  it('une valeur inconnue ou aucun stockage valent un premier passage', () => {
    expect(readGuideStatus([storage({ [GUIDE_KEY]: 'peut-être' })])).toBe('new');
    expect(readGuideStatus([storage({}, true)])).toBe('new');
    expect(readGuideStatus([])).toBe('new');
  });

  it('mémorise dans le premier stockage qui accepte', () => {
    const local = storage({}, true);
    const session = storage();
    const memory = storage();
    markGuideDone([undefined, local, session, memory]);
    expect(session.data[GUIDE_KEY]).toBe('done');
    expect(memory.data[GUIDE_KEY]).toBeUndefined();
    expect(() => markGuideDone([storage({}, true)])).not.toThrow();
  });
});
