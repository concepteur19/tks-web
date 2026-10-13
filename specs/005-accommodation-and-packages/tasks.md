---
description: "Liste de tâches — Hébergements, formules et parcours"
---

# Tasks: Hébergements, formules et parcours

**Input**: Documents de conception de `specs/005-accommodation-and-packages/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III). Tests du schéma et de `catalogIssues` écrits avant le code, qui doivent d'abord échouer ; couverture 100 % maintenue. Parcours en Playwright, îlot en Testing Library.

**Organisation**: par user story, dans l'ordre de priorité.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles des 002 à 008 (aucun texte en dur, tokens, liens par `getRoutePath`, aucune règle métier dans un composant, aucune photo filigranée, contrôle des photos en pleine résolution avant import). En plus :

- les valeurs (identifiants, prix, unités, dimensions, ordres, étapes, références, photos) sont celles de [data-model.md](./data-model.md), sans écart ;
- les chaînes sont celles de [contracts/content.md](./contracts/content.md), en français et en anglais ;
- avant chaque composant visible, relever dans `docs/design-exports/06a-hebergements.html` ou `07-formules.html` tailles, couleurs, graisses et espacements, et les reprendre par les tokens ;
- aucun montant haut de gamme avant les paliers standards ;
- après chaque phase, `npm run check` et `npm run build` passent.

---

## Phase 1: Setup

- [ ] T001 Choisir dans `Elements/tri-par-activite/hebergements-franck/` une photo d'appartement (salon ou salle à manger, lot du 2026-10-06), la contrôler en pleine résolution (aucun filigrane, aucune personne identifiable), l'ajouter à `src/assets/photos/sources.json` sous `accommodation/appartement.jpg`, lancer `npm run photos:import`, noter la source dans `src/assets/photos/README.md`

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [ ] T002 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) selon [contracts/content.md](./contracts/content.md) : section `parcours` acceptée ; unité `per_couple` acceptée ; `accommodationType` (`chambre` | `studio` | `appartement` | `villa`) obligatoire pour `section: hebergement` et refusé ailleurs ; `steps` (`{ label { fr, en }, serviceId? }[]`, « 2 au moins ») obligatoire pour `section: parcours` et refusé ailleurs ; `serviceIds` (`string[]`, « 2 au moins ») obligatoire pour `section: formule` et refusé ailleurs ; `badge` `{ fr, en }` facultatif ; `catalogIssues` signale une étape ou une référence de formule vers une prestation inconnue ou désactivée, avec les messages du contrat, et accepte une référence vers une option publiée ; signale un hébergement dont le titre ne cite pas son prix formaté dans chaque langue (« 30 000 » en français, « 30,000 » en anglais)
- [ ] T003 Modifier `src/content/schemas.ts` conformément à T002 (enum `SECTIONS`, `PRICE_UNITS`, champs, règles par section dans le `superRefine` existant, `catalogIssues` élargi) ; couverture 100 % maintenue
- [ ] T004 Adapter `scripts/check-content.ts` : passer à `catalogIssues` la liste des prestations publiées (expériences et options non désactivées) pour la vérification des références
- [ ] T005 [P] Chaînes de [contracts/content.md](./contracts/content.md) dans `src/i18n/fr.ts` et `src/i18n/en.ts` (dont `price.unit.per_couple`, le dictionnaire étant typé sur les unités)
- [ ] T006 Ajouter à `src/lib/catalog.ts` `getAccommodation()`, `getTours()`, `getPackages()` (publiés, triés par ordre puis nom) ; étendre `src/lib/pageCatalog.ts` aux trois sections, vignettes comprises, avec les adresses par section du contrat (`/hebergements#<id>`, `/formules#<id>` et leurs équivalents anglais) ; mettre à jour `tests/unit/island-catalog.test.ts` si la forme change
- [ ] T007 [P] Ajouter la prop `wide` à `src/features/selection/QuickAdd.tsx` (pleine largeur, libellé `stay.add`) et son test dans `tests/component/selection-islands.test.tsx`
- [ ] T008 Vérifier : `npm run check` et `npm run build` passent, aucune page modifiée

**Checkpoint**: le schéma et le catalogue des îlots connaissent les trois nouvelles sortes de prestations.

---

