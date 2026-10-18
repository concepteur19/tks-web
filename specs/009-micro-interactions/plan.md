# Implementation Plan: Micro-interactions et mini tuto

**Branch**: `009-micro-interactions` | **Date**: 2026-10-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-micro-interactions/spec.md`

## Summary

Rendre le site vivant sans le ralentir, et apprendre au visiteur à s'en servir. Le navigateur fait l'essentiel : transitions entre pages et glissement de la photo d'une carte vers sa fiche par les View Transitions entre documents (CSS seul), préchargement par la fonction intégrée d'Astro, survol et appui par trois utilitaires Tailwind. Un petit script n'anime que ce qui est sous le premier écran, et ne masque rien tant qu'il n'a pas tourné. Les îlots existants gagnent les retours d'ajout (« Ajouté ✓ », rebond du compteur, vibration, notification qui glisse) ; deux îlots s'ajoutent : le mini tuto, dont la logique est pure et testée, et le bouton Partager. L'accueil reçoit « Comment ça marche ». Décisions : [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18 (préchargement intégré), Preact 10, nanostores, Tailwind CSS v4. Aucune dépendance ajoutée.

**Storage**: `localStorage['kibreeze.guide.v1']`, repli `sessionStorage` puis mémoire de page ; sélection inchangée

**Testing**: Vitest (logique du tuto à 100 %), Testing Library (tuto, Partager, « Ajouté ✓ », compteur), Playwright (premier passage, réduire les animations, sans JavaScript, noms de transition uniques, préchargement, partage, vibration simulée), Lighthouse CI (CLS), `check-bundle-size`

**Target Platform**: navigateurs modernes ; View Transitions sur Chrome/Edge 126+ et Safari 18.2+, navigation identique ailleurs ; page complète sans JavaScript

**Project Type**: site statique multi-pages avec îlots

**Performance Goals**: Lighthouse ≥ 90 sur l'accueil, une fiche, Mon séjour ; CLS ≤ 0,1 ; LCP inchangé (premier écran jamais animé) ; ≤ 50 kB de JavaScript compressé par page

**Constraints**: durées et distances par tokens ; aucune animation > `--duration-slow`, cascade ≤ 500 ms ; aucun mouvement sous `prefers-reduced-motion: reduce` ; rien de masqué sans JavaScript ; aucun écran de chargement ; un nom de transition unique par page

**Scale/Scope**: 18 micro-interactions (contracts/ui.md), 2 îlots nouveaux, 1 script de page, 1 section d'accueil, ~30 composants marqués

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance ; CSS et fonctions du navigateur d'abord ; pas de routeur côté client ; deux îlots, un script de 0,7 kB | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md) ; les trois choix ouverts tranchés par Zobel avant la spec | ✅ |
| III. Business logic is pure and tested | Sélection, estimation et message inchangés ; la règle du tuto (`shouldShowGuide`, `nextGuideState`) est pure et couverte à 100 % | ✅ |
| IV. Content is data, not code | Textes du tuto, de « Comment ça marche » et du partage dans les dictionnaires FR/EN | ✅ |
| V. Mobile-first, accessible, fast | Réduire les animations respecté ; tuto au clavier et annoncé, sans vol de focus ; premier écran non animé ; HTML complet sans JavaScript | ✅ |
| VI. Design through tokens | Trois durées et la courbe existantes, deux tokens ajoutés (`--duration-stagger`, `--distance-reveal`) ; aucune valeur brute | ✅ |
| VII. DevOps isolated from production | Aucun changement d'infrastructure | ✅ |

Revérification après la phase 1 : aucun écart.

## Project Structure

### Documentation (this feature)

```text
specs/009-micro-interactions/
├── spec.md
├── plan.md
├── research.md          # 12 décisions
├── data-model.md        # état du tuto, tokens, constantes
├── quickstart.md
├── contracts/
│   ├── ui.md            # catalogue des 18 micro-interactions, tuto, « Comment ça marche », Partager, marquage
│   └── content.md       # chaînes FR/EN, tokens, configuration, stockage, état de test
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
astro.config.mjs                         # prefetch
src/
├── styles/
│   ├── tokens.css                       # --duration-stagger, --distance-reveal
│   └── global.css                       # @view-transition, utilitaires lift / media-zoom / press / link-slide,
│                                        # *-pending, keyframes bump / roll-up / roll-down / toast / ring, scroll-behavior
├── scripts/reveal.ts                    # nouveau : apparition et fondu des images
├── features/
│   ├── guide/guide.ts                   # nouveau : logique pure du tuto
│   ├── guide/FirstVisitGuide.tsx        # nouveau : îlot
│   ├── share/ShareButton.tsx            # nouveau : îlot
│   ├── feedback/notice.ts               # nouveau : atome $notice (« Lien copié »)
│   └── selection/{QuickAdd,LineCustomizer,RequestBar,QuantityStepper,StayBadge,Toasts,StayPage}.tsx
├── components/
│   ├── home/HowItWorks.astro            # nouveau
│   ├── home/HomePage.astro              # position de la section
│   ├── Header.astro, TabBar.astro, Footer.astro
│   ├── experiences/{ExperienceCard,ExperienceDetail,UniverseCard,CompactCard}.astro
│   └── accommodation/, packages/, mobility/, home/ (cartes)
├── layouts/BaseLayout.astro             # script, îlot du tuto, noms de transition
└── i18n/{fr,en}.ts                      # guide.*, home.how.*, stay.added, share.*

tests/
├── unit/guide.test.ts                   # nouveau
├── component/{guide,share}.test.tsx     # nouveaux ; selection-islands.test.tsx complété
├── e2e/{guide,motion}.spec.ts           # nouveaux
├── e2e/guide-done.json                  # état de stockage par défaut
└── e2e/home.spec.ts                     # ordre des sections
playwright.config.ts                     # storageState par défaut
lighthouserc.json                        # assertion CLS
docs/cahier-de-test-kibreeze-franck.xlsx # scénarios tuto, partage, animations (branche docs-cahier-de-test)
```

**Structure Decision**: deux dossiers de fonctionnalités nouveaux, `guide/` et `share/`, sur le modèle de `selection/` (logique pure en `.ts`, îlot en `.tsx`) ; le script d'apparition dans `src/scripts/`, comme tout script de page.

## Découpage par user story

| Story | Livrable |
|---|---|
| US1 — comprendre (P1) | `guide.ts` + tests, `FirstVisitGuide`, marquage `data-guide`, chaînes, `guide-done.json`, `HowItWorks` |
| US2 — site vivant (P2) | tokens, `global.css`, `reveal.ts`, View Transitions et noms, traits d'onglet, utilitaires sur les composants, retours d'ajout (bouton, compteur, notification, vibration), sélecteur, repli de ligne |
| US3 — instantané et partage (P3) | préchargement, `ShareButton`, `$notice` |

US1 est livrable seule. US2 et US3 ne dépendent pas d'US1 ; US3 réutilise la notification animée d'US2 si elle est faite avant, sinon la notification actuelle.

## Complexity Tracking

Aucune violation de la constitution.
