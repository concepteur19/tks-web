import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import axe from 'axe-core';
import { beforeEach, describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';
import Header from '../../src/components/Header.astro';
import TabBar from '../../src/components/TabBar.astro';
import { DESKTOP_NAV, visible } from '../../src/i18n/navigation.ts';
import { IMPLEMENTED_ROUTES, ROUTES } from '../../src/i18n/routes.ts';

type Component = Parameters<AstroContainer['renderToString']>[0];

async function mount(
  component: Component,
  props: Record<string, unknown>,
  path = '/',
): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(component, {
    props,
    request: new Request(`http://localhost${path}`),
  });
  document.documentElement.lang = String(props.locale);
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root') as HTMLElement;
}

const AXE_OPTIONS = {
  // Le contraste se vérifie sur les tokens et dans les parcours : jsdom ne calcule pas les couleurs.
  // `region` ne s'applique qu'à une page entière.
  rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
} as const;

async function violations(root: HTMLElement): Promise<string[]> {
  const results = await axe.run(root, AXE_OPTIONS);
  return results.violations.map((violation) => violation.id);
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('en-tête', () => {
  it('contient le logo, le sélecteur de langue et WhatsApp, sans menu', async () => {
    const root = await mount(Header, { locale: 'fr', routeKey: 'home' });
    const brand = root.querySelector('header a');
    expect(brand?.querySelector('svg')?.getAttribute('aria-label')).toBe('Kibreeze');
    expect(brand?.textContent).toContain('Kribi is a feeling');
    expect(root.querySelector('[data-locale="en"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="header-whatsapp"]')?.getAttribute('href')).toMatch(
      /^https:\/\/wa\.me\/\d+\?text=/,
    );
    expect(root.querySelector('button')).toBeNull();
  });

  it("n'affiche ni Mon séjour ni lien de navigation vers une page non livrée", async () => {
    const root = await mount(Header, { locale: 'fr', routeKey: 'home' });
    const internal = [...root.querySelectorAll('a:not([data-locale])')]
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('/'));
    expect(internal).toEqual(['/', ...visible(DESKTOP_NAV).map((key) => ROUTES[key].fr)]);
  });

  it("ne produit aucune violation d'accessibilité, dans les deux langues", async () => {
    expect(await violations(await mount(Header, { locale: 'fr', routeKey: 'home' }))).toEqual([]);
    expect(
      await violations(await mount(Header, { locale: 'en', routeKey: 'home' }, '/en/')),
    ).toEqual([]);
  });
});

describe('barre à onglets', () => {
  it('ne rend que les onglets livrés, et signale la page courante', async () => {
    const root = await mount(TabBar, { locale: 'fr', routeKey: 'home' });
    const tabs = [...root.querySelectorAll('a')];
    const expected = ['home', 'experiences', 'accommodation', 'packages', 'stay'].filter((key) =>
      (IMPLEMENTED_ROUTES as readonly string[]).includes(key),
    );
    expect(tabs).toHaveLength(expected.length);
    expect(tabs[0]?.getAttribute('aria-current')).toBe('page');
    expect(tabs[0]?.textContent).toContain('Accueil');
  });

  it('porte un nom de navigation distinct', async () => {
    const root = await mount(TabBar, { locale: 'en', routeKey: 'home' }, '/en/');
    expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe('Mobile navigation');
    expect(await violations(root)).toEqual([]);
  });
});

describe('pied de page', () => {
  it('cite les quatre marques du groupe, seule Kibreeze étant un lien', async () => {
    const root = await mount(Footer, { locale: 'fr' });
    const text = root.textContent ?? '';
    for (const brand of ['Kibreeze', 'TKS®', 'iBreezy', 'Breezy Delivery']) {
      expect(text).toContain(brand);
    }
    const linkTexts = [...root.querySelectorAll('a')].map((link) => link.textContent?.trim());
    for (const sister of ['TKS®', 'iBreezy', 'Breezy Delivery']) {
      expect(linkTexts).not.toContain(sister);
    }
    expect(linkTexts).toContain('Kibreeze');
  });

  it('formule la ligne du groupe dans chaque langue', async () => {
    const text = (root: HTMLElement) => (root.textContent ?? '').replace(/\s+/g, ' ');
    const french = await mount(Footer, { locale: 'fr' });
    expect(text(french)).toContain(
      'Kibreeze est une marque de Breezy Groupe, avec TKS®, iBreezy et Breezy Delivery.',
    );
    const english = await mount(Footer, { locale: 'en' }, '/en/');
    expect(text(english)).toContain(
      'Kibreeze is a Breezy Groupe brand, alongside TKS®, iBreezy and Breezy Delivery.',
    );
  });

  it('ne rend que des liens internes vers des pages livrées', async () => {
    const root = await mount(Footer, { locale: 'fr' });
    const internal = [...root.querySelectorAll('a')]
      .map((link) => (link.getAttribute('href') ?? '').split('#')[0] ?? '')
      .filter((href) => href.startsWith('/'));
    const allowed = new Set(IMPLEMENTED_ROUTES.map((key) => ROUTES[key].fr));
    for (const href of internal) expect(allowed.has(href), href).toBe(true);
  });

  it('donne des noms distincts à ses navigations et ne produit aucune violation', async () => {
    const root = await mount(Footer, { locale: 'fr' });
    const names = [...root.querySelectorAll('nav')].map((nav) => nav.getAttribute('aria-label'));
    expect(new Set(names).size).toBe(names.length);
    expect(await violations(root)).toEqual([]);
  });
});
