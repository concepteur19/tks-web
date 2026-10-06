import { expect, test } from '@playwright/test';
import { experiencePaths } from './delivered.ts';
import { decodedMessage, seedSelection, storedSelection, visible, waitForIslands } from './stay.ts';

const ITEMS = [
  { serviceId: 'excursion-en-pirogue', quantities: [6], optionIds: ['guide-touristique'] },
  { serviceId: 'chutes-de-la-lobe', quantities: [2] },
  { serviceId: 'jet-ski' },
];
const STAY = { dates: 'du 12 au 15 décembre', travelers: 4 };

const EXPECTED = {
  '/sejour': [
    'Bonjour Kibreeze, je souhaite organiser un séjour à Kribi.',
    'Dates : du 12 au 15 décembre',
    'Voyageurs : 4',
    '',
    '• Excursion en pirogue — 6 personnes : 40 000 FCFA',
    '  + Guide touristique : 5 000 FCFA',
    '• Chutes de la Lobé — 2 personnes : 10 000 FCFA',
    '• Jet-ski : sur devis',
    '',
    'Total indicatif : 50 000 FCFA (+ 1 prestation sur devis)',
    '',
    'Merci, à bientôt !',
  ],
  '/en/my-trip': [
    'Hello Kibreeze, I would like to organise a stay in Kribi.',
    'Dates: du 12 au 15 décembre',
    'Travellers: 4',
    '',
    '• Dugout canoe trip — 6 people: 40,000 FCFA',
    '  + Tour guide: 5,000 FCFA',
    '• Lobé Falls — 2 people: 10,000 FCFA',
    '• Jet ski: on request',
    '',
    'Indicative total: 50,000 FCFA (+ 1 service on request)',
    '',
    'Thank you, see you soon!',
  ],
} as const;

const normalize = (message: string) => message.replace(/[\u202f\u00a0]/g, ' ');

for (const [path, lines] of Object.entries(EXPECTED)) {
  test(`${path} : « Demander un devis » envoie le récapitulatif complet`, async ({ page }) => {
    await seedSelection(page, ITEMS, STAY, path);
    const send = visible(page, 'send-stay');
    await expect(send).toHaveAttribute('target', '_blank');
    await expect(send).toHaveAttribute('rel', 'noopener noreferrer');
    const href = await send.getAttribute('href');
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(normalize(decodedMessage(href)).split('\n')).toEqual(lines);
  });
}

test('avec toutes les expériences, le message tient en 1 800 caractères encodés', async ({
  page,
}) => {
  const slugs = experiencePaths()
    .filter((path) => !path.startsWith('/en/'))
    .map((path) => path.split('/').pop()!);
  expect(slugs.length).toBeGreaterThanOrEqual(13);
  await seedSelection(
    page,
    slugs.map((serviceId) => ({ serviceId })),
    { dates: 'du 12 au 15 décembre, puis du 20 au 22 décembre', travelers: 12 },
  );
  await expect(page.getByTestId('stay-line')).toHaveCount(slugs.length);
  const href = (await visible(page, 'send-stay').getAttribute('href')) ?? '';
  expect(href.split('?text=')[1]!.length).toBeLessThanOrEqual(1800);
  expect(decodedMessage(href)).toMatch(/^Total (indicatif|estimatif)/m);
});

test('« Demander ce service » reprend la configuration sans toucher à la sélection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/experiences/excursion-en-pirogue');
  await waitForIslands(page);
  const more = page
    .getByTestId('configurator')
    .getByRole('button', { name: 'Augmenter : Nombre de personnes' });
  for (let i = 0; i < 4; i += 1) await more.click();
  await page.getByLabel(/^Guide touristique/).check();
  const message = normalize(
    decodedMessage(await visible(page, 'request-service').getAttribute('href')),
  );
  expect(message).toContain('• Excursion en pirogue — 6 personnes : 40 000 FCFA');
  expect(message).toContain('+ Guide touristique : 5 000 FCFA');
  expect((await storedSelection(page))?.items ?? []).toEqual([]);
});
