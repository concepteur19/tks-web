# Décisions techniques (ADR)

**Statut** : draft · **Date** : 2026-09-13

Format : Context / Decision / Alternatives considered / Consequences / Status. Toute nouvelle dépendance ou choix structurant ajoute un ADR ici. Un ADR n'est jamais modifié après acceptation : il est remplacé par un nouvel ADR qui le référence.

---

## ADR-001 — Framework : Astro 5 avec îlots React

**Context.** Site vitrine multi-pages, SEO important, une seule zone interactive (sélection + WhatsApp), pas de backend en V1, hébergement statique. Le design vient de Figma, dont les outils de génération de code produisent surtout du React/Tailwind.

**Decision.** Astro 5 en sortie statique. Le contenu est rendu en composants Astro (zéro JavaScript). L'interactivité est portée par des îlots React hydratés à la demande.

**Alternatives considered.**
- *Next.js 15 avec `output: 'export'`* : écosystème riche, tout en React, mais le runtime React est chargé sur chaque page de contenu, l'export statique impose des contournements (images, redirections) et l'App Router est complexe pour ce besoin.
- *Vite + React (SPA)* : le plus simple à comprendre, mais pas de HTML au build sans prérendu supplémentaire, ce qui pénalise le SEO par service.
- *SvelteKit / Nuxt* : excellents, mais s'éloignent de l'écosystème React utile pour Figma-to-code et pour l'apprentissage transférable.

**Consequences.** Deux syntaxes à maîtriser (Astro + React). Le partage d'état entre îlots impose un store externe (ADR-002). Les pages restent très légères et le site peut évoluer vers du SSR partiel en activant un adaptateur.

**Status.** Accepted (2026-09-13).

---

## ADR-002 — État de la sélection : nanostores + persistance

