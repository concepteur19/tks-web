import { expect, test } from '@playwright/test';

test('sur téléphone, la barre de demande est au-dessus des onglets, sans bouton flottant', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/experiences/excursion-en-pirogue');
  const bar = await page.getByTestId('request-bar').boundingBox();
  const tabs = await page.getByTestId('tab-bar').boundingBox();
  expect(Math.round(bar!.y + bar!.height)).toBeLessThanOrEqual(Math.round(tabs!.y));
  await expect(page.getByTestId('whatsapp-button')).toHaveCount(0);
});

for (const [path, expected] of [
  [
    '/experiences/excursion-en-pirogue',
    'Bonjour Kibreeze, je souhaite des informations sur l’expérience « Excursion en pirogue » : ',
  ],
  [
    '/en/experiences/excursion-en-pirogue',
    'Hello Kibreeze, I would like some information about the “Dugout canoe trip” experience: ',
  ],
] as const) {
  test(`${path} : le message nomme l’expérience et donne l’adresse de la fiche`, async ({
    page,
  }) => {
    await page.goto(path);
    const link = page.getByTestId('request-bar').getByTestId('request-service');
    const href = (await link.getAttribute('href')) ?? '';
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    const message = decodeURIComponent(href.split('?text=')[1] ?? '');
    expect(message.startsWith(expected)).toBe(true);
    expect(message.endsWith(path)).toBe(true);
    await expect(link).toHaveAttribute('target', '_blank');
  });
}

test('une expérience sur devis affiche le badge à la place du prix', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/experiences/bateau-de-plaisance');
  await expect(page.getByTestId('request-bar')).toContainText('Sur devis');
});

test('sur ordinateur, la carte de demande reste visible au défilement', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/experiences/excursion-en-pirogue');
  await expect(page.getByTestId('request-bar')).toBeHidden();
  await page.evaluate(() => window.scrollBy(0, 1500));
  await expect(page.getByTestId('request-card')).toBeInViewport();
});
