# Feature Specification: Les trois univers du Tourisme

**Feature Branch**: `008-tourism-universes`

**Created**: 2026-10-11

**Status**: Draft

**Input**: Restructuration de la partie Tourisme en 3 univers (Visites & Découvertes, Activités & Loisirs, Spécialités culinaires), d'après le cahier des charges actualisé de Franck ([Cahier_des_charges_KIBREEZE_MAJ_2026.pdf](../../Elements/Cahier_des_charges_KIBREEZE_MAJ_2026.pdf), octobre 2026) et son message du 2026-10-10. Page d'entrée « Découvrez Kribi selon vos envies », une page par univers, catalogue porté de 13 à 32 prestations, minimum de participants et mention « tarif dégressif ». Parcours et reste du site hors périmètre. Questions ouvertes : [questions-kibreeze-franck-4.xlsx](../../docs/questions-kibreeze-franck-4.xlsx).

## Contexte

La 003 a livré le catalogue sous la forme d'une seule page Expériences : toutes les activités en cartes, filtrées par trois catégories (Nature & Découverte, Aventure, Détente). En regardant le site, Franck constate que les expériences y sont « encore trop mélangées » : une visite de village, une sortie en jet-ski et, demain, une dégustation de langouste se retrouvent dans la même liste. Il ne savait d'ailleurs pas où ranger les spécialités culinaires dans l'ancienne structure.

Son cahier actualisé range le Tourisme selon ce que le visiteur veut faire, en trois univers distincts :

- **Visites & Découvertes** : explorer les lieux, paysages, villages, patrimoines et sites de Kribi.
- **Activités & Loisirs** : vivre des expériences entre mer, nature, aventure et détente.
- **Spécialités culinaires** : découvrir les saveurs et spécialités de la côte.

Le visiteur ne tombe plus directement sur une grande liste : il voit d'abord les trois univers, choisit le sien, et n'accède qu'aux expériences qui y correspondent. Mon séjour reste l'endroit où il réunit des prestations de plusieurs univers.

Le cahier enrichit aussi le catalogue : sept nouvelles visites, quatre nouvelles activités, dix spécialités culinaires, un prix pour le jet-ski, et deux règles de prix nouvelles, le minimum de participants et la mention « tarif dégressif ».

Franck est explicite sur le périmètre : « L'objectif n'est donc pas de refaire tout le site, mais de rendre la partie Tourisme beaucoup plus claire. Pour le reste du site, on ne change rien pour le moment. »

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choisir son univers avant de parcourir (Priority: P1)

Le visiteur touche l'onglet du Tourisme. Au lieu d'une longue liste, il voit le titre « Découvrez Kribi selon vos envies » et trois grandes cartes : Visites & Découvertes, Activités & Loisirs, Spécialités culinaires. Chacune montre une photo, une phrase et quelques exemples (« Chutes de la Lobé, Village Bagyeli, Village Mayi… »). Il touche « Activités & Loisirs » et arrive sur une page qui ne contient que les activités : quad, jet-ski, kayak, paddle… Depuis cette page, il peut passer directement à un autre univers.

**Why this priority**: C'est la demande centrale de Franck et la raison d'être de la feature. Sans elle, les nouvelles prestations ne feraient qu'allonger la liste qu'il juge déjà trop mélangée.

**Independent Test**: Depuis l'accueil et depuis l'onglet du Tourisme, atteindre chacun des trois univers, vérifier que chacun ne liste que ses prestations, et passer d'un univers à l'autre sans revenir à la page d'entrée.

**Acceptance Scenarios**:

