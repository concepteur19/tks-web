# Feature Specification: Coque du site Kibreeze et page d'accueil

**Feature Branch**: `002-kibreeze-core`

**Created**: 2026-10-04

**Status**: Draft

**Input**: Coque du site Kibreeze : layout commun, barre du haut (logo Kibreeze, sélecteur FR/EN, bouton WhatsApp), barre à onglets mobile (Accueil · Expériences · Hébergements · Formules · Mon séjour, liens secondaires TKS / À propos / Contact), pied de page aux quatre marques de Breezy Groupe, page d'accueil touristique, page Contact, page 404, SEO de base, et (ajout du 2026-10-04) mentions légales, politique de confidentialité avec gestion des cookies et conditions d'utilisation. Exigences FR-LAND-*, FR-SEO-1/2/3. Référence visuelle : `docs/design-exports/` (01-accueil, 10-accueil-ordinateur). Bilingue FR/EN, aucune page promise qui n'existe pas encore : les sections non livrées renvoient vers WhatsApp.

## Contexte

La feature 001 a livré un squelette bilingue sans contenu, encore habillé de façon provisoire. Depuis, le projet a pivoté vers **Kibreeze**, marque de tourisme à Kribi, avec TKS® en section secondaire de mobilité ([client-answers.md](../../docs/client-answers.md), sections 1 ter et 1 quater), et Franck a validé les écrans le 2026-10-04 ([design-exports/](../../docs/design-exports/README.md)).

Cette feature est la première que le visiteur voit vraiment. Elle pose la coque commune à toutes les pages (barre du haut, barre à onglets, pied de page, bouton WhatsApp) et livre l'accueil, Contact, la page d'erreur et les trois pages légales : mentions légales, confidentialité et cookies, conditions d'utilisation. Les exigences de référence sont FR-LAND-1 à 7, FR-WA-7, FR-EUR-1 à 3 et FR-SEO-1 à 3 de [functional-requirements.md](../../docs/functional-requirements.md).

Les pages Expériences, Hébergements, Formules, Mobilité et Mon séjour arrivent avec les features 003 à 006. D'ici là, le site ne doit jamais promettre une page qui n'existe pas : un lien vers une page non livrée devient une prise de contact WhatsApp, et un onglet sans page n'apparaît pas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Découvrir Kibreeze et avoir envie de venir à Kribi (Priority: P1)

Un touriste étranger ou un expatrié ouvre le site sur son téléphone, souvent depuis un lien partagé. En quelques secondes, il comprend que Kibreeze organise des expériences à Kribi. Il fait défiler une page riche en photos : les trois catégories d'expériences, quelques expériences à ne pas manquer avec leur prix, une bande immersive, les hébergements, les formules, une mention sobre de la mobilité TKS®, une présentation de Kibreeze, puis une invitation à écrire sur WhatsApp.

**Why this priority**: L'accueil porte la première impression de la marque. Franck l'a formulé ainsi : le site doit donner envie de venir à Kribi avant même que le visiteur regarde les prix. Sans cet écran, les features suivantes n'ont pas de porte d'entrée.

**Independent Test**: Ouvrir l'accueil sur un téléphone de 360 px de large, faire défiler toute la page, et vérifier que les sections apparaissent dans l'ordre validé, en français puis en anglais, avec des photographies et des prix conformes aux données validées.

**Acceptance Scenarios**:

