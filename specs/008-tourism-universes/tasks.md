---
description: "Liste de tâches — Les trois univers du Tourisme"
---

# Tasks: Les trois univers du Tourisme

**Input**: Documents de conception de `specs/008-tourism-universes/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III). Chaque fonction pure a son test écrit avant elle, qui doit d'abord échouer : `minimumParticipants` et `catalogIssues` couverts à 100 %. Les parcours sont couverts en Playwright.

**Organisation**: par user story, dans l'ordre de priorité. Révisée le 2026-10-11 après les réponses de Franck au questionnaire 4 et l'analyse de cohérence.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles de 002, 003 et 004 (aucun texte en dur, tokens, liens par `getRoutePath`, aucune règle métier dans un composant). En plus :

- les valeurs du catalogue (identifiants, prix, unités, dimensions, ordres, univers, photos) sont celles de [data-model.md](./data-model.md), sans écart ;
- les textes des fiches viennent de l'onglet 3 de `Elements/questions-kibreeze-franck-repondu (1).xlsx`, selon la règle de [research.md](./research.md) §12 : une phrase qui ne contient qu'une réserve (« … à confirmer ») n'est pas publiée ; aucune durée inventée ;
- toute photo d'ambiance porte un texte alternatif qui décrit ce qu'elle montre, jamais la prestation ; toute image générée est marquée `illustrative: true` ;
- aucune photo filigranée ([data-model.md](./data-model.md), « Exclues ») ;
- tout texte ajouté existe en français et en anglais ; l'anglais est traduit par IA et sera relu par Zobel (ADR-013) ;
- après chaque phase, `npm run check` et `npm run build` passent.

---

## Phase 1: Setup

- [X] T001 Préparer les photos de Franck : convertir `~/Downloads/Telegram Desktop/IMG_2058.HEIC` et `IMG_2060.HEIC` en JPEG avec `sips -s format jpeg` vers `Elements/tri-par-activite/feux-de-plage/` ; copier les photos du lot du 2026-10-11 listées dans la table « Photos par prestation » de [data-model.md](./data-model.md) depuis `Elements/Images ett vidéos du projet/nouvelles images/` vers le dossier de leur activité dans `Elements/tri-par-activite/` (créer `chaloupe/`, `bouee-tractee/`, `pique-nique/`, `seance-photo/`), sous leur nom d'origine ; ajouter chaque destination de la table à `src/assets/photos/sources.json`, plus `"categories/specialites-culinaires.jpg": "decouverte-de-kribi/L14-02.jpg"` ; lancer `npm run photos:import` ; vérifier à l'œil chaque fichier importé (aucun filigrane) ; noter les sources dans `src/assets/photos/README.md`
- [X] T002 [P] Générer les 11 illustrations avec l'outil d'images de Figma (`generate_image`), une par spécialité culinaire (identifiants du tableau Spécialités de [data-model.md](./data-model.md)) et une pour `croisiere-en-haute-mer` : photographie réaliste, lumière naturelle de fin d'après-midi, tons chauds de la direction artistique, cadrage 4:3, aucune personne identifiable, aucun texte ni logo ; les enregistrer en JPEG dans `src/assets/photos/illustrations/<id>.jpg` (2 400 px de large au plus) et noter chaque prompt dans `src/assets/photos/README.md`

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [X] T003 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) selon [contracts/content.md](./contracts/content.md) : `categorySchema` exige `description` et `urlSlug` `{ fr, en }` (`slug` est réservé par Astro), refuse un slug hors `/^[a-z0-9]+(-[a-z0-9]+)*$/`, accepte `withOptions` booléen facultatif, refuse tout champ inconnu ; `serviceSchema` accepte `degressive` booléen facultatif et `illustrative` booléen facultatif dans une image ; `catalogIssues` reçoit des univers `{ id, urlSlug }` et signale un `categoryId` inconnu (« ne correspond à aucun univers »), un identifiant de prestation égal à un slug d'univers dans l'une ou l'autre langue (« identifiant identique à l'adresse de l'univers « x » »), un slug d'univers en double dans une langue (« déjà utilisé par l'univers « x » ») ; fixtures renommées des catégories vers les univers (`visites`, `activites`)
- [X] T004 Modifier `src/content/schemas.ts` conformément à T003 et à [contracts/content.md](./contracts/content.md) ; garder la règle existante « categoryId est obligatoire pour une expérience » ; couverture 100 % de `catalogIssues`
- [X] T005 Adapter `scripts/check-content.ts` : passer à `catalogIssues` les univers lus dans `src/content/categories/` avec leurs slugs ; libellés en « univers »
- [X] T006 Remplacer les catégories par les univers dans `src/content/categories/` : supprimer `nature-decouverte.json`, `aventure.json`, `detente.json` ; créer `visites.json`, `activites.json`, `specialites-culinaires.json` avec nom, phrase, slug, ordre et `withOptions` du tableau d'univers de [data-model.md](./data-model.md) ; images : `../../assets/photos/experiences/chutes-de-la-lobe.jpg`, `../../assets/photos/experiences/jet-ski.jpg`, `../../assets/photos/categories/specialites-culinaires.jpg`, textes alternatifs FR et EN décrivant la photo
- [X] T007 Rattacher les 13 prestations existantes à leur univers dans `src/content/services/*.json` (`categoryId` et `order` des tableaux Visites et Activités de [data-model.md](./data-model.md) ; `croisiere-en-bateau` et `bateau-de-plaisance` dans `activites` en attendant T027) ; supprimer `src/assets/photos/categories/{aventure,detente,nature-decouverte}.jpg` s'ils ne sont plus référencés, et leurs lignes de `sources.json`
- [X] T008 Ajouter à `src/lib/catalog.ts` `getUniverseExperiences(id)` (prestations publiées de l'univers, tri par ordre puis nom) et `getOptionsFor(service)` (options publiées, ou liste vide si l'univers de la prestation a `withOptions: false`)
- [X] T009 [P] Chaînes d'interface dans `src/i18n/fr.ts` et `src/i18n/en.ts` selon [contracts/ui.md](./contracts/ui.md) : ajouter `experiences.universesTitle`, `experiences.seeCatalogue`, `experiences.universeNav`, `experiences.universeMetaTitle`, `experiences.illustrative`, `price.minimum`, `price.minimumShort`, `price.degressive` ; passer `nav.experiences` et `experiences.title` à « Tourisme » / « Tourism » (U1) ; réécrire `experiences.description` sans aucune prestation retirée (texte du contrat)
- [X] T010 Vérifier : `npm run check` et `npm run build` passent ; les pages existantes se construisent avec les univers (la page de l'onglet garde provisoirement ses onglets de filtre, qui affichent désormais les univers)

**Checkpoint**: le contenu est rangé en univers, le contrôle au build les connaît, l'onglet s'appelle « Tourisme ».

---

## Phase 3: User Story 1 — Choisir son univers (Priority: P1) 🎯 MVP

**Goal**: page d'entrée à trois univers, une page par univers, navigation entre univers, fiches et accueil reliés aux univers.

**Independent Test**: depuis l'accueil et l'onglet Tourisme, atteindre chaque univers, vérifier qu'il ne liste que ses prestations, passer d'un univers à l'autre sans revenir à la page d'entrée (quickstart, scénarios 1 à 7).

### Tests

- [X] T011 [P] [US1] Réécrire `tests/e2e/experiences.spec.ts` (doit échouer), FR et EN : onglet « Tourisme » / « Tourism » ; page d'entrée avec le titre « Découvrez Kribi selon vos envies » / « Discover Kribi your way », une `universe-card` par univers ayant au moins une prestation publiée, dans l'ordre, aucune `experience-card` ; une carte montre nom, phrase, trois exemples, nombre et « Voir le catalogue », et mène à la page de l'univers ; une page d'univers ne contient que des cartes de son univers (comparer aux identifiants de [data-model.md](./data-model.md)) ; `universe-nav` porte un lien par univers dont un `aria-current="page"`, et chacun mène à son univers ; l'adresse d'un univers ouverte directement affiche cet univers ; le sélecteur de langue mène au slug traduit (`/experiences/activites` ↔ `/en/experiences/activities`) ; `/experiences#aventure` affiche la page d'entrée ; le plan du site contient la page d'entrée et chaque page d'univers dans les deux langues ; sans JavaScript, chaque univers est atteignable par lien ; pas de défilement horizontal à 320 px. Supprimer les tests d'onglets de filtre
- [X] T012 [P] [US1] Mettre à jour `tests/e2e/home.spec.ts` (cartes d'univers : nombre affiché, lien vers la page de l'univers sans ancre), `tests/e2e/experience-detail.spec.ts` (fil d'Ariane « Tourisme › Visites & Découvertes › Chutes de la Lobé », l'univers menant à sa page ; badge d'univers), les tests qui cherchent le lien « Expériences » dans `tests/e2e/` (devenu « Tourisme »), `tests/component/experience-card.test.ts` et `tests/unit/related-experiences.test.ts` (fixtures en univers)

### Implementation

- [X] T013 [US1] Créer `src/components/experiences/UniverseCard.astro` selon [contracts/ui.md](./contracts/ui.md) (photo à ratio fixe, nom `h3`, phrase, trois exemples séparés par « · », nombre `experiences.count`, « Voir le catalogue » ; un seul lien couvrant la carte, nom accessible = nom de l'univers ; `data-testid="universe-card"`) ; refondre `src/components/experiences/ExperiencesPage.astro` en page d'entrée (bandeau recadré en 16:9 inchangé, titre « Tourisme », `h2` `experiences.universesTitle`, une carte par univers de **`categoriesWithExperiences()`**, une colonne puis trois à partir de `lg`, bloc « Une envie particulière ? ») ; supprimer `src/components/experiences/CategoryTabs.astro`, son style généré et son script
- [X] T014 [P] [US1] Créer `src/components/experiences/UniverseNav.astro` : `<nav>` nommé `experiences.universeNav`, un lien par univers de `categoriesWithExperiences()`, courant avec `aria-current="page"` et le style de l'onglet actif de la 003 (couleur `brand`, gras, soulignement de 3 px), collé sous la barre du haut (`top-(--size-header)`, `lg:top-(--size-header-desktop)`, `z-index: var(--z-tabbar)`), défilement horizontal si nécessaire ; `data-testid="universe-nav"`
- [X] T015 [US1] Créer `src/components/experiences/UniversePage.astro` selon [contracts/ui.md](./contracts/ui.md) : fil d'Ariane (« Tourisme » vers la page d'entrée › univers en `aria-current="page"`), bandeau (photo de l'univers en `fit="cover"` 16:9, `loading="eager"`, `fetchpriority="high"`, nom en `h1`, phrase), `UniverseNav`, ligne « N expériences » et « tarifs indicatifs », grille de `ExperienceCard` (`sm:grid-cols-2 lg:grid-cols-3`), bloc « Une envie particulière ? » ; métadonnées `experiences.universeMetaTitle`, description = phrase, image de partage = photo de l'univers, `alternatePaths` vers le slug de l'autre langue
- [X] T016 [US1] Générer les pages d'univers dans `src/pages/experiences/[slug].astro` et `src/pages/en/experiences/[slug].astro` : `getStaticPaths` renvoie les fiches (inchangées) et un chemin par univers de `categoriesWithExperiences()` avec le slug de la langue, distingués par une prop `kind` ; rendu `ExperienceDetail` ou `UniversePage`
- [X] T017 [US1] Dans `src/components/experiences/ExperienceDetail.astro` : le premier élément du fil d'Ariane s'appuie sur `experiences.title` (« Tourisme ») ; le deuxième mène à la page de l'univers (slug de la langue) au lieu de `#<id>` ; le badge affiche le nom de l'univers
- [X] T018 [US1] Dans `src/components/home/CategoryCards.astro` (et `src/components/home/HomePage.astro` si nécessaire) : parcourir **`categoriesWithExperiences()`** au lieu de `getCategories()` ; chaque carte mène à la page de son univers par `getRoutePath('experiences', locale)` + `/` + slug de la langue, sans `hash`
- [X] T019 [US1] Retirer de `src/i18n/fr.ts` et `src/i18n/en.ts` `experiences.tabsLabel`, `experiences.all` et les autres chaînes des onglets de filtre devenues inutiles ; `npm run check:i18n -- --production`, `npm run check`, `npm run build`, `npm run check:links` ; T011 et T012 passent

**Checkpoint**: US1 livrable seule, avec les 13 prestations actuelles réparties en deux univers ; le culinaire, vide, n'a ni page ni carte, et aucun lien n'y mène.

---

## Phase 4: User Story 2 — Découvrir les nouvelles prestations (Priority: P2)

**Goal**: les 32 prestations du cahier, chacune dans son univers, avec les textes et les photos de Franck, ajoutables à Mon séjour.

**Independent Test**: ouvrir chaque nouvelle fiche dans les deux langues, comparer son prix au cahier, l'ajouter à Mon séjour, envoyer un séjour qui mélange les trois univers (quickstart, scénarios 8, 10 à 13, 15 à 17).

### Tests

- [X] T020 [P] [US2] Créer `tests/e2e/universe-catalogue.spec.ts` (doit échouer) : 9 visites, 13 activités, 10 spécialités ; la fiche Village Mayi cite pont de l'Esclavage, pont des Enclaves, phare et monument dans « Ce qui est inclus » ; jet-ski « 10 000 FCFA » par session et « Une personne par engin » ; chaque spécialité est « Sur demande », sans montant ni euro, sans encadré d'options, avec l'étiquette « Photo illustrative » ; la carte du bateau de croisière porte la même étiquette ; la pirogue propose guide et maître-nageur, pas de musée ; aucune fiche n'affiche une rubrique réduite à « à confirmer » ; feu de plage pour 12 personnes → ligne « sur devis » ; bateau de croisière 2 heures → 300 000 FCFA ; Mayi + quad + langouste dans Mon séjour donnent 3 lignes, un total sans la langouste et « + 1 prestation sur devis », et un message WhatsApp qui nomme les trois ; un séjour enregistré avec `croisiere-en-bateau`, ou avec la pirogue et l'option `musee-d-art`, est corrigé au chargement avec le message de la 004 ; l'accueil montre quatre expériences mises en avant dont le jet-ski
- [X] T021 [P] [US2] Écrire `tests/unit/redirects.test.ts` (doit échouer) : `public/_redirects` contient les quatre lignes de [contracts/routes.md](./contracts/routes.md) ; chaque source correspond à une prestation désactivée et chaque cible à une prestation publiée du catalogue (lecture de `src/content/services/`)
- [X] T022 [P] [US2] Rechercher dans `tests/` les références à `croisiere-en-bateau`, `bateau-de-plaisance`, `musee-d-art` et au jet-ski « sur devis », et les remplacer par des prestations ou options publiées équivalentes

### Implementation

- [X] T023 [P] [US2] Créer les 7 nouvelles visites dans `src/content/services/` (`village-mayi`, `village-ebodje`, `port-autonome-de-kribi`, `hotel-golden-k`, `plage-de-batanga`, `musee-batanga`, `debarcadere-de-mboa-manga`) : `section: "experience"`, `categoryId: "visites"`, ordre, prix, unité, quantité et `degressive` du tableau Visites de [data-model.md](./data-model.md) ; `shortDescription` (160 caractères au plus par langue) et `description` d'après la phrase de Franck ; `location`, `conditions.included`, `conditions.excluded`, `conditions.notes` d'après ses réponses, selon la règle §12 ; `conditions.included` du Village Mayi : pont de l'Esclavage, pont des Enclaves, phare, monument ; images de la table « Photos par prestation »
- [X] T024 [P] [US2] Créer les 4 nouvelles activités (`croisiere-en-haute-mer`, `seance-photo`, `pique-nique-bivouac`, `bouee-tractee`) selon le tableau Activités et la table des photos de [data-model.md](./data-model.md), `categoryId: "activites"`, textes de Franck selon §12 ; `bouee-tractee` : « Une personne par engin » dans `conditions.notes` ; `croisiere-en-haute-mer` : image `illustrations/croisiere-en-haute-mer.jpg` avec `illustrative: true`
- [X] T025 [P] [US2] Créer les 10 spécialités culinaires : `categoryId: "specialites-culinaires"`, `pricing: { "kind": "quote" }`, quantité `persons` 1–30, défaut 2, ordre du tableau ; textes de Franck selon §12 (sans la mention « Photo illustrative », portée par l'image) ; image `../../assets/photos/illustrations/<id>.jpg` avec `illustrative: true` et un texte alternatif qui décrit le plat montré
- [X] T026 [US2] Modifier les prestations existantes : `jet-ski.json` → `pricing: { kind: "fixed", amount: 10000, unit: "per_session" }`, dimension `units` « sessions » 1–10, défaut 1, `featured: true`, galerie complétée ; `quad.json` → galerie complétée ; quad et jet-ski : « Une personne par engin » dans `conditions.notes` ; `feu-de-plage.json` → `maxCapacity: 10`, dimension `persons` 1–30, défaut 2, titre « Feu de camp ou feu de plage », les deux photos HEIC converties remplacent l'image Stitch en seconde position, après la photo de Franck déjà publiée (PR n°5) ; `excursion-en-chaloupe.json` → photos de Franck à la place de l'image Stitch ; `campement-bagyeli.json` → titre « Village Bagyeli » / « Bagyeli Village », `conditions.included` : fleuve Lobé, campement, pont Lobé (prix : T033) ; pour les 13, ajouter lieu, inclus, non inclus et « à savoir » de Franck selon §12, sans toucher aux descriptions publiées ; supprimer de `src/assets/photos/stitch/` les images qui ne sont plus référencées
- [X] T027 [US2] Retirer `croisiere-en-bateau`, `bateau-de-plaisance` (`availability: "disabled"`, `featured` retiré) et l'option `musee-d-art` (`availability: "disabled"`) ; créer `public/_redirects` avec les quatre lignes de [contracts/routes.md](./contracts/routes.md)
- [X] T028 [US2] Étiquette « Photo illustrative » (`experiences.illustrative`) dans `src/components/experiences/ExperienceCard.astro`, `CompactCard.astro` et `Gallery.astro` quand l'image affichée a `illustrative: true`, selon [contracts/ui.md](./contracts/ui.md) ; testé en bout en bout dans `tests/e2e/universe-catalogue.spec.ts` (les tests de composants rendent les cartes sans photo, faute de service d'images hors construction)
- [X] T029 [US2] Options par univers dans `src/components/experiences/ExperienceDetail.astro` : utiliser `getOptionsFor(service)` pour les deux configurateurs et l'encadré `noscript` ; liste vide → ni options dans le configurateur, ni `OptionsList`
- [X] T030 [US2] `npm run check:content`, `npm run build:prod` (traductions complètes), `npm run check:links` ; T020 à T022 passent

**Checkpoint**: le catalogue du cahier est en ligne avec les textes et les photos de Franck ; seules les mentions de prix de groupe manquent.

---

## Phase 5: User Story 3 — Comprendre un prix de groupe (Priority: P3)

**Goal**: minimum de participants et tarif dégressif affichés et respectés.

**Independent Test**: sur les fiches Village Bagyeli et Village Mayi, vérifier les mentions, le plancher du sélecteur et le total dans Mon séjour (quickstart, scénario 9).

### Tests

- [X] T031 [P] [US3] Écrire `tests/unit/minimum-participants.test.ts` (doit échouer), couverture 100 % : dimension `persons` de `min` 2 → 2 ; `min` 1 → `undefined` ; aucune dimension `persons` (units, hours, aucune) → `undefined`
- [X] T032 [P] [US3] Tests : `tests/component/experience-card.test.ts` (pastille « Min. 2 pers. » quand le minimum est défini, absente sinon) ; `tests/e2e/experience-detail.spec.ts` (fiche Village Bagyeli : « À partir de 15 000 FCFA », « Minimum 2 personnes », mention dégressive ; fiche Chutes : aucune des deux ; le test « trois tarifs » du campement est supprimé) ; `tests/e2e/add-to-stay.spec.ts` (remplacer « tarif couple » par : Village Bagyeli, bouton « Diminuer » désactivé à 2, ajout → ligne « 2 personnes », 30 000 FCFA, total « estimatif ») ; `tests/e2e/stay-page.spec.ts` (sélecteur du Village Bagyeli dans Mon séjour : « Diminuer » désactivé à 2 ; séjour enregistré avec `campement-bagyeli` au tarif `couple` → ligne retirée, message de la 004)

### Implementation

- [X] T033 [US3] `src/content/services/campement-bagyeli.json` : supprimer `tiers` ; `pricing: { kind: "from", amount: 15000, unit: "per_person" }` ; quantité `persons` `min` 2, `max` 20, `default` 2 ; `degressive: true`
- [X] T034 [US3] Créer `src/features/catalog/minimumParticipants.ts` conforme à T031 et à [contracts/content.md](./contracts/content.md), pur, sans import d'Astro
- [X] T035 [US3] `src/components/experiences/PriceBlock.astro` : sous la pastille de capacité, pastille `accent-soft` « Minimum N personnes » (`price.minimum`) quand `minimumParticipants` est défini, et la phrase `price.degressive` (`text-xs text-fg-muted`) quand `degressive`
- [X] T036 [US3] `src/components/experiences/ExperienceCard.astro` : pastille « Min. N pers. » (`price.minimumShort`) sur la photo, à côté de « N personnes max », quand `minimumParticipants` est défini
- [X] T037 [US3] `npm run check` (couverture 100 % de `minimumParticipants`) ; T031 et T032 passent

**Checkpoint**: les trois stories sont livrées.

---

## Phase 6: Polish & vérification

- [X] T038 [P] Ajouter `/experiences/visites.html` et `/experiences/village-mayi.html` à `lighthouserc.json`
- [X] T039 [P] Documentation : `docs/functional-requirements.md` (FR-CAT-2 : univers et page d'entrée au lieu des onglets de filtre ; FR-CAT-6 : bloc sur la page d'entrée et les pages d'univers) ; `docs/data-model.md` (univers, catalogue de 32 prestations, images illustratives, renvoi vers [data-model.md](./data-model.md)) ; `docs/client-answers.md` (section « Cahier actualisé d'octobre 2026 et questionnaire 4 » : trois univers, catalogue, règles de prix, réponses U1 à U6 et Q1 à Q5) ; `docs/content-tracker.md` (photos encore attendues : Ebodjé, Port Autonome, Golden K, Musée Batanga, bateau de croisière, plats ; second angle du pont des Esclaves introuvable) ; `specs/README.md` (statut de la 008)
- [X] T040 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [X] T041 Comparer, captures à 390 px (2x) et 1 440 px, la page d'entrée et une page d'univers aux illustrations du cahier (pages 2 et 4) et au style des écrans 02a et 02b ; corriger les écarts non justifiés et les consigner dans [quickstart.md](./quickstart.md)
- [ ] T042 Dérouler les 17 scénarios manuels de [quickstart.md](./quickstart.md), dont la redirection sur l'aperçu Cloudflare, et relire les textes anglais des nouvelles prestations (Zobel)
- [ ] T043 Ouvrir la PR `008-tourism-universes` → `main`, après le merge de la 004 et un rebase (Zobel)

---

## Dépendances

```text
Setup (T001–T002) ─► Foundational (T003–T010) ─► US1 (T011–T019) ─► US2 (T020–T030) ─► US3 (T031–T037) ─► Polish
```

- T002 (illustrations) n'est requis qu'à partir de T024 et T025 ; il peut avancer en parallèle de tout le reste.
- US1 ne dépend que de la phase 2. US2 a besoin des pages d'univers de US1 pour ses tests de comptage, mais ses fichiers de contenu (T023 à T027) peuvent s'écrire en parallèle de US1.
- US3 dépend de US2 seulement pour la fiche Village Mayi ; le Village Bagyeli existe déjà.
- Dans chaque story, les tests passent avant l'implémentation et doivent d'abord échouer.

## Exécution parallèle

- Setup : T001 et T002 en parallèle.
- Phase 2 : T003 et T009 en parallèle ; T004 → T005 → T006 → T007 → T008 en série (le build doit rester vert).
- US1 : T011, T012 et T014 en parallèle ; puis T013, T015, T016, T017, T018.
- US2 : T020 à T025 en parallèle (fichiers distincts) ; puis T026 à T029.
- US3 : T031 et T032 en parallèle ; puis T033 à T036.
- Polish : T038 et T039 en parallèle.

## Stratégie

1. **MVP = phases 1 à 3** : les univers existent, l'onglet s'appelle « Tourisme », la page d'entrée remplace la liste mélangée, sur le contenu actuel. C'est déjà la demande centrale de Franck.
2. **US2** remplit les univers avec les textes et les photos de Franck : c'est la plus grosse part du travail (21 fiches × 2 langues, 13 fiches enrichies, ~25 photos, 11 illustrations).
3. **US3** ajoute les mentions de prix de groupe.
