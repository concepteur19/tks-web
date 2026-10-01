# Modèle de données frontend

**Statut** : draft · **Date** : 2026-09-13

## 1. Principes

- Une seule source de vérité : les **schémas Zod** des content collections Astro. Les types TypeScript en sont dérivés (`z.infer`).
- Le **catalogue** (services, catégories) est statique, versionné, validé au build.
- La **sélection** est dynamique, persistée dans le navigateur, validée au chargement par un schéma dédié.
- La sélection ne copie jamais un prix : elle référence un service par identifiant et le prix est recalculé depuis le catalogue courant. Un changement de tarif se répercute immédiatement, et aucun prix périmé n'est envoyé à TKS.
- Les montants sont des **entiers en francs CFA** (`XAF`, pas de centimes).
- Les textes du catalogue sont **localisés** : `fr` obligatoire, `en` exigé au build de production. Les prix, quantités, statuts et identifiants ne le sont jamais (ADR-013).

## 2. Entités du catalogue

### `Locale` et `LocalizedString`

```ts
type Locale = 'fr' | 'en';

// `en` est optionnel dans le schéma pour accepter le contenu livré au fil de l'eau.
// Le contrôle du build de production exige `en` partout (ADR-013).
type LocalizedString = { fr: string; en?: string };
```

`localize(value, locale)` renvoie `value[locale]`, ou `value.fr` avec un avertissement quand la traduction manque.

### `Section`

```ts
type Section = 'experience' | 'hebergement' | 'formule' | 'mobilite';
```

Remplace l'ancien `Pole = 'transport' | 'tourisme' | 'livraison'` depuis le pivot Kibreeze du 2026-09-25. Le site n'est plus organisé en trois pôles d'égale importance mais en un catalogue d'expériences dominant, deux rubriques complémentaires, et une section de mobilité secondaire. **La livraison n'est plus une section** : elle appartient à Breezy Delivery, marque sœur du groupe, et ne figure pas sur ce site.

Les sections sont fixes dans le code (elles structurent les routes). Leurs libellés, descriptions et visuels sont dans un fichier de contenu `sections.json`.

### `ServiceCategory`

Ne concerne que la section `experience`. Trois catégories, arrêtées le 2026-09-16 et inchangées par le pivot : `nature-decouverte`, `aventure`, `detente`.

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` (slug) | oui | Identifiant stable, ex. `aventure` |
| `name` | `LocalizedString` | oui | Libellé affiché, ex. `{ fr: "Aventure", en: "Adventure" }` |
| `description` | `LocalizedString` | non | Une phrase pour l'onglet ou l'en-tête |
| `order` | `number` | oui | Ordre d'affichage dans le catalogue |

### `Service`

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` (slug) | oui | Identifiant stable = nom de fichier, ex. `chutes-de-la-lobe`. Sert de clé dans la sélection et de slug d'URL, identique en français et en anglais |
| `title` | `LocalizedString` | oui | Nom affiché |
| `section` | `Section` | oui | Section du site |
| `categoryId` | `string` | oui si `section = 'experience'` | Référence vers `ServiceCategory.id` (vérifiée au build) |
| `isOption` | `boolean` | non (défaut `false`) | Prestation qui s'ajoute à une autre plutôt que de se vendre seule : guide touristique, maître-nageur, musée d'art (client T7). N'apparaît pas dans la grille du catalogue, mais en cases à cocher sur les fiches |
| `shortDescription` | `LocalizedString` (≤ 160 car. par langue) | oui | Carte + meta description |
| `description` | `LocalizedString` (markdown) | oui | Fiche |
| `images` | `Image[]` (≥ 1) | oui | `{ src, alt: LocalizedString }`, la première est l'image principale |
| `pricing` | `Pricing` | oui | Voir ci-dessous |
| `quantity` | `QuantityRule` | oui | Voir ci-dessous |
| `duration` | `LocalizedString` | non | Texte libre, ex. `{ fr: "3 à 4 heures", en: "3 to 4 hours" }` |
| `capacity` | `{ min?: number; max?: number }` | non | Nombre de personnes |
| `conditions` | `{ included?: LocalizedString[]; excluded?: LocalizedString[]; notes?: LocalizedString[] }` | non | Inclus / non inclus / à savoir |
| `availability` | `'available' \| 'on_request' \| 'disabled'` | oui (défaut `available`) | `on_request` = badge « à confirmer » ; `disabled` = invisible et purgé de la sélection |
| `featured` | `boolean` | non (défaut `false`) | Mis en avant sur l'accueil |
| `order` | `number` | non (défaut 100) | Ordre dans la catégorie |
| `seo` | `{ title?: LocalizedString; description?: LocalizedString }` | non | Surcharge des métadonnées |

