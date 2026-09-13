# Stratégie de tests

**Statut** : draft · **Date** : 2026-09-13 · ADR-010

## 1. Principe

Tester en priorité ce qui fait la valeur du produit : **la sélection, l'estimation et le message WhatsApp**. Pas d'objectif de couverture globale. Objectif de couverture à 100 % sur `features/estimation` et `features/whatsapp`, et sur les opérations du store de sélection. Le reste est couvert par les tests de composants et E2E là où le risque le justifie.

## 2. Pyramide

| Niveau | Outil | Cible | Nombre indicatif |
|---|---|---|---|
| Unitaire | Vitest | Fonctions pures, store, schémas, migrations | ~60 |
| Composant | Vitest + Testing Library + jest-axe | Îlots React et leurs états | ~20 |
| Intégration build | Vitest + `astro build` | Validation du catalogue, génération sitemap | ~5 |
| E2E | Playwright (Chromium + WebKit mobile) + axe | Parcours de conversion | 3 à 5 |
| Qualité | Lighthouse CI | Perf, a11y, SEO | 4 pages |

## 3. Tests unitaires

### `features/estimation`
- `fixed × n`, `from × n`, `quote` → montants de ligne.
- Total avec mélange fixed / from / quote ; `hasFromPrices`, `quoteCount`, `isQuoteOnly`.
- Sélection vide → total 0, `isQuoteOnly` true.
- Service manquant dans le catalogue → ligne ignorée (et signalée).
- `formatPrice(100000)` → `"100 000 FCFA"` (espace insécable).

### `features/whatsapp`
- Message complet avec dates, voyageurs, lignes des trois types, total.
- Message sans dates ni voyageurs → lignes omises proprement.
- Intention : uniquement livraison → « une livraison » ; mixte → « un séjour ».
- Encodage URL : accents, sauts de ligne, `×`, `→`.
- Troncature : sélection de 40 lignes → `truncated` true, `omittedCount` correct, total inchangé, URL ≤ 1 800 caractères encodés.
- Message mono-service depuis une fiche.
- Snapshot d'un exemple complet (non-régression du format validé par le client, E3).

### `features/selection` (store)
- add, merge avec plafonnement (`capped`), update, remove, clear.
- `mode: 'none'` : pas de duplication, quantité fixe.
- Hydratation : schéma valide, version inconnue → reset, JSON corrompu → reset, sélection > 30 jours → reset, service `disabled` → purgé avec événement.
- Persistance indisponible (mock `localStorage` qui lève) → mode mémoire, aucun crash.

### `content/config`
- Schéma `Service` : `per_person` sans `mode: 'persons'` → erreur ; `min > max` → erreur ; `images` vide → erreur.
- `categoryId` inconnu → erreur au build (test d'intégration).

## 4. Tests de composants

| Composant | Cas |
|---|---|
| `QuantityStepper` | bornes min/max, saisie clavier, libellés accessibles, `aria-live` |
| `AddToStay` | ajout, feedback, quantité par défaut |
| `SelectionLine` | modification, suppression, badge sur devis |
| `EstimateSummary` | 4 états (estimatif, indicatif, sur devis uniquement, vide) |
| `SelectionDrawer` | ouverture, piège de focus, Échap, lien vers `/sejour` |
| `SelectionPage` | état vide, état plein, champs séjour, lien WhatsApp avec `href` attendu |
| `Toaster` | action « Annuler », disparition |

Chaque test de composant passe `axe` sur le rendu.

## 5. Tests E2E (Playwright)

| # | Scénario | Assertions |
|---|---|---|
| E1 | Accueil → Tourisme → filtre → fiche → quantité 2 → ajouter → Transport → fiche → ajouter → Mon séjour | Badge = 2, deux lignes, total exact, `href` du CTA WhatsApp contient le message attendu décodé |
| E2 | Ajouter → recharger → fermer le contexte → rouvrir | Sélection restaurée |
| E3 | Mon séjour vide | État vide, CTA vers Tourisme, badge masqué |
| E4 | Doublon et plafonnement | Quantité fusionnée, message « maximum » |
| E5 | Navigation clavier complète du parcours E1 | Aucun piège, focus visible, axe sans violation critique |

Projets Playwright : `desktop-chromium`, `mobile-webkit` (iPhone 13). Les E2E tournent sur le build statique servi localement (`astro preview`), pas sur le serveur de dev.

## 6. Qualité continue

- **Lighthouse CI** sur `/`, `/tourisme`, une fiche, `/sejour` : seuils 90 / 90 / 90 / 90, budgets JS.
- **Bundle** : script de vérification de taille des îlots (`size-limit`) avec seuils de [technical-requirements.md](./technical-requirements.md).
- **Typecheck** : `astro check` + `tsc --noEmit`.
- **Lint** : ESLint + Prettier en pré-commit (lint-staged) et en CI.

## 7. Ce qui n'est pas testé automatiquement

- L'ouverture réelle de WhatsApp (externe) : vérifiée manuellement sur iOS, Android et desktop à chaque release.
- Le rendu visuel pixel-perfect : revue manuelle contre Figma ; des tests de régression visuelle (Playwright screenshots) pourront être ajoutés une fois le design stabilisé.
- Le contenu (textes, prix) : validé par le client.

## 8. Définition de « terminé » pour une feature

1. Les critères d'acceptation de la spec sont couverts par au moins un test.
2. `npm run check` (lint, typecheck, unit, component) passe.
3. Les E2E concernés passent sur les deux projets.
4. Lighthouse CI ne régresse pas.
5. La documentation (`docs/`, spec) est à jour.