1. **Given** un visiteur sur téléphone, **When** il ouvre l'accueil, **Then** le premier écran montre une grande photographie de Kribi, le logo Kibreeze, la signature « Kribi is a feeling », le titre « Découvrez Kribi autrement », une phrase d'accroche et deux boutons, « Découvrir les expériences » et « Planifier mon séjour ».
2. **Given** l'accueil, **When** le visiteur fait défiler la page, **Then** les sections apparaissent dans cet ordre : catégories, expériences à ne pas manquer, bande immersive, hébergements, formules, TKS® Mobilité, « Qui sommes-nous », bloc de conversion WhatsApp, pied de page.
3. **Given** la section TKS® Mobilité, **When** le visiteur la voit, **Then** elle est plus compacte que les autres, sans photographie de fond ni cartes d'expérience, et ne précède jamais les expériences.
4. **Given** une expérience mise en avant avec un prix ferme ou un prix « à partir de », **When** elle s'affiche, **Then** le montant en FCFA est suivi, sur sa propre ligne et en plus petit, de son équivalent indicatif en euros à deux décimales, et la page porte une seule fois la mention « tarifs indicatifs ».
5. **Given** l'accueil anglais sous `/en/`, **When** le visiteur le fait défiler, **Then** toutes les sections ont leurs textes en anglais, sauf la signature « Kribi is a feeling », qui reste identique, et les montants suivent le format anglais.

---

### User Story 2 - Joindre Kibreeze sur WhatsApp depuis n'importe où (Priority: P2)

Le visiteur veut poser une question ou organiser un séjour. Quelle que soit la page où il se trouve, il trouve un moyen d'écrire à Kibreeze sur WhatsApp en un geste, avec un message déjà rédigé dans sa langue. S'il cherche les coordonnées, une page Contact les réunit.

**Why this priority**: WhatsApp est l'unique canal de conversion du site. Tant que la sélection et l'estimation (feature 004) n'existent pas, le bouton WhatsApp est le seul résultat commercial que le site peut produire.

**Independent Test**: Depuis l'accueil, la page Contact et la page d'erreur, dans chaque langue, toucher le bouton WhatsApp et vérifier que la conversation s'ouvre vers le bon numéro avec le message générique de la bonne langue.

**Acceptance Scenarios**:

1. **Given** une page en français, **When** le visiteur touche un bouton WhatsApp sans sélection, **Then** WhatsApp s'ouvre vers le numéro de Kibreeze avec le message « Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi. »
2. **Given** une page en anglais, **When** il fait de même, **Then** le message est « Hello Kibreeze, I would like some information about your experiences in Kribi. »
3. **Given** l'accueil, la page Contact ou la page d'erreur sur téléphone, **When** la page s'affiche, **Then** un bouton WhatsApp flottant rond est visible en bas à droite, au-dessus de la barre à onglets, sans la chevaucher ni masquer de contenu de façon permanente.
4. **Given** la page Contact, **When** le visiteur l'ouvre, **Then** il voit le numéro WhatsApp cliquable, « Kribi, Cameroun », le bouton WhatsApp générique et la présentation de Kibreeze, sans formulaire et sans horaires.
5. **Given** une coordonnée que Franck n'a pas encore fournie (e-mail, réseaux sociaux), **When** la page Contact ou le pied de page s'affiche, **Then** cette coordonnée est absente, sans emplacement vide ni texte d'attente.

---

### User Story 3 - Se repérer et changer de langue sur toutes les pages (Priority: P3)

Sur téléphone, le visiteur navigue avec une barre à onglets fixée en bas. Sur ordinateur, la navigation passe dans la barre du haut. Sur toutes les pages, il peut changer de langue et retrouver la page équivalente. Le pied de page rattache Kibreeze à Breezy Groupe et à ses marques sœurs.

**Why this priority**: La coque est partagée par toutes les pages à venir. La poser maintenant évite que chaque feature réinvente sa navigation, mais elle n'a de valeur visible qu'une fois l'accueil en place.

**Independent Test**: Parcourir l'accueil, Contact et la page d'erreur sur téléphone puis sur ordinateur, dans les deux langues, au clavier seul, et vérifier que chaque lien mène à une page qui existe.

**Acceptance Scenarios**:

