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

test('réajouter la pirogue ajoute une session, et passe sur devis au-delà de 8 personnes (US6)', async ({
  page,
}) => {
  await openExperience(page, 'excursion-en-pirogue');
  for (let i = 0; i < 4; i += 1) await more(page).click();
  await visible(page, 'add-to-stay').click();
  await page.reload();
  await waitForIslands(page);
  for (let i = 0; i < 7; i += 1) await more(page).click();
  await visible(page, 'add-to-stay').click();
  await expect(page.getByTestId('toast')).toContainText('mis à jour');
  expect((await storedSelection(page))?.items).toEqual([
    { serviceId: 'excursion-en-pirogue', quantities: [9], sessions: 2, optionIds: [] },
  ]);
  await page.goto('/sejour');
  await expect(page.getByTestId('stay-line')).toHaveCount(1);
  await expect(page.getByTestId('stay-line')).toContainText('Sur devis');
});

test('Village Bagyeli : pas moins de 2 personnes, ligne à 30 000 FCFA', async ({ page }) => {
  await openExperience(page, 'campement-bagyeli');
  await expect(
    page
      .getByTestId('configurator')
      .filter({ visible: true })
      .getByRole('button', { name: 'Diminuer : Nombre de personnes' }),
  ).toBeDisabled();
  await visible(page, 'add-to-stay').click();
  await page.goto('/sejour');
  const line = page.getByTestId('stay-line');
  await expect(line).toContainText('2 personnes');
  expect(plain(await line.textContent())).toContain('30 000 FCFA');
  const total = plain(await page.locator('[data-testid="stay-total"]:visible').textContent());
  expect(total).toContain('Total estimatif');
});

test('une prestation sur devis : le second ajout est refusé', async ({ page }) => {
  // Le feu de plage compte désormais des personnes (008) : un second ajout fusionne la ligne.
  await openExperience(page, 'village-ebodje');
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
  const quick = page.getByRole('button', { name: /^Ajouter à mon séjour : Jet-ski/ });
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
  await openExperience(page, 'village-ebodje');
  await expect(page.getByTestId('toast')).toContainText('ne permet pas de conserver');
  await visible(page, 'add-to-stay').click();
  await expect(visible(page, 'add-to-stay')).toHaveText('Déjà dans mon séjour');
  await expect(page.locator('[data-testid="stay-badge"]:visible')).toHaveText(/^1/);
});
