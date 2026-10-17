import { expect, test } from '@playwright/test';
import { decodedMessage, plain, seedSelection, storedSelection, waitForIslands } from './stay.ts';

/** Page Mobilité TKS® (006) : section secondaire, location de véhicules, services sur devis. */
for (const [path, lang, title, tagline, brand, categories, perDay, custom] of [
  [
    '/mobilite',
    'fr',
    'Mobilité & transport',
    'Location, transferts et chauffeur privé pour compléter votre séjour',
    'TKS® est la marque de mobilité de Breezy Groupe, aux côtés de Kibreeze.',
    [
      ['vehicule-luxe', 'Luxe', 'Toyota Land Cruiser Prado TXL', '100 000'],
      ['vehicule-premium', 'Premium', 'Toyota RAV4', '35 000'],
      ['vehicule-yaris', 'Yaris', 'Toyota Yaris', '25 000'],
    ],
    '/ jour',
    "Besoin d'un transport sur mesure ?",
  ],
  [
    '/en/mobility',
    'en',
    'Mobility & transport',
    'Car hire, transfers and private driver to complete your trip',
    "TKS® is Breezy Groupe's mobility brand, alongside Kibreeze.",
    [
      ['vehicule-luxe', 'Luxury', 'Toyota Land Cruiser Prado TXL', '100,000'],
      ['vehicule-premium', 'Premium', 'Toyota RAV4', '35,000'],
      ['vehicule-yaris', 'Yaris', 'Toyota Yaris', '25,000'],
    ],
    '/ day',
    'Need tailored transport?',
  ],
] as const) {
  test.describe(`page Mobilité ${lang}`, () => {
    test('en-tête TKS® sobre, Kibreeze reste la marque du site', async ({ page }) => {
      await page.goto(path);
      const main = page.locator('main');
      await expect(main.getByRole('heading', { level: 1 })).toHaveText(title);
      const text = plain(await main.textContent());
      expect(text).toContain(tagline);
      expect(text).toContain(brand);
      await expect(main.getByRole('img', { name: 'TKS®' })).toHaveCount(1);
      const header = page.getByTestId('site-header');
      await expect(header.getByRole('img', { name: 'Kibreeze' }).first()).toBeVisible();
      await expect(header.getByRole('img', { name: 'TKS®' })).toHaveCount(0);
      // Section secondaire : petites photos seulement (FR-002).
      const width = page.viewportSize()!.width;
      for (const image of await main.locator('img').all()) {
        const box = await image.boundingBox();
        if (box) expect(box.width).toBeLessThanOrEqual(width / 2);
      }
    });

    test('trois catégories dans l’ordre, avec modèles et prix de départ par jour', async ({
      page,
    }) => {
      await page.goto(path);
      const rows = page.getByTestId('vehicle-category');
      await expect(rows).toHaveCount(3);
      for (const [index, [id, name, model, amount]] of categories.entries()) {
        const row = rows.nth(index);
        await expect(row).toHaveAttribute('id', id);
        await expect(row.getByRole('heading')).toHaveText(name);
        const text = plain(await row.textContent());
        expect(text).toContain(model);
        expect(text).toContain(amount);
        expect(text).toContain(perDay);
        await expect(row.locator('img')).toHaveCount(1);
      }
    });

    test('encadré sur mesure en fin de page, sans carburant, caution ni permis', async ({
      page,
    }) => {
      await page.goto(path);
      const box = page.locator('[data-section="custom"]');
      await expect(box.getByRole('heading')).toHaveText(custom);
      await expect(box.getByRole('link')).toHaveAttribute('href', /^https:\/\/wa\.me\//);
      const text = plain(await page.locator('main').textContent());
      expect(text.indexOf(custom)).toBeGreaterThan(text.lastIndexOf(categories[2][3]));
      const visible = plain(await page.locator('main').innerText()).toLowerCase();
      for (const word of [
        /carburant/,
        /caution/,
        /\bpermis\b/,
        /\bfuel\b/,
        /deposit/,
        /licen[cs]e/,
      ]) {
        expect(visible).not.toMatch(word);
      }
    });
  });
}

test.describe('location de véhicules', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('Premium, 1 véhicule et 4 jours : ajout, ligne à 140 000 FCFA, message', async ({
    page,
  }) => {
    await page.goto('/mobilite');
    await waitForIslands(page);
    const row = page.locator('[id="vehicule-premium"]');
    const moreDays = row.getByRole('button', { name: 'Augmenter : Nombre de jours' });
    await moreDays.scrollIntoViewIfNeeded();
    for (let i = 0; i < 3; i += 1) await moreDays.click();
    await row.getByRole('button', { name: 'Ajouter à mon séjour : Premium' }).click();
    await expect(page.getByTestId('toast')).toContainText('ajouté');
    await expect(page.getByTestId('tab-bar').getByTestId('stay-badge')).toHaveText(/^1/);

    await page.goto('/sejour');
    const line = page.getByTestId('stay-line');
    await expect(line).toHaveCount(1);
    expect(plain(await line.textContent())).toContain('1 véhicule × 4 jours');
    expect(plain(await line.textContent())).toContain('Premium');
    expect(plain(await line.textContent())).toContain('140 000 FCFA');
    const total = plain(await page.locator('[data-testid="stay-total"]:visible').textContent());
    expect(total).toContain('Total estimatif');
    await expect(line.getByRole('link').first()).toHaveAttribute(
      'href',
      '/mobilite#vehicule-premium',
    );
    const message = plain(
      decodedMessage(await page.locator('[data-testid="send-stay"]:visible').getAttribute('href')),
    );
    expect(message).toContain('Premium — 1 véhicule × 4 jours : 140 000 FCFA');
  });

  test('Yaris, 2 véhicules et 3 jours : 150 000 FCFA', async ({ page }) => {
    await seedSelection(page, [{ serviceId: 'vehicule-yaris', quantities: [2, 3] }]);
    expect(plain(await page.getByTestId('stay-line').textContent())).toContain('150 000 FCFA');
  });

  test('Premium ajouté deux fois : une seule ligne, véhicules additionnés', async ({ page }) => {
    await page.goto('/mobilite');
    await waitForIslands(page);
    const add = page
      .locator('[id="vehicule-premium"]')
      .getByRole('button', { name: 'Ajouter à mon séjour : Premium' });
    await add.scrollIntoViewIfNeeded();
    await add.click();
    await add.click();
    await expect
      .poll(async () => (await storedSelection(page))?.items)
      .toEqual([{ serviceId: 'vehicule-premium', quantities: [2, 1], optionIds: [] }]);
  });
});

