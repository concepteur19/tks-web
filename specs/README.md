# Specs — Spec Kit

Chaque feature vit dans `specs/00X-<nom>/` et suit le cycle Spec Kit : `spec.md` (quoi, pourquoi, critères d'acceptation) → `plan.md` + `research.md` + `data-model.md` + `quickstart.md` (comment) → `tasks.md` (tâches). Les specs référencent les exigences `FR-xxx` de [../docs/functional-requirements.md](../docs/functional-requirements.md) et respectent [../.specify/memory/constitution.md](../.specify/memory/constitution.md).

Commandes (skills Claude Code installés dans `.claude/skills/`) : `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-implement`.

## Découpe et ordre

| # | Feature | Contenu | Exigences | Dépend de | Bloqué par le client ? |
|---|---|---|---|---|---|
| 001 | `project-foundation` | Scaffold Astro + React + Tailwind v4 + tokens placeholders, TypeScript strict, ESLint/Prettier, Vitest/Playwright, schémas de contenu, `lib/env`, Dockerfile + compose, CI GitHub Actions, déploiement Cloudflare Pages en `pages.dev` | TR-* | — | Non |
| 002 | `landing-page` | Layout, nav avec badge (placeholder), footer, accueil (hero, pôles, pourquoi TKS, mis en avant, à propos), WhatsApp flottant et générique, SEO de base, page 404 | FR-LAND-*, FR-SEO-1/2/3 | 001 | Textes et photos (placeholders acceptés) |
| 003 | `service-catalog` | Collections `services` / `categories`, pages de pôle avec filtres, fiche détail, images optimisées, JSON-LD par fiche | FR-CAT-*, FR-SEO-4 | 002 | Liste des services (B1), prix (C1, C2) — placeholders acceptés |
| 004 | `service-selection` | Store nanostores persistant, `AddToStay`, stepper, badge, drawer desktop, page `/sejour`, toasts, purge et migrations | FR-SEL-* | 003 | Règles de quantité (D1) |
| 005 | `estimation` | `computeEstimate`, `formatPrice`, `EstimateSummary` et ses 4 états | FR-EST-* | 004 | Mention sous le total (C4) |
| 006 | `whatsapp-conversion` | `buildSelectionMessage`, `buildWhatsAppUrl`, troncature, CTA sur `/sejour` et sur les fiches, page `/contact` | FR-WA-* | 005 | Numéro (E1), format du message (E3) |
| 007 | `k8s-lab` | Manifests Kustomize, config kind, Ingress local, exercices de `docs/devops.md` | — (hors produit) | 001 | Non |

Les features 004, 005 et 006 forment le cœur de valeur et sont spécifiées ensemble avant d'être implémentées, pour garantir la cohérence du modèle (`docs/data-model.md`).

## Conventions

- Branche `00X-<nom>` créée par `/speckit-specify` ; PR vers `main`.
- Une spec ne contient pas de détail d'implémentation ; un plan ne contient pas de tâche ; une tâche cite des chemins de fichiers.
- Toute hypothèse issue du questionnaire client est reprise dans la section Assumptions de la spec avec sa référence (ex. `[HYPOTHÈSE C1]`).
- Une nouvelle dépendance = un ADR dans `docs/technical-decisions.md`, cité dans `research.md`.
