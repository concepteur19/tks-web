/**
 * Collections de contenu. Les schémas vivent dans src/content/schemas.ts, testés sans Astro.
 * Emplacement imposé par Astro 5 (content layer) : src/content.config.ts, pas src/content/config.ts.
 *
 * Le contrôle transversal (un categoryId qui existe) n'est pas faisable fichier par fichier :
 * scripts/check-content.ts le fait avant chaque construction.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { categorySchema, serviceSchema } from './content/schemas.ts';

const categories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categories' }),
  schema: categorySchema,
});

// Les images restent des chemins tant qu'aucune photo validée n'est livrée ; la feature 003
// passera au helper image() d'Astro pour l'optimisation.
const services = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: serviceSchema(z.string()),
});

export const collections = { categories, services };
