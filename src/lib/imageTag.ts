/**
 * Étiquette d'une image de prestation : « Photo illustrative » pour une image générée (008),
 * « Photo à venir » pour une photo de remplacement sans le sujet (010), rien pour une vraie photo.
 */
import { t } from '../i18n/t.ts';
import type { Locale } from '../i18n/types.ts';

export function imageTag(
  image: { illustrative?: boolean | undefined; upcoming?: boolean | undefined },
  locale: Locale,
): string | undefined {
  if (image.upcoming) return t(locale, 'experiences.upcoming');
  if (image.illustrative) return t(locale, 'experiences.illustrative');
  return undefined;
}
