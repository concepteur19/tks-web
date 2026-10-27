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
  categoryId: 'activites',
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

describe('prix de groupe avec nombre de personnes (004)', () => {
  it('accepte une dimension persons sur un prix de groupe, pour la capacité', () => {
    expect(
      messages({
        ...pirogue,
        quantity: { dimensions: [{ kind: 'persons', min: 1, max: 20, default: 2 }] },
      }),
    ).toEqual([]);
  });

  it('refuse toujours une durée sur un prix de groupe', () => {
    expect(
      messages({
        ...pirogue,
        quantity: { dimensions: [{ kind: 'days', min: 1, max: 5, default: 1 }] },
      }).join(),
    ).toContain('per_group');
  });
});

describe('lieu et options (003)', () => {
  const guide = {
    title: { fr: 'Guide touristique', en: 'Tour guide' },
    section: 'experience',
    isOption: true,
    shortDescription: { fr: 'Un guide local', en: 'A local guide' },
    description: { fr: 'Un guide local vous accompagne.', en: 'A local guide comes along.' },
    pricing: { kind: 'fixed', amount: 5000, unit: 'per_service' },
    quantity: { dimensions: [] },
  };

  it('accepte un lieu localisé', () => {
    expect(
      messages({ ...pirogue, location: { fr: 'Embouchure de la Lobé', en: 'Lobé estuary' } }),
    ).toEqual([]);
  });

  it('accepte une option sans catégorie ni image', () => {
    expect(messages(guide)).toEqual([]);
  });

  it('exige une catégorie pour une expérience qui n’est pas une option', () => {
    expect(messages(omit(pirogue, 'categoryId')).join()).toContain('categoryId');
  });

  it('exige au moins une image pour une expérience qui n’est pas une option', () => {
    expect(messages(omit(pirogue, 'images')).join()).toContain('images');
    expect(messages({ ...pirogue, images: [] }).join()).toContain('images');
  });
});

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

describe('univers', () => {
  const universe = categorySchema(z.string());
  const activites = {
    name: { fr: 'Activités & Loisirs', en: 'Activities & Leisure' },
    description: { fr: 'Vivre des expériences entre mer et nature.', en: 'Sea and nature.' },
    urlSlug: { fr: 'activites', en: 'activities' },
    order: 20,
    image: { src: 'jet-ski.jpg', alt: { fr: 'Jet-ski', en: 'Jet ski' } },
  };

  it('accepte un univers conforme et refuse un nom absent', () => {
    expect(universe.safeParse(activites).success).toBe(true);
    expect(universe.safeParse(omit(activites, 'name')).success).toBe(false);
  });

  it('exige une phrase de présentation et une adresse par langue', () => {
    expect(universe.safeParse(omit(activites, 'description')).success).toBe(false);
    expect(universe.safeParse(omit(activites, 'urlSlug')).success).toBe(false);
    expect(universe.safeParse({ ...activites, urlSlug: { fr: 'activites' } }).success).toBe(false);
  });

  it('refuse une adresse qui n’est pas en minuscules et tirets', () => {
    for (const fr of ['Activites', 'activités', 'activites-', 'a b', '-activites']) {
      expect(universe.safeParse({ ...activites, urlSlug: { fr, en: 'activities' } }).success).toBe(
        false,
      );
    }
    expect(
      universe.safeParse({
        ...activites,
        urlSlug: { fr: 'specialites-culinaires', en: 'local-food' },
      }).success,
    ).toBe(true);
  });

  it('accepte withOptions booléen et refuse un champ inconnu', () => {
    expect(universe.safeParse({ ...activites, withOptions: false }).success).toBe(true);
    expect(universe.safeParse({ ...activites, withOptions: 'non' }).success).toBe(false);
    expect(universe.safeParse({ ...activites, slugz: {} }).success).toBe(false);
  });

  it('exige une image avec son texte alternatif', () => {
    expect(universe.safeParse(omit(activites, 'image')).success).toBe(false);
    expect(universe.safeParse({ ...activites, image: { src: 'jet-ski.jpg' } }).success).toBe(false);
  });
});

