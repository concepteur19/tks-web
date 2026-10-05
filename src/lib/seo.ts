import type { CardPrice } from '../features/estimation/cardPrice.ts';
import { getAlternates, getRoutePath } from '../i18n/routes.ts';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../i18n/types.ts';

export type SeoInput = {
  path: string;
  /** Chemins de la même page dans chaque langue, pour une page hors de la table des routes (fiche). */
  alternatePaths?: Record<Locale, string> | undefined;
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
  alternatePaths,
}: SeoInput): Seo {
  const paths = alternatePaths ?? getAlternates(path);
  const alternates: AlternateLink[] = LOCALES.map((code) => ({
    hreflang: code,
    href: absolute(siteUrl, paths[code]),
  }));
  alternates.push({
    hreflang: 'x-default',
    href: absolute(siteUrl, paths[DEFAULT_LOCALE]),
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

export type LocalBusinessInput = {
  company: { brand: string };
  locale: Locale;
  siteUrl: string;
  /** Chiffres seuls, comme PUBLIC_WHATSAPP_NUMBER. */
  phone: string;
  logoUrl: string;
};

/**
 * Données structurées de l'accueil (FR-027, FR-SEO-3). TravelAgency est un sous-type de
 * LocalBusiness : il décrit mieux Kibreeze tout en restant une entreprise locale.
 */
export function buildLocalBusinessJsonLd({
  company,
  locale,
  siteUrl,
  phone,
  logoUrl,
}: LocalBusinessInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: company.brand,
    url: absolute(siteUrl, getRoutePath('home', locale)),
    logo: logoUrl,
    telephone: `+${phone}`,
    areaServed: { '@type': 'City', name: 'Kribi' },
    address: { '@type': 'PostalAddress', addressLocality: 'Kribi', addressCountry: 'CM' },
    inLanguage: locale,
  };
}

export type ExperienceJsonLdInput = {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  locale: Locale;
  siteUrl: string;
  price: CardPrice;
  /** Libellé de l'unité dans la langue de la page, ex. « groupe ». */
  unitLabel?: string;
};

/**
 * Données structurées d'une fiche (FR-026). TouristTrip décrit l'activité organisée et vendue ;
 * l'offre n'existe que pour un prix ferme ou « à partir de », jamais pour un prix sur devis.
 */
export function buildExperienceJsonLd({
  title,
  description,
  url,
  imageUrl,
  locale,
  siteUrl,
  price,
  unitLabel,
}: ExperienceJsonLdInput): Record<string, unknown> {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description,
    url,
    image: imageUrl,
    inLanguage: locale,
    provider: {
      '@type': 'TravelAgency',
      name: 'Kibreeze',
      url: absolute(siteUrl, getRoutePath('home', locale)),
    },
  };
  if (price.kind !== 'quote') {
    data.offers = {
      '@type': 'Offer',
      price: price.amount,
      priceCurrency: 'XAF',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: price.amount,
        priceCurrency: 'XAF',
        ...(unitLabel ? { unitText: unitLabel } : {}),
      },
    };
  }
  return data;
}
