import { expect, test } from '@playwright/test';
import {
  decodedMessage,
  plain,
  reveal,
  seedSelection,
  storedSelection,
  waitForIslands,
} from './stay.ts';

/** Retours de Franck des 11-12 octobre (010, US1). */
test.describe('spécialités culinaires', () => {
  for (const [path, upcoming, franck] of [
    [
      '/experiences/specialites-culinaires',
      'Photo à venir',
      ['Le goût authentique de la côte', 'Osez une spécialité de caractère'],
    ],
    [
      '/en/experiences/local-food',
      'Photo coming soon',
      ['The authentic taste of the coast', 'Dare to try a dish with character'],
    ],
  ] as const) {
    test(`11 plats décrits par Franck, l’Ebanjea compris, photos à venir signalées (${path})`, async ({
      page,
    }) => {
      await page.goto(path);
      const cards = page.getByTestId('experience-card');
      await expect(cards).toHaveCount(11);
      const descriptions = await cards.locator('h2 + p').allTextContents();
      expect(new Set(descriptions).size).toBe(11);
      const text = plain(await page.locator('main').textContent());
      for (const phrase of franck) expect(text).toContain(phrase);
      for (const name of ['Ebanjea', 'Maban']) {
        const card = cards.filter({ hasText: name });
        await expect(card.locator('[data-illustrative]')).toContainText(upcoming);
      }
    });
  }

  test('un plat se compte en plats, dans Mon séjour et dans le message', async ({ page }) => {
    await seedSelection(page, [{ serviceId: 'crabe', quantities: [2] }]);
    const line = page.getByTestId('stay-line');
    expect(plain(await line.textContent())).toContain('2 plats');
    const message = plain(
      decodedMessage(await page.locator('[data-testid="send-stay"]:visible').getAttribute('href')),
    );
    expect(message).toContain('Crabe — 2 plats : sur devis');
  });
});

test('une visite ajoutée part du nombre de voyageurs', async ({ page }) => {
  await seedSelection(page, [], { travelers: 3 }, '/experiences/visites');
  await waitForIslands(page);
  const add = page.getByRole('button', { name: 'Ajouter à mon séjour : Chutes de la Lobé' });
  await reveal(add);
  await add.click();
  await expect.poll(async () => (await storedSelection(page))?.items[0]?.quantities).toEqual([3]);
  await page.goto('/sejour');
  await expect(
    page.getByTestId('stay-line').getByText('Personnes pour cette activité'),
  ).toBeVisible();
});

test('le pique-nique s’appelle « Pique-nique en bord de mer »', async ({ page }) => {
  await page.goto('/experiences/pique-nique-en-bord-de-mer');
  await expect(page.locator('h1')).toHaveText('Pique-nique en bord de mer');
  expect(plain(await page.locator('main').innerText()).toLowerCase()).not.toContain('bivouac');
});

test.describe('photos (US5)', () => {
  test('la photo du pique-nique est cadrée sur le pique-nique', async ({ page }) => {
    await page.goto('/experiences/activites');
    const image = page
      .getByTestId('experience-card')
      .filter({ hasText: 'Pique-nique en bord de mer' })
      .locator('img')
      .first();
    expect(await image.evaluate((element) => getComputedStyle(element).objectPosition)).toBe(
      '50% 82%',
    );
  });

  test('toucher une photo de fiche l’ouvre en grand, puis elle se ferme', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const first = page.getByTestId('gallery').locator('a[data-lightbox-open]').first();
    const lightbox = page.getByTestId('lightbox');
    await expect(lightbox).toBeHidden();
    await first.click();
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('img')).toHaveAttribute('src', /.+/);
    await lightbox.getByRole('button', { name: 'Fermer' }).click();
    await expect(lightbox).toBeHidden();
    await expect(first).toBeFocused();
    await first.click();
    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
    await first.click();
    await page.mouse.click(5, 5);
    await expect(lightbox).toBeHidden();
  });

  test('sans JavaScript, la photo est un lien vers l’image en grand', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/experiences/excursion-en-pirogue');
    await expect(
      page.getByTestId('gallery').locator('a[data-lightbox-open]').first(),
    ).toHaveAttribute('href', /\.(jpg|jpeg|webp)$/);
    await context.close();
  });
});
