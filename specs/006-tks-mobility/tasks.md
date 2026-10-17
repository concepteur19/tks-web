---
description: "Liste de tâches — Mobilité TKS®"
---

# Tasks: Mobilité TKS®

**Input**: Documents de conception de `specs/006-tks-mobility/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III). Tests du schéma, de l'estimation et de l'îlot écrits avant le code, qui doivent d'abord échouer ; couverture 100 % maintenue. Parcours en Playwright, îlot en Testing Library.

**Organisation**: par user story, dans l'ordre de priorité.

## Format: `[ID] [P?] [Story] Description`

## Règles valables pour toutes les tâches

Celles des 002 à 008 (aucun texte en dur, tokens, liens par `getRoutePath`, aucune règle métier dans un composant, aucune photo filigranée, contrôle des photos en pleine résolution avant import). En plus :

- les valeurs (identifiants, titres, modèles, prix, unités, dimensions, ordres, photos) sont celles de [data-model.md](./data-model.md), sans écart ;
- les chaînes sont celles de [contracts/content.md](./contracts/content.md), en français et en anglais ;
- avant chaque composant visible, relever dans `docs/design-exports/08-tks-mobilite.html` tailles, couleurs, graisses et espacements, et les reprendre par les tokens ;
- page sobre : petites photos, aucune photo plein écran (FR-002) ; aucune plaque lisible (FR-006) ; aucune mention de carburant, caution ou permis (hypothèse M3) ;
- après chaque phase, `npm run check` et `npm run build` passent.

---

## Phase 1: Setup

- [X] T001 Écrire d'abord `tests/unit/import-photos.test.ts` (doit échouer) sur la validation des entrées, extraite dans une fonction pure exportée : une entrée texte reste valide ; une zone `blur` dans l'image est acceptée ; une zone qui déborde (`left + width > 1`, `top + height > 1`, valeur négative ou largeur nulle) est refusée avec « [photos] zone de flou hors de l'image : <source> » ; une source `_FILIGRANE` est refusée sous les deux formes. Puis étendre `scripts/import-photos.ts` selon [contracts/content.md](./contracts/content.md) : une entrée de `sources.json` peut être un objet `{ source, blur?: [{ left, top, width, height }] }` (fractions 0 à 1 de l'image après `rotate()`) ; chaque zone est extraite, floutée (`sharp.blur`) et recomposée avant la réduction ; une zone hors de l'image fait échouer l'import avec « [photos] zone de flou hors de l'image : <source> » ; la règle `_FILIGRANE` s'applique aux deux formes ; les entrées chaîne restent valides
- [X] T002 Ajouter à `src/assets/photos/sources.json` les 5 photos de [research.md](./research.md) §7 (`mobility/luxe.jpg`, `luxe-2.jpg`, `premium.jpg`, `premium-2.jpg`, `yaris.jpg`, sources `voitures-tks/photo_2026-10-06_*`), avec une zone `blur` par plaque visible relevée sur l'original ; lancer `npm run photos:import` ; vérifier chaque photo importée en pleine résolution (aucune plaque lisible, aucun filigrane) ; noter les choix dans `src/assets/photos/README.md`

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [X] T003 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) : `models` (`string[]`, « 1 au moins ») accepté pour `section: mobilite`, facultatif dans cette section, refusé ailleurs avec « models n'est permis que pour la mobilité » ; une catégorie de véhicule (`from` + `per_day`, dimensions `units` puis `days`) est valide ; un service `quote` avec une dimension `hours` est valide
- [X] T004 Ajouter `models` à `src/content/schemas.ts` (champ facultatif et entrée de `sectionFields`, non obligatoire dans sa section) conformément à T003 ; couverture 100 % maintenue
- [X] T005 [P] Étendre `tests/unit/compute-estimate.test.ts` et `tests/unit/selection-message.test.ts` avec les cas de référence de [data-model.md](./data-model.md) (fixtures dans `tests/fixtures/catalog.ts` : `vehicule-premium`, `vehicule-yaris`, `transferts`, `chauffeur-prive`) : Premium [1, 4] → 140 000 et « Premium — 1 véhicule × 4 jours » ; Yaris [2, 3] → 150 000 et « 2 véhicules × 3 jours » ; total « estimatif » ; Transferts → sur devis, hors total ; Chauffeur privé [4] → « Chauffeur privé — 4 heures : sur devis » ; et dans `tests/unit/selection.test.ts`, fusion Premium [1, 4] + [1, 2] → [2, 2]. Ces tests passent sans changer le code : ils fixent le comportement
- [X] T006 [P] Chaînes de [contracts/content.md](./contracts/content.md) dans `src/i18n/fr.ts` et `src/i18n/en.ts`
- [X] T007 Ajouter `getMobility()` à `src/lib/catalog.ts` (publiés, triés par ordre puis nom) ; étendre `src/lib/pageCatalog.ts` à la section `mobilite`, vignettes comprises, adresse `/mobilite#<id>` et `/en/mobility#<id>` ; mettre à jour `tests/unit/island-catalog.test.ts` si la forme change
- [X] T008 [P] Renommer l'îlot : écrire d'abord dans `tests/component/selection-islands.test.tsx` les tests de `LineCustomizer` (doivent échouer) — parcours : un sélecteur « Nombre de personnes » à 2, « moins » désactivé à 2, bouton `buttonLabel` → `add({ serviceId, quantities: [4], optionIds: [] })` (tests de `TourCustomizer` repris) ; véhicule : deux sélecteurs « Nombre de véhicules » et « Nombre de jours », à 1, bornés à 5 et 30 ; 1 véhicule et 4 jours → `add({ serviceId, quantities: [1, 4], optionIds: [] })` ; `aria-label` « <buttonLabel> : <title> » ; aucune violation axe. Puis remplacer `src/features/selection/TourCustomizer.tsx` par `src/features/selection/LineCustomizer.tsx` selon [contracts/ui.md](./contracts/ui.md) (un `QuantityStepper` par dimension, libellés `detail.dimension.<kind>` comme `ExperienceConfigurator`, prop `buttonLabel`) et l'utiliser dans `src/components/packages/TourCard.astro` avec `packages.customise`
- [X] T009 Vérifier : `npm run check`, `npm run build` et `tests/e2e/packages.spec.ts` passent (parcours inchangés)

