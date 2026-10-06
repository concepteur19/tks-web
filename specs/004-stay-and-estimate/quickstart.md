# Quickstart — 004 Mon séjour, estimation et demande WhatsApp

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # sélection, estimation, message : 100 % de couverture ; composants Preact (axe)
npm run build:prod
npm run check:links
npm run check:bundle   # ≤ 50 Ko par page de contenu, ≤ 80 Ko sur /sejour
npm run test:e2e       # ajout, fusion, persistance, Mon séjour, message, stockage indisponible, sans JavaScript
npm run lighthouse     # /sejour ≥ 90 (SC-005)
```

## Scénarios à dérouler à la main

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Fiche pirogue : 6 personnes + guide, « Ajouter » | message de confirmation, compteur 1, total barre = 40 000 FCFA | US1-1, US1-5 |
| 2 | Réajouter la pirogue avec 3 personnes | une seule ligne, 9 personnes → sur devis (au-delà de 8) | US1-2, FR-013 |
| 3 | Campement : tarif couple, ajouter | ligne « tarif couple » 20 000 FCFA | US1-4 |
| 4 | Feu de plage : ajouter deux fois | la seconde fois, « Déjà dans mon séjour » | US1-6 |
| 5 | Liste : « Ajouter » sur la carte des chutes | ligne avec 2 personnes (valeur par défaut) | FR-002 |
| 6 | Fermer et rouvrir le navigateur | sélection identique | US1-7 |
| 7 | Ouvrir Mon séjour | lignes, quantités en toutes lettres, total, euro, « + N sur devis » | US2-1 |
| 8 | Modifier une quantité, supprimer une ligne, « Vider » | total et compteur à jour ; confirmation avant de vider ; état vide | US2-3, US2-4, US2-7 |
| 9 | Laisser dates et voyageurs vides | rappel visible, envoi possible | US2-5 |
| 10 | « Demander un devis par WhatsApp » | message complet dans la langue de la page | US3-1, US3-2 |
| 11 | Changer de langue sur Mon séjour | mêmes lignes, libellés traduits, montants au format de la langue | FR-009 |
| 12 | Navigation privée stricte (Safari) | bandeau « sélection non conservée », tout fonctionne | FR-008 |
| 13 | Sur ordinateur, Mon séjour | panneau du total collant à droite ; icône de l'en-tête avec compteur | FR-023, US4 |
| 14 | Accueil : « Planifier mon séjour » | mène à Mon séjour | FR-028 |

## Résultats relevés

À compléter en fin d'implémentation.
