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

export const SECTIONS = ['experience', 'hebergement', 'parcours', 'formule', 'mobilite'] as const;

export const ACCOMMODATION_TYPES = ['chambre', 'studio', 'appartement', 'villa'] as const;

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
  /** Formules : prix pour deux personnes (005). */
  'per_couple',
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
  z.object({
    kind: z.literal('units'),
    label: localizedString,
    /** Libellé au singulier (« session »), utilisé quand la quantité vaut 1. */
    labelOne: localizedString.optional(),
    ...bounds,
  }),
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
  // Un prix de groupe accepte une dimension persons : elle ne multiplie pas le prix, elle sert à
  // vérifier la capacité maximale et à compter les options facturées par personne (feature 004).
  const informative = (kind: QuantityDimension['kind']) =>
    kind === 'units' || (price.unit === 'per_group' && kind === 'persons');
  if (!required && !kinds.every(informative)) {
    issues.push(
      price.unit === 'per_group'
        ? `l'unité per_group n'accepte qu'une dimension units ou persons, ou aucune`
        : `l'unité ${price.unit} n'accepte qu'une dimension units, ou aucune`,
    );
  }
  if (price.maxCapacity !== undefined && price.unit !== 'per_group') {
    issues.push('maxCapacity ne s’applique qu’à un prix per_group');
  }
  return issues;
}

/** Image de contenu : le schéma de `src` est injecté, comme pour les services. */
function imageSchema<Src extends z.ZodTypeAny>(src: Src) {
  return z
    .object({
      src,
      alt: localizedString,
      /** Image générée, en attendant une photo réelle : étiquetée « Photo illustrative » (008). */
      illustrative: z.boolean().optional(),
      /** Photo de remplacement, sans le sujet : étiquetée « Photo à venir » (010). */
      upcoming: z.boolean().optional(),
      /** Point gardé visible quand la photo est recadrée, « X% Y% » (010). */
      focus: z
        .string()
        .regex(/^(100|[1-9]?\d)% (100|[1-9]?\d)%$/, 'cadrage « X% Y% », de 0 à 100 %')
        .optional(),
    })
    .strict()
    .refine((image) => !(image.illustrative && image.upcoming), {
      message: 'upcoming et illustrative s’excluent',
    });
}

/** Segment d'adresse : minuscules, chiffres et tirets, sans tiret au bord. */
const slugSegment = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'minuscules, chiffres et tirets seulement');

