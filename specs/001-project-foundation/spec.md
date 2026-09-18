# Feature Specification: Fondation du projet

**Feature Branch**: `001-project-foundation`

**Created**: 2026-09-17

**Status**: Draft

**Input**: Mettre en place les fondations techniques du site TKS, sans aucune fonctionnalité visible pour le visiteur final : squelette bilingue français et anglais, socle de contenu validé, garde-fous de qualité automatiques, environnement conteneurisé, et publication automatique d'une adresse d'aperçu.

## Contexte

Le site TKS® est spécifié dans [docs/](../../docs/) : [product-scope.md](../../docs/product-scope.md), [functional-requirements.md](../../docs/functional-requirements.md), [architecture.md](../../docs/architecture.md) et les décisions [technical-decisions.md](../../docs/technical-decisions.md). Cette première feature ne livre aucune fonctionnalité au visiteur : elle installe le terrain sur lequel les features 002 à 006 seront construites, et donne à TKS une adresse à consulter dès maintenant.

Elle est volontairement indépendante du contenu du client, encore attendu, et du design final, dont la direction vient d'être choisie mais n'est pas encore affinée.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Un squelette bilingue consultable en ligne (Priority: P1)

Le développeur publie une première version du site, vide de contenu mais réelle : une page d'accueil en français, la même en anglais, une navigation, un pied de page, un sélecteur de langue. TKS reçoit une adresse publique qu'il peut ouvrir sur son téléphone.

**Why this priority**: C'est la preuve que toute la chaîne fonctionne, de l'écriture du code jusqu'à la mise en ligne. Sans elle, aucune autre feature ne peut être livrée ni montrée.

**Independent Test**: Ouvrir l'adresse publique sur un téléphone, voir la page d'accueil en français, basculer en anglais, revenir en français, et vérifier que les deux pages ont des adresses distinctes et partageables.

**Acceptance Scenarios**:

1. **Given** l'adresse publique du site, **When** un visiteur l'ouvre, **Then** la page d'accueil s'affiche en français, sans préfixe de langue dans l'adresse.
2. **Given** la page d'accueil française, **When** le visiteur choisit « English », **Then** il arrive sur la page équivalente sous `/en/`, et le sélecteur indique que l'anglais est actif.
3. **Given** une page dans une langue, **When** un moteur de recherche l'explore, **Then** il trouve la déclaration de langue de la page et le lien vers sa version dans l'autre langue.
4. **Given** un visiteur qui a désactivé JavaScript, **When** il ouvre une page, **Then** tout le contenu reste lisible et la navigation reste utilisable.
5. **Given** une adresse inexistante, **When** un visiteur l'ouvre, **Then** une page d'erreur s'affiche dans la langue de l'adresse, avec un retour vers l'accueil.

---

### User Story 2 - Des garde-fous qui empêchent de publier une régression (Priority: P2)

À chaque modification proposée, une vérification automatique s'exécute : style de code, typage, tests, construction du site, contrôle des traductions, performance et accessibilité. Une anomalie bloque la publication.

**Why this priority**: Le projet sert aussi d'apprentissage et sera repris plus tard. Sans garde-fous dès le départ, la dette s'installe avant même la première fonctionnalité.

**Independent Test**: Proposer une modification volontairement fautive, par exemple un texte anglais manquant ou un test cassé, et constater que la vérification échoue et que rien n'est publié.

**Acceptance Scenarios**:

1. **Given** une modification qui casse un test, **When** la vérification automatique s'exécute, **Then** elle échoue et la modification ne peut pas rejoindre la version publiée.
2. **Given** un texte affiché qui existe en français mais pas en anglais, **When** on construit la version de production, **Then** la construction échoue en nommant le fichier et le champ manquant.
3. **Given** le même texte manquant, **When** on travaille en local ou sur un aperçu, **Then** le texte français s'affiche à la place, accompagné d'un avertissement.
4. **Given** une modification acceptée sur la version principale, **When** la vérification réussit, **Then** le site public est mis à jour sans intervention manuelle.
5. **Given** une proposition de modification, **When** la vérification réussit, **Then** une adresse d'aperçu propre à cette proposition est disponible.

---

### User Story 3 - Un socle de contenu et de style prêt à recevoir le vrai matériel (Priority: P3)

Le développeur dispose d'un format de fiche de service validé automatiquement, et d'un jeu de valeurs de style centralisé. Les tarifs, photos et textes de TKS, ainsi que la direction visuelle choisie, viendront s'y déposer sans réécrire l'interface.

**Why this priority**: Le contenu du client arrive au fil de l'eau et le design n'est pas figé. Le socle doit accepter cette arrivée progressive sans provoquer de réécriture.

