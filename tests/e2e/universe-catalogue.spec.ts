import { expect, test, type Page } from '@playwright/test';
import { decodedMessage, plain, seedSelection } from './stay.ts';

/** Catalogue du cahier actualisé (008, US2) : contenu, photos, options, retraits. */
const cards = (page: Page) => page.getByTestId('experience-card');

test('chaque univers publie les prestations du cahier', async ({ page }) => {
  for (const [path, count] of [
    ['/experiences/visites', 9],
    ['/experiences/activites', 13],
    ['/experiences/specialites-culinaires', 10],
  ] as const) {
    await page.goto(path);
    await expect(cards(page), path).toHaveCount(count);
  }
});

test('la fiche du Village Mayi cite les lieux qu’elle comprend', async ({ page }) => {
  await page.goto('/experiences/village-mayi');
  const included = page.locator('section:has(h2:text("Ce qui est inclus"))');
  for (const place of ['pont de l’Esclavage', 'pont des Enclaves', 'phare', 'monument']) {
    await expect(included).toContainText(new RegExp(place.replace('’', "['’]"), 'i'));
  }
});

test('jet-ski : 10 000 FCFA la session, une personne par engin', async ({ page }) => {
  await page.goto('/experiences/jet-ski');
  const price = plain(
    await page.getByTestId('price-block').filter({ visible: true }).textContent(),
  );
  expect(price).toContain('10 000 FCFA');
  await expect(page.locator('main')).toContainText('Une personne par engin');
});

test('spécialités culinaires : sur devis, sans montant ni option, photo illustrative', async ({
  page,
}) => {
  await page.goto('/experiences/specialites-culinaires');
  const all = cards(page);
  for (let index = 0; index < (await all.count()); index += 1) {
    const text = plain(await all.nth(index).textContent());
    expect(text).not.toMatch(/FCFA|€/);
    expect(text).toContain('Photo illustrative');
  }
  await page.goto('/experiences/langouste');
  await expect(page.getByTestId('options')).toHaveCount(0);
  await expect(page.getByTestId('gallery')).toContainText('Photo illustrative');
});

test('le bateau de croisière porte l’étiquette « Photo illustrative »', async ({ page }) => {
  await page.goto('/experiences/activites');
  await expect(cards(page).filter({ hasText: 'Bateau de croisière' })).toContainText(
    'Photo illustrative',
  );
});

test('la pirogue propose le guide et le maître-nageur, plus le musée', async ({ page }) => {
  await page.goto('/experiences/excursion-en-pirogue');
  const options = page.getByTestId('options').filter({ visible: true });
  await expect(options).toContainText('Guide touristique');
  await expect(options).toContainText('Maître-nageur');
  await expect(options).not.toContainText('Musée');
});

test('aucune fiche n’affiche une rubrique réduite à « à confirmer »', async ({ page }) => {
  for (const slug of ['quad', 'jacuzzi-naturel', 'village-ebodje', 'langouste', 'seance-photo']) {
    await page.goto(`/experiences/${slug}`);
    await expect(page.locator('main'), slug).not.toContainText(
      /(Lieu de départ|Point de départ|Embarcadère|Site|Plage|Lieu|Restaurant partenaire) à confirmer/,
    );
  }
});

test.describe('Mon séjour', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('feu de plage au-delà de 10 personnes : sur devis', async ({ page }) => {
    await seedSelection(page, [{ serviceId: 'feu-de-plage', quantities: [12] }]);
    await expect(page.getByTestId('stay-line')).toContainText('Sur devis');
  });

  test('bateau de croisière, 2 heures : 300 000 FCFA', async ({ page }) => {
    await seedSelection(page, [{ serviceId: 'croisiere-en-haute-mer', quantities: [2] }]);
    expect(plain(await page.getByTestId('stay-line').textContent())).toContain('300 000 FCFA');
  });

  test('un séjour qui mélange les trois univers', async ({ page }) => {
    await seedSelection(page, [
      { serviceId: 'village-mayi', quantities: [2] },
      { serviceId: 'quad', quantities: [1] },
      { serviceId: 'langouste', quantities: [4] },
    ]);
    await expect(page.getByTestId('stay-line')).toHaveCount(3);
    const total = plain(await page.locator('[data-testid="stay-total"]:visible').textContent());
    expect(total).toContain('20 000 FCFA');
    expect(total).toContain('+ 1 prestation sur devis');
    const message = decodedMessage(
      await page.locator('[data-testid="send-stay"]:visible').getAttribute('href'),
    );
    for (const name of ['Village Mayi', 'Quad', 'Langouste']) expect(message).toContain(name);
  });

  test('une croisière ou une option musée enregistrées sont retirées, avec un message', async ({
    page,
  }) => {
    await seedSelection(page, [
      { serviceId: 'croisiere-en-bateau', quantities: [2] },
      { serviceId: 'excursion-en-pirogue', quantities: [4], optionIds: ['musee-d-art'] },
    ]);
    await expect(page.getByTestId('stay-line')).toHaveCount(1);
    await expect(page.getByTestId('stay-line')).not.toContainText('Musée');
    await expect(page.getByTestId('toast')).toContainText('ne sont plus proposées');
  });
});

test('l’accueil met en avant quatre expériences, dont le jet-ski', async ({ page }) => {
  await page.goto('/');
  const featured = page.locator('[data-section="featured"] a[href^="/experiences/"]');
  await expect(featured.filter({ hasText: 'Jet-ski' }).first()).toBeVisible();
  const hrefs = new Set(
    await featured.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))),
  );
  expect(hrefs.size).toBe(4);
});
