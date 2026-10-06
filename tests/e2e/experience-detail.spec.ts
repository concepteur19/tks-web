import { expect, test } from '@playwright/test';

const plain = (value: string | null) => (value ?? '').replace(/[\s\u202f\u00a0]+/g, ' ');

test.describe('fiche de l’excursion en pirogue', () => {
  test('présente toutes les rubriques, dans l’ordre', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const breadcrumb = page
      .getByRole('navigation', { name: 'Fil d’Ariane' })
      .or(page.getByRole('navigation', { name: "Fil d'Ariane" }));
    await expect(breadcrumb).toContainText('Nature & Découverte');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Excursion en pirogue');
    const price = plain(await page.getByTestId('price-block').textContent());
    expect(price).toContain('35 000 FCFA');
    expect(price).toContain('≈ 53,36 €');
    expect(price).toContain('Prix indicatif, sous réserve de disponibilité');
    expect(price).toContain('Jusqu’à 8 personnes'.replace('’', "'"));
    await expect(page.getByRole('heading', { name: 'Ce qui est inclus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Ce qui n'est pas inclus" })).toBeVisible();
    const options = plain(await page.getByTestId('options').textContent());
    for (const name of ['Guide touristique', 'Maître-nageur', "Musée d'art"])
      expect(options).toContain(name);
    await expect(page.getByTestId('options').locator('input')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Vous aimerez aussi' })).toBeVisible();
  });

  test('propose trois expériences, la même catégorie d’abord', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const related = page.locator('section:has(h2:text("Vous aimerez aussi")) a');
    await expect(related).toHaveCount(3);
    await expect(related.first()).toHaveAttribute('href', '/experiences/chutes-de-la-lobe');
  });

  test('galerie : compteur et vignettes qui mènent à chaque photo', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    const gallery = page.getByTestId('gallery');
    await expect(gallery.locator('[data-counter]').first()).toHaveText(/1\s*\/\s*3/);
    await expect(gallery.locator('a[href="#photo-2"]')).toHaveCount(1);
  });

  test('aucun bouton d’ajout au séjour, aucune case à cocher', async ({ page }) => {
    await page.goto('/experiences/excursion-en-pirogue');
    await expect(page.getByText(/Ajouter à mon séjour/)).toHaveCount(0);
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
  });
});

test('fiche du campement Bagyeli : trois tarifs nommés', async ({ page }) => {
  await page.goto('/experiences/campement-bagyeli');
  const price = plain(await page.getByTestId('price-block').textContent());
  expect(price).toContain('Individuel');
  expect(price).toContain('7 500 FCFA');
  expect(price).toContain('Couple');
  expect(price).toContain('20 000 FCFA');
  expect(price).toContain('Groupe');
  expect(price).toContain('Sur devis');
});

test('fiche sans durée ni inclus : aucune rubrique vide', async ({ page }) => {
  await page.goto('/experiences/kayak');
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
  for (const slug of ['excursion-en-pirogue', 'campement-bagyeli', 'bateau-de-plaisance']) {
    await page.goto(`/experiences/${slug}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, slug).toBeLessThanOrEqual(0);
  }
});