1. **Given** l'onglet du Tourisme, **When** le visiteur le touche, **Then** la page d'entrée s'affiche avec le titre « Découvrez Kribi selon vos envies » et trois cartes d'univers dans l'ordre Visites & Découvertes, Activités & Loisirs, Spécialités culinaires ; aucune carte d'expérience n'y est listée.
2. **Given** une carte d'univers, **When** elle s'affiche, **Then** elle montre une photo, le nom de l'univers, sa phrase, trois ou quatre noms de prestations en exemple, et une action « Voir le catalogue ».
3. **Given** la carte « Activités & Loisirs », **When** le visiteur la touche, **Then** il arrive sur la page de cet univers, qui liste uniquement ses 13 activités, en cartes, dans l'ordre défini.
4. **Given** la page d'un univers, **When** le visiteur cherche un autre univers, **Then** les deux autres sont proposés en un geste, sur la page même.
5. **Given** la page d'un univers, **When** le visiteur en copie l'adresse et l'ouvre ailleurs, **Then** il retrouve directement cet univers.
6. **Given** l'accueil, **When** le visiteur parcourt la section qui présentait les catégories, **Then** il y trouve les trois univers, et chaque carte mène à la page de son univers.

---

### User Story 2 - Découvrir les nouvelles prestations (Priority: P2)

Un visiteur qui prépare son séjour veut voir le Village Mayi, faire une sortie en bateau en haute mer et goûter une langouste au bord de l'eau. Il trouve chaque prestation dans son univers, avec son prix ou la mention « Sur demande », ouvre sa fiche, et l'ajoute à Mon séjour à côté de ses autres choix.

**Why this priority**: Les univers n'ont de sens que remplis. C'est aussi l'enrichissement que Franck attend : des lieux que ses clients demandent réellement (Port Autonome, Golden K) et un univers culinaire qui n'existait pas.

**Independent Test**: Ouvrir la fiche de chaque nouvelle prestation dans les deux langues, vérifier son prix contre le cahier, l'ajouter à Mon séjour, et envoyer un séjour qui mélange les trois univers.

**Acceptance Scenarios**:

1. **Given** l'univers Visites & Découvertes, **When** il s'affiche, **Then** il liste les 9 visites du cahier, chacune avec le prix ou la mention du cahier.
2. **Given** la fiche du Village Mayi, **When** elle s'affiche, **Then** elle indique que la visite comprend le pont de l'Esclavage, le pont des Enclaves, le phare et le monument, sans prix séparé pour chacun ; la fiche du Village Bagyeli indique de même le fleuve Lobé, le campement et le pont Lobé.
3. **Given** l'univers Spécialités culinaires, **When** il s'affiche, **Then** il liste les 10 spécialités du cahier, toutes « Sur demande », sans aucun montant.
4. **Given** le jet-ski, **When** sa carte ou sa fiche s'affiche, **Then** son prix est 10 000 FCFA la session.
5. **Given** un séjour avec une visite, une activité et une spécialité culinaire, **When** le visiteur ouvre Mon séjour, **Then** les trois lignes y figurent ; seules les prestations chiffrées entrent dans le total, et la spécialité apparaît parmi les prestations sur demande.
6. **Given** un séjour envoyé sur WhatsApp, **When** Kibreeze lit le message, **Then** chaque prestation y est nommée, quel que soit son univers.

---

### User Story 3 - Comprendre un prix de groupe (Priority: P3)

Un couple regarde la visite du Village Bagyeli. La fiche indique « À partir de 15 000 FCFA par personne », précise « minimum 2 personnes » et signale que le tarif est dégressif : plus le groupe est grand, plus le prix par personne peut baisser. Le sélecteur de personnes ne descend pas sous 2.

**Why this priority**: Ces mentions évitent une mauvaise surprise et une demande impossible (une personne seule pour une visite à deux minimum). Elles viennent après la structure et le contenu, qu'elles précisent.

**Independent Test**: Sur les fiches à minimum et à tarif dégressif, vérifier les mentions, le plancher du sélecteur, et le total dans Mon séjour.

**Acceptance Scenarios**:

1. **Given** une prestation avec un minimum de participants, **When** sa carte et sa fiche s'affichent, **Then** le minimum y est indiqué (« minimum 2 personnes »).
2. **Given** la même prestation, **When** le visiteur règle le nombre de personnes, **Then** il ne peut pas descendre sous le minimum, et la valeur proposée par défaut le respecte.
3. **Given** une prestation à tarif dégressif, **When** sa fiche s'affiche, **Then** une mention indique que le prix par personne peut baisser avec la taille du groupe, sans grille de paliers.
4. **Given** une prestation « à partir de » ajoutée à Mon séjour, **When** le total s'affiche, **Then** il compte ce prix multiplié par les quantités et reste présenté comme estimatif, conformément à la 004.

