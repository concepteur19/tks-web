# TKS Web Constitution

Site vitrine interactif de TKS® (Kribi, Cameroun) : découvrir des services, en sélectionner plusieurs, obtenir une estimation, envoyer la demande sur WhatsApp. Cette constitution fixe les principes que toute spec, tout plan et toute tâche doivent respecter.

## Core Principles

### I. Simple enough to ship
Le MVP est un site statique sans backend, sans base de données, sans authentification. Toute fonctionnalité qui exige l'un de ces éléments est hors MVP et passe par la roadmap (`docs/roadmap.md`). Aucune abstraction, dossier ou dépendance n'est ajouté sans un besoin démontré dans la spec courante. « On pourrait en avoir besoin plus tard » n'est pas une justification.

### II. Specification-first
Aucune implémentation ne commence sans une spec validée (`specs/00X-*/spec.md`) qui référence les exigences `FR-xxx` de `docs/functional-requirements.md`. Les ambiguïtés sont documentées avec une hypothèse marquée, jamais résolues silencieusement dans le code. Le client valide le produit (spec), pas le code.

### III. Business logic is pure and tested (NON-NEGOTIABLE)
La sélection, l'estimation et la génération du message WhatsApp sont des fonctions TypeScript pures, sans React ni DOM, couvertes à 100 % par des tests unitaires. L'interface ne fait qu'afficher leurs résultats. Toute règle métier vit dans `src/features/*/` et dans `docs/data-model.md`.

### IV. Content is data, not code
Le catalogue (services, catégories, textes du site) vit dans `src/content/` sous forme de fichiers validés par un schéma au build. Modifier un prix ou une description ne touche jamais un composant. Les chaînes d'interface sont centralisées. Aucun placeholder (`[PLACEHOLDER]`) ne doit atteindre la production : le build de release le vérifie.

### V. Mobile-first, accessible, fast
Chaque écran est conçu pour 360 px d'abord. Navigation clavier complète, WCAG 2.2 AA, `prefers-reduced-motion` respecté. Budgets : Lighthouse ≥ 90 sur les quatre catégories, JavaScript ≤ 50 kB gzip sur une page de contenu. Le HTML est complet sans JavaScript ; seule la sélection en dépend.

### VI. Design comes from Figma, through tokens
Aucune valeur brute de couleur, taille, espacement ou durée dans les composants. Tout passe par `src/styles/tokens.css`. Le design system (`docs/design-system.md`) décrit la structure ; Figma fournit les valeurs.

### VII. DevOps for learning, isolated from production
La production est un déploiement statique (Cloudflare Pages). Docker sert au dev, à la CI et au labo. Kubernetes vit dans `k8s/` et dans une spec dédiée, jamais dans le chemin de production. Ce qui est pédagogique est marqué comme tel dans `docs/devops.md`.

## Constraints

- Stack : Astro 5 (statique) + îlots React 19, TypeScript strict, Tailwind CSS v4, nanostores, Zod, Vitest, Playwright. Tout écart exige un ADR dans `docs/technical-decisions.md`.
- Node 22 LTS, npm avec lockfile.
- Langue : documentation et specs en français ; code, identifiants, commits en anglais (Conventional Commits).
- Toute variable d'environnement est `PUBLIC_*` et injectée au build. Aucun secret applicatif.

## Development Workflow

1. `/speckit-specify` produit `spec.md` à partir de `docs/` ; les hypothèses restent marquées.
2. `/speckit-clarify` si la spec contient des `[NEEDS CLARIFICATION]`.
3. `/speckit-plan` produit `plan.md`, `research.md`, `data-model.md`, `quickstart.md` ; le Constitution Check est bloquant.
4. `/speckit-tasks` produit `tasks.md` organisé par user story, avec les tests des fonctions pures avant leur implémentation.
5. `/speckit-implement` sur une branche `00X-<feature>` ; PR vers `main` avec CI verte.
6. Définition de terminé : `docs/testing-strategy.md` §8.

## Governance

Cette constitution prime sur toute autre pratique. Un amendement est une PR qui modifie ce fichier, incrémente la version et explique le changement dans `docs/technical-decisions.md`. Chaque plan vérifie la conformité aux principes I à VII ; toute violation est justifiée dans la section Complexity Tracking du plan.

**Version**: 1.0.0 | **Ratified**: 2026-09-13 | **Last Amended**: 2026-09-13
