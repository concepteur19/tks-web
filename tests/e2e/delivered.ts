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

/** Pages d'univers qui ont au moins une prestation publiée, dans les deux langues (008). */
export function universePaths(): string[] {
  const published = new Set(
    readdirSync('src/content/services')
      .filter((file) => file.endsWith('.json'))
      .map((file) => JSON.parse(readFileSync(`src/content/services/${file}`, 'utf8')))
      .filter((data) => data.section === 'experience' && !data.isOption)
      .filter((data) => data.availability !== 'disabled')
      .map((data) => data.categoryId as string),
  );
  const dir = 'src/content/categories';
  return readdirSync(dir)
    .filter((file) => file.endsWith('.json') && published.has(file.replace(/\.json$/, '')))
    .flatMap((file) => {
      const { urlSlug } = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'));
      return LOCALES.map((locale) => `${ROUTES.experiences[locale]}/${urlSlug[locale]}`);
    });
}

/** Fiches de parcours publiés, dans les deux langues (010). */
export function tourPaths(): string[] {
  return readdirSync('src/content/services')
    .filter((file) => file.endsWith('.json'))
    .filter((file) => {
      const data = JSON.parse(readFileSync(`src/content/services/${file}`, 'utf8'));
      return data.section === 'parcours' && data.availability !== 'disabled';
    })
    .flatMap((file) => {
      const id = file.slice(0, -'.json'.length);
      return LOCALES.map((locale) => `${ROUTES.packages[locale]}/${id}`);
    });
}
