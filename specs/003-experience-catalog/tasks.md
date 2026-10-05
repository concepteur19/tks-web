---

description: "Liste de tâches — catalogue des expériences"
---

# Tasks: Catalogue des expériences

**Input**: Documents de conception de `specs/003-experience-catalog/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés (constitution, principe III ; [docs/testing-strategy.md](../../docs/testing-strategy.md)). Chaque fonction pure a son test écrit avant elle, qui doit d'abord échouer.

**Organisation**: par user story, dans l'ordre de priorité. US2 et US3 partagent la fiche : US3 suit US2 immédiatement.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable, fichiers différents, sans dépendance sur une tâche inachevée
- **[Story]** : user story concernée (US1 à US4)

## Règles valables pour toutes les tâches

Celles de [002/tasks.md](../002-kibreeze-core/tasks.md) : aucun texte en dur, aucune valeur de style brute, liens internes par `getRoutePath` / `SmartLink`. En plus :

- aucun bouton « Ajouter à mon séjour », aucun total, aucun sélecteur de quantité, aucune case à cocher (FR-016, FR-020) ;
- aucune valeur de contenu inventée : durée, lieu, inclus, non inclus, à savoir seulement s'ils viennent de Franck ; sinon le champ est absent et la rubrique omise ;
- aucune photo `_FILIGRANE`, ni `jet-ski/L7-01.jpg`.

---

## Phase 1: Setup

- [X] T001 Choisir et importer avec `npm run photos:import` (entrées ajoutées à `src/assets/photos/sources.json`), après contrôle visuel des filigranes : `experiences/quad.jpg` (`quad/L7-05` ou `L6-03`), `experiences/jet-ski.jpg` (`jet-ski/L7-06` ou `L7-08`), `experiences/kayak.jpg` (`excursion-en-pirogue/L7-04`), `experiences/paddle.jpg` (`_a-classer_paddle/L6-01`), `experiences/balade-a-cheval.jpg` (`balade-a-cheval/L7-07`), `sections/bandeau-experiences.jpg` (chutes de la Lobé, paysage), galeries : 2 photos de plus pour les chutes, la pirogue et le campement ; images générées par Google Stitch (`docs/design-exports/*.html`, décision de Zobel du 2026-10-05) pour les sujets sans photo de Franck : chaloupe, jacuzzi, feu de plage, croisière, bateau de plaisance, et le Studio de l'accueil ; elles vont dans `src/assets/photos/stitch/`. Compléter le tableau de `src/assets/photos/README.md` en marquant chaque image Stitch comme provisoire
- [X] T002 [P] Ajouter `--size-sticky-cta` (hauteur de la barre de demande, relevée sur `docs/design-exports/03-fiche-pirogue.html`) à `src/styles/tokens.css` et le documenter dans `docs/design-system.md`

---

## Phase 2: Foundational (bloquant pour toutes les stories)

- [ ] T003 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) : `location` localisé accepté ; option (`isOption: true`) sans `categoryId` ni `images` acceptée ; expérience non option sans `categoryId` refusée ; expérience non option sans image refusée
- [ ] T004 Modifier `serviceSchema` dans `src/content/schemas.ts` : champ facultatif `location: localizedString` ; `categoryId` obligatoire seulement si `section = "experience"` et non `isOption` ; `images` facultatif (`.min(1)` conservé quand présent) et obligatoire sauf `isOption`, conformément à [contracts/content.md](./contracts/content.md)
- [ ] T005 [P] Écrire `tests/unit/related-experiences.test.ts` (doit échouer), couverture 100 % : exclut l'expérience courante, les options et les `disabled` ; d'abord la même catégorie par `order`, puis les autres par `order` ; tronque à `limit` (3 par défaut) ; liste vide si rien d'autre
- [ ] T006 Créer `src/features/catalog/relatedExperiences.ts` (`relatedExperiences(current, all, limit = 3)`), fonction pure sans import d'Astro
- [ ] T007 [P] Écrire `tests/unit/service-request-message.test.ts` (doit échouer), couverture 100 % : FR « Bonjour Kibreeze, je souhaite des informations sur l'expérience « Excursion en pirogue » : https://kibreeze.com/experiences/excursion-en-pirogue » ; EN « Hello Kibreeze, I would like some information about the "Dugout canoe trip" experience: https://kibreeze.com/en/experiences/excursion-en-pirogue »
- [ ] T008 Créer `src/features/whatsapp/buildServiceRequestMessage.ts` et les gabarits `whatsapp.serviceRequest` FR et EN dans `src/i18n/fr.ts` et `src/i18n/en.ts`
- [ ] T009 [P] Écrire `tests/unit/experience-jsonld.test.ts` (doit échouer) : `@type: "TouristTrip"`, `name`, `description`, `url`, `image`, `inLanguage`, `provider` `TravelAgency` Kibreeze ; `offers` avec `price`, `priceCurrency: "XAF"` et `priceSpecification.unitText` pour `fixed` et `from` ; aucune `offers` pour `quote`
- [ ] T010 Ajouter `buildExperienceJsonLd` à `src/lib/seo.ts`
- [ ] T011 Étendre `src/lib/catalog.ts` : `getExperiences()` (expériences publiées, non options, non `disabled`, triées par `order` puis nom), `getOptions()`, `getExperience(slug)`, `categoriesWithExperiences()` ; `getFeatured()` exclut les options

**Checkpoint** : `npm run check` passe.

---

## Phase 3: User Story 1 — Parcourir et filtrer les expériences (Priority: P1) 🎯 MVP

**Goal** : la page Expériences, filtrable, et l'accueil qui y mène.

**Independent Test** : `/experiences`, chaque onglet puis « Toutes », dans les deux langues, avec et sans JavaScript.

### Tests for User Story 1

- [ ] T012 [P] [US1] Écrire `tests/component/experience-card.test.ts` : nom, description courte, prix et équivalent euro, badge « 8 personnes max » si `maxCapacity`, badge « Disponibilité à confirmer » si `on_request`, badge « Sur devis » sans euro, lien « Voir les détails » vers `/experiences/<slug>` ; aucune violation axe
- [ ] T013 [P] [US1] Écrire `tests/e2e/experiences.spec.ts` : 13 cartes sous « Toutes » ; `#aventure` → 5 cartes (quad, jet-ski, kayak, paddle, cheval), `#nature-decouverte` → 5, `#detente` → 3 ; même résultat avec JavaScript désactivé ; onglet actif `aria-current` et région `aria-live` annonçant le nombre avec JavaScript ; onglets collants sous l'en-tête au défilement ; bloc « Une envie particulière ? » avec bouton WhatsApp ; dans les deux langues ; sur l'accueil, une carte de catégorie mène à `/experiences#<categorie>`, l'onglet Expériences apparaît, les nombres par catégorie s'affichent, une carte mise en avant mène à sa fiche

### Implementation for User Story 1

- [ ] T014 [P] [US1] Créer dans `src/content/services/` les 9 expériences manquantes de [data-model.md](./data-model.md) : `excursion-en-chaloupe`, `jacuzzi-naturel`, `feu-de-plage`, `bateau-de-plaisance` (`quote`, `availability: "on_request"`), `quad` (10 000 `per_session`, dimension `units` « sessions »), `jet-ski` (`quote`), `kayak`, `paddle`, `balade-a-cheval` ; nom, description courte (≤ 160 caractères), description, photo et texte alternatif FR et EN, `order` par dizaines dans l'ordre de l'écran 02a ; aucun champ durée, lieu, inclus ou non inclus sans source
- [ ] T015 [P] [US1] Créer `src/content/services/guide-touristique.json` (5 000 `per_service`), `maitre-nageur.json` (5 000 `per_service`), `musee-d-art.json` (1 500 `per_person`, dimension `persons`), tous `isOption: true`, sans catégorie ni image
- [ ] T016 [P] [US1] Compléter les 4 expériences de 002 (`chutes-de-la-lobe`, `excursion-en-pirogue`, `croisiere-en-bateau`, `campement-bagyeli`) avec leurs photos de galerie et, pour la pirogue, `location` si une source le donne
- [ ] T017 [P] [US1] Créer `src/components/experiences/ExperienceCard.astro` conforme à T012 : `data-category`, photo (`<Image>`, lazy, `widths` 320/560, `quality` 70), `Price` via `cardPrice`, badges, lien « Voir les détails »
- [ ] T018 [P] [US1] Créer `src/components/experiences/CategoryTabs.astro` : `nav` nommée, lien « Toutes » (sans ancre) et un lien `#<categorie>` par catégorie de `categoriesWithExperiences()`, collants sous l'en-tête, défilement horizontal ; règles CSS `:has(#<id>:target)` qui masquent les cartes des autres catégories et soulignent l'onglet actif ; ancres cibles invisibles avec `scroll-margin` ; script en ligne < 1 Ko (`is:inline`) qui pose `aria-current`, remplit la région `aria-live` et reporte l'ancre sur le lien du sélecteur de langue, à chaque `hashchange` et au chargement, conformément à [contracts/ui.md](./contracts/ui.md)
- [ ] T019 [US1] Créer `src/components/experiences/ExperiencesPage.astro` : bandeau photo (`h1` « Expériences », « Vivez Kribi autrement »), `CategoryTabs`, grille de `ExperienceCard` (une colonne, trois à partir de `lg`), mention « tarifs indicatifs », bloc « Une envie particulière ? » avec bouton WhatsApp générique ; titre et description de page ; chaînes FR et EN
- [ ] T020 [US1] Créer `src/pages/experiences/index.astro` et `src/pages/en/experiences/index.astro`, puis ajouter `experiences` à `IMPLEMENTED_ROUTES` dans `src/i18n/routes.ts`
- [ ] T021 [US1] Dans `src/components/home/CategoryCards.astro`, passer `hash={category.id}` à `SmartLink` ; vérifier que `check:links` accepte les ancres

**Checkpoint** : T012 et T013 passent ; la page Expériences est montrable.

---

## Phase 4: User Story 2 — Consulter la fiche (Priority: P2)

**Goal** : une fiche complète par expérience.

**Independent Test** : fiches de la pirogue, du campement Bagyeli et du jet-ski, dans les deux langues.

### Tests for User Story 2

- [ ] T022 [P] [US2] Écrire `tests/component/gallery.test.ts` : une photo → ni compteur ni vignettes ; trois photos → compteurs « 1 / 3 » à « 3 / 3 », vignettes en liens `#photo-k` avec texte alternatif ; aucune violation axe
- [ ] T023 [P] [US2] Écrire `tests/e2e/experience-detail.spec.ts` : fiche pirogue (fil d'Ariane, galerie, 35 000 FCFA ≈ 53,36 €, mention « Prix indicatif… », badge « Jusqu'à 8 personnes — au-delà, sur devis », inclus puis non inclus, trois options avec prix, trois « Vous aimerez aussi » dont la même catégorie d'abord) ; fiche campement (trois tarifs nommés) ; fiche kayak (aucune rubrique vide) ; aucune case à cocher, aucun « Ajouter à mon séjour » ; `/experiences/decouverte-de-kribi` → 404 ; sélecteur de langue vers la même fiche ; pas de défilement horizontal à 320 px

### Implementation for User Story 2

- [ ] T024 [P] [US2] Créer `src/components/experiences/Gallery.astro` conforme à T022 : bande `scroll-snap`, première photo `loading="eager"` et `fetchpriority="high"`, les autres lazy
- [ ] T025 [P] [US2] Créer `src/components/experiences/PriceBlock.astro` : prix en grand via `cardPrice`, unité, équivalent euro, mention « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. », liste des `tiers` nommés, badge de capacité si `maxCapacity`, badge « Disponibilité à confirmer » si `on_request`
- [ ] T026 [P] [US2] Créer `src/components/experiences/InfoRow.astro` (durée, capacité, lieu, chaque cellule omise si vide, la rangée entière si tout est vide) et `src/components/experiences/Conditions.astro` (« Ce qui est inclus » avec coches, « Ce qui n'est pas inclus » avec croix, « À savoir », chaque liste omise si vide)
- [ ] T027 [P] [US2] Créer `src/components/experiences/OptionsList.astro` (« Complétez votre expérience », lignes nom — `Price`, phrase « À demander avec l'expérience », aucune case à cocher) et `src/components/experiences/CompactCard.astro` (photo, nom, prix, lien vers la fiche)
- [ ] T028 [US2] Créer `src/components/experiences/ExperienceDetail.astro` : fil d'Ariane (`nav` nommée, liens vers la liste et la liste filtrée, page courante `aria-current="page"`), `Gallery`, nom et badge de catégorie, `PriceBlock`, `InfoRow`, description, `Conditions`, `OptionsList` (via `getOptions()`), « Vous aimerez aussi » (via `relatedExperiences`) ; deux colonnes à partir de `lg` ; chaînes FR et EN
- [ ] T029 [US2] Créer `src/pages/experiences/[slug].astro` et `src/pages/en/experiences/[slug].astro` : `getStaticPaths` sur `getExperiences()`, rendu de `ExperienceDetail` dans `BaseLayout` avec `routeKey="experiences"` ; vérifier que le sélecteur de langue et l'adresse canonique d'une fiche utilisent le chemin de la fiche, et non celui de la liste (adapter `BaseLayout`, `LanguageSwitcher` et `buildSeo` pour accepter un chemin explicite et son équivalent dans l'autre langue : adresse canonique, liens `hreflang` fr / en / x-default et sélecteur de langue doivent viser la fiche, jamais la liste ni la 404 ; test e2e dans T023)

**Checkpoint** : T022 et T023 passent.

---

## Phase 5: User Story 3 — Demander l'expérience sur WhatsApp (Priority: P3)

**Goal** : la barre de demande fixe et la carte collante.

**Independent Test** : « Demander ce service » sur trois fiches, dans chaque langue, en 360 px et 1 440 px.

### Tests for User Story 3

- [ ] T030 [P] [US3] Écrire `tests/e2e/service-request.spec.ts` : en 360 px, barre fixe au-dessus de la barre à onglets, sans chevauchement, aucun bouton flottant ; le lien ouvre `wa.me` avec le message de la langue qui nomme l'expérience et contient l'adresse absolue de la fiche ; fiche sur devis → badge « Sur devis » dans la barre ; en 1 440 px, carte de demande visible après défilement ; le contenu n'est jamais masqué par la barre

### Implementation for User Story 3

- [ ] T031 [US3] Créer `src/components/experiences/StickyRequest.astro` (variantes `bar` et `card`) : prix et équivalent euro ou badge « Sur devis », bouton « Demander ce service » vers `buildWhatsAppUrl(env.whatsappNumber, buildServiceRequestMessage(...))`, `target="_blank"`, `rel="noopener noreferrer"`
- [ ] T032 [US3] Intégrer `StickyRequest` dans `ExperienceDetail.astro` : variante `bar` fixée sous `lg` (`bottom: var(--size-tabbar)`, `z-index: var(--z-sticky-cta)`), variante `card` en `position: sticky` dans la colonne de droite à partir de `lg` ; passer `floatingWhatsApp={false}` ; marge basse de `main` = barre à onglets + `--size-sticky-cta` sous `lg`

**Checkpoint** : T030 passe.

---

## Phase 6: User Story 4 — Référencement (Priority: P4)

- [ ] T033 [P] [US4] Étendre `tests/e2e/seo.spec.ts` : titres et descriptions uniques sur la liste et les fiches ; `og:image` de chaque fiche = sa première photo ; JSON-LD `TouristTrip` présent sur chaque fiche, `offers` absent pour le jet-ski et le bateau de plaisance ; plan du site = pages livrées de 002 + liste + 13 fiches, × 2 langues
- [ ] T034 [US4] Brancher dans `ExperienceDetail.astro` : titre (nom de l'expérience), description (description courte), `ogImage` (première photo), `jsonLd=[buildExperienceJsonLd(...)]`
- [ ] T035 [US4] Ajouter `/experiences.html` et une fiche (`/experiences/excursion-en-pirogue.html`) aux adresses auditées de `lighthouserc.json`

---

## Phase 7: Polish & vérification

- [ ] T036 [P] Mettre à jour `docs/content-tracker.md` (photos et champs encore vides par expérience), `specs/README.md` (statut de 003) et `docs/architecture.md` (pages et modules `features/catalog`, `features/whatsapp`)
- [ ] T037 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e`, `npm run lighthouse` ; corriger jusqu'à ce que tout passe ; consigner les résultats dans [quickstart.md](./quickstart.md)
- [ ] T038 Dérouler les 14 scénarios manuels de [quickstart.md](./quickstart.md) (Zobel)
- [ ] T039 Ouvrir la PR de `003-experience-catalog` vers `main` après la fusion de 002 (Zobel)

---

## Dépendances

```text
Phase 1 Setup ─► Phase 2 Foundational ─► US1 (P1) ─► US2 (P2) ─► US3 (P3)
                                           └──────────────► US4 (P4, après US2)
                                                              ─► Phase 7
```

- T004 dépend de T003. T006 de T005. T008 de T007. T010 de T009. T011 de T004.
- T014 à T016 dépendent de T001 et T004. T017 et T018 de T011. T019 de T017 et T018. T020 de T019. T021 de T020.
- T024 à T027 dépendent de T011. T028 de T006 et T024 à T027. T029 de T028.
- T031 dépend de T008 et T025. T032 de T031 et T029.
- T034 dépend de T010 et T029. T035 de T029.
- T037 dépend de toutes les tâches de code.

## Exécutions parallèles possibles

- Foundational : T003, T005, T007, T009 (tests) ensemble, puis chaque implémentation après son test.
- US1 : T012, T013 ; puis T014, T015, T016, T017, T018 ensemble.
- US2 : T022, T023 ; puis T024 à T027 ensemble.

## Stratégie de livraison

1. **MVP** : phases 1, 2, 3. La page Expériences et le filtre sont en ligne ; les cartes mènent à des fiches seulement après US2, donc US2 suit immédiatement dans la même PR.
2. **Fiche et demande** : phases 4 et 5.
3. **Référencement et finition** : phases 6 et 7.

## Total

39 tâches : 2 en setup, 9 en fondation, 10 pour US1, 8 pour US2, 3 pour US3, 3 pour US4, 4 en finition.