1. **Given** un téléphone, **When** une page s'affiche, **Then** une barre à onglets est fixée en bas, l'onglet de la page courante est signalé, et il n'y a ni menu hamburger ni icône Mon séjour dans la barre du haut.
2. **Given** un ordinateur, **When** une page s'affiche, **Then** la barre à onglets disparaît et ses destinations apparaissent dans la barre du haut, avec le logo, le sélecteur FR | EN et le bouton WhatsApp.
3. **Given** une destination dont la page n'est pas encore livrée, **When** la navigation s'affiche, **Then** son onglet ou son lien n'apparaît pas, et il apparaît sans autre modification le jour où la page est livrée.
4. **Given** n'importe quelle page dans une langue, **When** le visiteur choisit l'autre langue, **Then** il arrive sur la page équivalente, sans détection automatique ni redirection.
5. **Given** le pied de page, **When** il s'affiche, **Then** il mentionne les quatre marques de Breezy Groupe, Kibreeze, TKS®, iBreezy et Breezy Delivery, et seule Kibreeze est un lien.
6. **Given** une adresse inexistante sous `/` ou sous `/en/`, **When** le visiteur l'ouvre, **Then** la page d'erreur s'affiche dans la langue de l'adresse, avec la coque complète et un retour vers l'accueil.

---

### User Story 4 - Être trouvé et bien présenté par les moteurs et les partages (Priority: P4)

Quand un lien du site est partagé sur WhatsApp ou sur un réseau social, l'aperçu montre un titre, une description et une image propres à la page et à sa langue. Les moteurs de recherche trouvent les deux langues et identifient Kibreeze comme une entreprise locale à Kribi.

**Why this priority**: Une grande partie du trafic attendu vient de liens partagés. L'effet est réel mais ne se voit qu'une fois l'accueil publié.

**Independent Test**: Coller l'adresse de l'accueil et de Contact dans un outil d'aperçu de partage, dans chaque langue, et lire le plan du site généré.

**Acceptance Scenarios**:

1. **Given** chaque page livrée dans chaque langue, **When** on lit ses métadonnées, **Then** elle a un titre et une description uniques sur tout le site, une adresse canonique propre à sa langue et une image d'aperçu.
2. **Given** le site construit, **When** on lit le plan du site, **Then** il liste chaque page livrée dans les deux langues avec ses équivalents, et aucune page non livrée.
3. **Given** l'accueil, **When** un moteur lit ses données structurées, **Then** il trouve une entreprise locale nommée Kibreeze, sa zone, Kribi, son numéro de téléphone, et la langue de la page.

---

### User Story 5 - Consulter les informations légales du site (Priority: P5)

Un visiteur, souvent européen, veut savoir qui édite le site, ce qu'il advient de ses données et sous quelles conditions les prix et les demandes de réservation sont présentés. Depuis le pied de page de n'importe quelle page, il accède aux mentions légales, à la politique de confidentialité, qui traite aussi des cookies, et aux conditions d'utilisation, dans sa langue.

**Why this priority**: Ces pages sont obligatoires avant la mise en ligne sous kibreeze.com et rassurent une clientèle étrangère qui réserve à distance. Elles n'apportent pas de conversion directe, d'où leur rang, mais elles bloquent le lancement si elles manquent.

**Independent Test**: Depuis le pied de page, ouvrir chacune des trois pages dans chaque langue, et vérifier que l'éditeur, l'hébergeur, les données traitées, l'absence de cookie de suivi et les conditions d'utilisation y figurent.

**Acceptance Scenarios**:

