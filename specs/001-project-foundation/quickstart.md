# Démarrage et vérification

**Feature**: 001-project-foundation · **Date**: 2026-09-17

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
| `npm run build` | Construction statique dans `dist/` |
| `npm run build:prod` | Contrôle des traductions puis construction. C'est ce que fait la publication |
| `npm run preview` | Sert la version construite, comme en production |
| `npm run check` | Lint, formatage, typage, tests unitaires et de composants |
| `npm run test:e2e` | Parcours Playwright sur la version construite |
| `npm run check:i18n` | Liste les traductions anglaises manquantes |
| `npm run tokens:check` | Vérifie les contrastes des tokens |

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
3. Vider `PUBLIC_WHATSAPP_NUMBER` dans `.env`, lancer `npm run build` : la construction échoue immédiatement.
4. Changer la couleur de marque dans `src/styles/tokens.css`, ouvrir la page de démonstration des tokens : toute l'interface suit.
5. Chercher un texte visible dans les composants : il ne s'y trouve pas, il vit dans les dictionnaires.

### Histoire 4 — environnement conteneurisé

1. `docker compose up dev` : le site tourne avec rechargement automatique.
2. `docker build -t tks-web:dev .` puis `docker run -p 8080:8080 tks-web:dev` : la version construite est servie.
3. `docker inspect --format '{{.State.Health.Status}}' <conteneur>` : l'état est sain.
4. Couper le point de contrôle de santé et observer le passage en état non sain.

## Vérifier la publication

1. Pousser une modification sur la branche principale.
2. Constater que le site public est mis à jour sans intervention manuelle, en moins de dix minutes.
3. Ouvrir l'adresse publique sur un téléphone, mesurer un affichage en moins de 2,5 secondes.
4. Lancer un audit sur l'accueil en français et en anglais : les quatre scores atteignent au moins 90.
5. Parcourir l'accueil entièrement au clavier : aucun piège de focus.

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
