---
description: "Liste de tâches — Retours de Franck"
---

# Tasks: Retours de Franck

**Input**: Documents de conception de `specs/010-retours-franck/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III). Fonctions pures (`defaultLine`, dates, `formatStayDates`, `buildTourRequestMessage`) et schéma couverts à 100 % par des tests écrits avant le code, qui doivent d'abord échouer ; îlots en Testing Library ; parcours en Playwright.

**Organisation**: par user story, dans l'ordre de priorité.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles des 002 à 009 (aucun texte en dur, tokens, liens par `getRoutePath`, aucune règle métier dans un composant, aucune photo filigranée, photos contrôlées en pleine résolution avant import, règles de mouvement de la 009). En plus :

- les valeurs (identifiants, libellés, bornes, durées, étapes, cartes) sont celles de [data-model.md](./data-model.md) ; les chaînes celles de [contracts/content.md](./contracts/content.md) ;
- les descriptions de Franck sont reprises mot pour mot en français ; l'anglais est une traduction fidèle (relue par Zobel) ;
- après chaque phase, `npm run check` et `npm run build` passent.

---

## Phase 1: Setup

- [X] T001 [P] Photos : importer par `src/assets/photos/sources.json` trois photos de Franck pour le diaporama (`hero/kribi-2.jpg`, `-3`, `-4`, en portrait : `ambiance-hero-plages-couchers/L11-10`, `chutes-de-la-lobe/L9-15`, et une troisième sans visage en gros plan, choisie parmi les plages ou la Lobé) et une photo d'appartement du lot `hebergements-franck/` (`accommodation/appartement.jpg`) ; contrôle en pleine résolution (aucun filigrane) ; à défaut d'appartement convenable, garder `illustrations/appartement-35000.jpg` ; noter les choix dans `src/assets/photos/README.md`
- [X] T002 [P] Chaînes de [contracts/content.md](./contracts/content.md) dans `src/i18n/fr.ts` et `src/i18n/en.ts` ; `packages.customise` reste « Personnaliser ce parcours »

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [X] T003 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) : `focus` accepté au format « X% Y% » (0 à 100), refusé sinon (« 50 % », « 120% 10% », « haut ») ; `upcoming` accepté ; `upcoming` et `illustrative` ensemble refusés avec « upcoming et illustrative s'excluent »
- [X] T004 Ajouter `focus` et `upcoming` à l'image dans `src/content/schemas.ts` conformément à T003 ; couverture 100 %
- [X] T005 [P] Étendre `tests/unit/selection.test.ts` (doit échouer) : `defaultLine(service, 3)` → dimension `persons` à 3 ; borné par `min` et `max` (12 voyageurs, max 8 → 8 ; 1 voyageur, min 2 → 2) ; sans voyageurs → défaut ; dimensions autres que `persons` inchangées ; `applyStay` et `parseSelection` : `arrival` / `departure` acceptés au format `AAAA-MM-JJ`, refusés sinon, départ antérieur à l'arrivée effacé, `dates` (texte ancien) conservé
- [X] T006 Modifier `src/features/selection/selection.ts` (`Stay`, `defaultLine`, `applyStay`, lecture du stockage) conformément à T005 ; couverture 100 %
- [X] T007 [P] Créer `tests/unit/stay-dates.test.ts` et `tests/unit/tour-request-message.test.ts` (doivent échouer) : `formatStayDates` sur les exemples de [data-model.md](./data-model.md) (même mois, mois différents, années différentes, arrivée seule, ancien texte, rien) en français et en anglais ; `buildTourRequestMessage` : message FR et EN du contrat, singulier pour 1 personne ; et dans `tests/unit/selection-message.test.ts`, le message utilise les dates d'arrivée et de départ quand elles existent
- [X] T008 Créer `src/features/whatsapp/formatStayDates.ts` et `src/features/whatsapp/buildTourRequestMessage.ts`, et faire utiliser `formatStayDates` par `buildSelectionMessage.ts` ; couverture 100 %
- [X] T009 Vérifier : `npm run check`, `npm run build`, et la suite de bout en bout existante passent

**Checkpoint**: schéma, sélection et messages savent porter les nouveautés.

---

## Phase 3: User Story 1 — Un catalogue juste et clair (Priority: P1) 🎯 MVP

**Goal**: plats en « plats », descriptions et Ebanjea, maban sans image fausse, pique-nique renommé, lignes qui partent des voyageurs.

**Independent Test**: quickstart, scénarios 1 à 4.

### Tests

- [X] T010 [P] [US1] Créer `tests/e2e/franck-feedback.spec.ts` (doit échouer), FR et EN : l'univers Spécialités culinaires compte 11 plats dont l'Ebanjea ; chaque carte de plat a une description différente de son titre ; le maban et l'Ebanjea portent « Photo à venir » ; Mon séjour avec crabe à 2 → « 2 plats », et le message « Crabe — 2 plats : sur devis » ; 3 voyageurs indiqués puis ajout des chutes → ligne à 3 et libellé « Personnes pour cette activité » ; la fiche `/experiences/pique-nique-en-bord-de-mer` s'appelle « Pique-nique en bord de mer »
- [X] T011 [P] [US1] Dans `tests/unit/redirects.test.ts`, attendre les deux redirections du pique-nique (doit échouer)
- [X] T012 [P] [US1] Compléter `tests/component/selection-islands.test.tsx` (doit échouer) : avec 3 voyageurs dans le séjour, `QuickAdd` d'une prestation par personne ajoute `[3]` ; `StayPage` affiche « Personnes pour cette activité » au-dessus du sélecteur d'une dimension `persons`, pas d'une dimension `units`

### Implementation

- [X] T013 [P] [US1] Plats dans `src/content/services/` : les 10 passent à la dimension plats de [data-model.md](./data-model.md) ; `shortDescription` et `description` FR de Franck, EN traduits ; créer `ebanjea.json` (univers spécialités culinaires, `quote`, description de Franck) ; maban et Ebanjea : image côte de Kribi de Franck (`sections/plage-kribi.jpg` ou équivalente) avec `upcoming: true`
- [X] T014 [P] [US1] Renommer `pique-nique-bivouac.json` en `pique-nique-en-bord-de-mer.json` (titres FR « Pique-nique en bord de mer », EN « Beach picnic », description sans « bivouac ») ; ajouter les deux redirections à `public/_redirects` ; mettre à jour toute référence (`serviceIds`, `steps`, tests, fixtures)
- [X] T015 [US1] Étiquette « Photo à venir » : `IllustrativeTag` et les composants qui l'affichent (`ExperienceCard`, `CompactCard`, `Gallery`, `UniverseCard` si concerné) lisent `upcoming` et prennent `experiences.upcoming`
- [X] T016 [US1] Voyageurs : `QuickAdd.tsx`, `LineCustomizer.tsx` et le brouillon de `ExperienceConfigurator.tsx` / `draft.ts` passent `$selection.get().stay.travelers` à `defaultLine` ; `StayPage.tsx` affiche `stay.personsForActivity` au-dessus du sélecteur d'une dimension `persons`
- [X] T017 [US1] `npm run check`, `npm run build` ; T010 à T012 passent

**Checkpoint**: US1 livrable seule.

---

## Phase 4: User Story 2 — Choisir un parcours tout fait (Priority: P1)

**Goal**: une fiche par parcours, durées, mentions, ajout et personnalisation.

**Independent Test**: quickstart, scénarios 5 à 7.

### Tests

- [ ] T018 [P] [US2] Créer `tests/e2e/tour-pages.spec.ts` (doit échouer), FR et EN : depuis la page Formules, chaque `tour-link` mène à `/formules/<id>` (`/en/packages/<id>`) ; chaque fiche montre titre, photo, description, étapes dans l'ordre, tarif (« À partir de … / personne » ou « Tarif sur demande »), durée selon [data-model.md](./data-model.md) (absente pour « Kribi au fil de l'eau »), minimum, mention indicative et phrase sur le prix final ; l'étape Mayi détaille ponts, phare et monument ; « Fleuve Lobé (inclus dans l'expérience Bagyeli) » ; 4 personnes puis « Ajouter à mon séjour » → ligne à 4 ; le lien « Personnaliser ce parcours » porte un message avec le parcours, 4 personnes et l'adresse ; la ligne de Mon séjour mène à la fiche ; sans JavaScript, le lien WhatsApp seul ; `tests/e2e/seo.spec.ts` passe avec les fiches (titre, description, plan du site)
- [ ] T019 [P] [US2] Créer `tests/component/tour-actions.test.tsx` (doit échouer) : sélecteur à la valeur par défaut ou aux voyageurs, bornes du parcours ; « Ajouter à mon séjour » → `add({ serviceId, quantities: [n], optionIds: [] })` ; le lien WhatsApp suit le nombre choisi ; aucune violation axe

### Implementation

- [ ] T020 [P] [US2] Parcours dans `src/content/services/` : `duration` FR et EN des six selon [data-model.md](./data-model.md) (aucune pour `au-fil-de-l-eau`) ; libellé de l'étape Mayi détaillé dans les parcours qui y passent ; étape « Fleuve Lobé (inclus dans l'expérience Bagyeli) » dans `nature-et-littoral`
- [ ] T021 [US2] Créer `src/features/selection/TourActions.tsx` conforme à T019 et [contracts/ui.md](./contracts/ui.md) (message par `buildTourRequestMessage`, `data-guide="add"` sur l'ajout)
- [ ] T022 [US2] Créer `src/components/packages/TourDetail.astro` et `src/pages/formules/[id].astro`, `src/pages/en/packages/[id].astro` (une page par parcours publié, métadonnées, fil d'Ariane, `TourActions` en `client:visible`, `<noscript>` WhatsApp) ; dans `TourCard.astro`, photo et titre vers la fiche (`tour-link`), bouton d'ajout libellé `stay.add` (plus « Personnaliser ce parcours », réservé à WhatsApp) ; adapter `tests/e2e/packages.spec.ts` (bouton d'ajout, adresse de la ligne vers la fiche) ; dans `src/lib/pageCatalog.ts`, adresse des lignes de parcours vers la fiche ; vérifier le plan du site
- [ ] T023 [US2] `npm run check`, `npm run build`, `npm run check:links` ; T018 et T019 passent

---

## Phase 5: User Story 3 — Un accueil plus vivant et complet (Priority: P2)

**Goal**: diaporama avec pause, appartement, aperçu Mobilité avec véhicules.

**Independent Test**: quickstart, scénarios 8 et 9.

### Tests

- [ ] T024 [P] [US3] Mettre à jour `tests/e2e/home.spec.ts` (doit échouer) : le hero contient 4 photos dont une seule visible, la première avec `fetchpriority="high"` ; le bouton `hero-pause` bascule `aria-pressed` et arrête le défilement ; sous `reducedMotion: 'reduce'`, la photo active ne change pas en 7 s ; sans JavaScript, seule la première photo est visible ; l'aperçu Hébergements compte 4 cartes dont « Appartement » ; l'aperçu Mobilité (`data-section="mobility"`) compte 3 cartes avec photo, modèles et « / jour », chacune vers `/mobilite#vehicule-…`, et reste après les sections Kibreeze (remplace le test « section TKS® sobre »)

