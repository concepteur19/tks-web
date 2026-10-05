/**
 * Contrôle du catalogue avant chaque construction, en développement comme en production.
 * Astro valide déjà chaque fichier contre son schéma ; ce script ajoute ce qu'un fichier
 * isolé ne peut pas vérifier — un categoryId qui pointe vers une catégorie existante — et
 * rend les erreurs de schéma lisibles en français, avec le fichier et le champ.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { catalogIssues, categorySchema, serviceSchema } from '../src/content/schemas.ts';

type Entry = { id: string; data: unknown };

function read(dir: string): Entry[] {
  let files: string[];
  try {
    files = readdirSync(dir).filter((file) => file.endsWith('.json'));
  } catch {
    return [];
  }
  return files.map((file) => ({
    id: basename(file, '.json'),
    data: JSON.parse(readFileSync(join(dir, file), 'utf8')),
  }));
}

export function checkContent(contentDir: string): string[] {
  const issues: string[] = [];
  const categories = read(join(contentDir, 'categories'));
  const services = read(join(contentDir, 'services'));
  const schema = serviceSchema(z.string());
  const categoryParser = categorySchema(z.string());

  for (const category of categories) {
    const result = categoryParser.safeParse(category.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push(
          `categories/${category.id} → ${issue.path.join('.') || '(racine)'} : ${issue.message}`,
        );
      }
    }
  }
  const valid: { id: string; data: { categoryId?: string | undefined } }[] = [];
  for (const service of services) {
    const result = schema.safeParse(service.data);
    if (result.success) {
      valid.push({ id: service.id, data: result.data });
      if (result.data.provisional && result.data.availability !== 'disabled') {
        issues.push(
          `services/${service.id} → availability : un contenu provisoire doit rester disabled (docs/content-tracker.md)`,
        );
      }
    } else {
      for (const issue of result.error.issues) {
        issues.push(
          `services/${service.id} → ${issue.path.join('.') || '(racine)'} : ${issue.message}`,
        );
      }
    }
  }
  issues.push(
    ...catalogIssues(
      categories.map((category) => category.id),
      valid,
    ),
  );
  return issues;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const issues = checkContent(process.env.CONTENT_DIR ?? 'src/content');
  if (issues.length > 0) {
    for (const issue of issues) console.error(`[contenu] ${issue}`);
    console.error(`[contenu] ${issues.length} erreur(s), construction interrompue`);
    process.exit(1);
  }
  console.log('[contenu] catalogue valide');
}
