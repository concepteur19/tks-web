# Architecture frontend

**Statut** : draft · **Date** : 2026-09-13 · Décisions détaillées dans [technical-decisions.md](./technical-decisions.md)

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

**Décision : Astro 5 avec îlots React** (ADR-001).

## 3. Stack retenue

| Couche | Choix | Rôle | ADR |
|---|---|---|---|
| Framework | Astro 5, sortie `static` | Routes, layouts, rendu HTML, images, sitemap | 001 |
| Interactivité | React 19 via `@astrojs/react`, hydratation `client:idle` ou `client:visible` | Sélection, drawer, steppers, toasts | 001 |
| Langage | TypeScript strict | Partout | — |
| Styles | Tailwind CSS v4 + tokens en CSS custom properties (`@theme`) | Design system alimenté par Figma | 003 |
| État partagé | nanostores + `@nanostores/persistent` + `@nanostores/react` | Sélection visible depuis tous les îlots (badge nav, drawer, page) | 002 |
| Données | Astro Content Collections (`glob` loader) avec schémas Zod | Catalogue validé au build | 004 |
| Validation runtime | Zod | Sélection persistée, variables d'environnement | 004 |
| Internationalisation | i18n natif Astro, français sans préfixe et anglais sous `/en/`, dictionnaires TypeScript typés sans librairie | Routes, chaînes d'interface, contenu localisé | 013 |
| Images | `astro:assets` (Sharp) | AVIF/WebP, `srcset`, dimensions | — |
| SEO | Layout central + `@astrojs/sitemap` + JSON-LD généré | Métadonnées, sitemap, structured data | — |
| Animations | CSS, `prefers-reduced-motion`, View Transitions Astro si pertinent | Transitions légères ; Motion seulement si Figma l'exige | — |
| Formulaires | Aucun en V1 (deux champs contrôlés dans l'îlot séjour) | — | — |
| Composants UI | Maison, typés, sans librairie | Le design vient de Figma ; une lib imposerait son style | — |
| Tests | Vitest + Testing Library + Playwright + axe | Voir [testing-strategy.md](./testing-strategy.md) | 010 |
| Qualité | ESLint (ts, astro, react, jsx-a11y) + Prettier (plugin astro, tailwind) + Husky/lint-staged | Pré-commit et CI | — |
| CI/CD | GitHub Actions | Lint, test, build, Lighthouse, déploiement, image Docker | 009 |
| Hébergement | Cloudflare, Worker d'assets statiques | Prod, aperçus par branche | 007 |
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
│   ├── pages/                # routes FR : index, transport, tourisme, livraison, sejour, contact, services/[slug], 404
│   │   └── en/               # routes EN : index, transport, tourism, delivery, my-trip, contact, services/[slug]
│   ├── layouts/              # BaseLayout.astro (head SEO, nav, footer, WhatsApp flottant)
│   ├── components/           # composants Astro statiques : Hero, PoleCard, ServiceCard, PriceTag, Section, Footer, Nav
│   ├── features/
│   │   ├── selection/        # store.ts (nanostores), SelectionBadge.tsx, SelectionDrawer.tsx, SelectionPage.tsx, AddToStay.tsx, QuantityStepper.tsx, hooks
│   │   ├── estimation/       # computeEstimate.ts, formatPrice.ts (pur TS)
│   │   └── whatsapp/         # buildMessage.ts, buildUrl.ts, WhatsAppButton.astro (pur TS + un composant)
│   ├── content/
│   │   ├── config.ts         # schémas Zod des collections
│   │   ├── services/         # un JSON par service + images/
│   │   ├── categories/       # un JSON par catégorie
│   │   └── site/             # poles.json, company.json (textes localisés, coordonnées)
│   ├── i18n/                 # fr.ts (dictionnaire source), en.ts (satisfies Dictionary), routes.ts (clé → slugs FR / EN), t.ts (t(), pluriels, localize)
│   ├── lib/                  # catalog.ts (accès typé aux collections), env.ts (variables validées), seo.ts, analytics.ts (trackEvent no-op)
│   ├── styles/               # tokens.css (@theme), global.css
│   └── types/                # types dérivés des schémas, réexportés
├── tests/
│   ├── unit/                 # estimation, whatsapp, store
│   ├── component/            # îlots React
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
                                         └──► catalogue sérialisé minimal (id, title dans la langue de la page, pricing, quantity, availability)
                                                     injecté dans l'îlot de sélection, avec `locale` et ses chaînes
                                                                 │
localStorage ◄──persistent──► selectionStore (nanostores) ◄──────┘
                                   │
                                   ├──► computeEstimate(selection, catalog) ──► PriceEstimate ──► UI (badge, drawer, page)
                                   │
                                   └──► buildSelectionMessage(estimate, stay) ──► buildWhatsAppUrl ──► <a href="https://wa.me/...">
```

Les îlots ne reçoivent que le sous-ensemble du catalogue nécessaire au calcul (pas les descriptions ni les images), pour garder `/sejour` sous 80 kB de JavaScript. De même, ils ne reçoivent que les chaînes d'interface de la langue de la page.

## 6. Îlots React et hydratation

| Îlot | Où | Directive | Pourquoi |
|---|---|---|---|
| `SelectionBadge` | Nav, toutes pages | `client:idle` | Doit refléter le stockage local dès que possible sans bloquer le rendu |
| `AddToStay` (stepper + bouton) | Fiche | `client:visible` | Interaction principale de la fiche |
| `SelectionDrawer` | Layout desktop | `client:idle` | Ouvert depuis le badge |
| `SelectionPage` | `/sejour` | `client:load` | C'est tout le contenu de la page |
| `Toaster` | Layout | `client:idle` | Retour d'action |
| `WhatsAppButton` | Partout | Astro statique (lien) ; la version avec sélection est dans les îlots ci-dessus | Pas de JS pour un lien |

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
