# Specs — Spec Kit

Chaque feature vit dans `specs/00X-<nom>/` et suit le cycle Spec Kit : `spec.md` (quoi, pourquoi, critères d'acceptation) → `plan.md` + `research.md` + `data-model.md` + `quickstart.md` (comment) → `tasks.md` (tâches). Les specs référencent les exigences `FR-xxx` de [../docs/functional-requirements.md](../docs/functional-requirements.md) et respectent [../.specify/memory/constitution.md](../.specify/memory/constitution.md).

Commandes (skills Claude Code installés dans `.claude/skills/`) : `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-implement`.

## Découpe et ordre

| # | Feature | Contenu | Exigences | Dépend de | Bloqué par le client ? |
|---|---|---|---|---|---|
| 001 | `project-foundation` | Scaffold Astro + React + Tailwind v4 + tokens placeholders, TypeScript strict, ESLint/Prettier, Vitest/Playwright, schémas de contenu localisés, i18n FR / EN (routage natif, dictionnaires typés, `t()`, table de routes, `LanguageSwitcher` minimal, contrôle de l'anglais au build), `lib/env`, Dockerfile + compose, CI GitHub Actions, déploiement Cloudflare Pages en `pages.dev` | TR-*, FR-I18N-1 à 4, FR-I18N-8 | — | Non |
| 002 | `landing-page` | Layout, nav avec badge (placeholder), footer, accueil (hero, pôles, pourquoi TKS, mis en avant, à propos), WhatsApp flottant et générique, SEO de base, page 404 | FR-LAND-*, FR-SEO-1/2/3 | 001 | Textes et photos (placeholders acceptés) |
| 003 | `service-catalog` | Collections `services` / `categories`, pages de pôle avec filtres, fiche détail, images optimisées, JSON-LD par fiche | FR-CAT-*, FR-SEO-4 | 002 | Liste validée (B1) ; tarifs par service en attente (C1, C2) — placeholders |
| 004 | `service-selection` | Store nanostores persistant, `AddToStay`, stepper, badge, drawer desktop, page `/sejour`, toasts, purge et migrations | FR-SEL-*, FR-I18N-5 | 003 | Non : dimensions de quantité définies par Franck (D1, 2026-09-16) |
| 005 | `estimation` | `computeEstimate`, `formatPrice`, `EstimateSummary` et ses 4 états | FR-EST-*, FR-I18N-7 | 004 | Non : mention validée (C4) |
| 006 | `whatsapp-conversion` | `buildSelectionMessage`, `buildWhatsAppUrl`, troncature, CTA sur `/sejour` et sur les fiches, page `/contact` | FR-WA-*, FR-I18N-6 | 005 | Non : numéro reçu (E1), format validé (E3) ; téléphone, e-mail et réseaux (F4) à recevoir |
| 007 | `k8s-lab` | Manifests Kustomize, config kind, Ingress local, exercices de `docs/devops.md` | — (hors produit) | 001 | Non |

Les features 004, 005 et 006 forment le cœur de valeur et sont spécifiées ensemble avant d'être implémentées, pour garantir la cohérence du modèle (`docs/data-model.md`).

## Conventions

- Branche `00X-<nom>` créée par `/speckit-specify` ; PR vers `main`.
- Une spec ne contient pas de détail d'implémentation ; un plan ne contient pas de tâche ; une tâche cite des chemins de fichiers.
- Chaque spec couvre le français et l'anglais dans ses critères d'acceptation ; tout texte ajouté l'est dans les deux langues.
- Toute hypothèse issue du questionnaire client est reprise dans la section Assumptions de la spec avec sa référence (ex. `[HYPOTHÈSE C1]`).
- Une nouvelle dépendance = un ADR dans `docs/technical-decisions.md`, cité dans `research.md`.
