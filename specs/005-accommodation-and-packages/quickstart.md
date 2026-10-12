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

À compléter en fin d'implémentation.
