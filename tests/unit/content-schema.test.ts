import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { catalogIssues, categorySchema, serviceSchema } from '../../src/content/schemas.ts';

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
  it('accepte une catégorie conforme et refuse un nom absent', () => {
    expect(
      categorySchema.safeParse({ name: { fr: 'Aventure', en: 'Adventure' }, order: 20 }).success,
    ).toBe(true);
    expect(categorySchema.safeParse({ order: 20 }).success).toBe(false);
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
