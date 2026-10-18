# Feature Specification: Micro-interactions et mini tuto

**Feature Branch**: `009-micro-interactions`

**Created**: 2026-10-18

**Status**: Draft

**Input**: Demande de Zobel du 2026-10-18 : « un ensemble de micro-interactions et animations pour rendre le site un peu plus vivant et captiver l'utilisateur, rien de trop flashy, tout devra être smooth et fluide : chargement, loader, hover, apparition, sliding, click ; penser aussi au fil d'Ariane lors de la première visite ». Précisions du même jour : le « fil d'Ariane » est un **mini tuto** qui apprend à utiliser la plateforme ; **pas d'écran de chargement** ; bonus retenus : préchargement des pages, section « Comment ça marche » sur l'accueil, bouton Partager sur les fiches, vibration à l'ajout au séjour.

## Contexte

Toutes les pages du site sont livrées (features 001 à 008). Le site est rapide mais statique à l'œil : les pages se remplacent d'un coup, les cartes et boutons ne réagissent pas, une seule animation existe (l'indication de défilement du hero). Les durées et la courbe d'animation sont déjà des tokens du design system, et la préférence « réduire les animations » du téléphone coupe déjà toute transition.

Le fonctionnement de Kibreeze est inhabituel pour un site de tourisme : on ne réserve ni ne paie en ligne, on compose un séjour puis on reçoit un devis sur WhatsApp. Un visiteur qui ne l'a pas compris cherche un bouton « Réserver » et repart. Le mini tuto et la section « Comment ça marche » répondent à ce risque.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprendre le fonctionnement dès la première visite (Priority: P1)

Une touriste arrive pour la première fois sur Kibreeze depuis Instagram. Une petite bulle lui explique en trois étapes comment faire : explorer les expériences, les ajouter à son séjour, envoyer sa demande sur WhatsApp pour recevoir un devis. Elle passe les étapes en deux touches, ou ferme la bulle d'un geste, et ne la revoit plus. Sur l'accueil, la section « Comment ça marche » lui redit les trois étapes.

**Why this priority**: C'est ce qui transforme une visite en demande de devis : sans comprendre le principe, le visiteur ne remplit pas son séjour.

**Independent Test**: Ouvrir le site sur un appareil vierge, suivre le tuto jusqu'au bout, recharger : il ne revient pas. Recommencer en le fermant dès la première étape.

**Acceptance Scenarios**:

1. **Given** un premier passage sur n'importe quelle page, **When** la page s'est affichée, **Then** une bulle discrète apparaît dans les 2 secondes, sans assombrir ni bloquer la page, avec l'étape 1 sur 3 et les boutons « Suivant » et « Passer ».
2. **Given** la bulle, **When** le visiteur touche « Suivant » deux fois puis « C'est parti », **Then** il a vu les trois étapes (explorer ; ajouter à mon séjour ; recevoir son devis sur WhatsApp), chacune signalant l'endroit de l'écran concerné, puis la bulle disparaît.
3. **Given** la bulle ouverte, **When** le visiteur touche « Passer » ou appuie sur Échap, **Then** elle disparaît.
4. **Given** un tuto terminé ou passé, **When** le visiteur revient le lendemain ou change de page, **Then** la bulle ne réapparaît pas.
5. **Given** un visiteur qui ajoute une prestation à son séjour pendant le tuto, **When** l'ajout est confirmé, **Then** la bulle passe directement à l'étape 3 (envoyer sur WhatsApp).
6. **Given** l'accueil, **When** le visiteur a vu les univers du Tourisme, **Then** une section « Comment ça marche » présente les trois mêmes étapes avec une icône chacune, et un bouton vers le Tourisme.

---

### User Story 2 - Un site vivant et fluide (Priority: P2)

Un visiteur navigue de l'accueil vers une fiche, ajoute une sortie en pirogue, ouvre Mon séjour. Chaque geste répond : la carte se soulève sous la souris, la page suivante arrive en fondu, les sections apparaissent en douceur au défilement, le bouton s'enfonce sous le doigt, le compteur de Mon séjour rebondit à l'ajout, les chiffres défilent dans les sélecteurs. Rien ne clignote, rien ne le fait attendre.

**Why this priority**: C'est la demande principale de Zobel ; elle rend le site plus agréable sans changer ce qu'il permet de faire.

**Independent Test**: Parcourir accueil → univers → fiche → ajout → Mon séjour → retrait d'une ligne, sur téléphone puis ordinateur ; vérifier chaque animation de la liste des exigences, puis activer « réduire les animations » et vérifier qu'il n'en reste aucune.

**Acceptance Scenarios**:

1. **Given** un lien interne, **When** le visiteur le suit, **Then** la page suivante apparaît en fondu enchaîné ; depuis une carte, sa photo se prolonge dans la photo principale de la fiche, sur les navigateurs qui le permettent.
2. **Given** une page longue, **When** le visiteur fait défiler, **Then** les sections et cartes situées sous le premier écran apparaissent en montant légèrement, une seule fois, en cascade dans une grille ; le premier écran, lui, est affiché immédiatement.
3. **Given** une image qui charge, **When** elle arrive, **Then** elle apparaît en fondu sur une couleur de fond, sans saut de mise en page.
4. **Given** un ordinateur avec souris, **When** le pointeur survole une carte, un bouton ou un lien, **Then** la carte se soulève et sa photo zoome légèrement dans son cadre, le bouton change de teinte, le lien se souligne en glissant. Sur écran tactile, aucun effet de survol ne reste collé.
5. **Given** un bouton ou une carte, **When** le visiteur appuie, **Then** l'élément s'enfonce légèrement pendant l'appui.
6. **Given** un ajout au séjour, **When** il est confirmé, **Then** le bouton affiche « Ajouté ✓ » un court instant, le compteur de Mon séjour rebondit une fois, la notification glisse depuis le bas, et sur Android le téléphone vibre brièvement.
7. **Given** un sélecteur de quantité, **When** le visiteur touche + ou −, **Then** le chiffre défile dans le sens du changement.
8. **Given** Mon séjour, **When** le visiteur retire une ligne, **Then** elle se replie en douceur et le total se met à jour.
9. **Given** la barre à onglets, **When** le visiteur change de page, **Then** l'indicateur de l'onglet actif glisse vers le nouvel onglet.
10. **Given** un lien vers une ancre de la même page (« Parcours », « Formules »), **When** le visiteur le suit, **Then** la page défile en douceur jusqu'à la section.
11. **Given** la préférence « réduire les animations », **When** le visiteur utilise le site, **Then** aucun élément ne se déplace, ne zoome ni ne rebondit ; les changements d'état sont immédiats.

---

### User Story 3 - Navigation instantanée et partage (Priority: P3)

Un visiteur qui hésite entre deux activités ouvre une fiche, revient, en ouvre une autre : les pages s'affichent presque instantanément, même en 4G. Il trouve la sortie en pirogue parfaite pour un ami et la lui partage depuis la fiche, par WhatsApp, en deux touches.

**Why this priority**: Améliore la fluidité perçue et fait venir de nouveaux visiteurs, mais le site fonctionne sans.

**Independent Test**: Mesurer le temps d'affichage d'une fiche ouverte depuis un univers, avec et sans préchargement ; partager une fiche depuis un téléphone et depuis un ordinateur.

**Acceptance Scenarios**:

1. **Given** une page affichée, **When** le visiteur ouvre un lien visible à l'écran ou survolé, **Then** la page suivante a été chargée à l'avance et s'affiche presque instantanément.
2. **Given** un téléphone en mode économie de données, **When** le visiteur navigue, **Then** rien n'est chargé à l'avance.
3. **Given** une fiche d'expérience, **When** le visiteur touche « Partager » sur un téléphone, **Then** le menu de partage du téléphone s'ouvre avec le nom de l'expérience et son lien.
4. **Given** un navigateur sans menu de partage (ordinateur), **When** le visiteur touche « Partager », **Then** le lien est copié et une notification « Lien copié » le confirme.

---

### Edge Cases

- **Arrivée directe sur une fiche** (lien partagé, Google) : c'est un premier passage, le tuto s'affiche aussi.
- **Visiteur qui revient avec un séjour déjà rempli** : il connaît le fonctionnement ; le tuto ne s'affiche pas.
- **Mémoire du téléphone indisponible** (navigation privée stricte) : le tuto s'affiche au plus une fois par visite, jamais à chaque page.
- **Tuto et notification d'ajout en même temps** : la notification reste lisible ; la bulle ne la recouvre pas.
- **Ordinateur** : la bulle désigne le menu du haut et l'icône Mon séjour, au lieu de la barre à onglets.
- **Navigateur ancien** : pas de fondu entre pages ni d'apparition au défilement ; la navigation et le contenu restent identiques.
- **JavaScript désactivé** : tout le contenu est visible, sans tuto, sans apparition progressive, sans bouton Partager.
- **Défilement rapide jusqu'en bas** : les sections apparues en route ne retardent pas l'affichage ; aucune ne reste invisible.
- **iPhone** : pas de vibration (le navigateur ne le permet pas) ; le reste est identique.
- **Lecteur d'écran** : la bulle du tuto est annoncée et se ferme au clavier ; les animations n'ajoutent aucun texte lu.

## Requirements *(mandatory)*

### Functional Requirements

#### Mini tuto et « Comment ça marche »

- **FR-001**: Au premier passage, le site DOIT présenter un mini tuto de 3 étapes (explorer les prestations ; ajouter à mon séjour ; envoyer sa demande sur WhatsApp et recevoir un devis), dans une bulle qui n'assombrit ni ne bloque la page, avec « Suivant », « Passer » et, à la dernière étape, « C'est parti ».
- **FR-002**: Chaque étape DOIT signaler l'endroit de l'écran qu'elle décrit (onglets ou menu, bouton d'ajout ou Mon séjour, bouton WhatsApp de Mon séjour) sans déplacer le contenu.
- **FR-003**: Le tuto terminé ou passé NE DOIT plus réapparaître sur le même appareil ; il NE DOIT PAS s'afficher à un visiteur dont le séjour contient déjà une prestation.
- **FR-004**: L'accueil DOIT présenter une section « Comment ça marche » en 3 étapes illustrées, reprenant le tuto, avec un bouton vers le Tourisme.

