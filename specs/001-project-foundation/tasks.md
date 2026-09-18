---

description: "Liste de tâches — fondation du projet TKS"
---

# Tasks: Fondation du projet

**Input**: Documents de conception de `specs/001-project-foundation/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés, conformément à [docs/testing-strategy.md](../../docs/testing-strategy.md).

**Organisation**: par user story, pour que chacune soit implémentable et vérifiable seule. US4 ne dépend que de l'installation de Docker Desktop et peut être faite en dernier.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable, fichiers différents, sans dépendance sur une tâche inachevée
- **[Story]** : user story concernée (US1 à US4)
- Chaque tâche cite son chemin de fichier

## Conventions de chemins

Projet unique, racine du dépôt. Code dans `src/`, tests dans `tests/`, conteneurisation dans `docker/`, scripts dans `scripts/`.

---

## Phase 1: Setup

**Objectif** : un projet qui démarre et se construit, sans contenu.

- [X] T001 Initialiser le projet Astro 5 en sortie statique à la racine : `package.json`, `astro.config.mjs` (`output: 'static'`), `tsconfig.json`
- [X] T002 [P] Ajouter les dépendances décidées par les ADR dans `package.json` : `astro`, `@astrojs/react`, `react`, `react-dom`, `@astrojs/sitemap`, `tailwindcss`, `@tailwindcss/vite`, `zod`
- [X] T003 [P] Activer le typage strict dans `tsconfig.json` : `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- [X] T004 [P] Créer `.env.example` avec `PUBLIC_WHATSAPP_NUMBER` et `PUBLIC_SITE_URL`, valeurs d'exemple et commentaires, conformément à [contracts/env.md](./contracts/env.md)
- [X] T005 Déclarer les scripts npm dans `package.json` : `dev`, `build`, `build:prod`, `preview`, `check`, `check:i18n`, `test`, `test:e2e`. Le script `tokens:check` est déclaré avec T040, en même temps que le contrôle qu'il exécute
- [X] T006 [P] Brancher Tailwind v4 via `@tailwindcss/vite` dans `astro.config.mjs` et créer `src/styles/global.css` qui importe `src/styles/tokens.css`

---

## Phase 2: Foundational (bloquant pour toutes les stories)

**⚠️ À terminer avant toute user story.**

- [X] T007 Déclarer le schéma des variables d'environnement dans `astro.config.mjs`, résoudre les valeurs dans `config/resolve-env.mjs` et exposer un accès typé dans `src/lib/env.ts` : `PUBLIC_WHATSAPP_NUMBER` en 8 à 15 chiffres sans `+`, `PUBLIC_SITE_URL` en adresse absolue avec protocole et sans barre oblique finale, échec du build si la valeur est invalide, repli documenté si elle est absente
- [X] T008 [P] Créer `src/i18n/types.ts` : `LOCALES = ['fr','en']`, `Locale`, `DEFAULT_LOCALE = 'fr'`, `LocalizedString = { fr: string; en?: string }`, type `Dictionary`
- [X] T009 Créer `src/i18n/routes.ts` avec la table `ROUTES` des 7 clés reprises telles quelles de [contracts/routes.md](./contracts/routes.md), plus `getRoutePath(key, locale)`, `getAlternatePath(path, locale)` et `getLocaleFromPath(path)`
- [X] T010 [P] Créer `src/i18n/fr.ts` comme dictionnaire de référence et `src/i18n/en.ts` typé `satisfies Dictionary`, pour que toute clé manquante casse la compilation
- [X] T011 Créer `src/i18n/t.ts` : `t(locale, key, params?)` avec interpolation et pluriels via `Intl.PluralRules`, et `localize(value, locale)` qui replie sur `fr` en émettant un avertissement hors production
- [X] T012 [P] Créer `src/styles/tokens.css` avec la structure `@theme` et les valeurs provisoires marquées `[PLACEHOLDER]` de [docs/design-system.md](../../docs/design-system.md), plus les `z-index` nommés
- [X] T013 Créer `src/layouts/BaseLayout.astro` : déclaration de langue, titre, description, adresse canonique, liens alternatifs `fr` / `en` / défaut, `og:locale`, lien d'évitement vers le contenu, emplacements pour la navigation et le pied de page
- [X] T014 [P] Configurer Vitest dans `vitest.config.ts` avec la configuration Vite fournie par Astro, deux projets, unités et composants, et `tests/setup/`
- [X] T015 [P] Configurer Playwright dans `playwright.config.ts` sur le site construit et prévisualisé, projets `desktop-chromium` et `mobile-webkit`