**Checkpoint**: le schéma, le catalogue et l'îlot savent porter une prestation de mobilité.

---

## Phase 3: User Story 1 — Louer un véhicule (Priority: P1) 🎯 MVP

**Goal**: page Mobilité, trois catégories ajoutables avec véhicules × jours.

**Independent Test**: ajouter un véhicule de chaque catégorie avec des quantités différentes, vérifier montants, total et message (quickstart, scénarios 3 à 7).

### Tests

- [X] T010 [P] [US1] Créer `tests/e2e/mobility.spec.ts` (doit échouer), FR et EN : l'en-tête du site porte le logo Kibreeze et le logo TKS® n'apparaît que dans le contenu de la page (FR-002) ; en-tête de page avec logo TKS®, « Mobilité & transport », la phrase et la mention Breezy Groupe ; aucune image plus large que 50 % de la fenêtre ; 3 `vehicle-category` dans l'ordre Luxe, Premium, Yaris, avec leurs modèles et « À partir de 100 000 / 35 000 / 25 000 FCFA » et « / jour » ; Premium réglé à 1 véhicule et 4 jours puis ajouté → message de confirmation, compteur +1 ; Mon séjour : ligne « Premium » qui affiche « 1 véhicule × 4 jours », 140 000 FCFA, « Total estimatif » ; le message WhatsApp contient exactement « Premium — 1 véhicule × 4 jours » ; Yaris 2 × 3 → 150 000 FCFA ; Premium ajouté deux fois → une seule ligne ; la ligne de Mon séjour mène à `/mobilite#vehicule-premium` ; encadré « Besoin d'un transport sur mesure ? » en fin de page avec lien WhatsApp ; aucun texte « carburant », « caution » ni « permis » ; sans JavaScript, chaque catégorie offre un lien WhatsApp qui la nomme ; pas de défilement horizontal à 320 px

