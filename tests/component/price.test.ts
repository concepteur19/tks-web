import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import Price from '../../src/components/Price.astro';

async function mount(props: Record<string, unknown>): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Price, { props });
  document.documentElement.lang = String(props.locale);
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root') as HTMLElement;
}

const plain = (element: Element | null | undefined) =>
  (element?.textContent ?? '').replace(/[\s\u202f\u00a0]+/g, ' ').trim();

describe('prix', () => {
  it('affiche un prix ferme puis, sur sa propre ligne, l’équivalent en euros', async () => {
    const root = await mount({
      locale: 'fr',
      price: { kind: 'fixed', amount: 25000, unit: 'per_person' },
    });
    const lines = root.querySelectorAll('p');
    expect(lines).toHaveLength(2);
    expect(plain(lines[0])).toBe('25 000 FCFA / personne');
    expect(plain(lines[1])).toBe('≈ 38,11 €');
  });

  it('affiche un prix « à partir de » par nuit', async () => {
    const root = await mount({
      locale: 'fr',
      price: { kind: 'from', amount: 15000, unit: 'per_night' },
    });
    expect(plain(root.querySelector('p'))).toBe('À partir de 15 000 FCFA / nuit');
  });

  it('affiche le nombre de personnes d’une formule', async () => {
    const root = await mount({
      locale: 'fr',
      price: { kind: 'fixed', amount: 100000, unit: 'per_group', basePersons: 2 },
    });
    expect(plain(root.querySelector('p'))).toBe('100 000 FCFA / 2 personnes');
  });

  it('affiche un badge « Sur devis », sans montant ni euro', async () => {
    const root = await mount({ locale: 'fr', price: { kind: 'quote' } });
    expect(plain(root)).toBe('Sur devis');
    expect(root.querySelector('[data-price-eur]')).toBeNull();
  });

  it('suit le format anglais', async () => {
    const fixed = await mount({
      locale: 'en',
      price: { kind: 'fixed', amount: 25000, unit: 'per_person' },
    });
    expect(plain(fixed.querySelectorAll('p')[0])).toBe('25,000 FCFA / person');
    expect(plain(fixed.querySelectorAll('p')[1])).toBe('≈ €38.11');
    const quote = await mount({ locale: 'en', price: { kind: 'quote' } });
    expect(plain(quote)).toBe('On request');
  });

  it("ne produit aucune violation d'accessibilité", async () => {
    const root = await mount({
      locale: 'fr',
      price: { kind: 'from', amount: 7500, unit: 'per_person' },
    });
    const results = await axe.run(root, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
