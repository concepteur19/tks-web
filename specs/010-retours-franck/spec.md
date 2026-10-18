# Feature Specification: Retours de Franck

**Feature Branch**: `010-retours-franck`

**Created**: 2026-10-18

**Status**: Draft

**Input**: Retours de Franck des 11 et 12 octobre 2026 (10 notes vocales, 11 captures, `Elements/retours de franck/`), relayés par Zobel le 18 octobre avec ses compléments : descriptions des plats et nouveau plat Ebanjea, consignes des six parcours (« roadmaps »), « il manque appartement » sur l'aperçu Hébergements, « ça n'illustre pas le maban ». Analyse point par point et réponses de Zobel : conversation du 2026-10-18.

## Contexte

Les retours portent sur la version du 11 octobre (trois onglets, avant les pages Hébergements, Formules, Mobilité et les animations). Trois sont déjà réglés depuis : les quatre formules sont visibles et ajoutables (page Formules, 005), les liens qui ouvraient WhatsApp faute de page mènent désormais à leur page (005, 006), la page Mobilité existe (006). Cette spec traite le reste.

Deux décisions de Zobel du 18 octobre : la Mobilité de l'accueil passe à l'échelle des hébergements, avec les véhicules, comme Franck l'a demandé les 11 et 12 ; les photos de clients restent utilisées.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Un catalogue juste et clair (Priority: P1)

Un visiteur parcourt les spécialités culinaires : chaque plat a une vraie description, l'Ebanjea y figure, et il commande « 2 plats » de crabe, pas « 2 personnes ». Dans Mon séjour, ses visites reprennent d'emblée ses 3 voyageurs, sous le libellé « Personnes pour cette activité ». Le pique-nique s'appelle « Pique-nique en bord de mer ».

**Why this priority**: Ce sont des erreurs de sens relevées par Franck, visibles par tout visiteur, et rapides à corriger.

**Independent Test**: Ajouter un plat et une visite après avoir indiqué 3 voyageurs ; vérifier libellés, quantités et message WhatsApp.

**Acceptance Scenarios**:

