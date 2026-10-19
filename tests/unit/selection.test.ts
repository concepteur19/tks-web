import { describe, expect, it } from 'vitest';
import {
  addLine,
  clampQuantities,
  clearSelection,
  defaultLine,
  emptySelection,
  isDuplicable,
  parseSelection,
  removeLine,
  setStay,
  updateLine,
  type SelectedLine,
} from '../../src/features/selection/selection.ts';
import { CATALOG, NOW } from '../fixtures/catalog.ts';

const service = (id: string) => CATALOG.get(id)!;
const line = (serviceId: string, quantities: number[], extra: Partial<SelectedLine> = {}) => ({
  serviceId,
  quantities,
  optionIds: [],
  ...extra,
});
const add = (sel: ReturnType<typeof emptySelection>, l: SelectedLine) =>
  addLine(sel, l, CATALOG, NOW);

describe('ajout', () => {
  it('ajoute une nouvelle ligne', () => {
    const { selection, event } = add(emptySelection(NOW), line('excursion-en-pirogue', [6]));
    expect(selection.items).toEqual([line('excursion-en-pirogue', [6])]);
    expect(event).toEqual({ type: 'added', serviceId: 'excursion-en-pirogue' });
    expect(selection.updatedAt).toBe(NOW.toISOString());
  });

  it('réajoutée, une activité gagne une session et garde les personnes de l’ajout (US6)', () => {
    let { selection } = add(emptySelection(NOW), line('chutes-de-la-lobe', [2]));
    const merged = add(selection, line('chutes-de-la-lobe', [3]));
    expect(merged.selection.items[0]).toEqual(line('chutes-de-la-lobe', [3], { sessions: 2 }));
    expect(merged.event).toEqual({ type: 'merged', serviceId: 'chutes-de-la-lobe', capped: false });
    selection = merged.selection;
    const capped = add(selection, line('chutes-de-la-lobe', [3], { sessions: 9 }));
    expect(capped.selection.items[0]?.sessions).toBe(10);
    expect(capped.event).toEqual({ type: 'merged', serviceId: 'chutes-de-la-lobe', capped: true });
  });

  it('garde les sessions quand une ligne non duplicable ou d’un autre tarif est remplacée (US6)', () => {
    const { selection } = add(
      emptySelection(NOW),
      line('campement-bagyeli', [3], { tierId: 'individuel', sessions: 2 }),
    );
    const couple = add(selection, line('campement-bagyeli', [], { tierId: 'couple' }));
    expect(couple.selection.items[0]).toEqual(line('campement-bagyeli', [], { tierId: 'couple' }));
    const back = add(selection, line('campement-bagyeli', [4], { tierId: 'individuel' }));
    expect(back.selection.items[0]?.sessions).toBe(3);
  });

  it('borne les sessions de 1 à 10, seulement pour une prestation qui compte des personnes (US6)', () => {
    const sessions = (l: SelectedLine) => add(emptySelection(NOW), l).selection.items[0]?.sessions;
    expect(sessions(line('chutes-de-la-lobe', [2], { sessions: 4 }))).toBe(4);
    expect(sessions(line('chutes-de-la-lobe', [2], { sessions: 25 }))).toBe(10);
    expect(sessions(line('chutes-de-la-lobe', [2], { sessions: 0 }))).toBeUndefined();
    expect(sessions(line('chutes-de-la-lobe', [2], { sessions: Number.NaN }))).toBeUndefined();
    expect(sessions(line('quad', [1], { sessions: 3 }))).toBeUndefined();
    const updated = updateLine(
      add(emptySelection(NOW), line('chutes-de-la-lobe', [2])).selection,
      'chutes-de-la-lobe',
      { sessions: 3 },
      CATALOG,
      NOW,
    );
    expect(updated.selection.items[0]?.sessions).toBe(3);
  });

  it('additionne les unités mais remplace la durée', () => {
    const { selection } = add(emptySelection(NOW), line('location', [1, 2]));
    const merged = add(selection, line('location', [1, 5]));
    expect(merged.selection.items[0]?.quantities).toEqual([2, 5]);
    const capped = add(merged.selection, line('location', [4, 5]));
    expect(capped.selection.items[0]?.quantities).toEqual([5, 5]);
    expect(capped.event).toEqual({ type: 'merged', serviceId: 'location', capped: true });
  });

  it('Premium ajouté deux fois : véhicules additionnés, jours remplacés (006)', () => {
    const { selection } = add(emptySelection(NOW), line('vehicule-premium', [1, 4]));
    const merged = add(selection, line('vehicule-premium', [1, 2]));
    expect(merged.selection.items).toHaveLength(1);
    expect(merged.selection.items[0]?.quantities).toEqual([2, 2]);
  });

  it('ne touche qu’à la ligne concernée quand la sélection en compte plusieurs', () => {
    let { selection } = add(emptySelection(NOW), line('quad', [1]));
    selection = add(selection, line('chutes-de-la-lobe', [2])).selection;
    const merged = add(selection, line('chutes-de-la-lobe', [1])).selection;
    expect(merged.items).toEqual([
      line('quad', [1]),
      line('chutes-de-la-lobe', [1], { sessions: 2 }),
    ]);
    const updated = updateLine(merged, 'chutes-de-la-lobe', { quantities: [4] }, CATALOG, NOW);
    expect(updated.selection.items).toEqual([
      line('quad', [1]),
      line('chutes-de-la-lobe', [4], { sessions: 2 }),
    ]);
  });

  it('remplace les options lors d’une fusion', () => {
    const { selection } = add(
      emptySelection(NOW),
      line('excursion-en-pirogue', [2], { optionIds: ['guide-touristique'] }),
    );
    const merged = add(
      selection,
      line('excursion-en-pirogue', [1], { optionIds: ['musee-d-art'] }),
    );
    expect(merged.selection.items[0]).toEqual(
      line('excursion-en-pirogue', [1], { sessions: 2, optionIds: ['musee-d-art'] }),
    );
  });

  it('refuse le doublon d’une ligne sans quantité ou sur devis', () => {
    const { selection } = add(emptySelection(NOW), line('feu-de-plage', []));
    expect(add(selection, line('feu-de-plage', [])).event).toEqual({
      type: 'alreadyThere',
      serviceId: 'feu-de-plage',
    });
    const jet = add(emptySelection(NOW), line('jet-ski', []));
    expect(add(jet.selection, line('jet-ski', [])).event.type).toBe('alreadyThere');
  });

  it('met à jour une ligne non duplicable quand ses options changent', () => {
    const { selection } = add(emptySelection(NOW), line('feu-de-plage', []));
    const updated = add(selection, line('feu-de-plage', [], { optionIds: ['guide-touristique'] }));
    expect(updated.event).toEqual({ type: 'updated', serviceId: 'feu-de-plage' });
    expect(updated.selection.items[0]?.optionIds).toEqual(['guide-touristique']);
  });

  it('remplace la ligne quand le tarif change', () => {
    const { selection } = add(
      emptySelection(NOW),
      line('campement-bagyeli', [3], { tierId: 'individuel' }),
    );
    const updated = add(selection, line('campement-bagyeli', [], { tierId: 'couple' }));
    expect(updated.event.type).toBe('updated');
    expect(updated.selection.items[0]).toEqual(line('campement-bagyeli', [], { tierId: 'couple' }));
  });

  it('ignore une option inconnue, un doublon d’option et un tarif inconnu', () => {
    const { selection } = add(
      emptySelection(NOW),
      line('campement-bagyeli', [2], {
        tierId: 'inconnu',
        optionIds: ['guide-touristique', 'guide-touristique', 'quad', 'disparue'],
      }),
    );
    expect(selection.items[0]).toEqual(
      line('campement-bagyeli', [2], { optionIds: ['guide-touristique'] }),
    );
  });

  it('refuse un service inconnu ou une option ajoutée comme ligne', () => {
    const empty = emptySelection(NOW);
    expect(add(empty, line('inconnu', [])).selection).toBe(empty);
    expect(add(empty, line('guide-touristique', [])).selection).toBe(empty);
  });
});

