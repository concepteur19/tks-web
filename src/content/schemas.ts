/**
 * Schémas des fichiers de contenu — contrat : specs/001-project-foundation/contracts/content-schema.md,
 * sémantique : docs/data-model.md.
 *
 * Module pur, sans dépendance à Astro : les tests et les scripts de contrôle l'importent
 * directement, et src/content.config.ts le branche sur les collections.
 */
import { z } from 'zod';

/** Le français est obligatoire ; l'anglais est exigé au build de production (scripts/check-i18n.ts). */
export const localizedString = z.object({
  fr: z.string().trim().min(1),
  en: z.string().trim().min(1).optional(),
});

export const SECTIONS = ['experience', 'hebergement', 'formule', 'mobilite'] as const;

export const PRICE_UNITS = [
  'per_person',
  'per_group',
  'per_equipment',
  'per_hour',
  'per_day',
  'per_night',
  'per_session',
  'per_trip',
  'per_service',
] as const;
export type PriceUnit = (typeof PRICE_UNITS)[number];

const DURATION_KINDS = ['days', 'nights', 'hours'] as const;

const bounds = {
  min: z.number().int().min(1),
  max: z.number().int().max(50),
  default: z.number().int(),
};

export const quantityDimension = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('persons'), ...bounds }),
  z.object({ kind: z.literal('units'), label: localizedString, ...bounds }),
  z.object({ kind: z.literal('days'), ...bounds }),
  z.object({ kind: z.literal('nights'), ...bounds }),
  z.object({ kind: z.literal('hours'), ...bounds }),
]);
export type QuantityDimension = z.infer<typeof quantityDimension>;

export const quantityRule = z.object({
  dimensions: z.array(quantityDimension).max(2, 'au plus deux dimensions de quantité'),
});
export type QuantityRule = z.infer<typeof quantityRule>;

const amount = z.number().int().positive('le montant doit être un entier strictement positif');

export const pricing = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('fixed'),
    amount,
    unit: z.enum(PRICE_UNITS),
    maxCapacity: z.number().int().positive().optional(),
  }),
  z.object({
    kind: z.literal('from'),
    amount,
    unit: z.enum(PRICE_UNITS),
    maxCapacity: z.number().int().positive().optional(),
  }),
  z.object({ kind: z.literal('quote') }),
]);
export type Pricing = z.infer<typeof pricing>;

/** Dimension qu'une unité de prix exige. Les autres unités acceptent zéro ou une dimension `units`. */
const REQUIRED_DIMENSION: Partial<Record<PriceUnit, QuantityDimension['kind']>> = {
  per_person: 'persons',
  per_day: 'days',
  per_night: 'nights',
  per_hour: 'hours',
  per_equipment: 'units',
};

/** Règles qui croisent les dimensions entre elles et avec le prix. Renvoie des messages lisibles. */
export function quantityIssues(rule: QuantityRule, price: Pricing): string[] {
  const issues: string[] = [];
  const kinds = rule.dimensions.map((dimension) => dimension.kind);

  for (const dimension of rule.dimensions) {
    if (dimension.min > dimension.default) {
      issues.push(
        `dimension ${dimension.kind} : min (${dimension.min}) supérieur à default (${dimension.default})`,
      );
    }
    if (dimension.default > dimension.max) {
      issues.push(
        `dimension ${dimension.kind} : default (${dimension.default}) supérieur à max (${dimension.max})`,
      );
    }
  }
  if (new Set(kinds).size !== kinds.length) issues.push('la même dimension apparaît deux fois');
  if (kinds.filter((kind) => (DURATION_KINDS as readonly string[]).includes(kind)).length > 1) {
    issues.push('au plus une dimension de durée (days, nights ou hours)');
  }

  if (price.kind === 'quote') return issues;

  const required = REQUIRED_DIMENSION[price.unit];
  if (required && !kinds.includes(required)) {
    issues.push(`l'unité ${price.unit} exige une dimension ${required}`);
  }
  if (!required && kinds.some((kind) => kind !== 'units')) {
    issues.push(`l'unité ${price.unit} n'accepte qu'une dimension units, ou aucune`);
  }
  if (price.maxCapacity !== undefined && price.unit !== 'per_group') {
    issues.push('maxCapacity ne s’applique qu’à un prix per_group');
  }
  return issues;
}

