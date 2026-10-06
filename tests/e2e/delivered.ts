import { readdirSync, readFileSync } from 'node:fs';
import { IMPLEMENTED_ROUTES, ROUTES } from '../../src/i18n/routes.ts';
import { LOCALES } from '../../src/i18n/types.ts';

/** Adresses des pages livrées dans les deux langues, la 404 étant visitée par une adresse inexistante. */
export function deliveredPaths(): string[] {
  return IMPLEMENTED_ROUTES.filter((key) => key !== 'notFound').flatMap((key) =>
    LOCALES.map((locale) => ROUTES[key][locale]),
  );
}

export const MISSING_PATHS = ['/cette-page-nexiste-pas', '/en/this-page-does-not-exist'];

/** Fiches publiées (expériences ni options ni désactivées), dans les deux langues. */
export function experiencePaths(): string[] {
  const dir = 'src/content/services';
  return readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .filter((file) => {
      const data = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'));
      return data.section === 'experience' && !data.isOption && data.availability !== 'disabled';
    })
    .flatMap((file) => {
      const slug = file.replace(/\.json$/, '');
      return LOCALES.map((locale) => `${ROUTES.experiences[locale]}/${slug}`);
    });
}
