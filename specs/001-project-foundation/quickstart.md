# Démarrage et vérification

**Feature**: 001-project-foundation · **Date**: 2026-09-17 · **Mis à jour** : 2026-10-04

Ce guide sert à deux choses : lancer le projet, et prouver que la feature est livrée. Les commandes sont à exécuter à la racine du dépôt.

## Prérequis

| Outil | Version | Nécessaire pour |
|---|---|---|
| Node.js | 22 LTS, version épinglée dans `.nvmrc` | Tout. Le contrôle des traductions utilise le retrait de types natif, disponible à partir de Node 22.6 |
| npm | fourni avec Node | Tout |
| Git | — | Tout |
| Docker Desktop | récent | Uniquement l'histoire 4 |

Le compte d'hébergement du code doit être connecté au poste, et l'hébergement statique relié au dépôt pour la publication.

## Installation

```bash
npm ci
cp .env.example .env     # puis renseigner les deux variables
npm run dev              # http://localhost:4321
```

## Commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Serveur de développement, rechargement automatique |
| `npm run build` | Contrôle du catalogue (`check:content`), puis construction statique dans `dist/` |
| `npm run build:prod` | Contrôle des traductions en mode production, puis `npm run build`. C'est ce que fait la publication |
| `npm run preview` | Sert la version construite, comme en production |
| `npm run check` | Lint, formatage, typage, contrastes, catalogue, tests unitaires et de composants. Les tests incluent trois vraies constructions (`tests/unit/build-guards.test.ts`) |
| `npm run test:e2e` | Parcours Playwright sur la version construite |
| `npm run check:i18n` | Liste les traductions anglaises manquantes, dictionnaires et fichiers de contenu. Avec `-- --production`, échoue au lieu d'avertir |
| `npm run check:content` | Valide le catalogue : schémas, `categoryId` existants, contenu provisoire désactivé |
| `npm run tokens:check` | Vérifie les contrastes des paires de couleurs au niveau AA |

## Vérifier la feature

### Histoire 1 — squelette bilingue

1. `npm run build && npm run preview`.
2. Ouvrir `http://localhost:4321/` : la page d'accueil s'affiche en français, sans préfixe de langue.
3. Cliquer « English » : l'adresse devient `/en/`, le sélecteur indique l'anglais actif.
4. Dans le code source de la page, vérifier la déclaration de langue, l'adresse canonique et les liens alternatifs `fr`, `en` et la valeur par défaut.
5. Ouvrir `http://localhost:4321/nimporte-quoi` puis `http://localhost:4321/en/anything` : chaque page d'erreur s'affiche dans la langue de son adresse.
6. Désactiver JavaScript et recharger : le contenu et la navigation restent utilisables.
7. Réduire la fenêtre à 360 px : aucune barre de défilement horizontale.

Ce point 5 est aussi à revérifier une fois en ligne, car c'est l'hébergeur qui choisit la page d'erreur servie.

### Histoire 2 — garde-fous

1. `npm run check` puis `npm run test:e2e` : tout passe.
2. Casser volontairement un test, relancer : la commande échoue.
3. Retirer une traduction anglaise d'un champ de contenu, lancer `npm run build:prod` : la construction échoue en nommant le fichier et le champ.
4. Relancer `npm run dev` avec cette même traduction manquante : la page s'affiche en français, un avertissement apparaît dans la console.
5. Ouvrir une proposition de modification : la vérification automatique s'exécute, et une adresse d'aperçu est publiée.

### Histoire 3 — contenu et style

1. Retirer un champ obligatoire de la fiche d'exemple, lancer `npm run build` : la construction échoue en nommant le fichier et le champ.
2. Donner à la fiche une unité `per_person` sans dimension `persons` : la construction échoue en expliquant l'incohérence.
3. Donner à `PUBLIC_SITE_URL` une valeur mal formée dans `.env`, par exemple `pas-une-adresse`, lancer `npm run build` : la construction échoue immédiatement. Retirer complètement la variable : la construction se poursuit avec le repli documenté.
4. Changer la couleur de marque dans `src/styles/tokens.css`, ouvrir `http://localhost:4321/dev/ui` avec `npm run dev` : toute l'interface suit. Cette page n'existe qu'en développement, aucune construction ne la produit.
5. Chercher un texte visible dans les composants : il ne s'y trouve pas, il vit dans les dictionnaires.