**Independent Test**: Créer une fiche de service d'exemple, la modifier pour la rendre invalide, constater que la construction refuse et explique pourquoi, puis changer une valeur de style dans un seul endroit et voir l'interface entière suivre.

**Acceptance Scenarios**:

1. **Given** une fiche de service dont un champ obligatoire manque, **When** on construit le site, **Then** la construction échoue en nommant le fichier et le champ.
2. **Given** une fiche dont l'unité de prix ne correspond pas à ses dimensions de quantité, **When** on construit le site, **Then** la construction échoue en expliquant l'incohérence.
3. **Given** une couleur de marque modifiée dans le fichier de valeurs de style, **When** on recharge l'interface, **Then** tous les éléments concernés adoptent la nouvelle couleur.
4. **Given** un texte d'interface, **When** on le cherche dans le code des composants, **Then** il n'y est pas : il vit dans les dictionnaires de langue.

---

### User Story 4 - Un environnement de développement reproductible (Priority: P4)

Le développeur lance le projet avec une seule commande, en local ou dans un conteneur, et obtient le même résultat qu'en production.

**Why this priority**: Utile mais non bloquant. C'est aussi un objectif d'apprentissage assumé du projet. L'outil de conteneurisation n'est pas encore installé sur le poste, cette histoire peut donc être livrée après les trois premières.

**Independent Test**: Sur une machine vierge, suivre le guide de démarrage et obtenir le site lancé en moins de quinze minutes.

**Acceptance Scenarios**:

1. **Given** un poste avec les prérequis installés, **When** on suit le guide de démarrage, **Then** le site tourne en local avec rechargement automatique.
2. **Given** l'image conteneurisée du site, **When** on la démarre, **Then** elle sert la version construite et signale son bon fonctionnement par un point de contrôle de santé.
3. **Given** l'image conteneurisée, **When** on inspecte son état, **Then** elle indique être en bonne santé, ou en mauvaise santé si le site ne répond plus.

---

### Edge Cases

- Texte anglais manquant : repli sur le français hors production, échec de construction en production.
- Variable d'environnement mal formée, par exemple un numéro WhatsApp contenant des espaces : la construction échoue immédiatement avec un message explicite, plutôt que de publier un lien cassé. Une variable simplement absente déclenche le repli documenté, et la construction se poursuit.
- Deux pages qui revendiqueraient la même adresse dans une langue : la construction échoue.
- Fichier de contenu invalide, mal formé ou référençant une catégorie inconnue : la construction échoue en nommant le fichier.
- Absence de l'outil de conteneurisation sur le poste : les histoires 1 à 3 restent réalisables et vérifiables.
- Écran de 360 pixels de large : aucune barre de défilement horizontale.
- Navigation entièrement au clavier : aucun piège de focus, ordre de tabulation logique.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le site DOIT exister en français et en anglais, le français servi sans préfixe d'adresse et l'anglais sous `/en/`, conformément à FR-I18N-1 de [functional-requirements.md](../../docs/functional-requirements.md).
- **FR-002**: Chaque page DOIT exposer un sélecteur de langue menant à la page équivalente dans l'autre langue, sans détection automatique ni redirection.
- **FR-003**: Chaque page DOIT déclarer sa langue, une adresse canonique propre à sa langue, et des liens vers ses versions alternatives.
- **FR-004**: Aucun texte visible NE DOIT être écrit dans un composant : les textes d'interface vivent dans des dictionnaires par langue, les textes de contenu dans les fichiers de contenu.
- **FR-005**: Le système DOIT afficher le texte français en remplacement d'un texte anglais manquant hors production, et DOIT refuser de construire la version de production dans ce cas, en listant les manques.
- **FR-006**: Le catalogue DOIT être décrit par un schéma qui valide chaque fiche de service et chaque catégorie au moment de la construction, y compris la cohérence entre l'unité de prix et les dimensions de quantité définies dans [data-model.md](../../docs/data-model.md).
- **FR-007**: Toutes les valeurs de style, couleurs, typographies, espacements, rayons, durées, DOIVENT être définies à un seul endroit et consommées par l'interface, sans valeur brute dans les composants.
- **FR-008**: La configuration propre à un environnement, numéro WhatsApp et adresse publique du site, DOIT être résolue et validée au moment de la construction : une valeur mal formée fait échouer la construction avec un message explicite, une valeur absente est remplacée par un repli documenté, l'adresse fournie par l'hébergeur d'abord, puis une valeur du dépôt.
- **FR-009**: Le contenu principal de chaque page DOIT rester lisible et navigable sans JavaScript.
- **FR-010**: Une adresse inexistante DOIT produire une page d'erreur dans la langue de l'adresse, avec un retour vers l'accueil.
- **FR-011**: Une vérification automatique DOIT s'exécuter à chaque proposition de modification et couvrir le style de code, le typage, les tests, la construction du site et un audit de performance et d'accessibilité.
- **FR-012**: Une modification acceptée sur la version principale DOIT être publiée automatiquement, et chaque proposition DOIT disposer d'une adresse d'aperçu.
- **FR-013**: Le projet DOIT fournir une image conteneurisée servant la version construite, avec un point de contrôle de santé.
- **FR-014**: Le projet DOIT fournir un guide de démarrage permettant à quelqu'un d'autre de lancer le site sans connaissance préalable.
- **FR-015**: Le socle DOIT respecter les budgets de [technical-requirements.md](../../docs/technical-requirements.md) : quatre scores d'audit au moins égaux à 90 sur l'accueil, et pas de défilement horizontal à partir de 360 pixels de large.

