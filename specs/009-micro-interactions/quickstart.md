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

## Résultats (2026-10-18)

| Contrôle | Résultat |
|---|---|
| `npm run check` | lint, format, types, contenu ; 58 tests de composants et d'îlots, 216 tests unitaires, couverture 100 % (logique du tuto et `$notice` compris) |
| `npm run build:prod` | 92 pages, traductions complètes |
| `npm run check:links` | 3 824 liens internes, aucun cassé |
| `npm run check:bundle` | page la plus lourde 32,9 kB compressés (budget 50 kB) ; accueil 27,3 kB |
| `npm run test:e2e` | 505 tests passés, 9 limités à Chromium par construction (propriétés de transition, presse-papiers) |
| `npm run lighthouse` | toutes les adresses ≥ 90 dans les quatre catégories, CLS ≤ 0,019 (assertion ajoutée : ≤ 0,1) |

### Avant / après (Lighthouse simulé, médiane de 3 mesures)

| Page | `main` sans la 009 | 009, premier jet | 009 final |
|---|---|---|---|
| Accueil | LCP 3,01 s, perf 94–95 | 3,15 s, 93–95 | **3,00 s, 94** |
| Fiche pirogue | LCP 2,78 s, CLS 0,000 | 3,08 s, CLS 0,019 | **2,70 s, CLS 0,001** |
| Village Mayi | LCP 3,38 s, perf 92 | 3,61 s, 88–93 | **3,53 s, 90–91** |

Le premier jet chargeait le tuto et le bouton Partager dès l'ouverture (`client:only`) et insérait le bouton sous le titre après coup. Corrigé : îlots en `client:idle` (ils ne rendent rien côté serveur, donc toujours aucun HTML sans JavaScript) et place réservée sous le titre.

### SC-004 : fiche ouverte depuis un univers, 4G lente simulée (150 ms, 1,6 Mbit/s)

Premier affichage de la fiche, mesuré par le navigateur, depuis le clic (5 essais) : **373 ms** avec préchargement, **362 ms** sans. Objectif (< 1 s) tenu dans les deux cas.

Le préchargement a bien lieu (liens visibles, `link rel="prefetch"`), mais n'apporte rien de mesurable ici : le serveur fait revérifier le HTML (réponse de 300 octets au clic, soit un aller-retour), et une fiche s'affiche dès ses premiers octets. À re-mesurer sur l'aperçu Cloudflare, dont les en-têtes de cache font foi.

Note de mesure : une attente pilotée par Playwright (clic, puis titre visible) donnait 1,25 s ; l'écart vient de la mécanique d'attente de l'outil, pas du site.
