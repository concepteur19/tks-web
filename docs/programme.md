# Programme de la suite — Kibreeze

**Statut** : actif · **Date** : 2026-10-01

Ordre de travail du projet depuis le pivot Kibreeze, design compris. Pas de dates, comme dans [roadmap.md](./roadmap.md) : chaque phase démarre quand la précédente est terminée ou quand son blocage client est levé. Le découpage des features vient de [../specs/README.md](../specs/README.md). La liste des fichiers à toucher pour le pivot est dans [audit-pivot-kibreeze.md](./audit-pivot-kibreeze.md).

Deux pistes avancent **en parallèle** :

- **Piste design (D)** : génération des écrans dans Google Stitch, puis affinage dans Figma.
- **Piste code (C)** : rebranding, puis features 002 à 006.

Le code d'une feature ne démarre pas avant que ses écrans soient validés par Franck.

> **État au 2026-10-04 : la piste design est terminée.** Les écrans 1 à 8 et les versions ordinateur de l'accueil et de la fiche sont validés par Franck et exportés dans [design-exports/](./design-exports/README.md) (D1 à D5). Les écrans secondaires 9 à 11 de D4 (Contact, 404, versions anglaises) n'ont pas été générés : ils se construisent directement dans le code à partir des écrans validés. Polices et rayons sont reportés dans les tokens (ADR-015). La suite est entièrement côté code : fin de la 001 (C3), puis 002.

```text
Phase 0  Relance client (K1, L1, L2, M1, prix, photos)          ── en continu
Phase 1  D: écrans 1-3        │ C: rebrand 001 + docs + constitution
Phase 2  D: écrans 4-5        │ C: fin de 001 (T035-T051)
Phase 3  D: validation Franck │ C: 002 kibreeze-core
Phase 4  D: écrans 6-8        │ C: 003 experience-catalog
Phase 5  D: versions desktop  │ C: 004 stay-and-estimate      → LANCEMENT
Phase 6  —                    │ C: 005 hébergements et formules
Phase 7  —                    │ C: 006 TKS® mobilité, 007 k8s-lab
```

---

## Phase 0 — Débloquer le client (en continu)

Le classeur [questions-kibreeze-franck.xlsx](./questions-kibreeze-franck.xlsx) est envoyé. Relancer sur les questions qui bloquent :