### `Pricing` (union discriminée)

```ts
// Arrêtée le 2026-09-16, étendue par le guide tarifaire du 2026-09-26.
type PriceUnit =
  | 'per_person'      // par personne
  | 'per_group'       // forfait pour le groupe
  | 'per_equipment'   // par équipement : jet-ski, quad, cheval
  | 'per_hour'        // par heure
  | 'per_day'         // par jour
  | 'per_night'       // par nuit — hébergements
  | 'per_session'     // par session — quad, jet-ski, kayak, paddle
  | 'per_trip'        // par course ou par trajet
  | 'per_service';    // par prestation, forfait

type PriceTier = {
  id: string;                    // 'individuel', 'couple', 'groupe'
  label: LocalizedString;        // affiché au choix sur la fiche
  pricing: Pricing;
};

type Pricing =
  | { kind: 'fixed'; amount: number; unit: PriceUnit; maxCapacity?: number }
  | { kind: 'from';  amount: number; unit: PriceUnit; maxCapacity?: number }
  | { kind: 'quote' };
```

`per_delivery` est retirée avec le périmètre livraison.

Règles :
- `amount` est un entier strictement positif.
- L'unité nomme le prix affiché et doit être cohérente avec les dimensions de quantité, ce que le build vérifie : `per_person` exige une dimension `persons` ; `per_day` une dimension `days` ; `per_night` une dimension `nights` ; `per_hour` une dimension `hours` ; `per_equipment` une dimension `units` ; `per_group`, `per_service`, `per_session` et `per_trip` acceptent zéro ou une dimension `units`.
- Une tarification qui dépend de la distance, du nombre d'enfants, de la période ou d'un prestataire n'est pas modélisée : le service est `quote`.

**`maxCapacity` — capacité d'un prix de groupe** (nouveau, client T6). Un forfait de groupe vaut jusqu'à un nombre de personnes donné. Au-delà, le service bascule sur `quote` au lieu de multiplier le forfait, parce que Franck traite ces cas à la main. L'excursion en pirogue vaut 35 000 pour 8 personnes maximum ; une demande pour 10 part en devis. Le champ n'a de sens qu'avec `per_group`.

**`PriceTier` — plusieurs tarifs pour un même service** (nouveau, client T3). Certains services proposent des tarifs alternatifs que le visiteur choisit, sans être des services distincts. Le campement Bagyeli en porte trois : individuel 7 500 `per_person`, couple 20 000 `per_group`, groupe `quote`. Un service porte soit un `pricing`, soit un tableau `tiers`, jamais les deux. Une ligne de sélection mémorise le `tierId` retenu.

**Une fourchette de prix n'est pas modélisée.** Le bateau de plaisance, annoncé « 100 000 – 120 000 FCFA / heure selon le type de bateau », est `quote` (client T2). Un panier a besoin d'un nombre pour calculer un total ; une fourchette n'en est pas un.

### `QuantityRule` et ses dimensions

Franck refuse une unité imposée à toute une section, et certains services se comptent sur deux axes à la fois, par exemple « 2 véhicules pendant 3 jours » (réponses du 2026-09-16). Un service porte donc de zéro à deux **dimensions** de quantité.

```ts
type QuantityDimension =
  | { kind: 'persons'; min: number; max: number; default: number }
  | { kind: 'units';   label: LocalizedString; min: number; max: number; default: number }  // véhicules, équipements, sessions
  | { kind: 'days';    min: number; max: number; default: number }
  | { kind: 'nights';  min: number; max: number; default: number }
  | { kind: 'hours';   min: number; max: number; default: number };

type QuantityRule = { dimensions: QuantityDimension[] };   // 0, 1 ou 2 dimensions
```

`nights` est distincte de `days` : en hébergement, trois nuits ne sont pas trois jours, et le visiteur raisonne en nuits. Les confondre produirait un total faux d'une unité.