1. **Given** l'univers Spécialités culinaires, **When** il s'affiche, **Then** les 11 plats (dont l'Ebanjea) portent la description de Franck, et aucune description ne se contente de répéter le titre.
2. **Given** un plat ajouté au séjour, **When** le visiteur règle sa quantité, **Then** elle se compte en plats (« 1 plat », « 2 plats ») dans Mon séjour et dans le message WhatsApp.
3. **Given** 3 voyageurs indiqués dans Mon séjour, **When** le visiteur ajoute une visite prix par personne, **Then** la ligne part de 3 personnes (dans les bornes de la prestation), sous le libellé « Personnes pour cette activité ».
4. **Given** le pique-nique, **When** il s'affiche, **Then** il s'appelle « Pique-nique en bord de mer » ; son adresse reste joignable.
5. **Given** le maban, **When** sa carte s'affiche, **Then** elle ne montre plus l'image générée que Franck juge fausse.

---

### User Story 2 - Choisir un parcours tout fait (Priority: P1)

Une famille hésite entre deux parcours. Elle ouvre la fiche de « Kribi Culture & Patrimoine » : photo, description, étapes (le Village Mayi inclut ponts, phare et monument), « À partir de 10 000 FCFA / personne », une demi-journée, minimum 2 personnes, et la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par KIBREEZE ». Elle l'ajoute à son séjour pour 4, ou touche « Personnaliser ce parcours » pour envoyer ses préférences sur WhatsApp.

**Why this priority**: Consigne explicite de Franck (une fiche par parcours, durées, mention) ; les parcours sont son offre phare.

**Independent Test**: Ouvrir chacune des six fiches depuis la page Formules ; vérifier contenu, ajout au séjour et message WhatsApp.

**Acceptance Scenarios**:

1. **Given** la page Formules, **When** le visiteur touche un parcours, **Then** sa fiche s'ouvre avec titre, photo, description, étapes dans l'ordre, tarif, durée et minimum de participants quand ils sont définis.
2. **Given** une fiche de parcours, **When** elle s'affiche, **Then** le tarif se lit « À partir de X FCFA / personne » ou « Tarif sur demande », suivi de « Prix indicatif, sous réserve de disponibilité et de confirmation par KIBREEZE » et d'une phrase expliquant que le prix final dépend du nombre de participants, de la date, du transport et des options.
3. **Given** une fiche, **When** le visiteur règle 4 personnes et touche « Ajouter à mon séjour », **Then** la ligne entre dans Mon séjour pour 4, au tarif du parcours (jamais la somme des visites).
4. **Given** une fiche, **When** le visiteur touche « Personnaliser ce parcours », **Then** WhatsApp s'ouvre avec un message qui nomme le parcours, le nombre de personnes choisi et l'adresse de la fiche.
5. **Given** « Kribi Nature & Littoral », **When** les étapes s'affichent, **Then** le fleuve Lobé est indiqué comme inclus dans l'expérience Bagyeli ; **Given** les parcours qui passent par le Village Mayi, **Then** l'étape précise qu'elle inclut le pont de l'Esclavage, le pont des Enclaves, le phare et le monument.

---

### User Story 3 - Un accueil plus vivant et complet (Priority: P2)

Sur l'accueil, trois ou quatre photos de Kribi se succèdent en fondu dans le hero. L'aperçu des hébergements montre les quatre types, appartement compris. Plus bas, la mobilité TKS® présente ses trois catégories de véhicules avec photo et prix, à l'échelle de l'aperçu des hébergements.

**Why this priority**: Demandes de Franck pour l'accueil ; elles améliorent la vitrine sans changer le fonctionnement.

**Independent Test**: Ouvrir l'accueil sur téléphone ; compter les photos du hero, les types d'hébergement, les catégories de véhicules ; activer « réduire les animations ».

**Acceptance Scenarios**:

1. **Given** l'accueil, **When** il s'ouvre, **Then** la première photo du hero s'affiche sans attente, puis 3 ou 4 photos se succèdent en fondu lent ; le texte et les boutons restent lisibles sur chacune.
2. **Given** « réduire les animations », **When** l'accueil s'ouvre, **Then** le hero reste sur la première photo.
3. **Given** le diaporama en cours, **When** le visiteur touche le bouton Pause, **Then** il s'arrête sur la photo affichée ; « Lecture » le relance (accessibilité : tout contenu qui défile seul doit pouvoir s'arrêter).
4. **Given** l'aperçu Hébergements, **When** il s'affiche, **Then** il montre Chambre, Studio, Appartement et Villa, chacun avec son prix de départ.
5. **Given** l'aperçu Mobilité, **When** il s'affiche, **Then** il montre Luxe, Premium et Yaris avec photo, modèles et « À partir de X FCFA / jour », chaque carte menant à sa catégorie sur la page Mobilité ; il reste placé après les sections Kibreeze.

---

### User Story 4 - Choisir ses dates dans un calendrier (Priority: P2)

Dans Mon séjour, le visiteur touche « Arrivée » : le calendrier de son téléphone s'ouvre ; il choisit le 12 décembre, puis le 16 pour le départ. Le message WhatsApp indique « du 12 au 16 décembre 2026 ».

**Why this priority**: Demande de Franck ; évite les dates mal écrites (« 12-16decembre »).

**Independent Test**: Choisir arrivée et départ, vérifier le message ; essayer un départ avant l'arrivée.

**Acceptance Scenarios**:

1. **Given** Mon séjour, **When** le visiteur touche le champ Arrivée ou Départ, **Then** un calendrier s'ouvre.
2. **Given** une arrivée choisie, **When** il choisit le départ, **Then** aucune date antérieure à l'arrivée n'est acceptée.
3. **Given** des dates choisies, **When** il envoie sa demande, **Then** le message indique les dates en toutes lettres, dans sa langue.
4. **Given** un séjour enregistré avant ce changement avec des dates écrites à la main, **When** il revient, **Then** ce texte n'est pas perdu : il apparaît dans le message tant que le visiteur n'a pas choisi de nouvelles dates.

---

### User Story 5 - Voir les photos en entier (Priority: P3)

Sur la fiche du pique-nique, la photo est cadrée sur le pique-nique et non sur le ciel ; en la touchant, le visiteur la voit en entier, en grand, puis la referme.

**Why this priority**: Améliore la lecture des photos ; le site reste utilisable sans.

**Independent Test**: Toucher une photo de fiche, la voir en entier, fermer au clavier et au toucher.

**Acceptance Scenarios**:

1. **Given** une photo de carte ou de fiche, **When** elle s'affiche recadrée, **Then** le cadrage garde le sujet choisi pour cette photo.
2. **Given** la galerie d'une fiche, **When** le visiteur touche une photo, **Then** elle s'ouvre en entier sur fond sombre, avec un bouton pour fermer ; Échap et un toucher en dehors la ferment aussi.

