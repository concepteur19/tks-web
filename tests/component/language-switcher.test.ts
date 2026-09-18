import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import axe from 'axe-core';
import { beforeEach, describe, expect, it } from 'vitest';
import LanguageSwitcher from '../../src/components/LanguageSwitcher.astro';

async function render(path: string, locale: 'fr' | 'en'): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(LanguageSwitcher, {
    props: { locale },
    request: new Request(`http://localhost${path}`),
  });
}

function mount(html: string): HTMLElement {
  document.documentElement.lang = 'fr';
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root') as HTMLElement;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('sélecteur de langue', () => {
  it('signale la langue active et pointe vers la page équivalente', async () => {
    const root = mount(await render('/', 'fr'));
    const current = root.querySelector('[data-locale="fr"]');
    const other = root.querySelector('[data-locale="en"]');

    expect(current?.getAttribute('aria-current')).toBe('true');
    expect(other?.getAttribute('aria-current')).toBeNull();
    expect(other?.getAttribute('href')).toBe('/en/');
  });

  it('ramène vers le français depuis une page anglaise', async () => {
    const root = mount(await render('/en/', 'en'));
    expect(root.querySelector('[data-locale="fr"]')?.getAttribute('href')).toBe('/');
    expect(root.querySelector('[data-locale="en"]')?.getAttribute('aria-current')).toBe('true');
  });

  it('porte les attributs de langue sur chaque lien', async () => {
    const root = mount(await render('/', 'fr'));
    for (const code of ['fr', 'en']) {
      const link = root.querySelector(`[data-locale="${code}"]`);
      expect(link?.getAttribute('lang')).toBe(code);
      expect(link?.getAttribute('hreflang')).toBe(code);
    }
  });

  it('expose un nom de navigation traduit', async () => {
    const root = mount(await render('/en/', 'en'));
    expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe('Language');
  });

  it("ne produit aucune violation d'accessibilité", async () => {
    const root = mount(await render('/', 'fr'));
    const results = await axe.run(root, {
      // `region` ne s'applique qu'à une page entière, et le contraste des
      // couleurs se vérifie sur les tokens (T040) et dans les parcours, pas ici :
      // jsdom ne calcule pas les couleurs.
      rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
    });
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
