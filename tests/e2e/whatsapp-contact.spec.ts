import { expect, test } from '@playwright/test';

const MESSAGES = {
  fr: 'Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi.',
  en: 'Hello Kibreeze, I would like some information about your experiences in Kribi.',
};

const PAGES = [
  ['/', 'fr'],
  ['/contact', 'fr'],
  ['/cette-page-nexiste-pas', 'fr'],
  ['/en/', 'en'],
  ['/en/contact', 'en'],
  ['/en/404', 'en'],
] as const;

for (const [path, lang] of PAGES) {
  test(`${path} : le bouton flottant ouvre WhatsApp avec le message ${lang}`, async ({ page }) => {
    await page.goto(path);
    const button = page.getByTestId('whatsapp-button');
    const href = (await button.getAttribute('href')) ?? '';
    expect(href).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=/);
    expect(decodeURIComponent(href.split('?text=')[1] ?? '')).toBe(MESSAGES[lang]);
    await expect(button).toHaveAttribute('target', '_blank');
    await expect(button).toHaveAccessibleName(/WhatsApp/);
  });
}

test('sur téléphone, le bouton flottant reste au-dessus de la barre à onglets', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/contact');
  const button = await page.getByTestId('whatsapp-button').boundingBox();
  const tabBar = await page.getByTestId('tab-bar').boundingBox();
  expect(button!.y + button!.height).toBeLessThanOrEqual(tabBar!.y - 16);
});

for (const [path, locality, aboutStart] of [
  ['/contact', 'Kribi, Cameroun', 'Nous sommes Kibreeze'],
  ['/en/contact', 'Kribi, Cameroon', 'We are Kibreeze'],
] as const) {
  test(`${path} : coordonnées et présentation, sans formulaire ni horaires`, async ({ page }) => {
    await page.goto(path);
    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: '+237 697 13 53 88' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/237697135388/,
    );
    await expect(main.getByText(locality)).toBeVisible();
    const about = page.locator('#a-propos');
    await expect(about).toContainText(aboutStart);
    await expect(about).toContainText(/vous venez la vivre|you come to live it/);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(main.getByText(/horaires|opening hours|lundi|monday/i)).toHaveCount(0);
    // Aucune coordonnée n'est encore fournie au-delà du numéro : ni e-mail, ni réseau social.
    await expect(main.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('a[href*="facebook.com"], a[href*="instagram.com"]')).toHaveCount(0);
  });
}

test('« En savoir plus » de l’accueil mène à la présentation de la page Contact', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'En savoir plus sur Kibreeze' }).click();
  await expect(page).toHaveURL(/\/contact#a-propos$/);
});