export function categorySchema<Src extends z.ZodTypeAny>(src: Src) {
  return z
    .object({
      name: localizedString,
      description: localizedString,
      /**
       * Adresse de la page de l'univers, par langue (008). Pas `slug` : Astro réserve ce nom
       * pour l'identifiant de l'entrée.
       */
      urlSlug: z.object({ fr: slugSegment, en: slugSegment }).strict(),
      order: z.number().int(),
      image: imageSchema(src),
      /** `false` : aucune option sur les fiches de cet univers (008, FR-016). */
      withOptions: z.boolean().optional(),
      provisional: z.boolean().optional(),
    })
    .strict();
}
export type Category = z.infer<ReturnType<typeof categorySchema<z.ZodString>>>;

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
      /** Au moins une image, sauf pour une option, qui n'a pas de carte (feature 003). */
      images: z.array(imageSchema(src)).min(1, 'au moins une image').optional(),
      pricing: pricing.optional(),
      tiers: z.array(priceTier).min(2).optional(),
      quantity: quantityRule,
      duration: localizedString.optional(),
      /** Lieu ou point de départ, affiché dans la ligne d'informations de la fiche. */
      location: localizedString.optional(),
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
      /** Mention « tarif dégressif » sur la fiche, sans paliers (008, FR-018). */
      degressive: z.boolean().optional(),
      featured: z.boolean().optional(),
      order: z.number().int().optional(),
      seo: z
        .object({ title: localizedString.optional(), description: localizedString.optional() })
        .strict()
        .optional(),
      provisional: z.boolean().optional(),
      /** Hébergement (005) : type de logement, qui groupe les paliers sur la page. */
      accommodationType: z.enum(ACCOMMODATION_TYPES).optional(),
      /** Parcours (005) : étapes dans l'ordre ; `serviceId` mène à la fiche quand elle existe. */
      steps: z
        .array(
          z.object({ label: localizedString, serviceId: z.string().min(1).optional() }).strict(),
        )
        .min(2, 'au moins deux étapes')
        .optional(),
      /** Formule (005) : prestations du catalogue qu'elle contient. */
      serviceIds: z.array(z.string().min(1)).min(2, 'au moins deux prestations').optional(),
      /** Étiquette de carte (« Le plus complet »). */
      badge: localizedString.optional(),
      /** Mobilité (006) : modèles d'une catégorie de véhicule. Absent pour un service. */
      models: z.array(z.string().min(1)).min(1, 'au moins un modèle').optional(),
    })
    .strict()
    .superRefine((service, ctx) => {
      const fail = (message: string, path: (string | number)[] = []) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });

      if (service.section === 'experience' && !service.isOption && !service.categoryId) {
        fail('categoryId est obligatoire pour une expérience', ['categoryId']);
      }
      const sectionFields = [
        ['accommodationType', 'hebergement', 'un hébergement'],
        ['steps', 'parcours', 'un parcours'],
        ['serviceIds', 'formule', 'une formule'],
        ['models', 'mobilite', 'la mobilité', { optional: true }],
      ] as const;
      for (const [field, section, label, rule] of sectionFields) {
        const present = service[field] !== undefined;
        if (service.section === section && !present && !rule?.optional) {
          fail(`${field} est obligatoire pour ${label}`, [field]);
        }
        if (service.section !== section && present) {
          fail(`${field} n’est permis que pour ${label}`, [field]);
        }
      }
      if (!service.isOption && !service.images) {
        fail('au moins une image', ['images']);
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

/** Montant groupé par milliers : `30000` → « 30 000 » (séparateur au choix). */
const groupThousands = (amount: number, separator: string) =>
  String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

/** Le titre cite-t-il le montant, en entier (« 30 000 » mais pas « 300 000 ») ? */
function citesAmount(title: string, amount: number, separators: string): boolean {
  const digits = groupThousands(amount, '|').split('|').join(`[${separators}]`);
  return new RegExp(`(?<!\\d[${separators}]?)${digits}(?![${separators}]?\\d)`).test(title);
}

type CatalogEntry = {
  id: string;
  data: Partial<
    Pick<
      Service,
      | 'categoryId'
      | 'section'
      | 'isOption'
      | 'availability'
      | 'title'
      | 'pricing'
      | 'steps'
      | 'serviceIds'
    >
  >;
};

/** Contrôle transversal, que le schéma d'un fichier isolé ne peut pas faire. */
export function catalogIssues(
  universes: { id: string; urlSlug: { fr: string; en: string } }[],
  services: CatalogEntry[],
): string[] {
  const issues: string[] = [];
  const known = new Set(universes.map((universe) => universe.id));
  // Ce qu'un parcours ou une formule peut citer : expériences et options publiées (005).
  const published = new Set(
    services
      .filter((service) => (service.data.section ?? 'experience') === 'experience')
      .filter((service) => service.data.availability !== 'disabled')
      .map((service) => service.id),
  );
  const unknown = (id: string) => `« ${id} » ne correspond à aucune prestation publiée`;
  for (const service of services) {
    const { data } = service;
    if (data.categoryId && !known.has(data.categoryId)) {
      issues.push(
        `services/${service.id} : categoryId « ${data.categoryId} » ne correspond à aucun univers`,
      );
    }
    const clash = universes.find(
      (universe) => universe.urlSlug.fr === service.id || universe.urlSlug.en === service.id,
    );
    if (clash) {
      issues.push(
        `services/${service.id} : identifiant identique à l’adresse de l’univers « ${clash.id} »`,
      );
    }
    data.steps?.forEach((step, index) => {
      if (step.serviceId && !published.has(step.serviceId)) {
        issues.push(`services/${service.id} → steps[${index}] : ${unknown(step.serviceId)}`);
      }
    });
    for (const id of data.serviceIds ?? []) {
      if (!published.has(id)) issues.push(`services/${service.id} → serviceIds : ${unknown(id)}`);
    }
    // Le titre d'un palier cite son prix (ligne de séjour, message) : il doit rester juste (005).
    if (data.section === 'hebergement' && data.title && data.pricing?.kind === 'from') {
      const { amount } = data.pricing;
      const rules = [
        ['fr', ' \\u00a0\\u202f', ' '],
        ['en', ',', ','],
      ] as const;
      for (const [locale, separators, shown] of rules) {
        if (!citesAmount(data.title[locale] ?? '', amount, separators)) {
          issues.push(
            `services/${service.id} → title.${locale} : le titre doit citer le prix « ${groupThousands(amount, shown)} »`,
          );
        }
      }
    }
  }
  for (const locale of ['fr', 'en'] as const) {
    const seen = new Map<string, string>();
    for (const universe of universes) {
      const owner = seen.get(universe.urlSlug[locale]);
      if (owner) {
        issues.push(
          `categories/${universe.id} → urlSlug.${locale} : déjà utilisé par l’univers « ${owner} »`,
        );
      } else {
        seen.set(universe.urlSlug[locale], universe.id);
      }
    }
  }
  return issues;
}

/* ——— Fichiers du site (feature 002) : specs/002-kibreeze-core/contracts/content.md ——— */

const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith('https://'), 'adresse https attendue');

