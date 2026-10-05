import { describe, expect, it } from 'vitest';
import { relatedExperiences } from '../../src/features/catalog/relatedExperiences.ts';

type Item = Parameters<typeof relatedExperiences>[1][number];

const item = (
  id: string,
  categoryId: string | undefined,
  order: number,
  extra: Partial<Item['data']> = {},
): Item => ({ id, data: { categoryId, order, ...extra } });

const all: Item[] = [
  item('pirogue', 'nature', 20),
  item('chutes', 'nature', 10),
  item('jacuzzi', 'nature', 50),
  item('quad', 'aventure', 80),
  item('kayak', 'aventure', 90),
  item('croisiere', 'detente', 60),
  item('chaloupe', 'nature', 30, { availability: 'disabled' }),
  item('guide', undefined, 1, { isOption: true }),
];

describe('relatedExperiences', () => {
  it('propose d’abord la même catégorie, par ordre, puis les autres', () => {
    expect(relatedExperiences('pirogue', all).map((entry) => entry.id)).toEqual([
      'chutes',
      'jacuzzi',
      'croisiere',
    ]);
  });

  it('complète avec les autres catégories quand la sienne est épuisée', () => {
    expect(relatedExperiences('quad', all).map((entry) => entry.id)).toEqual([
      'kayak',
      'chutes',
      'pirogue',
    ]);
  });

  it('exclut l’expérience courante, les options et les expériences désactivées', () => {
    const ids = relatedExperiences('chutes', all, 10).map((entry) => entry.id);
    expect(ids).not.toContain('chutes');
    expect(ids).not.toContain('guide');
    expect(ids).not.toContain('chaloupe');
  });

  it('respecte la limite et renvoie une liste vide quand il n’y a rien d’autre', () => {
    expect(relatedExperiences('pirogue', all, 1)).toHaveLength(1);
    expect(relatedExperiences('seule', [item('seule', 'nature', 1)])).toEqual([]);
  });

  it('range en dernier une expérience sans ordre', () => {
    const list = [
      item('a', 'x', 10),
      item('b', 'x', undefined as unknown as number),
      item('c', 'x', 5),
    ];
    expect(relatedExperiences('a', list).map((entry) => entry.id)).toEqual(['c', 'b']);
  });
});
