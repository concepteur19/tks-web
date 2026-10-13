# Quickstart — 005 Hébergements, formules et parcours

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # schéma (sections, per_couple), catalogIssues (références) à 100 %
npm run build:prod     # pages Hébergements et Formules × 2 langues ; traductions complètes
npm run check:links    # plus aucun lien vers WhatsApp faute de page
npm run check:bundle   # TourCustomizer compris, ≤ 50 Ko par page
npm run test:e2e
npm run lighthouse     # /hebergements et /formules ≥ 90
```

`lighthouserc.json` reçoit `/hebergements.html` et `/formules.html`.

## Scénarios à dérouler à la main

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Onglet Hébergements | explication en tête ; chambre, studio, appartement (3 budgets), villa ; aucun montant haut de gamme avant l'encadré final | US1-1, US1-4 |
| 2 | Ajouter le studio | message de confirmation, compteur +1 | US1-2 |
| 3 | Mon séjour : studio, 3 nuits | 90 000 FCFA, total « estimatif » | US1-3 |
| 4 | Photo d'un palier | « Exemple de logement à ce budget » | US1-5 |
| 5 | Page Tourisme | carte « Parcours Kibreeze » qui mène aux parcours | US2-1 |
| 6 | Carte « L'Essentiel de Kribi » | 4 étapes liées, à partir de 30 000 FCFA / personne, minimum 2, dégressif | US2-2 |
| 7 | « Kribi & Ebodjé » | « Sur devis », action disponible | US2-3 |
| 8 | Personnaliser L'Essentiel pour 4 | ligne unique, 120 000 FCFA « à partir de » | US2-4 |
| 9 | Sélecteur d'un parcours à 2 | « moins » désactivé | US2-5 |
| 10 | Page Formules | parcours puis formules ; « base de 2 personnes » ; 4 formules | US3-1 |
| 11 | Ajouter la formule Évasion deux fois | une ligne ; « Déjà dans mon séjour » | US3-2 |
| 12 | Séjour studio + parcours + formule + expérience, envoyer | message qui nomme chacun avec ses quantités | SC-003 |
| 13 | Accueil, liens vers Hébergements et Formules | mènent aux pages, plus à WhatsApp | FR-015 |

## Résultats relevés

Contrôles automatiques du 2026-10-13 (T031) :

| Contrôle | Résultat |
|---|---|
| `npm run check` | 188 tests unitaires (couverture 100 %), 39 tests de composants et d'îlots, lint, types, contrastes : tout passe |
| `npm run build:prod` | 90 pages, traductions complètes |
| `npm run check:links` | 3 372 liens internes, aucun cassé |
| `npm run check:bundle` | Hébergements 21,9 Ko, Formules 23,0 Ko (budget 50 Ko) ; la plus lourde, Mon séjour, 26,9 Ko |
| `npm run test:e2e` | 413 parcours, Chromium et WebKit : tout passe (3 ignorés sous WebKit, comme avant) |

Lighthouse, profil mobile, médiane de trois passages :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP simulé | CLS |
|---|---|---|---|---|---|---|
| `/hebergements` | 98 | 100 | 100 | 100 | 2,25 s | 0 |
| `/formules` | 97 | 100 | 100 | 100 | 2,55 s | 0 |

## Comparaison visuelle (T032)

Captures à 390 px (2x) et 1 440 px, comparées aux écrans 06a et 07 et à l'illustration de parcours du cahier (page 6).

- Hébergements : conforme à 06a (explication en tête, une carte par type, budgets en rangées, encadré haut de gamme sombre en fin de page).
- Formules : conforme à 07 (base de 2 personnes, prestations cochées, prix « / 2 personnes », bouton pleine largeur, badge « Le plus complet », encadré des groupes), précédé des parcours.
- Corrigé : les cartes de formule n'avaient pas toutes la même largeur ; trois parcours montraient la même photo des chutes (Nature & Littoral et Au fil de l'eau ont désormais leur propre photo) ; la note « Prix de départ par personne » s'affichait sur les parcours sur devis ; sur ordinateur, l'ancre `#formules` masquait le titre sous l'en-tête.
- Écarts conservés : bouton « Ajouter » plein (06a le montre au trait), par cohérence avec les cartes d'expérience ; « Formule » au lieu de « Package » (07), par cohérence avec l'onglet.

Scénarios manuels 1 à 13 : à dérouler par Zobel (T033).