**Point de contrôle** : `npm run build` réussit, les stories peuvent démarrer.

---

## Phase 3: User Story 1 — Squelette bilingue consultable en ligne (Priority: P1) 🎯 MVP

**Goal** : une page d'accueil et une page d'erreur dans les deux langues, un sélecteur de langue, des métadonnées correctes, publiées en ligne.

**Independent Test** : ouvrir l'adresse publique, voir l'accueil en français, basculer en anglais, revenir, et ouvrir une adresse inexistante dans chaque langue.

### Tests de la story

- [X] T016 [P] [US1] Tests unitaires de la table de routes dans `tests/unit/routes.test.ts` : chaque clé a un chemin par langue, aucun doublon dans une même langue, aller-retour français vers anglais vers français identique
- [X] T017 [P] [US1] Tests unitaires de la traduction dans `tests/unit/i18n.test.ts` : interpolation, pluriels à 0, 1 et plusieurs dans les deux langues, repli sur le français avec avertissement quand l'anglais manque
- [X] T018 [P] [US1] Test de composant du sélecteur de langue dans `tests/component/language-switcher.test.ts` : langue active signalée, attributs de langue et de lien alternatif présents, aucune violation axe
- [X] T019 [US1] Test de parcours dans `tests/e2e/skeleton.spec.ts` : accueil français, bascule vers `/en/`, retour, page d'erreur dans chaque langue, rendu sans JavaScript, absence de défilement horizontal à 360 px

### Implémentation de la story

- [X] T020 [US1] Créer `src/components/LanguageSwitcher.astro` qui lit `src/i18n/routes.ts` et rend un lien vers la page équivalente, sans détection ni redirection
- [X] T021 [P] [US1] Créer `src/components/Nav.astro` et `src/components/Footer.astro`, textes issus des dictionnaires, sans lien vers les pages non encore livrées
- [X] T022 [P] [US1] Créer `src/components/WhatsAppButton.astro` : lien `wa.me` construit depuis `src/lib/env.ts`, message générique traduit, `rel="noopener"`, nom accessible
- [X] T023 [US1] Créer `src/pages/index.astro` et `src/pages/en/index.astro` : identité TKS®, signature, phrase d'attente, aucun contenu client inventé
- [X] T024 [P] [US1] Créer `src/pages/404.astro` et `src/pages/en/404.astro`, chacune dans sa langue avec un retour vers l'accueil
- [X] T025 [US1] Créer `src/lib/seo.ts` qui produit titre, description, adresse canonique, liens alternatifs et balises de partage à partir de `PUBLIC_SITE_URL`, puis le brancher dans `src/layouts/BaseLayout.astro`
- [X] T026 [US1] Configurer `@astrojs/sitemap` en mode deux langues dans `astro.config.mjs` et créer `public/robots.txt`

**Point de contrôle** : la story 1 est vérifiable seule, en local et en ligne.

---

## Phase 4: User Story 2 — Garde-fous qui empêchent de publier une régression (Priority: P2)

**Goal** : une anomalie de style, de typage, de test, de traduction, de performance ou d'accessibilité bloque la publication.

**Independent Test** : proposer une modification fautive et constater que la vérification échoue.

### Tests de la story

- [ ] T027 [P] [US2] Ajouter l'outillage d'accessibilité aux tests de composants dans `tests/setup/axe.ts` et un test d'accessibilité de l'accueil dans `tests/component/home.a11y.test.ts`

### Implémentation de la story

