/**
 * Catalogue minimal publié une fois par page (bloc JSON du layout), lu par tous les îlots de la
 * sélection. Calculé une seule fois par build.
 */
import { getImage } from 'astro:assets';
import { toIslandCatalog, type IslandService } from '../features/selection/islandCatalog.ts';
import { getRoutePath } from '../i18n/routes.ts';
import { LOCALES, type Locale } from '../i18n/types.ts';
import { getAccommodation, getExperiences, getOptions, getPackages, getTours } from './catalog.ts';

let cache: Promise<IslandService[]> | undefined;

async function build(): Promise<IslandService[]> {
  const [experiences, options, accommodation, tours, packages] = await Promise.all([
    getExperiences(),
    getOptions(),
    getAccommodation(),
    getTours(),
    getPackages(),
  ]);
  const withCards = [...experiences, ...accommodation, ...tours, ...packages];
  const thumbnails: Record<string, string> = {};
  for (const service of withCards) {
    const first = service.data.images?.[0];
    if (first) {
      const image = await getImage({
        src: first.src,
        width: 192,
        height: 192,
        fit: 'cover',
        format: 'webp',
      });
      thumbnails[service.id] = image.src;
    }
  }
  // Adresse d'une ligne de séjour : la fiche d'une expérience, la carte d'un palier, d'un parcours
  // ou d'une formule sur sa page (005, contracts/content.md).
  const sectionOf = new Map(withCards.map((service) => [service.id, service.data.section]));
  const hrefs = (id: string) =>
    Object.fromEntries(
      LOCALES.map((locale) => {
        const section = sectionOf.get(id);
        const href =
          section === 'hebergement'
            ? `${getRoutePath('accommodation', locale)}#${id}`
            : section === 'parcours' || section === 'formule'
              ? `${getRoutePath('packages', locale)}#${id}`
              : `${getRoutePath('experiences', locale)}/${id}`;
        return [locale, href];
      }),
    ) as Record<Locale, string>;
  return toIslandCatalog([...withCards, ...options], hrefs, thumbnails);
}

export function getPageCatalog(): Promise<IslandService[]> {
  cache ??= build();
  return cache;
}
