import { expect, test } from '@playwright/test';
import { deliveredPaths, MISSING_PATHS } from './delivered.ts';

const ALL_PATHS = [...deliveredPaths(), ...MISSING_PATHS];

test.describe('coque commune', () => {
  test('sur téléphone : barre à onglets en bas, en-tête sans menu ni Mon séjour', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    const tabBar = page.getByTestId('tab-bar');
    await expect(tabBar).toBeVisible();
    const box = await tabBar.boundingBox();
    expect(Math.round((box?.y ?? 0) + (box?.height ?? 0))).toBe(800);
    await expect(tabBar.locator('[aria-current="page"]')).toContainText('Accueil');

    const header = page.getByTestId('site-header');
    await expect(header.getByRole('button')).toHaveCount(0);
    await expect(header.getByRole('link', { name: 'Mon séjour' })).toHaveCount(0);
  });

  test('sur ordinateur : pas de barre à onglets, contenu limité en largeur', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto('/');
    await expect(page.getByTestId('tab-bar')).toBeHidden();
    const width = await page
      .getByTestId('site-header')
      .locator(':scope > div')
      .evaluate((element) => element.getBoundingClientRect().width);
    expect(width).toBeLessThanOrEqual(1200);
  });

  for (const path of deliveredPaths()) {
    test(`${path} : le sélecteur de langue mène à la page équivalente`, async ({ page }) => {
      await page.goto(path);
      const target = path.startsWith('/en') ? 'fr' : 'en';
      const href = await page.locator(`[data-locale="${target}"]`).getAttribute('href');
      const response = await page.goto(href ?? '');
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', target);
    });
  }

  for (const [path, lang, title] of [
    [MISSING_PATHS[0], 'fr', 'Page introuvable'],
    ['/en/404', 'en', 'Page not found'],
  ] as const) {
    test(`page d'erreur ${lang} : coque complète et retour vers l'accueil`, async ({ page }) => {
      await page.goto(path ?? '');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await expect(page.getByTestId('site-header')).toBeVisible();
      await expect(page.getByTestId('site-footer')).toBeVisible();
      await expect(page.getByRole('main').getByRole('link')).toHaveAttribute(
        'href',
        lang === 'fr' ? '/' : '/en/',
      );
    });
  }

  test('se parcourt au clavier : lien d’évitement en premier', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Tab ne cible pas les liens sous WebKit par défaut');
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('site-header').locator('a').first()).toBeFocused();
  });

  for (const width of [320, 360, 1440, 1920]) {
    test(`aucun défilement horizontal à ${width} px sur les pages livrées`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ALL_PATHS) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, path).toBeLessThanOrEqual(0);
      }
    });
  }

  test('aucune mention interdite par la spec (FR-022)', async ({ page }) => {
    for (const path of ALL_PATHS) {
      await page.goto(path);
      const text = (await page.locator('body').innerText()).replaceAll('Breezy Delivery', '');
      expect(text, path).not.toMatch(/livraison|delivery/i);
      expect(text, path).not.toContain('$');
      expect(text, path).not.toMatch(/★|☆|\bavis\b|\breviews?\b/i);
    }
  });
});