### Key Entities

- **Langue** : français ou anglais. Détermine l'adresse, les textes affichés et le formatage des montants.
- **Table des adresses** : correspondance unique entre une page logique et son adresse dans chaque langue. Source unique pour le sélecteur de langue, les liens alternatifs et le plan du site.
- **Dictionnaire de langue** : ensemble des textes d'interface d'une langue. Le dictionnaire français fait référence ; l'anglais doit le couvrir entièrement.
- **Fiche de service** : description d'une prestation, avec ses textes localisés, son prix, ses dimensions de quantité et son statut de disponibilité. Seul son format est livré ici, pas son contenu.
- **Jeu de valeurs de style** : couleurs, typographies, espacements, rayons et durées, en attente des valeurs définitives de la direction visuelle retenue.
- **Configuration d'environnement** : numéro WhatsApp et adresse publique du site, injectés au moment de la construction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: TKS peut ouvrir une adresse publique sur son téléphone et voir la page d'accueil s'afficher en moins de 2,5 secondes sur une connexion mobile ordinaire.
- **SC-002**: Un visiteur passe du français à l'anglais et revient, en une action à chaque fois, depuis n'importe quelle page.
- **SC-003**: Une modification acceptée est visible en ligne en moins de 10 minutes, sans aucune manipulation manuelle.
- **SC-004**: Dans 100 % des cas testés, une anomalie de qualité, texte anglais manquant, test cassé, typage invalide ou fiche de contenu invalide, empêche la publication.
- **SC-005**: Les quatre scores d'audit atteignent au moins 90 sur la page d'accueil, en français et en anglais.
- **SC-006**: Une personne qui découvre le projet le lance en local en moins de 15 minutes en suivant le guide de démarrage.
- **SC-007**: Changer une couleur de marque à un seul endroit modifie toute l'interface, sans toucher à un composant.
- **SC-008**: Le parcours complet de la page d'accueil est réalisable au clavier, sans piège de focus, et sans violation d'accessibilité critique.

## Assumptions

- Les choix techniques structurants sont déjà arrêtés dans [technical-decisions.md](../../docs/technical-decisions.md), notamment le framework, l'internationalisation, le style, le format des données, l'hébergement et la chaîne d'intégration. Cette spécification ne les rouvre pas.
- Le contenu réel de TKS, tarifs, photos, textes, n'est pas disponible : le socle est livré avec une fiche d'exemple clairement marquée comme provisoire, suivie dans [content-tracker.md](../../docs/content-tracker.md).
- La direction visuelle C a été choisie par le client le 2026-09-17, mais ses valeurs ne sont pas encore figées : les valeurs de style restent provisoires et seront remplacées sans toucher aux composants.
- Le nom de domaine n'est pas encore acheté : l'adresse publique est celle fournie par l'hébergeur, et le domaine sera branché plus tard sans reconstruction du projet.
- Le poste de développement ne dispose pas encore de l'outil de conteneurisation, et le compte d'hébergement du code n'y est pas connecté : ces prérequis sont traités au début de la mise en œuvre, et l'histoire 4 peut être livrée après les trois premières.
- Aucune mesure d'audience n'est installée dans cette feature.

## Dependencies

- Un dépôt distant d'hébergement du code, connecté au poste de développement.
- Un compte d'hébergement statique relié à ce dépôt, pour la publication automatique et les aperçus.
- Un outil de conteneurisation installé localement, pour l'histoire 4 seulement.

## Out of Scope

- Le contenu réel du client et les vraies photographies.
- Le design final et ses valeurs définitives.
- Le catalogue de services, la sélection, l'estimation et le message WhatsApp, qui relèvent des features 002 à 006.
- Les manifestes de déploiement Kubernetes, qui relèvent de la feature 007.
- La mesure d'audience, le formulaire de contact, les formules et les hébergements, tous reportés après la première version.
