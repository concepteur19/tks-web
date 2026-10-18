# Quickstart — 010 Retours de Franck

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # schéma (focus, upcoming), defaultLine, dates, messages à 100 %
npm run build:prod     # fiches de parcours × 2 langues
npm run check:links
npm run check:bundle
npm run test:e2e
npm run lighthouse     # accueil (diaporama), une fiche de parcours ≥ 90 ; LCP de l'accueil comparé à main
```

`lighthouserc.json` reçoit une fiche de parcours.

## Scénarios à dérouler à la main

Sur téléphone puis ordinateur, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Spécialités culinaires | 11 plats, descriptions de Franck, Ebanjea présent, maban sans image fausse (« Photo à venir ») | US1-1, US1-5 |
| 2 | Ajouter 2 plats de crabe | « Crabe — 2 plats » dans Mon séjour et le message | US1-2 |
| 3 | 3 voyageurs, puis ajouter les chutes | ligne à 3, « Personnes pour cette activité » | US1-3 |
| 4 | `/experiences/pique-nique-bivouac` | redirigé vers « Pique-nique en bord de mer », photo cadrée sur le pique-nique | US1-4, US5-1 |
| 5 | Formules → un parcours | fiche complète, durée, mention indicative | US2-1, US2-2 |
| 6 | Fiche : 4 personnes, ajouter | ligne pour 4, au tarif du parcours | US2-3 |
| 7 | Fiche : « Personnaliser ce parcours » | WhatsApp : parcours, 4 personnes, adresse | US2-4 |
| 8 | Accueil, puis toucher l'écran ou défiler | diaporama de 4 photos qui démarre à la première interaction, bouton Pause ; immobile sous réduire les animations | US3-1, US3-2 |
| 9 | Accueil | 4 hébergements ; 3 véhicules avec photo et prix | US3-3, US3-4 |
| 10 | Mon séjour : Arrivée, Départ | calendrier ; départ avant arrivée impossible ; message « du 12 au 16 décembre 2026 » | US4 |
| 11 | Fiche : toucher une photo | photo entière, fermeture par bouton, Échap, toucher dehors | US5-2 |

## Résultats (2026-10-18)

| Contrôle | Résultat |
|---|---|
| `npm run check` | 65 tests de composants et d'îlots, 225 tests unitaires, couverture 100 % |
| `npm run build:prod` | 106 pages (12 fiches de parcours en plus) |
| `npm run check:links` | 4 478 liens internes, aucun cassé |
| `npm run check:bundle` | page la plus lourde 33,7 kB compressés (budget 50 kB) |
| `npm run test:e2e` | 553 tests passés, 9 limités à Chromium par construction |
| `npm run lighthouse` | toutes les adresses ≥ 90 ; fiche de parcours 96 ; CLS ≤ 0,001 |

### Accueil (SC-005), Lighthouse simulé

| Version | Mesures | Performance | LCP médian |
|---|---|---|---|
| `main` | 8 | 93 à 99 | 3,08 s |
| 010, photos 2 à 4 dans la page dès le chargement | 3 | 81 à 84 | 5,03 s |
| 010, photos insérées au chargement, défilement à 6 s | 8 | 81 à 95 (1 mesure aberrante) | 3,08 s, une à 5,2 s |
| 010 final : photos insérées et défilement à la première interaction | 16 (FR et EN) | 93 à 96 | 3,08 s |

Les photos suivantes demandées en priorité haute concurrençaient la première, et une photo apparue avant toute interaction était comptée par Chrome comme nouvel élément principal. Le diaporama démarre donc à la première interaction (toucher, défilement, clavier).
