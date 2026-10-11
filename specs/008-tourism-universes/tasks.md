---

description: "Liste de tâches — Les trois univers du Tourisme"
---

# Tasks: Les trois univers du Tourisme

**Input**: Documents de conception de `specs/008-tourism-universes/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III). Chaque fonction pure a son test écrit avant elle, qui doit d'abord échouer : `minimumParticipants` et `catalogIssues` couverts à 100 %. Les parcours sont couverts en Playwright.

**Organisation**: par user story, dans l'ordre de priorité.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles de 002, 003 et 004 (aucun texte en dur, tokens, liens par `getRoutePath`, aucune règle métier dans un composant). En plus :

- les valeurs du catalogue (identifiants, prix, unités, dimensions, ordres, univers) sont celles de [data-model.md](./data-model.md), sans écart ;
- aucune durée, aucun lieu, aucun « inclus » inventé : seuls Village Mayi et Village Bagyeli ont des lieux inclus, donnés par le cahier ;
- toute photo de remplacement porte un texte alternatif qui décrit ce qu'elle montre (le paysage, l'étal), jamais la prestation ;
- tout texte ajouté existe en français et en anglais ; l'anglais est traduit par IA et sera relu par Zobel (ADR-013) ;
- après chaque phase, `npm run check` et `npm run build` passent.

---

## Phase 1: Setup

- [ ] T001 Importer la photo de l'étal de poissons : ajouter `"categories/specialites-culinaires.jpg": "decouverte-de-kribi/L14-02.jpg"` à `src/assets/photos/sources.json`, lancer `npm run photos:import`, vérifier l'absence de filigrane, et noter la source dans `src/assets/photos/README.md`

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [ ] T002 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) selon [contracts/content.md](./contracts/content.md) : `categorySchema` exige `description` et `slug` `{ fr, en }`, refuse un slug hors `/^[a-z0-9]+(-[a-z0-9]+)*$/`, accepte `withOptions` booléen facultatif, refuse tout champ inconnu ; `serviceSchema` accepte `degressive` booléen facultatif ; `catalogIssues` reçoit des univers `{ id, slug }` et signale un `categoryId` inconnu (« ne correspond à aucun univers »), un identifiant de prestation égal à un slug d'univers dans l'une ou l'autre langue (« identifiant identique à l'adresse de l'univers « x » »), un slug d'univers en double dans une langue (« déjà utilisé par l'univers « x » ») ; fixtures renommées des catégories vers les univers (`visites`, `activites`)
- [ ] T003 Modifier `src/content/schemas.ts` conformément à T002 et à [contracts/content.md](./contracts/content.md) ; garder la règle existante « categoryId est obligatoire pour une expérience » ; couverture 100 % de `catalogIssues`
- [ ] T004 Adapter `scripts/check-content.ts` : passer à `catalogIssues` les univers lus dans `src/content/categories/` avec leurs slugs ; libellés en « univers »
- [ ] T005 Remplacer les catégories par les univers dans `src/content/categories/` : supprimer `nature-decouverte.json`, `aventure.json`, `detente.json` ; créer `visites.json`, `activites.json`, `specialites-culinaires.json` avec nom, phrase, slug, ordre et `withOptions` du tableau d'univers de [data-model.md](./data-model.md) ; images : `../../assets/photos/experiences/chutes-de-la-lobe.jpg`, `../../assets/photos/experiences/jet-ski.jpg`, `../../assets/photos/categories/specialites-culinaires.jpg`, textes alternatifs FR et EN décrivant la photo
- [ ] T006 Rattacher les 13 prestations existantes à leur univers dans `src/content/services/*.json` (`categoryId` et `order` des tableaux Visites et Activités de [data-model.md](./data-model.md) ; `croisiere-en-bateau` et `bateau-de-plaisance` dans `activites` en attendant T024) ; supprimer `src/assets/photos/categories/{aventure,detente,nature-decouverte}.jpg` s'ils ne sont plus référencés, et leurs lignes de `sources.json`
- [ ] T007 Ajouter à `src/lib/catalog.ts` `getUniverseExperiences(id)` (prestations publiées de l'univers, tri par ordre puis nom) et `getOptionsFor(service)` (options publiées, ou liste vide si l'univers de la prestation a `withOptions: false`)
- [ ] T008 [P] Chaînes d'interface dans `src/i18n/fr.ts` et `src/i18n/en.ts` : ajouter `experiences.universesTitle`, `experiences.seeCatalogue`, `experiences.universeNav`, `experiences.universeMetaTitle`, `price.minimum`, `price.minimumShort`, `price.degressive` avec les textes de [contracts/ui.md](./contracts/ui.md) ; retirer `experiences.tabsLabel`, `experiences.all` et toute autre chaîne propre aux onglets de filtre une fois T012 fait
- [ ] T009 Vérifier : `npm run check` et `npm run build` passent ; les pages existantes se construisent avec les univers (la page Expériences garde provisoirement ses onglets, qui affichent désormais les univers)

**Checkpoint**: le contenu est rangé en univers, le contrôle au build les connaît.

---

## Phase 3: User Story 1 — Choisir son univers (Priority: P1) 🎯 MVP

**Goal**: page d'entrée à trois univers, une page par univers, navigation entre univers, fiches et accueil reliés aux univers.

**Independent Test**: depuis l'accueil et l'onglet Expériences, atteindre chaque univers, vérifier qu'il ne liste que ses prestations, passer d'un univers à l'autre sans revenir à la page d'entrée (quickstart, scénarios 1 à 7).

### Tests

- [ ] T010 [P] [US1] Réécrire `tests/e2e/experiences.spec.ts` (doit échouer), FR et EN : page d'entrée avec le titre « Découvrez Kribi selon vos envies » / « Discover Kribi your way », trois `universe-card` dans l'ordre, aucune `experience-card` ; une carte montre nom, phrase, trois exemples, nombre et « Voir le catalogue », et mène à la page de l'univers ; une page d'univers ne contient que des cartes de son univers (comparer aux identifiants de [data-model.md](./data-model.md)) ; `universe-nav` porte trois liens dont un `aria-current="page"`, et chacun mène à son univers ; l'adresse d'un univers ouverte directement affiche cet univers ; le sélecteur de langue mène au slug traduit (`/experiences/activites` ↔ `/en/experiences/activities`) ; `/experiences#aventure` affiche la page d'entrée ; sans JavaScript, chaque univers est atteignable par lien ; pas de défilement horizontal à 320 px. Supprimer les tests d'onglets de filtre
- [ ] T011 [P] [US1] Mettre à jour `tests/e2e/home.spec.ts` (cartes d'univers : trois, nombre affiché, lien vers la page de l'univers sans ancre), `tests/e2e/experience-detail.spec.ts` (fil d'Ariane « Expériences › Visites & Découvertes › Chutes de la Lobé », l'univers menant à sa page ; badge d'univers), `tests/component/experience-card.test.ts` et `tests/unit/related-experiences.test.ts` (fixtures en univers)

### Implementation

- [ ] T012 [US1] Créer `src/components/experiences/UniverseCard.astro` selon [contracts/ui.md](./contracts/ui.md) (photo à ratio fixe, nom `h3`, phrase, trois exemples séparés par « · », nombre `experiences.count`, « Voir le catalogue » ; un seul lien couvrant la carte, nom accessible = nom de l'univers ; `data-testid="universe-card"`) ; refondre `src/components/experiences/ExperiencesPage.astro` en page d'entrée (bandeau recadré en 16:9 inchangé, `h2` `experiences.universesTitle`, cartes d'univers une colonne puis trois à partir de `lg`, bloc « Une envie particulière ? ») ; supprimer `src/components/experiences/CategoryTabs.astro`, son style généré et son script
- [ ] T013 [P] [US1] Créer `src/components/experiences/UniverseNav.astro` : `<nav>` nommé `experiences.universeNav`, trois liens dans l'ordre des univers, courant avec `aria-current="page"` et le style de l'onglet actif de la 003 (couleur `brand`, gras, soulignement de 3 px), collé sous la barre du haut (`top-(--size-header)`, `lg:top-(--size-header-desktop)`, `z-index: var(--z-tabbar)`), défilement horizontal si nécessaire ; `data-testid="universe-nav"`
- [ ] T014 [US1] Créer `src/components/experiences/UniversePage.astro` selon [contracts/ui.md](./contracts/ui.md) : fil d'Ariane (« Expériences » vers la page d'entrée › univers en `aria-current="page"`), bandeau (photo de l'univers en `fit="cover"` 16:9, `loading="eager"`, `fetchpriority="high"`, nom en `h1`, phrase), `UniverseNav`, ligne « N expériences » et « tarifs indicatifs », grille de `ExperienceCard` (`sm:grid-cols-2 lg:grid-cols-3`), bloc « Une envie particulière ? » ; métadonnées `experiences.universeMetaTitle`, description = phrase, image de partage = photo de l'univers, `alternatePaths` vers le slug de l'autre langue
- [ ] T015 [US1] Générer les pages d'univers dans `src/pages/experiences/[slug].astro` et `src/pages/en/experiences/[slug].astro` : `getStaticPaths` renvoie les fiches (inchangées) et un chemin par univers de `categoriesWithExperiences()` avec le slug de la langue, distingués par une prop `kind` ; rendu `ExperienceDetail` ou `UniversePage`
- [ ] T016 [US1] Dans `src/components/experiences/ExperienceDetail.astro` : le deuxième élément du fil d'Ariane mène à la page de l'univers (slug de la langue) au lieu de `#<id>` ; le badge affiche le nom de l'univers
- [ ] T017 [US1] Dans `src/components/home/CategoryCards.astro` (et `src/components/home/HomePage.astro` si nécessaire) : chaque carte mène à la page de son univers par `getRoutePath('experiences', locale)` + `/` + slug de la langue, sans `hash`
- [ ] T018 [US1] Retirer les chaînes d'onglets devenues inutiles (fin de T008) ; `npm run check:i18n -- --production`, `npm run check`, `npm run build`, `npm run check:links` ; T010 et T011 passent

**Checkpoint**: US1 livrable seule, avec les 13 prestations actuelles réparties en deux univers ; le culinaire, vide, n'a ni page ni carte.

---

## Phase 4: User Story 2 — Découvrir les nouvelles prestations (Priority: P2)

**Goal**: les 32 prestations du cahier, chacune dans son univers, ajoutables à Mon séjour.

**Independent Test**: ouvrir chaque nouvelle fiche dans les deux langues, comparer son prix au cahier, l'ajouter à Mon séjour, envoyer un séjour qui mélange les trois univers (quickstart, scénarios 8, 10 à 13).

### Tests

- [ ] T019 [P] [US2] Créer `tests/e2e/universe-catalogue.spec.ts` (doit échouer) : 9 visites, 13 activités, 10 spécialités ; la fiche Village Mayi cite pont de l'Esclavage, pont des Enclaves, phare et monument dans « Ce qui est inclus » ; jet-ski « 10 000 FCFA » par session ; chaque spécialité est « Sur demande », sans montant ni euro, sans encadré d'options ; une visite propose les trois options ; Mayi + quad + langouste dans Mon séjour donnent 3 lignes, un total sans la langouste et « + 1 prestation sur devis », et un message WhatsApp qui nomme les trois ; `/experiences/croisiere-en-bateau` renvoie la page d'erreur ; un séjour enregistré avec `croisiere-en-bateau` est purgé au chargement avec le message de la 004 ; l'accueil montre quatre expériences mises en avant dont le jet-ski
- [ ] T020 [P] [US2] Rechercher dans `tests/` les références à `croisiere-en-bateau`, `bateau-de-plaisance` et au jet-ski « sur devis », et les remplacer par des prestations publiées équivalentes

### Implementation

- [ ] T021 [P] [US2] Créer les 7 nouvelles visites dans `src/content/services/` (`village-mayi`, `village-ebodje`, `port-autonome-de-kribi`, `hotel-golden-k`, `plage-de-batanga`, `musee-batanga`, `debarcadere-de-mboa-manga`) : `section: "experience"`, `categoryId: "visites"`, ordre, prix, unité, quantité et `degressive` du tableau Visites de [data-model.md](./data-model.md) ; `title`, `shortDescription` (160 caractères au plus par langue) et `description` en FR et EN tirés du cahier ; `conditions.included` du Village Mayi : pont de l'Esclavage, pont des Enclaves, phare, monument ; image `../../assets/photos/sections/kribi-vue-aerienne.jpg` avec texte alternatif « Vue aérienne de la côte de Kribi » / « Aerial view of the Kribi coast »
- [ ] T022 [P] [US2] Créer les 4 nouvelles activités (`croisiere-en-haute-mer`, `seance-photo`, `pique-nique-bivouac`, `bouee-tractee`) selon le tableau Activités de [data-model.md](./data-model.md), `categoryId: "activites"` ; image `../../assets/photos/hero/plage-coucher-de-soleil.jpg`, texte alternatif « Plage de Kribi au coucher du soleil » / « Kribi beach at sunset »
- [ ] T023 [P] [US2] Créer les 10 spécialités culinaires (`poisson-braise`, `gambas`, `crevettes`, `crabe`, `langouste`, `maban`, `noix-de-coco`, `grillades-de-plage`, `degustation-fruits-de-mer`, `repas-local`) : `categoryId: "specialites-culinaires"`, `pricing: { "kind": "quote" }`, quantité `persons` 1–30, défaut 2, ordre du tableau ; image `../../assets/photos/categories/specialites-culinaires.jpg`, texte alternatif « Étal de poissons frais » / « A stall of fresh fish »
- [ ] T024 [US2] Modifier les prestations existantes : `jet-ski.json` → `pricing: { kind: "fixed", amount: 10000, unit: "per_session" }`, dimension `units` « sessions » 1–10, défaut 1, `featured: true` ; `feu-de-plage.json` → `maxCapacity: 10`, dimension `persons` 1–30, défaut 2, titre « Feu de camp ou feu de plage » ; `croisiere-en-bateau.json` et `bateau-de-plaisance.json` → `availability: "disabled"`, `featured` retiré ; `campement-bagyeli.json` → titre « Village Bagyeli » / « Bagyeli Village », `conditions.included` : fleuve Lobé, campement, pont Lobé (prix : T029)
- [ ] T025 [US2] Options par univers dans `src/components/experiences/ExperienceDetail.astro` : utiliser `getOptionsFor(service)` pour les deux configurateurs et l'encadré `noscript` ; liste vide → ni options dans le configurateur, ni `OptionsList`
- [ ] T026 [US2] `npm run check:content`, `npm run build:prod` (traductions complètes), `npm run check:links` ; T019 et T020 passent

**Checkpoint**: le catalogue du cahier est en ligne ; seules les mentions de prix de groupe manquent.

---

## Phase 5: User Story 3 — Comprendre un prix de groupe (Priority: P3)

**Goal**: minimum de participants et tarif dégressif affichés et respectés.

**Independent Test**: sur les fiches Village Bagyeli et Village Mayi, vérifier les mentions, le plancher du sélecteur et le total dans Mon séjour (quickstart, scénario 9).

### Tests

- [ ] T027 [P] [US3] Écrire `tests/unit/minimum-participants.test.ts` (doit échouer), couverture 100 % : dimension `persons` de `min` 2 → 2 ; `min` 1 → `undefined` ; aucune dimension `persons` (units, hours, aucune) → `undefined`
- [ ] T028 [P] [US3] Tests : `tests/component/experience-card.test.ts` (pastille « Min. 2 pers. » quand le minimum est défini, absente sinon) ; `tests/e2e/experience-detail.spec.ts` (fiche Village Bagyeli : « À partir de 15 000 FCFA », « Minimum 2 personnes », mention dégressive ; fiche Chutes : aucune des deux ; le test « trois tarifs » du campement est supprimé) ; `tests/e2e/add-to-stay.spec.ts` (remplacer « tarif couple » par : Village Bagyeli, bouton « Diminuer » désactivé à 2, ajout → ligne « 2 personnes », 30 000 FCFA, total « estimatif ») ; `tests/e2e/stay-page.spec.ts` (séjour enregistré avec `campement-bagyeli` au tarif `couple` → ligne retirée, message de la 004)

### Implementation

- [ ] T029 [US3] `src/content/services/campement-bagyeli.json` : supprimer `tiers` ; `pricing: { kind: "from", amount: 15000, unit: "per_person" }` ; quantité `persons` `min` 2, `max` 20, `default` 2 ; `degressive: true`
- [ ] T030 [US3] Créer `src/features/catalog/minimumParticipants.ts` conforme à T027 et à [contracts/content.md](./contracts/content.md), pur, sans import d'Astro
- [ ] T031 [US3] `src/components/experiences/PriceBlock.astro` : sous la pastille de capacité, pastille `accent-soft` « Minimum N personnes » (`price.minimum`) quand `minimumParticipants` est défini, et la phrase `price.degressive` (`text-xs text-fg-muted`) quand `degressive`
- [ ] T032 [US3] `src/components/experiences/ExperienceCard.astro` : pastille « Min. N pers. » (`price.minimumShort`) sur la photo, à côté de « N personnes max », quand `minimumParticipants` est défini
- [ ] T033 [US3] `npm run check` (couverture 100 % de `minimumParticipants`) ; T027 et T028 passent

**Checkpoint**: les trois stories sont livrées.

---

## Phase 6: Polish & vérification

- [ ] T034 [P] Ajouter `/experiences/visites.html` et `/experiences/village-mayi.html` à `lighthouserc.json`
- [ ] T035 [P] Documentation : `docs/data-model.md` (univers et catalogue de 32 prestations, renvoi vers [data-model.md](./data-model.md)) ; `docs/client-answers.md` (nouvelle section « Cahier actualisé d'octobre 2026 » : trois univers, catalogue, règles de prix, hypothèses du questionnaire 4) ; `docs/content-tracker.md` (21 prestations avec photo de remplacement, textes à faire relire par Franck) ; `specs/README.md` (statut de la 008)
- [ ] T036 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [ ] T037 Comparer, captures à 390 px (2x) et 1 440 px, la page d'entrée et une page d'univers aux illustrations du cahier (pages 2 et 4) et au style des écrans 02a et 02b ; corriger les écarts non justifiés et les consigner dans [quickstart.md](./quickstart.md)
- [ ] T038 Dérouler les 14 scénarios manuels de [quickstart.md](./quickstart.md) et relire les textes anglais des nouvelles prestations (Zobel)
- [ ] T039 Ouvrir la PR `008-tourism-universes` → `main`, après le merge de la 004 et un rebase (Zobel)

---

## Dépendances

```text
Setup (T001) ─► Foundational (T002–T009) ─► US1 (T010–T018) ─► US2 (T019–T026) ─► US3 (T027–T033) ─► Polish
```

- US1 ne dépend que de la phase 2. US2 a besoin des pages d'univers de US1 pour ses tests de comptage, mais ses fichiers de contenu (T021 à T024) peuvent s'écrire en parallèle de US1.
- US3 dépend de US2 seulement pour la fiche Village Mayi ; le Village Bagyeli existe déjà.
- Dans chaque story, les tests passent avant l'implémentation et doivent d'abord échouer.

## Exécution parallèle

- Phase 2 : T002 et T008 en parallèle ; T003 → T004 → T005 → T006 → T007 en série (le build doit rester vert).
- US1 : T010, T011 et T013 en parallèle ; puis T012, T014, T015, T016, T017.
- US2 : T019, T020, T021, T022 et T023 en parallèle (fichiers distincts) ; puis T024, T025.
- US3 : T027 et T028 en parallèle ; puis T029 à T032.
- Polish : T034 et T035 en parallèle.

## Stratégie

1. **MVP = phases 1 à 3** : les univers existent, la page d'entrée remplace la liste mélangée, sur le contenu actuel. C'est déjà la demande centrale de Franck.
2. **US2** remplit les univers : c'est la plus grosse part du travail, surtout rédactionnelle (21 prestations × 2 langues).
3. **US3** ajoute les mentions de prix de groupe.
4. Les réponses de Franck au questionnaire 4 (U1 à U6, Q1 à Q5) s'appliquent ensuite dans les données, sans toucher aux composants.