## Phase 3: User Story 1 — Ajouter un logement (Priority: P1) 🎯 MVP

**Goal**: page Hébergements, six paliers ajoutables avec un nombre de nuits.

**Independent Test**: ajouter un palier de chaque type, régler les nuits dans Mon séjour, vérifier montants, total et message (quickstart, scénarios 1 à 4).

### Tests

- [ ] T009 [P] [US1] Créer `tests/e2e/accommodation.spec.ts` (doit échouer), FR et EN : l'explication précède le premier palier ; 4 cartes de type dans l'ordre, 6 paliers aux prix de [data-model.md](./data-model.md), capacité affichée ; chaque photo porte « Exemple de logement à ce budget » ; aucun « 300 000 » avant le dernier palier, encadré haut de gamme en fin de page avec lien WhatsApp ; ajout du studio → message de confirmation et compteur +1 ; Mon séjour : studio à 3 nuits → 90 000 FCFA et « Total estimatif » ; `appartement-35000` et `appartement-50000` → deux lignes ; message WhatsApp contenant « Studio, à partir de 30 000 FCFA la nuit — 3 nuits » ; la ligne de Mon séjour mène à `/hebergements#studio-30000` ; aucun texte « propriétaire » ni « mise en relation », et la phrase de réservation par Kibreeze présente (FR-007) ; sans JavaScript, la page reste lisible et chaque palier offre un lien WhatsApp « Demander ce logement » qui nomme le palier ; pas de défilement horizontal à 320 px
- [ ] T010 [P] [US1] Basculer sur `mobility` les tests qui prenaient `accommodation` comme exemple de page non livrée : `tests/unit/navigation.test.ts` (`isImplemented`, `resolveLink`), `tests/e2e/home.spec.ts` (« renvoie vers WhatsApp les liens dont la page n'est pas livrée ») ; vérifier `tests/component/shell.test.ts`

### Implementation

- [ ] T011 [P] [US1] Créer les 6 paliers dans `src/content/services/` (`chambre-15000`, `studio-30000`, `appartement-35000`, `appartement-50000`, `appartement-100000`, `villa-150000`) : `section: "hebergement"`, `accommodationType`, `pricing: { kind: "from", amount, unit: "per_night" }`, quantité `nights` « 1 à 30, défaut 1 », `capacity`, `order`, titre FR et EN du modèle de [data-model.md](./data-model.md), description courte, photo du type
- [ ] T012 [US1] Créer `src/components/accommodation/AccommodationPage.astro` selon [contracts/ui.md](./contracts/ui.md) : bandeau (photo de villa recadrée 16:9), encadré `accommodation.intro`, une carte par type (photo avec `IllustrativeTag` libellé `accommodation.example`, nom, capacité, rangées de paliers avec prix « À partir de », euro, inclus éventuel, `QuickAdd`, `id` = identifiant du palier), mention `detail.priceNote`, encadré haut de gamme sombre avec bouton WhatsApp, bouton flottant ; métadonnées propres ; sous chaque `QuickAdd`, `<noscript>` avec lien WhatsApp `accommodation.request` (message nommant le palier, `buildServiceRequestMessage`) ; vocabulaire de réservation de [contracts/ui.md](./contracts/ui.md) (FR-007)
- [ ] T013 [US1] Créer `src/pages/hebergements.astro` et `src/pages/en/accommodation.astro` ; ajouter `accommodation` à `IMPLEMENTED_ROUTES` dans `src/i18n/routes.ts`
- [ ] T014 [US1] Faire lire à `src/components/home/AccommodationTeaser.astro` les prix des paliers (`getAccommodation()`, plus petit palier de chaque type affiché) et retirer les prix de `src/content/site/home.json` et de son schéma `homeSchema` ; adapter `tests/unit/content-schema.test.ts` et `tests/e2e/home.spec.ts` si besoin
- [ ] T015 [US1] `npm run check`, `npm run build`, `npm run check:links` ; T009 et T010 passent, ainsi que `tests/e2e/seo.spec.ts` avec la page Hébergements (titre, description, image de partage, plan du site)

**Checkpoint**: US1 livrable seule ; l'onglet Formules ouvre encore WhatsApp.

---

## Phase 4: User Story 2 — Partir d'un parcours (Priority: P2)

**Goal**: six parcours sur la page Formules, personnalisables et ajoutables, entrée depuis la page Tourisme.

**Independent Test**: ouvrir les six parcours, ajouter « L'Essentiel de Kribi » pour 4, vérifier ligne, total, message (quickstart, scénarios 5 à 9).

### Tests

- [ ] T016 [P] [US2] Écrire dans `tests/component/selection-islands.test.tsx` le test de `TourCustomizer` (doit échouer) : sélecteur à 2 par défaut, « moins » désactivé à 2, « plus » à 4 puis bouton → `add({ serviceId, quantities: [4], optionIds: [] })`, aucune violation axe
- [ ] T017 [P] [US2] Créer `tests/e2e/packages.spec.ts` (doit échouer), partie parcours, FR et EN : la page Tourisme porte `tours-entry` vers `/formules#parcours` ; 6 `tour-card` dans l'ordre ; L'Essentiel : 4 étapes, chacune liée à sa fiche, « À partir de 30 000 FCFA », « Minimum 2 personnes », mention dégressive, note de calcul ; Kribi & Ebodjé et Kribi au fil de l'eau : « Sur devis », action disponible ; étapes sans fiche affichées sans lien ; personnaliser L'Essentiel pour 4 → une ligne, 120 000 FCFA, « Total estimatif » ; Kribi & Ebodjé pour 3 → ligne sur devis ; sans JavaScript, chaque carte de parcours offre un lien WhatsApp ; `tests/e2e/seo.spec.ts` passe avec la page Formules
- [ ] T018 [P] [US2] Étendre `tests/unit/content-schema.test.ts` : une étape vers `bateau-de-plaisance` (désactivé) est signalée

### Implementation

- [ ] T019 [P] [US2] Créer les 6 parcours dans `src/content/services/` selon le tableau Parcours de [data-model.md](./data-model.md) : `section: "parcours"`, `steps`, prix (`from` + `per_person`, ou `quote`), quantité `persons` « 2 à 20, défaut 2 », `degressive: true` pour les parcours chiffrés, `order` ; textes de l'onglet 3 de `Elements/questions-kibreeze-franck-repondu (1).xlsx` (règle de la 008 : pas de phrase réduite à une réserve) ; photo de la première étape publiée
- [ ] T020 [US2] Créer `src/features/selection/TourCustomizer.tsx` conforme à T016 et à [contracts/ui.md](./contracts/ui.md) : `QuantityStepper` borné par la dimension `persons`, bouton `packages.customise`, chaînes passées en props
- [ ] T021 [US2] Créer `src/components/packages/TourCard.astro` (photo, nom, étapes numérotées avec lien vers la fiche quand `serviceId`, prix par `Price`, pastille `price.minimum`, mention `price.degressive`, `TourCustomizer` en `client:visible`, et dessous un `<noscript>` avec lien WhatsApp `packages.request` nommant le parcours) et `src/components/packages/PackagesPage.astro` avec sa section `id="parcours"` (titre, note `packages.tours.note`) ; créer `src/pages/formules.astro`, `src/pages/en/packages.astro` ; ajouter `packages` à `IMPLEMENTED_ROUTES`
- [ ] T022 [US2] Dans `src/components/experiences/ExperiencesPage.astro`, après les cartes d'univers, carte « Parcours Kibreeze » (`experiences.toursEntry.*`, `data-testid="tours-entry"`) vers `getRoutePath('packages', locale)#parcours`
- [ ] T023 [US2] `npm run check`, `npm run build`, `npm run check:links` ; T016 à T018 passent

---

## Phase 5: User Story 3 — Choisir une formule (Priority: P3)

**Goal**: quatre formules d'activités après les parcours, ajoutables en un geste.

**Independent Test**: ajouter une formule, la réajouter, vérifier ligne, total et message (quickstart, scénarios 10 à 12).

### Tests

- [ ] T024 [P] [US3] Compléter `tests/e2e/packages.spec.ts`, partie formules : la section « Parcours de visite » précède « Formules d'activités » ; « Tous nos forfaits sont calculés sur une base de 2 personnes » ; 4 `package-card` avec leurs prestations (liens vers les fiches) et « / 2 personnes » ; badge « Le plus complet » sur la Premium ; ajouter Évasion → ligne à 120 000 FCFA, sans détail des prestations ; second ajout → « Déjà dans mon séjour » ; encadré « Groupes jusqu'à 8 personnes sur demande » avec WhatsApp ; séjour studio 3 nuits + L'Essentiel 4 + Évasion + une expérience → message qui nomme chacun avec ses quantités
- [ ] T025 [P] [US3] Étendre `tests/unit/content-schema.test.ts` : une formule qui référence `bateau-de-plaisance` est signalée ; une formule qui référence `guide-touristique` (option) est acceptée

### Implementation

- [ ] T026 [P] [US3] Créer les 4 formules dans `src/content/services/` selon le tableau Formules de [data-model.md](./data-model.md) : `section: "formule"`, `serviceIds`, `pricing: { kind: "fixed", amount, unit: "per_couple" }`, quantité sans dimension, `badge` « Le plus complet » / « The most complete » sur la Premium, photo (la Premium : `illustrations/croisiere-en-haute-mer.jpg`, `illustrative: true`), textes FR et EN
- [ ] T027 [US3] Créer `src/components/packages/PackageCard.astro` (photo avec `IllustrativeTag` si `illustrative`, nom, badge, liste cochée des prestations liées à leur fiche, prix « / 2 personnes », euro, `QuickAdd wide`, et dessous un `<noscript>` avec lien WhatsApp `packages.request` nommant la formule) et la section `id="formules"` de `PackagesPage.astro` (titre, `packages.base`, cartes, encadré `packages.groups.*` avec WhatsApp)
- [ ] T028 [US3] `npm run check`, `npm run build:prod`, `npm run check:links` ; T024 et T025 passent

---

## Phase 6: Polish & vérification

- [ ] T029 [P] Ajouter `/hebergements.html` et `/formules.html` à `lighthouserc.json`
- [ ] T030 [P] Documentation : `docs/functional-requirements.md` (FR-PACK : parcours à côté des formules, section « Parcours de visite » ; FR-HEB-6 : étiquette « Exemple de logement à ce budget ») ; `docs/data-model.md` (sections `hebergement`, `parcours`, `formule`, unité `per_couple`, renvoi vers [data-model.md](./data-model.md)) ; `docs/content-tracker.md` (photos d'hébergement par budget toujours attendues, prix de la formule Premium à confirmer, formules complètes sans prix) ; `specs/README.md` (statut 005 ; statut 008 « Livrée (PR #7) »)
- [ ] T031 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [ ] T032 Comparer, captures à 390 px (2x) et 1 440 px, les pages Hébergements et Formules aux écrans 06a, 06b et 07, et la carte de parcours à l'illustration du cahier (page 6) ; corriger les écarts non justifiés et les consigner dans [quickstart.md](./quickstart.md)
- [ ] T033 Dérouler les 13 scénarios manuels de [quickstart.md](./quickstart.md) et relire les textes anglais (Zobel)
- [ ] T034 Ouvrir la PR `005-accommodation-and-packages` → `main` (Zobel)

---

## Dépendances

```text
Setup (T001) ─► Foundational (T002–T008) ─► US1 (T009–T015) ─► US2 (T016–T023) ─► US3 (T024–T028) ─► Polish
```

- US2 crée la page Formules ; US3 y ajoute sa section. US3 dépend donc de US2.
- Les fichiers de contenu (T011, T019, T026) ne dépendent que de la phase 2 et peuvent s'écrire en parallèle.
- Dans chaque story, les tests passent avant l'implémentation et doivent d'abord échouer.

## Exécution parallèle

- Phase 2 : T002, T005 et T007 en parallèle ; T003 → T004 → T006.
- US1 : T009, T010, T011 en parallèle ; puis T012, T013, T014.
- US2 : T016 à T019 en parallèle ; puis T020 → T021 → T022.
- US3 : T024, T025, T026 en parallèle ; puis T027.
- Polish : T029 et T030 en parallèle.

## Stratégie

1. **MVP = phases 1 à 3** : la page Hébergements, la plus attendue, avec ajout au séjour.
2. **US2** : les parcours du cahier d'octobre et leur entrée depuis le Tourisme.
3. **US3** : les formules du guide tarifaire, sous les parcours.