### Implementation

- [ ] T025 [US3] `src/components/home/Hero.astro` : 4 photos empilées (première `eager` et `fetchpriority="high"`, autres `lazy`), bouton Pause / Lecture (`home.hero.pause`, `home.hero.play`) ; `src/scripts/hero-slideshow.ts` : photo suivante toutes les 6 s, fondu `--duration-slow`, arrêt sous réduire les animations, onglet caché et pause
- [ ] T026 [P] [US3] `src/content/site/home.json` : carte `appartement` (photo de T001) entre studio et villa ; `AccommodationTeaser.astro` lit son prix dans le palier le moins cher
- [ ] T027 [P] [US3] Créer `src/components/home/MobilityTeaser.astro` (gabarit de `AccommodationTeaser`, `getMobility()`, catégories avec `models`) et le substituer à `MobilityStrip.astro` dans `HomePage.astro` ; supprimer `MobilityStrip.astro`
- [ ] T028 [US3] `npm run check`, `npm run build` ; T024 passe ; Lighthouse de l'accueil : LCP comparé à `main` (SC-005)

---

## Phase 6: User Story 4 — Choisir ses dates dans un calendrier (Priority: P2)

**Goal**: Arrivée et Départ au calendrier, message en toutes lettres.

**Independent Test**: quickstart, scénario 10.