describe('bornes', () => {
  it('ramène les quantités dans leurs bornes et remplace les valeurs illisibles', () => {
    const rule = service('location').quantity;
    expect(clampQuantities(rule, [0, 99])).toEqual([1, 30]);
    expect(clampQuantities(rule, [2.6, Number.NaN])).toEqual([3, 1]);
    expect(clampQuantities(rule, [])).toEqual([1, 1]);
  });

  it('détecte les lignes duplicables', () => {
    expect(isDuplicable(service('chutes-de-la-lobe'))).toBe(true);
    expect(isDuplicable(service('feu-de-plage'))).toBe(false);
    expect(isDuplicable(service('jet-ski'))).toBe(false);
    expect(isDuplicable(service('campement-bagyeli'), 'couple')).toBe(false);
  });
});

describe('modification, retrait, vidage', () => {
  it('modifie les quantités d’une ligne dans ses bornes', () => {
    const { selection } = add(emptySelection(NOW), line('chutes-de-la-lobe', [2]));
    const result = updateLine(selection, 'chutes-de-la-lobe', { quantities: [-4] }, CATALOG, NOW);
    expect(result.selection.items[0]?.quantities).toEqual([1]);
    expect(result.event).toEqual({ type: 'updated', serviceId: 'chutes-de-la-lobe' });
  });

  it('ne fait rien pour une ligne absente', () => {
    const empty = emptySelection(NOW);
    expect(updateLine(empty, 'quad', { quantities: [2] }, CATALOG, NOW).selection).toBe(empty);
    expect(updateLine(empty, 'inconnu', {}, CATALOG, NOW).selection).toBe(empty);
  });

  it('retire une ligne et vide la sélection en gardant les dates', () => {
    let { selection } = add(emptySelection(NOW), line('quad', [2]));
    selection = add(selection, line('jet-ski', [])).selection;
    selection = setStay(selection, { dates: 'du 12 au 15 décembre', travelers: 4 }, NOW);
    const removed = removeLine(selection, 'quad', NOW);
    expect(removed.selection.items.map((item) => item.serviceId)).toEqual(['jet-ski']);
    expect(removed.event).toEqual({ type: 'removed', serviceId: 'quad' });
    const cleared = clearSelection(removed.selection, NOW);
    expect(cleared.selection.items).toEqual([]);
    expect(cleared.selection.stay).toEqual({ dates: 'du 12 au 15 décembre', travelers: 4 });
    expect(cleared.event).toEqual({ type: 'cleared' });
  });
});

