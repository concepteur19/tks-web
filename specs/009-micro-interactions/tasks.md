---
description: "Liste de tâches — Micro-interactions et mini tuto"
---

# Tasks: Micro-interactions et mini tuto

**Input**: Documents de conception de `specs/009-micro-interactions/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III). Logique du tuto et atome `$notice` couverts à 100 % par des tests écrits avant le code, qui doivent d'abord échouer ; îlots en Testing Library ; parcours, réduire les animations et sans JavaScript en Playwright.

**Organisation**: par user story, dans l'ordre de priorité.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles des 002 à 008 (aucun texte en dur, tokens, aucune règle métier dans un composant). En plus :

- toute durée, distance ou courbe passe par les tokens (`--duration-*`, `--ease-standard`, `--duration-stagger`, `--distance-reveal`) ; aucune animation au-delà de `--duration-slow`, cascade ≤ 500 ms ;
- toute animation de mouvement est déclarée sous `@media (prefers-reduced-motion: no-preference)` ou neutralisée par la règle globale ;
- le premier écran (texte et image prioritaire) n'est jamais animé à l'arrivée ; rien n'est masqué tant qu'un script ne l'a pas décidé ;
- seules `transform`, `translate`, `scale` et `opacity` sont animées (exceptions : repli de ligne par `grid-template-rows`, anneau du tuto par une ombre, soulignement par `background-size` : peinture seule, sans effet sur la mise en page) ;
- les chaînes sont celles de [contracts/content.md](./contracts/content.md), en français et en anglais ;
- après chaque phase, `npm run check` et `npm run build` passent.

---

## Phase 1: Setup

- [X] T001 [P] Ajouter `--duration-stagger: 60ms` et `--distance-reveal: 0.75rem` à `src/styles/tokens.css`, dans le bloc Mouvement, et les documenter dans `docs/design-system.md` (section Mouvement)
- [X] T002 [P] Créer `tests/e2e/guide-done.json` (état de stockage Playwright : origine `http://localhost:4321`, `localStorage` `kibreeze.guide.v1 = "done"`) et le charger par défaut dans `playwright.config.ts` (`use.storageState`) ; vérifier que la suite existante passe toujours
- [X] T003 [P] Chaînes de [contracts/content.md](./contracts/content.md) dans `src/i18n/fr.ts` et `src/i18n/en.ts` (`guide.*`, `home.how.*`, `stay.added`, `share.*`)

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [X] T004 Dans `src/styles/global.css` : keyframes `bump`, `roll-up`, `roll-down`, `toast-in`, `ring`, `rise` ; états `[data-reveal-pending]` et `[data-fade-pending]` (opacité 0, décalage `--distance-reveal`, transition `--duration-slow` avec délai `calc(var(--reveal-index, 0) * var(--duration-stagger))`) ; utilitaires Tailwind v4 `lift`, `media-zoom`, `press`, `link-slide` selon [contracts/ui.md](./contracts/ui.md) ; `scroll-behavior: smooth` ; le tout sous `prefers-reduced-motion: no-preference` sauf les états de repos
- [X] T005 Vérifier : `npm run check`, `npm run build` passent, aucune page visuellement modifiée tant que rien n'utilise ces classes

**Checkpoint**: les briques de mouvement existent, inertes.

---

## Phase 3: User Story 1 — Comprendre le fonctionnement (Priority: P1) 🎯 MVP

**Goal**: mini tuto au premier passage et « Comment ça marche » sur l'accueil.

**Independent Test**: appareil vierge → tuto jusqu'au bout → rechargement sans tuto ; même chose en passant dès l'étape 1 (quickstart, scénarios 1 à 5).

### Tests