Règles :
- `1 ≤ min ≤ default ≤ max ≤ 50` pour chaque dimension.
- Zéro, une ou deux dimensions. Au plus une dimension de durée (`days`, `nights` ou `hours`), et jamais deux fois le même `kind`.
- Sans dimension, le service s'ajoute tel quel : forfait, prestation, ou service sur devis.
- Le montant d'une ligne est le prix unitaire multiplié par **toutes** les dimensions : « location avec chauffeur, 2 véhicules × 3 jours » vaut le prix du jour × 6.

### Correspondance issue du guide tarifaire du 2026-09-26

| Expérience | Prix | `unit` | Dimensions |
|---|---|---|---|
| Chutes de la Lobé, visite guidée | 5 000 | `per_person` | `persons` |
| Excursion en pirogue | 35 000, 8 pers. max | `per_group` + `maxCapacity: 8` | aucune |
| Excursion en chaloupe | 65 000, 8 pers. max | `per_group` + `maxCapacity: 8` | aucune |
| Campement Bagyeli | 3 tarifs alternatifs | `tiers` | `persons` sur le tarif individuel |
| Quad | 10 000 | `per_session` | `units` « sessions » |
| Jet-ski | ⏳ non tranché (T1) | — | — |
| Kayak | 10 000 | `per_person` | `persons` |
| Paddle | 10 000 | `per_person` | `persons` |
| Bateau de plaisance | fourchette → devis | `quote` | aucune |
| Balade à cheval | 5 000, prix ferme | `per_person` | `persons` |
| Jacuzzi naturel | 5 000 | `per_person` | `persons` |
| Croisière en bateau | 25 000 | `per_person` | `persons` |
| Feu de plage | 50 000 | `per_group` | aucune |
| Musée d'art | 1 500 | `per_person` + `isOption` | `persons` |
| Guide touristique | 5 000 | `per_service` + `isOption` | aucune |
| Maître-nageur | 5 000 | `per_service` + `isOption` | aucune |

Mobilité TKS® : ⏳ **aucun tarif n'a jamais été fourni**. Tous les services de mobilité sont `quote` jusqu'à nouvel ordre.

### `Package`

Quatre packages existent avec leurs prix (guide tarifaire, contrairement à la réponse M1 du 2026-09-25).

```ts
type Package = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  images: Image[];
  serviceIds: string[];        // références vérifiées au build
  pricing: Pricing;            // fixed, base de 2 personnes
  basePersons: number;         // 2
  maxPersons: number;          // 8, au-delà → quote
};
```

Découverte 100 000, Évasion 120 000, Aventure 150 000, Premium 300 000, tous pour 2 personnes. Un package s'ajoute à la sélection comme **une ligne unique** : ses expériences ne sont pas détaillées dans le récapitulatif ni dans le message WhatsApp. Si un `serviceId` référence une expérience absente du catalogue, le build échoue.

⏳ Les packages incluant hébergement et transport (client R3, « les deux versions ») attendent leurs prix.

### `AccommodationTier`

Le modèle confirmé par Franck n'est pas un catalogue de logements nommés mais un choix **par type et par palier de budget** : le visiteur se positionne sur un budget, Kibreeze trouve ensuite le logement chez ses partenaires.

```ts
type AccommodationTier = {
  id: string;                      // 'chambre-15000'
  type: 'chambre' | 'studio' | 'appartement' | 'villa';
  pricing: { kind: 'from'; amount: number; unit: 'per_night' };
  capacity: { min: number; max: number };
  included?: LocalizedString;      // varie selon le logement (client L2)
  images: Image[];                 // représentatives du budget, jamais d'un logement identifiable
  premium: boolean;                // true → section séparée, affichée après les paliers standards
};
```

Grille validée le 2026-09-26 : chambre 15 000 ; studio 30 000 ; appartement 35 000, 50 000 et 100 000 ; villa 150 000 ; haut de gamme jusqu'à 300 000 en `premium`. La ligne à 5 000 a été retirée par le client, qui la jugeait incompatible avec le positionnement de la marque.

Un palier s'ajoute à la sélection avec une dimension `nights`. Aucun nom d'établissement n'apparaît nulle part.

## 3. Entités de la sélection

### `SelectedService`

