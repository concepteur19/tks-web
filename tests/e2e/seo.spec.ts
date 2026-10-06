import { expect, test } from '@playwright/test';
import { deliveredPaths, experiencePaths } from './delivered.ts';

test('chaque page livrée a un titre et une description uniques', async ({ page }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const path of deliveredPaths()) {
    await page.goto(path);
    const title = await page.title();
    const description =
      (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    expect(titles.get(title), `titre de ${path} déjà utilisé`).toBeUndefined();
    expect(descriptions.get(description), `description de ${path} déjà utilisée`).toBeUndefined();
    titles.set(title, path);
    descriptions.set(description, path);
  }
});

for (const path of deliveredPaths()) {
  test(`${path} : partage, adresse canonique et liens alternatifs`, async ({ page }) => {
    await page.goto(path);
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/^https?:\/\/[^/]+\/.+\.jpg$/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical ?? '').pathname).toBe(path);
    for (const hreflang of ['fr', 'en', 'x-default']) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
    }
    const jsonLd = page.locator('script[type="application/ld+json"]');
    if (path === '/' || path === '/en/') {
      const data = JSON.parse((await jsonLd.textContent()) ?? '{}');
      expect(data['@type']).toBe('TravelAgency');
      expect(data.inLanguage).toBe(path === '/' ? 'fr' : 'en');
    } else {
      await expect(jsonLd).toHaveCount(0);
    }
  });
}

test('le plan du site liste les pages livrées dans les deux langues, sans 404', async ({
  request,
}) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');
  const locs: string[] = [];
  for (const sitemap of sitemaps) {
    const xml = await (await request.get(new URL(sitemap).pathname)).text();
    locs.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? ''));
  }
  const paths = locs.map((loc) => new URL(loc).pathname).sort();
  expect(paths).toEqual([...deliveredPaths(), ...experiencePaths()].sort());
});

test('chaque fiche a son image de partage et ses données structurées TouristTrip', async ({
  page,
}) => {
  for (const [slug, hasOffer] of [
    ['excursion-en-pirogue', true],
    ['jet-ski', false],
    ['bateau-de-plaisance', false],
  ] as const) {
    await page.goto(`/experiences/${slug}`);
    const data = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}',
    );
    expect(data['@type'], slug).toBe('TouristTrip');
    expect('offers' in data, slug).toBe(hasOffer);
    expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(
      /\.jpg$/,
    );
  }
});
