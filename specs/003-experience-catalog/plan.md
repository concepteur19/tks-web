# Implementation Plan: Catalogue des expériences

**Branch**: `003-experience-catalog` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-experience-catalog/spec.md`

## Summary

Publier les 13 expériences et les 3 options du guide tarifaire, une page Expériences filtrable par catégorie et une fiche par expérience, avec une demande WhatsApp ciblée. Tout est statique : le filtre repose sur des ancres et les sélecteurs CSS `:target` et `:has()`, et un script de moins de 1 Ko ne fait qu'ajouter l'état actif et l'annonce aux technologies d'assistance.

La feature exerce le contrat de coque de 002 : ajouter `experiences` à `IMPLEMENTED_ROUTES` fait apparaître l'onglet, les liens du hero et des cartes, les nombres par catégorie et les entrées du plan du site, sans autre modification de la coque.

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18 (`getStaticPaths`, `astro:assets`, collections), Tailwind CSS v4, Zod. Aucune nouvelle dépendance

**Storage**: 16 fichiers JSON dans `src/content/services/`, 3 catégories ; aucun stockage navigateur

**Testing**: Vitest (schéma étendu, `buildServiceRequestMessage`, `buildExperienceJsonLd`, `relatedExperiences`), Vitest + axe (carte, onglets, galerie), Playwright (liste, filtre avec et sans JavaScript, fiches, demande), Lighthouse CI, `check-links`

**Target Platform**: navigateurs modernes ; `:has()` requis pour le filtre (Safari 15.4, Chrome 105, Firefox 121), repli lisible sinon

**Project Type**: site statique multi-pages

**Performance Goals**: Lighthouse ≥ 90 sur `/experiences` et une fiche ; JavaScript < 1 Ko sur `/experiences`, 0 sur les fiches

**Constraints**: aucun bouton sans effet (pas d'ajout au séjour avant 004), aucune valeur de contenu inventée, aucune photo filigranée

**Scale/Scope**: 2 + 26 pages (liste et 13 fiches, × 2 langues), environ 12 photos supplémentaires

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Pas de nouvelle collection ni dépendance ; filtre en CSS plutôt qu'en îlot | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md), qui référence FR-CAT-1 à 6, FR-SEO-1/3/4, FR-WA-6 | ✅ |
| III. Business logic is pure and tested | Message de demande dans `src/features/whatsapp/`, `relatedExperiences` dans `src/features/catalog/`, couverts à 100 % ; JSON-LD pur et testé | ✅ |
| IV. Content is data, not code | 16 fichiers validés, chaînes dans les dictionnaires, contrôle bilingue au build | ✅ |
| V. Mobile-first, accessible, fast | HTML complet sans JavaScript, script d'amélioration < 1 Ko, axe et Lighthouse en CI | ✅ |
| VI. Design through tokens | Nouveau token `--size-sticky-cta` ; valeurs relevées sur 02a, 02b, 03, 11 | ✅ |
| VII. DevOps isolated from production | Aucun changement d'infrastructure | ✅ |

Revérification après la phase 1 : les contrats n'ajoutent ni état client ni dépendance. Le seul JavaScript est une amélioration facultative du filtre. Aucune violation.

## Project Structure

### Documentation (this feature)

```text
specs/003-experience-catalog/
├── spec.md
├── plan.md
├── research.md          # 12 décisions
├── data-model.md        # 13 expériences, 3 options, fonctions pures
├── quickstart.md
├── contracts/
│   ├── routes.md        # liste, ancres de filtre, fiches
│   ├── content.md       # changements du schéma services
│   └── ui.md            # page Expériences et fiche
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── assets/photos/experiences/       # + quad, jet-ski, kayak, paddle, cheval, galeries ; bandeau
├── content/
│   ├── schemas.ts                    # + location ; règles isOption
│   └── services/                     # + 9 expériences, 3 options
├── features/
│   ├── catalog/relatedExperiences.ts      # « Vous aimerez aussi » (pur)
│   └── whatsapp/buildServiceRequestMessage.ts  # message de demande (pur)
├── lib/
│   ├── catalog.ts                    # + getExperiences, getOptions, getExperience
│   └── seo.ts                        # + buildExperienceJsonLd
├── components/experiences/
│   ├── ExperiencesPage.astro         # bandeau, onglets, grille, bloc « Une envie particulière ? »
│   ├── CategoryTabs.astro            # onglets + script d'amélioration en ligne
│   ├── ExperienceCard.astro          # carte de la liste
│   ├── CompactCard.astro             # carte de « Vous aimerez aussi »
│   ├── ExperienceDetail.astro        # fiche complète
│   ├── Gallery.astro
│   ├── PriceBlock.astro              # prix, tarifs, badge capacité, mention indicative
│   ├── InfoRow.astro                 # durée, capacité, lieu
│   ├── Conditions.astro              # inclus, non inclus, à savoir
│   ├── OptionsList.astro             # « Complétez votre expérience »
│   └── StickyRequest.astro           # barre fixe / carte collante
├── pages/
│   ├── experiences/index.astro, experiences/[slug].astro
│   └── en/experiences/index.astro, en/experiences/[slug].astro
├── i18n/routes.ts                    # + experiences livrée
└── styles/tokens.css                 # + --size-sticky-cta

tests/
├── unit/        # service-request-message, experience-jsonld, related-experiences, content-schema étendu
├── component/   # experience-card, category-tabs, gallery (axe)
└── e2e/         # experiences.spec.ts, experience-detail.spec.ts
```

**Structure Decision**: projet unique, conforme à [architecture.md](../../docs/architecture.md). `src/features/whatsapp/` est créé ici pour le seul message de demande ; la 004 y ajoutera `buildSelectionMessage`. `relatedExperiences` ouvre `src/features/catalog/` : c'est une règle d'ordre du catalogue, ni une estimation ni un message.

## Découpage par user story

| Story | Livrable | Bloquée par le client ? |
|---|---|---|
| US1 — liste et filtre (P1) | 16 fichiers de contenu, photos, page Expériences, onglets, cartes, effets sur l'accueil | Non ; jet-ski sur devis, quad sans durée |
| US2 — fiche (P2) | pages `[slug]`, galerie, bloc prix, infos, conditions, options, « Vous aimerez aussi » | Non ; rubriques vides omises en attendant la question 8 |
| US3 — demande WhatsApp (P3) | `buildServiceRequestMessage`, barre fixe, carte collante | Non |
| US4 — référencement (P4) | métadonnées des fiches, `buildExperienceJsonLd`, plan du site | Non |

Ordre de réalisation : US1, US2, US3, US4, dans l'ordre de priorité ; US2 et US3 partagent la fiche, US3 peut suivre immédiatement.

## Complexity Tracking

Aucune violation de la constitution, cette section reste vide.
