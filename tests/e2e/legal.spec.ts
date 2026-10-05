import { expect, test } from '@playwright/test';
import { deliveredPaths } from './delivered.ts';

/**
 * Stockages documentés dans la section cookies de la politique de confidentialité.
 * Vide pour la feature 002 ; la feature 004 y ajoutera la clé de la sélection, en même temps
 * que le texte (FR-031).
 */
const DOCUMENTED_STORAGE: string[] = [];

const LEGAL = {
  fr: [
    ['Mentions légales', '/mentions-legales'],
    ['Confidentialité et cookies', '/confidentialite'],
    ["Conditions d'utilisation", '/conditions-utilisation'],
  ],
  en: [
    ['Legal notice', '/en/legal-notice'],
    ['Privacy and cookies', '/en/privacy'],
    ['Terms of use', '/en/terms-of-use'],
  ],
} as const;

for (const lang of ['fr', 'en'] as const) {
  test(`pied de page ${lang} : les trois liens légaux mènent aux pages de la langue`, async ({
    page,
  }) => {
    await page.goto(lang === 'fr' ? '/' : '/en/');
    const legalNav = page.getByRole('navigation', {
      name: lang === 'fr' ? 'Informations légales' : 'Legal information',
    });
    for (const [label, path] of LEGAL[lang]) {
      await expect(legalNav.getByRole('link', { name: label })).toHaveAttribute('href', path);
      const response = await page.request.get(path);
      expect(response.status(), path).toBe(200);
    }
  });

  for (const [, path] of LEGAL[lang]) {
    test(`${path} : titre, date de mise à jour, langue`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('[data-updated]')).toContainText(/2026/);
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
    });
  }
}

test('les mentions légales citent l’hébergeur et son adresse', async ({ page }) => {
  for (const path of ['/mentions-legales', '/en/legal-notice']) {
    await page.goto(path);
    await expect(page.getByRole('main')).toContainText('Cloudflare, Inc.');
    await expect(page.getByRole('main')).toContainText('101 Townsend St, San Francisco');
  }
});

test('la politique de confidentialité porte une section cookies', async ({ page }) => {
  for (const path of ['/confidentialite', '/en/privacy']) {
    await page.goto(`${path}#cookies`);
    await expect(page.locator('#cookies')).toBeVisible();
  }
});

for (const path of deliveredPaths()) {
  test(`${path} : aucun cookie, aucun stockage non documenté`, async ({ page, context }) => {
    await page.goto(path);
    expect(await page.evaluate(() => document.cookie)).toBe('');
    expect(await context.cookies()).toEqual([]);
    const keys = await page.evaluate(() => Object.keys(window.localStorage));
    for (const key of keys) expect(DOCUMENTED_STORAGE).toContain(key);
  });
}