### Histoire 4 — environnement conteneurisé

Les fichiers sont dans `docker/`, et le contexte de construction est la racine du dépôt.

1. `docker compose -f docker/compose.yml up dev` : le site tourne sur `http://localhost:4321` avec rechargement automatique.
2. `docker build -f docker/Dockerfile -t kibreeze-web:dev .` puis `docker run -p 8080:8080 kibreeze-web:dev` : la version construite est servie sur `http://localhost:8080`.
3. `docker inspect --format '{{.State.Health.Status}}' <conteneur>` : l'état est sain.
4. Couper le point de contrôle de santé et observer le passage en état non sain.

Les réponses aux questions d'observation des exercices 1 à 5 sont consignées dans [docs/devops.md](../../docs/devops.md), section 7.

## Vérifier la publication

1. Pousser une modification sur la branche principale.
2. Constater que le site public est mis à jour sans intervention manuelle, en moins de dix minutes.
3. Ouvrir l'adresse publique sur un téléphone, mesurer un affichage en moins de 2,5 secondes.
4. Lancer un audit sur l'accueil en français et en anglais : les quatre scores atteignent au moins 90.
5. Parcourir l'accueil entièrement au clavier : aucun piège de focus.

## Relevés de publication

### 2026-10-04, aperçu de la branche `001-project-foundation`

Adresse : `https://001-project-foundation.tks-web-1h2.pages.dev`, publiée automatiquement par Cloudflare à chaque envoi sur la branche (T049).

| Vérification | Résultat |
|---|---|
| Construction chez l'hébergeur | Réussie, site à jour avec le nom Kibreeze et les polices auto-hébergées |
| Accueil `/` et `/en/` | 200, `lang="fr"` et `lang="en"` |
| Erreur `/nimporte-quoi` | 404, page française |
| Erreur `/en/anything` | 404, page anglaise : l'hébergeur sert bien `en/404.html` sous `/en/` |
| Page `/dev/ui` | 404 : absente de la construction |
| Variables | Numéro WhatsApp `237697135388` dans les liens ; adresse canonique sur l'adresse de production |

Audit Lighthouse, mobile émulé (T050) :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP |
|---|---|---|---|---|---|
| `/` | 91 | 100 | 96 | 66 | 1,5 s |
| `/en/` | 99 | 100 | 96 | 66 | 1,2 s |

Lecture : le SEO à 66 ne vient que de l'audit « page bloquée de l'indexation ». Cloudflare ajoute `x-robots-tag: noindex` à toutes les adresses d'aperçu pour qu'elles ne soient jamais indexées : c'est voulu, et ce point ne s'applique pas à l'adresse de production. Les bonnes pratiques à 96 venaient d'un favicon absent (erreur 404 dans la console), ajouté depuis (`public/favicon.svg`). **À refaire sur l'adresse de production après la fusion dans `main`**, qui sert encore l'ancienne version TKS® du 2026-09-18.

## Correspondance avec les critères de succès

| Critère | Où il est vérifié |
|---|---|
| SC-001 | Vérifier la publication, point 3 |
| SC-002 | Histoire 1, points 2 et 3 |
| SC-003 | Vérifier la publication, points 1 et 2 |
| SC-004 | Histoire 2, points 2 et 3, et histoire 3, points 1 à 3 |
| SC-005 | Vérifier la publication, point 4 |
| SC-006 | Installation, chronométrée sur un poste vierge |
| SC-007 | Histoire 3, point 4 |
| SC-008 | Vérifier la publication, point 5, et tests axe |
