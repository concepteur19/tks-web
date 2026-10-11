# Implementation Plan: Les trois univers du Tourisme

**Branch**: `008-tourism-universes` | **Date**: 2026-10-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-tourism-universes/spec.md`

## Summary

Remplacer la liste unique des expériences, filtrée par trois catégories, par trois univers : une page d'entrée « Découvrez Kribi selon vos envies » à `/experiences`, une page par univers, et un catalogue porté de 13 à 32 prestations d'après le cahier actualisé de Franck.

La feature est surtout du contenu et de la mise en page. Les univers prennent la place des catégories dans la même collection ([research.md](./research.md) §1). Les pages d'univers partagent la route dynamique des fiches, dont les adresses ne bougent pas (§2). Le minimum de participants existe déjà dans le modèle de quantité (§6). La sélection, l'estimation et le message de la 004 n'ont besoin d'aucune modification (§9). Une seule fonction pure nouvelle (`minimumParticipants`), un contrôle de contenu élargi, deux champs de schéma (`slug` et `withOptions` sur l'univers, `degressive` sur la prestation).

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18, Preact 10, Tailwind CSS v4, Zod. Aucune dépendance ajoutée.

**Storage**: fichiers de contenu JSON (`src/content/categories/`, `src/content/services/`) ; sélection en `localStorage` (004, inchangée)

**Testing**: Vitest (`minimumParticipants`, `catalogIssues`, schémas : 100 %), Vitest + Testing Library (composants Astro), Playwright (page d'entrée, univers, fiches, séjour multi-univers, sans JavaScript), Lighthouse CI, `check-links`, `check-bundle-size`

**Target Platform**: navigateurs modernes ; pages lisibles sans JavaScript

**Project Type**: site statique multi-pages avec îlots

**Performance Goals**: Lighthouse ≥ 90 sur la page d'entrée, un univers et une nouvelle fiche (SC-006) ; ≤ 50 Ko de JavaScript compressé par page

**Constraints**: aucune règle métier dans un composant ; aucun texte en dur ; adresses des fiches inchangées ; aucune photo filigranée ; aucune durée, lieu ou « inclus » inventé

**Scale/Scope**: 3 univers, 32 prestations publiées (21 nouvelles), 2 désactivées ; 4 pages nouvelles par langue (entrée refondue + 3 univers) ; ~44 fiches nouvelles (21 × 2 langues)

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance ; collection, route et modèle de quantité réutilisés ; pas de renommage sans valeur ; `withOptions` au niveau de l'univers plutôt qu'une règle par prestation tant que Q5 est ouverte | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md) (FR-CAT-*) ; hypothèses du questionnaire 4 marquées `[HYPOTHÈSE …]` | ✅ |
| III. Business logic is pure and tested | `minimumParticipants` et `catalogIssues` purs, couverts à 100 % ; sélection, estimation, message inchangés | ✅ |
| IV. Content is data, not code | Univers, prestations, options par univers, dégressivité : tout dans `src/content/` ; chaînes dans les dictionnaires FR et EN | ✅ |
| V. Mobile-first, accessible, fast | Une colonne à 360 px ; navigation entre univers en liens, `aria-current` ; aucun îlot nouveau ; bandeaux recadrés au build | ✅ |
| VI. Design through tokens | Cartes et pastilles réutilisent les composants et tokens existants (`accent-soft`, onglet actif de la 003) | ✅ |
| VII. DevOps isolated from production | Aucun changement d'infrastructure | ✅ |

Revérification après la phase 1 : contrats sans backend ni état serveur ; aucune règle ajoutée hors `src/features/` ; aucun écart.

## Project Structure

### Documentation (this feature)

```text
specs/008-tourism-universes/
├── spec.md
├── plan.md
├── research.md          # 14 décisions
├── data-model.md        # univers, catalogue complet des 32 prestations, cas de référence
├── quickstart.md
├── contracts/
│   ├── routes.md        # page d'entrée, univers, adresses héritées
│   ├── content.md       # schémas, contrôles, fonctions d'accès
│   └── ui.md            # page d'entrée, univers, fiche, accueil, chaînes
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── schemas.ts                    # univers : slug, withOptions ; prestation : degressive ; catalogIssues élargi
│   ├── categories/                   # visites, activites, specialites-culinaires (remplacent les 3 catégories)
│   └── services/                     # 21 nouvelles prestations, 11 déplacées, 2 désactivées
├── features/catalog/
│   └── minimumParticipants.ts        # pur
├── lib/catalog.ts                    # getUniverseExperiences, getOptionsFor
├── components/
│   ├── experiences/
│   │   ├── ExperiencesPage.astro     # devient la page d'entrée
│   │   ├── UniverseCard.astro        # nouveau
│   │   ├── UniversePage.astro        # nouveau
│   │   ├── UniverseNav.astro         # nouveau
│   │   ├── CategoryTabs.astro        # supprimé
│   │   ├── ExperienceCard.astro      # pastille minimum
│   │   ├── PriceBlock.astro          # minimum, dégressif
│   │   └── ExperienceDetail.astro    # fil d'Ariane, badge, options par univers
│   └── home/CategoryCards.astro      # univers, lien vers leur page
├── pages/experiences/[slug].astro    # fiches + univers
├── pages/en/experiences/[slug].astro # idem
├── i18n/{fr,en}.ts                   # chaînes ajoutées et retirées
└── assets/photos/                    # étal de poissons (L14-02) importé

scripts/check-content.ts              # appelle catalogIssues élargi
lighthouserc.json                     # + un univers, + une nouvelle fiche
tests/                                # unitaires, composants, e2e mis à jour (catégories → univers, tarifs Bagyeli)
```

**Structure Decision**: tout s'insère dans l'arborescence existante. `src/features/catalog/` accueille déjà `relatedExperiences.ts` ; `minimumParticipants.ts` le rejoint.

## Découpage par user story

| Story | Livrable |
|---|---|
| US1 — choisir son univers (P1) | schéma d'univers, 3 univers, 13 prestations existantes rattachées, contrôles, page d'entrée, pages d'univers, navigation entre univers, fil d'Ariane et badge des fiches, cartes de l'accueil |
| US2 — nouvelles prestations (P2) | 21 prestations, jet-ski tarifé, feu de plage plafonné, 2 désactivées, mise en avant du jet-ski, options par univers, photos de remplacement, textes FR et EN |
| US3 — prix de groupe (P3) | `minimumParticipants`, `degressive`, Village Bagyeli « à partir de, minimum 2 », mentions sur carte et fiche |

US1 est livrable seule avec les 13 prestations actuelles réparties en deux univers (le culinaire, vide, n'a ni page ni carte, comme le prévoit la spec).

## Complexity Tracking

Aucune violation de la constitution.
