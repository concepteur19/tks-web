import { expect, test } from '@playwright/test';

const plain = (value: string | null) => (value ?? '').replace(/[\s\u202f\u00a0]+/g, ' ');

test.describe('fiche de l’excursion en pirogue', () => {
  test('présente toutes les rubriques, dans l’ordre', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const breadcrumb = page
      .getByRole('navigation', { name: 'Fil d’Ariane' })
      .or(page.getByRole('navigation', { name: "Fil d'Ariane" }));
    await expect(breadcrumb).toContainText('Tourisme');
    await expect(breadcrumb.getByRole('link', { name: 'Activités & Loisirs' })).toHaveAttribute(
      'href',
      '/experiences/activites',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Excursion en pirogue');
    const price = plain(
      await page.getByTestId('price-block').filter({ visible: true }).textContent(),
    );
    expect(price).toContain('35 000 FCFA');
    expect(price).toContain('≈ 53,36 €');
    expect(price).toContain('Prix indicatif, sous réserve de disponibilité');
    expect(price).toContain('Jusqu’à 8 personnes'.replace('’', "'"));
    await expect(page.getByRole('heading', { name: 'Ce qui est inclus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Ce qui n'est pas inclus" })).toBeVisible();
    const options = plain(
      await page.getByTestId('options').filter({ visible: true }).textContent(),
    );
    for (const name of ['Guide touristique', 'Maître-nageur']) expect(options).toContain(name);
    await expect(
      page.getByTestId('options').filter({ visible: true }).locator('input[type="checkbox"]'),
    ).toHaveCount(2);
    await expect(page.getByRole('heading', { name: 'Vous aimerez aussi' })).toBeVisible();
  });

  test('propose trois expériences, le même univers d’abord', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const related = page.locator('section:has(h2:text("Vous aimerez aussi")) a');
    await expect(related).toHaveCount(3);
    await expect(related.first()).toHaveAttribute('href', '/experiences/quad');
  });

  test('galerie : compteur et vignettes qui mènent à chaque photo', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const gallery = page.getByTestId('gallery');
    await expect(gallery.locator('[data-counter]').first()).toHaveText(/1\s*\/\s*3/);
    await expect(gallery.locator('a[href="#photo-2"]')).toHaveCount(1);
  });

  test('propose l’ajout au séjour et une case par option (feature 004)', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    await expect(page.getByTestId('add-to-stay').first()).toBeAttached();
    await expect(
      page.getByTestId('options').filter({ visible: true }).locator('input[type="checkbox"]'),
    ).toHaveCount(2);
  });
});

test('fiche du Village Bagyeli : à partir de, minimum 2 personnes, tarif dégressif', async ({
  page,
}) => {
  await page.goto('/experiences/campement-bagyeli');
  const price = plain(
    await page.getByTestId('price-block').filter({ visible: true }).textContent(),
  );
  expect(price).toContain('À partir de 15 000 FCFA');
  expect(price).toContain('Minimum 2 personnes');
  expect(price).toContain('Tarif dégressif');
});

test('fiche des chutes : ni minimum ni mention dégressive', async ({ page }) => {
  await page.goto('/experiences/chutes-de-la-lobe');
  const block = page.getByTestId('price-block').filter({ visible: true });
  await expect(block.locator('[data-minimum]')).toHaveCount(0);
  await expect(block.locator('[data-degressive]')).toHaveCount(0);
});

test('fiche sans durée ni inclus : aucune rubrique vide', async ({ page }) => {
  await page.goto('/experiences/village-ebodje');
  await expect(page.getByRole('heading', { name: 'Ce qui est inclus' })).toHaveCount(0);
  await expect(page.locator('dl dd:empty')).toHaveCount(0);
});

test('une expérience retirée renvoie la page d’erreur', async ({ page }) => {
  const response = await page.goto('/experiences/decouverte-de-kribi');
  expect(response?.status()).toBe(404);
});

test('le sélecteur de langue et l’adresse canonique visent la fiche, pas la liste', async ({
  page,
}) => {
  await page.goto('/experiences/excursion-en-pirogue');
  await expect(page.locator('a[data-locale="en"]')).toHaveAttribute(
    'href',
    '/en/experiences/excursion-en-pirogue',
  );
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(new URL(canonical ?? '').pathname).toBe('/experiences/excursion-en-pirogue');
  const hreflangEn = await page.locator('link[hreflang="en"]').getAttribute('href');
  expect(new URL(hreflangEn ?? '').pathname).toBe('/en/experiences/excursion-en-pirogue');
  await page.goto('/en/experiences/excursion-en-pirogue');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dugout canoe trip');
});

test('pas de défilement horizontal à 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const slug of ['excursion-en-pirogue', 'campement-bagyeli', 'village-ebodje']) {
    await page.goto(`/experiences/${slug}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, slug).toBeLessThanOrEqual(0);
  }
});