#### Animations

- **FR-005**: Le passage d'une page à l'autre DOIT se faire en fondu enchaîné ; depuis une carte, la photo DOIT se prolonger dans la photo principale de la page ouverte, quand le navigateur le permet.
- **FR-006**: Les sections et cartes situées sous le premier écran DOIVENT apparaître au défilement (fondu et légère montée, une seule fois, en cascade dans les grilles) ; le contenu du premier écran NE DOIT PAS être animé à l'arrivée.
- **FR-007**: Les images DOIVENT apparaître en fondu une fois chargées, sur une couleur de fond, sans décaler la mise en page ; l'image principale du premier écran s'affiche sans attente.
- **FR-008**: Sur les appareils à souris, cartes, boutons et liens DOIVENT réagir au survol (carte soulevée, photo légèrement zoomée dans son cadre, teinte du bouton, soulignement glissant) ; aucun effet de survol sur écran tactile.
- **FR-009**: Boutons et cartes DOIVENT s'enfoncer légèrement pendant l'appui.
- **FR-010**: Un ajout au séjour DOIT être confirmé par le bouton (« Ajouté ✓ » un court instant), un rebond du compteur de Mon séjour, une notification qui glisse depuis le bas et, là où l'appareil le permet, une vibration très courte.
- **FR-011**: Les chiffres des sélecteurs de quantité DOIVENT défiler dans le sens du changement ; une ligne retirée de Mon séjour DOIT se replier ; l'indicateur de l'onglet actif DOIT glisser d'un onglet à l'autre ; les liens vers une section de la même page DOIVENT y défiler en douceur.
- **FR-012**: Toute animation DOIT utiliser les durées et la courbe du design system (aucune ne dépasse la durée la plus longue ; une cascade complète tient en une demi-seconde) et NE DOIT jamais retarder l'affichage ni la possibilité d'agir.
- **FR-013**: Avec la préférence « réduire les animations », aucun élément NE DOIT se déplacer, zoomer ni rebondir ; la vibration est conservée.
- **FR-014**: Le site NE DOIT afficher aucun écran de chargement.