- [X] T006 [P] [US1] Créer `tests/unit/guide.test.ts` (doit échouer) selon [data-model.md](./data-model.md) : `shouldShowGuide` vrai seulement pour `status: 'new'` et `itemCount: 0` ; `nextGuideState` : `next` 0 → 1 → 2, `next` à l'étape 2 = `finish` ; `skip` et `finish` → `hidden` + `done` ; `added` aux étapes 0 et 1 → étape 2, à l'étape 2 → inchangé ; tout événement sur `hidden` → inchangé ; `GUIDE_STEPS` : 3 étapes `explore`, `add`, `send` avec leurs cibles par ordre de préférence ; `guideTarget` : étape 2 → `add` visible, sinon `stay` ; étape 3 → `send`, sinon `stay` ; `readGuideStatus` : `localStorage` lu en premier, `sessionStorage` si le premier lève une erreur, mémoire de page en dernier, valeur absente ou illisible = `new` ; `markGuideDone` : écrit dans le premier stockage qui accepte, passe au suivant sur erreur
- [X] T007 [P] [US1] Créer `tests/component/guide.test.tsx` (doit échouer) : bulle `data-testid="guide"`, « Étape 1 sur 3 », titres et textes des 3 étapes, « Suivant » devient « C'est parti » ; « Passer » et Échap ferment et écrivent `kibreeze.guide.v1 = "done"` ; un événement `added` sur `$lastEvent` mène à l'étape 3 ; la cible choisie par `guideTarget` reçoit `data-guide-active` (étape 2 : un bouton d'ajout présent, sinon Mon séjour) ; `role="dialog"`, `aria-modal="false"`, focus non déplacé ; aucune violation axe ; rien n'est rendu si le tuto est fait ou le séjour non vide
- [X] T008 [P] [US1] Créer `tests/e2e/guide.spec.ts` (doit échouer), stockage vide, FR et EN, téléphone et ordinateur : bulle visible en moins de 2 s au-dessus de la barre à onglets (téléphone) ou en haut à droite (ordinateur), page cliquable pendant l'affichage ; parcours Suivant, Suivant, C'est parti ; rechargement et changement de page : plus de bulle ; Passer ; arrivée directe sur une fiche : bulle ; séjour déjà rempli : pas de bulle ; ajout pendant l'étape 1 : étape 3 et notification non recouverte ; sans JavaScript : pas de bulle
- [X] T009 [P] [US1] Dans `tests/e2e/home.spec.ts`, insérer `how-it-works` entre `categories` et `featured` dans `SECTION_ORDER` (doit échouer) et vérifier ses 3 étapes et son bouton vers le Tourisme, FR et EN

### Implementation

- [X] T010 [US1] Créer `src/features/guide/guide.ts` conforme à T006 (types, `GUIDE_STEPS`, `shouldShowGuide`, `nextGuideState`, `guideTarget`, `readGuideStatus`, `markGuideDone`) ; couverture 100 %
- [X] T011 [US1] Créer `src/features/guide/FirstVisitGuide.tsx` conforme à T007 et à [contracts/ui.md](./contracts/ui.md) : mémoire par `readGuideStatus` / `markGuideDone` (aucune logique de stockage dans l'îlot), apparition au plus `GUIDE_DELAY_MS` après le chargement, bulle au-dessus de la barre à onglets / en haut à droite sur `lg`, `data-guide-active` sur la cible donnée par `guideTarget`, effacement pendant qu'une notification est affichée, entrée `rise`
- [X] T012 [US1] Poser `data-guide="explore"` sur la navigation de `src/components/TabBar.astro` et `src/components/Header.astro`, `data-guide="stay"` sur l'onglet et l'icône Mon séjour, `data-guide="add"` sur le bouton de `QuickAdd.tsx`, `LineCustomizer.tsx` et `RequestBar.tsx`, `data-guide="send"` sur le bouton WhatsApp de `StayPage.tsx` ; style de l'anneau `[data-guide-active]` dans `global.css` : keyframes `ring` jouées **deux fois** (`animation-iteration-count: 2`, `--duration-slow`) puis anneau fixe ; monter `FirstVisitGuide` en `client:only="preact"` dans `src/layouts/BaseLayout.astro`
- [X] T013 [US1] Créer `src/components/home/HowItWorks.astro` selon [contracts/ui.md](./contracts/ui.md) (icônes de `Icon.astro`, `data-section="how-it-works"`, étapes en `data-reveal`) et l'insérer dans `src/components/home/HomePage.astro` après les univers, avant les mises en avant
- [X] T014 [US1] `npm run check`, `npm run build` ; T006 à T009 passent

**Checkpoint**: US1 livrable seule.

---

## Phase 4: User Story 2 — Un site vivant et fluide (Priority: P2)

**Goal**: transitions, apparitions, survol, appui, retours d'ajout, sélecteurs, repli de ligne, onglet qui glisse.

**Independent Test**: parcours accueil → univers → fiche → ajout → Mon séjour → retrait, puis le même avec « réduire les animations » (quickstart, scénarios 6 à 13).

### Tests

- [ ] T015 [P] [US2] Créer `tests/e2e/motion.spec.ts` (doit échouer) : la feuille de style déclare `@view-transition` ; sur chaque page livrée (`tests/e2e/delivered.ts`), aucun `view-transition-name` en double ; la photo d'une carte d'univers, d'une carte mise en avant sur l'accueil et d'une suggestion de fiche porte le même nom que la photo principale de la fiche visée ; aucun `[data-reveal-pending]` dans le premier écran au chargement, des éléments plus bas en portent et le perdent au défilement ; avec `reducedMotion: 'reduce'`, aucun `*-pending` et `document.getAnimations()` vide après un ajout et un retrait ; sans JavaScript, tous les `[data-reveal]` visibles ; défilement d'un coup jusqu'en bas d'une page longue, puis une demi-seconde : plus aucun `[data-reveal-pending]` ; `scroll-behavior: smooth` sur `html` sous `no-preference`, `auto` sous `reduce` ; l'onglet actif porte son trait nommé ; `navigator.vibrate` (simulé par script d'initialisation) appelé une fois avec 15 à l'ajout
- [ ] T016 [P] [US2] Compléter `tests/component/selection-islands.test.tsx` (doit échouer) : `QuickAdd`, `LineCustomizer` et le bouton de `RequestBar` affichent « Ajouté ✓ » après un ajout puis leur libellé (ou « Déjà dans mon séjour ») après `ADDED_FLASH_MS` (minuteurs simulés) ; `StayBadge` pose la classe de rebond quand le nombre augmente, pas quand il baisse ; `Toasts` appelle `navigator.vibrate(15)` une fois sur `added` et `merged`, jamais sur `removed` ; `QuantityStepper` pose `roll-up` sur + et `roll-down` sur − ; une ligne retirée de `StayPage` passe par l'état `leaving` et disparaît à `transitionend` (événement simulé), immédiatement sous réduire les animations

### Implementation

- [ ] T017 [US2] Créer `src/scripts/reveal.ts` selon [research.md](./research.md) §4 (pose de `data-reveal-pending` hors premier écran, `--reveal-index` plafonné à `REVEAL_INDEX_MAX` dans `[data-reveal-group]`, `IntersectionObserver`, `data-fade-pending` sur les images non chargées sauf `fetchpriority="high"`, rien sous réduire les animations) et le charger dans `src/layouts/BaseLayout.astro`
- [ ] T018 [US2] Transitions entre pages : `@view-transition` et fondu de `root` dans `global.css` ; `view-transition-name` sur l'en-tête et la barre à onglets (`BaseLayout`/`Header`/`TabBar`) ; trait d'état actif nommé `tab-indicator` (barre à onglets) et `nav-indicator` (menu ordinateur) ; `exp-<id>` sur la photo de `ExperienceCard.astro`, des cartes de `src/components/home/FeaturedCarousel.astro` et de `CompactCard.astro`, et sur la photo principale de `ExperienceDetail.astro`
- [ ] T019 [US2] Appliquer `lift` + `media-zoom` + `data-reveal` (grilles : `data-reveal-group`) aux cartes : `ExperienceCard`, `UniverseCard`, `CompactCard`, aperçus de `src/components/home/`, types de `AccommodationPage`, `TourCard`, `PackageCard`, catégories et services de `MobilityPage` ; `data-reveal` sur les sections hors premier écran ; `press` sur les boutons et liens-boutons ; `link-slide` sur les liens de texte de `Footer.astro` et des pages légales
- [ ] T020 [US2] Retours d'ajout : « Ajouté ✓ » (`stay.added`, `ADDED_FLASH_MS`) dans `QuickAdd.tsx`, `LineCustomizer.tsx`, `RequestBar.tsx` ; rebond dans `StayBadge.tsx` ; entrée/sortie animées et vibration (`VIBRATION_MS`) dans `Toasts.tsx`, la sortie retirant la notification à l'événement `animationend` (immédiatement sous réduire les animations), jamais par un minuteur calé sur une durée d'animation
- [ ] T021 [US2] `QuantityStepper.tsx` : cadre `overflow-hidden`, animation `roll-up` / `roll-down` à chaque changement ; `StayPage.tsx` : état `leaving` et repli avant retrait, le retrait se faisant à l'événement `transitionend` (aucun minuteur qui recopie `--duration-base`), immédiat sous réduire les animations
- [ ] T022 [US2] `npm run check`, `npm run build` ; T015, T016 et toute la suite de bout en bout passent

---

## Phase 5: User Story 3 — Navigation instantanée et partage (Priority: P3)

**Goal**: préchargement des pages, bouton Partager sur les fiches.

**Independent Test**: fiche ouverte depuis un univers presque instantanément ; partage depuis téléphone et ordinateur (quickstart, scénarios 14 et 15).

### Tests

- [ ] T023 [P] [US3] Créer `tests/unit/notice.test.ts` (doit échouer) : `notify(key)` publie `{ key, at }` dans `$notice`, deux notifications identiques successives restent distinctes
- [ ] T024 [P] [US3] Créer `tests/component/share.test.tsx` (doit échouer) : avec `navigator.share`, appel `{ title, url }` ; sans, copie via `navigator.clipboard.writeText` et `notify('share.copied')` ; sans les deux, ouverture de `https://wa.me/?text=` ; partage annulé (`AbortError`) : rien ; `aria-label` « Partager : <titre> » ; aucune violation axe
- [ ] T025 [P] [US3] Compléter `tests/e2e/motion.spec.ts` : après chargement d'un univers, au moins une fiche préchargée (`link[rel="prefetch"]` ou requête observée) ; aucune requête de préchargement vers `wa.me` ; sur ordinateur, « Partager » copie le lien et affiche « Lien copié » (permission presse-papiers accordée) ; sans JavaScript, pas de bouton Partager

### Implementation

- [ ] T026 [US3] Ajouter `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }` à `astro.config.mjs` et `data-astro-prefetch="hover"` aux liens des cartes des grilles d'univers
- [ ] T027 [US3] Créer `src/features/feedback/notice.ts` (`$notice`, `notify`) conforme à T023 ; faire afficher `$notice` par `Toasts.tsx`, à côté de `$lastEvent`
- [ ] T028 [US3] Créer `src/features/share/ShareButton.tsx` conforme à T024 et l'insérer en `client:only="preact"` dans `src/components/experiences/ExperienceDetail.astro`, à côté du titre (`data-testid="share"`, `press`)
- [ ] T029 [US3] `npm run check`, `npm run build`, `npm run check:bundle` ; T023 à T025 passent

---

## Phase 6: Polish & vérification

- [ ] T030 [P] `lighthouserc.json` : assertion `cumulative-layout-shift` ≤ 0,1 sur toutes les adresses
- [ ] T031 [P] Documentation : `docs/functional-requirements.md` (section UX : FR-UX-1 à 5 résumant tuto, « Comment ça marche », animations, préchargement, partage) ; `docs/design-system.md` (catalogue des micro-interactions, renvoi vers [contracts/ui.md](./contracts/ui.md)) ; `specs/README.md` (statut 009)
- [ ] T032 [P] Sur la branche `docs-cahier-de-test` : versionner le générateur du cahier sous `docs/tools/build-cahier-de-test.py` (lecture du catalogue pour l'onglet des prix), y ajouter les scénarios du tuto, de « Comment ça marche », du partage, du trait d'onglet et des animations (quickstart, scénarios 1 à 15), plus la question de SC-001 (« Après le tuto, comment obtient-on un prix ? »), puis régénérer `docs/cahier-de-test-kibreeze-franck.xlsx`
- [ ] T033 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; mesurer en 4G simulée le temps d'affichage d'une fiche ouverte depuis un univers, avec et sans préchargement (SC-004 : moins d'une seconde) ; consigner les résultats (dont LCP et CLS avant / après sur l'accueil) dans [quickstart.md](./quickstart.md)
- [ ] T034 Captures et vidéos courtes à 390 px (WebKit) et 1 440 px (Chromium) : tuto, transition carte → fiche, apparition, ajout ; vérifier qu'aucune animation ne dépasse le tiers de seconde et que rien ne clignote ; consigner dans [quickstart.md](./quickstart.md)
- [ ] T035 Dérouler les 16 scénarios manuels de [quickstart.md](./quickstart.md) sur un vrai téléphone et relire les textes anglais (Zobel)
- [ ] T036 Ouvrir la PR `009-micro-interactions` → `main`, après la fusion de la 006 (Zobel)

---

## Dépendances

```text
Setup (T001–T003) ─► Foundational (T004–T005) ─► US1 (T006–T014) ─► US2 (T015–T022) ─► US3 (T023–T029) ─► Polish
```

- US2 et US3 ne dépendent pas d'US1 ; elles suivent l'ordre de priorité. US3 réutilise `Toasts` modifié par US2 (T020) : T027 vient après T020.
- T002 avant toute nouvelle exécution de bout en bout : sans lui, la bulle du tuto gênerait les tests existants.
- Dans chaque story, les tests passent avant l'implémentation et doivent d'abord échouer.

## Exécution parallèle

- Setup : T001, T002, T003 en parallèle.
- US1 : T006 à T009 en parallèle ; puis T010 → T011 → T012 ; T013 en parallèle de T011.
- US2 : T015 et T016 en parallèle ; puis T017, T018 ; T019 ; T020 et T021 en parallèle.
- US3 : T023 à T025 en parallèle ; T026 en parallèle de T027 → T028.
- Polish : T030, T031, T032 en parallèle.

## Stratégie

1. **MVP = phases 1 à 3** : le visiteur comprend comment obtenir un devis ; c'est ce qui sert la conversion.
2. **US2** : le site vivant, demande principale de Zobel.
3. **US3** : la fluidité perçue et le partage.
