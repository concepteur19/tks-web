# Implementation Plan: Coque du site Kibreeze et page d'accueil

**Branch**: `002-kibreeze-core` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-kibreeze-core/spec.md`

## Summary

Remplacer le squelette provisoire de 001 par la vraie coque Kibreeze et ses premières pages : en-tête, barre à onglets mobile, navigation ordinateur, pied de page aux quatre marques, bouton WhatsApp flottant ; accueil touristique conforme aux écrans validés ; page Contact ; page d'erreur ; trois pages légales. Tout est statique, sans JavaScript côté visiteur.

Trois mécanismes portent la feature ([research.md](./research.md)) :

1. **`IMPLEMENTED_ROUTES` comme source unique de l'état livré** : la navigation, le plan du site et les liens de l'accueil en dépendent. Un lien vers une page future devient un lien WhatsApp, et bascule tout seul quand la page est livrée.
2. **Photos optimisées au build** : passage au helper `image()` d'Astro et à `<Picture>`, photos de Franck redimensionnées et versionnées dans `src/assets/photos/`.
3. **Contenu hors des composants** : catégories et expériences mises en avant dans les collections existantes, coordonnées et identité légale dans `company.json`, textes légaux en Markdown bilingue, parité euro dans `currency.json`.

## Technical Context

**Language/Version**: TypeScript 5.x strict, Node.js 22 LTS

**Primary Dependencies**: Astro 5.18 (statique, `astro:assets` avec `sharp` 0.34 déjà installé), Tailwind CSS v4, Zod, `@astrojs/sitemap`. Aucune nouvelle dépendance

**Storage**: fichiers de contenu versionnés (JSON et Markdown), validés au build. Aucun stockage navigateur dans cette feature

**Testing**: Vitest (fonctions pures : `resolveLink`, `cardPrice`, `formatXaf`, `formatEurEquivalent`, `buildLocalBusinessJsonLd`, schémas), Vitest + axe (composants), Playwright (parcours, cookies, défilement, WhatsApp), Lighthouse CI, scripts `check-links` et `check-legal`

**Target Platform**: navigateurs modernes, mobile d'abord à 360 px ; Cloudflare Pages en production, image nginx en complément

**Project Type**: site statique multi-pages

**Performance Goals**: LCP du hero < 2,5 s en 4G émulée ; Lighthouse ≥ 90 sur les quatre catégories ; 0 kB de JavaScript sur les pages de cette feature

**Constraints**: aucun texte en dur, aucune valeur de style brute, arrondis ≤ 4 px, vert réservé à WhatsApp, aucune mention de livraison hors du nom « Breezy Delivery », aucun cookie

**Scale/Scope**: 6 routes par langue livrées (accueil, contact, 3 pages légales, 404), environ 15 photos optimisées, 3 catégories, 4 expériences

## Constitution Check

*GATE: vérifié avant la phase 0, revérifié après la phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Simple enough to ship | Aucune dépendance ajoutée. Pas de collections hébergements et formules anticipées : un fichier d'aperçu temporaire, supprimé par 005. Deux scripts de contrôle maison courts plutôt que des outils externes | ✅ |
| II. Specification-first | Plan issu de [spec.md](./spec.md), qui référence FR-LAND-1 à 7, FR-WA-7, FR-EUR-1 à 3, FR-SEO-1 à 3 et FR-I18N-* | ✅ |
| III. Business logic is pure and tested | Formatage des prix et conversion en euros dans `src/features/estimation/formatPrice.ts`, couverts à 100 % ; `resolveLink` et `cardPrice` purs et testés | ✅ |
| IV. Content is data, not code | Prix, textes, coordonnées, identité légale et parité dans `src/content/` ; chaînes d'interface dans les dictionnaires ; contrôle bilingue étendu aux documents légaux | ✅ |
| V. Mobile-first, accessible, fast | Conception à 360 px, aucune page dépendante de JavaScript, budgets Lighthouse et axe en CI, `prefers-reduced-motion` respecté | ✅ |
| VI. Design through tokens | Valeurs relevées dans [design-exports/](../../docs/design-exports/README.md) et portées en tokens (`--size-tabbar`, `--size-content`, hauteur du hero), aucune valeur brute dans les composants | ✅ |
| VII. DevOps isolated from production | `check-links` ajouté à la CI ; aucun changement d'infrastructure | ✅ |

Revérification après la phase 1 : les contrats et le modèle de données n'introduisent ni backend, ni dépendance, ni logique métier hors fonctions pures. Aucune violation.

## Project Structure

### Documentation (this feature)

```text
specs/002-kibreeze-core/
├── spec.md
├── plan.md              # ce fichier
├── research.md          # 12 décisions de mise en œuvre
├── data-model.md        # entités ajoutées ou modifiées
├── quickstart.md        # vérification et checklist de lancement
├── contracts/
│   ├── routes.md        # adresses, mise à jour de celui de 001
│   ├── content.md       # nouveaux fichiers et schémas
│   └── shell.md         # coque commune, contrat pour 003 à 006
├── checklists/
│   └── requirements.md
└── tasks.md             # produit par /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── assets/
│   ├── brand/                      # existant : logos Kibreeze ; + tks-mark.svg
│   └── photos/                     # nouveau : photos de Franck redimensionnées, par sujet
├── components/
│   ├── Header.astro                # remplace Nav.astro : logo, nav ordinateur, FR | EN, WhatsApp
│   ├── TabBar.astro                # nouveau : barre à onglets mobile
│   ├── Footer.astro                # refait : logo crème, liens, quatre marques, liens légaux
│   ├── LanguageSwitcher.astro      # existant
│   ├── WhatsAppButton.astro        # existant, positionné au-dessus de la barre à onglets
│   ├── SmartLink.astro             # nouveau : rend resolveLink (interne ou WhatsApp + icône)
│   ├── Price.astro                 # nouveau : montant, unité, équivalent euro, badge sur devis
│   ├── home/                       # sections de l'accueil
│   │   ├── Hero.astro
│   │   ├── CategoryCards.astro
│   │   ├── FeaturedCarousel.astro
│   │   ├── ImmersiveStrip.astro
│   │   ├── AccommodationTeaser.astro
│   │   ├── PackagesTeaser.astro
│   │   ├── MobilityStrip.astro
│   │   ├── About.astro
│   │   └── WhatsAppCta.astro
│   └── legal/
│       └── PublisherIdentity.astro # bloc éditeur depuis company.json
├── content/
│   ├── categories/                 # 3 fichiers, avec image
│   ├── services/                   # 4 expériences mises en avant
│   ├── site/                       # company.json, currency.json, home.json
│   ├── legal/{fr,en}/              # legal-notice.md, privacy.md, terms.md
│   └── schemas.ts                  # + companySchema, currencySchema, homeSchema, legalSchema
├── features/
│   └── estimation/
│       └── formatPrice.ts          # formatXaf, formatEurEquivalent (purs)
├── i18n/
│   ├── routes.ts                   # + contact, legalNotice, privacy, terms livrées
│   ├── navigation.ts               # nouveau : listes de navigation, resolveLink
│   ├── fr.ts / en.ts               # + nav, accueil, contact, légal, prix
├── layouts/
│   └── BaseLayout.astro            # + routeKey, ogImage, floatingWhatsApp, jsonLd, TabBar
├── lib/
│   ├── catalog.ts                  # nouveau : accès typé aux collections, cardPrice
│   └── seo.ts                      # + buildLocalBusinessJsonLd, og:image
├── pages/
│   ├── index.astro, contact.astro, 404.astro
│   ├── mentions-legales.astro, confidentialite.astro, conditions-utilisation.astro
│   └── en/
│       ├── index.astro, contact.astro, 404.astro
│       └── legal-notice.astro, privacy.astro, terms-of-use.astro
└── styles/
    └── tokens.css                  # + tailles de coque et du hero

