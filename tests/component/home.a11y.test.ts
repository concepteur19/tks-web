import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';
import Header from '../../src/components/Header.astro';

async function renderToBody(
  component: Parameters<AstroContainer['renderToString']>[0],
  locale: 'fr' | 'en',
  path = '/',
): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(component, {
    props: { locale, routeKey: 'home' },
    request: new Request(`http://localhost${path}`),
  });
  document.documentElement.lang = locale;
  document.body.innerHTML = html;
  return document.body;
}

const AXE_OPTIONS = {
  // jsdom ne calcule pas les couleurs : le contraste est vérifié sur les tokens
  // (T040) et dans les parcours Playwright.
  rules: { 'color-contrast': { enabled: false } },
} as const;

describe('accessibilité des éléments de page', () => {
  it('ne produit aucune violation dans la navigation, en français', async () => {
    const body = await renderToBody(Header, 'fr');
    const results = await axe.run(body, AXE_OPTIONS);
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  it('ne produit aucune violation dans la navigation, en anglais', async () => {
    const body = await renderToBody(Header, 'en', '/en/');
    const results = await axe.run(body, AXE_OPTIONS);
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  it('ne produit aucune violation dans le pied de page', async () => {
    const body = await renderToBody(Footer, 'fr');
    const results = await axe.run(body, AXE_OPTIONS);
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  it('donne un nom accessible au lien de marque', async () => {
    const body = await renderToBody(Header, 'fr');
    const brand = body.querySelector('header a');
    expect(brand?.querySelector('svg')?.getAttribute('aria-label')).toBe('Kibreeze');
    expect(brand?.textContent).toContain('Kribi is a feeling');
  });
});
