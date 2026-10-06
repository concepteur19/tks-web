# Feature Specification: Catalogue des expériences

**Feature Branch**: `003-experience-catalog`

**Created**: 2026-10-05

**Status**: Draft

**Input**: Catalogue des expériences Kibreeze : page Expériences (`/experiences`, `/en/experiences`) avec filtres par catégorie (Nature & Découverte, Aventure, Détente), fiches détail (`/experiences/<slug>`) avec galerie, prix, durée, ce qui est inclus, options (guide touristique, maître-nageur, musée d'art), barre d'action fixe, demande sur WhatsApp pour ce seul service, images optimisées, données structurées. Exigences FR-CAT-*, FR-SEO-4. Référence visuelle : `docs/design-exports/` (02a, 02b, 03, 11). Contenu : guide tarifaire de Franck ; jet-ski et quad non tranchés. L'ajout au séjour relève de la feature 004 : pas de bouton qui ne fait rien.

## Contexte

La feature 002 a livré la coque du site, l'accueil, Contact et les pages légales. Sur l'accueil, tout ce qui mène au catalogue ouvre pour l'instant WhatsApp : le bouton « Découvrir les expériences », les cartes de catégorie et les quatre expériences mises en avant.

Cette feature livre le catalogue lui-même, cœur de l'offre touristique : une page qui liste les expériences et une fiche par expérience. Elle s'appuie sur le guide tarifaire de Franck du 2026-09-26 ([client-answers.md](../../docs/client-answers.md), section 1 quater, et [data-model.md](../../docs/data-model.md)), et sur les écrans validés le 2026-10-04 : [02a](../../docs/design-exports/02a-experiences-toutes.jpg), [02b](../../docs/design-exports/02b-experiences-aventure.jpg), [03](../../docs/design-exports/03-fiche-pirogue.jpg) et [11](../../docs/design-exports/11-fiche-pirogue-ordinateur.jpg).

Ce qui reste à la feature 004 : sélectionner des expériences, choisir les quantités et les options, calculer une estimation, composer un séjour. Les écrans validés montrent déjà ces éléments sur la fiche (sélecteur de personnes, cases à cocher, total, « Ajouter à mon séjour »). Ils apparaîtront avec la 004. D'ici là, la fiche présente les mêmes informations sans interaction qui ne mènerait nulle part.

Exigences de référence : FR-CAT-1 à 6, FR-SEO-1, FR-SEO-3, FR-SEO-4, FR-WA-6 et FR-EUR-1 à 3 de [functional-requirements.md](../../docs/functional-requirements.md).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parcourir les expériences et les filtrer par envie (Priority: P1)

Un visiteur veut savoir ce qu'il peut faire à Kribi. Il ouvre la page Expériences, voit toutes les activités sous forme de cartes photographiques avec leur prix, puis choisit une catégorie, par exemple Aventure, pour ne garder que ce qui lui parle.

**Why this priority**: C'est la vitrine de l'offre. Sans elle, le site ne montre que quatre expériences sur l'accueil, et le visiteur doit écrire sur WhatsApp pour découvrir le reste.

**Independent Test**: Ouvrir `/experiences` sur un téléphone, compter les cartes, choisir chaque catégorie puis « Toutes », dans les deux langues.

**Acceptance Scenarios**:

1. **Given** la page Expériences, **When** elle s'ouvre, **Then** un bandeau photographique porte le titre « Expériences » et la phrase « Vivez Kribi autrement », l'onglet « Toutes » est actif, et toutes les expériences publiées apparaissent en cartes, dans l'ordre défini.
2. **Given** l'onglet « Toutes » actif, **When** le visiteur choisit « Aventure », **Then** seules les expériences de cette catégorie restent visibles, l'onglet choisi est signalé, et « Toutes » rétablit la liste complète.
3. **Given** une carte, **When** elle s'affiche, **Then** elle montre une photo, le nom, une description d'une ligne, le prix sous l'une des trois formes du site, et un lien « Voir les détails » vers la fiche.
4. **Given** une expérience limitée à 8 personnes, **When** sa carte s'affiche, **Then** elle porte un badge « 8 personnes max » ; une expérience à confirmer porte le badge « Disponibilité à confirmer ».
5. **Given** une carte de catégorie de l'accueil, **When** le visiteur la touche, **Then** il arrive sur la page Expériences déjà filtrée sur cette catégorie, et l'adresse permet de partager ce filtre.
6. **Given** le bas de la page Expériences, **When** le visiteur y arrive, **Then** un bloc « Une envie particulière ? » propose de contacter Kibreeze sur WhatsApp.

---

### User Story 2 - Consulter la fiche d'une expérience (Priority: P2)

Le visiteur s'intéresse à l'excursion en pirogue. Il ouvre la fiche et y trouve tout ce qu'il faut pour se décider : photos, prix, durée, nombre de personnes, lieu, description, ce qui est inclus et ce qui ne l'est pas, options possibles et leur prix, autres expériences proches.

**Why this priority**: La fiche transforme l'envie en demande. Elle vient après la liste, qui y mène.

**Independent Test**: Ouvrir trois fiches de nature différente (prix ferme, tarifs multiples, sur devis) dans les deux langues, et vérifier que chaque information affichée correspond au guide tarifaire.

**Acceptance Scenarios**:

1. **Given** la fiche d'une expérience, **When** elle s'ouvre, **Then** elle montre un fil d'Ariane « Expériences › catégorie › nom », une galerie de photos avec un compteur, le nom, un badge de catégorie, le bloc prix, la description, et un retour possible vers la liste.
2. **Given** un prix ferme, **When** le bloc prix s'affiche, **Then** le montant en FCFA domine, suivi de son unité, de l'équivalent en euros indicatif, et de la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. »
3. **Given** l'excursion en pirogue, **When** sa fiche s'affiche, **Then** une ligne d'informations montre la durée (« 2 à 3 heures »), la capacité (« 1 à 8 personnes ») et le lieu, et un badge indique « Jusqu'à 8 personnes — au-delà, sur devis ».
4. **Given** le campement Bagyeli, **When** sa fiche s'affiche, **Then** ses trois tarifs apparaissent avec leurs libellés : individuel 7 500 FCFA par personne, couple 20 000 FCFA, groupe sur devis.
5. **Given** une fiche, **When** le visiteur descend, **Then** il voit « Ce qui est inclus » puis « Ce qui n'est pas inclus », l'un sous l'autre, puis un encadré « Complétez votre expérience » listant le guide touristique (5 000 FCFA), le maître-nageur (5 000 FCFA) et le musée d'art (1 500 FCFA par personne), puis « Vous aimerez aussi » avec trois autres expériences.
6. **Given** une information absente du contenu (durée inconnue, rien d'inclus déclaré), **When** la fiche s'affiche, **Then** la rubrique correspondante est omise, sans valeur inventée ni emplacement vide.

---

### User Story 3 - Demander une expérience sur WhatsApp (Priority: P3)

Depuis une fiche, le visiteur décide de se renseigner sur cette seule expérience. Une barre fixe en bas de l'écran lui rappelle le prix et lui permet d'écrire à Kibreeze, avec un message qui nomme déjà l'expérience.

**Why this priority**: C'est la conversion propre au catalogue. La 004 ajoutera la composition d'un séjour complet ; d'ici là, cette demande ciblée est le seul passage à l'acte depuis une fiche.

**Independent Test**: Sur trois fiches, dans chaque langue, toucher « Demander ce service » et lire le message prérempli.

**Acceptance Scenarios**:

1. **Given** une fiche sur téléphone, **When** elle s'affiche, **Then** une barre fixe en bas, au-dessus de la barre à onglets, montre le prix et son équivalent en euros à gauche et le bouton « Demander ce service » à droite ; aucun bouton WhatsApp flottant n'apparaît.
2. **Given** la fiche de l'excursion en pirogue en français, **When** le visiteur touche « Demander ce service », **Then** WhatsApp s'ouvre avec un message qui salue Kibreeze, nomme « Excursion en pirogue » et contient l'adresse de la fiche.
3. **Given** la même fiche en anglais, **When** il fait de même, **Then** le message est rédigé en anglais et nomme « Dugout canoe trip ».
4. **Given** une expérience sur devis, **When** la barre s'affiche, **Then** elle montre le badge « Sur devis » à la place du prix, et le bouton reste disponible.
5. **Given** un ordinateur, **When** la fiche s'affiche, **Then** la galerie occupe la colonne de gauche et le bloc prix avec le bouton devient une carte qui reste visible pendant le défilement, dans la colonne de droite.

---

### User Story 4 - Trouver les expériences depuis un moteur ou un partage (Priority: P4)

Une personne cherche « chutes de la Lobé excursion » ou reçoit le lien d'une fiche. L'aperçu montre la photo, le nom et la description de l'expérience ; les moteurs comprennent qu'il s'agit d'une activité touristique avec un prix.

**Why this priority**: Chaque fiche est une porte d'entrée possible depuis une recherche ou un partage. L'effet est réel mais ne se mesure qu'après publication.

**Independent Test**: Lire les métadonnées et les données structurées de la page Expériences et de trois fiches dans chaque langue, puis le plan du site.

**Acceptance Scenarios**:

1. **Given** une fiche, **When** on lit ses métadonnées, **Then** son titre, sa description et son image de partage sont propres à l'expérience et à la langue.
2. **Given** une fiche à prix ferme ou « à partir de », **When** un moteur lit ses données structurées, **Then** il trouve l'expérience avec son offre en francs CFA et la langue de la page ; une fiche sur devis n'expose pas d'offre chiffrée.
3. **Given** le site construit, **When** on lit le plan du site, **Then** la page Expériences et chaque fiche publiée y figurent dans les deux langues, et aucune expérience désactivée.

---

### Edge Cases

- **Expérience désactivée** : elle n'apparaît ni dans la liste, ni dans « Vous aimerez aussi », ni sur l'accueil, et son adresse renvoie la page d'erreur (FR-CAT-5).
- **Expérience à confirmer** : elle reste visible, avec le badge « Disponibilité à confirmer » sur sa carte et sur sa fiche.
- **Catégorie sans expérience publiée** : son onglet n'apparaît pas, plutôt qu'un filtre qui affiche une liste vide.
- **Photo manquante pour une expérience** : la carte et la fiche utilisent l'image Stitch de cette activité, jamais une photo filigranée ni une photo d'une autre activité présentée comme celle-ci.
- **Une seule photo** : la galerie montre la photo sans compteur ni vignettes.
- **Tarifs multiples** : la carte affiche le plus petit tarif chiffré en « à partir de » ; la fiche détaille chaque tarif.
- **Expérience sur devis** : aucun montant ni équivalent en euros, ni sur la carte, ni sur la fiche, ni dans les données structurées.
- **Capacité dépassée** : pour la pirogue et la chaloupe, la fiche indique qu'au-delà de 8 personnes le prix est sur devis.
- **JavaScript désactivé** : la liste complète reste lisible et chaque catégorie reste atteignable par un lien ; la fiche est entièrement lisible et « Demander ce service » fonctionne.
- **Adresse de fiche inconnue** : la page d'erreur de la langue s'affiche.
- **Nom ou description anglais plus long** : les cartes passent à la ligne sans casser la grille.

## Requirements *(mandatory)*

### Functional Requirements

#### Contenu du catalogue

- **FR-001**: Le catalogue DOIT publier, chacune dans un fichier de données validé, les expériences du guide tarifaire : Chutes de la Lobé, Excursion en pirogue, Excursion en chaloupe, Campement Bagyeli, Jacuzzi naturel, Croisière en bateau, Feu de plage, Quad, Jet-ski, Kayak, Paddle, Balade à cheval et Bateau de plaisance, avec leurs prix, unités et capacités de [data-model.md](../../docs/data-model.md) (FR-CAT-1).
- **FR-002**: Chaque expérience DOIT appartenir à une catégorie : Nature & Découverte (chutes, pirogue, chaloupe, campement, jacuzzi), Aventure (quad, jet-ski, kayak, paddle, cheval) ou Détente (croisière, feu de plage, bateau de plaisance).
- **FR-003**: Le guide touristique, le maître-nageur et le musée d'art DOIVENT être publiés comme options : ils n'apparaissent pas dans la liste des expériences, mais sur les fiches.
- **FR-004**: Le jet-ski DOIT être publié « sur devis » tant que Franck n'a pas tranché son tarif (question T1) ; le quad garde son tarif de 10 000 FCFA par session, sans durée affichée tant que la durée d'une session n'est pas connue (question T4).
- **FR-005**: Une expérience désactivée NE DOIT apparaître nulle part, et son adresse DOIT renvoyer la page d'erreur (FR-CAT-5).

#### Page Expériences

- **FR-006**: La page Expériences DOIT exister à `/experiences` et `/en/experiences`, avec un bandeau photographique, le titre et la phrase d'accroche de la maquette validée.
- **FR-007**: La page DOIT lister les expériences publiées, disponibles ou à confirmer, triées par ordre défini puis par nom (FR-CAT-2).
- **FR-008**: La page DOIT proposer un onglet « Toutes », actif par défaut, et un onglet par catégorie qui contient au moins une expérience publiée. Les onglets DOIVENT rester visibles sous la barre du haut pendant le défilement, et l'onglet actif DOIT être signalé visuellement et aux technologies d'assistance.
- **FR-009**: Chaque filtre de catégorie DOIT avoir une adresse propre, partageable, que les cartes de catégorie de l'accueil utilisent.
- **FR-010**: Chaque carte DOIT afficher la photo, le nom, la description courte, le prix sous l'une des trois formes du site avec son équivalent en euros, le badge « N personnes max » si la capacité est plafonnée, le badge « Disponibilité à confirmer » si l'expérience est à confirmer, et un lien « Voir les détails » vers la fiche (FR-CAT-3).
- **FR-011**: La page DOIT se terminer par un bloc « Une envie particulière ? » avec un bouton WhatsApp au message générique (FR-CAT-6), et porter le bouton WhatsApp flottant.

#### Fiche d'une expérience

- **FR-012**: Chaque expérience publiée DOIT avoir une fiche à `/experiences/<slug>` et `/en/experiences/<slug>`, le slug étant identique dans les deux langues.
- **FR-013**: La fiche DOIT afficher, dans cet ordre : fil d'Ariane, galerie, nom et badge de catégorie, bloc prix, ligne d'informations (durée, capacité, lieu), description, « Ce qui est inclus », « Ce qui n'est pas inclus », « À savoir », encadré des options, « Vous aimerez aussi ». Une rubrique sans contenu DOIT être omise (FR-CAT-4).
- **FR-014**: Le bloc prix DOIT présenter le prix en grand, son unité, l'équivalent en euros et la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. » Une expérience à tarifs multiples DOIT lister chaque tarif avec son libellé. Une capacité plafonnée DOIT être rappelée par un badge indiquant qu'au-delà le prix est sur devis.
- **FR-015**: La galerie DOIT afficher la première photo en grand, un compteur « 1 / N » et des vignettes quand il y a plusieurs photos, et permettre de les parcourir.
- **FR-016**: L'encadré « Complétez votre expérience » DOIT lister les trois options avec leur prix et leur unité. Tant que la sélection n'existe pas (feature 004), il NE DOIT contenir ni case à cocher ni sélecteur de quantité, et DOIT indiquer que les options se demandent avec l'expérience.
- **FR-017**: « Vous aimerez aussi » DOIT proposer jusqu'à trois autres expériences publiées, en priorité de la même catégorie, en cartes compactes avec leur prix.
- **FR-018**: Sur téléphone, la fiche DOIT porter une barre d'action fixe au-dessus de la barre à onglets, avec le prix et son équivalent en euros, ou le badge « Sur devis », et le bouton « Demander ce service ». Le bouton WhatsApp flottant NE DOIT PAS y apparaître (FR-LAND-4). Sur ordinateur, ce bloc DOIT devenir une carte qui reste visible dans la colonne de droite pendant le défilement.
- **FR-019**: « Demander ce service » DOIT ouvrir WhatsApp vers le numéro de Kibreeze avec un message, dans la langue de la page, qui salue Kibreeze, nomme l'expérience et donne l'adresse de sa fiche (FR-WA-6).
- **FR-020**: La fiche NE DOIT afficher aucun bouton « Ajouter à mon séjour », aucun total et aucun sélecteur de quantité avant la feature 004.

#### Effets sur l'accueil et la coque

- **FR-021**: Une fois le catalogue livré, l'onglet Expériences DOIT apparaître dans la barre à onglets et dans la navigation ordinateur ; le bouton « Découvrir les expériences » et les cartes de catégorie de l'accueil DOIVENT mener à la page Expériences, filtrée pour les cartes de catégorie ; les expériences mises en avant DOIVENT mener à leur fiche ; les cartes de catégorie DOIVENT afficher leur nombre d'expériences publiées.

#### Images, langues, accessibilité, référencement

- **FR-022**: Les photos du catalogue DOIVENT être servies en formats modernes, à des tailles adaptées à l'écran, et chargées à la demande hors du premier écran (FR-SEO-4).
- **FR-023**: Tout texte visible DOIT exister en français et en anglais : noms, descriptions, inclus, non inclus, à savoir, libellés de tarifs, textes alternatifs des photos.
- **FR-024**: Les onglets, la galerie et les liens DOIVENT être utilisables au clavier, avec des noms accessibles, et le changement de filtre DOIT être annoncé aux technologies d'assistance.
- **FR-025**: La page Expériences et chaque fiche DOIVENT avoir un titre, une description et une image de partage propres, dans chaque langue (FR-SEO-1).
- **FR-026**: Chaque fiche DOIT exposer des données structurées décrivant l'expérience, avec une offre en FCFA quand le prix est ferme ou « à partir de », et la langue de la page (FR-SEO-3).
- **FR-027**: Le plan du site DOIT inclure la page Expériences et chaque fiche publiée, dans les deux langues.

### Key Entities

- **Expérience** : une activité vendue seule, avec nom, catégorie, description courte et longue, photos et leurs textes alternatifs, prix ou tarifs multiples, règle de quantité, durée, capacité, lieu, ce qui est inclus, non inclus et à savoir, disponibilité (disponible, à confirmer, désactivée), ordre et mise en avant éventuelle.
- **Catégorie** : Nature & Découverte, Aventure ou Détente, avec nom, photo et ordre ; elle définit les onglets de filtre.
- **Option** : une prestation qui complète une expérience sans se vendre seule (guide touristique, maître-nageur, musée d'art), avec son prix et son unité.
- **Tarif** : pour une expérience à tarifs multiples, un prix nommé (individuel, couple, groupe), ferme ou sur devis.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les 13 expériences du guide tarifaire sont consultables, chacune avec sa fiche, dans les deux langues, et chaque prix affiché correspond au guide.
- **SC-002**: Depuis l'accueil, un visiteur atteint la fiche de n'importe quelle expérience en trois gestes au plus.
- **SC-003**: Choisir une catégorie met à jour la liste en moins d'une seconde, sans rechargement visible.
- **SC-004**: La page Expériences et une fiche atteignent au moins 90 sur 100 aux audits automatiques de performance, accessibilité, bonnes pratiques et référencement, sur profil mobile.
- **SC-005**: Depuis une fiche, le visiteur ouvre en un geste une conversation WhatsApp qui nomme l'expérience, dans sa langue.
- **SC-006**: Zéro lien interne cassé et zéro bouton sans effet sur l'ensemble du site construit.
- **SC-007**: Aucune page ne provoque de défilement horizontal entre 320 et 1 920 px de large.
- **SC-008**: Franck reconnaît la page Expériences et la fiche comme conformes aux écrans qu'il a validés, en tenant compte des éléments réservés à la feature 004.

## Assumptions

- **Liste des expériences** : celle du guide tarifaire du 2026-09-26 et de [data-model.md](../../docs/data-model.md), soit 13 expériences et 3 options. « Découverte de Kribi » est retirée (client R2). Les écrans validés montrent 12 cartes : le jet-ski, absent de l'écran, est ajouté parce qu'il figure au catalogue et illustre déjà la catégorie Aventure sur l'accueil.
- **Jet-ski** : « sur devis » en attendant la réponse de Franck à T1, plutôt qu'un prix non confirmé ou une absence du catalogue.
- **Quad** : 10 000 FCFA par session, sans durée, en attendant T4.
- **Catégories** : kayak et paddle en Aventure, comme sur l'écran validé 02b ; chaloupe et jacuzzi en Nature & Découverte ; bateau de plaisance en Détente.
- **Options sur toutes les fiches** : les trois options sont proposées sur chaque fiche, comme sur l'écran validé ; leur pertinence par expérience se discute avec Kibreeze sur WhatsApp.
- **Fiche sans interaction de sélection** : le sélecteur de personnes, les cases à cocher, le total et « Ajouter à mon séjour » des écrans validés arrivent avec la 004, qui leur donne un effet. La 003 affiche les mêmes informations en lecture.
- **Message de demande** : il nomme l'expérience et donne l'adresse de la fiche ; la 004 l'enrichira des quantités et options choisies.
- **Textes descriptifs** : rédigés à partir du guide tarifaire et des réponses de Franck, traduits en anglais par IA puis relus par Zobel (ADR-013). Aucune promesse absente du brief (pas de délai de réponse, pas de remise, pas de « meilleur prix »).
- **Photos** : les photos de Franck triées, hors filigranes. Pour les sujets sans photo de Franck (chaloupe, jacuzzi, feu de plage, croisière, bateau de plaisance), les images générées par Google Stitch pour les écrans validés en tiennent lieu en attendant ses photos (décision de Zobel, 2026-10-05).
- **Lieux** : indiqués seulement quand le guide ou Franck les donnent.

## Dependencies

- Feature 002 fusionnée : coque, route `experiences` réservée, schémas de contenu, formatage des prix, `IMPLEMENTED_ROUTES`.
- Guide tarifaire de Franck ; réponses T1 et T4 attendues pour le jet-ski et le quad.
- Écrans validés 02a, 02b, 03 et 11.

## Out of Scope

- Sélection, quantités, options cochées, total, badge Mon séjour, « Ajouter à mon séjour » : feature 004.
- Hébergements et formules : feature 005. Mobilité TKS® : feature 006.
- Avis, notes, disponibilités en temps réel, réservation ou paiement en ligne.
- Recherche textuelle et tri par prix.