| Question | Bloque | Repli si pas de réponse |
|---|---|---|
| K1 nom de domaine | Infra (section D de l'audit), mise en ligne | Adresse provisoire |
| K2 logo vectoriel et version officielle | Barre du haut, favicon | Version PNG à plat redessinée |
| K2 bis rouge du logo #8C0120 | Tokens, tous les écrans | Rouge du logo |
| L1 grille des hébergements | Écran 6, feature 005 | « Sur devis » partout |
| L2 photos des hébergements | Écran 6, feature 005 | Photos d'illustration |
| M1 formules (au moins deux) | Écran 7, feature 005 | Rubrique retirée de la barre à onglets |
| T1 prix du jet-ski | Fiche jet-ski | Aucun montant affiché |
| Tarifs de mobilité | Feature 006 | « Sur devis » |

Consigner chaque réponse dans [client-answers.md](./client-answers.md).

---

## Phase 1 — Premiers écrans et rebranding

### D1. Écrans 1 à 3 dans Stitch

Mode d'emploi : [design-briefs/kibreeze-ecrans-stitch.md](./design-briefs/kibreeze-ecrans-stitch.md).

1. Ouvrir une conversation Stitch par écran.
2. Joindre [design-briefs/kibreeze-brief.md](./design-briefs/kibreeze-brief.md), coller le bloc commun, puis le prompt de l'écran.
3. Mobile d'abord (390 × 844).

| # | Écran | Point de contrôle principal |
|---|---|---|
| 1 | Accueil | Fixe le style. TKS® apparaît après les expériences, WhatsApp visible sans défiler |
| 2 | Expériences, avec l'état « Aventure » actif | Filtres par catégorie, jet-ski sans prix |
| 3 | Fiche « Excursion en pirogue » | Pas de WhatsApp flottant, équivalent en euros, mention de prix indicatif |

Corriger par retouches ciblées (« garde tout, mais… »). Exporter chaque écran validé dans `docs/design-exports/` (PNG, et le HTML si Stitch le propose).

### C1. Rebranding de la 001 (un seul commit)

Section C de l'audit :

- [ ] `src/i18n/fr.ts`, `src/i18n/en.ts` : `site.name`, description, `home.subtitle`, libellés WhatsApp
- [ ] `src/i18n/routes.ts` : retirer `delivery`, remplacer les trois pôles par Expériences, Hébergements, Formules, Mobilité, Mon séjour, Contact
- [ ] `tests/unit/routes.test.ts`, `tests/component/home.a11y.test.ts` (ligne 50)
- [ ] `package.json` (`name`), `README.md`, commentaires de `tokens.css` et `config/resolve-env.mjs`
- [ ] `npm run test` et `npm run build` au vert

### C2. Documents et gouvernance

- [ ] Constitution 1.1.0 → 2.0.0 : produit Kibreeze, principe VI (Stitch puis Figma), avec un ADR dans [technical-decisions.md](./technical-decisions.md)
- [ ] [functional-requirements.md](./functional-requirements.md) : `FR-LAND-*` revus, ajout de `FR-HEB-*`, `FR-PACK-*`, `FR-MOB-*`
- [ ] [data-model.md](./data-model.md) : `Pole` revu, unité `per_night`, dimension `nights`
- [ ] [product-scope.md](./product-scope.md), [roadmap.md](./roadmap.md), [architecture.md](./architecture.md), [user-journeys.md](./user-journeys.md), [design-prompts.md](./design-prompts.md)
- [ ] Bandeau « archive » sur `client-questions.md` et `project-analysis.md`

---

## Phase 2 — Panier et fin de la fondation

### D2. Écrans 4 et 5

| # | Écran | Point de contrôle principal |
|---|---|---|
| 4 | Mon séjour, état plein | Lignes et montants exacts, total en FCFA et en euros, CTA WhatsApp |
| 5 | Mon séjour, états vide et sur devis | « Total : sur devis (2 prestations) », pas de WhatsApp flottant sur l'état 5-B |

### C3. Tâches restantes de la 001 ([tasks.md](../specs/001-project-foundation/tasks.md))

- [ ] T035 à T042 : schémas de contenu, `check-i18n`, tokens et `check-tokens`, page `/dev/ui`, garde-fous de build. Aligner les exemples de contenu sur les expériences Kibreeze, pas sur les trois pôles
- [ ] T043 à T047 : Docker, nginx, compose, exercices DevOps 1 à 5
- [ ] T048 à T051 : quickstart, vérification de la publication, scores d'audit, PR vers `main`

---

## Phase 3 — Validation du design et cœur du site

### D3. Présentation à Franck

1. Passer la checklist « Contrôle avant de montrer à Franck » de [kibreeze-ecrans-stitch.md](./design-briefs/kibreeze-ecrans-stitch.md).
2. Envoyer les écrans 1 à 5 à Franck sur WhatsApp, en joignant la question K2 bis si elle n'est pas tranchée.
3. Reporter ses retours en retouches ciblées dans Stitch.
4. Importer les écrans validés dans Figma. Si un écart apparaît, mettre à jour [design-system.md](./design-system.md) et [src/styles/tokens.css](../src/styles/tokens.css), puis passer le statut du design system de « draft » à « validé ».

### C4. Feature 002 `kibreeze-core`

Cycle Spec Kit, en suivant à la main les fichiers de `.claude/skills/` :

1. `speckit-specify` : rédiger `specs/002-kibreeze-core/spec.md`
2. `speckit-clarify` si des zones restent floues
3. `speckit-plan`, puis `speckit-tasks`, puis `speckit-analyze`
4. `speckit-implement`

Contenu : layout, barre du haut (logo, FR/EN, WhatsApp), barre à onglets mobile, pied de page avec les quatre marques de Breezy Groupe, accueil, Contact, 404, SEO de base. **Référence visuelle** : écrans 1, et 9 à 11 du brief s'ils sont générés.

---

## Phase 4 — Catalogue

### D4. Écrans 6 à 8, et écrans secondaires

| # | Écran | Condition |
|---|---|---|
| 6 | Hébergements | Générer avec la grille L1 ; si elle n'est pas validée, afficher les montants comme provisoires |
| 7 | Formules | **Seulement si M1 a reçu deux formules réelles.** Sinon, ne pas générer et retirer l'onglet |
| 8 | TKS® Mobilité | Visiblement plus sobre que le reste du site |
| 9 à 11 | Contact, 404, accueil et fiche en anglais | Décrits dans [kibreeze-brief.md](./design-briefs/kibreeze-brief.md) partie 7 |

### C5. Feature 003 `experience-catalog`

Spécifier les features 003 et 004 **ensemble** avant d'implémenter la 003, pour garder un modèle cohérent.

- [ ] Spec, plan et tâches pour 003 et 004
- [ ] Collections `experiences` et `categories`, tarifs du guide du 2026-09-26
- [ ] Photos tirées de `Elements/tri-par-activite/`, optimisées et sans métadonnées
- [ ] Page Expériences avec filtres, fiches détail, options à cocher, JSON-LD
- [ ] Référence visuelle : écrans 2 et 3

---

## Phase 5 — Panier, estimation et lancement

### D5. Versions ordinateur

Pour chaque écran validé, dans sa conversation Stitch, coller la phrase « Version ordinateur » (1440 × 1024) de [kibreeze-ecrans-stitch.md](./design-briefs/kibreeze-ecrans-stitch.md). Exporter dans `docs/design-exports/`.

### C6. Feature 004 `stay-and-estimate`

- [ ] Store persistant, ajout au séjour, steppers, badge
- [ ] Page Mon séjour et ses trois états, `computeEstimate`, conversion en euros
- [ ] `buildSelectionMessage` et CTA WhatsApp
- [ ] Référence visuelle : écrans 4 et 5, et leurs versions ordinateur

### Mise en ligne

Avant de mettre en ligne, vérifier les points suivants :

- [ ] Le domaine K1 est réservé ; nouveau projet Cloudflare Pages créé ; URL mise à jour dans les 5 fichiers de la section D de l'audit
- [ ] Toutes les fiches ont leurs traductions anglaises (`build:prod` au vert)
- [ ] Les scores d'audit sont relevés sur `/` et `/en/`
- [ ] Un message WhatsApp de test, généré depuis le site, est reçu par Franck

**Signal de fin du MVP** : Franck reçoit des messages WhatsApp générés par le site avec de vraies sélections.

---

## Phase 6 — Hébergements et formules (après le lancement)

### C7. Feature 005 `accommodation-and-packages`

Elle démarre quand L1 et L2 sont validées, et M1 pour les formules.

- [ ] Hébergements par type et par palier de budget, unité `per_night`, dimension `nights`
- [ ] Formules si au moins deux sont confirmées
- [ ] Ajout des deux au séjour
- [ ] Référence visuelle : écrans 6 et 7

En attendant, les sections Hébergements et Formules de l'accueil renvoient vers WhatsApp.

---

## Phase 7 — Mobilité et labo

- **C8. Feature 006 `tks-mobility`** : elle démarre quand les tarifs de mobilité sont reçus. Sinon, tout est affiché « sur devis ». Référence visuelle : écran 8.
- **C9. Feature 007 `k8s-lab`** : manifests Kustomize, kind, Ingress local, exercices de [devops.md](./devops.md). Exercice d'apprentissage, hors lancement.

---

## Outils sans abonnement Claude

| Besoin | Outil |
|---|---|
| Génération des écrans | Google Stitch (gratuit) |
| Affinage et handoff | Figma (offre gratuite), import des exports Stitch |
| Cycle Spec Kit | Les fichiers `.claude/skills/speckit-*/SKILL.md` suivis à la main ou avec GitHub Copilot |
| Code, tests, CI | VS Code, Copilot, `npm run test`, `npm run build`, GitHub Actions |