1. **Given** le pied de page de n'importe quelle page, **When** le visiteur le parcourt, **Then** il trouve trois liens : « Mentions légales », « Confidentialité et cookies », « Conditions d'utilisation », et leurs équivalents anglais sur les pages anglaises.
2. **Given** la page des mentions légales, **When** le visiteur l'ouvre, **Then** il y trouve l'identité de l'éditeur, ses coordonnées, le responsable de la publication, l'hébergeur du site avec son adresse, et la propriété des contenus et des photographies.
3. **Given** la politique de confidentialité, **When** le visiteur l'ouvre, **Then** elle explique que le site ne collecte aucune donnée personnelle par formulaire, que la sélection Mon séjour reste sur son appareil, que l'hébergeur traite des journaux techniques, que l'envoi d'un message WhatsApp transmet ses informations à WhatsApp et à Kibreeze, ce que Kibreeze fait de ces messages, et comment exercer ses droits.
4. **Given** la section cookies, **When** le visiteur la lit, **Then** elle liste chaque cookie ou stockage local utilisé par le site, sa finalité et sa durée, et indique qu'aucun traceur publicitaire ni de mesure d'audience soumis à consentement n'est déposé.
5. **Given** les conditions d'utilisation, **When** le visiteur les lit, **Then** il y apprend que les prix sont indicatifs, que l'estimation n'engage ni lui ni Kibreeze, qu'une demande envoyée sur WhatsApp devient une réservation seulement après confirmation de Kibreeze, et quel droit s'applique.

---

### Edge Cases

- **Page de destination non livrée** : les boutons et liens de l'accueil qui visent une page future (« Découvrir les expériences », une catégorie, « Voir tous les hébergements », « Voir les 4 formules », « Voir » de la section TKS®, « Planifier mon séjour ») ouvrent WhatsApp avec le message générique, avec un libellé qui le dit ou une icône WhatsApp. Ils redeviennent des liens internes quand leur page est livrée.
- **Bouton « Ajouter à mon séjour »** : il n'apparaît pas sur les cartes tant que la sélection (feature 004) n'existe pas. Une carte ne montre jamais un bouton qui ne fait rien.
- **Badge Mon séjour** : il n'apparaît qu'avec l'onglet Mon séjour, donc avec la feature 004.
- **Photo manquante ou inutilisable** : une carte sans photographie appartenant à Franck utilise une photographie de paysage de Kribi qui lui appartient, jamais une des 20 photos filigranées retirées.
- **Expérience sur devis** : une carte mise en avant dont le prix est « sur devis » affiche ce badge, sans montant et sans équivalent en euros.
- **Nombre d'expériences par catégorie** : il n'est affiché que s'il correspond aux expériences réellement publiées dans la catégorie. Sinon la carte n'affiche pas de nombre.
- **Texte anglais plus long** : les libellés passent à la ligne sans casser la mise en page, avec une marge de 30 % prévue sur la longueur.
- **JavaScript désactivé** : tout le contenu de l'accueil reste lisible, la navigation et les boutons WhatsApp restent des liens qui fonctionnent. Le carrousel des expériences mises en avant reste parcourable par défilement.
- **Écran très étroit (320 px) ou très large (plus de 1 440 px)** : pas de défilement horizontal de la page ; au-delà de 1 200 px, le contenu reste centré et le hero ne s'étire pas démesurément en hauteur.
- **Préférence « réduire les animations »** : le chevron animé du hero et les éventuelles transitions sont désactivés.
- **Information légale manquante** : tant que Franck n'a pas fourni l'identité juridique de l'éditeur (raison sociale, forme, numéro d'immatriculation, adresse, responsable de la publication), la page des mentions légales affiche les informations disponibles et omet les autres ; la mise en ligne sous kibreeze.com reste bloquée tant que ces informations manquent.
- **Ajout futur d'un traceur** : si une mesure d'audience ou un service tiers soumis à consentement est ajouté plus tard, un mécanisme de consentement préalable devient obligatoire avant tout dépôt, et la section cookies est mise à jour dans la même modification.
- **Numéro WhatsApp absent ou mal formé à la construction** : le comportement de 001 s'applique ([contracts/env.md](../001-project-foundation/contracts/env.md)).

## Requirements *(mandatory)*

### Functional Requirements

#### Coque commune