describe('dates et voyageurs', () => {
  it('nettoie les dates et n’accepte que 1 à 50 voyageurs entiers', () => {
    const sel = emptySelection(NOW);
    expect(setStay(sel, { dates: '  ', travelers: 0 }, NOW).stay).toEqual({});
    expect(setStay(sel, { dates: 'x'.repeat(100), travelers: 51 }, NOW).stay).toEqual({
      dates: 'x'.repeat(80),
    });
    expect(setStay(sel, { travelers: 2.5 }, NOW).stay).toEqual({});
    expect(setStay(sel, { travelers: 4 }, NOW).stay).toEqual({ travelers: 4 });
  });

  it('accepte arrivée et départ au format AAAA-MM-JJ, départ jamais avant l’arrivée (010)', () => {
    const sel = emptySelection(NOW);
    expect(setStay(sel, { arrival: '2026-12-12', departure: '2026-12-16' }, NOW).stay).toEqual({
      arrival: '2026-12-12',
      departure: '2026-12-16',
    });
    expect(setStay(sel, { arrival: '2026-12-12', departure: '2026-12-10' }, NOW).stay).toEqual({
      arrival: '2026-12-12',
    });
    expect(setStay(sel, { arrival: '12/12/2026', departure: '2026-13-40' }, NOW).stay).toEqual({});
    expect(setStay(sel, { departure: '2026-12-16' }, NOW).stay).toEqual({
      departure: '2026-12-16',
    });
    expect(
      setStay(sel, { dates: '12-16 déc.', arrival: '2026-12-12', travelers: 3 }, NOW).stay,
    ).toEqual({ dates: '12-16 déc.', arrival: '2026-12-12', travelers: 3 });
  });
});

