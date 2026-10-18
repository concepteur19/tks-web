import { expect, test } from '@playwright/test';
import { plain, seedSelection, storedSelection, waitForIslands } from './stay.ts';

const FULL = [
  { serviceId: 'excursion-en-pirogue', quantities: [6], optionIds: ['guide-touristique'] },
  { serviceId: 'chutes-de-la-lobe', quantities: [2] },
  { serviceId: 'village-ebodje' },
];

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
});

test('lignes, quantités, total, équivalent en euros et prestations sur devis', async ({ page }) => {
  await seedSelection(page, FULL);
  await expect(page.getByTestId('stay-line')).toHaveCount(3);
  const pirogue = plain(await page.getByTestId('stay-line').first().textContent());
  expect(pirogue).toContain('6 personnes');
  expect(pirogue).toContain('Guide touristique');
  expect(pirogue).toContain('40 000 FCFA');
  const total = plain(await page.locator('[data-testid="stay-total"]:visible').textContent());
  expect(total).toContain('Total indicatif');
  expect(total).toContain('50 000 FCFA');
  expect(total).toContain('€');
  expect(total).toContain('+ 1 prestation sur devis');
  await expect(page.getByTestId('stay-count')).toHaveText('3 prestations sélectionnées');
});

test('modifier une quantité et retirer une ligne mettent total et compteur à jour', async ({
  page,
}) => {
  await seedSelection(page, FULL);
  const lobe = page.getByTestId('stay-line').nth(1);
  await lobe.getByRole('button', { name: /^Augmenter/ }).click();
  await expect(lobe).toContainText('15');
  expect(plain(await page.locator('[data-testid="stay-total"]:visible').textContent())).toContain(
    '55 000 FCFA',
  );
  await page
    .getByRole('button', { name: 'Retirer Village Ebodjé et tortues marines de mon séjour' })
    .click();
  await expect(page.getByTestId('stay-line')).toHaveCount(2);
  await expect(page.locator('[data-testid="stay-badge"]:visible')).toHaveText(/^2/);
});

test('« Vider » demande confirmation, puis affiche l’état vide', async ({ page }) => {
  await seedSelection(page, FULL);
  await page.getByRole('button', { name: 'Vider', exact: true }).click();
  await page.getByRole('button', { name: 'Annuler' }).click();
  await expect(page.getByTestId('stay-line')).toHaveCount(3);
  await page.getByRole('button', { name: 'Vider', exact: true }).click();
  await page.getByRole('button', { name: 'Vider le séjour' }).click();
  await expect(page.getByTestId('stay-empty')).toContainText('Votre séjour est vide');
  await expect(page.getByTestId('whatsapp-button')).toBeVisible();
  expect((await storedSelection(page))?.items).toEqual([]);
});

test('dates et voyageurs vides : rappel visible, envoi possible ; saisis : conservés', async ({
  page,
}) => {
  await seedSelection(page, FULL);
  await expect(page.getByText('Ajoutez vos dates')).toBeVisible();
  await expect(page.locator('[data-testid="send-stay"]:visible')).toBeVisible();
  await page.getByLabel('Dates du séjour').fill('du 12 au 15 décembre');
  await page.getByLabel('Voyageurs').fill('4');
  await page.getByLabel('Voyageurs').blur();
  await page.reload();
  await waitForIslands(page);
  await expect(page.getByLabel('Dates du séjour')).toHaveValue('du 12 au 15 décembre');
  await expect(page.getByLabel('Voyageurs')).toHaveValue('4');
  await expect(page.getByText('Ajoutez vos dates')).toHaveCount(0);
});

test('changer de langue garde les lignes et traduit libellés et montants', async ({ page }) => {
  await seedSelection(page, FULL);
  await page.locator('a[data-locale="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/my-trip$/);
  await expect(page.getByTestId('stay-line')).toHaveCount(3);
  await expect(page.getByTestId('stay-line').first()).toContainText('Dugout canoe trip');
  expect(plain(await page.locator('[data-testid="stay-total"]:visible').textContent())).toContain(
    '50,000 FCFA',
  );
});

test('une expérience qui n’existe plus est retirée au chargement, avec un message', async ({
  page,
}) => {
  await seedSelection(page, [...FULL, { serviceId: 'experience-retiree', quantities: [2] }]);
  // Le message s'efface au bout de quelques secondes : on le lit avant d'attendre les lignes.
  await expect(page.getByTestId('toast')).toContainText('n’est plus proposée'.replace('’', "'"));
  await expect(page.getByTestId('stay-line')).toHaveCount(3);
});

test('pas de défilement horizontal à 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await seedSelection(page, FULL, { dates: 'du 12 au 15 décembre', travelers: 4 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('sur ordinateur, le panneau du total reste visible au défilement', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await seedSelection(
    page,
    ['kayak', 'paddle', 'quad', 'balade-a-cheval', 'jacuzzi-naturel', 'seance-photo'].map(
      (serviceId) => ({ serviceId, quantities: [2] }),
    ),
  );
  await expect(page.getByTestId('stay-bar')).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('[data-testid="stay-total"]:visible')).toBeInViewport();
  await expect(page.locator('[data-testid="send-stay"]:visible')).toBeInViewport();
});

test('Mon séjour respecte le minimum du Village Bagyeli', async ({ page }) => {
  await seedSelection(page, [{ serviceId: 'campement-bagyeli', quantities: [2] }]);
  await expect(page.getByRole('button', { name: /^Diminuer : Village Bagyeli/ })).toBeDisabled();
});

test('un tarif du campement qui n’existe plus est retiré, avec un message', async ({ page }) => {
  await seedSelection(page, [
    ...FULL,
    { serviceId: 'campement-bagyeli', tierId: 'couple', quantities: [] },
  ]);
  await expect(page.getByTestId('stay-line')).toHaveCount(3);
  await expect(page.getByTestId('toast')).toContainText('n’est plus proposée'.replace('’', "'"));
});
