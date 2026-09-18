import type { DictionaryShape } from './types.ts';

/** Dictionnaire de référence. `en.ts` doit le couvrir entièrement. */
export const fr = {
  'site.name': 'TKS®',
  'site.tagline': 'Kribi is a feeling',
  'site.description':
    'TKS® vous accompagne à Kribi : transport, tourisme et livraison, avec un seul interlocuteur.',

  'nav.label': 'Navigation principale',
  'nav.skipToContent': 'Aller au contenu',
  'nav.language': 'Choix de la langue',

  'language.fr': 'Français',
  'language.en': 'English',

  'home.title': 'Découvrez Kribi autrement',
  'home.subtitle': 'Transport • Tourisme • Livraison',
  'home.intro':
    'Le site est en cours de construction. Les services, les tarifs et la composition de votre séjour arrivent très bientôt.',

  'whatsapp.label': 'Contacter TKS sur WhatsApp',
  'whatsapp.genericMessage': 'Bonjour TKS, je souhaite des informations sur vos services.',

  'notFound.title': 'Page introuvable',
  'notFound.text': "Cette page n'existe pas ou a été déplacée.",
  'notFound.back': "Retour à l'accueil",

  'footer.location': 'Kribi, Cameroun',
  'footer.rights': 'Tous droits réservés',

  'common.servicesCount': { one: '{count} prestation', other: '{count} prestations' },
} satisfies DictionaryShape;

export type Dictionary = typeof fr;
