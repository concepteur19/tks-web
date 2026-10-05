# Specs — Spec Kit

Chaque feature vit dans `specs/00X-<nom>/` et suit le cycle Spec Kit : `spec.md` (quoi, pourquoi, critères d'acceptation) → `plan.md` + `research.md` + `data-model.md` + `quickstart.md` (comment) → `tasks.md` (tâches). Les specs référencent les exigences `FR-xxx` de [../docs/functional-requirements.md](../docs/functional-requirements.md) et respectent [../.specify/memory/constitution.md](../.specify/memory/constitution.md).

Commandes (skills Claude Code installés dans `.claude/skills/`) : `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-implement`.

## Le produit depuis le 2026-09-25

Le site est celui de **Kibreeze**, marque de tourisme et d'expériences à Kribi. Le tourisme occupe 80 à 90 % de l'attention ; **TKS® est une section secondaire** de mobilité ; **la livraison ne figure pas sur ce site**, c'est le périmètre de Breezy Delivery, marque sœur. Voir [../docs/client-answers.md](../docs/client-answers.md) sections 1 ter et 1 quater.

La découpe ci-dessous remplace celle du 2026-09-13, qui organisait le travail autour de trois pôles égaux.

## Découpe et ordre

| # | Feature | Contenu | Exigences | Dépend de | Bloqué par le client ? |
|---|---|---|---|---|---|
| 001 | `project-foundation` | **Livrée** (PR #2). Scaffold Astro + React + Tailwind v4, TypeScript strict, i18n FR / EN, `lib/env`, Docker, CI, déploiement Cloudflare Pages | TR-*, FR-I18N-1 à 4, 8 | — | Non |
| 002 | `kibreeze-core` | Layout, barre du haut (logo, FR/EN, WhatsApp), **barre à onglets mobile**, pied de page aux quatre marques de Breezy Groupe, accueil touristique, page Contact, 404, SEO de base | FR-LAND-*, FR-SEO-1/2/3 | 001 | Non : textes fournis, photos suffisantes |
| 003 | `experience-catalog` | Collections `experiences` / `categories`, page Expériences avec filtres par catégorie, fiches détail, **options à cocher** (guide, maître-nageur, musée), images optimisées, JSON-LD | FR-CAT-*, FR-SEO-4 | 002 | Non : tarifs reçus le 2026-09-26, sauf jet-ski et quad |
| 004 | `stay-and-estimate` | Store nanostores persistant, ajout au séjour, steppers, badge, page Mon séjour et ses états, `computeEstimate`, **conversion en euros**, `buildSelectionMessage`, CTA WhatsApp | FR-SEL-*, FR-EST-*, FR-WA-*, FR-I18N-5/6/7 | 003 | Non |
| 005 | `accommodation-and-packages` | Hébergements **par type et par palier de budget** (pas de logement nommé), packages Kibreeze, ajout des deux au séjour | FR-HEB-*, FR-PACK-* | 004 | Partiellement : photos par budget attendues, prix des packages complets manquants |
| 006 | `tks-mobility` | Section secondaire TKS® : liste compacte des services de mobilité, ajout au séjour comme prestation complémentaire | FR-MOB-* | 004 | **Oui : aucun tarif de mobilité n'a jamais été fourni** |
| 007 | `k8s-lab` | Manifests Kustomize, config kind, Ingress local, exercices de `docs/devops.md` | — (hors produit) | 001 | Non |

Les features 003 et 004 forment le cœur de valeur : découvrir, sélectionner, estimer, envoyer sur WhatsApp. Elles sont spécifiées ensemble avant d'être implémentées, pour garantir la cohérence du modèle ([../docs/data-model.md](../docs/data-model.md)).

## Ce qui est réellement livrable pour un lancement

L'objectif annoncé est de terminer dans la semaine. Cette découpe ne tient pas en une semaine si on la déroule entière. Ordre de priorité si le temps manque :

1. **001 rebrandé + 002 + 003 + 004.** C'est le site qui convertit : on découvre des expériences tarifées, on compose un séjour, on l'envoie sur WhatsApp. Livrable et cohérent sans 005 ni 006.
2. **005** ensuite : les hébergements et les packages enrichissent l'offre mais ne sont pas sur le chemin critique de la conversion, et il manque des photos.
3. **006 en dernier**, parce qu'il est bloqué de toute façon : sans tarifs de mobilité, la section ne peut afficher que du « sur devis ».
4. **007 hors lancement**, c'est un exercice d'apprentissage.

Si 005 et 006 sortent du lancement, l'accueil garde ses sections Hébergements et Mobilité, mais elles renvoient vers WhatsApp au lieu d'un catalogue. Le site reste cohérent : rien ne promet une page qui n'existe pas.

## Conventions

- Branche `00X-<nom>` créée par `/speckit-specify` ; PR vers `main`.
- Une spec ne contient pas de détail d'implémentation ; un plan ne contient pas de tâche ; une tâche cite des chemins de fichiers.
- Chaque spec couvre le français et l'anglais dans ses critères d'acceptation ; tout texte ajouté l'est dans les deux langues.
- Toute hypothèse issue du questionnaire client est reprise dans la section Assumptions de la spec avec sa référence (ex. `[HYPOTHÈSE T1]`).
- Une nouvelle dépendance = un ADR dans `docs/technical-decisions.md`, cité dans `research.md`.
