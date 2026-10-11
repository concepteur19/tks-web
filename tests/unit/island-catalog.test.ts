import { describe, expect, it } from 'vitest';
import { catalogMap, toIslandCatalog } from '../../src/features/selection/islandCatalog.ts';

const hrefs = (id: string) => ({ fr: `/experiences/${id}`, en: `/en/experiences/${id}` });

describe('catalogue minimal des îlots', () => {
  const services = [
    {
      id: 'campement-bagyeli',
      data: {
        title: { fr: 'Campement Bagyeli', en: 'Bagyeli camp' },
        description: { fr: 'Long texte', en: 'Long text' },
        tiers: [
          {
            id: 'couple',
            label: { fr: 'Couple', en: 'Couple' },
            pricing: { kind: 'fixed' as const, amount: 20000, unit: 'per_group' as const },
            quantity: { dimensions: [] },
          },
        ],
        quantity: { dimensions: [] },
      },
    },
    {
      id: 'guide-touristique',
      data: {
        title: { fr: 'Guide touristique', en: 'Tour guide' },
        pricing: { kind: 'fixed' as const, amount: 5000, unit: 'per_service' as const },
        quantity: { dimensions: [] },
        isOption: true,
      },
    },
  ];

  it('ne garde que ce que les îlots utilisent', () => {
    const [camp, guide] = toIslandCatalog(services, hrefs, {
      'campement-bagyeli': '/_astro/t.webp',
    });
    expect(camp).toEqual({
      id: 'campement-bagyeli',
      title: { fr: 'Campement Bagyeli', en: 'Bagyeli camp' },
      pricing: undefined,
      tiers: [
        {
          id: 'couple',
          label: { fr: 'Couple', en: 'Couple' },
          pricing: { kind: 'fixed', amount: 20000, unit: 'per_group' },
          quantity: { dimensions: [] },
        },
      ],
      quantity: { dimensions: [] },
      isOption: false,
      thumbnail: '/_astro/t.webp',
      href: { fr: '/experiences/campement-bagyeli', en: '/en/experiences/campement-bagyeli' },
    });
    expect(camp).not.toHaveProperty('description');
    expect(guide).toMatchObject({ isOption: true, thumbnail: undefined, tiers: undefined });
  });

  it('indexe le catalogue par identifiant', () => {
    const map = catalogMap(toIslandCatalog(services, hrefs));
    expect([...map.keys()]).toEqual(['campement-bagyeli', 'guide-touristique']);
  });
});
