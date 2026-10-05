import type { DictionaryShape } from './types.ts';

/** Dictionnaire de référence. `en.ts` doit le couvrir entièrement. */
export const fr = {
  'site.name': 'Kibreeze',
  'site.tagline': 'Kribi is a feeling',
  'site.description':
    'Kibreeze : des expériences, des excursions et des séjours pensés pour vous faire vivre Kribi autrement.',

  'nav.label': 'Navigation principale',
  'nav.skipToContent': 'Aller au contenu',
  'nav.language': 'Choix de la langue',

  'language.fr': 'Français',
  'language.en': 'English',

  'home.title': 'Découvrez Kribi autrement',
  'home.subtitle':
    'Des expériences, des excursions et des séjours pensés pour vous faire vivre Kribi autrement.',
  'home.intro':
    'Le site est en cours de construction. Les services, les tarifs et la composition de votre séjour arrivent très bientôt.',

  'link.viaWhatsapp': 'ouvre une conversation WhatsApp',

  'whatsapp.label': 'Contacter Kibreeze sur WhatsApp',
  'whatsapp.genericMessage':
    'Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi.',

  'notFound.title': 'Page introuvable',
  'notFound.text': "Cette page n'existe pas ou a été déplacée.",
  'notFound.back': "Retour à l'accueil",

  'footer.location': 'Kribi, Cameroun',
  'footer.rights': 'Tous droits réservés',

  'common.servicesCount': { one: '{count} prestation', other: '{count} prestations' },
} satisfies DictionaryShape;

export type Dictionary = typeof fr;
