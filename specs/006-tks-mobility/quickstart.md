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
