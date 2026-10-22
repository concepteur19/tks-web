import { expect, test } from '@playwright/test';
import { plain } from './stay.ts';

const SECTION_ORDER = [
  'hero',
  'categories',
  'how-it-works',
  'featured',
  'strip',
  'accommodation',
  'packages',
  'mobility',
  'about',
  'whatsapp-cta',
];

for (const [path, lang, title, ctas] of [
  ['/', 'fr', 'Découvrez Kribi autrement', ['Découvrir les expériences', 'Planifier mon séjour']],
  ['/en/', 'en', 'Discover Kribi differently', ['Discover the experiences', 'Plan my trip']],
] as const) {
  test.describe(`accueil ${lang}`, () => {
    test('montre le hero complet dès le premier écran', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(path);
      const hero = page.locator('[data-section="hero"]');
      await expect(hero.getByRole('img', { name: 'Kibreeze' })).toBeInViewport();
      await expect(hero.getByText('Kribi is a feeling')).toBeInViewport();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      for (const label of ctas) {
        await expect(hero.getByRole('link', { name: new RegExp(label) })).toBeVisible();
      }
    });

    test('présente les sections dans l’ordre validé', async ({ page }) => {
      await page.goto(path);
      const order = await page
        .locator('main [data-section]')
        .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-section')));
      expect(order).toEqual(SECTION_ORDER);
    });

    test('aperçu Mobilité : trois véhicules avec photo et prix, après les expériences (010)', async ({
      page,
    }) => {
      await page.goto(path);
      const mobility = page.locator('[data-section="mobility"]');
      const featured = page.locator('[data-section="featured"]');
      expect((await mobility.boundingBox())!.y).toBeGreaterThan((await featured.boundingBox())!.y);
      const cards = mobility.getByTestId('mobility-teaser-card');
      await expect(cards).toHaveCount(3);
      for (const card of await cards.all()) {
        await expect(card.locator('img')).toHaveCount(1);
        expect(plain(await card.textContent())).toMatch(lang === 'fr' ? /\/ jour/ : /\/ day/);
        await expect(card.locator('a').first()).toHaveAttribute(
          'href',
          new RegExp(`^${lang === 'fr' ? '/mobilite' : '/en/mobility'}#vehicule-`),
        );
      }
    });

    test('aperçu Hébergements : quatre types, appartement compris (010)', async ({ page }) => {
      await page.goto(path);
      const cards = page.locator('[data-section="accommodation"] li');
      await expect(cards).toHaveCount(4);
      await expect(cards.nth(2)).toContainText(lang === 'fr' ? 'Appartement' : 'Apartment');
    });

    test('diaporama du hero : 7 photos, une visible, défilement et pause (010)', async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto(path);
      const slides = page.locator('[data-section="hero"] [data-slide]');
      // Avant toute interaction : la première photo seule, rien d'autre chargé (SC-005).
      await expect(slides).toHaveCount(1);
      await expect(slides.first().locator('img')).toHaveAttribute('fetchpriority', 'high');
      const active = () =>
        page.evaluate(() =>
          [...document.querySelectorAll('[data-section="hero"] [data-slide]')].findIndex((slide) =>
            slide.hasAttribute('data-active'),
          ),
        );
      await page.clock.runFor(13000);
      expect(await active()).toBe(0);
      await page.mouse.move(10, 10);
      await page.mouse.down();
      await page.mouse.up();
      await expect(slides).toHaveCount(7);
      for (const image of await slides.locator('img').all()) {
        await image.evaluate((element: HTMLImageElement) =>
          element.complete ? undefined : new Promise((resolve) => (element.onload = resolve)),
        );
      }
      await page.clock.runFor(6500);
      expect(await active()).toBe(1);
      const pause = page.getByTestId('hero-pause');
      await pause.click();
      await expect(pause).toHaveAttribute('aria-pressed', 'true');
      await page.clock.runFor(13000);
      expect(await active()).toBe(1);
      await pause.click();
      await expect(pause).toHaveAttribute('aria-pressed', 'false');
      await page.clock.runFor(6500);
      expect(await active()).toBe(2);
    });

    test('suit chaque prix en FCFA de son équivalent en euros, avec une seule mention indicative', async ({
      page,
    }) => {
      await page.goto(path);
      const amounts = page.locator('[data-price="fixed"], [data-price="from"]');
      const count = await amounts.count();
      expect(count).toBeGreaterThanOrEqual(9);
      for (let index = 0; index < count; index += 1) {
        await expect(amounts.nth(index).locator('[data-price-eur]')).toHaveText(/≈/);
      }
      await expect(page.locator('[data-indicative]')).toHaveCount(1);
    });

    test('ne montre aucun bouton d’ajout au séjour, et compte les expériences par univers', async ({
      page,
    }) => {
      // Le nombre par catégorie apparaît depuis la livraison du catalogue (feature 003).
      await page.goto(path);
      // Depuis la 004, chaque expérience mise en avant propose l'ajout rapide (FR-028).
      await expect(page.locator('[data-section="featured"] [data-testid="quick-add"]')).toHaveCount(
        4,
      );
      // Une carte par univers qui a au moins une prestation publiée (feature 008).
      const cards = page.locator('[data-section="categories"] a');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(2);
      await expect(
        page.locator('[data-section="categories"]').getByText(/\d+ (expériences?|experiences?)/),
      ).toHaveCount(count);
    });

    test('« Comment ça marche » : trois étapes et un bouton vers le Tourisme', async ({ page }) => {
      await page.goto(path);
      const section = page.locator('[data-section="how-it-works"]');
      await expect(section.locator('li')).toHaveCount(3);
      await expect(section.getByRole('link')).toHaveAttribute(
        'href',
        lang === 'fr' ? '/experiences' : '/en/experiences',
      );
    });

    test('le bandeau TKS® mène à la page Mobilité, plus à WhatsApp', async ({ page }) => {
      // Livrée par la 006 : plus aucun lien de l'accueil n'ouvre WhatsApp faute de page.
      await page.goto(path);
      const cta = page.locator('[data-section="mobility"] a[data-link-kind]');
      await expect(cta).toHaveAttribute('data-link-kind', 'internal');
      await expect(cta).toHaveAttribute('href', lang === 'fr' ? '/mobilite' : '/en/mobility');
      await expect(
        page.locator('[data-section="accommodation"] a[data-link-kind]'),
      ).toHaveAttribute('data-link-kind', 'internal');
    });
  });
}

test('reste lisible sans JavaScript, carrousel compris', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-section="featured"] li')).toHaveCount(4);
  await context.close();
});

test.describe('diaporama sous « réduire les animations » (010)', () => {
  test.use({ reducedMotion: 'reduce' });
  test('reste sur la première photo, sans bouton pause', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await page.clock.runFor(13000);
    await expect(page.locator('[data-section="hero"] [data-slide][data-active]')).toHaveCount(1);
    expect(
      await page
        .locator('[data-section="hero"] [data-slide]')
        .first()
        .evaluate((slide) => slide.hasAttribute('data-active')),
    ).toBe(true);
    await expect(page.getByTestId('hero-pause')).toBeHidden();
  });
});

test('diaporama sans JavaScript : la première photo seule, sans bouton', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-section="hero"] [data-slide][data-active]')).toHaveCount(1);
  await expect(page.getByTestId('hero-pause')).toBeHidden();
  await context.close();
});
