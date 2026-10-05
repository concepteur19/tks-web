import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  catalogIssues,
  categorySchema,
  companySchema,
  currencySchema,
  homeSchema,
  legalSchema,
  serviceSchema,
} from '../../src/content/schemas.ts';

const schema = serviceSchema(z.string());

function omit<T extends object>(value: T, key: keyof T): Partial<T> {
  const copy = { ...value };
  delete copy[key];
  return copy;
}

const pirogue = {
  title: { fr: 'Excursion en pirogue', en: 'Dugout canoe trip' },
  section: 'experience',
  categoryId: 'nature-decouverte',
  shortDescription: { fr: 'Remontez la Lobé entre mangrove et forêt', en: 'Paddle up the Lobé' },
  description: { fr: 'Une remontée de la Lobé.', en: 'A trip up the Lobé.' },
  images: [{ src: 'pirogue.jpg', alt: { fr: 'Pirogue sur la Lobé', en: 'Canoe on the Lobé' } }],
  pricing: { kind: 'fixed', amount: 35000, unit: 'per_group', maxCapacity: 8 },
  quantity: { dimensions: [] },
};

const kayak = {
  ...pirogue,
  title: { fr: 'Kayak', en: 'Kayak' },
  pricing: { kind: 'fixed', amount: 10000, unit: 'per_person' },
  quantity: { dimensions: [{ kind: 'persons', min: 1, max: 10, default: 2 }] },
};