- **FR-001**: Chaque page DOIT afficher une barre du haut contenant le logo Kibreeze rouge sans le symbole, le sélecteur de langue FR | EN et un bouton WhatsApp, et rien d'autre sur téléphone (FR-LAND-3).
- **FR-002**: Sur téléphone, chaque page DOIT afficher une barre à onglets fixée en bas, dont les destinations possibles sont, dans cet ordre, Accueil, Expériences, Hébergements, Formules et Mon séjour. L'onglet de la page courante DOIT être signalé visuellement et aux technologies d'assistance (FR-LAND-3).
- **FR-003**: Sur ordinateur, la barre à onglets DOIT laisser place à une navigation complète dans la barre du haut : logo, Expériences, Hébergements, Formules, Mobilité, puis le sélecteur de langue, Mon séjour avec son badge, et le bouton WhatsApp.
- **FR-004**: Une destination de navigation DOIT n'apparaître que si sa page est livrée. Aucun lien interne du site ne DOIT mener à une page inexistante.
- **FR-005**: Le pied de page DOIT afficher le logo Kibreeze complet en crème sur fond très sombre, la signature, les liens vers les pages livrées parmi Expériences, Hébergements, Formules, Mobilité TKS®, À propos et Contact, « Kribi, Cameroun », et la ligne « Kibreeze est une marque de Breezy Groupe, avec TKS®, iBreezy et Breezy Delivery. » Seule Kibreeze DOIT être un lien (FR-LAND-6).
- **FR-006**: Les icônes de réseaux sociaux du pied de page DOIVENT n'apparaître que pour les comptes dont Franck a fourni l'adresse.
- **FR-007**: Le bouton WhatsApp flottant DOIT apparaître sur l'accueil, Contact et la page d'erreur, rond, ancré en bas à droite, au moins 16 px au-dessus de la barre à onglets, sans la chevaucher (FR-LAND-4).

#### WhatsApp

- **FR-008**: Tout bouton WhatsApp sans sélection DOIT ouvrir une conversation avec le numéro configuré de Kibreeze, préremplie avec le message générique de la langue de la page (FR-LAND-5).
- **FR-009**: Un lien de l'accueil dont la page cible n'est pas livrée DOIT ouvrir WhatsApp avec le message générique, et l'indiquer par son libellé ou par une icône WhatsApp.

#### Accueil

- **FR-010**: L'accueil DOIT présenter ses sections dans l'ordre de FR-LAND-2 et de la maquette validée [01-accueil](../../docs/design-exports/01-accueil.jpg) : hero, « Nos expériences » (trois catégories), « À ne pas manquer » (quatre expériences mises en avant), bande immersive « MER · FORÊT · CHUTES · PIROGUE », « Où dormir à Kribi », « Des séjours déjà composés », TKS® Mobilité, « Qui sommes-nous », bloc de conversion « Un séjour sur mesure ? », pied de page.
- **FR-011**: Le hero DOIT occuper la majeure partie du premier écran sur téléphone, avec une photographie de Kribi assombrie progressivement vers le bas, le logo Kibreeze crème, la signature, le titre, la phrase d'accroche et les deux boutons de la maquette.
- **FR-012**: Les trois catégories, Nature & Découverte, Aventure et Détente, DOIVENT apparaître en cartes photographiques entièrement cliquables.
- **FR-013**: Les quatre expériences mises en avant (Chutes de la Lobé, Excursion en pirogue, Croisière en bateau, Campement Bagyeli) DOIVENT afficher photo, nom, description courte et prix selon les trois formes de prix du site : prix ferme, « à partir de », ou badge « sur devis ».
- **FR-014**: Les sections hébergements et formules DOIVENT afficher les montants validés par Franck le 2026-09-26 : Chambre à partir de 15 000 FCFA, Studio à partir de 30 000 FCFA et Villa à partir de 150 000 FCFA par nuit ; Package Découverte 100 000 FCFA et Package Aventure 150 000 FCFA pour 2 personnes.
- **FR-015**: Chaque montant en FCFA affiché DOIT être suivi, sur sa propre ligne et en plus petit, de son équivalent indicatif en euros, calculé à taux fixe, à deux décimales, au format de la langue. La mention « tarifs indicatifs » DOIT figurer une fois par page qui affiche des montants (FR-EUR-1 à 3).
- **FR-016**: La section TKS® Mobilité DOIT tenir sur une seule rangée compacte, fond gris très clair, logo TKS® en noir plus petit que celui de Kibreeze, sans photographie ni traitement de carte d'expérience (FR-LAND-7).
- **FR-017**: La section « Qui sommes-nous » DOIT reprendre mot pour mot le début du texte de présentation fourni par Franck, avec une photographie de paysage de Kribi et non d'équipe.