describe('voyageurs et lignes (US6)', () => {
  const filled = () => {
    let sel = add(emptySelection(NOW), line('chutes-de-la-lobe', [2])).selection;
    sel = add(sel, line('essentiel-de-kribi', [3])).selection;
    return add(sel, line('location', [2, 3])).selection;
  };

  it('un nouveau nombre de voyageurs devient celui de chaque ligne, dans ses bornes', () => {
    const sel = setStay(filled(), { travelers: 1 }, NOW, CATALOG);
    expect(sel.items.map((item) => item.quantities)).toEqual([[1], [2], [2, 3]]);
    const many = setStay(sel, { travelers: 30 }, NOW, CATALOG);
    expect(many.items.map((item) => item.quantities)).toEqual([[20], [20], [2, 3]]);
  });

  it('garde les lignes quand les voyageurs ne changent pas, manquent, ou sans catalogue', () => {
    const sel = setStay(filled(), { travelers: 4 }, NOW, CATALOG);
    const edited = updateLine(
      sel,
      'chutes-de-la-lobe',
      { quantities: [6] },
      CATALOG,
      NOW,
    ).selection;
    const dates = { travelers: 4, arrival: '2026-12-12' };
    expect(setStay(edited, dates, NOW, CATALOG).items).toBe(edited.items);
    expect(setStay(edited, {}, NOW, CATALOG).items).toBe(edited.items);
    expect(setStay(edited, { travelers: 5 }, NOW).items).toBe(edited.items);
  });

  it('ignore une ligne dont la prestation a disparu et complète une quantité manquante', () => {
    const base = emptySelection(NOW);
    const sel = {
      ...base,
      items: [line('disparu', [1]), line('location', [2])],
    };
    expect(setStay(sel, { travelers: 3 }, NOW, CATALOG).items).toEqual([
      line('disparu', [1]),
      line('location', [2, 1]),
    ]);
  });
});

describe('ligne par défaut', () => {
  it('part du nombre de voyageurs pour les personnes, dans les bornes (010)', () => {
    expect(defaultLine(service('chutes-de-la-lobe'), 3)).toEqual(line('chutes-de-la-lobe', [3]));
    expect(defaultLine(service('chutes-de-la-lobe'), 25)).toEqual(line('chutes-de-la-lobe', [20]));
    expect(defaultLine(service('essentiel-de-kribi'), 1)).toEqual(line('essentiel-de-kribi', [2]));
    expect(defaultLine(service('chutes-de-la-lobe'), undefined)).toEqual(
      line('chutes-de-la-lobe', [2]),
    );
    expect(defaultLine(service('quad'), 4)).toEqual(line('quad', [1]));
    expect(defaultLine(service('vehicule-premium'), 4)).toEqual(line('vehicule-premium', [1, 1]));
  });

  it('prend les quantités par défaut, le tarif le moins cher et aucune option', () => {
    expect(defaultLine(service('chutes-de-la-lobe'))).toEqual(line('chutes-de-la-lobe', [2]));
    expect(defaultLine(service('campement-bagyeli'))).toEqual(
      line('campement-bagyeli', [2], { tierId: 'individuel' }),
    );
    expect(defaultLine(service('feu-de-plage'))).toEqual(line('feu-de-plage', []));
  });

  it('prend le premier tarif quand tous sont sur devis', () => {
    const quoteOnly = {
      ...service('campement-bagyeli'),
      tiers: [service('campement-bagyeli').tiers![2]!],
    };
    expect(defaultLine(quoteOnly).tierId).toBe('groupe');
  });
});

