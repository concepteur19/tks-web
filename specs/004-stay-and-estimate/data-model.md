# Data Model — 004 Mon séjour, estimation et demande WhatsApp

**Feature**: [spec.md](./spec.md) · **Recherche**: [research.md](./research.md) · Base : [docs/data-model.md](../../docs/data-model.md) §3 à §5, adaptée ci-dessous.

## Selection (persistée, clé `kibreeze.selection.v1`)

```ts
type Selection = {
  version: 1;
  items: SelectedLine[];          // une ligne par serviceId, ordre d'ajout
  stay: { dates?: string; travelers?: number };
  updatedAt: string;              // ISO 8601
};

type SelectedLine = {
  serviceId: string;
  quantities: number[];           // une valeur par dimension, dans l'ordre du catalogue ; [] sans dimension
  tierId?: string;                // tarif choisi (campement Bagyeli)
  optionIds: string[];            // options cochées, sans doublon
};
```

Règles :

| Règle | Source |
|---|---|
| `quantities[i]` entier, `min ≤ q ≤ max` de la dimension `i`, sinon ramené à la borne | FR-001, edge case |
| Ajout d'une ligne existante : `persons` et `units` s'additionnent (plafonnés au max, événement `capped`), durées remplacées, `tierId` et `optionIds` remplacés | FR-003 |
| Ligne sans dimension ou sur devis : pas de doublon, l'ajout est refusé (`alreadyThere`) | FR-004 |
| `stay.dates` : texte libre, 80 caractères au plus ; `stay.travelers` : entier 1 à 50 | FR-021 |
| `updatedAt` > 30 jours → sélection vide au chargement | FR-006 |
| Version ≠ 1, JSON ou forme invalide → sélection vide | FR-006 |
| Service absent, désactivé, option ou tarif disparu → ligne (ou option) retirée et signalée | FR-007 |

## SelectionEvent (retour des opérations, pour les messages)

```ts
type SelectionEvent =
  | { type: 'added' | 'updated'; serviceId: string }
  | { type: 'merged'; serviceId: string; capped: boolean }
  | { type: 'alreadyThere'; serviceId: string }
  | { type: 'removed'; serviceId: string }
  | { type: 'cleared' }
  | { type: 'purged'; serviceIds: string[] }
  | { type: 'storageUnavailable' };
```

## IslandService (catalogue minimal des îlots)

```ts
type IslandService = {
  id: string;
  title: LocalizedString;
  pricing?: Pricing;
  tiers?: { id: string; label: LocalizedString; pricing: Pricing; quantity?: QuantityRule }[];
  quantity: QuantityRule;
  isOption: boolean;
  thumbnail?: string;             // URL d'une vignette déjà optimisée
  href: Record<Locale, string>;   // adresse de la fiche
};
```

## Estimation

```ts
type EstimateLine = {
  serviceId: string;
  title: LocalizedString;
  quantities: number[];
  dimensions: { kind: QuantityDimension['kind']; label?: LocalizedString }[];
  tier?: { id: string; label: LocalizedString };
  pricingKind: 'fixed' | 'from' | 'quote';
  unit: PriceUnit | null;
  unitAmount: number | null;
  options: { id: string; title: LocalizedString; amount: number }[];
  lineAmount: number | null;      // null si sur devis ; options comprises sinon
  overCapacity: boolean;          // capacité de groupe dépassée → sur devis
};

type PriceEstimate = {
  lines: EstimateLine[];
  total: number;                  // somme des lineAmount non nuls
  quoteCount: number;
  hasFromPrices: boolean;
  isQuoteOnly: boolean;           // toutes les lignes sur devis (ou aucune ligne)
  currency: 'XAF';
};
```

Cas de référence (tests, SC-002) :

| Sélection | Total | Sur devis |
|---|---|---|
| Pirogue (35 000 / groupe, 6 pers.) + guide (5 000) | 40 000 | 0 |
| Pirogue 10 personnes (max 8) | 0 | 1, `overCapacity` |
| Chutes × 2 (5 000 / pers.) + musée (1 500 / pers.) | 13 000 | 0 |
| Campement tarif couple (20 000) | 20 000 | 0 |
| Campement tarif groupe | 0 | 1 |
| Quad × 3 sessions (10 000) | 30 000 | 0 |
| Pirogue + chutes × 2 + jet-ski | 45 000 | 1 |
| Jet-ski + bateau de plaisance | — (sur devis) | 2, `isQuoteOnly` |

## Message

```ts
buildSelectionMessage(input: {
  estimate: PriceEstimate;
  stay: Selection['stay'];
  intent: 'quote' | 'single';
  locale: Locale;
  url?: string;                   // intent single : adresse de la fiche
}): string                        // ≤ 1 800 caractères une fois encodé
```