#### Contact et page d'erreur

- **FR-018**: La page Contact DOIT afficher le numéro WhatsApp cliquable, « Kribi, Cameroun », le bouton WhatsApp générique et le texte de présentation complet de Kibreeze, et DOIT omettre toute coordonnée non fournie. Elle NE DOIT contenir ni formulaire ni horaires (FR-WA-7).
- **FR-019**: La page d'erreur DOIT exister dans les deux langues, s'afficher dans la langue de l'adresse demandée, porter la coque commune et proposer un retour vers l'accueil.

#### Langues, contenu et accessibilité

- **FR-020**: Toutes les pages livrées DOIVENT exister en français sans préfixe et en anglais sous `/en/`, aux adresses de la table de routes, avec un sélecteur qui mène à la page équivalente (FR-I18N-1, FR-I18N-2).
- **FR-021**: Aucun texte visible NE DOIT être écrit en dur dans l'interface : chaque texte DOIT exister en français et en anglais, sauf la signature « Kribi is a feeling » et les noms de marque (FR-I18N-4).
- **FR-022**: Le site NE DOIT afficher aucune mention de livraison, hormis le nom « Breezy Delivery » dans le pied de page, aucun avis ni note, aucun prix en dollars, aucune promesse commerciale absente du brief validé (délai de réponse, remise, meilleur prix).
- **FR-023**: L'interface DOIT être utilisable au clavier, avec des noms accessibles sur tous les éléments interactifs, des zones tactiles d'au moins 44 px et des contrastes conformes à WCAG AA (FR-SEO-6).
- **FR-024**: Les coins des cartes, images et boutons NE DOIVENT pas dépasser 4 px d'arrondi ; le cercle est réservé au bouton WhatsApp flottant et aux pastilles de compteur. Le vert WhatsApp est réservé aux boutons WhatsApp.

#### Pages légales

- **FR-028**: Le site DOIT proposer, dans les deux langues, une page de mentions légales, une page « Confidentialité et cookies » et une page de conditions d'utilisation, toutes liées depuis le pied de page de chaque page.
- **FR-029**: Les mentions légales DOIVENT indiquer l'éditeur du site (raison sociale ou nom, forme juridique, numéro d'immatriculation, adresse, téléphone, e-mail), le responsable de la publication, l'hébergeur avec sa raison sociale et son adresse, et la propriété intellectuelle des textes, logos et photographies.
- **FR-030**: La politique de confidentialité DOIT décrire chaque traitement de données lié au site : journaux techniques de l'hébergeur, sélection conservée sur l'appareil du visiteur, messages WhatsApp reçus par Kibreeze. Pour chacun : finalité, base légale, destinataires, durée de conservation, transferts hors du pays du visiteur. Elle DOIT indiquer les droits du visiteur (accès, rectification, effacement, opposition) et le moyen de les exercer.
- **FR-031**: Le site NE DOIT déposer aucun cookie ni traceur non indispensable au service demandé sans consentement préalable. Tant qu'il n'en dépose aucun, il NE DOIT pas afficher de bandeau de consentement, et la section cookies DOIT le dire et lister les stockages indispensables utilisés.
- **FR-032**: Les conditions d'utilisation DOIVENT couvrir l'objet du site, le caractère indicatif des prix et de leur équivalent en euros, le caractère non contractuel de l'estimation, le passage d'une demande WhatsApp à une réservation confirmée par Kibreeze, les responsabilités, la propriété intellectuelle, le droit applicable et la date de dernière mise à jour.
- **FR-033**: Chaque page légale DOIT afficher sa date de dernière mise à jour, et ne DOIT pas être indexée comme page de destination principale dans les données structurées.