- [X] T011 [P] [US1] Adapter les tests qui prenaient `mobility` comme page non livrée : `tests/unit/navigation.test.ts` (`isImplemented('mobility')` vrai ; les cas `resolveLink` vers WhatsApp passent leur propre liste `implemented` sans `mobility`, pour garder la branche couverte) ; `tests/e2e/home.spec.ts` (le bandeau TKS® mène à `/mobilite` et `/en/mobility`, sans lien `wa.me`) ; vérifier `tests/component/shell.test.ts` et `tests/e2e/shell.spec.ts` (avant T014, sinon `npm run check` échoue dès que la route est livrée)

### Implementation

- [X] T012 [P] [US1] Créer les 3 catégories dans `src/content/services/` (`vehicule-luxe`, `vehicule-premium`, `vehicule-yaris`) : `section: "mobilite"`, `models`, `pricing: { kind: "from", amount, unit: "per_day" }`, quantité `units` (« véhicules », `labelOne` « véhicule », 1 à 5, défaut 1) puis `days` (1 à 30, défaut 1), `order`, titres, descriptions et textes alternatifs FR et EN, photos de [data-model.md](./data-model.md)
- [X] T013 [US1] Créer `src/components/mobility/MobilityPage.astro` selon [contracts/ui.md](./contracts/ui.md) : en-tête TKS® (`tks-mark.png`, `mobility.title`, `mobility.tagline`, `mobility.brand`), section `id="vehicules"` (rangées `data-testid="vehicle-category"` avec `id` = identifiant, vignette carrée, nom, modèles, `Price`, euro, `LineCustomizer` en `client:visible` avec `buttonLabel = mobility.add`, `<noscript>` WhatsApp `mobility.request` nommant la catégorie), `mobility.vehicles.note`, encadré `mobility.custom.*` avec WhatsApp, bouton flottant ; une colonne à 360 px, grille de trois à partir de `lg` ; métadonnées `mobility.seo.*`, image de partage `mobility/luxe.jpg`
- [X] T014 [US1] Créer `src/pages/mobilite.astro` et `src/pages/en/mobility.astro` ; ajouter `mobility` à `IMPLEMENTED_ROUTES` dans `src/i18n/routes.ts`
- [X] T015 [US1] `npm run check`, `npm run build`, `npm run check:links` ; T010 et T011 passent, ainsi que `tests/e2e/seo.spec.ts` avec la page Mobilité (titre, description, image de partage, plan du site)

**Checkpoint**: US1 livrable seule : la page existe, le bandeau et la navigation y mènent.

---

## Phase 4: User Story 2 — Demander un transfert ou un chauffeur (Priority: P2)

**Goal**: quatre services sur devis, ajoutables, nommés dans le message.

**Independent Test**: ajouter chacun des services, vérifier qu'ils restent hors du total et sont nommés dans le message (quickstart, scénarios 8 à 10).

### Tests

- [X] T016 [P] [US2] Compléter `tests/e2e/mobility.spec.ts`, partie services, FR et EN : la section « Transport sur devis » suit les véhicules ; 4 `mobility-service` dans l'ordre Location avec chauffeur, Transferts, Chauffeur privé, Prestations professionnelles, chacun avec photo, phrase et « Sur devis » ; ajouter Transferts → ligne « sur devis », hors du total, « + 1 prestation sur devis » ; second ajout → « Déjà dans mon séjour » ; séjour Premium 1 × 4 + Transferts + Chauffeur privé → message WhatsApp qui nomme chacun avec ses quantités ; sans JavaScript, chaque service offre un lien WhatsApp qui le nomme

### Implementation

