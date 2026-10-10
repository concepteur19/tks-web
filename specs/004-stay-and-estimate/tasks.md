---

description: "Liste de tâches — Mon séjour, estimation et demande WhatsApp"
---

# Tasks: Mon séjour, estimation et demande WhatsApp

**Input**: Documents de conception de `specs/004-stay-and-estimate/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés. Chaque fonction pure a son test écrit avant elle, qui doit d'abord échouer ; couverture 100 % des modules de `src/features/selection/selection.ts`, `src/features/estimation/computeEstimate.ts`, `src/features/whatsapp/buildSelectionMessage.ts`.

**Organisation**: par user story, dans l'ordre de priorité.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles de 002 et 003 (aucun texte en dur, tokens, liens par `getRoutePath`). En plus :

- aucune règle métier dans un îlot : les îlots appellent les fonctions pures et le store ;
- les chaînes des îlots arrivent en props depuis les dictionnaires ; aucun texte littéral dans un `.tsx` ;
- avant chaque composant visible, relever dans le HTML Stitch de l'écran (03, 04, 05a, 05b, 11) les tailles, couleurs, graisses et espacements de l'élément, et les reprendre par les tokens ;
- aucun cookie ; seule la clé `kibreeze.selection.v1` est écrite dans le stockage.

---

## Phase 1: Setup

- [X] T001 Remplacer React par Preact : retirer `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom` ; ajouter `@astrojs/preact`, `preact`, `nanostores`, `@nanostores/persistent`, `@nanostores/preact`, et en développement `@testing-library/preact` ; `preact()` dans `astro.config.mjs` ; `jsxImportSource: "preact"` dans `tsconfig.json` ; adapter le bloc `.tsx` de `eslint.config.js`. Puis relancer `npm run check`, `npm run build:prod`, `npm run test:e2e`, `npm run check:links`, `npm run check:bundle` : tout doit passer à l'identique avant de continuer
- [X] T002 [P] Rédiger l'ADR-016 « Îlots en Preact » dans `docs/technical-decisions.md` (contexte : mesure du moteur React à ~115 Ko compressés contre un budget de 50 Ko ; décision ; alternatives ; conséquences) et amender la ligne Stack de `.specify/memory/constitution.md` (« îlots Preact »), version 2.1.0 et date d'amendement
- [X] T003 [P] Étendre `scripts/check-bundle-size.mjs` à deux seuils : 50 Ko compressés par page, 80 Ko pour `sejour.html` et `en/my-trip.html` (TR-20), avec le seuil appliqué affiché dans le rapport

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [X] T004 [P] Écrire `tests/unit/selection.test.ts` (doit échouer), couverture 100 % : `emptySelection` ; `addLine` (nouvelle ligne ; fusion `persons`/`units` additionnés et plafonnés avec `capped` ; durées remplacées ; `tierId` et `optionIds` remplacés ; ligne sans dimension ou sur devis refusée en `alreadyThere`) ; `updateLine` (quantités ramenées aux bornes, valeurs non entières ou négatives) ; `removeLine` ; `clearSelection` ; `setStay` (dates ≤ 80 caractères, voyageurs entier 1 à 50) ; `parseSelection` (JSON illisible, version inconnue, forme invalide → vide ; `updatedAt` > 30 jours → vide ; service absent, désactivé, tarif ou option disparus → retirés et listés dans `purged`) ; `defaultLine` (quantités par défaut, tarif le moins cher, aucune option)
- [X] T005 Créer `src/features/selection/selection.ts` conforme à T004 et à [data-model.md](./data-model.md), sans import d'Astro, de Preact ni du DOM
- [X] T006 [P] Écrire `tests/unit/compute-estimate.test.ts` (doit échouer), couverture 100 %, avec les huit cas de référence de [data-model.md](./data-model.md) et en plus : `hasFromPrices`, `isQuoteOnly` sur sélection vide, option ajoutée à une ligne sur devis (ligne reste sur devis), option par personne sans dimension personnes (× 1), libellés de dimensions et de tarif reportés dans les lignes
- [X] T007 Créer `src/features/estimation/computeEstimate.ts` conforme à T006
- [X] T008 [P] Écrire `tests/unit/selection-message.test.ts` (doit échouer), couverture 100 % : intention `quote` en FR et en EN (salutation, dates et voyageurs seulement s'ils existent, lignes avec quantités en toutes lettres, tarif, options, montant ou « sur devis », total estimatif ou indicatif, « + N prestations sur devis », « Total : sur devis (N prestations) », clôture) ; intention `single` (une ligne, adresse de la fiche) ; troncature au-delà de 1 800 caractères encodés avec « … et N autres prestations » et total exact ; exemple complet de non-régression
- [X] T009 Créer `src/features/whatsapp/buildSelectionMessage.ts` et les gabarits `message.*` FR et EN dans `src/i18n/fr.ts` et `src/i18n/en.ts` ; faire de `buildServiceRequestMessage` (003) une enveloppe de l'intention `single`, ses tests restant verts
- [X] T010 [P] Écrire `tests/unit/island-catalog.test.ts` puis créer `src/features/selection/islandCatalog.ts` (`toIslandCatalog`) : uniquement identifiant, titres, prix ou tarifs, quantité, option, vignette, adresses de fiche ; aucune description ni galerie
- [X] T011 Créer `src/features/selection/store.ts` : atome persistant `kibreeze.selection.v1` (`@nanostores/persistent`, encodage JSON), repli sur un atome en mémoire si un essai d'écriture échoue (événement `storageUnavailable`), `$lastEvent`, actions `add`, `update`, `remove`, `clear`, `setStay`, `hydrate(catalog)` ; test `tests/unit/store.test.ts` avec un stockage simulé (persistance, repli, synchronisation)
- [X] T012 Ajouter `stay` à `IMPLEMENTED_ROUTES`, créer `src/pages/sejour.astro` et `src/pages/en/my-trip.astro` (coquille `BaseLayout` avec `routeKey="stay"`, titre et description propres, `<noscript>` : explication et bouton WhatsApp générique) ; l'onglet, l'icône de l'en-tête et « Planifier mon séjour » apparaissent par le mécanisme de 002

**Checkpoint** : `npm run check` passe, couverture 100 % des trois modules purs.

---

## Phase 3: User Story 1 — Ajouter des expériences (Priority: P1) 🎯 MVP

**Independent Test** : ajouter trois expériences depuis leur fiche et une depuis la liste, recharger, rouvrir le navigateur.

### Tests

- [X] T013 [P] [US1] Écrire (regroupés dans `tests/component/selection-islands.test.tsx`) `tests/component/quantity-stepper.test.tsx` et `tests/component/experience-configurator.test.tsx` (Testing Library Preact + axe) : bornes du sélecteur, saisie clavier, boutons de 44 px nommés ; choix du tarif ; cases des options ; total mis à jour ; « Ajouter » puis « Déjà dans mon séjour » pour une ligne non duplicable ; aucune violation axe
- [X] T014 [P] [US1] Écrire `tests/e2e/add-to-stay.spec.ts` : scénarios 1 à 6 de [quickstart.md](./quickstart.md) (ajout pirogue 6 + guide, fusion et passage sur devis, tarif couple, doublon refusé, ajout rapide depuis la liste et l'accueil, persistance après fermeture du contexte) ; message de confirmation annoncé ; stockage bloqué → bandeau et fonctionnement en mémoire

### Implementation

- [X] T015 [P] [US1] Créer `src/features/selection/QuantityStepper.tsx` (− / valeur éditable / +, 44 px, `aria-label` traduits, bornes)
- [X] T016 [US1] Créer `src/features/selection/ExperienceConfigurator.tsx` : rubrique « Votre réservation » (sélecteurs, tarif en boutons radio), cases à cocher des options, et rendu de la barre fixe (téléphone) et de la carte collante (ordinateur) avec total, euro, « Ajouter à mon séjour » / « Déjà dans mon séjour », lien « Demander ce service » (intention `single`, configuration choisie) ; valeurs relevées dans `docs/design-exports/03-fiche-pirogue.html` et `11-fiche-pirogue-ordinateur.html`
- [X] T017 [US1] Brancher l'îlot dans `src/components/experiences/ExperienceDetail.astro` (`client:load`) à la place de `StickyRequest` et des lignes d'options statiques, en gardant le lien statique « Demander ce service » comme repli sans JavaScript ; supprimer les éléments 003 devenus inutiles
- [X] T018 [P] [US1] Créer `src/features/selection/QuickAdd.tsx` (`defaultLine`, bouton « Ajouter à mon séjour » / « Déjà dans mon séjour ») et le brancher (`client:visible`) dans `ExperienceCard.astro` et `home/FeaturedCarousel.astro`
- [X] T019 [US1] Créer `src/features/selection/Toasts.tsx` (`client:idle` dans `BaseLayout`) : confirmations, maximum atteint, déjà présent, lignes retirées au chargement, stockage indisponible ; région `aria-live="polite"`
- [X] T020 [US1] Ajouter toutes les chaînes des îlots (FR et EN) et le mécanisme de passage des chaînes en props (`src/features/selection/strings.ts`, sous-ensemble typé des dictionnaires)

**Checkpoint** : T013 et T014 passent.

---

## Phase 4: User Story 2 — Mon séjour et estimation (Priority: P2)

### Tests

- [X] T021 [P] [US2] Écrire (dans `tests/component/selection-islands.test.tsx`) `tests/component/stay-page.test.tsx` : lignes, quantités en toutes lettres, tarif, options, total « estimatif » / « indicatif », euro, « + N sur devis », état tout sur devis, état vide, rappel dates et voyageurs ; aucune violation axe
- [X] T022 [P] [US2] Écrire `tests/e2e/stay-page.spec.ts` : scénarios 7 à 9, 11 et 13 de [quickstart.md](./quickstart.md) ; « Vider » avec confirmation ; ligne d'une expérience désactivée retirée au chargement avec message ; pas de défilement horizontal à 320 px ; panneau collant à 1 440 px

### Implementation

- [X] T023 [US2] Créer `src/features/selection/StayPage.tsx` conforme à [contracts/ui.md](./contracts/ui.md) : en-tête et « Vider » (`dialog`), champs dates et voyageurs, lignes avec vignette, sélecteur compact et suppression, encadré du total, actions (barre fixe ou panneau collant), états vide (photo de Kribi, bouton « Découvrir les expériences ») et tout sur devis ; valeurs relevées dans `docs/design-exports/04-mon-sejour-plein.html`, `05a-mon-sejour-vide.html`, `05b-mon-sejour-sur-devis.html`
- [X] T024 [US2] Brancher `StayPage` dans `src/pages/sejour.astro` et `src/pages/en/my-trip.astro` (`client:load`, catalogue complet via `toIslandCatalog`, image vide optimisée) ; bouton WhatsApp flottant visible seulement quand la sélection est vide (attribut sur `body` posé par l'îlot)

**Checkpoint** : T021 et T022 passent.

---

## Phase 5: User Story 3 — Envoyer sur WhatsApp (Priority: P3)

- [X] T025 [P] [US3] Écrire `tests/e2e/send-stay.spec.ts` : scénario 10 de [quickstart.md](./quickstart.md) en FR et en EN (message décodé comparé à l'attendu) ; message ≤ 1 800 caractères encodés avec 13 lignes ; « Demander ce service » sur une fiche reprend quantité et options sans modifier la sélection
- [X] T026 [US3] Brancher « Demander un devis par WhatsApp » dans `StayPage.tsx` (intention `quote`, `target="_blank"`, `rel="noopener noreferrer"`) et « Continuer mes recherches » vers la page Expériences

---

## Phase 6: User Story 4 — Compteur (Priority: P4)

- [X] T027 [P] [US4] Écrire `tests/e2e/stay-badge.spec.ts` : compteur à 2 après deux ajouts sur l'accueil, Contact et une page légale, sur l'onglet (360 px) et l'icône de l'en-tête (1 440 px) ; aucun décalage de mise en page au chargement (CLS mesuré nul sur la zone)
- [X] T028 [US4] Créer `src/features/selection/StayBadge.tsx` et le brancher (`client:idle`) dans `src/components/TabBar.astro` et `src/components/Header.astro`, dans l'emplacement déjà réservé ; pastille ronde (seule exception d'arrondi autorisée) relevée sur la maquette 04

---

## Phase 7: Polish & vérification

- [X] T029 [P] Mettre à jour `src/content/legal/{fr,en}/privacy.md` (section cookies : clé `kibreeze.selection.v1`, contenu, 30 jours, effacement) et `DOCUMENTED_STORAGE` dans `tests/e2e/legal.spec.ts` (FR-029)
- [X] T030 [P] Mettre à jour `docs/architecture.md` (îlots Preact), `specs/README.md` (statut 004), `docs/content-tracker.md` si besoin
- [X] T031 Ajouter `/sejour.html` à `lighthouserc.json` ; lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [X] T032 Comparer les écrans 03, 04, 05a, 05b et 11 à notre rendu, élément par élément (captures au même format), et corriger les écarts non justifiés
- [ ] T033 Dérouler les 14 scénarios manuels (Zobel)
- [ ] T034 Ouvrir la PR `004-stay-and-estimate` → `main` (Zobel)

---

## Dépendances

```text
Setup (T001 bloquant) ─► Foundational ─► US1 ─► US2 ─► US3
                                          └──────────► US4
                                                       ─► Polish
```

- T001 avant tout. T005 après T004, T007 après T006, T009 après T008 et T007. T011 après T005. T012 après T011.
- T016 après T015, T011, T007, T009. T017 après T016. T018 après T011. T023 après T015, T007. T026 après T023, T009. T028 après T011.

## Exécutions parallèles possibles

- Setup : T002 et T003 après T001.
- Foundational : T004, T006, T008, T010 (tests) ensemble.
- US1 : T013, T014, T015, T018 ; US2 : T021, T022.

## Total

34 tâches : 3 en setup, 9 en fondation, 8 pour US1, 4 pour US2, 2 pour US3, 2 pour US4, 6 en finition.
