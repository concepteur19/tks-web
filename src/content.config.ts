/**
 * Collections de contenu. Les schémas vivent dans src/content/schemas.ts, testés sans Astro.
 * Emplacement imposé par Astro 5 (content layer) : src/content.config.ts, pas src/content/config.ts.
 *
 * Le contrôle transversal (un categoryId qui existe) n'est pas faisable fichier par fichier :
 * scripts/check-content.ts le fait avant chaque construction. Les fichiers uniques du site
 * (company, currency, home) sont validés par src/lib/site.ts.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { categorySchema, legalSchema, serviceSchema } from './content/schemas.ts';

// Les images sont des chemins relatifs au fichier JSON, résolus et optimisés par astro:assets.
const categories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categories' }),
  schema: ({ image }) => categorySchema(image()),
});

const services = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: ({ image }) => serviceSchema(image()),
});

// Un document par langue : src/content/legal/<locale>/<doc>.md, identifiant « <locale>/<doc> ».
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: legalSchema,
});

export const collections = { categories, services, legal };
