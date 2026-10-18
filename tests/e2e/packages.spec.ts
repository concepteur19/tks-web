import { expect, test } from '@playwright/test';
import { decodedMessage, plain, seedSelection, waitForIslands } from './stay.ts';

/** Page Formules (005) : parcours de visite (US2), puis formules d'activités (US3). */
test.describe('parcours de visite', () => {
  test('la page Tourisme mène aux parcours', async ({ page }) => {
    await page.goto('/experiences');
    await page.getByTestId('tours-entry').click();
    await expect(page).toHaveURL(/\/formules#parcours$/);
  });

  for (const [path, lang, from, minimum, quote, note] of [
    [
      '/formules',
      'fr',
      'À partir de 30 000 FCFA',
      'Minimum 2 personnes',
      'Sur devis',
      'Prix de départ par personne',
    ],
    [
      '/en/packages',
      'en',
      'From 30,000 FCFA',
      'Minimum 2 people',
      'On request',
      'Starting price per person',
    ],
  ] as const) {
    test(`six parcours, étapes, prix et mentions (${lang})`, async ({ page }) => {
      await page.goto(path);
      const cards = page.getByTestId('tour-card');
      await expect(cards).toHaveCount(6);
      const essentiel = page.locator('[id="essentiel-de-kribi"]');
      const text = plain(await essentiel.textContent());
      expect(text).toContain(from);
      expect(text).toContain(minimum);
      expect(text).toContain(note);
      await expect(essentiel.locator('[data-degressive]')).toHaveCount(1);
      await expect(essentiel.locator('ol li')).toHaveCount(4);
      await expect(essentiel.locator('ol li a')).toHaveCount(4);
      for (const id of ['kribi-et-ebodje', 'au-fil-de-l-eau']) {
        const card = page.locator(`[id="${id}"]`);
        expect(plain(await card.textContent())).toContain(quote);
        expect(plain(await card.textContent())).not.toContain(note);
        await expect(card.getByTestId('line-customizer')).toHaveCount(1);
      }
      // « Fleuve Lobé » n'a pas de fiche : texte sans lien.
      const nature = page.locator('[id="nature-et-littoral"] ol li');
      await expect(nature).toHaveCount(4);
      await expect(nature.nth(1).locator('a')).toHaveCount(0);
    });
  }

  test('ajouter L’Essentiel pour 4 depuis sa carte : une ligne, 120 000 FCFA, total estimatif', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/formules');
    await waitForIslands(page);
    const card = page.locator('[id="essentiel-de-kribi"]');
    await card.scrollIntoViewIfNeeded();
    await expect(
      card.getByTestId('line-customizer').locator('xpath=ancestor::astro-island[1]'),
    ).not.toHaveAttribute('ssr', /.*/);
    const more = card.getByRole('button', { name: 'Augmenter : Nombre de personnes' });
    await more.click();
    await more.click();
    // « Personnaliser ce parcours » est désormais réservé à WhatsApp, sur la fiche (010).
    await card.getByRole('button', { name: /^Ajouter à mon séjour/ }).click();
    await expect(page.getByTestId('toast')).toContainText('ajouté');
    await page.goto('/sejour');
    const line = page.getByTestId('stay-line');
    await expect(line).toHaveCount(1);
    expect(plain(await line.textContent())).toContain('4 personnes');
    expect(plain(await line.textContent())).toContain('120 000 FCFA');
    expect(plain(await page.locator('[data-testid="stay-total"]:visible').textContent())).toContain(
      'Total estimatif',
    );
  });

  test('Kribi & Ebodjé pour 3 : ligne sur devis', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await seedSelection(page, [{ serviceId: 'kribi-et-ebodje', quantities: [3] }]);
    await expect(page.getByTestId('stay-line')).toContainText('Sur devis');
  });

  test('sans JavaScript, chaque parcours se demande sur WhatsApp', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/formules');
    const link = page
      .locator('[id="essentiel-de-kribi"]')
      .getByRole('link', { name: 'Demander sur WhatsApp' });
    await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    expect(decodedMessage(await link.getAttribute('href'))).toContain("L'Essentiel de Kribi");
    await context.close();
  });

  test('pas de défilement horizontal à 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/formules');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});

test.describe('formules d’activités', () => {
  test('après les parcours : base de 2 personnes, quatre formules, badge, groupes', async ({
    page,
  }) => {
    await page.goto('/formules');
    const text = plain(await page.locator('main').innerText());
    expect(text.indexOf('Parcours de visite')).toBeLessThan(text.indexOf("Formules d'activités"));
    expect(text).toContain('Tous nos forfaits sont calculés sur une base de 2 personnes.');
    const cards = page.getByTestId('package-card');
    await expect(cards).toHaveCount(4);
    const evasion = page.locator('[id="formule-evasion"]');
    expect(plain(await evasion.textContent())).toContain('120 000 FCFA / 2 personnes');
    await expect(evasion.locator('ul a')).toHaveCount(5);
    await expect(page.locator('[id="formule-premium"]')).toContainText('Le plus complet');
    await expect(page.locator('[data-section="groups"]').getByRole('link')).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\//,
    );
  });

  test('ajouter Évasion : une ligne, puis « Déjà dans mon séjour »', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/formules');
    await waitForIslands(page);
    const button = page.locator('[id="formule-evasion"]').getByTestId('quick-add');
    await button.scrollIntoViewIfNeeded();
    await expect(button.locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute(
      'ssr',
      /.*/,
    );
    await expect(button).toHaveText('Ajouter à mon séjour');
    await button.click();
    await expect(button).toHaveText('Déjà dans mon séjour');
    await page.goto('/sejour');
    const line = page.getByTestId('stay-line');
    await expect(line).toHaveCount(1);
    expect(plain(await line.textContent())).toContain('120 000 FCFA');
  });

  test('séjour logement + parcours + formule + expérience : message complet', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await seedSelection(page, [
      { serviceId: 'studio-30000', quantities: [3] },
      { serviceId: 'essentiel-de-kribi', quantities: [4] },
      { serviceId: 'formule-evasion', quantities: [] },
      { serviceId: 'kayak', quantities: [2] },
    ]);
    await expect(page.getByTestId('stay-line')).toHaveCount(4);
    const message = decodedMessage(
      await page.locator('[data-testid="send-stay"]:visible').getAttribute('href'),
    );
    expect(message).toContain('Studio, à partir de 30 000 FCFA la nuit — 3 nuits');
    expect(message).toContain("L'Essentiel de Kribi — 4 personnes");
    expect(message).toContain('Formule Évasion');
    expect(message).toContain('Kayak — 2 personnes');
  });

  test('l’accueil affiche les prix des formules, tirés des formules', async ({ page }) => {
    await page.goto('/');
    const teaser = plain(await page.locator('[data-section="packages"]').textContent());
    expect(teaser).toContain('100 000 FCFA');
    expect(teaser).toContain('150 000 FCFA');
  });
});