#### Référencement

- **FR-025**: Chaque page livrée, dans chaque langue, DOIT avoir un titre et une description uniques, des balises de partage avec image, une adresse canonique et des liens alternatifs vers l'autre langue (FR-SEO-1, FR-I18N-3).
- **FR-026**: Le plan du site DOIT lister les pages livrées dans les deux langues avec leurs équivalents, et exclure les pages non livrées et les pages de développement (FR-SEO-2).
- **FR-027**: L'accueil DOIT exposer des données structurées d'entreprise locale : nom Kibreeze, zone Kribi, Cameroun, numéro de téléphone, langue de la page (FR-SEO-3).

### Key Entities

- **Destination de navigation** : une page du site désignée par sa clé de route, avec son libellé dans chaque langue, sa place dans la barre à onglets ou dans la navigation ordinateur, et son état livré ou non. L'état livré décide de sa présence dans la navigation, dans le plan du site et dans les liens de l'accueil.
- **Catégorie d'expérience** : Nature & Découverte, Aventure ou Détente, avec son nom dans chaque langue, sa photographie et le nombre d'expériences publiées.
- **Expérience mise en avant** : une expérience du catalogue signalée comme telle, avec son nom, sa description courte, sa photographie et son prix dans l'une des trois formes. Le catalogue complet relève de la feature 003.
- **Repère d'hébergement et formule** : un type de logement ou une formule montré en aperçu sur l'accueil, avec son prix de départ et son unité. Leur catalogue complet relève de la feature 005.
- **Identité légale de l'éditeur** : raison sociale ou nom, forme juridique, immatriculation, adresse, responsable de la publication. Fournie par Franck, elle conditionne les mentions légales.
- **Coordonnées de Kibreeze** : numéro WhatsApp, localisation, e-mail et réseaux sociaux, chacun facultatif sauf le numéro, et omis tant qu'il n'est pas fourni.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur un téléphone de milieu de gamme en 4G, la photographie et le titre du hero de l'accueil sont affichés en moins de 2,5 secondes.
- **SC-002**: L'accueil, la page Contact et la page d'erreur atteignent au moins 90 sur 100 aux audits automatiques de performance, accessibilité, bonnes pratiques et référencement, dans les deux langues, sur profil mobile.
- **SC-003**: Un visiteur ouvre une conversation WhatsApp préremplie dans sa langue en un seul geste depuis n'importe quelle page livrée.
- **SC-004**: Zéro lien interne cassé sur l'ensemble du site construit, dans les deux langues.
- **SC-005**: Aucune page ne provoque de défilement horizontal entre 320 et 1 920 px de large.
- **SC-006**: Toute la navigation et tous les boutons de l'accueil, de Contact et de la page d'erreur sont atteignables et activables au clavier seul, sans violation automatique d'accessibilité.
- **SC-007**: 100 % des textes visibles existent dans les deux langues : la construction de production échoue s'il en manque un.
- **SC-008**: Franck, à qui l'on montre l'accueil sur son téléphone, le reconnaît comme conforme aux écrans qu'il a validés le 2026-10-04, sans écart bloquant.
- **SC-009**: Chaque page légale est atteignable en un geste depuis le pied de page de n'importe quelle page, dans les deux langues.
- **SC-010**: Un contrôle des cookies et stockages du site construit ne relève aucun élément absent de la section cookies.

## Assumptions

