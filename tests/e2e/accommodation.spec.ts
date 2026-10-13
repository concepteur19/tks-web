import { expect, test } from '@playwright/test';
import { decodedMessage, plain, seedSelection, waitForIslands } from './stay.ts';

/** Page Hébergements (005, US1) : paliers par type, haut de gamme à la fin, ajout au séjour. */
const TIERS = [
  ['chambre-15000', '15 000'],
  ['studio-30000', '30 000'],
  ['appartement-35000', '35 000'],
  ['appartement-50000', '50 000'],
  ['appartement-100000', '100 000'],
  ['villa-150000', '150 000'],
] as const;

for (const [path, lang, intro, example, types] of [
  [
    '/hebergements',
    'fr',
    'Choisissez le type de logement et le budget',
    'Exemple de logement à ce budget',
    ['Chambre', 'Studio', 'Appartement', 'Villa'],
  ],
  [
    '/en/accommodation',
    'en',
    'Choose the type of accommodation and the budget',
    'Example of accommodation at this budget',
    ['Room', 'Studio', 'Apartment', 'Villa'],
  ],
] as const) {
  test.describe(`page Hébergements ${lang}`, () => {
    test('explication en tête, quatre types, six paliers, photos d’exemple', async ({ page }) => {
      await page.goto(path);
      const main = page.locator('main');
      const text = plain(await main.textContent());
      const types_ = page.getByTestId('accommodation-type');
      await expect(types_).toHaveCount(4);
      for (const [index, name] of types.entries()) {
        await expect(types_.nth(index).getByRole('heading')).toHaveText(name);
      }
      expect(text.indexOf(intro)).toBeGreaterThan(-1);
      expect(text.indexOf(intro)).toBeLessThan(text.indexOf(types[0]!));
      for (const [id] of TIERS) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
      await expect(types_.locator('[data-illustrative]')).toHaveCount(4);
      await expect(types_.locator('[data-illustrative]').first()).toHaveText(example);
    });

    test('aucun montant haut de gamme avant le dernier palier', async ({ page }) => {
      await page.goto(path);
      const text = plain(await page.locator('main').textContent());
      const lastTier = text.lastIndexOf(lang === 'fr' ? '150 000' : '150,000');
      const premium = text.indexOf(lang === 'fr' ? '300 000' : '300,000');
      expect(premium).toBeGreaterThan(lastTier);
      await expect(page.locator('[data-section="premium"]').getByRole('link')).toHaveAttribute(
        'href',
        /^https:\/\/wa\.me\//,
      );
    });

    test('promet une réservation par Kibreeze, jamais une mise en relation', async ({ page }) => {
      await page.goto(path);
      // Texte visible seulement : ni scripts, ni repli <noscript>.
      const text = plain(await page.locator('main').innerText()).toLowerCase();
      for (const word of [/propriétaire/, /mise en relation/, /\bowner/, /\bhost\b/]) {
        expect(text).not.toMatch(word);
      }
      expect(text).toContain(lang === 'fr' ? 'nous réservons' : 'we book');
    });
  });
}

test.describe('ajout au séjour', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('ajouter le studio : confirmation et compteur', async ({ page }) => {
    await page.goto('/hebergements');
    await waitForIslands(page);
    const button = page.locator('[id="studio-30000"]').getByTestId('quick-add');
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(page.getByTestId('toast')).toContainText('ajouté');
    await expect(page.getByTestId('tab-bar').getByTestId('stay-badge')).toHaveText(/^1/);
  });

  test('studio, 3 nuits : 90 000 FCFA, total estimatif, message et lien', async ({ page }) => {
    await seedSelection(page, [{ serviceId: 'studio-30000', quantities: [3] }]);
    const line = page.getByTestId('stay-line');
    expect(plain(await line.textContent())).toContain('3 nuits');
    expect(plain(await line.textContent())).toContain('90 000 FCFA');
    const total = plain(await page.locator('[data-testid="stay-total"]:visible').textContent());
    expect(total).toContain('Total estimatif');
    await expect(line.getByRole('link').first()).toHaveAttribute(
      'href',
      '/hebergements#studio-30000',
    );
    const message = decodedMessage(
      await page.locator('[data-testid="send-stay"]:visible').getAttribute('href'),
    );
    expect(message).toContain('Studio, à partir de 30 000 FCFA la nuit — 3 nuits');
  });

  test('deux budgets d’appartement donnent deux lignes', async ({ page }) => {
    await seedSelection(page, [
      { serviceId: 'appartement-35000', quantities: [2] },
      { serviceId: 'appartement-50000', quantities: [2] },
    ]);
    await expect(page.getByTestId('stay-line')).toHaveCount(2);
  });
});

test('sans JavaScript : page lisible, demande par WhatsApp pour chaque palier', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/hebergements');
  const fallback = page.locator('[id="studio-30000"]').getByRole('link', {
    name: 'Demander ce logement',
  });
  await expect(fallback).toHaveAttribute('href', /^https:\/\/wa\.me\//);
  expect(decodedMessage(await fallback.getAttribute('href'))).toContain(
    'je souhaite réserver un logement : « Studio, à partir de 30 000 FCFA la nuit »',
  );
  await context.close();
});

test('pas de défilement horizontal à 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/hebergements');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