describe('dégressivité et images illustratives (008)', () => {
  it('accepte degressive booléen', () => {
    expect(schema.safeParse({ ...kayak, degressive: true }).success).toBe(true);
    expect(schema.safeParse({ ...kayak, degressive: 'oui' }).success).toBe(false);
  });

  it('accepte une image marquée illustrative', () => {
    const image = { ...pirogue.images[0]!, illustrative: true };
    expect(schema.safeParse({ ...kayak, images: [image] }).success).toBe(true);
    expect(schema.safeParse({ ...kayak, images: [{ ...image, illustrative: 1 }] }).success).toBe(
      false,
    );
  });
});

describe('cadrage et photo à venir (010)', () => {
  const photo = pirogue.images[0]!;
  const withImage = (image: object) => ({ ...kayak, images: [{ ...photo, ...image }] });

  it('accepte un cadrage « X% Y% » de 0 à 100 %, refuse le reste', () => {
    expect(messages(withImage({ focus: '50% 70%' }))).toEqual([]);
    expect(messages(withImage({ focus: '0% 100%' }))).toEqual([]);
    for (const focus of ['50 %', '120% 10%', 'haut', '50%', '-5% 10%']) {
      expect(messages(withImage({ focus })).length, focus).toBeGreaterThan(0);
    }
  });

  it('accepte une photo à venir, jamais en même temps qu’illustrative', () => {
    expect(messages(withImage({ upcoming: true }))).toEqual([]);
    expect(messages(withImage({ upcoming: true, illustrative: true })).join()).toContain(
      'upcoming et illustrative s’excluent',
    );
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
  const universes = [
    { id: 'visites', urlSlug: { fr: 'visites', en: 'visits' } },
    { id: 'activites', urlSlug: { fr: 'activites', en: 'activities' } },
  ];

  it('accepte un catalogue cohérent', () => {
    expect(
      catalogIssues(universes, [
        { id: 'excursion-en-pirogue', data: { categoryId: 'activites' } },
        { id: 'guide-touristique', data: {} },
      ]),
    ).toEqual([]);
  });

  it('signale un categoryId inconnu', () => {
    const issues = catalogIssues(universes, [
      { id: 'excursion-en-pirogue', data: { categoryId: 'activites' } },
      { id: 'quad', data: { categoryId: 'aventur' } },
    ]);
    expect(issues).toEqual([
      'services/quad : categoryId « aventur » ne correspond à aucun univers',
    ]);
  });

  it('signale une prestation dont l’identifiant est l’adresse d’un univers, dans chaque langue', () => {
    expect(
      catalogIssues(universes, [
        { id: 'visits', data: { categoryId: 'visites' } },
        { id: 'activites', data: { categoryId: 'activites' } },
      ]),
    ).toEqual([
      'services/visits : identifiant identique à l’adresse de l’univers « visites »',
      'services/activites : identifiant identique à l’adresse de l’univers « activites »',
    ]);
  });

  it('signale une adresse d’univers utilisée deux fois dans une langue', () => {
    expect(
      catalogIssues(
        [...universes, { id: 'saveurs', urlSlug: { fr: 'saveurs', en: 'activities' } }],
        [],
      ),
    ).toEqual(['categories/saveurs → urlSlug.en : déjà utilisé par l’univers « activites »']);
  });
});

describe('hébergements, parcours et formules (005)', () => {
  const base = {
    title: {
      fr: 'Studio, à partir de 30 000 FCFA la nuit',
      en: 'Studio, from 30,000 FCFA a night',
    },
    shortDescription: { fr: 'Un studio', en: 'A studio' },
    description: { fr: 'Un studio.', en: 'A studio.' },
    images: [{ src: 'studio.jpg', alt: { fr: 'Studio', en: 'Studio' } }],
  };
  const studio = {
    ...base,
    section: 'hebergement',
    accommodationType: 'studio',
    pricing: { kind: 'from', amount: 30000, unit: 'per_night' },
    quantity: { dimensions: [{ kind: 'nights', min: 1, max: 30, default: 1 }] },
  };
  const tour = {
    ...base,
    section: 'parcours',
    steps: [
      { label: { fr: 'Chutes', en: 'Falls' }, serviceId: 'chutes-de-la-lobe' },
      { label: { fr: 'Fleuve Lobé', en: 'Lobé River' } },
    ],
    pricing: { kind: 'from', amount: 30000, unit: 'per_person' },
    quantity: { dimensions: [{ kind: 'persons', min: 2, max: 20, default: 2 }] },
    degressive: true,
  };
  const formule = {
    ...base,
    section: 'formule',
    serviceIds: ['chutes-de-la-lobe', 'guide-touristique'],
    pricing: { kind: 'fixed', amount: 100000, unit: 'per_couple' },
    quantity: { dimensions: [] },
    badge: { fr: 'Le plus complet', en: 'The most complete' },
  };

  it('accepte un palier, un parcours et une formule conformes', () => {
    expect(messages(studio)).toEqual([]);
    expect(messages(tour)).toEqual([]);
    expect(messages(formule)).toEqual([]);
  });

  it('exige le champ propre à chaque section', () => {
    expect(messages(omit(studio, 'accommodationType')).join()).toContain(
      'accommodationType est obligatoire pour un hébergement',
    );
    expect(messages(omit(tour, 'steps')).join()).toContain(
      'steps est obligatoire pour un parcours',
    );
    expect(messages(omit(formule, 'serviceIds')).join()).toContain(
      'serviceIds est obligatoire pour une formule',
    );
  });

  it('refuse ces champs hors de leur section', () => {
    expect(messages({ ...kayak, accommodationType: 'villa' }).join()).toContain(
      'accommodationType n’est permis que pour un hébergement',
    );
    expect(messages({ ...kayak, steps: tour.steps }).join()).toContain(
      'steps n’est permis que pour un parcours',
    );
    expect(messages({ ...kayak, serviceIds: ['quad', 'kayak'] }).join()).toContain(
      'serviceIds n’est permis que pour une formule',
    );
  });

  it('exige deux étapes et deux prestations au moins, et un type connu', () => {
    expect(messages({ ...tour, steps: [tour.steps[0]] }).length).toBeGreaterThan(0);
    expect(messages({ ...formule, serviceIds: ['quad'] }).length).toBeGreaterThan(0);
    // Un groupe au choix compte pour une prestation et réunit au moins deux prestations.
    expect(messages({ ...formule, serviceIds: ['chutes-de-la-lobe', ['kayak', 'quad']] })).toEqual(
      [],
    );
    expect(
      messages({ ...formule, serviceIds: ['chutes-de-la-lobe', ['kayak']] }).length,
    ).toBeGreaterThan(0);
    expect(messages({ ...studio, accommodationType: 'chalet' }).length).toBeGreaterThan(0);
  });
});

describe('mobilité (006)', () => {
  const vehicle = {
    title: { fr: 'Premium', en: 'Premium' },
    section: 'mobilite',
    models: ['Toyota RAV4', 'Toyota Avensis'],
    shortDescription: { fr: 'Berlines et SUV', en: 'Saloons and SUVs' },
    description: { fr: 'Un véhicule.', en: 'A vehicle.' },
    images: [{ src: 'premium.jpg', alt: { fr: 'RAV4', en: 'RAV4' } }],
    pricing: { kind: 'from', amount: 35000, unit: 'per_day' },
    quantity: {
      dimensions: [
        {
          kind: 'units',
          label: { fr: 'véhicules', en: 'vehicles' },
          labelOne: { fr: 'véhicule', en: 'vehicle' },
          min: 1,
          max: 5,
          default: 1,
        },
        { kind: 'days', min: 1, max: 30, default: 1 },
      ],
    },
  };
  const driver = {
    ...omit(vehicle, 'models'),
    title: { fr: 'Chauffeur privé', en: 'Private driver' },
    pricing: { kind: 'quote' },
    quantity: { dimensions: [{ kind: 'hours', min: 1, max: 24, default: 4 }] },
  };

  it('accepte une catégorie de véhicule (par jour, véhicules × jours) et un service sur devis', () => {
    expect(messages(vehicle)).toEqual([]);
    expect(messages(driver)).toEqual([]);
  });

  it('laisse models facultatif dans la mobilité, mais exige au moins un modèle', () => {
    expect(messages(omit(vehicle, 'models'))).toEqual([]);
    expect(messages({ ...vehicle, models: [] }).length).toBeGreaterThan(0);
  });

  it('refuse models hors de la mobilité', () => {
    expect(messages({ ...kayak, models: ['Toyota Yaris'] }).join()).toContain(
      'models n’est permis que pour la mobilité',
    );
  });
});

describe('références et titres (005)', () => {
  const universes = [{ id: 'visites', urlSlug: { fr: 'visites', en: 'visits' } }];
  const published = [
    { id: 'chutes-de-la-lobe', data: { categoryId: 'visites', section: 'experience' as const } },
    { id: 'guide-touristique', data: { section: 'experience' as const, isOption: true } },
    {
      id: 'bateau-de-plaisance',
      data: {
        categoryId: 'visites',
        section: 'experience' as const,
        availability: 'disabled' as const,
      },
    },
  ];

  it('accepte des références vers une expérience ou une option publiées', () => {
    expect(
      catalogIssues(universes, [
        ...published,
        {
          id: 'essentiel',
          data: {
            section: 'parcours' as const,
            steps: [
              { label: { fr: 'Chutes' }, serviceId: 'chutes-de-la-lobe' },
              { label: { fr: 'Fleuve' } },
            ],
          },
        },
        {
          id: 'formule-decouverte',
          data: {
            section: 'formule' as const,
            serviceIds: ['chutes-de-la-lobe', 'guide-touristique'],
          },
        },
      ]),
    ).toEqual([]);
  });

  it('signale une étape ou une formule vers une prestation inconnue ou désactivée', () => {
    expect(
      catalogIssues(universes, [
        ...published,
        {
          id: 'essentiel',
          data: {
            section: 'parcours' as const,
            steps: [
              { label: { fr: 'A' }, serviceId: 'chutes-de-la-lobe' },
              { label: { fr: 'B' }, serviceId: 'inconnue' },
            ],
          },
        },
        {
          id: 'formule-premium',
          data: {
            section: 'formule' as const,
            serviceIds: ['chutes-de-la-lobe', 'bateau-de-plaisance'],
          },
        },
      ]),
    ).toEqual([
      'services/essentiel → steps[1] : « inconnue » ne correspond à aucune prestation publiée',
      'services/formule-premium → serviceIds : « bateau-de-plaisance » ne correspond à aucune prestation publiée',
    ]);
  });

  it('signale un hébergement dont le titre ne cite pas son prix', () => {
    const palier = (fr: string, en: string) => ({
      id: 'studio-30000',
      data: {
        section: 'hebergement' as const,
        title: { fr, en },
        pricing: { kind: 'from' as const, amount: 30000, unit: 'per_night' as const },
      },
    });
    expect(
      catalogIssues(universes, [
        palier('Studio, à partir de 30 000 FCFA la nuit', 'Studio, from 30,000 FCFA a night'),
      ]),
    ).toEqual([]);
    expect(
      catalogIssues(universes, [
        palier('Studio, à partir de 300 000 FCFA la nuit', 'Studio, from 35,000 FCFA a night'),
      ]),
    ).toEqual([
      'services/studio-30000 → title.fr : le titre doit citer le prix « 30 000 »',
      'services/studio-30000 → title.en : le titre doit citer le prix « 30,000 »',
    ]);
  });
});
