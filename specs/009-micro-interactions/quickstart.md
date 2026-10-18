# Quickstart — 009 Micro-interactions et mini tuto

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # logique du tuto à 100 %, îlots (tuto, Partager, Ajouté ✓)
npm run build:prod
npm run check:links
npm run check:bundle   # tuto, Partager, préchargement, apparition : ≤ 50 kB par page
npm run test:e2e       # tuto, réduire les animations, sans JavaScript, noms de transition uniques
npm run lighthouse     # accueil, une fiche, Mon séjour ≥ 90 ; CLS ≤ 0,1 (SC-003)
```

## Scénarios à dérouler à la main

Sur un vrai téléphone (iPhone et Android si possible) puis sur ordinateur, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Premier passage (données du site effacées) | bulle au-dessus des onglets en moins de 2 s, page utilisable | US1-1 |
| 2 | Suivant, Suivant, C'est parti | 3 étapes, chacune signale sa cible ; bulle fermée | US1-2 |
| 3 | Recharger, changer de page | la bulle ne revient pas | US1-4 |
| 4 | Effacer les données, ajouter une prestation pendant l'étape 1 | passe à l'étape 3 ; la notification n'est pas recouverte | US1-5 |
| 5 | Accueil | « Comment ça marche » après les univers | US1-6 |
| 6 | Accueil → univers → fiche | fondu ; photo de la carte qui glisse dans la fiche (Chrome, Safari) | US2-1 |
| 7 | Défiler une page longue | sections et cartes qui apparaissent une fois, en cascade | US2-2 |
| 8 | Ordinateur : survoler cartes, boutons, liens | soulèvement, zoom léger, soulignement ; rien de collé sur téléphone | US2-4 |
| 9 | Ajouter une prestation | « Ajouté ✓ », compteur qui rebondit, notification depuis le bas, vibration (Android) | US2-6 |
| 10 | + / − dans un sélecteur | le chiffre défile | US2-7 |
| 11 | Retirer une ligne de Mon séjour | repli doux, total à jour | US2-8 |
| 12 | Changer d'onglet | le trait glisse | US2-9 |
| 13 | Réglage « réduire les animations » du téléphone | plus aucun mouvement | US2-11 |
| 14 | Ouvrir une fiche depuis un univers en 4G | affichage presque instantané | US3-1 |
| 15 | Partager depuis un téléphone, puis depuis un ordinateur | menu de partage ; « Lien copié » | US3-3, US3-4 |
| 16 | JavaScript désactivé | tout visible, ni bulle ni Partager | FR-018 |
