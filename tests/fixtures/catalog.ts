import { catalogMap, type IslandService } from '../../src/features/selection/islandCatalog.ts';

const href = (id: string) => ({ fr: `/experiences/${id}`, en: `/en/experiences/${id}` });
const persons = { kind: 'persons' as const, min: 1, max: 20, default: 2 };

/** Extrait du guide tarifaire de Franck, pour les tests de sélection, d'estimation et de message. */
export const SERVICES: IslandService[] = [
  {
    id: 'excursion-en-pirogue',
    title: { fr: 'Excursion en pirogue', en: 'Dugout canoe trip' },
    pricing: { kind: 'fixed', amount: 35000, unit: 'per_group', maxCapacity: 8 },
    quantity: { dimensions: [persons] },
    isOption: false,
    href: href('excursion-en-pirogue'),
  },
  {
    id: 'chutes-de-la-lobe',
    title: { fr: 'Chutes de la Lobé', en: 'Lobé Falls' },
    pricing: { kind: 'fixed', amount: 5000, unit: 'per_person' },
    quantity: { dimensions: [persons] },
    isOption: false,
    href: href('chutes-de-la-lobe'),
  },
  {
    id: 'campement-bagyeli',
    title: { fr: 'Campement Bagyeli', en: 'Bagyeli camp' },
    tiers: [
      {
        id: 'individuel',
        label: { fr: 'Individuel', en: 'Individual' },
        pricing: { kind: 'fixed', amount: 7500, unit: 'per_person' },
        quantity: { dimensions: [persons] },
      },
      {
        id: 'couple',
        label: { fr: 'Couple', en: 'Couple' },
        pricing: { kind: 'fixed', amount: 20000, unit: 'per_group' },
        quantity: { dimensions: [] },
      },
      {
        id: 'groupe',
        label: { fr: 'Groupe', en: 'Group' },
        pricing: { kind: 'quote' },
        quantity: { dimensions: [] },
      },
    ],
    quantity: { dimensions: [persons] },
    isOption: false,
    href: href('campement-bagyeli'),
  },
  {
    id: 'quad',
    title: { fr: 'Quad', en: 'Quad bike' },
    pricing: { kind: 'fixed', amount: 10000, unit: 'per_session' },
    quantity: {
      dimensions: [
        { kind: 'units', label: { fr: 'sessions', en: 'sessions' }, min: 1, max: 10, default: 1 },
      ],
    },
    isOption: false,
    href: href('quad'),
  },
  {
    id: 'location',
    title: { fr: 'Location de véhicule', en: 'Car rental' },
    pricing: { kind: 'from', amount: 25000, unit: 'per_day' },
    quantity: {
      dimensions: [
        { kind: 'units', label: { fr: 'véhicules', en: 'vehicles' }, min: 1, max: 5, default: 1 },
        { kind: 'days', min: 1, max: 30, default: 1 },
      ],
    },
    isOption: false,
    href: href('location'),
  },
  {
    id: 'feu-de-plage',
    title: { fr: 'Feu de plage', en: 'Beach bonfire' },
    pricing: { kind: 'fixed', amount: 50000, unit: 'per_group' },
    quantity: { dimensions: [] },
    isOption: false,
    href: href('feu-de-plage'),
  },
  {
    id: 'jet-ski',
    title: { fr: 'Jet-ski', en: 'Jet ski' },
    pricing: { kind: 'quote' },
    quantity: { dimensions: [] },
    isOption: false,
    href: href('jet-ski'),
  },
  {
    id: 'bateau-de-plaisance',
    title: { fr: 'Bateau de plaisance', en: 'Pleasure boat' },
    pricing: { kind: 'quote' },
    quantity: { dimensions: [] },
    isOption: false,
    href: href('bateau-de-plaisance'),
  },
  {
    id: 'guide-touristique',
    title: { fr: 'Guide touristique', en: 'Tour guide' },
    pricing: { kind: 'fixed', amount: 5000, unit: 'per_service' },
    quantity: { dimensions: [] },
    isOption: true,
    href: href('guide-touristique'),
  },
  {
    id: 'musee-d-art',
    title: { fr: "Musée d'art", en: 'Art museum' },
    pricing: { kind: 'fixed', amount: 1500, unit: 'per_person' },
    quantity: { dimensions: [persons] },
    isOption: true,
    href: href('musee-d-art'),
  },
];

export const CATALOG = catalogMap(SERVICES);
export const NOW = new Date('2026-10-06T10:00:00Z');
