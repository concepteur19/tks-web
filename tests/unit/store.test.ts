import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CATALOG, SERVICES } from '../fixtures/catalog.ts';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

class BrokenStorage extends MemoryStorage {
  override setItem(): void {
    throw new DOMException('quota', 'QuotaExceededError');
  }
}

/** Recharge le store sur un stockage donné ; la persistance est branchée sur ce même stockage. */
async function loadStore(storage: Storage) {
  vi.resetModules();
  vi.stubGlobal('localStorage', storage);
  const { setPersistentEngine } = await import('@nanostores/persistent');
  const proxy = new Proxy({} as Record<string, string>, {
    has: (_, key: string) => storage.getItem(key) !== null,
    get: (_, key: string) => storage.getItem(key) ?? undefined,
    set: (_, key: string, value: string) => {
      storage.setItem(key, value);
      return true;
    },
    deleteProperty: (_, key: string) => {
      storage.removeItem(key);
      return true;
    },
  });
  setPersistentEngine(proxy, { addEventListener() {}, removeEventListener() {}, perKey: false });
  return import('../../src/features/selection/store.ts');
}

beforeEach(() => vi.unstubAllGlobals());

describe('store de la sélection', () => {
  it('persiste la sélection sous la clé kibreeze.selection.v1', async () => {
    const storage = new MemoryStorage();
    const store = await loadStore(storage);
    store.hydrate(CATALOG);
    expect(store.add({ serviceId: 'quad', quantities: [2], optionIds: [] })).toEqual({
      type: 'added',
      serviceId: 'quad',
    });
    const saved = JSON.parse(storage.getItem(store.STORAGE_KEY) ?? '{}');
    expect(saved.items).toEqual([{ serviceId: 'quad', quantities: [2], optionIds: [] }]);
    expect(store.count(store.$selection.get())).toBe(1);
    expect(store.$lastEvent.get()).toEqual({ type: 'added', serviceId: 'quad' });
  });

  it('relit, nettoie et signale une sélection enregistrée', async () => {
    const storage = new MemoryStorage();
    storage.setItem(
      'kibreeze.selection.v1',
      JSON.stringify({
        version: 1,
        items: [
          { serviceId: 'disparu', quantities: [], optionIds: [] },
          { serviceId: 'chutes-de-la-lobe', quantities: [3], optionIds: [] },
        ],
        stay: {},
        updatedAt: new Date().toISOString(),
      }),
    );
    const store = await loadStore(storage);
    store.hydrate(CATALOG);
    expect(store.$selection.get().items.map((item) => item.serviceId)).toEqual([
      'chutes-de-la-lobe',
    ]);
    expect(store.$lastEvent.get()).toEqual({ type: 'purged', serviceIds: ['disparu'] });
  });

  it('modifie, retire, vide et enregistre dates et voyageurs', async () => {
    const store = await loadStore(new MemoryStorage());
    store.hydrate(CATALOG);
    store.add({ serviceId: 'chutes-de-la-lobe', quantities: [2], optionIds: [] });
    store.update('chutes-de-la-lobe', { quantities: [5] });
    expect(store.$selection.get().items[0]?.quantities).toEqual([5]);
    store.setStay({ dates: 'en mai', travelers: 3 });
    expect(store.$selection.get().stay).toEqual({ dates: 'en mai', travelers: 3 });
    store.remove('chutes-de-la-lobe');
    expect(store.$selection.get().items).toEqual([]);
    store.add({ serviceId: 'quad', quantities: [1], optionIds: [] });
    store.clear();
    expect(store.$lastEvent.get()).toEqual({ type: 'cleared' });
  });

  it('fonctionne en mémoire quand le stockage refuse l’écriture', async () => {
    const store = await loadStore(new BrokenStorage());
    expect(store.storageAvailable(new BrokenStorage())).toBe(false);
    expect(store.$lastEvent.get()).toEqual({ type: 'storageUnavailable' });
    store.hydrate(CATALOG);
    store.add({ serviceId: 'quad', quantities: [1], optionIds: [] });
    expect(store.count(store.$selection.get())).toBe(1);
  });

  it('détecte l’absence de stockage', async () => {
    const store = await loadStore(new MemoryStorage());
    expect(store.storageAvailable(null)).toBe(false);
  });

  it('lit le catalogue publié dans la page, et l’ignore s’il est absent ou illisible', async () => {
    const store = await loadStore(new MemoryStorage());
    const doc = (text: string | null) =>
      ({
        getElementById: () => (text === null ? null : { textContent: text }),
      }) as unknown as Document;
    expect(store.readPageCatalog(doc(JSON.stringify(SERVICES))).size).toBe(SERVICES.length);
    expect(store.readPageCatalog(doc(null)).size).toBe(0);
    expect(store.readPageCatalog(doc('{cassé')).size).toBe(0);
    expect(store.readPageCatalog(undefined).size).toBe(0);
  });

  it('hydrate depuis la page au premier besoin, une seule fois', async () => {
    const store = await loadStore(new MemoryStorage());
    vi.stubGlobal('document', {
      getElementById: () => ({ textContent: JSON.stringify(SERVICES) }),
    });
    expect(store.getCatalog().size).toBe(SERVICES.length);
    expect(store.hydrate()).toBe(store.getCatalog());
  });

  it('décode une valeur stockée illisible en sélection vide', async () => {
    const storage = new MemoryStorage();
    storage.setItem('kibreeze.selection.v1', '{illisible');
    const store = await loadStore(storage);
    expect(store.$selection.get().items).toEqual([]);
  });
});
