import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

/**
 * Attentes tirées des fichiers de contenu : la page d'entrée et les univers suivent le catalogue
 * publié, quelle que soit l'étape de la feature 008 (univers culinaire vide ou rempli).
 */
type Universe = {
  id: string;
  order: number;
  name: { fr: string; en: string };
  urlSlug: { fr: string; en: string };
};
const read = <T>(dir: string) =>
  readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => ({
      id: file.replace(/\.json$/, ''),
      ...(JSON.parse(readFileSync(join(dir, file), 'utf8')) as T),
    }));
const services = read<{
  section: string;
  categoryId?: string;
  isOption?: boolean;
  availability?: string;
}>('src/content/services').filter(
  (service) =>
    service.section === 'experience' && !service.isOption && service.availability !== 'disabled',
);
const universes = read<Omit<Universe, 'id'>>('src/content/categories')
  .filter((universe) => services.some((service) => service.categoryId === universe.id))
  .sort((a, b) => a.order - b.order);
const idsOf = (universeId: string) =>
  services.filter((service) => service.categoryId === universeId).map((service) => service.id);

const activites = universes.find((universe) => universe.id === 'activites')!;

for (const [lang, entry, title, heading, tab] of [
  ['fr', '/experiences', 'Découvrez Kribi selon vos envies', 'Tourisme', 'Tourisme'],
  ['en', '/en/experiences', 'Discover Kribi your way', 'Tourism', 'Tourism'],
] as const) {
  const prefix = lang === 'fr' ? '' : '/en';

  test.describe(`page d’entrée du Tourisme ${lang}`, () => {
    test('présente les univers, sans liste d’expériences', async ({ page }) => {
      await page.goto(entry);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
      const cards = page.getByTestId('universe-card');
      await expect(cards).toHaveCount(universes.length);
      for (const [index, universe] of universes.entries()) {
        await expect(cards.nth(index)).toContainText(universe.name[lang]);
      }
      await expect(page.getByTestId('experience-card')).toHaveCount(0);
    });

    test('une carte montre phrase, exemples, nombre et mène à son univers', async ({ page }) => {
      await page.goto(entry);
      const card = page.getByTestId('universe-card').filter({ hasText: activites.name[lang] });
      await expect(card).toContainText(lang === 'fr' ? 'Voir le catalogue' : 'See the catalogue');
      await expect(card).toContainText(String(idsOf('activites').length));
      await expect(card.locator('[data-examples]')).toContainText('·');
      await card.getByRole('link').click();
      await expect(page).toHaveURL(`${prefix}/experiences/${activites.urlSlug[lang]}`);
    });

    test('l’onglet s’appelle Tourisme', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(prefix || '/');
      await expect(page.getByTestId('tab-bar').getByRole('link', { name: tab })).toBeVisible();
    });

    test('se termine par « Une envie particulière ? » et un bouton WhatsApp', async ({ page }) => {
      await page.goto(entry);
      const block = page.locator('[data-section="special"]');
      await expect(block.getByRole('link')).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    });
  });

  test.describe(`pages d’univers ${lang}`, () => {
    for (const universe of universes) {
      test(`${universe.id} ne liste que ses prestations`, async ({ page }) => {
        await page.goto(`${prefix}/experiences/${universe.urlSlug[lang]}`);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(universe.name[lang]);
        const links = page
          .getByTestId('experience-card')
          .getByRole('link', { name: lang === 'fr' ? /^Voir les détails/ : /^See details/ });
        const hrefs = await links.evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute('href')!.split('/').pop()),
        );
        expect(hrefs.sort()).toEqual(idsOf(universe.id).sort());
      });
    }

    test('la navigation mène à chaque univers et signale le courant', async ({ page }) => {
      await page.goto(`${prefix}/experiences/${activites.urlSlug[lang]}`);
      const nav = page.getByTestId('universe-nav');
      await expect(nav.getByRole('link')).toHaveCount(universes.length);
      await expect(nav.locator('[aria-current="page"]')).toHaveText(activites.name[lang]);
      for (const universe of universes) {
        await expect(nav.getByRole('link', { name: universe.name[lang] })).toHaveAttribute(
          'href',
          `${prefix}/experiences/${universe.urlSlug[lang]}`,
        );
      }
    });

    test('le fil d’Ariane ramène à la page d’entrée', async ({ page }) => {
      await page.goto(`${prefix}/experiences/${activites.urlSlug[lang]}`);
      await page
        .getByRole('navigation', { name: lang === 'fr' ? "Fil d'Ariane" : 'Breadcrumb' })
        .getByRole('link', { name: heading })
        .click();
      await expect(page).toHaveURL(entry);
    });
  });
}

test('le sélecteur de langue mène à l’adresse traduite de l’univers', async ({ page }) => {
  await page.goto(`/experiences/${activites.urlSlug.fr}`);
  await expect(page.locator('a[data-locale="en"]')).toHaveAttribute(
    'href',
    `/en/experiences/${activites.urlSlug.en}`,
  );
});

test('une ancienne adresse de filtre affiche la page d’entrée', async ({ page }) => {
  await page.goto('/experiences#aventure');
  await expect(page.getByTestId('universe-card')).toHaveCount(universes.length);
});

test('le plan du site contient la page d’entrée et chaque univers, dans les deux langues', async ({
  request,
}) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');
  let urls = '';
  for (const map of maps) urls += await (await request.get(new URL(map).pathname)).text();
  for (const universe of universes) {
    expect(urls).toContain(`/experiences/${universe.urlSlug.fr}<`);
    expect(urls).toContain(`/en/experiences/${universe.urlSlug.en}<`);
  }
});

test('sans JavaScript, chaque univers est atteignable par un lien', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/experiences');
  for (const universe of universes) {
    await expect(
      page.getByTestId('universe-card').getByRole('link', { name: universe.name.fr }),
    ).toHaveAttribute('href', `/experiences/${universe.urlSlug.fr}`);
  }
  await context.close();
});

test('pas de défilement horizontal à 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const path of ['/experiences', `/experiences/${activites.urlSlug.fr}`]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow, path).toBe(false);
  }
});

test.describe('effets sur l’accueil', () => {
  test('une carte d’univers mène à sa page, sans ancre', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-section="categories"] a');
    await expect(cards).toHaveCount(universes.length);
    await expect(cards.nth(1)).toHaveAttribute('href', `/experiences/${universes[1]!.urlSlug.fr}`);
    await expect(cards.nth(1)).toContainText(/\d+ expériences?/);
  });

  test('les cartes mises en avant mènent à leur fiche', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-section="featured"] a').first()).toHaveAttribute(
      'href',
      '/experiences/chutes-de-la-lobe',
    );
    await expect(page.getByTestId('hero-cta-experiences')).toHaveAttribute('href', '/experiences');
  });
});