- [ ] T028 [P] [US2] Configurer ESLint dans `eslint.config.js` : TypeScript, Astro, React, `jsx-a11y`, et la règle interdisant les textes en dur dans les îlots
- [ ] T029 [P] [US2] Configurer Prettier dans `.prettierrc` avec les greffons Astro et Tailwind, plus `.prettierignore`
- [ ] T030 [US2] Installer le contrôle de pré-commit dans `.husky/pre-commit` et `package.json` via lint-staged, sur les fichiers modifiés uniquement
- [ ] T031 [US2] Créer `.github/workflows/ci.yml` : installation, lint, contrôle de types, tests unitaires et de composants, `npm run build:prod`, parcours Playwright, et dépôt des rapports en artefacts
- [ ] T032 [US2] Ajouter Lighthouse CI dans `lighthouserc.json` et son étape dans `.github/workflows/ci.yml`, sur `/` et `/en/`, seuils de 90 sur les quatre catégories
- [ ] T033 [P] [US2] Ajouter le contrôle de taille des scripts dans `package.json` et sa configuration, avec les seuils de [docs/technical-requirements.md](../../docs/technical-requirements.md)
- [ ] T034 [US2] Documenter dans [docs/devops.md](../../docs/devops.md) la protection de la branche principale et la vérification requise avant fusion

**Point de contrôle** : une proposition de modification fautive est refusée automatiquement.

---

## Phase 5: User Story 3 — Socle de contenu et de style (Priority: P3)

**Goal** : un format de fiche validé au build, un jeu de valeurs de style centralisé, et un contrôle des traductions.

**Independent Test** : rendre une fiche invalide et constater l'échec explicite, puis changer une couleur à un seul endroit.

### Tests de la story

- [ ] T035 [P] [US3] Tests des schémas de contenu dans `tests/unit/content-schema.test.ts` : champ obligatoire absent, `categoryId` inconnu, unité de prix incohérente avec les dimensions, plus de deux dimensions, deux dimensions de durée, `min` supérieur à `default`, montant nul ou négatif
- [ ] T036 [P] [US3] Test du contrôle des traductions dans `tests/unit/check-i18n.test.ts` : détection d'un champ anglais manquant, message citant le fichier et le champ, code de sortie non nul

### Implémentation de la story

- [ ] T037 [US3] Créer `src/content/config.ts` : collections `categories` et `services`, schémas Zod avec champs localisés et règles de [contracts/content-schema.md](./contracts/content-schema.md), dont l'accord entre `pricing.unit` et `quantity.dimensions`, au plus deux dimensions et au plus une durée
- [ ] T038 [P] [US3] Créer le contenu d'exemple `src/content/categories/nature-decouverte.json` et `src/content/services/excursion-en-pirogue.json`, tous deux marqués provisoires et référencés dans [docs/content-tracker.md](../../docs/content-tracker.md)
- [ ] T039 [US3] Écrire `scripts/check-i18n.ts` : parcours des dictionnaires et des fichiers de contenu, avertissement hors production, échec en production avec la liste des champs manquants, puis le brancher dans le script `build:prod` de `package.json`
- [ ] T040 [US3] Compléter `src/styles/tokens.css` avec toutes les catégories de [docs/design-system.md](../../docs/design-system.md), écrire `scripts/check-tokens.ts` qui vérifie les contrastes au niveau AA, et déclarer le script `tokens:check` dans `package.json`
- [ ] T041 [P] [US3] Créer la page de démonstration `src/pages/dev/ui.astro` listant couleurs, typographies, espacements et composants, exclue du plan du site, de l'indexation et du build de production
- [ ] T042 [US3] Ajouter un test d'intégration dans `tests/unit/build-guards.test.ts` : avec une fiche d'essai privée de sa traduction anglaise, `build:prod` échoue ; avec une variable d'environnement vide, le build échoue aussi

**Point de contrôle** : le socle accepte le contenu réel et la direction visuelle sans réécriture.

---

## Phase 6: User Story 4 — Environnement de développement reproductible (Priority: P4)

