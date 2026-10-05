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

  'link.viaWhatsapp': 'opens a WhatsApp chat',

  'home.hero.alt': 'Sunset over a Kribi beach, with a canoe on the water',
  'home.cta.experiences': 'Discover the experiences',
  'home.cta.plan': 'Plan my trip',
  'home.categories.title': 'Our experiences',
  'home.categories.count': { one: '{count} experience', other: '{count} experiences' },
  'home.featured.title': 'Not to be missed',
  'home.strip.words': 'SEA · FOREST · FALLS · CANOE',
  'home.strip.alt': 'The Lobé river seen from a dugout canoe, between forest and sky',
  'home.accommodation.title': 'Where to stay in Kribi',
  'home.accommodation.intro': 'Tell us your budget, we find the place.',
  'home.accommodation.cta': 'See all accommodation',
  'home.packages.title': 'Ready-made trips',
  'home.packages.cta': 'See the 4 packages',
  'home.mobility.title': 'Mobility & transport',
  'home.mobility.text': 'Car rental, transfers and private driver to complete your trip',
  'home.mobility.cta': 'See',
  'home.about.title': 'Who we are',
  'home.about.alt': 'Aerial view of Kribi, between the town, the beach and the ocean',
  'home.about.more': 'Learn more',
  'home.cta.title': 'A tailor-made trip?',
  'home.cta.text': 'Write to us: we help you put together your stay in Kribi.',

  'whatsapp.label': 'Message Kibreeze on WhatsApp',
  'whatsapp.genericMessage':
    'Hello Kibreeze, I would like some information about your experiences in Kribi.',

  'price.from': 'From {amount}',
  'price.quote': 'On request',
  'price.indicative': 'Indicative prices. Euro amounts are given for reference only.',
  'price.forPersons': { one: '/ {count} person', other: '/ {count} people' },
  'price.unit.per_person': '/ person',
  'price.unit.per_group': '/ group',
  'price.unit.per_equipment': '/ vehicle',
  'price.unit.per_hour': '/ hour',
  'price.unit.per_day': '/ day',
  'price.unit.per_night': '/ night',
  'price.unit.per_session': '/ session',
  'price.unit.per_trip': '/ trip',
  'price.unit.per_service': '/ service',

  'contact.title': 'Contact Kibreeze',
  'contact.description':
    'Message Kibreeze on WhatsApp to plan your stay in Kribi: experiences, accommodation and packages.',
  'contact.intro':
    'A question, an idea, a trip to plan? The easiest way is to message us on WhatsApp.',
  'contact.whatsapp': 'WhatsApp and phone',
  'contact.location': 'Where to find us',
  'contact.email': 'Email',
  'contact.social': 'Social media',
  'contact.about.alt': 'Palm trees under the blue sky of Kribi',

  'notFound.title': 'Page not found',
  'notFound.text': 'This page does not exist or has been moved.',
  'notFound.back': 'Back to home',

  'footer.location': 'Kribi, Cameroon',
  'footer.group': '{brand} is a {group} brand, alongside {sisters}.',
  'footer.rights': 'All rights reserved',

  'common.servicesCount': { one: '{count} service', other: '{count} services' },
} satisfies Dictionary;
