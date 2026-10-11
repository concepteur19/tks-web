# Quickstart — 008 Les trois univers du Tourisme

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # minimumParticipants et catalogIssues à 100 % ; schémas ; composants
npm run build:prod     # 32 fiches + 1 page d'entrée + 3 univers, × 2 langues ; traductions complètes
npm run check:links    # aucun lien cassé, y compris fil d'Ariane et navigation entre univers
npm run check:bundle   # page d'entrée sans îlot d'ajout ; univers ≤ 50 Ko
npm run test:e2e       # page d'entrée, univers, fiches, minimum, séjour multi-univers
npm run lighthouse     # page d'entrée, un univers, une nouvelle fiche ≥ 90 (SC-006)
```

`lighthouserc.json` reçoit `/experiences/visites.html` et `/experiences/village-mayi.html`.

## Scénarios à dérouler à la main

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Onglet Expériences | « Découvrez Kribi selon vos envies », 3 cartes d'univers, aucune carte d'expérience | US1-1, FR-002 |
| 2 | Lire une carte d'univers | photo, nom, phrase, 3 exemples, nombre, « Voir le catalogue » | US1-2, FR-003 |
| 3 | Toucher « Activités & Loisirs » | 13 activités, rien d'autre | US1-3, FR-004 |
| 4 | Depuis Activités, toucher « Spécialités culinaires » dans la navigation | 10 spécialités, toutes « Sur demande » | US1-4, US2-3 |
| 5 | Copier l'adresse d'un univers, l'ouvrir dans un autre onglet, changer de langue | même univers ; en anglais, adresse traduite | US1-5 |
| 6 | Accueil, cartes d'univers | 3 univers, chacune mène à sa page | US1-6, FR-009 |
| 7 | Ancien lien `/experiences#aventure` | page d'entrée | FR-007 |
| 8 | Fiche Village Mayi | prix 5 000 FCFA / personne, mention dégressive, « Ce qui est inclus » cite ponts, phare et monument | US2-2, FR-014, FR-018 |
| 9 | Fiche Village Bagyeli | « À partir de 15 000 FCFA », « Minimum 2 personnes », dégressif ; le sélecteur ne descend pas sous 2 | US3 |
| 10 | Fiche jet-ski | 10 000 FCFA la session | US2-4 |
| 11 | Fiche langouste | aucun montant, aucune option | FR-013, FR-016 |
| 12 | Ajouter Mayi, quad et langouste, ouvrir Mon séjour, envoyer | 3 lignes ; total sans la langouste, comptée « sur devis » ; message qui nomme les trois | US2-5, US2-6 |
| 13 | Ancienne fiche `/experiences/croisiere-en-bateau` | page d'erreur | Edge cases |
| 14 | Sans JavaScript | page d'entrée, univers et fiches lisibles, univers atteignables par lien | Edge cases |

## Résultats relevés

À compléter en fin d'implémentation.