**Context.** La sélection doit être visible depuis plusieurs îlots indépendants (badge dans la nav, drawer, page Mon séjour, bouton d'ajout sur la fiche) et survivre à la navigation entre pages statiques et à la fermeture du navigateur.

**Decision.** `nanostores` (store atomique, ~300 octets) avec `@nanostores/persistent` pour la synchronisation `localStorage` et `@nanostores/react` pour l'abonnement dans les îlots. Les opérations (add, merge, update, remove, clear, hydrate) sont des fonctions pures testées, le store ne fait que les appliquer.

**Alternatives considered.**
- *React Context* : ne traverse pas les frontières d'îlots ; chaque îlot est une racine React distincte.
- *Zustand* : très bon, mais plus lourd et conçu pour une seule arborescence React ; nanostores est la recommandation officielle Astro pour ce cas.
- *State local + événements DOM* : fragile, non typé.

**Consequences.** Le format persisté est versionné et validé par Zod à l'hydratation. Une migration de schéma est une fonction `migrate(v, data)`. Le mode dégradé sans `localStorage` est géré par un try/catch autour de la persistance.

**Status.** Accepted.

---

## ADR-003 — Styling : Tailwind CSS v4 avec tokens CSS

**Context.** Le design sera livré dans Figma avec des variables. Il faut un système où les valeurs Figma se reportent en un seul endroit et où les composants ne contiennent aucune valeur brute.

**Decision.** Tailwind CSS v4 via `@tailwindcss/vite`, tokens définis dans `src/styles/tokens.css` avec `@theme`. Les composants Astro et React utilisent les classes utilitaires dérivées des tokens. Prettier avec le plugin Tailwind pour l'ordre des classes.

**Alternatives considered.**
- *CSS Modules* : bon isolement, mais duplication des tokens et plus de fichiers.
- *vanilla-extract / Panda CSS* : typage fort, mais outillage supplémentaire pour un bénéfice faible sur un site de cette taille.
- *Librairie de composants (shadcn, Radix Themes)* : imposerait un style à retravailler ; Radix Primitives reste envisageable ponctuellement pour le drawer (accessibilité) si le besoin se confirme.

**Consequences.** Dépendance à Tailwind v4 (stable depuis 2025). Les tokens sont la seule interface avec Figma.

**Status.** Accepted.

---

## ADR-004 — Données du catalogue : Content Collections Astro, pas de CMS en V1

**Context.** Le CDC demande un catalogue évolutif sans modification de code et, à terme, une administration. Le MVP n'a pas de backend.

**Decision.** Un fichier JSON par service et par catégorie dans `src/content/`, validé au build par des schémas Zod (Content Layer, loader `glob`). Les types TypeScript sont dérivés de ces schémas. Modifier un prix = modifier une ligne de JSON et déployer (automatique via CI).

**Alternatives considered.**
- *CMS headless hébergé (Sanity, Contentful, Strapi Cloud)* : répond à l'admin, mais coût, dépendance, et complexité prématurée avant que le catalogue soit stabilisé.
- *CMS git-based (Keystatic, Decap)* : bon candidat V3 ; il édite exactement les fichiers de la V1, ce qui rend la migration triviale.
- *Google Sheets comme source* : séduisant pour le client, fragile (schéma non contraint), reporté.

**Consequences.** En V1, le développeur reste dans la boucle des changements de catalogue, avec un délai de quelques minutes. La V3 remplace le loader par un CMS sans toucher aux composants.

**Status.** Accepted.

---

## ADR-005 — Conversion WhatsApp : lien `wa.me` prérempli

**Context.** Le CDC veut un message récapitulatif automatique envoyé à TKS. Pas de backend.

**Decision.** Génération côté client d'un lien `https://wa.me/<numéro>?text=<message>` ouvert dans un nouvel onglet. Le message est produit par une fonction pure, testée, limitée à 1 800 caractères encodés. Le numéro est une variable de build.

**Alternatives considered.**
- *WhatsApp Business API (Cloud API)* : permet d'envoyer des messages depuis le site, mais nécessite un backend, une validation Meta et des coûts ; hors scope V1.
- *Formulaire e-mail* : ne correspond pas au canal du client.

**Consequences.** Le site ne sait pas si le message a été envoyé. La mesure de conversion se limite au clic (analytics V2). Le visiteur peut modifier le message avant envoi, ce qui est souhaitable.

**Status.** Accepted.

---

## ADR-006 — Docker : image nginx multi-stage, pour le dev, la CI et le labo

**Context.** Objectif d'apprentissage DevOps. Un site statique n'a pas besoin de conteneur pour être hébergé sur Cloudflare Pages.

**Decision.** Un `Dockerfile` multi-stage (build Node 22 → nginx alpine) avec `HEALTHCHECK`, une config nginx durcie, un `docker-compose.yml` pour le dev (hot reload) et un profil « prod-like ». L'image est construite en CI et publiée sur GHCR à chaque tag. Elle sert de base au labo Kubernetes et de solution de repli pour un VPS.

**Alternatives considered.**
- *Pas de Docker* : moins d'apprentissage, et aucune option de repli hors PaaS.
- *Image Node servant le site (`astro preview`)* : plus lourde, moins représentative d'une prod statique.

**Consequences.** Un artefact de plus à maintenir. La valeur pédagogique est documentée dans [devops.md](./devops.md).

**Status.** Accepted.

---

## ADR-007 — Hébergement de production : Cloudflare Pages

**Context.** Site statique, client au Cameroun, budget serré, besoin d'HTTPS, de CDN et de déploiement automatique.

**Decision.** Cloudflare Pages connecté au dépôt GitHub : déploiement de `main` en production, aperçu par pull request, en-têtes de sécurité via `_headers`, redirections via `_redirects`. Nom de domaine géré chez Cloudflare (DNS gratuit).

**Alternatives considered.**
- *Netlify / Vercel* : équivalents ; Cloudflare a la meilleure couverture CDN en Afrique et pas de limite de bande passante sur l'offre gratuite.
- *VPS + Docker* : plus d'apprentissage en prod, mais maintenance, sécurité et coût à la charge du développeur ; conservé comme repli documenté.
- *Kubernetes managé* : surdimensionné, coût mensuel injustifié pour un site statique.

**Consequences.** Dépendance à un fournisseur, mais l'artefact `dist/` est portable et l'image Docker existe. Le formulaire de contact V2 pourra utiliser une Cloudflare Function.

**Status.** Accepted.

---

## ADR-008 — Kubernetes : labo local uniquement (kind)

**Context.** Objectif d'apprentissage Kubernetes explicite. Un site statique en prod n'en a pas besoin.

**Decision.** Kubernetes n'est **pas** utilisé en production. Un cluster local `kind` héberge le labo : namespace, Deployment (2 réplicas, probes, ressources, rolling update), Service, ConfigMap, Secret d'exemple, Ingress nginx, organisés en Kustomize `base/` + `overlays/local`. Les manifests vivent dans `k8s/` et sont clairement marqués pédagogiques.

**Alternatives considered.**
- *Minikube* : équivalent, plus lourd ; kind est plus rapide à créer et détruire.
- *Docker Desktop Kubernetes* : simple, mais mono-nœud non configurable ; kind permet un cluster multi-nœuds pour observer le scheduling.
- *K8s managé en prod* : rejeté, voir ADR-007.

**Consequences.** Les manifests sont écrits comme s'ils étaient destinés à la prod (bonnes pratiques), pour que l'apprentissage soit transférable. Ils ne sont pas dans le chemin de déploiement.

**Status.** Accepted.

---

## ADR-009 — CI/CD : GitHub Actions

**Context.** Dépôt hébergé sur GitHub (à créer), besoin de lint, tests, build, audit et déploiement automatiques.

**Decision.** Trois workflows : `ci.yml` (push et PR : lint, typecheck, unit, build, e2e, Lighthouse CI), `deploy.yml` (Cloudflare Pages gère le déploiement via son intégration Git ; le workflow ne fait que publier le statut), `docker.yml` (tags `v*` : build multi-arch et push sur GHCR). Dependabot pour les mises à jour.

**Alternatives considered.** GitLab CI (le dépôt n'y est pas), CircleCI (sans valeur ajoutée ici).

**Consequences.** Secrets limités au token GHCR (fourni par GitHub) ; aucun secret Cloudflare dans les workflows grâce à l'intégration Git.

**Status.** Accepted.

---

## ADR-010 — Tests : Vitest, Testing Library, Playwright, axe

**Context.** Logique métier critique (estimation, message), interactions d'îlots, parcours de conversion.

**Decision.** Vitest pour les fonctions pures et le store ; Testing Library pour les îlots React ; Playwright pour trois parcours E2E ; `axe-core` intégré aux tests de composants et E2E ; Lighthouse CI sur l'aperçu de build.

**Alternatives considered.** Jest (plus lent avec ESM/Vite), Cypress (plus lourd que Playwright), pas de E2E (risque sur le parcours de conversion).

**Consequences.** Voir [testing-strategy.md](./testing-strategy.md).

**Status.** Accepted.

---

## ADR-011 — Forme du site : multi-pages léger plutôt que landing one-page

**Context.** Le brief initial parlait de « landing page interactive » ; le CDC et le croquis décrivent 8 rubriques et des fiches détail.

**Decision.** Site multi-pages léger : `/`, `/transport`, `/tourisme`, `/livraison`, `/services/<slug>`, `/sejour`, `/contact`. « À propos » est une section de l'accueil. « Formules » est reporté en V2.

**Alternatives considered.**
- *One-page avec ancres et drawer* : plus simple, mais une seule URL indexable, pas de fiche par service, moins fidèle au croquis.
- *Hybride (one-page + fiches)* : compromis, mais la navigation devient incohérente entre ancres et pages.

**Consequences.** Une URL par service pour le SEO local ; la navigation doit rester légère pour ne pas perdre l'effet « landing » (peu de pages, CTA partout).

**Status.** Accepted.

---

## ADR-012 — Méthode : Specification-Driven Development avec Spec Kit

**Context.** Le projet doit être piloté par des spécifications versionnées, avec une séparation produit / fonctionnel / technique / tâches.

**Decision.** Spec Kit (`.specify/`, skills `/speckit-*`) avec une feature par dossier `specs/00X-<nom>/` contenant `spec.md` (quoi et pourquoi), `plan.md` + `research.md` + `data-model.md` (comment), `tasks.md` (tâches). La constitution du projet encode les principes de simplicité. Les documents `docs/` restent la vue transverse ; les specs référencent les `FR-xxx`.

**Alternatives considered.** Documentation ad hoc (dérive rapide), BDD/Gherkin seul (ne couvre pas la partie technique).

**Consequences.** Un peu de cérémonie par feature, compensée par des tâches claires et des critères d'acceptation testables.

**Status.** Accepted.

---

## Décisions en attente

| Sujet | Dépend de | Échéance |
|---|---|---|
| Nom de domaine et DNS | Question F8 | Avant mise en ligne |
| Analytics (Plausible, Umami, aucun) | Objectif = demandes WhatsApp (client A1) : mesurer le clic devient utile | V2 |
| Formulaire de contact (Cloudflare Function, Formspree) | Client D3 : formulaires détaillés en V2 | V2 |
| Vidéo de hero | Fourniture d'une vidéo courte par le client (G4) | V1 si reçue avant le design, sinon V2 |
| Radix Primitives pour le drawer | Complexité réelle du drawer Figma | Spec 004 |