---

### Edge Cases

- **Voyageurs non indiqués** : une nouvelle ligne garde la valeur par défaut de la prestation.
- **Voyageurs hors bornes** (ex. 12 voyageurs, pirogue limitée) : la ligne prend la borne la plus proche ; la règle de capacité de la 004 s'applique.
- **Plat déjà dans le séjour avant le passage aux plats** : sa quantité est conservée et lue comme un nombre de plats.
- **Ancienne adresse du pique-nique** : elle mène toujours à la fiche.
- **Parcours sur devis** : la fiche affiche « Tarif sur demande » ; l'ajout au séjour reste possible, ligne sur devis.
- **Durée non fournie** (« Kribi au fil de l'eau ») : la ligne Durée n'apparaît pas.
- **Photo du hero qui ne charge pas** : le hero reste sur la photo précédente, sans trou.
- **JavaScript désactivé** : hero sur sa première photo ; fiches de parcours lisibles, avec un lien WhatsApp ; champs de dates saisissables à la main.

## Requirements *(mandatory)*

### Functional Requirements

#### Catalogue

- **FR-001**: Les spécialités culinaires DOIVENT se compter en plats (« 1 plat », « 2 plats ») dans les fiches, Mon séjour et le message WhatsApp.
- **FR-002**: Les 10 plats DOIVENT porter les descriptions fournies par Franck le 2026-10-18, et l'Ebanjea DOIT être ajouté (spécialité batanga, sur demande, avec sa description).
- **FR-003**: L'image générée du maban DOIT être retirée ; le maban et l'Ebanjea montrent une image fidèle quand Franck en fournit une (photo ou description), et d'ici là une photo de la côte de Kribi sans plat, étiquetée « Photo à venir ».
- **FR-004**: Le pique-nique DOIT s'appeler « Pique-nique en bord de mer » (« Beach picnic »), son ancienne adresse redirigée vers la nouvelle.
- **FR-005**: Dans Mon séjour, une nouvelle ligne au prix par personne DOIT partir du nombre de voyageurs indiqué (borné par la prestation), sous le libellé « Personnes pour cette activité ».

#### Parcours

- **FR-006**: Chaque parcours DOIT avoir sa fiche (adresse propre, dans les deux langues), ouverte depuis sa carte sur la page Formules : titre, photo, description, étapes dans l'ordre (liées à la fiche de l'étape quand elle existe), tarif, durée et minimum de participants quand ils sont définis, mention dégressive le cas échéant.
- **FR-007**: Les durées DOIVENT être celles de Franck : L'Essentiel de Kribi, une journée ; Nature & Littoral, une journée ; Culture & Patrimoine, une demi-journée ; Kribi & Ebodjé, une journée complète ; Kribi Authentique, une demi-journée ou une journée complète selon le programme ; Kribi au fil de l'eau, aucune durée affichée.
- **FR-008**: La fiche DOIT afficher « Prix indicatif, sous réserve de disponibilité et de confirmation par KIBREEZE » et préciser que le prix final dépend du nombre de participants, de la date, du transport, des options choisies et des conditions de réalisation.
- **FR-009**: La fiche DOIT offrir l'ajout au séjour avec un nombre de personnes (au tarif du parcours, jamais recalculé à partir des visites) et un bouton « Personnaliser ce parcours » qui ouvre WhatsApp avec le parcours, le nombre de personnes et l'adresse de la fiche.
- **FR-010**: Les étapes DOIVENT préciser que le fleuve Lobé est inclus dans l'expérience Bagyeli (Nature & Littoral) et que le Village Mayi inclut le pont de l'Esclavage, le pont des Enclaves, le phare et le monument.

#### Accueil

- **FR-011**: Le hero DOIT faire se succéder 3 ou 4 photos en fondu lent, avec un bouton pour le mettre en pause ; la première s'affiche sans attente ; rien ne bouge sous « réduire les animations » ; sans JavaScript, la première photo seule.
- **FR-012**: L'aperçu Hébergements DOIT montrer les quatre types, appartement compris, avec leur prix de départ lu dans les paliers.
- **FR-013**: L'aperçu Mobilité DOIT présenter les trois catégories de véhicules (photo, modèles, prix de départ par jour), à l'échelle de l'aperçu Hébergements, chaque carte menant à la catégorie sur la page Mobilité ; il reste après les sections Kibreeze.

#### Dates et photos