/** Coordonnées et identité légale. Tout champ facultatif absent est simplement omis à l'affichage. */
export const companySchema = z
  .object({
    brand: z.literal('Kibreeze'),
    group: z.string().min(1),
    sisterBrands: z.array(z.string().min(1)).min(1),
    locality: localizedString,
    email: z.string().email().optional(),
    social: z
      .array(
        z.object({ network: z.enum(['facebook', 'instagram', 'tiktok']), url: httpsUrl }).strict(),
      )
      .default([]),
    about: z.object({ short: localizedString, full: localizedString }).strict(),
    legal: z
      .object({
        publisherName: z.string().min(1).optional(),
        legalForm: z.string().min(1).optional(),
        registration: z
          .object({ rccm: z.string().min(1).optional(), niu: z.string().min(1).optional() })
          .strict()
          .optional(),
        address: z.string().min(1).optional(),
        publicationDirector: z.string().min(1).optional(),
        host: z
          .object({ name: z.string().min(1), address: z.string().min(1), url: httpsUrl })
          .strict(),
      })
      .strict(),
  })
  .strict();
export type Company = z.infer<typeof companySchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date ISO AAAA-MM-JJ attendue');

export const currencySchema = z
  .object({ eurToXaf: z.number().positive(), source: z.string().min(1), since: isoDate })
  .strict();
export type Currency = z.infer<typeof currencySchema>;

/** Aperçus temporaires de l'accueil, supprimés par la feature 005. */
export function homeSchema<Src extends z.ZodTypeAny>(src: Src) {
  const teaser = z
    .object({
      id: z.string().min(1),
      title: localizedString,
      summary: localizedString.optional(),
      /**
       * Facultatif : l'aperçu Hébergements lit ses prix dans les paliers (005), l'aperçu Formules
       * dans les formules ; une seule source pour chaque prix.
       */
      price: z
        .discriminatedUnion('unit', [
          z
            .object({ kind: z.enum(['from', 'fixed']), amount, unit: z.literal('per_night') })
            .strict(),
          z
            .object({
              kind: z.enum(['from', 'fixed']),
              amount,
              unit: z.literal('per_group'),
              basePersons: z.number().int().positive(),
            })
            .strict(),
        ])
        .optional(),
      /** Facultative : aucune photo d'hébergement n'est utilisable à ce jour (src/assets/photos/README.md). */
      image: imageSchema(src).optional(),
    })
    .strict();
  return z.object({ accommodation: z.array(teaser), packages: z.array(teaser) }).strict();
}
export type HomeTeasers = z.infer<ReturnType<typeof homeSchema<z.ZodString>>>;
export type TeaserCard = HomeTeasers['accommodation'][number];

export const LEGAL_DOCS = ['legalNotice', 'privacy', 'terms'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

/** Frontmatter des documents légaux. YAML transforme une date nue en Date : les deux sont acceptés. */
export const legalSchema = z.object({
  doc: z.enum(LEGAL_DOCS),
  locale: z.enum(['fr', 'en']),
  title: z.string().min(1),
  description: z.string().min(1).max(160, '160 caractères au plus'),
  updatedAt: z.union([z.date(), isoDate.transform((value) => new Date(value))]),
});
export type LegalFrontmatter = z.infer<typeof legalSchema>;
