/**
 * Catalogue minimal publié une fois par page (bloc JSON du layout), lu par tous les îlots de la
 * sélection. Calculé une seule fois par build.
 */
import { getImage } from 'astro:assets';
import { toIslandCatalog, type IslandService } from '../features/selection/islandCatalog.ts';
import { getRoutePath } from '../i18n/routes.ts';
import { LOCALES, type Locale } from '../i18n/types.ts';
import { getExperiences, getOptions } from './catalog.ts';

let cache: Promise<IslandService[]> | undefined;

async function build(): Promise<IslandService[]> {
  const [experiences, options] = await Promise.all([getExperiences(), getOptions()]);
  const thumbnails: Record<string, string> = {};
  for (const service of experiences) {
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
  const hrefs = (id: string) =>
    Object.fromEntries(
      LOCALES.map((locale) => [locale, `${getRoutePath('experiences', locale)}/${id}`]),
    ) as Record<Locale, string>;
  return toIslandCatalog([...experiences, ...options], hrefs, thumbnails);
}

export function getPageCatalog(): Promise<IslandService[]> {
  cache ??= build();
  return cache;
}