- **FR-014**: Les dates du séjour DOIVENT se choisir dans deux champs Arrivée et Départ qui ouvrent un calendrier ; le départ ne peut précéder l'arrivée ; le message les écrit en toutes lettres dans la langue du visiteur ; des dates écrites à la main dans un séjour enregistré avant le changement sont conservées.
- **FR-015**: Chaque photo DOIT pouvoir porter son cadrage (point à garder visible quand elle est recadrée) ; le pique-nique est cadré sur le pique-nique.
- **FR-016**: Les photos de la galerie d'une fiche DOIVENT s'ouvrir en entier au toucher, et se fermer par un bouton, Échap ou un toucher en dehors.

#### Qualité

- **FR-017**: Tout texte ajouté DOIT exister en français et en anglais ; l'anglais des descriptions de Franck est traduit par Claude et relu par Zobel.
- **FR-018**: Les pages modifiées DOIVENT garder au moins 90 sur 100 aux audits automatiques, et les règles de mouvement de la 009 (tokens, réduire les animations, rien de masqué sans JavaScript).

### Key Entities

- **Plat** : prestation des spécialités culinaires, sur demande, quantité en plats, description de Franck, image fidèle ou « Photo à venir ».
- **Parcours** : prestation existante (005), gagne une fiche, une durée, des précisions d'étapes.
- **Dates du séjour** : arrivée et départ (ou ancien texte libre conservé).
- **Photo** : gagne un cadrage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les 6 parcours ont chacun une fiche atteignable en un geste depuis la page Formules, avec 100 % des informations fournies par Franck (étapes, tarif, durée quand elle existe, minimum, mention).
- **SC-002**: Aucune ligne de plat ne parle de « personnes », ni dans Mon séjour ni dans le message.
- **SC-003**: Avec 3 voyageurs indiqués, une visite ajoutée affiche 3 personnes sans autre geste.
- **SC-004**: Un visiteur choisit arrivée et départ en 4 touchers au plus, sans rien taper.
- **SC-005**: L'accueil garde au moins 90 sur 100 aux audits et n'affiche pas son élément principal plus tard qu'avant le diaporama.
- **SC-006**: Franck valide, dans son cahier de test, chacun de ses retours des 11 et 12 octobre comme traité ou expliqué.

## Assumptions

- **Photos du hero** : 3 ou 4 photos de Franck sans filigrane, choisies par Claude parmi celles déjà triées (coucher de soleil actuel en premier) ; remplacées par celles de Franck quand il aura fait sa sélection (questionnaire 7). Rythme : une photo toutes les 6 secondes environ.
- **Bouton « Personnaliser ce parcours »** : la consigne de Franck l'envoie sur WhatsApp, sur la fiche comme sur la carte de la page Formules ; l'ajout au séjour, voulu depuis le questionnaire 4, prend partout le libellé « Ajouter à mon séjour ».
- **Fiches de parcours** : sous la page Formules (`/formules/<parcours>`), sur le modèle des fiches d'expérience.
- **Image du maban et de l'Ebanjea** : en attente d'une photo ou d'une description de Franck (questionnaire 7) ; régénérée alors, avec l'accord de Zobel pour toute génération payante.
- **Traduction anglaise** des descriptions de Franck : faite par Claude, relue par Zobel.
- **Libellés** : « 1 plat / 2 plats » (« 1 dish / 2 dishes ») ; « Personnes pour cette activité » (« People for this activity »).

## Dependencies

- Features 004 (Mon séjour), 005 (parcours), 006 (véhicules), 008 (univers), 009 (mouvement), livrées.
- **Questionnaire 7 pour Franck**, non bloquant pour cette spec : prix par personne de la pirogue, de la chaloupe et du feu de plage (pour afficher un tarif individuel à côté du tarif groupe) ; lien du catalogue WhatsApp (hébergement, transport) et numéro personnel (tourisme) ; photo ou description du maban et de l'Ebanjea ; sélection des photos rubrique par rubrique (photos de clients conservées, photo de Franck repérée par Zobel).

## Out of Scope

- Tarif individuel de la pirogue, de la chaloupe et du feu de plage : le site sait afficher deux tarifs côte à côte (004) ; ajouté dès réception des prix, sans nouvelle spec.
- Deux numéros WhatsApp (catalogue, personnel) : changement d'une décision du 2026-09-14 ; traité à réception des liens.
- Espace d'administration pour changer les photos soi-même (« comme WordPress ») : hors du site statique, à étudier plus tard.
- Nouvelle sélection des photos : contenu, à réception des choix de Franck.