function messages(input: unknown): string[] {
  const result = schema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`);
}

describe('fiche de service', () => {
  it('accepte une fiche conforme', () => {
    expect(messages(pirogue)).toEqual([]);
    expect(messages(kayak)).toEqual([]);
  });

  it('refuse un champ obligatoire absent, en nommant le champ', () => {
    const withoutTitle = omit(pirogue, 'title');
    expect(messages(withoutTitle).join()).toContain('title');
  });

  it('refuse une unité de prix incohérente avec les dimensions', () => {
    const issues = messages({ ...kayak, quantity: { dimensions: [] } });
    expect(issues.join()).toContain('per_person exige une dimension persons');
  });

  it('refuse plus de deux dimensions', () => {
    const issues = messages({
      ...kayak,
      quantity: {
        dimensions: [
          { kind: 'persons', min: 1, max: 10, default: 2 },
          { kind: 'days', min: 1, max: 10, default: 1 },
          { kind: 'units', label: { fr: 'véhicules' }, min: 1, max: 5, default: 1 },
        ],
      },
    });
    expect(issues.join()).toContain('au plus deux dimensions');
  });

  it('refuse deux dimensions de durée', () => {
    const issues = messages({
      ...pirogue,
      pricing: { kind: 'fixed', amount: 15000, unit: 'per_night' },
      quantity: {
        dimensions: [
          { kind: 'nights', min: 1, max: 14, default: 2 },
          { kind: 'days', min: 1, max: 14, default: 2 },
        ],
      },
    });
    expect(issues.join()).toContain('au plus une dimension de durée');
  });

  it('refuse min supérieur à default, et default supérieur à max', () => {
    const tooLow = messages({
      ...kayak,
      quantity: { dimensions: [{ kind: 'persons', min: 3, max: 10, default: 2 }] },
    });
    expect(tooLow.join()).toContain('min (3) supérieur à default (2)');
    const tooHigh = messages({
      ...kayak,
      quantity: { dimensions: [{ kind: 'persons', min: 1, max: 4, default: 6 }] },
    });
    expect(tooHigh.join()).toContain('default (6) supérieur à max (4)');
  });

  it('refuse un montant nul ou négatif', () => {
    expect(messages({ ...pirogue, pricing: { ...pirogue.pricing, amount: 0 } }).join()).toContain(
      'strictement positif',
    );
    expect(
      messages({ ...pirogue, pricing: { ...pirogue.pricing, amount: -500 } }).join(),
    ).toContain('strictement positif');
  });

  it('accepte un service sur devis sans montant', () => {
    expect(messages({ ...pirogue, pricing: { kind: 'quote' } })).toEqual([]);
  });

  it('refuse une capacité de groupe sur un prix qui n’est pas per_group', () => {
    const issues = messages({ ...kayak, pricing: { ...kayak.pricing, maxCapacity: 8 } });
    expect(issues.join()).toContain('maxCapacity');
  });

  it('exige une catégorie pour une expérience, pas pour la mobilité', () => {
    const withoutCategory = omit(pirogue, 'categoryId');
    expect(messages(withoutCategory).join()).toContain('categoryId est obligatoire');
    expect(
      messages({ ...withoutCategory, section: 'mobilite', pricing: { kind: 'quote' } }),
    ).toEqual([]);
  });

  it('accepte des tarifs alternatifs, chacun avec sa propre règle de quantité', () => {
    const base = omit(pirogue, 'pricing');
    const bagyeli = {
      ...base,
      tiers: [
        {
          id: 'individuel',
          label: { fr: 'Individuel', en: 'Individual' },
          pricing: { kind: 'fixed', amount: 7500, unit: 'per_person' },
          quantity: { dimensions: [{ kind: 'persons', min: 1, max: 10, default: 1 }] },
        },
        {
          id: 'couple',
          label: { fr: 'Couple', en: 'Couple' },
          pricing: { kind: 'fixed', amount: 20000, unit: 'per_group' },
        },
        { id: 'groupe', label: { fr: 'Groupe', en: 'Group' }, pricing: { kind: 'quote' } },
      ],
    };
    expect(messages(bagyeli)).toEqual([]);
    expect(messages({ ...bagyeli, pricing: pirogue.pricing }).join()).toContain(
      'soit pricing, soit tiers',
    );
  });

  it('refuse un champ inconnu, pour attraper les fautes de frappe', () => {
    expect(messages({ ...pirogue, prcing: {} }).join()).toMatch(/unrecognized/i);
  });
});

describe('catégorie', () => {
  const category = categorySchema(z.string());
  const aventure = {
    name: { fr: 'Aventure', en: 'Adventure' },
    order: 20,
    image: { src: 'aventure.jpg', alt: { fr: 'Jet-ski', en: 'Jet ski' } },
  };

  it('accepte une catégorie conforme et refuse un nom absent', () => {
    expect(category.safeParse(aventure).success).toBe(true);
    expect(category.safeParse(omit(aventure, 'name')).success).toBe(false);
  });

  it('exige une image avec son texte alternatif', () => {
    expect(category.safeParse(omit(aventure, 'image')).success).toBe(false);
    expect(category.safeParse({ ...aventure, image: { src: 'aventure.jpg' } }).success).toBe(false);
  });
});

describe('coordonnées et identité de Kibreeze', () => {
  const company = {
    brand: 'Kibreeze',
    group: 'Breezy Groupe',
    sisterBrands: ['TKS®', 'iBreezy', 'Breezy Delivery'],
    locality: { fr: 'Kribi, Cameroun', en: 'Kribi, Cameroon' },
    social: [],
    about: {
      short: { fr: 'Nous sommes Kibreeze.', en: 'We are Kibreeze.' },
      full: { fr: 'Nous sommes Kibreeze, à Kribi.', en: 'We are Kibreeze, in Kribi.' },
    },
    legal: {
      host: {
        name: 'Cloudflare, Inc.',
        address: '101 Townsend St, San Francisco, CA 94107, États-Unis',
        url: 'https://www.cloudflare.com',
      },
    },
  };

  it('accepte un fichier sans e-mail, sans réseau et sans identité légale hormis l’hébergeur', () => {
    expect(companySchema.safeParse(company).success).toBe(true);
  });

  it('exige l’hébergeur', () => {
    expect(companySchema.safeParse({ ...company, legal: {} }).success).toBe(false);
  });

  it('refuse un réseau social hors https ou inconnu', () => {
    const facebook = { network: 'facebook', url: 'https://facebook.com/kibreeze' };
    expect(companySchema.safeParse({ ...company, social: [facebook] }).success).toBe(true);
    expect(
      companySchema.safeParse({
        ...company,
        social: [{ network: 'facebook', url: 'http://facebook.com/kibreeze' }],
      }).success,
    ).toBe(false);
    expect(
      companySchema.safeParse({ ...company, social: [{ ...facebook, network: 'myspace' }] })
        .success,
    ).toBe(false);
  });

  it('valide un e-mail fourni', () => {
    expect(companySchema.safeParse({ ...company, email: 'contact@kibreeze.com' }).success).toBe(
      true,
    );
    expect(companySchema.safeParse({ ...company, email: 'pas-un-email' }).success).toBe(false);
  });
});

describe('taux de change', () => {
  it('exige un taux strictement positif', () => {
    const currency = { eurToXaf: 655.957, source: 'BEAC', since: '1999-01-01' };
    expect(currencySchema.safeParse(currency).success).toBe(true);
    expect(currencySchema.safeParse({ ...currency, eurToXaf: 0 }).success).toBe(false);
  });
});

describe('aperçus de l’accueil', () => {
  const home = homeSchema(z.string());
  const chambre = {
    id: 'chambre',
    title: { fr: 'Chambre', en: 'Room' },
    price: { kind: 'from', amount: 15000, unit: 'per_night' },
  };
  const decouverte = {
    id: 'decouverte',
    title: { fr: 'Package Découverte', en: 'Discovery package' },
    price: { kind: 'fixed', amount: 100000, unit: 'per_group', basePersons: 2 },
  };

  it('accepte des aperçus conformes, avec ou sans photo', () => {
    expect(home.safeParse({ accommodation: [chambre], packages: [decouverte] }).success).toBe(true);
  });

  it('exige un montant entier strictement positif', () => {
    const invalid = { ...chambre, price: { ...chambre.price, amount: 0 } };
    expect(home.safeParse({ accommodation: [invalid], packages: [] }).success).toBe(false);
  });

  it('limite les unités et exige basePersons pour un prix de groupe', () => {
    const perPerson = { ...chambre, price: { ...chambre.price, unit: 'per_person' } };
    expect(home.safeParse({ accommodation: [perPerson], packages: [] }).success).toBe(false);
    const withoutBase = {
      ...decouverte,
      price: { kind: 'fixed', amount: 100000, unit: 'per_group' },
    };
    expect(home.safeParse({ accommodation: [], packages: [withoutBase] }).success).toBe(false);
  });
});

describe('document légal', () => {
  const privacy = {
    doc: 'privacy',
    locale: 'fr',
    title: 'Confidentialité et cookies',
    description: 'Comment Kibreeze traite vos données.',
    updatedAt: '2026-10-05',
  };

  it('accepte un frontmatter conforme', () => {
    expect(legalSchema.safeParse(privacy).success).toBe(true);
  });

  it('refuse un document ou une langue inconnus', () => {
    expect(legalSchema.safeParse({ ...privacy, doc: 'cgv' }).success).toBe(false);
    expect(legalSchema.safeParse({ ...privacy, locale: 'de' }).success).toBe(false);
  });

  it('limite la description à 160 caractères et exige une date ISO', () => {
    expect(legalSchema.safeParse({ ...privacy, description: 'x'.repeat(161) }).success).toBe(false);
    expect(legalSchema.safeParse({ ...privacy, updatedAt: '05/10/2026' }).success).toBe(false);
  });
});

describe('cohérence du catalogue', () => {
  it('signale un categoryId inconnu', () => {
    const issues = catalogIssues(
      ['nature-decouverte'],
      [
        { id: 'excursion-en-pirogue', data: { categoryId: 'nature-decouverte' } },
        { id: 'quad', data: { categoryId: 'aventur' } },
      ],
    );
    expect(issues).toEqual([
      'services/quad : categoryId « aventur » ne correspond à aucune catégorie',
    ]);
  });
});
