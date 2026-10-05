import { describe, expect, it } from 'vitest';
import { buildLocalBusinessJsonLd } from '../../src/lib/seo.ts';

const company = {
  brand: 'Kibreeze',
  locality: { fr: 'Kribi, Cameroun', en: 'Kribi, Cameroon' },
};

describe('données structurées de l’accueil', () => {
  it('décrit Kibreeze comme une agence de voyage locale à Kribi', () => {
    const data = buildLocalBusinessJsonLd({
      company,
      locale: 'fr',
      siteUrl: 'https://kibreeze.com',
      phone: '237697135388',
      logoUrl: 'https://kibreeze.com/_astro/logo.png',
    });
    expect(data).toEqual({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Kibreeze',
      url: 'https://kibreeze.com/',
      logo: 'https://kibreeze.com/_astro/logo.png',
      telephone: '+237697135388',
      areaServed: { '@type': 'City', name: 'Kribi' },
      address: { '@type': 'PostalAddress', addressLocality: 'Kribi', addressCountry: 'CM' },
      inLanguage: 'fr',
    });
  });

  it('pointe vers l’accueil anglais et porte la langue anglaise', () => {
    const data = buildLocalBusinessJsonLd({
      company,
      locale: 'en',
      siteUrl: 'https://kibreeze.com',
      phone: '237697135388',
      logoUrl: 'https://kibreeze.com/_astro/logo.png',
    });
    expect(data.url).toBe('https://kibreeze.com/en/');
    expect(data.inLanguage).toBe('en');
  });
});