**Goal** : lancer et servir le site en conteneur, à l'identique de la production.

**Independent Test** : construire l'image, la démarrer, constater son état de santé.

**Prérequis** : Docker Desktop installé sur le poste. Cette phase ne bloque aucune autre.

- [ ] T043 [P] [US4] Écrire `docker/Dockerfile` en deux étapes : construction sur `node:22-alpine` avec `ARG PUBLIC_WHATSAPP_NUMBER` et `ARG PUBLIC_SITE_URL`, service sur `nginx:1.27-alpine`, utilisateur non privilégié, port 8080, contrôle de santé
- [ ] T044 [P] [US4] Écrire `docker/nginx.conf` : écoute sur 8080, point de contrôle `/healthz`, cache long sur les ressources empreintées et court sur le HTML, compression, en-têtes de sécurité, page d'erreur par répertoire
- [ ] T045 [P] [US4] Écrire `docker/compose.yml` avec un service de développement monté en volume et rechargement automatique, et un service servant l'image construite
- [ ] T046 [P] [US4] Écrire `docker/.dockerignore` pour exclure `node_modules`, `dist`, `.git`, `Elements` et les fichiers d'environnement
- [ ] T047 [US4] Dérouler les exercices 1 à 5 de [docs/devops.md](../../docs/devops.md) et consigner les réponses aux questions d'observation dans ce même document

---

## Phase 7: Polish et vérification finale

- [ ] T048 [P] Mettre à jour [quickstart.md](./quickstart.md) si une commande a changé pendant l'implémentation
- [ ] T049 Vérifier la publication sur l'hébergeur : construction réussie, accueil servi dans les deux langues, page d'erreur anglaise bien servie sous `/en/`, variables correctes
- [ ] T050 [P] Relever les scores d'audit sur `/` et `/en/` en ligne et les consigner dans [quickstart.md](./quickstart.md)
- [ ] T051 Ouvrir la proposition de modification de `001-project-foundation` vers `main` et vérifier que la vérification automatique s'exécute et conditionne la fusion

---

## Dépendances

```text
Phase 1 Setup
   ↓
Phase 2 Foundational   ← bloque toutes les stories
   ↓
   ├── US1 (P1)  ← MVP, livrable seul
   ├── US2 (P2)  ← dépend de US1 pour avoir quelque chose à vérifier
   ├── US3 (P3)  ← indépendante de US1 et US2
   └── US4 (P4)  ← indépendante, attend Docker Desktop
   ↓
Phase 7 Polish
```

Détail des dépendances internes :

- T009 dépend de T008. T011 dépend de T008 et T010. T013 dépend de T007 et T011.
- T020 dépend de T009. T023 et T024 dépendent de T013. T025 dépend de T007. T026 dépend de T009.
- T031 dépend de T014, T015, T028 et T029. T032 dépend de T031.
- T039 dépend de T010 et T037. T042 dépend de T039.
- T047 dépend de T043 à T046.

## Exécutions parallèles possibles

- Setup : T002, T003, T004 et T006 en parallèle après T001.
- Foundational : T008, T012, T014 et T015 en parallèle.
- US1 : les quatre tests T016 à T019 en parallèle, puis T021, T022 et T024 en parallèle.
- US2 : T027, T028, T029 et T033 en parallèle.
- US3 : T035, T036, T038 et T041 en parallèle.
- US4 : T043 à T046 en parallèle.

## Stratégie de livraison

1. **MVP** : phases 1, 2 et 3. Le site bilingue est en ligne et montrable à TKS.
2. **Deuxième incrément** : phase 4, la chaîne de vérification protège la suite.
3. **Troisième incrément** : phase 5, le socle est prêt à recevoir le contenu du client et la direction visuelle C.
4. **Quand Docker est installé** : phase 6.
5. **Clôture** : phase 7, puis fusion vers la branche principale.

## Total

51 tâches : 6 en setup, 9 en fondation, 11 pour US1, 8 pour US2, 8 pour US3, 5 pour US4, 4 en finition.
