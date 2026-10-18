# Implementation Plan: Retours de Franck

**Branch**: `010-retours-franck` | **Date**: 2026-10-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-retours-franck/spec.md`

## Summary

Traiter les retours de Franck des 11 et 12 octobre en s'appuyant sur l'existant. Contenu : plats en « plats » (dimension `units` existante), descriptions et Ebanjea, pique-nique renommé avec redirection, durées et précisions des parcours, carte appartement. Logique pure étendue et testée : ligne qui part des voyageurs, dates d'arrivée et de départ, message de personnalisation d'un parcours. Pages : une fiche par parcours. Interface : diaporama du hero avec pause, aperçu Mobilité à l'échelle des hébergements, calendrier natif, cadrage des photos, photo en grand dans un `<dialog>`. Décisions : [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18, Preact 10, nanostores, Tailwind CSS v4, Zod. Aucune dépendance ajoutée.

**Storage**: contenu JSON ; séjour en `localStorage` (`Stay` gagne `arrival`, `departure`)

**Testing**: Vitest (schéma, `defaultLine`, dates, `formatStayDates`, `buildTourRequestMessage` : 100 %), Testing Library (`TourActions`, champs de dates, libellé des personnes), Playwright (fiches de parcours, plats, redirection, accueil, calendrier, photo en grand, réduire les animations), Lighthouse CI

**Target Platform**: navigateurs modernes ; tout reste lisible sans JavaScript

**Project Type**: site statique multi-pages avec îlots

**Performance Goals**: Lighthouse ≥ 90 sur l'accueil, une fiche de parcours, Mon séjour ; LCP de l'accueil inchangé (même image prioritaire) ; ≤ 50 kB de JavaScript par page

**Constraints**: règles de la 009 (tokens, réduire les animations, rien de masqué sans JavaScript) ; contenu qui défile seul : pause visible (WCAG 2.2.2) ; aucune règle métier dans un composant

**Scale/Scope**: 11 plats, 1 prestation renommée, 6 fiches × 2 langues, 2 aperçus d'accueil, 1 îlot nouveau, 2 scripts de page

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance ; calendrier et `<dialog>` natifs ; mécanismes existants réutilisés (unités, fiches, aperçus) | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md) ; attentes de Franck isolées dans le questionnaire 7 | ✅ |
| III. Business logic is pure and tested | Ligne par défaut, dates et messages dans des fonctions pures couvertes à 100 % ; les îlots transmettent | ✅ |
| IV. Content is data, not code | Descriptions, durées, étapes, cadrages, cartes d'accueil dans `src/content/` ; chaînes dans les dictionnaires | ✅ |
| V. Mobile-first, accessible, fast | Diaporama avec pause et arrêt sous réduire les animations ; `<dialog>` accessible ; premier écran inchangé | ✅ |
| VI. Design through tokens | Durées de la 009, aucune valeur brute | ✅ |
| VII. DevOps isolated from production | Redirections dans `public/_redirects`, aucun changement d'infrastructure | ✅ |

TKS® reste secondaire (constitution, préambule) : l'aperçu Mobilité grandit mais reste après les sections Kibreeze. Revérification après la phase 1 : aucun écart.

## Project Structure

### Documentation (this feature)

```text
specs/010-retours-franck/
├── spec.md
├── plan.md
├── research.md          # 11 décisions
├── data-model.md        # plats, pique-nique, séjour, parcours, accueil
├── quickstart.md
├── contracts/
│   ├── ui.md            # fiche de parcours, accueil, Mon séjour, photo en grand, cadrage
│   └── content.md       # schéma, fonctions pures, chaînes, redirections
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── schemas.ts                         # image.focus, image.upcoming
│   ├── services/                          # 10 plats, ebanjea.json (nouveau), pique-nique renommé, 6 parcours
│   └── site/home.json                     # carte appartement
├── features/
│   ├── selection/selection.ts             # defaultLine(service, travelers), dates du séjour
│   ├── selection/{QuickAdd,LineCustomizer,ExperienceConfigurator,StayPage}.tsx
│   ├── selection/TourActions.tsx          # nouveau
│   └── whatsapp/{formatStayDates,buildTourRequestMessage}.ts   # nouveaux ; buildSelectionMessage (dates)
├── components/
│   ├── packages/{TourDetail.astro (nouveau), TourCard.astro}
│   ├── home/{Hero.astro, MobilityTeaser.astro (remplace MobilityStrip), AccommodationTeaser.astro}
│   └── experiences/{Gallery,ExperienceCard,CompactCard,IllustrativeTag}.astro, home/FeaturedCarousel.astro
├── pages/formules/[id].astro, en/packages/[id].astro          # nouveaux
├── scripts/{hero-slideshow,lightbox}.ts                     # nouveaux
├── lib/pageCatalog.ts                     # adresse des parcours
├── i18n/{fr,en}.ts
└── assets/photos/                         # côte pour « Photo à venir », hero 2 à 4, appartement

public/_redirects                          # pique-nique
lighthouserc.json                          # une fiche de parcours
```

**Structure Decision**: aucun dossier nouveau hors `pages/formules/` et `pages/en/packages/`.

## Découpage par user story

| Story | Livrable |
|---|---|
| US1 — catalogue juste (P1) | plats en unités, descriptions, Ebanjea, `upcoming`, pique-nique renommé et redirigé, `defaultLine` avec voyageurs, libellé des personnes |
| US2 — parcours (P1) | fiches, `TourDetail`, `TourActions`, `buildTourRequestMessage`, durées et étapes, adresse des lignes |
| US3 — accueil (P2) | diaporama et pause, carte appartement, `MobilityTeaser` |
| US4 — dates (P2) | `Stay`, validation, `formatStayDates`, champs de date |
| US5 — photos (P3) | `focus`, photo en grand |

Chaque story est livrable seule.

## Complexity Tracking

Aucune violation de la constitution.
