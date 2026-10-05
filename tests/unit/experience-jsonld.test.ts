import { describe, expect, it } from 'vitest';
import { buildExperienceJsonLd } from '../../src/lib/seo.ts';

const base = {
  title: 'Excursion en pirogue',
  description: 'Remontez la Lobé entre mangrove et forêt',
  url: 'https://kibreeze.com/experiences/excursion-en-pirogue',
  imageUrl: 'https://kibreeze.com/_astro/pirogue.jpg',
  locale: 'fr' as const,
  siteUrl: 'https://kibreeze.com',
  unitLabel: 'groupe',
};

describe('données structurées d’une fiche', () => {
  it('décrit une activité organisée par Kibreeze, avec son offre', () => {
    expect(
      buildExperienceJsonLd({
        ...base,
        price: { kind: 'fixed', amount: 35000, unit: 'per_group' },
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: 'Excursion en pirogue',
      description: 'Remontez la Lobé entre mangrove et forêt',
      url: 'https://kibreeze.com/experiences/excursion-en-pirogue',
      image: 'https://kibreeze.com/_astro/pirogue.jpg',
      inLanguage: 'fr',
      provider: { '@type': 'TravelAgency', name: 'Kibreeze', url: 'https://kibreeze.com/' },
      offers: {
        '@type': 'Offer',
        price: 35000,
        priceCurrency: 'XAF',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 35000,
          priceCurrency: 'XAF',
          unitText: 'groupe',
        },
      },
    });
  });

  it('garde l’offre pour un prix « à partir de »', () => {
    const data = buildExperienceJsonLd({
      ...base,
      price: { kind: 'from', amount: 7500, unit: 'per_person' },
    });
    expect(data.offers).toMatchObject({ price: 7500, priceCurrency: 'XAF' });
  });

  it('n’expose aucune offre chiffrée pour une expérience sur devis', () => {
    const data = buildExperienceJsonLd({ ...base, price: { kind: 'quote' } });
    expect(data).not.toHaveProperty('offers');
  });

  it('omet le libellé d’unité quand il n’est pas fourni', () => {
    const withoutUnit: Omit<typeof base, 'unitLabel'> & { unitLabel?: string } = { ...base };
    delete withoutUnit.unitLabel;
    const data = buildExperienceJsonLd({
      ...withoutUnit,
      price: { kind: 'fixed', amount: 5000, unit: 'per_person' },
    });
    expect((data.offers as { priceSpecification: object }).priceSpecification).not.toHaveProperty(
      'unitText',
    );
  });
});
