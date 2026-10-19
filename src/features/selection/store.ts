/**
 * Store de la sélection (ADR-002, contrats 004). Il applique les fonctions pures de
 * `selection.ts` à un atome persistant et publie le dernier événement pour les messages de
 * confirmation. Aucune règle métier ici.
 */
import { atom, type WritableAtom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import { catalogMap, type Catalog, type IslandService } from './islandCatalog.ts';
import {
  addLine,
  clearSelection,
  emptySelection,
  parseSelection,
  removeLine,
  setStay as applyStay,
  updateLine,
  type Result,
  type SelectedLine,
  type Selection,
  type SelectionEvent,
  type Stay,
} from './selection.ts';

export const STORAGE_KEY = 'kibreeze.selection.v1';

/** Le stockage est-il utilisable ? Un essai d'écriture tranche (navigation privée, quota). */
export function storageAvailable(
  storage: Storage | null | undefined = globalThis.localStorage,
): boolean {
  try {
    if (!storage) return false;
    const probe = `${STORAGE_KEY}.probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const persistent = storageAvailable();

/** Atome de la sélection : persistant si possible, en mémoire sinon (FR-SEL-7). */
export const $selection: WritableAtom<Selection> = persistent
  ? persistentAtom<Selection>(STORAGE_KEY, emptySelection(new Date()), {
      encode: JSON.stringify,
      // La validation complète se fait dans `hydrate`, qui connaît le catalogue.
      decode: (raw) => {
        try {
          return JSON.parse(raw) as Selection;
        } catch {
          return emptySelection(new Date());
        }
      },
    })
  : atom<Selection>(emptySelection(new Date()));

/** Dernier événement, lu par les messages de confirmation. */
export const $lastEvent = atom<SelectionEvent | null>(
  persistent ? null : { type: 'storageUnavailable' },
);

/** Identifiant du bloc JSON qui porte le catalogue minimal, publié une fois par page. */
export const CATALOG_ELEMENT_ID = 'kibreeze-catalog';

let catalog: Catalog = new Map();
let hydrated = false;

function commit({ selection, event }: Result): SelectionEvent {
  $selection.set(selection);
  $lastEvent.set(event);
  return event;
}

/** Lit le catalogue publié par le layout (`BaseLayout`), sans dépendre d'un îlot en particulier. */
export function readPageCatalog(doc: Document | undefined = globalThis.document): Catalog {
  const element = doc?.getElementById(CATALOG_ELEMENT_ID);
  if (!element?.textContent) return new Map();
  try {
    return catalogMap(JSON.parse(element.textContent) as IslandService[]);
  } catch {
    return new Map();
  }
}

/**
 * Relit et nettoie la sélection enregistrée avec le catalogue complet (lignes disparues retirées,
 * bornes, purge à 30 jours). Appelée une seule fois, par le premier îlot monté.
 */
let mounted = false;

/**
 * L'atome persistant ne lit le stockage qu'une fois abonné : sans abonnement, la sélection
 * enregistrée paraîtrait vide et serait écrasée. Le store reste donc abonné en permanence.
 */
function ensureMounted(): void {
  if (mounted) return;
  $selection.listen(() => {});
  mounted = true;
}

export function hydrate(source?: Catalog, now = new Date()): Catalog {
  ensureMounted();
  // Une seule relecture par page : la relire à chaque rendu d'îlot provoquerait une boucle.
  if (hydrated && !source) return catalog;
  catalog = source ?? readPageCatalog();
  hydrated = true;
  const { selection, purged } = parseSelection($selection.get(), catalog, now);
  $selection.set(selection);
  if (purged.length > 0) $lastEvent.set({ type: 'purged', serviceIds: purged });
  return catalog;
}

/** Catalogue courant, hydraté au besoin. */
export function getCatalog(): Catalog {
  return hydrated ? catalog : hydrate();
}

export const add = (line: SelectedLine) =>
  commit(addLine($selection.get(), line, getCatalog(), new Date()));

export const update = (serviceId: string, patch: Partial<Omit<SelectedLine, 'serviceId'>>) =>
  commit(updateLine($selection.get(), serviceId, patch, getCatalog(), new Date()));

export const remove = (serviceId: string) =>
  commit(removeLine($selection.get(), serviceId, new Date()));

export const clear = () => commit(clearSelection($selection.get(), new Date()));

export const setStay = (stay: Stay) =>
  $selection.set(applyStay($selection.get(), stay, new Date(), getCatalog()));

/** Nombre de lignes, pour le compteur. */
export const count = (selection: Selection) => selection.items.length;
