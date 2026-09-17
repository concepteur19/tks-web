# Recherche — phase 0

**Feature**: 001-project-foundation · **Date**: 2026-09-17

Les choix de stack sont déjà tranchés par les ADR du projet. Cette phase ne traite que les points de mise en œuvre restés ouverts.

## 1. Routage bilingue avec slugs traduits

**Décision** : configurer l'internationalisation native d'Astro avec `locales: ['fr', 'en']`, `defaultLocale: 'fr'` et `prefixDefaultLocale: false`, puis créer explicitement un fichier de page par langue. Les correspondances vivent dans une table unique `src/i18n/routes.ts`, qui associe une clé logique à son chemin français et à son chemin anglais.

**Rationale** : le routage natif d'Astro gère la langue par défaut sans préfixe, mais pas la traduction des segments d'adresse. Une table explicite reste lisible pour sept routes, alimente le sélecteur de langue, les liens alternatifs et le plan du site, et permet de tester la bijection des chemins.

**Alternatives considérées** : générer les pages anglaises par route dynamique depuis la table, rejeté car cela complique le rendu statique pour un gain nul à cette échelle. Garder les mêmes slugs dans les deux langues, rejeté par ADR-013.

## 2. Contrôle des traductions manquantes

**Décision** : deux niveaux. Le helper `localize()` renvoie le texte français et émet un avertissement en console quand la traduction anglaise manque, en développement et en aperçu. Un script `scripts/check-i18n.ts`, exécuté avant le build de production et en intégration continue, parcourt les dictionnaires et les fichiers de contenu, et échoue en listant les champs manquants avec leur fichier.

**Rationale** : le contenu du client arrive au fil de l'eau, il faut pouvoir travailler avec des traductions incomplètes sans jamais publier une page à moitié traduite. La parité des dictionnaires est déjà garantie à la compilation par `satisfies Dictionary` ; le script couvre ce que le typage ne voit pas, c'est-à-dire les fichiers de contenu.

**Alternatives considérées** : une librairie d'internationalisation, rejetée par ADR-013 pour une centaine de chaînes. Un `refine` Zod exigeant l'anglais, rejeté car il bloquerait aussi le développement.

## 3. Variables d'environnement

**Décision** : utiliser le schéma de variables intégré à Astro 5 pour déclarer `PUBLIC_WHATSAPP_NUMBER` et `PUBLIC_SITE_URL`, avec un accès typé depuis `src/lib/env.ts`. Le build échoue si une variable manque ou ne respecte pas son format, le numéro devant être une suite de chiffres sans préfixe international.

**Rationale** : pas de dépendance supplémentaire, erreur au build plutôt qu'un lien WhatsApp cassé en production. Ces valeurs sont publiques par nature, elles finissent dans le HTML : aucun secret n'est en jeu.

**Alternatives considérées** : validation maison avec Zod, équivalente mais redondante avec ce qu'offre déjà le framework.

## 4. Pages d'erreur par langue

**Décision** : une page 404 par langue, `src/pages/404.astro` et `src/pages/en/404.astro`.

**Rationale** : l'hébergeur statique sert la page d'erreur la plus proche dans l'arborescence, ce qui donne la version anglaise pour les adresses sous `/en/`. Ce comportement est à vérifier explicitement au premier déploiement, c'est une étape du guide de démarrage.

**Alternatives considérées** : une seule page d'erreur bilingue, rejetée car elle afficherait deux langues à la fois.

## 5. Polices

**Décision** : n'embarquer aucune police pour l'instant. Les tokens pointent vers la pile système, et la police définitive arrivera avec la direction visuelle C affinée.

**Rationale** : charger une police maintenant coûterait du temps de chargement pour un choix qui sera de toute façon remplacé. La bascule ne touchera qu'une ligne de tokens.

## 6. Publication et aperçus

**Décision** : relier le projet Cloudflare au dépôt GitHub par l'intégration Git du tableau de bord. Le projet est un Worker servant des assets statiques, déclaré par un `wrangler.jsonc` versionné qui pointe vers `dist/` et renvoie la page 404 la plus proche pour une adresse inconnue. La chaîne d'intégration GitHub Actions vérifie la qualité, elle ne déploie pas.

**Rationale** : aucun jeton ni secret à stocker, aperçu automatique par branche, retour arrière depuis le tableau de bord. ADR-007, amendé le 2026-09-17, et ADR-009.

**Alternatives considérées** : déploiement depuis GitHub Actions avec un jeton d'API, rejeté pour cette feature : un secret de plus à gérer sans bénéfice. Réversible plus tard si le besoin apparaît.

## 7. Tests

**Décision** : Vitest en deux projets, unités et composants, avec la configuration Vite fournie par Astro afin que les alias et les collections de contenu soient résolus. Playwright exécuté sur le site construit et prévisualisé, pas sur le serveur de développement. Contrôles d'accessibilité axe intégrés aux tests de composants et aux parcours.

**Rationale** : tester le site tel qu'il sera publié, pas une version de développement. Conforme à [testing-strategy.md](../../docs/testing-strategy.md).

## 8. Page de démonstration des tokens

**Décision** : une page interne listant couleurs, typographies, espacements et composants, exclue du plan du site et de l'indexation, supprimée du build de production.

**Rationale** : elle rend visible l'effet d'un changement de token et servira de point de comparaison avec la maquette Figma au moment de reporter la direction C.