---

### Edge Cases

- **Prestation retirée du catalogue** (Croisière en bateau, Bateau de plaisance, selon les réponses Q1 et Q2) : elle disparaît de toutes les pages ; son ancienne adresse renvoie la page d'erreur (FR-CAT-5) ; si elle se trouvait dans un séjour enregistré, la ligne est retirée au chargement avec le message prévu par la 004.
- **Tarif qui n'existe plus** : les anciens tarifs du campement Bagyeli (individuel, couple, groupe) disparaissent. Une ligne de séjour enregistrée avec l'un d'eux est retirée au chargement, avec le même message, plutôt que convertie en silence.
- **Ancienne adresse de filtre** (`/experiences#aventure` et ses équivalents, partagée ou mise en favori) : elle mène à la page d'entrée du Tourisme, d'où chaque univers est à un geste.
- **Univers sans prestation publiée** : sa carte n'apparaît pas sur la page d'entrée ni sur l'accueil, et son adresse renvoie la page d'erreur, plutôt qu'une page vide.
- **Prestation sans photo de Franck** : la carte et la fiche affichent une photo d'ambiance de Kribi propre à l'univers, avec un texte alternatif qui décrit le paysage montré et non la prestation. Jamais une photo filigranée, ni la photo d'une autre prestation présentée comme celle-ci.
- **Information inconnue** (durée, lieu, inclus) : la rubrique est omise, comme en 003 ; aucune valeur inventée.
- **Spécialité culinaire** : aucun montant, aucun équivalent en euros, aucune offre chiffrée dans les données structurées.
- **Minimum de participants supérieur à la valeur par défaut** : la valeur par défaut est relevée au minimum, sur la fiche comme pour l'ajout rapide depuis une carte.
- **Capacité et minimum combinés** : le sélecteur reste borné par le minimum en bas et par sa borne haute habituelle en haut ; au-delà d'une capacité plafonnée, la règle « sur devis » de la 004 s'applique.
- **JavaScript désactivé** : la page d'entrée, les pages d'univers et les fiches restent lisibles, et chaque univers reste atteignable par un lien.
- **Noms anglais plus longs** : les cartes d'univers et de prestations passent à la ligne sans casser la mise en page.

## Requirements *(mandatory)*

### Functional Requirements

#### Structure en univers

- **FR-001**: Le Tourisme DOIT être organisé en trois univers, dans cet ordre : Visites & Découvertes, Activités & Loisirs, Spécialités culinaires. Chaque prestation publiée (hors options) DOIT appartenir à exactement un univers. Les trois catégories de la 003 (Nature & Découverte, Aventure, Détente) DOIVENT disparaître du site.
- **FR-002**: L'onglet du Tourisme DOIT mener à une page d'entrée qui porte le titre « Découvrez Kribi selon vos envies » et présente les trois univers en cartes, sans lister de prestations.
- **FR-003**: Chaque carte d'univers DOIT afficher une photo, le nom de l'univers, sa phrase de présentation (celle du cahier, section 3), trois ou quatre noms de prestations publiées de cet univers en exemple, et une action « Voir le catalogue » qui mène à la page de l'univers.
- **FR-004**: Chaque univers DOIT avoir sa propre page, à une adresse stable, partageable et traduite, qui liste uniquement ses prestations publiées, disponibles ou à confirmer, en cartes de la 003 (FR-CAT-3), triées par ordre défini puis par nom.
- **FR-005**: La page d'un univers DOIT proposer, sur la page même, un accès en un geste aux deux autres univers, et un retour vers la page d'entrée.
- **FR-006**: La page d'entrée et chaque page d'univers DOIVENT se terminer par le bloc « Une envie particulière ? » de la 003, avec son bouton WhatsApp (FR-CAT-6).
- **FR-007**: Les adresses des fiches existantes NE DOIVENT PAS changer. Une ancienne adresse de filtre par catégorie DOIT mener à la page d'entrée.

