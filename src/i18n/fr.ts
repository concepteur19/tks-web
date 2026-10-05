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
  'nav.mobileLabel': 'Navigation mobile',
  'nav.footerLabel': 'Liens du pied de page',
  'nav.legalLabel': 'Informations légales',
  'nav.home': 'Accueil',
  'nav.experiences': 'Expériences',
  'nav.accommodation': 'Hébergements',
  'nav.packages': 'Formules',
  'nav.mobility': 'Mobilité TKS®',
  'nav.stay': 'Mon séjour',
  'nav.contact': 'Contact',
  'nav.about': 'À propos',
  'nav.legalNotice': 'Mentions légales',
  'nav.privacy': 'Confidentialité et cookies',
  'nav.terms': "Conditions d'utilisation",
  'nav.notFound': 'Page introuvable',

  'language.fr': 'Français',
  'language.en': 'English',

  'home.title': 'Découvrez Kribi autrement',
  'home.subtitle':
    'Des expériences, des excursions et des séjours pensés pour vous faire vivre Kribi autrement.',

  'link.viaWhatsapp': 'ouvre une conversation WhatsApp',

  'home.hero.alt': 'Coucher de soleil sur une plage de Kribi, une pirogue sur l’eau',
  'home.cta.experiences': 'Découvrir les expériences',
  'home.cta.plan': 'Planifier mon séjour',
  'home.categories.title': 'Nos expériences',
  'home.categories.count': { one: '{count} expérience', other: '{count} expériences' },
  'home.featured.title': 'À ne pas manquer',
  'home.strip.words': 'MER · FORÊT · CHUTES · PIROGUE',
  'home.strip.alt': 'La rivière Lobé vue depuis une pirogue, entre forêt et ciel',
  'home.accommodation.title': 'Où dormir à Kribi',
  'home.accommodation.intro': 'Dites-nous votre budget, nous trouvons le logement.',
  'home.accommodation.cta': 'Voir tous les hébergements',
  'home.packages.title': 'Des séjours déjà composés',
  'home.packages.cta': 'Voir les 4 formules',
  'home.mobility.title': 'Mobilité & transport',
  'home.mobility.text': 'Location, transferts et chauffeur privé pour compléter votre séjour',
  'home.mobility.cta': 'Voir',
  'home.about.title': 'Qui sommes-nous',
  'home.about.alt': 'Vue aérienne de Kribi, entre la ville, la plage et l’océan',
  'home.about.more': 'En savoir plus',
  'home.cta.title': 'Un séjour sur mesure ?',
  'home.cta.text': 'Écrivez-nous : nous vous aidons à composer votre séjour à Kribi.',

  'whatsapp.label': 'Contacter Kibreeze sur WhatsApp',
  'whatsapp.genericMessage':
    'Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi.',

  'price.from': 'À partir de {amount}',
  'price.quote': 'Sur devis',
  'price.indicative': 'Tarifs indicatifs. Les montants en euros sont donnés à titre indicatif.',
  'price.forPersons': { one: '/ {count} personne', other: '/ {count} personnes' },
  'price.unit.per_person': '/ personne',
  'price.unit.per_group': '/ groupe',
  'price.unit.per_equipment': '/ engin',
  'price.unit.per_hour': '/ heure',
  'price.unit.per_day': '/ jour',
  'price.unit.per_night': '/ nuit',
  'price.unit.per_session': '/ session',
  'price.unit.per_trip': '/ trajet',
  'price.unit.per_service': '/ prestation',

  'contact.title': 'Contactez Kibreeze',
  'contact.description':
    'Écrivez à Kibreeze sur WhatsApp pour organiser votre séjour à Kribi : expériences, hébergements et formules.',
  'contact.intro':
    'Une question, une envie, un séjour à organiser ? Le plus simple est de nous écrire sur WhatsApp.',
  'contact.whatsapp': 'WhatsApp et téléphone',
  'contact.location': 'Où nous trouver',
  'contact.email': 'E-mail',
  'contact.social': 'Réseaux sociaux',
  'contact.about.alt': 'Palmiers sous le ciel bleu de Kribi',

  'notFound.title': 'Page introuvable',
  'notFound.text': "Cette page n'existe pas ou a été déplacée.",
  'notFound.back': "Retour à l'accueil",

  'footer.location': 'Kribi, Cameroun',
  'footer.group': '{brand} est une marque de {group}, avec {sisters}.',
  'footer.rights': 'Tous droits réservés',

  'common.servicesCount': { one: '{count} prestation', other: '{count} prestations' },
} satisfies DictionaryShape;

export type Dictionary = typeof fr;