- **Taux de conversion** : parité officielle fixe 1 € = 655,957 FCFA, stockée en configuration avec sa source (FR-EUR-2). 25 000 FCFA s'affichent donc « ≈ 38,11 € », et non « ≈ 38,00 € » comme dans l'exemple arrondi du brief.
- **Données de l'accueil** : les prix des expériences mises en avant viennent du guide tarifaire de Franck ; ceux des hébergements et des formules, de ses réponses du 2026-09-26 ([client-answers.md](../../docs/client-answers.md), section 1 quater). Cette feature publie le contenu des trois catégories et des quatre expériences mises en avant ; la feature 003 complète le catalogue.
- **À propos** : il n'existe pas de page À propos distincte. Le lien « À propos » du pied de page et le lien « En savoir plus » de l'accueil mènent à la section de présentation de la page Contact, qui porte le texte complet de Franck. Choix validé par Zobel le 2026-10-04.
- **Téléphone** : le numéro d'appel est le même que le numéro WhatsApp (client K6) ; il n'est donc pas affiché séparément (FR-WA-7).
- **Hero** : une photographie, pas une vidéo. La vidéo d'accueil reste conditionnée à la fourniture d'une vidéo courte et légère (client G4).
- **Photos** : seules les 93 photos appartenant à Franck sont utilisées. Les photos du village Bagyeli montrent des personnes identifiables, dont des enfants ; leur accord a été obtenu, information relayée par Zobel le 2026-10-04, sans trace écrite de Franck à ce jour. Ces photos sont donc utilisables pour la carte Campement Bagyeli. Garder une trace écrite de ces accords, en particulier pour les mineurs, reste recommandé.
- **Cookies** : le site ne dépose aucun cookie de suivi et n'a pas de mesure d'audience en V1 (TR-70). La sélection Mon séjour, conservée sur l'appareil à partir de la feature 004, est un stockage indispensable au service demandé et ne requiert pas de consentement. D'où l'absence de bandeau, conforme au brief validé.
- **Cadre juridique** : les textes visent le droit camerounais, celui de l'éditeur, et le RGPD européen, parce que le site s'adresse d'abord à des touristes étrangers, dont des Européens. Ils sont rédigés comme une base sérieuse, pas comme un avis juridique : une relecture par un professionnel du droit est recommandée avant le lancement.
- **Hébergeur** : Cloudflare, hébergeur de production retenu (ADR de la feature 001).
- **Conditions de vente** : le site ne vend rien en ligne ; les conditions d'une prestation (acompte, annulation) sont communiquées avec le devis sur WhatsApp. Des conditions générales de vente pourront être publiées quand Franck les aura définies.
- **Onglets livrés** : avec cette seule feature, la barre à onglets ne contient que l'onglet Accueil. Elle se complète au fil des features 003 à 005.
- **Version ordinateur** : elle suit la maquette [10-accueil-ordinateur](../../docs/design-exports/10-accueil-ordinateur.jpg) pour l'accueil et les règles « Version ordinateur » du brief pour Contact et la page d'erreur, qui n'ont pas de maquette.
- **Polices, couleurs, arrondis** : ceux validés et déjà en place dans le socle de style (ADR-015, rouge #8C0120).

## Dependencies

- Feature 001 livrée et fusionnée : table de routes, dictionnaires, socle de style, garde-fous, publication.
- Écrans validés dans [docs/design-exports/](../../docs/design-exports/README.md).
- Logos Kibreeze nettoyés dans le dépôt ; logo TKS® en lettres seules.
- Photos triées de Franck dans `Elements/tri-par-activite/`, hors photos filigranées.
- Identité légale de l'éditeur, à fournir par Franck, qui dépend de sa réponse sur la relation juridique entre Kibreeze et TKS® (question K3). Bloquante pour le lancement, pas pour le développement.

## Out of Scope

- Les pages Expériences, fiches, Hébergements, Formules, Mobilité et Mon séjour, qui relèvent des features 003 à 006.
- La sélection, le badge Mon séjour, le bouton « Ajouter à mon séjour », l'estimation et le message récapitulatif WhatsApp (feature 004).
- Les données structurées des fiches (feature 003).
- La vidéo d'accueil, la mesure d'audience, les avis, la FAQ et le formulaire de contact.
- Les conditions générales de vente (acompte, annulation, remboursement), tant que Franck ne les a pas définies.
- Tout mécanisme de consentement aux cookies, inutile tant que le site ne dépose aucun traceur non indispensable.
