# Architecture frontend

**Statut** : draft · **Date** : 2026-09-13, mise à jour le 2026-10-06 (004) · Décisions détaillées dans [technical-decisions.md](./technical-decisions.md)

## 1. Nature du projet

Un **site statique multi-pages** (une dizaine de routes plus une fiche par service) avec **une seule zone réellement interactive** : la sélection « Mon séjour » et sa conversion WhatsApp. Le reste est du contenu, publié en français et en anglais. L'architecture doit donc servir du HTML rapide et indexable par défaut, et n'envoyer du JavaScript que là où l'interaction l'exige.

## 2. Options évaluées

| Critère | Astro 5 + îlots React | Next.js 15 (export statique) | Vite + React (SPA) |
|---|---|---|---|
| JavaScript par défaut | Zéro ; îlots hydratés à la demande | Runtime React sur chaque page (~90 kB) | Runtime React + routeur |
| SEO | HTML complet au build | HTML complet au build | Nécessite un prérendu ajouté |
| Contenu structuré | Content Collections natives, schéma Zod, images optimisées au build | À assembler (fichiers + validation maison) | À assembler |
| Panier inter-pages | nanostores partagé entre îlots | Context ou store classique | Store classique |
| Figma → code | Composants React possibles pour les îlots ; composants Astro pour le statique | Tout React | Tout React |
| Courbe d'apprentissage | Deux syntaxes (Astro + React) | Une syntaxe, mais App Router complexe | Une syntaxe |
| Docker / hébergement | Dossier `dist/` servi par n'importe quoi | Dossier `out/`, quelques limitations (images, middleware) | Dossier `dist/` |
| Évolution vers backend | Adaptateur SSR activable page par page | Natif | Ajout d'un serveur séparé |
| Adéquation au projet | **Très bonne** : vitrine + un îlot | Bonne, mais surdimensionné | Faible : SEO et perf |

**Décision : Astro 5 avec îlots React** (ADR-001), îlots finalement écrits en **Preact** (ADR-016) : même API à hooks et même JSX, pour environ 4 Ko au lieu de 115 Ko de moteur React.

## 3. Stack retenue