test.describe('transport sur devis (US2)', () => {
  for (const [path, title, names, quote] of [
    [
      '/mobilite',
      'Transport sur devis',
      ['Location avec chauffeur', 'Transferts', 'Chauffeur privé', 'Prestations professionnelles'],
      'Sur devis',
    ],
    [
      '/en/mobility',
      'Transport on request',
      ['Car hire with driver', 'Transfers', 'Private driver', 'Business services'],
      'On request',
    ],
  ] as const) {
    test(`quatre services après les véhicules (${path})`, async ({ page }) => {
      await page.goto(path);
      const services = page.getByTestId('mobility-service');
      await expect(services).toHaveCount(4);
      for (const [index, name] of names.entries()) {
        const row = services.nth(index);
        await expect(row.getByRole('heading')).toHaveText(name);
        await expect(row.locator('img')).toHaveCount(1);
        expect(plain(await row.textContent())).toContain(quote);
      }
      const text = plain(await page.locator('main').textContent());
      expect(text.indexOf(title)).toBeGreaterThan(text.lastIndexOf('Yaris'));
      expect(text.indexOf(title)).toBeLessThan(
        text.indexOf(path === '/mobilite' ? "Besoin d'un transport" : 'Need tailored transport'),
      );
    });
  }

  test('Transferts : ligne sur devis hors du total, puis « Déjà dans mon séjour »', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/mobilite');
    await waitForIslands(page);
    const premium = page
      .locator('[id="vehicule-premium"]')
      .getByRole('button', { name: 'Ajouter à mon séjour : Premium' });
    await premium.scrollIntoViewIfNeeded();
    await premium.click();
    const button = page.locator('[id="transferts"]').getByTestId('quick-add');
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(button).toHaveText('Déjà dans mon séjour');
    await page.goto('/sejour');
    const line = page.getByTestId('stay-line').filter({ hasText: 'Transferts' });
    expect(plain(await line.textContent())).toContain('Sur devis');
    const total = plain(await page.locator('[data-testid="stay-total"]:visible').textContent());
    expect(total).toContain('35 000 FCFA');
    expect(total).toContain('1 prestation sur devis');
  });

  test('le message nomme chaque prestation de mobilité avec ses quantités', async ({ page }) => {
    await seedSelection(page, [
      { serviceId: 'vehicule-premium', quantities: [1, 4] },
      { serviceId: 'transferts', quantities: [] },
      { serviceId: 'chauffeur-prive', quantities: [4] },
    ]);
    const message = plain(
      decodedMessage(await page.locator('[data-testid="send-stay"]:visible').getAttribute('href')),
    );
    expect(message).toContain('Premium — 1 véhicule × 4 jours : 140 000 FCFA');
    expect(message).toContain('Transferts : sur devis');
    expect(message).toContain('Chauffeur privé — 4 heures : sur devis');
  });

  test('sans JavaScript : chaque service offre une demande WhatsApp qui le nomme', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/mobilite');
    for (const [id, name] of [
      ['location-avec-chauffeur', 'Location avec chauffeur'],
      ['transferts', 'Transferts'],
      ['chauffeur-prive', 'Chauffeur privé'],
      ['prestations-professionnelles', 'Prestations professionnelles'],
    ]) {
      const fallback = page.locator(`[id="${id}"]`).getByRole('link', {
        name: 'Demander ce service',
      });
      expect(decodedMessage(await fallback.getAttribute('href'))).toContain(`« ${name} »`);
    }
    await context.close();
  });
});

test('sans JavaScript : chaque catégorie offre une demande WhatsApp qui la nomme', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/mobilite');
  for (const [id, name] of [
    ['vehicule-luxe', 'Luxe'],
    ['vehicule-premium', 'Premium'],
    ['vehicule-yaris', 'Yaris'],
  ]) {
    const fallback = page.locator(`[id="${id}"]`).getByRole('link', {
      name: 'Demander ce service',
    });
    await expect(fallback).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    expect(decodedMessage(await fallback.getAttribute('href'))).toContain(`« ${name} »`);
  }
  await context.close();
});

test('pas de défilement horizontal à 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/mobilite');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test.describe('accès à la page (US3)', () => {
  test('ordinateur : l’entrée Mobilité TKS® de la navigation mène à la page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto('/');
    await page.getByTestId('site-header').getByRole('link', { name: 'Mobilité TKS®' }).click();
    await expect(page).toHaveURL(/\/mobilite$/);
    await expect(page.locator('main h1')).toHaveText('Mobilité & transport');
  });

  test('téléphone : cinq onglets, sans Mobilité', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/mobilite');
    const tabs = page.getByTestId('tab-bar').getByRole('link');
    await expect(tabs).toHaveCount(5);
    await expect(tabs.filter({ hasText: /Mobilité/ })).toHaveCount(0);
  });
});
