import { expect, test } from '@playwright/test';

const SECTION_ORDER = [
  'hero',
  'categories',
  'featured',
  'strip',
  'accommodation',
  'packages',
  'mobility',
  'about',
  'whatsapp-cta',
];

for (const [path, lang, title, ctas] of [
  ['/', 'fr', 'Découvrez Kribi autrement', ['Découvrir les expériences', 'Planifier mon séjour']],
  ['/en/', 'en', 'Discover Kribi differently', ['Discover the experiences', 'Plan my trip']],
] as const) {
  test.describe(`accueil ${lang}`, () => {
    test('montre le hero complet dès le premier écran', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(path);
      const hero = page.locator('[data-section="hero"]');
      await expect(hero.getByRole('img', { name: 'Kibreeze' })).toBeInViewport();
      await expect(hero.getByText('Kribi is a feeling')).toBeInViewport();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      for (const label of ctas) {
        await expect(hero.getByRole('link', { name: new RegExp(label) })).toBeVisible();
      }
    });

    test('présente les sections dans l’ordre validé', async ({ page }) => {
      await page.goto(path);
      const order = await page
        .locator('main [data-section]')
        .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-section')));
      expect(order).toEqual(SECTION_ORDER);
    });

    test('garde la section TKS® sobre, après les expériences', async ({ page }) => {
      await page.goto(path);
      const mobility = page.locator('[data-section="mobility"]');
      const featured = page.locator('[data-section="featured"]');
      const mobilityBox = await mobility.boundingBox();
      const featuredBox = await featured.boundingBox();
      expect(mobilityBox!.y).toBeGreaterThan(featuredBox!.y);
      // Seule image autorisée : le logo TKS®, plus petit que celui de Kibreeze.
      await expect(mobility.locator('img')).toHaveCount(1);
      expect(mobilityBox!.height).toBeLessThan(featuredBox!.height / 2);
    });

    test('suit chaque prix en FCFA de son équivalent en euros, avec une seule mention indicative', async ({
      page,
    }) => {
      await page.goto(path);
      const amounts = page.locator('[data-price="fixed"], [data-price="from"]');
      const count = await amounts.count();
      expect(count).toBeGreaterThanOrEqual(9);
      for (let index = 0; index < count; index += 1) {
        await expect(amounts.nth(index).locator('[data-price-eur]')).toHaveText(/≈/);
      }
      await expect(page.locator('[data-indicative]')).toHaveCount(1);
    });

    test('ne montre aucun bouton d’ajout au séjour, et compte les expériences par univers', async ({
      page,
    }) => {
      // Le nombre par catégorie apparaît depuis la livraison du catalogue (feature 003).
      await page.goto(path);
      // Depuis la 004, chaque expérience mise en avant propose l'ajout rapide (FR-028).
      await expect(page.locator('[data-section="featured"] [data-testid="quick-add"]')).toHaveCount(
        4,
      );
      // Une carte par univers qui a au moins une prestation publiée (feature 008).
      const cards = page.locator('[data-section="categories"] a');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(2);
      await expect(
        page.locator('[data-section="categories"]').getByText(/\d+ (expériences?|experiences?)/),
      ).toHaveCount(count);
    });

    test('renvoie vers WhatsApp les liens dont la page n’est pas livrée', async ({ page }) => {
      // La mobilité TKS® (feature 006) n'est pas encore livrée : son lien ouvre WhatsApp.
      await page.goto(path);
      const cta = page.locator('[data-section="mobility"] a[data-link-kind]');
      await expect(cta).toHaveAttribute('data-link-kind', 'whatsapp');
      await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\//);
      // Les hébergements, livrés par la 005, mènent à leur page.
      await expect(
        page.locator('[data-section="accommodation"] a[data-link-kind]'),
      ).toHaveAttribute('data-link-kind', 'internal');
    });
  });
}

test('reste lisible sans JavaScript, carrousel compris', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-section="featured"] li')).toHaveCount(4);
  await context.close();
});