| Couche | Choix | Rôle | ADR |
|---|---|---|---|
| Framework | Astro 5, sortie `static` | Routes, layouts, rendu HTML, images, sitemap | 001 |
| Interactivité | Preact 10 via `@astrojs/preact`, hydratation `client:load`, `client:idle` ou `client:visible` | Sélection, steppers, compteur, messages | 016 |
| Langage | TypeScript strict | Partout | — |
| Styles | Tailwind CSS v4 + tokens en CSS custom properties (`@theme`) | Design system alimenté par Figma | 003 |
| État partagé | nanostores + `@nanostores/persistent` + `@nanostores/preact` | Sélection visible depuis tous les îlots (compteur, fiche, page Mon séjour) | 002 |
| Données | Astro Content Collections (`glob` loader) avec schémas Zod | Catalogue validé au build | 004 |
| Validation runtime | Zod | Sélection persistée, variables d'environnement | 004 |
| Internationalisation | i18n natif Astro, français sans préfixe et anglais sous `/en/`, dictionnaires TypeScript typés sans librairie | Routes, chaînes d'interface, contenu localisé | 013 |
| Images | `astro:assets` (Sharp) | AVIF/WebP, `srcset`, dimensions | — |
| SEO | Layout central + `@astrojs/sitemap` + JSON-LD généré | Métadonnées, sitemap, structured data | — |
| Animations | CSS, `prefers-reduced-motion`, View Transitions Astro si pertinent | Transitions légères ; Motion seulement si Figma l'exige | — |
| Formulaires | Aucun en V1 (deux champs contrôlés dans l'îlot séjour) | — | — |
| Composants UI | Maison, typés, sans librairie | Le design vient de Figma ; une lib imposerait son style | — |
| Tests | Vitest + Testing Library + Playwright + axe | Voir [testing-strategy.md](./testing-strategy.md) | 010 |
| Qualité | ESLint (ts, astro, jsx-a11y ; aucun texte en dur dans le JSX) + Prettier (plugin astro, tailwind) + Husky/lint-staged | Pré-commit et CI | — |
| CI/CD | GitHub Actions | Lint, test, build, Lighthouse, déploiement, image Docker | 009 |
| Hébergement | Cloudflare Pages | Prod, aperçus par PR | 007 |
| Conteneurs | Docker (nginx) + kind | Dev reproductible, CI, labo Kubernetes | 006, 008 |

## 4. Arborescence

```text
.
├── .specify/                 # Spec Kit (constitution, templates, scripts)
├── .claude/skills/           # commandes /speckit-*
├── docs/                     # documentation de discovery et de décision
├── specs/                    # une feature Spec Kit par dossier
├── public/                   # favicon, robots.txt, images statiques non optimisées
├── src/
│   ├── pages/                # routes FR livrées : index, contact, mentions-legales, confidentialite, conditions-utilisation, 404 (002), experiences, experiences/[slug] (003) ; à venir : hebergements, formules, mobilite, sejour
│   │   └── en/               # routes EN : index, contact, legal-notice, privacy, terms-of-use, 404, experiences, experiences/[slug] ; à venir : accommodation, packages, mobility, my-trip
│   ├── layouts/              # BaseLayout.astro (head SEO, nav, footer, WhatsApp flottant)
│   ├── components/           # coque (Header, TabBar, Footer, SmartLink, Price, BrandLogo, Icon), sections de l'accueil (home/), catalogue (experiences/), contact/, legal/
│   ├── features/
│   │   ├── selection/        # store.ts (nanostores), SelectionBadge.tsx, SelectionDrawer.tsx, SelectionPage.tsx, AddToStay.tsx, QuantityStepper.tsx, hooks
│   │   ├── estimation/       # formatPrice.ts et cardPrice.ts (002), computeEstimate.ts (004) — pur TS
│   │   ├── catalog/          # relatedExperiences.ts (003) — pur TS
│   │   └── whatsapp/         # buildServiceRequestMessage.ts (003), buildSelectionMessage.ts (004) — pur TS
│   ├── content/
│   │   ├── config.ts         # schémas Zod des collections
│   │   ├── services/         # un JSON par service + images/
│   │   ├── categories/       # un JSON par catégorie
│   │   ├── legal/            # documents légaux Markdown, fr/ et en/ (002)
│   │   └── site/             # company.json (coordonnées, identité légale), currency.json (parité euro), home.json (aperçus temporaires)
│   ├── i18n/                 # fr.ts (dictionnaire source), en.ts (satisfies Dictionary), routes.ts (clé → slugs FR / EN), t.ts (t(), pluriels, localize)
│   ├── lib/                  # catalog.ts (accès typé aux collections), env.ts (variables validées), seo.ts, analytics.ts (trackEvent no-op)
│   ├── styles/               # tokens.css (@theme), global.css
│   └── types/                # types dérivés des schémas, réexportés
├── tests/
│   ├── unit/                 # estimation, whatsapp, store
│   ├── component/            # composants Astro (*.test.ts) et îlots Preact (*.test.tsx)
│   └── e2e/                  # Playwright
├── docker/                   # Dockerfile, nginx.conf, compose
├── k8s/                      # manifests kustomize (labo)
├── .github/workflows/        # ci.yml, deploy.yml, docker.yml
├── astro.config.mjs
├── tailwind / postcss (v4 : via @tailwindcss/vite)
├── tsconfig.json
└── package.json
```

Ce qui est volontairement absent : `hooks/` et `utils/` génériques (les hooks vivent dans leur feature ; `lib/` suffit), `app/`, `services/` (pas d'API), `store/` global (le seul store est celui de la sélection).

## 5. Flux de données

```text
                   build                                  runtime (navigateur)
src/content/services/*.json ──Zod──► collections ──► pages HTML statiques
                                         │
                                         └──► catalogue minimal (id, titres FR / EN, prix ou tarifs, quantités, capacité, vignette)
                                                     publié une fois par page : <script type="application/json" id="kibreeze-catalog">
                                                                 │
localStorage ◄──persistent──► selectionStore (nanostores) ◄──────┘
                                   │
                                   ├──► computeEstimate(selection, catalog) ──► PriceEstimate ──► UI (fiche, page Mon séjour)
                                   │
                                   └──► buildSelectionMessage(estimate, stay) ──► buildWhatsAppUrl ──► <a href="https://wa.me/...">
```

Les îlots ne reçoivent que le sous-ensemble du catalogue nécessaire au calcul et à l'affichage compact (pas les descriptions ni les galeries). Le catalogue est complet sur chaque page : un catalogue partiel ferait purger, à la relecture du stockage, les lignes des expériences absentes. Les deux dictionnaires (environ 5 Ko compressés) sont inclus dans le code des îlots. Pages de contenu : 20 à 24 Ko de JavaScript compressé, pour un budget de 50 Ko (80 Ko sur `/sejour`).

## 6. Îlots Preact et hydratation

Code dans `src/features/selection/`. Les règles (sélection, estimation, message) sont des fonctions pures testées à 100 % ; les îlots ne font que les appliquer.

| Îlot | Où | Directive | Pourquoi |
|---|---|---|---|
| `StayBadge` | Onglet Mon séjour et icône de l'en-tête, toutes pages | `client:idle` | Reflète le stockage local sans bloquer le rendu ; pastille en position absolue, sans décalage |
| `ExperienceConfigurator` | Fiche, rubrique « Votre réservation » | `client:load` | Quantités, tarif, options ; rendu côté serveur avec les valeurs par défaut |
| `RequestBar` | Fiche, barre fixe (téléphone) et carte collante (ordinateur) | `client:load` | Total, « Ajouter à mon séjour », « Demander ce service » ; partage la configuration avec le configurateur par `$draft` |
| `QuickAdd` | Cartes de la liste et de l'accueil | `client:visible` | Ajout en un geste avec les valeurs par défaut |
| `StayPage` | `/sejour`, `/en/my-trip` | `client:only="preact"` | Toute la page dépend du stockage local ; `<noscript>` propose WhatsApp |
| `Toasts` | Layout | `client:idle` | Confirmations en région `aria-live` |
| `WhatsAppButton` | Partout | Astro statique (lien), masqué quand le séjour contient des lignes | Pas de JS pour un lien |

Sans JavaScript, la fiche garde le lien « Demander ce service » de la 003 dans un `<noscript>`.

## 7. Extension future

| Besoin V2/V3 | Impact sur l'architecture |
|---|---|
| Packs | Nouvelle collection `packs`, action `addPack` dans le store, page `/formules` |
| Hébergements | Nouvelle catégorie Tourisme, `per_night` dans `PriceUnit` |
| Champs de qualification par service | Extension de `SelectedService` avec `details`, versions du schéma persisté |
| Formulaire de contact | Service tiers (Formspree, Resend via Cloudflare Function) ou activation de l'adaptateur SSR sur une route |
| CMS headless | Remplacer le loader `glob` par un loader distant (Keystatic en git-based reste dans le dépôt ; Sanity/Payload via API) sans changer les schémas ni les composants |
| Analytics | Implémenter `lib/analytics.ts` (Plausible, Umami) |

## Documents liés

- [technical-decisions.md](./technical-decisions.md)
- [data-model.md](./data-model.md)
- [design-system.md](./design-system.md)
- [devops.md](./devops.md)