describe('relecture du stockage', () => {
  const stored = (data: Record<string, unknown>) =>
    JSON.stringify({ version: 1, items: [], stay: {}, updatedAt: NOW.toISOString(), ...data });

  it('repart vide sur un contenu illisible, d’une autre version ou trop ancien', () => {
    for (const raw of [
      null,
      '{pas du json',
      '42',
      stored({ version: 2 }),
      stored({ items: 'x' }),
      stored({ updatedAt: 'hier' }),
      stored({ updatedAt: 5 }),
      stored({ updatedAt: new Date(NOW.getTime() - 31 * 24 * 3600 * 1000).toISOString() }),
    ]) {
      expect(parseSelection(raw, CATALOG, NOW)).toEqual({
        selection: emptySelection(NOW),
        purged: [],
      });
    }
  });

  it('accepte un objet déjà décodé et garde une sélection récente', () => {
    const data = {
      version: 1,
      items: [line('quad', [3])],
      stay: { dates: 'demain' },
      updatedAt: NOW.toISOString(),
    };
    expect(parseSelection(data, CATALOG, NOW).selection.items).toEqual([line('quad', [3])]);
  });

  it('retire et signale les services, tarifs et options disparus', () => {
    const raw = stored({
      items: [
        line('decouverte-de-kribi', []),
        line('campement-bagyeli', [], { tierId: 'famille' }),
        line('chutes-de-la-lobe', [99], { optionIds: ['guide-touristique', 'option-retiree'] }),
        line('chutes-de-la-lobe', [1]),
        line('guide-touristique', []),
        { serviceId: 42 },
        null,
        { serviceId: 'quad', quantities: 'x', optionIds: 'x' },
      ],
      stay: { dates: 'du 1er au 3 mai', travelers: 99 },
    });
    const { selection, purged } = parseSelection(raw, CATALOG, NOW);
    expect(purged).toEqual([
      'decouverte-de-kribi',
      'campement-bagyeli',
      'option-retiree',
      'guide-touristique',
    ]);
    expect(selection.items).toEqual([
      line('chutes-de-la-lobe', [20], { optionIds: ['guide-touristique'] }),
      line('quad', [1]),
    ]);
    expect(selection.stay).toEqual({ dates: 'du 1er au 3 mai' });
  });

  it('garde le tarif valide d’une ligne relue', () => {
    const raw = stored({ items: [line('campement-bagyeli', [3], { tierId: 'individuel' })] });
    expect(parseSelection(raw, CATALOG, NOW).selection.items).toEqual([
      line('campement-bagyeli', [3], { tierId: 'individuel' }),
    ]);
  });

  it('relit les sessions enregistrées, bornées (US6)', () => {
    const raw = stored({
      items: [
        line('chutes-de-la-lobe', [4], { sessions: 3 }),
        line('quad', [1], { sessions: 3 }),
        line('essentiel-de-kribi', [2], { sessions: '2' as unknown as number }),
      ],
    });
    expect(parseSelection(raw, CATALOG, NOW).selection.items).toEqual([
      line('chutes-de-la-lobe', [4], { sessions: 3 }),
      line('quad', [1]),
      line('essentiel-de-kribi', [2]),
    ]);
  });

  it('accepte une sélection sans dates ni voyageurs enregistrés', () => {
    expect(parseSelection(stored({ stay: undefined }), CATALOG, NOW).selection.stay).toEqual({});
  });
});
