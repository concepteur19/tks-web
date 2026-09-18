import { expect, test } from '@playwright/test';

test.describe('squelette bilingue', () => {
  test("affiche l'accueil en français sans préfixe de langue", async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Découvrez Kribi autrement');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });

  test('bascule vers l’anglais puis revient au français', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-locale="en"]').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Discover Kribi differently');

    await page.locator('[data-locale="fr"]').click();
    await expect(page).toHaveURL(/localhost:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('déclare les liens alternatifs dans les deux langues', async ({ page }) => {
    await page.goto('/');
    for (const hreflang of ['fr', 'en', 'x-default']) {
      await expect(page.locator(`link[hreflang="${hreflang}"]`)).toHaveCount(1);
    }
  });

  test('garde le bouton WhatsApp visible sans faire défiler la page', async ({ page }) => {
    await page.goto('/');
    const button = page.getByTestId('whatsapp-button');
    await expect(button).toBeInViewport();
    await expect(button).toHaveAttribute('href', /^https:\/\/wa\.me\/\d{8,15}\?text=/);
    await expect(button).toHaveAttribute('rel', /noopener/);
  });

  test("sert une page d'erreur dans chaque langue", async ({ page }) => {
    const french = await page.goto('/cette-page-nexiste-pas');
    expect(french?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');

    // L'hébergeur sert la page d'erreur la plus proche ; on vérifie ici que la
    // version anglaise existe et s'affiche en anglais. Le comportement de
    // l'hébergeur lui-même est vérifié en ligne (tâche T049).
    await page.goto('/en/404');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  });

  test('reste lisible et navigable sans JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.locator('[data-locale="en"]').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Discover Kribi differently');
    await context.close();
  });

  test('ne déborde pas horizontalement à 360 pixels', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('se parcourt au clavier jusqu’au contenu', async ({ page, browserName }) => {
    // WebKit ne déplace le focus vers les liens avec Tab que si l'option
    // système d'accès clavier complet est active. Le comportement du site est
    // donc vérifié sur Chromium, et l'accessibilité clavier reste couverte par
    // les contrôles axe.
    test.skip(browserName === 'webkit', 'Tab ne cible pas les liens sous WebKit par défaut');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveText('Aller au contenu');
  });
});