- [ ] T029 [P] [US4] Compléter `tests/component/selection-islands.test.tsx` et `tests/e2e/stay-page.spec.ts` (doivent échouer) : `StayPage` montre deux champs `type="date"` Arrivée et Départ, le `min` du départ suit l'arrivée ; saisir 2026-12-12 et 2026-12-16 → message « du 12 au 16 décembre 2026 » ; un séjour enregistré avec `dates: "12-16 déc."` garde ce texte dans le message ; le rappel « ajoutez vos dates » disparaît quand l'arrivée est choisie ; choisir les deux dates ne demande aucune saisie au clavier (deux champs calendrier, SC-004)
- [ ] T030 [US4] `src/features/selection/StayPage.tsx` : champs Arrivée et Départ (`setStay` avec `arrival` / `departure`), rappel fondé sur `arrival` ou l'ancien `dates`
- [ ] T031 [US4] `npm run check` ; T029 passe

---

## Phase 7: User Story 5 — Voir les photos en entier (Priority: P3)

**Goal**: cadrage par photo, photo en grand sur les fiches.

**Independent Test**: quickstart, scénarios 4 et 11.

- [ ] T032 [P] [US5] Compléter `tests/e2e/franck-feedback.spec.ts` (doit échouer) : la photo du pique-nique porte son `object-position` ; sur une fiche, toucher une photo ouvre `lightbox` avec l'image entière, fermée par le bouton, par Échap et par un clic hors de l'image, le focus revenant à la photo ; sans JavaScript, la photo est un lien vers l'image en grand
- [ ] T033 [US5] Appliquer `focus` en `object-position` dans `ExperienceCard`, `CompactCard`, `FeaturedCarousel`, `Gallery`, `TourCard`, `TourDetail`, `UniverseCard` et les aperçus de l'accueil ; relever le cadrage de la photo du pique-nique et le poser dans son fichier
- [ ] T034 [US5] `Gallery.astro` : chaque photo dans un lien vers l'image en grand ; `src/scripts/lightbox.ts` : ouverture dans un `<dialog>` (`lightbox.open`, `lightbox.close`), fermeture au clic hors de l'image, retour du focus
- [ ] T035 [US5] `npm run check`, `npm run build` ; T032 passe

