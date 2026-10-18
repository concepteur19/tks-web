# Data Model — 009 Micro-interactions et mini tuto

**Feature**: [spec.md](./spec.md) · Décisions : [research.md](./research.md)

Aucune donnée de catalogue ne change. La feature ajoute un état local (le tuto), deux tokens de mouvement et des chaînes d'interface.

## État du tuto

```ts
type GuideStatus = 'new' | 'done';            // mémorisé sur l'appareil
type GuideStepId = 'explore' | 'add' | 'send';
type GuideState =
  | { kind: 'hidden' }
  | { kind: 'open'; step: 0 | 1 | 2 };
type GuideEvent = 'next' | 'skip' | 'finish' | 'added';
```

| Règle | Fonction pure (`src/features/guide/guide.ts`) |
|---|---|
| Le tuto s'affiche si et seulement si `status === 'new'` **et** le séjour est vide | `shouldShowGuide({ status, itemCount })` |
| `next` : étape suivante ; à la dernière étape, `next` vaut `finish` | `nextGuideState(state, event)` |
| `skip` ou `finish` : `hidden`, et le statut devient `done` | idem, renvoie `{ state, status }` |
| `added` pendant les étapes 0 ou 1 : passe à l'étape 2 ; à l'étape 2 : rien | idem |
| Tout événement sur `hidden` : rien | idem |

### Étapes (`GUIDE_STEPS`)

| # | `id` | Cible téléphone (`data-guide`) | Cible ordinateur | Texte |
|---|---|---|---|---|
| 0 | `explore` | barre à onglets (`explore`) | menu du haut (`explore`) | `guide.explore.*` |
| 1 | `add` | onglet Mon séjour (`stay`) | icône Mon séjour (`stay`) | `guide.add.*` |
| 2 | `send` | onglet Mon séjour (`stay`) | icône Mon séjour (`stay`) | `guide.send.*` |

### Mémoire

| Clé | Stockage | Valeur |
|---|---|---|
| `kibreeze.guide.v1` | `localStorage`, à défaut `sessionStorage`, à défaut variable de page | `"done"` |

Aucune donnée ne quitte l'appareil. Effacer les données du site fait revoir le tuto, ce qui est acceptable.

## Tokens de mouvement (`src/styles/tokens.css`)

| Token | Valeur | Usage |
|---|---|---|
| `--duration-fast` | 120 ms (existant) | chiffres des sélecteurs, appui |
| `--duration-base` | 200 ms (existant) | survol, fondu entre pages, sortie des notifications, repli de ligne |
| `--duration-slow` | 320 ms (existant) | apparition au défilement, fondu d'image, rebond du compteur, entrée des notifications |
| `--ease-standard` | existant | toutes les animations |
| `--duration-stagger` | **60 ms** (nouveau) | décalage entre deux éléments d'une cascade (index 0 à 3) |
| `--distance-reveal` | **0,75 rem** (nouveau) | montée d'un élément qui apparaît |

Plafonds (spec, SC-006) : aucune animation au-delà de `--duration-slow` ; cascade complète ≤ 3 × 60 + 320 = 500 ms.

## Constantes d'interface

| Constante | Valeur | Où |
|---|---|---|
| `ADDED_FLASH_MS` | 1 500 ms | durée d'affichage de « Ajouté ✓ » (état, pas animation) |
| `GUIDE_DELAY_MS` | 1 500 ms au plus | délai d'apparition du tuto après le chargement |
| `VIBRATION_MS` | 15 ms | vibration à l'ajout |
| `REVEAL_INDEX_MAX` | 3 | plafond de la cascade |