| Champ | Type | Description |
|---|---|---|
| `serviceId` | `string` | Référence vers `Service.id` |
| `quantities` | `number[]` | Une valeur par dimension de la règle du service, dans le même ordre. Tableau vide si le service n'a pas de dimension |
| `addedAt` | `string` (ISO 8601) | Ordre d'affichage et purge éventuelle |

### `Selection`

| Champ | Type | Description |
|---|---|---|
| `version` | `number` | Version du schéma persisté (1 en V1). Une version inconnue ou invalide entraîne une réinitialisation propre |
| `items` | `SelectedService[]` | Une ligne par service (unicité de `serviceId`) |
| `stay` | `{ dates?: string; travelers?: number }` | Informations globales optionnelles |
| `updatedAt` | `string` (ISO 8601) | Dernière modification ; une sélection de plus de 30 jours est purgée au chargement |

Clé de stockage : `tks.selection.v1`.

### `SelectionEvent` (résultat des opérations du store)

```ts
type SelectionEvent =
  | { type: 'added'; serviceId: string; quantities: number[] }
  | { type: 'merged'; serviceId: string; quantities: number[]; capped: boolean }
  | { type: 'updated'; serviceId: string; quantities: number[] }
  | { type: 'removed'; serviceId: string }
  | { type: 'cleared' }
  | { type: 'purged'; serviceIds: string[] };   // services disparus au chargement
```

Ces événements alimentent les toasts et le futur `trackEvent`.

## 4. Entités de l'estimation

### `EstimateLine`

| Champ | Type | Description |
|---|---|---|
| `serviceId` | `string` | |
| `title` | `LocalizedString` | Copié du catalogue ; la langue est choisie à l'affichage et dans le message |
| `quantities` | `number[]` | Valeurs choisies, dans l'ordre des dimensions |
| `dimensions` | `{ kind: QuantityDimension['kind']; label: LocalizedString }[]` | Libellés, pour afficher « 2 véhicules × 3 jours » |
| `pricingKind` | `'fixed' \| 'from' \| 'quote'` | |
| `unit` | `PriceUnit \| null` | |
| `unitAmount` | `number \| null` | `null` si `quote` |
| `lineAmount` | `number \| null` | `unitAmount ×` produit des `quantities`, `null` si `quote` |

### `PriceEstimate`

| Champ | Type | Description |
|---|---|---|
| `lines` | `EstimateLine[]` | Ordre = ordre de la sélection |
| `total` | `number` | Somme des `lineAmount` non nuls (0 si aucune) |
| `hasFromPrices` | `boolean` | Au moins une ligne `from` ⇒ total « estimatif » |
| `quoteCount` | `number` | Nombre de lignes `quote` |
| `isQuoteOnly` | `boolean` | Toutes les lignes sont `quote` (ou sélection vide) |
| `currency` | `'XAF'` | Constante |

Fonction : `computeEstimate(selection: Selection, catalog: ReadonlyMap<string, Service>): PriceEstimate`.

## 5. Entités WhatsApp

### `WhatsAppMessage`

| Champ | Type | Description |
|---|---|---|
| `text` | `string` | Message lisible (avant encodage) |
| `url` | `string` | `https://wa.me/<number>?text=<encodé>` |
| `truncated` | `boolean` | Vrai si des lignes ont été omises |
| `omittedCount` | `number` | Lignes omises |

Fonctions :
- `buildSelectionMessage(estimate: PriceEstimate, stay: Selection['stay'], options: { intent: 'stay' | 'single_service'; locale: Locale }): string`
- `buildSingleServiceMessage(service: Service, quantities: number[], locale: Locale): string`
- `formatPrice(amount: number, locale: Locale): string` : « 100 000 FCFA » ou « 100,000 FCFA »
- `buildWhatsAppUrl(number: string, text: string, maxLength = 1800): WhatsAppMessage`

## 6. Relations

```text
Pole 1 ──── n ServiceCategory 1 ──── n Service
                                        ▲
                                        │ serviceId
Selection 1 ──── n SelectedService ─────┘
     │
     └── computeEstimate(selection, catalog) ──► PriceEstimate ──► buildSelectionMessage ──► WhatsAppMessage
```

## 7. Règles métier consolidées