- [X] T017 [P] [US2] Créer les 4 services dans `src/content/services/` (`location-avec-chauffeur`, `transferts`, `chauffeur-prive`, `prestations-professionnelles`) : `section: "mobilite"`, sans `models`, `pricing: { kind: "quote" }`, quantités de [data-model.md](./data-model.md) (`days` « 1 à 30, défaut 1 » ; `hours` « 1 à 24, défaut 4 » ; aucune), `order`, phrases de l'écran 08 en `shortDescription`, descriptions et textes alternatifs FR et EN, photos
- [X] T018 [US2] Ajouter à `MobilityPage.astro` la section `id="services"` (`mobility.services.title`) : liste compacte `data-testid="mobility-service"` avec `id` = identifiant, vignette, nom, phrase, `Price` (« Sur devis »), `QuickAdd`, `<noscript>` WhatsApp `mobility.request` ; avant l'encadré final
- [X] T019 [US2] `npm run check`, `npm run build` ; T016 passe

---

## Phase 5: User Story 3 — Trouver la mobilité depuis le reste du site (Priority: P3)

**Goal**: bandeau de l'accueil et navigation ordinateur mènent à la page ; barre à onglets inchangée. Les tests de navigation qui prenaient `mobility` comme page non livrée sont adaptés dès US1, avec la livraison de la route.

**Independent Test**: depuis l'accueil et la navigation, atteindre la page Mobilité ; aucun lien n'ouvre plus WhatsApp faute de page (quickstart, scénarios 1 et 2).

- [ ] T020 [P] [US3] Compléter `tests/e2e/mobility.spec.ts` : à 1 440 px, l'entrée « Mobilité TKS® » de la navigation mène à la page ; à 390 px, la barre à onglets compte 5 onglets, sans Mobilité
- [ ] T021 [US3] `npm run check`, `npm run build:prod`, `npm run check:links` (SC-003) ; T020 passe

---

## Phase 6: Polish & vérification

- [ ] T022 [P] Ajouter `/mobilite.html` à `lighthouserc.json`
- [ ] T023 [P] Documentation : `docs/functional-requirements.md` (FR-MOB : catégories chiffrées, services sur devis) ; `docs/data-model.md` (section `mobilite`, champ `models`, renvoi vers [data-model.md](./data-model.md)) ; `docs/content-tracker.md` (hypothèses M1 à M5 en attente du questionnaire 6, photos des services) ; `src/assets/photos/README.md` (flou des plaques) ; `specs/README.md` (statut 006)
- [ ] T024 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [ ] T025 Comparer, captures à 390 px (2x) et 1 440 px, la page Mobilité à l'écran 08 (écart voulu : catégories chiffrées au lieu de « Sur devis ») ; corriger les écarts non justifiés et les consigner dans [quickstart.md](./quickstart.md)
- [ ] T026 Dérouler les 13 scénarios manuels de [quickstart.md](./quickstart.md) et relire les textes anglais (Zobel)
- [ ] T027 Ouvrir la PR `006-tks-mobility` → `main`, après la fusion de `fix-units-singular` (Zobel)

---

## Dépendances

```text
Setup (T001–T002) ─► Foundational (T003–T009) ─► US1 (T010–T015) ─► US2 (T016–T019) ─► US3 (T020–T021) ─► Polish
```

- US1 crée la page et livre la route, avec l'adaptation des tests de navigation (T011) avant la livraison (T014) ; US2 y ajoute sa section ; US3 vérifie les accès. US2 et US3 dépendent de US1, pas l'une de l'autre.
- Les fichiers de contenu (T012, T017) ne dépendent que de la phase 2 et des photos (T002).
- Dans chaque story, les tests passent avant l'implémentation et doivent d'abord échouer (sauf T005, qui fixe un comportement existant).

## Exécution parallèle

- Phase 2 : T003, T005, T006 et T008 en parallèle ; T004 → T007.
- US1 : T010, T011 et T012 en parallèle ; puis T013 → T014.
- US2 : T016 et T017 en parallèle ; puis T018.
- US3 : T020 seule, puis T021.
- Polish : T022 et T023 en parallèle.

## Stratégie

1. **MVP = phases 1 à 3** : la page Mobilité avec la location de véhicules, le seul service chiffré.
2. **US2** : les services sur devis, qui servent la demande.
3. **US3** : vérification des accès depuis la navigation et la barre à onglets.
