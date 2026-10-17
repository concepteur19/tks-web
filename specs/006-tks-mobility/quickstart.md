# Quickstart — 006 Mobilité TKS®

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Préparation

```bash
npm run photos:import  # floute les plaques des 5 photos de mobility/ ; vérifier chaque photo en pleine résolution
```

## Contrôles automatiques

```bash
npm run check          # schéma (models), estimation des cas de référence à 100 %
npm run build:prod     # page Mobilité × 2 langues ; traductions complètes
npm run check:links    # plus aucun lien vers WhatsApp faute de page (SC-003)
npm run check:bundle   # LineCustomizer compris, ≤ 50 Ko par page
npm run test:e2e
npm run lighthouse     # /mobilite ≥ 90 (SC-004)
```

`lighthouserc.json` reçoit `/mobilite.html`.

## Scénarios à dérouler à la main

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Accueil, bandeau TKS® | mène à la page Mobilité | US3-1 |
| 2 | Navigation ordinateur | « Mobilité TKS® » mène à la page ; sur téléphone, toujours 5 onglets | US3-2 |
| 3 | En-tête de la page | logo TKS®, titre, phrase, mention Breezy Groupe ; aucune photo plein écran | US1-1, FR-002 |
| 4 | Location de véhicules | Luxe, Premium, Yaris dans cet ordre ; modèles ; « À partir de X FCFA / jour » | US1-2 |
| 5 | Premium, 1 véhicule, 4 jours, ajouter | Mon séjour : « Premium — 1 véhicule × 4 jours », 140 000 FCFA, total estimatif | US1-3 |
| 6 | Yaris, 2 véhicules, 3 jours | 150 000 FCFA | US1-4 |
| 7 | Premium ajouté deux fois | une ligne, véhicules additionnés, jours remplacés | cas limite |
| 8 | Ajouter Transferts | ligne « sur devis », hors total, « + 1 prestation sur devis » | US2-2 |
| 9 | Envoyer la demande | le message nomme le transfert et le véhicule | US2-3 |
| 10 | Fin de page | encadré « Besoin d'un transport sur mesure ? » et bouton WhatsApp | US2-4 |
| 11 | Photos en pleine résolution | aucune plaque lisible | FR-006 |
| 12 | JavaScript désactivé | chaque prestation a un lien WhatsApp qui la nomme | FR-011 |
| 13 | Parcours sur la page Formules | « Personnaliser ce parcours » fonctionne comme avant | non-régression |

## Résultats (2026-10-17)

| Contrôle | Résultat |
|---|---|
| `npm run check` | lint, format, types, tokens, contenu ; 40 tests de composants et d'îlots, 205 tests unitaires, couverture 100 % |
| `npm run build:prod` | 92 pages, traductions complètes |
| `npm run check:links` | 3 632 liens internes, aucun cassé ; plus aucun lien vers WhatsApp faute de page (SC-003) |
| `npm run check:bundle` | `/mobilite` : 23,5 kB compressés (budget 50 kB) |
| `npm run test:e2e` | 461 tests passés (desktop-chromium, mobile-webkit) |
| `npm run lighthouse` | `/mobilite` : performance 99–100, accessibilité 100, bonnes pratiques 96, référencement 100 (SC-004) |

Les tests de la page Mobilité attendent l'hydratation de l'îlot (`reveal`) avant de cliquer : un premier passage de la suite complète avait cliqué trop tôt sous charge.

## Comparaison avec l'écran 08 (2026-10-17)

Captures à 390 px (2x, WebKit) et 1 440 px (Chromium) : `Elements/verification/006-*.png` (dossier ignoré par Git).

| Écart | Décision |
|---|---|
| Location de véhicules : trois cartes chiffrées avec sélecteurs véhicules × jours, au lieu d'une ligne « Sur devis » | voulu : prix reçus après l'écran (spec, contexte), réglage avant ajout (US1) |
| Services : ligne compacte, vignette carrée, pastille « Sur devis », bouton « Ajouter » au lieu du chevron | voulu : ajout au séjour (FR-007) ; le chevron de l'écran menait à une fiche qui n'existe pas |
| Flèches natives dans les champs des sélecteurs (Safari et Firefox sur ordinateur, toutes les pages depuis la 004) | corrigé : masquées dans `src/styles/global.css` |
| En-tête, mention Breezy Groupe, encadré sur mesure | conformes |