#### Navigation et partage

- **FR-015**: Les pages internes susceptibles d'être ouvertes (liens visibles ou survolés) DOIVENT être chargées à l'avance, sauf en mode économie de données.
- **FR-016**: Chaque fiche d'expérience DOIT offrir un bouton « Partager » qui ouvre le menu de partage de l'appareil (nom et lien de la fiche) ou, à défaut, copie le lien et le confirme par une notification.

#### Qualité

- **FR-017**: Tout texte ajouté (tuto, « Comment ça marche », Partager, « Ajouté ✓ », « Lien copié ») DOIT exister en français et en anglais.
- **FR-018**: Sans JavaScript, tout le contenu DOIT rester visible et utilisable ; le tuto et le bouton Partager n'apparaissent pas.
- **FR-019**: Le tuto DOIT être utilisable au clavier et annoncé aux lecteurs d'écran, sans voler le focus de la page.

### Key Entities

- **État du tuto** : vu ou non sur cet appareil ; étape en cours pendant l'affichage.
- **Étape du tuto** : texte FR et EN, élément de l'écran signalé (différent sur téléphone et ordinateur).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur 5 personnes qui découvrent le site (proches de Franck, cahier de test), au moins 4 savent dire, après le tuto, comment obtenir un prix : ajouter à son séjour puis envoyer sur WhatsApp.
- **SC-002**: Fermer le tuto demande un seul geste ; il ne s'affiche jamais plus d'une fois par appareil.
- **SC-003**: Les pages gardent au moins 90 sur 100 aux audits automatiques de performance, accessibilité, bonnes pratiques et référencement (accueil, une fiche, Mon séjour), et aucune animation ne fait bouger la mise en page de façon mesurable.
- **SC-004**: Une fiche ouverte depuis un univers s'affiche en moins d'une seconde en 4G simulée.
- **SC-005**: Avec « réduire les animations », aucun mouvement n'est observable sur le parcours accueil → fiche → ajout → Mon séjour.
- **SC-006**: Aucune animation ne dure plus d'un tiers de seconde ; une cascade complète tient en une demi-seconde.
- **SC-007**: Franck juge le site « vivant sans être flashy » dans son cahier de test.

