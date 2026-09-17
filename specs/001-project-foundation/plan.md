# Implementation Plan: Fondation du projet

**Branch**: `001-project-foundation` | **Date**: 2026-09-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-project-foundation/spec.md`

## Summary

Poser le socle du site TKS : un squelette bilingue français et anglais publié automatiquement, des garde-fous de qualité qui bloquent la publication en cas d'anomalie, un format de contenu validé au build, un jeu de tokens de style centralisé, et une image conteneurisée pour le développement. Aucune fonctionnalité visible pour le visiteur final.

Les choix structurants viennent de [technical-decisions.md](../../docs/technical-decisions.md), ADR-001 à ADR-013. Ce plan les met en œuvre, il ne les rouvre pas.

## Technical Context

**Language/Version**: TypeScript 5.x en mode strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5 (sortie statique), React 19 via `@astrojs/react`, Tailwind CSS v4 via `@tailwindcss/vite`, Zod, `@astrojs/sitemap`

**Storage**: Aucune base de données. Le catalogue vit dans des fichiers de contenu versionnés, validés au build

**Testing**: Vitest et Testing Library pour les unités et les composants, Playwright et axe pour les parcours, Lighthouse CI pour les budgets

**Target Platform**: Navigateurs modernes, mobile d'abord à partir de 360 px. Hébergement statique Cloudflare Pages, image nginx en complément

**Project Type**: Site statique multi-pages avec quelques îlots interactifs

**Performance Goals**: LCP sous 2,5 s sur mobile émulé, quatre scores Lighthouse au moins égaux à 90, JavaScript d'une page de contenu sous 50 kB compressés

**Constraints**: Aucun backend, aucun secret applicatif, tout texte visible existe en français et en anglais, aucune valeur de style brute dans les composants

**Scale/Scope**: Environ 7 routes par langue au terme du projet. Cette feature en livre 3 par langue : accueil, 404, et une page de démonstration interne des tokens

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance hors de celles déjà décidées. Le contrôle des traductions est un script maison de quelques dizaines de lignes plutôt qu'une librairie d'i18n | ✅ |
| II. Specification-first | Ce plan découle de [spec.md](./spec.md), qui référence les exigences `FR-I18N-*` et `TR-*` des documents du projet | ✅ |
| III. Business logic is pure and tested | Cette feature contient peu de logique métier. Ce qu'elle livre, la traduction, la table de routes et le contrôle des traductions, est écrit en fonctions pures et testé | ✅ |
| IV. Content is data, not code | Schémas de contenu et dictionnaires livrés ici, aucun texte en dur dans les composants, contrôle au build | ✅ |
| V. Mobile-first, accessible, fast | Budgets Lighthouse et tests axe branchés dans la chaîne d'intégration dès cette feature | ✅ |
| VI. Design comes from Figma, through tokens | Les tokens sont livrés avec des valeurs provisoires marquées, prêtes à recevoir la direction C | ✅ |
| VII. DevOps for learning, isolated from production | Docker est livré pour le développement et la chaîne d'intégration. Kubernetes reste hors périmètre, en feature 007 | ✅ |

Aucune violation à justifier. La section Complexity Tracking reste vide.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-foundation/
├── spec.md              # quoi et pourquoi
├── plan.md              # ce fichier
├── research.md          # décisions de mise en œuvre, phase 0
├── data-model.md        # entités livrées par cette feature, phase 1
├── quickstart.md        # comment lancer et vérifier, phase 1
├── contracts/           # contrats publics du socle, phase 1
│   ├── routes.md
│   ├── content-schema.md
│   └── env.md
├── checklists/
│   └── requirements.md
└── tasks.md             # produit par /speckit-tasks, pas par ce plan
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── index.astro                 # accueil FR
│   ├── 404.astro                   # erreur FR
│   └── en/
│       ├── index.astro             # accueil EN
│       └── 404.astro               # erreur EN
├── layouts/
│   └── BaseLayout.astro            # head SEO, langue, alternates, nav, footer
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   ├── LanguageSwitcher.astro
│   └── WhatsAppButton.astro
├── i18n/
│   ├── fr.ts                       # dictionnaire de référence
│   ├── en.ts                       # satisfies Dictionary
│   ├── routes.ts                   # table des routes FR / EN
│   ├── t.ts                        # t(), pluriels, localize()
│   └── types.ts
├── content/
│   ├── config.ts                   # schémas Zod des collections
│   ├── categories/                 # une catégorie d'exemple
│   └── services/                   # une fiche d'exemple, marquée provisoire
├── lib/
│   ├── env.ts                      # variables validées au build
│   └── seo.ts                      # titres, descriptions, alternates, JSON-LD
├── styles/
│   ├── tokens.css                  # @theme, valeurs provisoires
│   └── global.css
└── types/

scripts/
└── check-i18n.ts                   # avertit en dev, échoue en production

tests/
├── unit/                           # t(), routes, localize, schémas, env
├── component/                      # LanguageSwitcher, Nav
└── e2e/                            # squelette bilingue, 404, clavier, axe

docker/                             # Dockerfile, nginx.conf, compose.yml  (US4)
.github/workflows/ci.yml
astro.config.mjs
```

**Structure Decision**: structure d'un projet unique, conforme à [architecture.md](../../docs/architecture.md). Les dossiers `features/`, prévus pour la sélection, l'estimation et WhatsApp, ne sont pas créés ici : ils appartiennent aux features 004 à 006.

## Découpage par user story

| Story | Livrable | Dépend de Docker | Dépend de GitHub ou Cloudflare |
|---|---|---|---|
| US1 — squelette bilingue en ligne | Projet Astro, i18n, layout, accueil et 404 dans les deux langues, sélecteur de langue, SEO de base | Non | Publication oui, développement non |
| US2 — garde-fous | ESLint, Prettier, pré-commit, Vitest, Playwright, axe, Lighthouse CI, workflow d'intégration | Non | Oui pour l'exécution distante |
| US3 — socle de contenu et de style | Schémas Zod localisés, fiche d'exemple, tokens, validation des variables d'environnement, contrôle des traductions | Non | Non |
| US4 — environnement conteneurisé | Dockerfile multi-étapes, configuration nginx, compose de développement, contrôle de santé | Oui | Non |

US1, US2 et US3 sont réalisables immédiatement. US4 attend l'installation de Docker Desktop.

## Complexity Tracking

Aucune violation de la constitution, cette section reste vide.
