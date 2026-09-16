# TKS® — Kribi is a feeling · site vitrine interactif

Site vitrine interactif et bilingue (français / anglais) pour TKS® (Kribi, Cameroun) : transport, tourisme, livraison. Le visiteur découvre les services, en sélectionne plusieurs, consulte une estimation et envoie sa demande à TKS via WhatsApp.

> **Simple enough to ship. Structured enough to evolve. Real enough to learn.**

## État du projet

**Phase : Discovery terminée, réponses client reçues le 2026-09-14.** Site bilingue FR / EN dès la V1. Les éléments de Franck arrivent au fil de l'eau et sont suivis dans [docs/content-tracker.md](docs/content-tracker.md). Aucun code applicatif n'est encore écrit. Le projet est piloté par des spécifications versionnées (Specification-Driven Development avec [Spec Kit](https://github.com/github/spec-kit)).

## Où lire quoi

| Besoin | Document |
|---|---|
| Comprendre le client et le besoin | [docs/project-analysis.md](docs/project-analysis.md) |
| Ce qui est dans le MVP, et ce qui n'y est pas | [docs/product-scope.md](docs/product-scope.md) |
| Questions posées au client | [docs/client-questions.md](docs/client-questions.md) |
| Réponses du client et décisions qui en découlent | [docs/client-answers.md](docs/client-answers.md) |
| Suivi du contenu attendu de Franck et des traductions | [docs/content-tracker.md](docs/content-tracker.md) |
| Parcours et états de l'interface | [docs/user-journeys.md](docs/user-journeys.md) |
| Exigences fonctionnelles `FR-xxx` | [docs/functional-requirements.md](docs/functional-requirements.md) |
| Exigences techniques `TR-xxx` | [docs/technical-requirements.md](docs/technical-requirements.md) |
| Stack et structure du code | [docs/architecture.md](docs/architecture.md) |
| Modèle de données TypeScript | [docs/data-model.md](docs/data-model.md) |
| Tokens et composants (Figma → code) | [docs/design-system.md](docs/design-system.md) |
| Prompts pour générer les maquettes à proposer au client | [docs/design-prompts.md](docs/design-prompts.md) |
| Décisions (ADR) | [docs/technical-decisions.md](docs/technical-decisions.md) |
| Docker, CI/CD, Kubernetes, exercices | [docs/devops.md](docs/devops.md) |
| Tests | [docs/testing-strategy.md](docs/testing-strategy.md) |
| Risques | [docs/risks.md](docs/risks.md) |
| Roadmap MVP → V2 → V3 → plateforme | [docs/roadmap.md](docs/roadmap.md) |
| Découpe en features Spec Kit | [specs/README.md](specs/README.md) |
| Principes non négociables | [.specify/memory/constitution.md](.specify/memory/constitution.md) |

Les éléments bruts fournis par le client sont dans `Elements/` (cahier des charges, croquis, vocal transcrit dans [docs/audio-transcript.md](docs/audio-transcript.md)).

## Stack retenue

Astro 5 (statique) + îlots React 19 · FR / EN (i18n natif Astro) · TypeScript strict · Tailwind CSS v4 avec tokens · nanostores · Zod · Vitest + Playwright · Docker (nginx) · GitHub Actions · Cloudflare Pages en production · Kubernetes (kind) en laboratoire local.

## Prochaine étape

1. Lancer `/speckit-specify` sur la feature `001-project-foundation`, qui inclut la configuration FR / EN.
2. Installer Docker Desktop, créer le dépôt GitHub et le compte Cloudflare.
3. Produire les propositions de design dans Figma, avec le sélecteur de langue.
4. Intégrer les éléments de Franck au fil de l'eau via [docs/content-tracker.md](docs/content-tracker.md).
