import { expect, test } from '@playwright/test';
import { decodedMessage, plain, reveal, storedSelection, waitForIslands } from './stay.ts';

/** Fiches de parcours (010, US2). Durées et étapes : specs/010-retours-franck/data-model.md. */
const TOURS = [
  ['essentiel-de-kribi', 'Une journée'],
  ['nature-et-littoral', 'Une journée'],
  ['culture-et-patrimoine', 'Une demi-journée'],
  ['kribi-et-ebodje', 'Une journée complète'],
  ['kribi-authentique', 'Une demi-journée ou une journée complète'],
  ['au-fil-de-l-eau', null],
] as const;

test('chaque carte de la page Formules mène à sa fiche, en français et en anglais', async ({
  page,
}) => {
  for (const [list, prefix] of [
    ['/formules', '/formules/'],
    ['/en/packages', '/en/packages/'],
  ] as const) {
    await page.goto(list);
    const links = page.getByTestId('tour-link');
    await expect(links).toHaveCount(6 * 2);
    for (const [id] of TOURS) {
      await expect(page.locator(`[data-testid="tour-link"][href="${prefix}${id}"]`)).toHaveCount(2);
    }
  }
});

for (const [id, duration] of TOURS) {
  test(`fiche ${id} : contenu, tarif, durée, mentions`, async ({ page }) => {
    await page.goto(`/formules/${id}`);
    await expect(page.locator('h1')).not.toBeEmpty();
    await expect(page.getByTestId('tour-steps').locator('li')).not.toHaveCount(0);
    const text = plain(await page.locator('main').textContent());
    expect(text).toMatch(/À partir de .* FCFA \/ personne|Sur devis/);
    expect(text).toContain(
      'Prix indicatif, sous réserve de disponibilité et de confirmation par KIBREEZE.',
    );
    expect(text).toContain('Le prix final dépend du nombre de participants');
    if (duration) expect(text).toContain(duration);
    else await expect(page.getByTestId('tour-duration')).toHaveCount(0);
  });
}

test('étapes précisées : Mayi détaillé, fleuve Lobé inclus dans Bagyeli', async ({ page }) => {
  await page.goto('/formules/culture-et-patrimoine');
  await expect(page.getByTestId('tour-steps')).toContainText(
    'Village Mayi (ponts de l’Esclavage et des Enclaves, phare et monument)',
  );
  await page.goto('/formules/nature-et-littoral');
  await expect(page.getByTestId('tour-steps')).toContainText(
    'Fleuve Lobé (inclus dans l’expérience Bagyeli)',
  );
});

test('ajouter pour 4, puis personnaliser sur WhatsApp', async ({ page }) => {
  await page.goto('/formules/essentiel-de-kribi');
  await waitForIslands(page);
  const actions = page.getByTestId('tour-actions');
  await reveal(actions);
  const more = actions.getByRole('button', { name: 'Augmenter : Nombre de personnes' });
  await more.click();
  await more.click();
  await actions.getByRole('button', { name: /^Ajouter à mon séjour/ }).click();
  await expect
    .poll(async () => (await storedSelection(page))?.items)
    .toEqual([{ serviceId: 'essentiel-de-kribi', quantities: [4], optionIds: [] }]);
  const message = decodedMessage(
    await actions.getByRole('link', { name: 'Personnaliser ce parcours' }).getAttribute('href'),
  );
  expect(message).toContain('« L’Essentiel de Kribi »'.replace('’', "'"));
  expect(message).toContain('pour 4 personnes');
  expect(message).toMatch(/\/formules\/essentiel-de-kribi$/);
  await page.goto('/sejour');
  await expect(page.getByTestId('stay-line').getByRole('link').first()).toHaveAttribute(
    'href',
    '/formules/essentiel-de-kribi',
  );
});

test('sans JavaScript : la fiche reste lisible, avec le lien WhatsApp', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en/packages/essentiel-de-kribi');
  await expect(page.locator('h1')).toHaveText('The Essence of Kribi');
  await expect(
    page
      .getByRole('link', { name: 'Personnaliser ce parcours' })
      .or(page.getByRole('link', { name: /customise/i })),
  ).toHaveAttribute('href', /^https:\/\/wa\.me\//);
  await context.close();
});