---

## Phase 8: Polish & vérification

- [ ] T036 [P] `lighthouserc.json` : ajouter `/formules/essentiel-de-kribi.html`
- [ ] T037 [P] Documentation : `docs/client-answers.md` (retours des 11-12 octobre et compléments du 18, avec renvoi à la transcription) ; `docs/audio-transcript.md` (transcription des 14 notes vocales) ; `docs/functional-requirements.md` (plats en plats, fiches de parcours, calendrier, diaporama, aperçu Mobilité) ; `docs/content-tracker.md` (descriptions des plats reçues, Ebanjea, attentes du questionnaire 7) ; `specs/README.md` (statut 010)
- [ ] T038 [P] Cahier de test (branche `docs-cahier-de-test`, générateur `docs/tools/build-cahier-de-test.py`) : onglet « Retours déjà reçus » (chaque retour des 11-12 octobre : réglé, expliqué ou en attente) et scénarios mis à jour (plats, dates, fiches de parcours, diaporama, Mobilité de l'accueil)
- [ ] T039 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [ ] T040 Captures à 390 px (WebKit) et 1 440 px (Chromium) : plats, fiche de parcours, accueil (diaporama, aperçus), dates, photo en grand ; corriger les écarts ; consigner dans [quickstart.md](./quickstart.md)
- [ ] T041 Dérouler les 11 scénarios manuels de [quickstart.md](./quickstart.md) sur un vrai téléphone et relire l'anglais (Zobel)
- [ ] T042 Ouvrir la PR `010-retours-franck` → `main` (Zobel)

---

## Dépendances

```text
Setup (T001–T002) ─► Foundational (T003–T009) ─► US1 (T010–T017) ─► US2 (T018–T023) ─► US3 (T024–T028) ─► US4 (T029–T031) ─► US5 (T032–T035) ─► Polish
```

- Les stories ne dépendent que de la phase 2 ; elles suivent l'ordre de priorité. US5 (cadrage) touche des composants modifiés en US2 et US3 : elle vient après.
- Dans chaque story, les tests passent avant l'implémentation et doivent d'abord échouer.

## Exécution parallèle

- Setup : T001 et T002.
- Phase 2 : T003, T005, T007 en parallèle ; puis T004, T006, T008.
- US1 : T010 à T012 en parallèle ; T013 et T014 en parallèle ; puis T015, T016.
- US2 : T018 à T020 en parallèle ; puis T021 → T022.
- US3 : T024 ; puis T025 ; T026 et T027 en parallèle.
- Polish : T036, T037, T038 en parallèle.

## Stratégie

1. **MVP = phases 1 à 3** : les corrections de sens que Franck a relevées.
2. **US2** : les fiches de parcours, son offre phare.
3. **US3 à US5** : accueil, dates, photos.