| # | Règle | Où elle vit |
|---|---|---|
| R1 | Un service n'apparaît qu'une fois dans la sélection. Un nouvel ajout met à jour la ligne : les dimensions `persons` et `units` s'additionnent, les dimensions de durée (`days`, `hours`) prennent la nouvelle valeur, car une durée ne s'additionne pas | store de sélection |
| R2 | Chaque dimension est bornée par ses `min` / `max` ; un dépassement est plafonné et signalé (`capped`) | store |
| R3 | Service sans dimension ⇒ une seule ligne, aucun sélecteur, un nouvel ajout ne change rien | store |
| R4 | Un service absent ou `disabled` est purgé au chargement | store (hydratation) |
| R5 | Le prix n'est jamais persisté ; il est recalculé depuis le catalogue | estimation |
| R6 | `quote` ⇒ hors total, compté séparément | estimation |
| R7 | `from` ⇒ total marqué estimatif | estimation |
| R8 | Montants entiers XAF, formatés « 100 000 FCFA » | formatage |
| R9 | Message WhatsApp ≤ 1 800 caractères encodés, troncature par lignes entières | whatsapp |
| R10 | Sélection de plus de 30 jours purgée | store (hydratation) |
| R11 | L'unité de prix doit être cohérente avec les dimensions déclarées (voir `QuantityRule`) | validation du catalogue au build |
| R12 | Dates et voyageurs ne sont jamais obligatoires ; un rappel s'affiche si la sélection contient du tourisme et qu'ils manquent | page Mon séjour (client D2) |
| R13 | Prix, quantités, statuts et identifiants ne sont jamais localisés ; seuls les textes le sont | schéma du catalogue (ADR-013) |
| R14 | Texte `en` manquant : repli sur `fr` en développement et en aperçu, échec du build de production | contrôle au build (ADR-013) |
| R15 | Au plus deux dimensions par service, dont au plus une durée ; le montant d'une ligne multiplie le prix unitaire par toutes les dimensions | schéma du catalogue et estimation (client, 2026-09-16) |

## 8. Exemple de fichier de service

`src/content/services/chutes-de-la-lobe.json`

```json
{
  "title": { "fr": "Chutes de la Lobé", "en": "Lobé Waterfalls" },
  "pole": "tourisme",
  "categoryId": "nature-decouverte",
  "shortDescription": {
    "fr": "L'une des rares chutes au monde qui se jettent directement dans la mer.",
    "en": "One of the few waterfalls in the world that flow straight into the sea."
  },
  "description": { "fr": "…", "en": "…" },
  "images": [
    {
      "src": "./images/lobe-1.jpg",
      "alt": { "fr": "Les chutes de la Lobé se jetant dans l'océan", "en": "The Lobé waterfalls flowing into the ocean" }
    }
  ],
  "pricing": { "kind": "from", "amount": 25000, "unit": "per_person" },
  "quantity": { "dimensions": [{ "kind": "persons", "min": 1, "max": 10, "default": 2 }] },
  "duration": { "fr": "3 à 4 heures", "en": "3 to 4 hours" },
  "capacity": { "max": 10 },
  "conditions": {
    "included": [{ "fr": "Guide local", "en": "Local guide" }],
    "excluded": [{ "fr": "Repas", "en": "Meals" }],
    "notes": [{ "fr": "Prévoir des chaussures fermées", "en": "Wear closed shoes" }]
  },
  "availability": "available",
  "featured": true,
  "order": 10
}
```

Un service à deux dimensions, `src/content/services/location-avec-chauffeur.json` :

```json
{
  "title": { "fr": "Location avec chauffeur", "en": "Car with driver" },
  "pole": "transport",
  "categoryId": "location-avec-chauffeur",
  "pricing": { "kind": "from", "amount": 50000, "unit": "per_day" },
  "quantity": {
    "dimensions": [
      { "kind": "units", "label": { "fr": "véhicules", "en": "vehicles" }, "min": 1, "max": 5, "default": 1 },
      { "kind": "days", "min": 1, "max": 30, "default": 1 }
    ]
  },
  "availability": "available",
  "order": 20
}
```

Une sélection de 2 véhicules pendant 3 jours donne une ligne à 50 000 × 2 × 3 = 300 000 FCFA, affichée « à partir de », puisque le prix est de type `from`.

Les valeurs sont des **placeholders** en attendant les tarifs, photos et textes de Franck, suivis dans [content-tracker.md](./content-tracker.md). Le prix, les quantités et le statut ne sont écrits qu'une fois, quelle que soit la langue.
