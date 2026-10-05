import { expect, test, type Page } from '@playwright/test';

const cards = (page: Page) => page.locator('[data-catalog] li[data-category]:visible');

for (const [path, lang, all, aventure] of [
  ['/experiences', 'fr', 'Toutes', 'Aventure'],
  ['/en/experiences', 'en', 'All', 'Adventure'],
] as const) {
  test.describe(`page Expériences ${lang}`, () => {
    test('liste les 13 expériences sous « Toutes »', async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(cards(page)).toHaveCount(13);
      await expect(page.getByRole('link', { name: all, exact: true })).toBeVisible();
    });

    test('filtre par catégorie, avec une adresse partageable', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('link', { name: aventure, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}#aventure$`));
      await expect(cards(page)).toHaveCount(5);
      for (const [hash, count] of [
        ['nature-decouverte', 5],
        ['detente', 3],
      ] as const) {
        await page.goto(`${path}#${hash}`);
        await expect(cards(page)).toHaveCount(count);
      }
      await page.getByRole('link', { name: all, exact: true }).click();
      await expect(cards(page)).toHaveCount(13);
    });

    test('annonce le filtre et marque l’onglet actif', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('link', { name: aventure, exact: true }).click();
      await expect(page.locator('[data-tab="aventure"]')).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('[data-live]')).toContainText('5');
      const switchTo = lang === 'fr' ? 'en' : 'fr';
      await expect(page.locator(`a[data-locale="${switchTo}"]`)).toHaveAttribute(
        'href',
        /#aventure$/,
      );
    });

    test('se termine par « Une envie particulière ? » et un bouton WhatsApp', async ({ page }) => {
      await page.goto(path);
      const block = page.locator('[data-section="special"]');
      await expect(block.getByRole('link')).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    });
  });
}

test('le filtre fonctionne sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/experiences#aventure');
  await expect(cards(page)).toHaveCount(5);
  await page.goto('/experiences#detente');
  await expect(cards(page)).toHaveCount(3);
  await context.close();
});

test('les onglets restent visibles sous l’en-tête pendant le défilement', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/experiences');
  await page.mouse.wheel(0, 2000);
  await expect(page.getByTestId('category-tabs')).toBeInViewport();
});

test.describe('effets sur l’accueil', () => {
  test('une carte de catégorie mène à la liste filtrée', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[data-section="categories"] a').nth(1);
    await expect(card).toHaveAttribute('href', '/experiences#aventure');
    await expect(card).toContainText(/\d+ expériences?/);
  });

  test('l’onglet Expériences apparaît et les cartes mises en avant mènent à leur fiche', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await expect(
      page.getByTestId('tab-bar').getByRole('link', { name: 'Expériences' }),
    ).toBeVisible();
    await expect(page.locator('[data-section="featured"] a').first()).toHaveAttribute(
      'href',
      '/experiences/chutes-de-la-lobe',
    );
    await expect(page.getByTestId('hero-cta-experiences')).toHaveAttribute('href', '/experiences');
  });
});