export const categorySchema = z
  .object({
    name: localizedString,
    description: localizedString.optional(),
    order: z.number().int(),
    provisional: z.boolean().optional(),
  })
  .strict();
export type Category = z.infer<typeof categorySchema>;

/**
 * Le schéma d'image est injecté : une chaîne dans les tests et les scripts, le helper `image()`
 * d'Astro quand les photos réelles arriveront (feature 003).
 */
export function serviceSchema<Src extends z.ZodTypeAny>(src: Src) {
  const priceTier = z
    .object({
      id: z.string().min(1),
      label: localizedString,
      pricing,
      /** Remplace la règle de quantité du service pour ce tarif : le campement Bagyeli compte des
       *  personnes au tarif individuel, mais aucune au tarif couple. */
      quantity: quantityRule.optional(),
    })
    .strict();

  return z
    .object({
      title: localizedString,
      section: z.enum(SECTIONS),
      categoryId: z.string().min(1).optional(),
      isOption: z.boolean().optional(),
      shortDescription: localizedString.refine(
        (value) => value.fr.length <= 160 && (value.en ?? '').length <= 160,
        '160 caractères au plus par langue',
      ),
      description: localizedString,
      images: z
        .array(z.object({ src, alt: localizedString }).strict())
        .min(1, 'au moins une image'),
      pricing: pricing.optional(),
      tiers: z.array(priceTier).min(2).optional(),
      quantity: quantityRule,
      duration: localizedString.optional(),
      capacity: z
        .object({
          min: z.number().int().positive().optional(),
          max: z.number().int().positive().optional(),
        })
        .strict()
        .optional(),
      conditions: z
        .object({
          included: z.array(localizedString).optional(),
          excluded: z.array(localizedString).optional(),
          notes: z.array(localizedString).optional(),
        })
        .strict()
        .optional(),
      availability: z.enum(['available', 'on_request', 'disabled']).default('available'),
      featured: z.boolean().optional(),
      order: z.number().int().optional(),
      seo: z
        .object({ title: localizedString.optional(), description: localizedString.optional() })
        .strict()
        .optional(),
      provisional: z.boolean().optional(),
    })
    .strict()
    .superRefine((service, ctx) => {
      const fail = (message: string, path: (string | number)[] = []) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });

      if (service.section === 'experience' && !service.categoryId) {
        fail('categoryId est obligatoire pour une expérience', ['categoryId']);
      }
      if (!service.pricing === !service.tiers) {
        fail('un service porte soit pricing, soit tiers, jamais les deux ni aucun', ['pricing']);
      }
      if (service.pricing) {
        for (const issue of quantityIssues(service.quantity, service.pricing))
          fail(issue, ['quantity']);
      }
      service.tiers?.forEach((tier, index) => {
        for (const issue of quantityIssues(tier.quantity ?? service.quantity, tier.pricing)) {
          fail(issue, ['tiers', index]);
        }
      });
    });
}
export type Service = z.infer<ReturnType<typeof serviceSchema<z.ZodString>>>;

/** Contrôle transversal, que le schéma d'un fichier isolé ne peut pas faire. */
export function catalogIssues(
  categoryIds: Iterable<string>,
  services: { id: string; data: Pick<Service, 'categoryId'> }[],
): string[] {
  const known = new Set(categoryIds);
  return services
    .filter((service) => service.data.categoryId && !known.has(service.data.categoryId))
    .map(
      (service) =>
        `services/${service.id} : categoryId « ${service.data.categoryId} » ne correspond à aucune catégorie`,
    );
}
