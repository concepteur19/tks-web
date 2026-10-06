import { expect, test } from '@playwright/test';
import { reveal, waitForIslands } from './stay.ts';

const PAGES = ['/', '/contact', '/mentions-legales'];

for (const [label, width, container] of [
  ['l’onglet, sur téléphone', 360, 'tab-bar'],
  ['l’icône de l’en-tête, sur ordinateur', 1440, 'site-header'],
] as const) {
  test(`le compteur de ${label} affiche 2 après deux ajouts, sur toutes les pages`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/experiences');
    await waitForIslands(page);
    for (const title of ['Kayak', 'Paddle']) {
      const button = page.getByRole('button', { name: `Ajouter à mon séjour : ${title}` });
      await reveal(button);
      await button.click();
    }
    for (const path of PAGES) {
      await page.goto(path);
      await waitForIslands(page);
      const badge = page.getByTestId(container).getByTestId('stay-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('2');
    }
  });
}

test('l’apparition du compteur ne décale pas la mise en page', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'layout-shift n’est mesuré que par Chromium');
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/contact');
  await page.evaluate(() =>
    localStorage.setItem(
      'kibreeze.selection.v1',
      JSON.stringify({
        version: 1,
        items: [{ serviceId: 'kayak', quantities: [2], optionIds: [] }],
        stay: {},
        updatedAt: new Date().toISOString(),
      }),
    ),
  );
  await page.reload();
  await waitForIslands(page);
  await expect(page.getByTestId('tab-bar').getByTestId('stay-badge')).toBeVisible();
  const shift = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            total += (entry as PerformanceEntry & { value: number }).value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(total), 500);
      }),
  );
  expect(shift).toBe(0);
});