## Assumptions

- **Forme du tuto** : bulle ancrée en bas de l'écran, au-dessus de la barre à onglets (en haut à droite sur ordinateur), plutôt qu'un écran plein ou un voile sombre, jugés trop intrusifs sur téléphone.
- **Mémoire du tuto** : sur l'appareil, comme le séjour ; aucune donnée envoyée.
- **Place de « Comment ça marche »** (choix laissé à Claude par Zobel le 2026-10-18) : après les univers du Tourisme, avant les expériences mises en avant. Plus haut, elle repousserait l'offre ; plus bas, elle arriverait après la décision.
- **Partager** : sur les fiches d'expérience seulement ; les pages Hébergements, Formules et Mobilité se partagent par leur adresse.
- **Vibration** : environ 15 millisecondes, à l'ajout au séjour seulement.
- **Préchargement** : limité aux pages du site, jamais aux liens externes (WhatsApp).
- **Textes** : écrits par Claude, anglais relu par Zobel ; Franck les valide dans le cahier de test.

## Dependencies

- Features 002 à 008 livrées ; 006 en cours de fusion (cette branche en part, pour couvrir aussi la page Mobilité).
- Cahier de test de Franck (`docs/cahier-de-test-kibreeze-franck.xlsx`) : quelques scénarios s'ajoutent pour le tuto, le partage et les animations.

## Out of Scope

- Écran de chargement, logo animé d'ouverture.
- Sons, confettis, parallaxe, vidéos en lecture automatique, effets de curseur.
- Fil d'Ariane de navigation (« Accueil › Tourisme › … ») : non retenu le 2026-10-18.
- Partage des pages autres que les fiches d'expérience.
