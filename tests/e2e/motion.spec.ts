import { expect, test, type Page } from '@playwright/test';
import { deliveredPaths } from './delivered.ts';
import { reveal, seedSelection, waitForIslands } from './stay.ts';

/** Micro-interactions (009, US2) : transitions, apparitions, retours d'ajout, réduire les animations. */

const transitionNames = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .map((element) => getComputedStyle(element).viewTransitionName)
      .filter((name) => name && name !== 'none'),
  );

const pendingInView = (page: Page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal-pending]')].filter(
        (element) => element.getBoundingClientRect().top < window.innerHeight,
      ).length,
  );

test.describe('transitions entre pages', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'propriétés lues sur Chromium');

  test('la feuille de style déclare la transition entre documents', async ({ page }) => {
    await page.goto('/');
    const declared = await page.evaluate(() =>
      [...document.styleSheets].some((sheet) =>
        [...sheet.cssRules].some((rule) => rule.cssText.includes('@view-transition')),
      ),
    );
    expect(declared).toBe(true);
  });

  test('aucun nom de transition en double sur une page livrée', async ({ page }) => {
    for (const path of deliveredPaths()) {
      await page.goto(path);
      const names = await transitionNames(page);
      expect(new Set(names).size, path).toBe(names.length);
    }
  });

  test('la photo d’une carte porte le même nom que la photo principale de sa fiche', async ({
    page,
  }) => {
    for (const [from, scope] of [
      ['/experiences/visites', '[data-section="universe"]'],
      ['/', '[data-section="featured"]'],
      ['/experiences/excursion-en-pirogue', '[data-section="related"]'],
    ] as const) {
      await page.goto(from);
      const name = await page
        .locator(`${scope} img`)
        .first()
        .evaluate((image) => getComputedStyle(image).viewTransitionName);
      expect(name, from).toMatch(/^exp-/);
      await page.goto(`/experiences/${name.slice('exp-'.length)}`);
      const hero = await page
        .getByTestId('gallery')
        .locator('img')
        .first()
        .evaluate((image) => getComputedStyle(image).viewTransitionName);
      expect(hero, from).toBe(name);
    }
  });

  test('l’onglet actif porte le trait qui glisse', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/hebergements');
    expect(await transitionNames(page)).toContain('tab-indicator');
    await page.setViewportSize({ width: 1440, height: 1024 });
    expect(await transitionNames(page)).toContain('nav-indicator');
  });
});

test.describe('apparition au défilement', () => {
  test('rien n’est masqué dans le premier écran, la suite apparaît en défilant', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForIslands(page);
    expect(await pendingInView(page)).toBe(0);
    expect(await page.locator('[data-reveal-pending]').count()).toBeGreaterThan(0);
    await page.locator('[data-section="how-it-works"]').scrollIntoViewIfNeeded();
    await expect.poll(() => pendingInView(page)).toBe(0);
  });

  test('un défilement d’un coup jusqu’en bas ne laisse rien d’invisible', async ({ page }) => {
    await page.goto('/');
    await waitForIslands(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    expect(await pendingInView(page)).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    expect(await page.locator('[data-reveal-pending]').count()).toBe(0);
  });

  test('défilement doux vers les ancres', async ({ page }) => {
    await page.goto('/formules');
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe('smooth');
  });
});

test.describe('réduire les animations', () => {
  test.use({ reducedMotion: 'reduce' });

  test('aucun élément en attente, aucune animation en cours, défilement immédiat', async ({
    page,
  }) => {
    await page.goto('/');
    await waitForIslands(page);
    expect(await page.locator('[data-reveal-pending], [data-fade-pending]').count()).toBe(0);
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe('auto');

    await page.goto('/hebergements');
    await waitForIslands(page);
    const button = page.locator('[id="studio-30000"]').getByTestId('quick-add');
    await reveal(button);
    await button.click();
    // Animations à keyframes seulement : la règle globale ramène les transitions à 0,01 ms, ce
    // qui n'est pas un mouvement visible mais peut être compté « en cours » à l'instant du clic.
    const running = () =>
      page.evaluate(
        () =>
          new Promise<number>((resolve) =>
            requestAnimationFrame(() =>
              resolve(
                document
                  .getAnimations()
                  .filter((animation) => animation instanceof CSSAnimation)
                  .filter((animation) => animation.playState === 'running').length,
              ),
            ),
          ),
      );
    expect(await running()).toBe(0);

    await page.goto('/sejour');
    await page.getByRole('button', { name: /^Retirer / }).click();
    await expect(page.getByTestId('stay-line')).toHaveCount(0);
    expect(await running()).toBe(0);
  });
});

test('sans JavaScript, tout ce qui apparaît au défilement est visible', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (element) => getComputedStyle(element).opacity !== '1',
      ).length,
  );
  expect(await page.locator('[data-reveal]').count()).toBeGreaterThan(0);
  expect(hidden).toBe(0);
  await context.close();
});

test('à l’ajout : vibration de 15 ms, une seule fois', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: number[] = [];
    (window as unknown as { vibrations: number[] }).vibrations = calls;
    Object.defineProperty(navigator, 'vibrate', {
      value: (ms: number) => (calls.push(ms), true),
      configurable: true,
    });
  });
  await page.goto('/hebergements');
  await waitForIslands(page);
  const button = page.locator('[id="studio-30000"]').getByTestId('quick-add');
  await reveal(button);
  await button.click();
  await expect(page.getByTestId('toast')).toContainText('ajouté');
  expect(
    await page.evaluate(() => (window as unknown as { vibrations: number[] }).vibrations),
  ).toEqual([15]);
});

test('Mon séjour : une ligne retirée se replie puis disparaît', async ({ page }) => {
  await seedSelection(page, [
    { serviceId: 'quad', quantities: [1] },
    { serviceId: 'jet-ski', quantities: [] },
  ]);
  await page.getByRole('button', { name: 'Retirer Quad de mon séjour' }).click();
  await expect(page.getByTestId('stay-line')).toHaveCount(1);
});

test.describe('préchargement et partage (US3)', () => {
  test('les fiches visibles d’un univers sont préchargées, jamais WhatsApp', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'préchargement observé sur Chromium');
    const prefetched: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() !== 'document' || request.frame() !== page.mainFrame()) {
        prefetched.push(request.url());
      }
    });
    await page.goto('/experiences/visites');
    await expect
      .poll(async () =>
        (
          await page.evaluate(() =>
            [...document.querySelectorAll('link[rel="prefetch"]')].map((link) =>
              link.getAttribute('href'),
            ),
          )
        ).concat(prefetched),
      )
      .toContainEqual(expect.stringMatching(/\/experiences\/[a-z-]+$/));
    expect(prefetched.some((url) => url.includes('wa.me'))).toBe(false);
  });

  test('sur ordinateur, « Partager » copie le lien et le confirme', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'presse-papiers accordé sur Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.addInitScript(() =>
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }),
    );
    await page.goto('/experiences/excursion-en-pirogue');
    await page.getByTestId('share').click();
    await expect(page.getByTestId('toast')).toContainText('Lien copié');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
      /\/experiences\/excursion-en-pirogue$/,
    );
  });

  test('sans JavaScript, pas de bouton Partager', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/experiences/excursion-en-pirogue');
    await expect(page.getByTestId('share')).toHaveCount(0);
    await context.close();
  });
});
