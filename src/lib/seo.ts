import { getAlternates } from '../i18n/routes.ts';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../i18n/types.ts';

export type SeoInput = {
  path: string;
  locale: Locale;
  title: string;
  description: string;
  siteUrl: string;
  noindex?: boolean;
};

export type AlternateLink = { hreflang: string; href: string };

export type Seo = {
  canonical: string;
  alternates: AlternateLink[];
  ogLocale: string;
  ogLocaleAlternate: string[];
  title: string;
  description: string;
  noindex: boolean;
};

const OG_LOCALES: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US' };

/** Adresse absolue, en conservant la barre oblique finale telle qu'elle est déclarée. */
function absolute(siteUrl: string, path: string): string {
  return new URL(path, `${siteUrl}/`).toString();
}

/** Métadonnées d'une page : adresse canonique, liens alternatifs, partage. */
export function buildSeo({
  path,
  locale,
  title,
  description,
  siteUrl,
  noindex = false,
}: SeoInput): Seo {
  const alternatePaths = getAlternates(path);
  const alternates: AlternateLink[] = LOCALES.map((code) => ({
    hreflang: code,
    href: absolute(siteUrl, alternatePaths[code]),
  }));
  alternates.push({
    hreflang: 'x-default',
    href: absolute(siteUrl, alternatePaths[DEFAULT_LOCALE]),
  });

  return {
    canonical: absolute(siteUrl, path),
    alternates,
    ogLocale: OG_LOCALES[locale],
    ogLocaleAlternate: LOCALES.filter((code) => code !== locale).map((code) => OG_LOCALES[code]),
    title,
    description,
    noindex,
  };
}

/** Lien WhatsApp prérempli, utilisé par le bouton permanent. */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
