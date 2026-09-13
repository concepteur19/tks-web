# Modèle de données frontend

**Statut** : draft · **Date** : 2026-09-13

## 1. Principes

- Une seule source de vérité : les **schémas Zod** des content collections Astro. Les types TypeScript en sont dérivés (`z.infer`).
- Le **catalogue** (services, catégories) est statique, versionné, validé au build.
- La **sélection** est dynamique, persistée dans le navigateur, validée au chargement par un schéma dédié.
- La sélection ne copie jamais un prix : elle référence un service par identifiant et le prix est recalculé depuis le catalogue courant. Un changement de tarif se répercute immédiatement, et aucun prix périmé n'est envoyé à TKS.
- Les montants sont des **entiers en francs CFA** (`XAF`, pas de centimes).

## 2. Entités du catalogue

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
| `name` | `string` | oui | Libellé affiché, ex. « Aventure » |
| `description` | `string` | non | Une phrase pour l'onglet ou l'en-tête |
| `order` | `number` | oui | Ordre d'affichage dans le pôle |

### `Service`

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` (slug) | oui | Identifiant stable = nom de fichier, ex. `chutes-de-la-lobe`. Sert de clé dans la sélection |
| `title` | `string` | oui | Nom affiché |
| `pole` | `Pole` | oui | Pôle |
| `categoryId` | `string` | oui | Référence vers `ServiceCategory.id` (vérifiée au build) |
| `shortDescription` | `string` (≤ 160 car.) | oui | Carte + meta description |
| `description` | `string` (markdown) | oui | Fiche |
| `images` | `Image[]` (≥ 1) | oui | `{ src, alt }`, la première est l'image principale |
| `pricing` | `Pricing` | oui | Voir ci-dessous |
| `quantity` | `QuantityRule` | oui | Voir ci-dessous |
| `duration` | `string` | non | Texte libre, ex. « 3 à 4 heures » |
| `capacity` | `{ min?: number; max?: number }` | non | Nombre de personnes |
| `conditions` | `{ included?: string[]; excluded?: string[]; notes?: string[] }` | non | Inclus / non inclus / à savoir |
| `availability` | `'available' \| 'on_request' \| 'disabled'` | oui (défaut `available`) | `on_request` = badge « à confirmer » ; `disabled` = invisible et purgé de la sélection |
| `featured` | `boolean` | non (défaut `false`) | Mis en avant sur l'accueil |
| `order` | `number` | non (défaut 100) | Ordre dans la catégorie |
| `seo` | `{ title?: string; description?: string }` | non | Surcharge des métadonnées |

### `Pricing` (union discriminée)

```ts
type PriceUnit = 'per_unit' | 'per_person' | 'per_day' | 'per_hour' | 'per_trip' | 'per_parcel';

type Pricing =
  | { kind: 'fixed'; amount: number; unit: PriceUnit }   // « 70 000 FCFA / course »
  | { kind: 'from';  amount: number; unit: PriceUnit }   // « à partir de 25 000 FCFA / personne »
  | { kind: 'quote' };                                    // « Sur devis »
```

Règles :
- `amount` est un entier strictement positif.
- L'unité pilote le libellé affiché (`/ personne`, `/ jour`…) et doit être cohérente avec `QuantityRule.mode` (validation au build : `per_person` ⇒ `mode = 'persons'`).

### `QuantityRule`

```ts
type QuantityRule =
  | { mode: 'none' }                                            // pas de quantité, 1 seule ligne possible
  | { mode: 'units';   min: number; max: number; default: number; label: string }   // ex. label « véhicules », « colis »
  | { mode: 'persons'; min: number; max: number; default: number };                 // nombre de personnes
```

Règles : `1 ≤ min ≤ default ≤ max ≤ 50`.

### `Pack` (réservé V2)

`{ id, title, description, images, serviceIds: string[], pricing: Pricing, customizable: boolean }`. Un pack se sélectionne en ajoutant ses services à la sélection avec un marqueur d'origine ; non implémenté en V1.

### `Accommodation` (réservé V2)

Un hébergement sera un `Service` du pôle `tourisme`, catégorie `hebergement`, avec `unit: 'per_night'` ajouté à `PriceUnit` le moment venu.

## 3. Entités de la sélection

### `SelectedService`

| Champ | Type | Description |
|---|---|---|
| `serviceId` | `string` | Référence vers `Service.id` |
| `quantity` | `number` | Entier ≥ 1, borné par la règle du service |
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
  | { type: 'added'; serviceId: string; quantity: number }
  | { type: 'merged'; serviceId: string; quantity: number; capped: boolean }
  | { type: 'updated'; serviceId: string; quantity: number }
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
| `title` | `string` | Copié du catalogue au moment du calcul |
| `quantity` | `number` | |
| `pricingKind` | `'fixed' \| 'from' \| 'quote'` | |
| `unit` | `PriceUnit \| null` | |
| `unitAmount` | `number \| null` | `null` si `quote` |
| `lineAmount` | `number \| null` | `unitAmount × quantity`, `null` si `quote` |

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
- `buildSelectionMessage(estimate: PriceEstimate, stay: Selection['stay'], options: { intent: 'stay' | 'delivery' | 'mixed' }): string`
- `buildSingleServiceMessage(service: Service, quantity: number): string`
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
| R1 | Un service n'apparaît qu'une fois dans la sélection ; un nouvel ajout fusionne les quantités | store de sélection |
| R2 | La quantité est bornée par `min` / `max` de la règle du service ; un dépassement est plafonné et signalé (`capped`) | store |
| R3 | `mode: 'none'` ⇒ quantité fixe 1, fusion sans changement | store |
| R4 | Un service absent ou `disabled` est purgé au chargement | store (hydratation) |
| R5 | Le prix n'est jamais persisté ; il est recalculé depuis le catalogue | estimation |
| R6 | `quote` ⇒ hors total, compté séparément | estimation |
| R7 | `from` ⇒ total marqué estimatif | estimation |
| R8 | Montants entiers XAF, formatés « 100 000 FCFA » | formatage |
| R9 | Message WhatsApp ≤ 1 800 caractères encodés, troncature par lignes entières | whatsapp |
| R10 | Sélection de plus de 30 jours purgée | store (hydratation) |
| R11 | `unit: 'per_person'` ⇒ `quantity.mode = 'persons'` | validation du catalogue au build |

## 8. Exemple de fichier de service

`src/content/services/excursion-en-pirogue.json`

```json
{
  "title": "Excursion en pirogue",
  "pole": "tourisme",
  "categoryId": "nature",
  "shortDescription": "Remontez la Lobé en pirogue jusqu'au village pygmée, entre mangrove et chutes.",
  "description": "…",
  "images": [{ "src": "./images/pirogue-1.jpg", "alt": "Pirogue sur la rivière Lobé" }],
  "pricing": { "kind": "from", "amount": 15000, "unit": "per_person" },
  "quantity": { "mode": "persons", "min": 1, "max": 10, "default": 2 },
  "duration": "2 à 3 heures",
  "capacity": { "max": 10 },
  "conditions": {
    "included": ["Piroguier", "Gilets de sauvetage"],
    "excluded": ["Repas"],
    "notes": ["Départ le matin de préférence", "Prévoir des chaussures fermées"]
  },
  "availability": "available",
  "featured": true,
  "order": 10
}
```

Les valeurs sont des **placeholders** en attendant les réponses B1, C1, C2 du questionnaire client.