scripts/
├── check-links.mjs                 # nouveau
└── check-legal.ts                  # nouveau

tests/
├── unit/                           # navigation, format-price, card-price, seo-jsonld, schémas étendus
├── component/                      # header, tab-bar, footer, price (axe)
└── e2e/                            # home, contact, legal, shell (cookies, WhatsApp, 360 px, clavier)
```

**Structure Decision**: projet unique, conforme à [architecture.md](../../docs/architecture.md). `src/features/estimation/` est créé ici pour le seul `formatPrice.ts`, que la feature 004 complétera avec `computeEstimate`. `Nav.astro` est renommé `Header.astro` parce qu'il porte désormais plus que la navigation ; les tests de 001 qui le ciblent sont mis à jour. Les pages françaises et anglaises restent des fichiers distincts, sur le modèle de 001, chacune réduite à un appel de composant partagé.

## Découpage par user story

| Story | Livrable | Bloquée par le client ? |
|---|---|---|
| US1 — accueil (P1) | photos, catégories, expériences mises en avant, aperçus, `formatPrice`, sections de l'accueil | Non |
| US2 — WhatsApp et Contact (P2) | bouton flottant repositionné, `SmartLink`, page Contact, `company.json` | Non ; e-mail et réseaux omis tant qu'ils manquent |
| US3 — coque et navigation (P3) | `Header`, `TabBar`, `Footer`, `navigation.ts`, 404 refaite | Non |
| US4 — référencement (P4) | image de partage, JSON-LD, plan du site, `check-links` | Non |
| US5 — pages légales (P5) | collection `legal`, trois pages × deux langues, `PublisherIdentity`, `check-legal`, test cookies | **Pour le lancement seulement** : identité de l'éditeur (K3) |

Ordre de réalisation conseillé, différent de l'ordre de priorité : US3 d'abord, parce que l'accueil se construit dans la coque ; puis US1, US2, US4, US5. Chaque story reste testable seule : la coque se vérifie sur l'accueil provisoire de 001.

## Complexity Tracking

Aucune violation de la constitution, cette section reste vide.
