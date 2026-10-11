import { expect, test, type Page } from '@playwright/test';
import { plain, reveal, storedSelection, visible, waitForIslands } from './stay.ts';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
});

async function openExperience(page: Page, slug: string) {
  await page.goto(`/experiences/${slug}`);
  await waitForIslands(page);
}

const more = (page: Page) =>
  page
    .getByTestId('configurator')
    .filter({ visible: true })
    .getByRole('button', { name: 'Augmenter : Nombre de personnes' });

test('pirogue pour 6 avec guide : total à jour, ajout confirmé, compteur à 1', async ({ page }) => {
  await openExperience(page, 'excursion-en-pirogue');
  for (let i = 0; i < 4; i += 1) await more(page).click();
  await page.getByRole('checkbox', { name: /^Guide touristique/ }).check();
  expect(plain(await visible(page, 'draft-total').textContent())).toBe('40 000 FCFA');
  await visible(page, 'add-to-stay').click();
  await expect(page.getByTestId('toast')).toContainText(
    'Excursion en pirogue ajouté à votre séjour',
  );
  await expect(page.locator('[data-testid="stay-badge"]:visible')).toHaveText(/^1/);
  expect((await storedSelection(page))?.items).toEqual([
    { serviceId: 'excursion-en-pirogue', quantities: [6], optionIds: ['guide-touristique'] },
  ]);
});

test('réajouter la pirogue fusionne la ligne et passe sur devis au-delà de 8', async ({ page }) => {
  await openExperience(page, 'excursion-en-pirogue');
  for (let i = 0; i < 4; i += 1) await more(page).click();
  await visible(page, 'add-to-stay').click();
  await page.reload();
  await waitForIslands(page);
  await more(page).click();
  await visible(page, 'add-to-stay').click();
  await expect(page.getByTestId('toast')).toContainText('mis à jour');
  expect((await storedSelection(page))?.items.map((item) => item.quantities)).toEqual([[9]]);
  await page.goto('/sejour');
  await expect(page.getByTestId('stay-line')).toHaveCount(1);
  await expect(page.getByTestId('stay-line')).toContainText('Sur devis');
});

test('campement : le tarif couple donne une ligne à 20 000 FCFA', async ({ page }) => {
  await openExperience(page, 'campement-bagyeli');
  await page.getByRole('radio', { name: /^Couple/ }).check();
  await visible(page, 'add-to-stay').click();
  await page.goto('/sejour');
  const line = page.getByTestId('stay-line');
  await expect(line).toContainText('tarif Couple');
  expect(plain(await line.textContent())).toContain('20 000 FCFA');
});

test('feu de plage : le second ajout est refusé', async ({ page }) => {
  await openExperience(page, 'feu-de-plage');
  await visible(page, 'add-to-stay').click();
  await expect(visible(page, 'add-to-stay')).toHaveText('Déjà dans mon séjour');
  await expect(visible(page, 'add-to-stay')).toBeDisabled();
});

test('ajout rapide depuis la liste et l’accueil avec les valeurs par défaut', async ({ page }) => {
  await page.goto('/experiences/visites');
  await waitForIslands(page);
  const lobe = page.getByRole('button', { name: 'Ajouter à mon séjour : Chutes de la Lobé' });
  await reveal(lobe);
  await lobe.click();
  await expect(page.getByTestId('toast')).toContainText('Chutes de la Lobé ajouté');
  await page.goto('/');
  await waitForIslands(page);
  const quick = page.getByRole('button', { name: /^Ajouter à mon séjour : Croisière/ });
  await reveal(quick);
  await quick.click();
  await expect(page.getByTestId('toast')).toContainText('ajouté');
  const items = (await storedSelection(page))?.items ?? [];
  expect(items).toHaveLength(2);
  expect(items[0]).toEqual({ serviceId: 'chutes-de-la-lobe', quantities: [2], optionIds: [] });
});

test('la sélection survit à la fermeture du navigateur', async ({ browser, page, context }) => {
  await openExperience(page, 'kayak');
  await visible(page, 'add-to-stay').click();
  const state = await context.storageState();
  const reopened = await browser.newContext({ storageState: state });
  const again = await reopened.newPage();
  await again.goto('/sejour');
  await expect(again.getByTestId('stay-line')).toHaveCount(1);
  await expect(again.getByTestId('stay-line')).toContainText('Kayak');
  await reopened.close();
});

test('stockage bloqué : bandeau d’avertissement, la sélection fonctionne en mémoire', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('bloqué', 'SecurityError');
    };
  });
  await openExperience(page, 'feu-de-plage');
  await expect(page.getByTestId('toast')).toContainText('ne permet pas de conserver');
  await visible(page, 'add-to-stay').click();
  await expect(visible(page, 'add-to-stay')).toHaveText('Déjà dans mon séjour');
  await expect(page.locator('[data-testid="stay-badge"]:visible')).toHaveText(/^1/);
});
