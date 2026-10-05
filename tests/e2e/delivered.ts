import { IMPLEMENTED_ROUTES, ROUTES } from '../../src/i18n/routes.ts';
import { LOCALES } from '../../src/i18n/types.ts';

/** Adresses des pages livrées dans les deux langues, la 404 étant visitée par une adresse inexistante. */
export function deliveredPaths(): string[] {
  return IMPLEMENTED_ROUTES.filter((key) => key !== 'notFound').flatMap((key) =>
    LOCALES.map((locale) => ROUTES[key][locale]),
  );
}

export const MISSING_PATHS = ['/cette-page-nexiste-pas', '/en/this-page-does-not-exist'];
