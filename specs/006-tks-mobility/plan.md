# Implementation Plan: Mobilité TKS®

**Branch**: `006-tks-mobility` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-tks-mobility/spec.md`

## Summary

Livrer la page Mobilité TKS® et rendre ajoutables à Mon séjour trois catégories de véhicules (prix de départ par jour, véhicules × jours) et quatre services sur devis. Tout reste dans la collection `services`, section `mobilite` ([research.md](./research.md) §1) : l'unité `per_day`, les dimensions `units` et `days`, le singulier « 1 véhicule » existent déjà, et l'estimation calcule 35 000 × 1 × 4 sans changement. Le schéma gagne un seul champ (`models`) ; l'îlot `TourCustomizer` de la 005 devient `LineCustomizer`, générique, pour régler véhicules et jours avant l'ajout ; le script d'import floute les plaques. La route `mobility` est la dernière à être livrée.

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18, Preact 10, nanostores, Tailwind CSS v4, Zod, sharp (import des photos). Aucune dépendance ajoutée.

**Storage**: fichiers JSON de `src/content/services/` ; sélection en `localStorage` (004, inchangée)

**Testing**: Vitest (schéma `models`, cas de référence de l'estimation et du message, 100 %), Testing Library (`LineCustomizer`), Playwright (page, ajouts, Mon séjour, message, navigation, sans JavaScript), Lighthouse CI, `check-links`, `check-bundle-size`

**Target Platform**: navigateurs modernes ; page lisible sans JavaScript

**Project Type**: site statique multi-pages avec îlots

**Performance Goals**: Lighthouse ≥ 90 sur `/mobilite` (SC-004) ; ≤ 50 Ko de JavaScript compressé par page

**Constraints**: section secondaire et sobre (FR-002) : petites photos, aucune photo plein écran ; aucune plaque lisible ; aucune règle métier dans un composant ; barre à onglets du téléphone inchangée ; prix de départ présentés comme estimatifs

**Scale/Scope**: 7 prestations nouvelles (3 + 4), 1 page × 2 langues, 1 îlot généralisé, 5 photos

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance ; collection, sélection, estimation, `QuickAdd` réutilisés ; un îlot généralisé au lieu d'un second presque identique | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md) (FR-MOB-*), hypothèses M1 à M5 marquées, aucun marqueur ouvert | ✅ |
| III. Business logic is pure and tested | Aucune règle nouvelle : le calcul véhicules × jours est celui de la 004, vérifié par les cas de référence ; schéma `models` couvert | ✅ |
| IV. Content is data, not code | Catégories, modèles, prix, services, zones de flou dans `src/content/` et `sources.json` ; chaînes FR et EN dans les dictionnaires | ✅ |
| V. Mobile-first, accessible, fast | Une colonne à 360 px ; contenu lisible sans JavaScript, l'ajout se repliant sur WhatsApp | ✅ |
| VI. Design through tokens | Écran 08 relevé dans `docs/design-exports/`, valeurs par les tokens | ✅ |
| VII. DevOps isolated from production | Aucun changement d'infrastructure | ✅ |

Revérification après la phase 1 : aucun écart.

## Project Structure

### Documentation (this feature)

```text
specs/006-tks-mobility/
├── spec.md
├── plan.md
├── research.md          # 11 décisions
├── data-model.md        # 3 catégories, 4 services, cas de référence, photos
├── quickstart.md
├── contracts/
│   ├── content.md       # schéma models, catalogue, import des photos, chaînes
│   └── ui.md            # page Mobilité, LineCustomizer, navigation
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── schemas.ts                       # champ models (section mobilite)
│   └── services/                        # 3 catégories de véhicules, 4 services sur devis
├── lib/
│   ├── catalog.ts                       # getMobility
│   └── pageCatalog.ts                   # section mobilite, adresse /mobilite#id
├── features/selection/
│   └── LineCustomizer.tsx               # remplace TourCustomizer.tsx
├── components/
│   ├── mobility/MobilityPage.astro      # nouveau
│   └── packages/TourCard.astro          # LineCustomizer
├── pages/mobilite.astro, en/mobility.astro
├── i18n/{fr,en}.ts, routes.ts           # chaînes mobility.* ; IMPLEMENTED_ROUTES
└── assets/photos/mobility/              # 5 photos, plaques floutées

scripts/import-photos.ts                # entrées { source, blur }
src/assets/photos/sources.json           # 5 entrées
lighthouserc.json                        # + /mobilite
```

**Structure Decision**: un dossier de composants nouveau, `mobility/`, sur le modèle de `accommodation/`.

## Découpage par user story

| Story | Livrable |
|---|---|
| US1 — louer un véhicule (P1) | champ `models`, import avec flou, 5 photos, 3 catégories, `getMobility`, catalogue des îlots, `LineCustomizer`, page (en-tête, section véhicules, encadré final), route livrée |
| US2 — transfert ou chauffeur (P2) | 4 services sur devis, section « Transport sur devis » avec `QuickAdd` |
| US3 — accès (P3) | vérification de la navigation ordinateur, du bandeau de l'accueil, du plan du site et de la barre à onglets ; tests qui prenaient `mobility` comme page non livrée |

US1 livre la route : le bandeau et la navigation mènent à la page dès US1 ; US3 en vérifie les accès et met à jour les tests.

## Complexity Tracking

Aucune violation de la constitution.
