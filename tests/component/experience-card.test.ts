import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import ExperienceCard from '../../src/components/experiences/ExperienceCard.astro';

/** Carte sans photo : le rendu des images relève des parcours, qui ont le service d'images. */
function service(id: string, data: Record<string, unknown>) {
  return {
    id,
    collection: 'services',
    data: {
      title: { fr: 'Excursion en pirogue', en: 'Dugout canoe trip' },
      section: 'experience',
      categoryId: 'nature-decouverte',
      shortDescription: { fr: 'Remontez la Lobé', en: 'Paddle up the Lobé' },
      description: { fr: 'Description', en: 'Description' },
      quantity: { dimensions: [] },
      availability: 'available',
      ...data,
    },
  };
}

async function mount(props: Record<string, unknown>): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ExperienceCard, { props });
  document.documentElement.lang = String(props.locale);
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root') as HTMLElement;
}

const text = (root: HTMLElement) => (root.textContent ?? '').replace(/[\s\u202f\u00a0]+/g, ' ');

describe('carte d’expérience', () => {
  it('montre le nom, la description, le prix, l’euro et le lien vers la fiche', async () => {
    const root = await mount({
      locale: 'fr',
      service: service('excursion-en-pirogue', {
        pricing: { kind: 'fixed', amount: 35000, unit: 'per_group', maxCapacity: 8 },
      }),
    });
    expect(text(root)).toContain('Excursion en pirogue');
    expect(text(root)).toContain('Remontez la Lobé');
    expect(text(root)).toContain('35 000 FCFA / groupe');
    expect(text(root)).toContain('≈ 53,36 €');
    expect(text(root)).toContain('8 personnes max');
    const link = root.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/experiences/excursion-en-pirogue');
    expect(link?.getAttribute('aria-label')).toBe('Voir les détails : Excursion en pirogue');
  });

  it('signale une disponibilité à confirmer et un prix sur devis, sans euro', async () => {
    const root = await mount({
      locale: 'fr',
      service: service('bateau-de-plaisance', {
        pricing: { kind: 'quote' },
        availability: 'on_request',
      }),
    });
    expect(text(root)).toContain('Disponibilité à confirmer');
    expect(text(root)).toContain('Sur devis');
    expect(text(root)).not.toContain('€');
  });

  it('suit la langue anglaise', async () => {
    const root = await mount({
      locale: 'en',
      service: service('excursion-en-pirogue', {
        pricing: { kind: 'fixed', amount: 35000, unit: 'per_group', maxCapacity: 8 },
      }),
    });
    expect(text(root)).toContain('Dugout canoe trip');
    expect(text(root)).toContain('8 people max');
    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      '/en/experiences/excursion-en-pirogue',
    );
  });

  it("ne produit aucune violation d'accessibilité", async () => {
    const root = await mount({
      locale: 'fr',
      service: service('kayak', { pricing: { kind: 'fixed', amount: 10000, unit: 'per_person' } }),
    });
    const results = await axe.run(root, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
