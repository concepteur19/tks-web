import { expect, type Locator, type Page } from '@playwright/test';

/** Outils partagés des parcours Mon séjour (004). */
export const STORAGE_KEY = 'kibreeze.selection.v1';

export type SeedLine = {
  serviceId: string;
  quantities?: number[];
  tierId?: string;
  optionIds?: string[];
};

/** Enregistre une sélection dans le stockage du site, puis recharge la page demandée. */
export async function seedSelection(
  page: Page,
  items: SeedLine[],
  stay: { dates?: string; travelers?: number } = {},
  path = '/sejour',
): Promise<void> {
  await page.goto(path);
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      items: items.map((item) => ({ quantities: [], optionIds: [], ...item })),
      stay,
      updatedAt: new Date().toISOString(),
    }),
  ] as const);
  await page.reload();
}

/** Sélection enregistrée, telle que la lit le site. */
export async function storedSelection(page: Page) {
  const raw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  return raw ? (JSON.parse(raw) as { items: Required<SeedLine>[] }) : null;
}

/** Texte sans espaces insécables, pour comparer des montants. */
export const plain = (value: string | null): string =>
  (value ?? '').replace(/[\s\u202f\u00a0]+/g, ' ').trim();

/** Bouton visible (la fiche a une barre sur téléphone et une carte sur ordinateur). */
export const visible = (page: Page, testId: string) =>
  page.locator(`[data-testid="${testId}"]:visible`);

/** Attend que les îlots chargés d'emblée (client:load, client:idle) soient hydratés. */
export async function waitForIslands(page: Page): Promise<void> {
  await expect(page.locator('astro-island[ssr]:not([client="visible"])')).toHaveCount(0);
}

/** Fait apparaître un îlot client:visible et attend son hydratation. */
export async function reveal(island: Locator): Promise<void> {
  await island.scrollIntoViewIfNeeded();
  await expect(island.locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute('ssr', /.*/);
}

/** Message décodé d'un lien WhatsApp. */
export const decodedMessage = (href: string | null): string =>
  decodeURIComponent((href ?? '').split('?text=')[1] ?? '');
