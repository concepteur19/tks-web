# Implementation Plan: Mon séjour, estimation et demande WhatsApp

**Branch**: `004-stay-and-estimate` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-stay-and-estimate/spec.md`

## Summary

Donner au visiteur une sélection persistante d'expériences, une estimation juste au franc près et un envoi WhatsApp récapitulatif. Trois fonctions pures portent toutes les règles : la sélection (`selection.ts`), l'estimation (`computeEstimate`) et le message (`buildSelectionMessage`). Un store nanostores persistant les applique, et cinq îlots les affichent : compteur, configurateur de fiche, ajout rapide, page Mon séjour et messages de confirmation.

Décision structurante ([research.md](./research.md) §1) : **les îlots sont en Preact, pas en React** (ADR-016). Le moteur de React 19 pèse environ 115 Ko compressés, alors que le budget est de 50 Ko par page (TR-20), et le compteur Mon séjour est présent sur toutes les pages.

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18, **Preact 10 + `@astrojs/preact`** (remplace `@astrojs/react`, `react`, `react-dom`), `nanostores`, `@nanostores/persistent`, `@nanostores/preact`, Tailwind CSS v4, Zod

**Storage**: `localStorage`, clé `kibreeze.selection.v1`, 30 jours ; repli en mémoire

**Testing**: Vitest (fonctions pures à 100 %, store), Vitest + `@testing-library/preact` + axe (îlots), Playwright (parcours, persistance, stockage bloqué, sans JavaScript), Lighthouse CI, `check-bundle-size` à deux seuils

**Target Platform**: navigateurs modernes ; la sélection exige JavaScript, le reste du site non

**Project Type**: site statique multi-pages avec îlots

**Performance Goals**: ≤ 50 Ko de JavaScript compressé par page de contenu, ≤ 80 Ko sur `/sejour` (objectif ~15 Ko et ~25 Ko) ; mise à jour de l'interface < 100 ms (SC-004) ; Lighthouse ≥ 90 sur `/sejour`

**Constraints**: aucune règle métier dans un composant ; aucun texte en dur dans un `.tsx` ; message ≤ 1 800 caractères encodés ; aucun cookie

**Scale/Scope**: 2 pages (`/sejour`, `/en/my-trip`), 5 îlots, 3 modules purs, 16 entrées de catalogue

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Pas de backend ni de compte ; dépendances déjà décidées par l'ADR-002 (nanostores) ; Preact remplace React, sans ajout net de bibliothèque d'interface | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md) (FR-SEL, FR-EST, FR-WA, FR-I18N-5 à 7) | ✅ |
| III. Business logic is pure and tested | Sélection, estimation et message dans `src/features/*/`, purs, 100 % de couverture ; îlots sans règle | ✅ |
| IV. Content is data, not code | Catalogue minimal dérivé des collections ; chaînes des îlots tirées des dictionnaires | ✅ |
| V. Mobile-first, accessible, fast | Budgets TR-20 vérifiés en CI ; HTML complet sans JavaScript hors sélection ; annonces `aria-live` | ✅ |
| VI. Design through tokens | Écrans 03, 04, 05a, 05b, 11 relevés élément par élément dans le HTML Stitch, valeurs passées par les tokens | ✅ |
| VII. DevOps isolated from production | Aucun changement d'infrastructure | ✅ |
| Contrainte « Stack » (îlots React 19) | **Écart** : Preact. Couvert par l'ADR-016 et l'amendement de la ligne Stack de la constitution (2.1.0), comme l'exige la gouvernance | ⚠️ justifié |

Revérification après la phase 1 : contrats sans backend ni état serveur, règles dans les fonctions pures. Seul écart : Preact, justifié ci-dessous.

## Project Structure

### Documentation (this feature)

```text
specs/004-stay-and-estimate/
├── spec.md
├── plan.md
├── research.md          # 12 décisions
├── data-model.md        # Selection, SelectedLine, PriceEstimate, cas de référence
├── quickstart.md
├── contracts/
│   ├── selection.md     # fonctions pures, store, persistance
│   └── ui.md            # îlots, fiche, page Mon séjour
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── selection/
│   │   ├── selection.ts            # opérations pures
│   │   ├── islandCatalog.ts        # catalogue minimal (pur)
│   │   ├── store.ts                # nanostores persistant + repli mémoire
│   │   ├── StayBadge.tsx
│   │   ├── ExperienceConfigurator.tsx
│   │   ├── QuantityStepper.tsx
│   │   ├── QuickAdd.tsx
│   │   ├── StayPage.tsx
│   │   └── Toasts.tsx
│   ├── estimation/computeEstimate.ts
│   └── whatsapp/buildSelectionMessage.ts   # remplace buildServiceRequestMessage
├── components/experiences/         # fiche et cartes branchées sur les îlots
├── pages/sejour.astro, en/my-trip.astro
├── content/legal/{fr,en}/privacy.md        # stockage documenté
└── i18n/routes.ts                  # stay livrée

scripts/check-bundle-size.mjs       # seuils 50 / 80 Ko
docs/technical-decisions.md         # ADR-016
.specify/memory/constitution.md     # 2.1.0 : îlots Preact
```

**Structure Decision**: `src/features/selection/` regroupe règles, store et îlots de la sélection, comme le prévoit l'architecture. Les îlots sont en `.tsx` (JSX Preact).

## Découpage par user story

| Story | Livrable |
|---|---|
| US1 — ajouter (P1) | fonctions de sélection, store, persistance, configurateur de fiche, ajout rapide, messages |
| US2 — Mon séjour (P2) | `computeEstimate`, page Mon séjour et ses états |
| US3 — envoyer (P3) | `buildSelectionMessage`, troncature, boutons d'envoi |
| US4 — compteur (P4) | `StayBadge`, route `stay` livrée, « Planifier mon séjour » |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Îlots en Preact au lieu de React 19 (contrainte Stack) | Le moteur React (~115 Ko compressés) dépasse à lui seul le budget de 50 Ko par page (TR-20), et le compteur est sur toutes les pages | React seulement sur `/sejour` : la fiche et le compteur dépasseraient encore ; sans framework : la page Mon séjour deviendrait du code DOM difficile à maintenir et à tester |
