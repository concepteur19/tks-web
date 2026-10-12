# Implementation Plan: Hébergements, formules et parcours

**Branch**: `005-accommodation-and-packages` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-accommodation-and-packages/spec.md`

## Summary

Livrer les pages Hébergements et Formules, et rendre ajoutables à Mon séjour six paliers d'hébergement, six parcours et quatre formules. Tout reste dans la collection `services`, distingué par la section ([research.md](./research.md) §1) : la sélection, l'estimation et le message WhatsApp de la 004 les prennent en charge sans modification de leurs fonctions pures. Le schéma gagne une section (`parcours`), une unité (`per_couple`) et trois champs propres à chaque section (`accommodationType`, `steps`, `serviceIds`) ; le contrôle de contenu vérifie que formules et parcours ne citent que des prestations publiées. Un seul îlot nouveau, `TourCustomizer`, assemblé à partir du sélecteur de la 004.

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18, Preact 10, nanostores, Tailwind CSS v4, Zod. Aucune dépendance ajoutée.

**Storage**: fichiers JSON de `src/content/services/` ; sélection en `localStorage` (004, inchangée)

**Testing**: Vitest (schéma, `catalogIssues` : 100 %), Testing Library (îlot `TourCustomizer`, composants), Playwright (pages, ajouts, Mon séjour, message, navigation), Lighthouse CI, `check-links`, `check-bundle-size`

**Target Platform**: navigateurs modernes ; pages lisibles sans JavaScript

**Project Type**: site statique multi-pages avec îlots

**Performance Goals**: Lighthouse ≥ 90 sur `/hebergements` et `/formules` (SC-005) ; ≤ 50 Ko de JavaScript compressé par page

**Constraints**: aucun montant haut de gamme avant les paliers standards ; aucune règle métier dans un composant ; aucune photo filigranée ; base de 2 personnes toujours affichée avec le prix d'une formule

**Scale/Scope**: 16 prestations nouvelles (6 + 6 + 4), 2 pages × 2 langues, 1 îlot nouveau

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance ; collection, sélection, `QuickAdd`, sélecteur et étiquette de la 008 réutilisés ; pas de collection parallèle | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md) (FR-HEB-*, FR-PACK-*), sans marqueur ouvert | ✅ |
| III. Business logic is pure and tested | Aucune règle nouvelle dans la sélection ou l'estimation ; `catalogIssues` étendu et couvert à 100 % | ✅ |
| IV. Content is data, not code | Paliers, parcours, formules, étapes et références dans `src/content/` ; chaînes FR et EN dans les dictionnaires | ✅ |
| V. Mobile-first, accessible, fast | Une colonne à 360 px ; contenu lisible sans JavaScript, l'ajout se repliant sur WhatsApp | ✅ |
| VI. Design through tokens | Écrans 06a, 06b, 07 relevés dans `docs/design-exports/`, valeurs par les tokens | ✅ |
| VII. DevOps isolated from production | Aucun changement d'infrastructure | ✅ |

Revérification après la phase 1 : aucun écart.

## Project Structure

### Documentation (this feature)

```text
specs/005-accommodation-and-packages/
├── spec.md
├── plan.md
├── research.md          # 11 décisions
├── data-model.md        # 6 paliers, 6 parcours, 4 formules, cas de référence
├── quickstart.md
├── contracts/
│   ├── content.md       # schéma, contrôles, catalogue des îlots, chaînes
│   └── ui.md            # pages Hébergements et Formules, TourCustomizer, page Tourisme
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── schemas.ts                       # section parcours, per_couple, accommodationType, steps, serviceIds, badge ; catalogIssues
│   └── services/                        # 6 hebergement, 6 parcours, 4 formule
├── lib/
│   ├── catalog.ts                       # getAccommodation, getTours, getPackages
│   └── pageCatalog.ts                   # trois sections de plus, adresses par section
├── features/selection/
│   ├── QuickAdd.tsx                     # prop wide
│   └── TourCustomizer.tsx               # nouveau
├── components/
│   ├── accommodation/AccommodationPage.astro   # nouveau
│   ├── packages/{PackagesPage,TourCard,PackageCard}.astro   # nouveaux
│   └── experiences/ExperiencesPage.astro       # carte « Parcours Kibreeze »
├── pages/{hebergements,formules}.astro, en/{accommodation,packages}.astro
├── i18n/{fr,en}.ts, routes.ts           # chaînes ; IMPLEMENTED_ROUTES
└── assets/photos/accommodation/appartement.jpg

scripts/check-content.ts                 # références de parcours et formules
lighthouserc.json                        # + /hebergements, /formules
```

**Structure Decision**: deux dossiers de composants nouveaux, `accommodation/` et `packages/`, sur le modèle de `experiences/`.

## Découpage par user story

| Story | Livrable |
|---|---|
| US1 — logement (P1) | schéma (`accommodationType`), 6 paliers, catalogue des îlots, page Hébergements, route livrée, `QuickAdd` |
| US2 — parcours (P2) | section `parcours`, `steps`, contrôle des références, 6 parcours, `TourCustomizer`, section de la page Formules, carte de la page Tourisme |
| US3 — formules (P3) | unité `per_couple`, `serviceIds`, 4 formules, section de la page Formules, `QuickAdd wide` |

US1 est livrable seule : la page Formules reste alors non livrée et son onglet ouvre WhatsApp, comme aujourd'hui.

## Complexity Tracking

Aucune violation de la constitution.
