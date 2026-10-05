import type { Dictionary } from './fr.ts';

/** Traduction anglaise. Une clé manquante casse la compilation. */
export const en = {
  'site.name': 'Kibreeze',
  'site.tagline': 'Kribi is a feeling',
  'site.description':
    'Kibreeze: experiences, excursions and stays designed to help you live Kribi differently.',

  'nav.label': 'Main navigation',
  'nav.skipToContent': 'Skip to content',
  'nav.language': 'Language',
  'nav.mobileLabel': 'Mobile navigation',
  'nav.footerLabel': 'Footer links',
  'nav.legalLabel': 'Legal information',
  'nav.home': 'Home',
  'nav.experiences': 'Experiences',
  'nav.accommodation': 'Accommodation',
  'nav.packages': 'Packages',
  'nav.mobility': 'TKS® Mobility',
  'nav.stay': 'My trip',
  'nav.contact': 'Contact',
  'nav.about': 'About',
  'nav.legalNotice': 'Legal notice',
  'nav.privacy': 'Privacy and cookies',
  'nav.terms': 'Terms of use',
  'nav.notFound': 'Page not found',

  'language.fr': 'Français',
  'language.en': 'English',

  'home.title': 'Discover Kribi differently',
  'home.subtitle': 'Experiences, excursions and stays designed to help you live Kribi differently.',
  'home.intro':
    'This site is being built. Services, prices and trip planning are coming very soon.',

  'link.viaWhatsapp': 'opens a WhatsApp chat',

  'whatsapp.label': 'Message Kibreeze on WhatsApp',
  'whatsapp.genericMessage':
    'Hello Kibreeze, I would like some information about your experiences in Kribi.',

  'notFound.title': 'Page not found',
  'notFound.text': 'This page does not exist or has been moved.',
  'notFound.back': 'Back to home',

  'footer.location': 'Kribi, Cameroon',
  'footer.group': '{brand} is a {group} brand, alongside {sisters}.',
  'footer.rights': 'All rights reserved',

  'common.servicesCount': { one: '{count} service', other: '{count} services' },
} satisfies Dictionary;
