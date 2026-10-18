import { expect, test, type Page } from '@playwright/test';
import { reveal, seedSelection } from './stay.ts';

/** Tuto de première visite (009, US1). Ces tests partent d'un stockage vide. */
test.use({ storageState: { cookies: [], origins: [] } });

const bubble = (page: Page) => page.getByTestId('guide');

for (const [path, lang, next, done, skip, first] of [
  ['/', 'fr', 'Suivant', "C'est parti", 'Passer', 'Explorez Kribi'],
  ['/en/', 'en', 'Next', "Let's go", 'Skip', 'Explore Kribi'],
] as const) {
  test.describe(`tuto ${lang}`, () => {
    test('apparaît vite, sans bloquer la page, puis ne revient plus', async ({ page }) => {
      await page.goto(path);
      await expect(bubble(page)).toBeVisible({ timeout: 2000 });
      await expect(bubble(page)).toContainText(first);
      // La page reste utilisable : le lien d'évitement et les liens restent cliquables.
      await expect(page.locator('main a').first()).toBeEnabled();
      await page.getByRole('button', { name: next }).click();
      await page.getByRole('button', { name: next }).click();
      await page.getByRole('button', { name: done }).click();
      await expect(bubble(page)).toHaveCount(0);
      await page.reload();
      await page.waitForTimeout(2000);
      await expect(bubble(page)).toHaveCount(0);
    });

    test('« Passer » ferme pour de bon', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: skip }).click();
      await expect(bubble(page)).toHaveCount(0);
      await page.goto(lang === 'fr' ? '/hebergements' : '/en/accommodation');
      await page.waitForTimeout(2000);
      await expect(bubble(page)).toHaveCount(0);
    });
  });
}

test('placée au-dessus de la barre à onglets sur téléphone, en haut à droite sur ordinateur', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const box = (await bubble(page).boundingBox())!;
  const tabs = (await page.getByTestId('tab-bar').boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(tabs.y);

  await page.setViewportSize({ width: 1440, height: 1024 });
  const wide = (await bubble(page).boundingBox())!;
  expect(wide.x).toBeGreaterThan(1440 / 2);
  expect(wide.y).toBeLessThan(1024 / 2);
});

test('arrivée directe sur une fiche : le tuto s’affiche aussi', async ({ page }) => {
  await page.goto('/experiences/excursion-en-pirogue');
  await expect(bubble(page)).toBeVisible({ timeout: 2000 });
});

test('séjour déjà rempli : pas de tuto', async ({ page }) => {
  await seedSelection(page, [{ serviceId: 'chutes-de-la-lobe', quantities: [2] }], {}, '/');
  await page.waitForTimeout(2000);
  await expect(bubble(page)).toHaveCount(0);
});

test('un ajout pendant le tuto mène à l’étape 3, sans recouvrir la notification', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/hebergements');
  await expect(bubble(page)).toContainText('Étape 1 sur 3');
  const add = page.locator('[id="studio-30000"]').getByTestId('quick-add');
  // La bulle est fixée en bas : le bouton est amené au centre de l'écran, hors de sa portée.
  await add.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await reveal(add);
  await add.click();
  const toast = page.getByTestId('toast');
  await expect(toast).toContainText('ajouté');
  await expect(bubble(page)).toHaveCount(0);
  await expect(bubble(page)).toContainText('Étape 3 sur 3', { timeout: 6000 });
});

test('sans JavaScript : pas de tuto', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(bubble(page)).toHaveCount(0);
  await context.close();
});
