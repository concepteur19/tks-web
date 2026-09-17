import type { Dictionary } from './fr.ts';

/** Traduction anglaise. Une clé manquante casse la compilation. */
export const en = {
  'site.name': 'TKS®',
  'site.tagline': 'Kribi is a feeling',
  'site.description':
    'TKS® takes care of your stay in Kribi: transport, tours and delivery, with a single contact.',

  'nav.label': 'Main navigation',
  'nav.skipToContent': 'Skip to content',
  'nav.language': 'Language',

  'language.fr': 'Français',
  'language.en': 'English',

  'home.title': 'Discover Kribi differently',
  'home.subtitle': 'Transport • Tours • Delivery',
  'home.intro':
    'This site is being built. Services, prices and trip planning are coming very soon.',

  'whatsapp.label': 'Message TKS on WhatsApp',
  'whatsapp.genericMessage': 'Hello TKS, I would like some information about your services.',

  'notFound.title': 'Page not found',
  'notFound.text': 'This page does not exist or has been moved.',
  'notFound.back': 'Back to home',

  'footer.location': 'Kribi, Cameroon',
  'footer.rights': 'All rights reserved',

  'common.servicesCount': { one: '{count} service', other: '{count} services' },
} satisfies Dictionary;
