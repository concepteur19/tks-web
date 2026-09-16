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

### `Pole`

```ts
type Pole = 'transport' | 'tourisme' | 'livraison';
```

Les trois pôles sont fixes dans le code (ils structurent les routes). Leurs libellés, descriptions et visuels sont dans un fichier de contenu `poles.json`.

### `ServiceCategory`

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` (slug) | oui | Identifiant stable, ex. `aventure` |
| `pole` | `Pole` | oui | Pôle parent |
| `name` | `LocalizedString` | oui | Libellé affiché, ex. `{ fr: "Aventure", en: "Adventure" }` |
| `description` | `LocalizedString` | non | Une phrase pour l'onglet ou l'en-tête |
| `order` | `number` | oui | Ordre d'affichage dans le pôle |

### `Service`

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` (slug) | oui | Identifiant stable = nom de fichier, ex. `chutes-de-la-lobe`. Sert de clé dans la sélection et de slug d'URL, identique en français et en anglais |
| `title` | `LocalizedString` | oui | Nom affiché |
| `pole` | `Pole` | oui | Pôle |
| `categoryId` | `string` | oui | Référence vers `ServiceCategory.id` (vérifiée au build) |
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
// Liste arrêtée avec le client le 2026-09-16 : l'unité est choisie service par service.
type PriceUnit =
  | 'per_person'      // par personne
  | 'per_group'       // forfait pour le groupe
  | 'per_equipment'   // par équipement : jet-ski, quad, cheval
  | 'per_hour'        // par heure
  | 'per_day'         // par jour
  | 'per_trip'        // par course ou par trajet
  | 'per_delivery'    // par livraison
  | 'per_service';    // par prestation, forfait

type Pricing =
  | { kind: 'fixed'; amount: number; unit: PriceUnit }   // « 70 000 FCFA / course »
  | { kind: 'from';  amount: number; unit: PriceUnit }   // « à partir de 25 000 FCFA / personne »
  | { kind: 'quote' };                                    // « Sur devis »
```

Règles :
- `amount` est un entier strictement positif.
- L'unité nomme le prix affiché (`/ personne`, `/ jour`, `/ course`…) et doit être cohérente avec les dimensions de quantité, ce que le build vérifie : `per_person` exige une dimension `persons` ; `per_day` une dimension `days` ; `per_hour` une dimension `hours` ; `per_equipment` une dimension `units` ; `per_group`, `per_service`, `per_trip` et `per_delivery` acceptent zéro ou une dimension `units`.
- Une tarification qui dépend de la distance, du nombre d'enfants, de la période ou d'un prestataire n'est pas modélisée : le service est `quote`. C'est le cas du transport professionnel et du transport scolaire (client C2, C3 et compléments du 2026-09-16).

### `QuantityRule` et ses dimensions

Franck refuse une unité imposée à tout un pôle, et certains services se comptent sur deux axes à la fois, par exemple « 2 véhicules pendant 3 jours » (réponses du 2026-09-16). Un service porte donc de zéro à deux **dimensions** de quantité.

```ts
type QuantityDimension =
  | { kind: 'persons'; min: number; max: number; default: number }
  | { kind: 'units';   label: LocalizedString; min: number; max: number; default: number }  // véhicules, colis, équipements, groupes
  | { kind: 'days';    min: number; max: number; default: number }
  | { kind: 'hours';   min: number; max: number; default: number };

type QuantityRule = { dimensions: QuantityDimension[] };   // 0, 1 ou 2 dimensions
```

Règles :
- `1 ≤ min ≤ default ≤ max ≤ 50` pour chaque dimension.
- Zéro, une ou deux dimensions. Au plus une dimension de durée (`days` ou `hours`), et jamais deux fois le même `kind`.
- Sans dimension, le service s'ajoute tel quel : forfait, prestation, ou service sur devis.
- Le montant d'une ligne est le prix unitaire multiplié par **toutes** les dimensions : « location avec chauffeur, 2 véhicules × 3 jours » vaut le prix du jour × 6.

Correspondance demandée par le client pour le transport :

| Service | `pricing.unit` | Dimensions |
|---|---|---|
| Courses à Kribi | `per_trip` | aucune, ou `units` « courses » |
| Location avec chauffeur | `per_day` ou `per_hour` | `units` « véhicules » + `days` ou `hours` |
| Chauffeur privé | `per_hour` ou `per_day` | `hours` ou `days` |
| Transferts | `per_trip` | `units` « véhicules » |
| Transport professionnel | `quote` | aucune |
| Transport scolaire | `quote` | aucune |
| Location sans chauffeur | `per_day` | `units` « véhicules » + `days` |

Tourisme : `per_person` avec une dimension `persons` ; `per_group` ou `per_service` sans dimension ; `per_equipment` avec une dimension `units` « équipements », éventuellement combinée à `hours` ou `days`. Livraison : `per_delivery` avec une dimension `units` « colis », ou `quote` quand le prix dépend de la distance.

### `Pack` (réservé V2)

`{ id, title, description, images, serviceIds: string[], pricing: Pricing, customizable: boolean }`. Un pack se sélectionne en ajoutant ses services à la sélection avec un marqueur d'origine ; non implémenté en V1.

### `Accommodation` (réservé V2)

Un hébergement sera un `Service` du pôle `tourisme`, catégorie `hebergement`, avec `unit: 'per_night'` ajouté à `PriceUnit` le moment venu.

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
- `buildSelectionMessage(estimate: PriceEstimate, stay: Selection['stay'], options: { intent: 'stay' | 'delivery' | 'mixed'; locale: Locale }): string`
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