#### Effets sur les fiches, l'accueil et la navigation

- **FR-008**: Sur une fiche, le fil d'Ariane DOIT devenir « Tourisme › univers › nom », le badge de catégorie DOIT devenir un badge d'univers, et « Vous aimerez aussi » DOIT proposer en priorité des prestations du même univers.
- **FR-009**: Sur l'accueil, la section des catégories DOIT présenter les trois univers à la place des trois catégories, chaque carte menant à la page de son univers. Le reste de l'accueil NE DOIT PAS changer.
- **FR-010**: Le libellé de l'onglet du Tourisme dans la barre à onglets et la navigation ordinateur DOIT rester « Expériences » / « Experiences » tant que Franck n'a pas répondu à U1 ; il DOIT pouvoir changer sans toucher aux adresses.

#### Catalogue

- **FR-011**: L'univers Visites & Découvertes DOIT publier les 9 visites du cahier (section 4) :

  | Visite | Prix | Nouvelle |
  |---|---|---|
  | Chutes de la Lobé | 5 000 FCFA / personne | non |
  | Village Bagyeli / campement pygmées (fleuve Lobé, campement, pont Lobé) | à partir de 15 000 FCFA / personne, minimum 2, dégressif | non, tarif changé |
  | Village Mayi (pont de l'Esclavage, pont des Enclaves, phare, monument) | 5 000 FCFA / personne, dégressif | oui |
  | Village Ebodjé / découverte des tortues marines | sur demande | oui |
  | Port Autonome de Kribi | sur demande | oui |
  | Hôtel Golden K, visite | à partir de 5 000 FCFA / personne, dégressif | oui |
  | Plage du village Batanga | à partir de 5 000 FCFA / personne, dégressif | oui |
  | Musée Batanga | 2 000 FCFA / personne | oui |
  | Débarcadère de Mboa-Manga | 2 000 FCFA / personne | oui |

- **FR-012**: L'univers Activités & Loisirs DOIT publier les 13 activités du cahier (section 6) :

  | Activité | Prix | Nouvelle |
  |---|---|---|
  | Quad | 10 000 FCFA / session | non |
  | Jet-ski | 10 000 FCFA / session | non, enfin tarifé |
  | Kayak | 10 000 FCFA / personne / session | non |
  | Paddle | 10 000 FCFA / personne / session | non |
  | Balade à cheval | 5 000 FCFA / personne / session | non |
  | Chaloupe / mini-bateau | 65 000 FCFA / groupe de 8 | non |
  | Pirogue | 35 000 FCFA / groupe de 8 | non |
  | Bateau de croisière en haute mer | 150 000 FCFA / heure | oui |
  | Jacuzzi naturel | 5 000 FCFA / personne / session | non |
  | Feu de camp / feu de plage | 50 000 FCFA / groupe de 10 | non, capacité ajoutée |
  | Séance photo à Kribi | à partir de 10 000 FCFA / personne | oui |
  | Pique-nique / bivouac en bord de mer | sur demande | oui |
  | Bouée tractée | 10 000 FCFA / session | oui |

- **FR-013**: L'univers Spécialités culinaires DOIT publier les 10 spécialités du cahier (section 7), toutes sur demande : poisson frais / poisson braisé, gambas, crevettes, crabe, langouste, maban (poisson pimenté), noix de coco fraîche à boire, grillades / barbecue de plage, dégustation de fruits de mer en bord de mer, expérience de repas local. Les propositions écartées par le cahier (eru, ndolé, fruits tropicaux, jus naturels, huîtres) NE DOIVENT PAS y figurer.
- **FR-014**: Les lieux inclus dans une visite (phare, monument, ponts, fleuve Lobé) NE DOIVENT PAS avoir de fiche ni de prix séparés ; ils DOIVENT être cités dans la fiche de la visite qui les comprend.
- **FR-015**: Les prestations du site absentes du cahier (Croisière en bateau, Bateau de plaisance) DOIVENT être traitées selon les réponses Q1 et Q2 ; en attendant, elles sont retirées du catalogue (voir Assumptions).
- **FR-016**: Les options (guide touristique, maître-nageur, musée d'art) DOIVENT rester proposées sur les fiches de visites et d'activités, et NE DOIVENT PAS l'être sur les spécialités culinaires.

#### Règles de prix

- **FR-017**: Une prestation DOIT pouvoir déclarer un minimum de participants. Ce minimum DOIT être indiqué sur sa carte et sa fiche, et le sélecteur de personnes NE DOIT PAS permettre de descendre en dessous, ni à l'ajout rapide ni dans Mon séjour.
- **FR-018**: Une prestation DOIT pouvoir être marquée « tarif dégressif ». Sa fiche DOIT alors indiquer que le prix moyen par personne peut baisser avec la taille du groupe, sans afficher de paliers (cahier, section 11).
- **FR-019**: Les prix « à partir de » et « sur demande » DOIVENT suivre les règles déjà en place : un « à partir de » entre dans le total estimatif de Mon séjour ; un « sur demande » n'a ni montant, ni équivalent en euros, ni offre chiffrée, et apparaît à part dans Mon séjour (cahier, sections 8 et 11).

#### Langues, accessibilité, référencement

- **FR-020**: Tout texte ajouté DOIT exister en français et en anglais : noms et phrases des univers, noms, descriptions et mentions des nouvelles prestations, textes alternatifs.
- **FR-021**: Les cartes d'univers et l'accès aux autres univers DOIVENT être utilisables au clavier, avec des noms accessibles, et la page courante DOIT être signalée aux technologies d'assistance.
- **FR-022**: La page d'entrée et chaque page d'univers DOIVENT avoir un titre, une description et une image de partage propres, dans chaque langue, et figurer au plan du site ; chaque nouvelle fiche DOIT avoir les métadonnées et données structurées de la 003 (FR-SEO-1, FR-SEO-3).

### Key Entities

- **Univers** : Visites & Découvertes, Activités & Loisirs ou Spécialités culinaires ; nom, phrase de présentation, photo, ordre et adresse propre. Remplace la catégorie de la 003.
- **Prestation** : l'expérience de la 003, rattachée désormais à un univers. Elle gagne un minimum de participants facultatif et un indicateur « tarif dégressif », et peut citer des lieux inclus sans prix séparé.
- **Option** : inchangée (guide touristique, maître-nageur, musée d'art), proposée sur les visites et les activités.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les 32 prestations du cahier (9 visites, 13 activités, 10 spécialités) sont consultables, chacune dans son univers et avec sa fiche, dans les deux langues, et chaque prix ou mention affiché correspond au cahier.
- **SC-002**: Depuis l'accueil, un visiteur atteint la fiche de n'importe quelle prestation en trois gestes au plus.
- **SC-003**: Depuis la page d'un univers, un visiteur rejoint chacun des deux autres en un geste.
- **SC-004**: Aucune page ne mélange des prestations de plusieurs univers, hors Mon séjour et « Vous aimerez aussi » quand l'univers n'en offre pas assez.
- **SC-005**: Un séjour qui contient une prestation de chaque univers s'envoie sur WhatsApp en un geste, avec chaque prestation nommée.
- **SC-006**: La page d'entrée, une page d'univers et une nouvelle fiche atteignent au moins 90 sur 100 aux audits automatiques de performance, accessibilité, bonnes pratiques et référencement, sur profil mobile.
- **SC-007**: Zéro lien interne cassé, aucune page avec défilement horizontal entre 320 et 1 920 px de large.
- **SC-008**: Franck reconnaît dans le site la structure de son cahier : trois univers clairement visibles, le Tourisme n'est plus une liste mélangée, et le reste du site est inchangé.

## Assumptions

- **Référence** : le cahier actualisé d'octobre 2026 fait foi ; le message de Franck du 2026-10-10 le complète. Là où ils diffèrent, le cahier l'emporte : le phare, le monument, les ponts et le fleuve Lobé, cités comme lieux dans le message, sont inclus dans les visites du Village Mayi et du Village Bagyeli (cahier, section 4).
- **Langues** : le cahier mentionne « Français V1 » dans les éléments conservés ; le site reste bilingue (ADR-013), le cahier ne retirant pas l'anglais.
- **Nom de l'onglet** [HYPOTHÈSE U1] : « Expériences » reste le libellé en attendant la réponse de Franck. Un changement ne touche que le libellé.
- **Croisière et bateau de plaisance** [HYPOTHÈSE Q1, Q2] : retirés du catalogue, le cahier ne les citant pas parmi les activités « tarifs validés ». Si Franck répond qu'ils restent, ils reviennent dans Activités & Loisirs, ce qui ne demande qu'un changement de données.
- **Musée** [HYPOTHÈSE Q3] : la visite du Musée Batanga (2 000 FCFA) est publiée, et l'option « Musée d'art » est conservée en attendant de savoir s'il s'agit du même musée.
- **Sessions** [HYPOTHÈSE Q4] : quad, jet-ski et bouée tractée se comptent en nombre de sessions, une par défaut, sans durée affichée tant qu'elle n'est pas connue. Kayak, paddle, cheval et jacuzzi se comptent en personnes, comme aujourd'hui.
- **Options** [HYPOTHÈSE Q5] : proposées sur toutes les visites et activités, aucune sur les spécialités culinaires.
- **Spécialités culinaires** [HYPOTHÈSE U5, U6] : présentées comme des expériences à demander à Kibreeze, avec un nombre de personnes informatif (une valeur par défaut de 2), qui ne sert qu'au message WhatsApp puisqu'elles sont sur demande.
- **Prix « dégressif » sans minimum** (Village Mayi, Golden K, Plage Batanga) : seule la mention s'affiche ; le minimum ne s'applique qu'où le cahier le précise (Village Bagyeli).
- **Feu de plage** : la capacité de 10 personnes du cahier s'ajoute, avec la règle « au-delà, sur devis » de la pirogue et de la chaloupe.
- **Bateau de croisière en haute mer** : réglé en heures, une heure par défaut.
- **Photos d'univers et de remplacement** : les cartes d'univers et les prestations sans photo de Franck utilisent ses photos d'ambiance de Kribi (hors filigranes), choisies par univers. Les photos du questionnaire 4 (P16 à P20) remplaceront ces images quand Franck aura identifié leur lieu.
- **Textes des nouvelles fiches** : rédigés à partir du cahier, sans détail inventé (durée, lieu, inclus restent vides tant que Franck ne les a pas donnés, onglet 3 du questionnaire), traduits en anglais par IA puis relus par Zobel (ADR-013).
- **Exemples des cartes d'univers** : les premières prestations de l'univers dans l'ordre défini, comme sur l'illustration du cahier (page 4).
- **Ordre des prestations** : celui du cahier, dans chaque univers.

## Dependencies

- Feature 004 (Mon séjour, estimation, message WhatsApp), dont cette branche part : les nouvelles prestations s'ajoutent au séjour par ses mécanismes, sans les modifier.
- Cahier des charges actualisé d'octobre 2026.
- Réponses de Franck au [questionnaire 4](../../docs/questions-kibreeze-franck-4.xlsx) : non bloquantes, chaque point a une valeur par défaut ci-dessus.

## Out of Scope

- **Parcours / Roadmaps** (cahier, section 5) : leur place dépend de U2 ; ils rejoignent a priori les Formules de la feature 005.
- Hébergements, formules, mobilité TKS® : features 005 et 006, inchangées.
- Mon séjour, l'estimation et le message WhatsApp : aucun changement de fonctionnement, ils reçoivent seulement de nouvelles prestations.
- Paliers de prix dégressifs, réservation, paiement ou disponibilités en ligne.
- Recherche textuelle et filtres à l'intérieur d'un univers.
- Nouvelles maquettes : la page d'entrée et les pages d'univers suivent les illustrations fonctionnelles du cahier (pages 2 et 4) et le style des écrans validés 02a et 02b.
