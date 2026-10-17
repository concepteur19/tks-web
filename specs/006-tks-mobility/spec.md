# Feature Specification: Mobilité TKS®

**Feature Branch**: `006-tks-mobility`

**Created**: 2026-10-14

**Status**: Draft

**Input**: Feature 006 de [specs/README.md](../README.md) : section secondaire TKS® Mobilité, liste compacte des services de mobilité, ajout au séjour comme prestation complémentaire (FR-MOB-1 à 3). Débloquée le 2026-10-06 par les trois catégories de véhicules et leurs prix (client-answers, section 1 sexies) et les photos des cinq véhicules. Cahier d'octobre 2026, section 9 : « Conserver location de véhicules, transferts, chauffeur et services de transport ». Écran validé [08](../../docs/design-exports/08-tks-mobilite.jpg).

## Contexte

Depuis le repositionnement du 2026-09-25, TKS® est la marque de mobilité de Breezy Groupe, présente sur le site Kibreeze mais **secondaire et sobre** : Kibreeze reste dominant. L'onglet Mobilité et le bandeau TKS® de l'accueil existent, mais renvoient aujourd'hui vers WhatsApp faute de page.

Jusqu'au 2026-10-06, aucun tarif de mobilité n'avait été fourni (FR-MOB-3). Franck a depuis donné trois catégories de véhicules avec un prix de départ et les photos de cinq véhicules :

| Catégorie | Véhicules | Prix |
|---|---|---|
| Luxe | Toyota Land Cruiser Prado TXL, Toyota Land Cruiser | à partir de 100 000 FCFA |
| Premium | Toyota RAV4, Toyota Avensis | à partir de 35 000 FCFA |
| Yaris | Toyota Yaris | à partir de 25 000 FCFA |

L'unité de ces prix (par jour ?), et ce qu'ils comprennent (chauffeur, carburant), ne sont pas précisés ; les autres services (location avec chauffeur, transferts, chauffeur privé, prestations professionnelles) n'ont toujours pas de prix. Le site les présente donc sur devis, et la location de véhicules avec ses prix de départ, sous hypothèses marquées.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Louer un véhicule pour son séjour (Priority: P1)

Une famille arrive à Kribi pour quatre jours. Depuis l'onglet Mobilité, elle voit les trois catégories de véhicules avec leur photo et leur prix de départ, choisit un Premium, règle 1 véhicule et 4 jours, et l'ajoute à son séjour, à côté de son logement et de ses activités.

**Why this priority**: La location est le seul service de mobilité qui a des prix, et la demande la plus fréquente d'un visiteur sans voiture.

**Independent Test**: Ajouter un véhicule de chaque catégorie avec des quantités différentes, vérifier montants, total et message.

**Acceptance Scenarios**:

1. **Given** la page Mobilité, **When** elle s'ouvre, **Then** l'en-tête montre le logo TKS®, le titre « Mobilité & transport » et la phrase « Location, transferts et chauffeur privé pour compléter votre séjour », suivis de la mention « TKS® est la marque de mobilité de Breezy Groupe, aux côtés de Kibreeze. »
2. **Given** la section Location de véhicules, **When** elle s'affiche, **Then** les catégories Luxe, Premium et Yaris apparaissent dans cet ordre, chacune avec une photo de véhicule, ses modèles, « À partir de X FCFA / jour » et un bouton d'ajout.
3. **Given** la catégorie Premium, **When** le visiteur règle 1 véhicule et 4 jours puis l'ajoute, **Then** une ligne « Premium — 1 véhicule × 4 jours » entre dans Mon séjour, à 140 000 FCFA, comptée dans le total estimatif.
4. **Given** 2 véhicules Yaris pour 3 jours, **When** la ligne s'affiche, **Then** son montant vaut 25 000 × 2 × 3 = 150 000 FCFA.

---

### User Story 2 - Demander un transfert ou un chauffeur (Priority: P2)

Un couple atterrit à Douala et veut rejoindre Kribi. Sur la page Mobilité, il ajoute « Transferts » à son séjour ; la ligne apparaît « sur devis » et le message WhatsApp le nomme, pour que Kibreeze réponde avec un prix.

**Why this priority**: Les transferts et le chauffeur font partie de l'offre que Franck garde (cahier d'octobre, section 9), mais sans prix : ils servent la demande, pas l'estimation.

**Independent Test**: Ajouter chacun des services sur devis, vérifier qu'ils restent hors du total et sont nommés dans le message.

**Acceptance Scenarios**:

1. **Given** la page Mobilité, **When** elle s'affiche, **Then** une liste compacte présente Location avec chauffeur, Transferts, Chauffeur privé et Prestations professionnelles, chacun avec une petite photo, une phrase et « Sur devis ».
2. **Given** un service sur devis, **When** le visiteur l'ajoute, **Then** une ligne « sur devis » entre dans Mon séjour, hors du total, comptée dans « + N prestations sur devis ».
3. **Given** un séjour avec un transfert, **When** le visiteur envoie sa demande, **Then** le message WhatsApp nomme le transfert.
4. **Given** la fin de la page, **When** le visiteur y arrive, **Then** un encadré « Besoin d'un transport sur mesure ? Dites-nous vos dates et votre trajet, nous vous répondons avec un prix. » propose WhatsApp.

---

### User Story 3 - Trouver la mobilité depuis le reste du site (Priority: P3)

Sur l'accueil, le bandeau TKS® Mobilité mène à la page ; l'onglet Mobilité de la navigation ordinateur aussi.

**Why this priority**: La section est secondaire : son accès doit exister sans concurrencer Kibreeze.

**Independent Test**: Depuis l'accueil et la navigation, atteindre la page Mobilité ; vérifier qu'aucun lien n'ouvre plus WhatsApp faute de page.

**Acceptance Scenarios**:

1. **Given** l'accueil, **When** le visiteur touche le bandeau TKS® Mobilité, **Then** il arrive sur la page Mobilité.
2. **Given** la navigation ordinateur, **When** elle s'affiche, **Then** l'entrée Mobilité TKS® mène à la page ; la barre à onglets du téléphone reste inchangée (cinq onglets, sans Mobilité), la section restant secondaire.

---

### Edge Cases

- **Prix non confirmés** : les prix de départ de la location sont affichés « à partir de », présentés comme estimatifs dans Mon séjour ; Kibreeze confirme sur WhatsApp.
- **Catégorie sans photo** : jamais ; chaque catégorie a au moins une photo de Franck.
- **Plaques d'immatriculation lisibles** sur les photos : elles sont recadrées ou floutées avant publication.
- **Même catégorie ajoutée deux fois** : la règle de la 004 s'applique (véhicules additionnés, jours remplacés).
- **Location et transfert dans le même séjour** : deux lignes distinctes, aucun contrôle de cohérence ; Kibreeze ajuste sur WhatsApp (client B3).
- **JavaScript désactivé** : la page reste lisible ; chaque service offre une demande WhatsApp qui le nomme.

## Requirements *(mandatory)*

### Functional Requirements

#### Page et présentation

- **FR-001**: La page Mobilité DOIT exister à l'adresse prévue (`/mobilite`, `/en/mobility`), avec l'en-tête de l'écran 08 : logo TKS®, titre, phrase, mention de Breezy Groupe.
- **FR-002**: La page DOIT rester sobre (FR-MOB-1) : liste compacte, petites photos, aucune photographie plein écran ni carte d'expérience ; Kibreeze reste la marque dominante de l'en-tête et du pied de page.
- **FR-003**: La page DOIT se terminer par l'encadré « Besoin d'un transport sur mesure ? » avec un bouton WhatsApp.

#### Location de véhicules

- **FR-004**: Les trois catégories (Luxe, Premium, Yaris) DOIVENT être présentées dans cet ordre, avec leurs modèles, une photo de Franck et « À partir de X FCFA / jour ».
- **FR-005**: Une catégorie DOIT s'ajouter à Mon séjour avec un nombre de véhicules et un nombre de jours ; le montant d'une ligne vaut prix × véhicules × jours, présenté comme estimatif.
- **FR-006**: Les photos DOIVENT masquer les plaques d'immatriculation lisibles.

#### Services sur devis

- **FR-007**: Location avec chauffeur, Transferts, Chauffeur privé et Prestations professionnelles DOIVENT être présentés « Sur devis », avec une phrase et une photo, et s'ajouter à Mon séjour comme lignes sur devis, hors du total.
- **FR-008**: Un service sur devis DOIT pouvoir porter une quantité informative quand elle aide Kibreeze à répondre (nombre de jours pour la location avec chauffeur, d'heures pour le chauffeur privé), reprise dans le message WhatsApp.

#### Navigation, langues, référencement

- **FR-009**: La route Mobilité DOIT être livrée : l'entrée de la navigation ordinateur et le bandeau de l'accueil mènent à la page ; la barre à onglets du téléphone NE DOIT PAS changer.
- **FR-010**: Tout texte DOIT exister en français et en anglais ; la page DOIT avoir un titre, une description et une image de partage propres, et figurer au plan du site.
- **FR-011**: Sans JavaScript, chaque service DOIT offrir un lien WhatsApp qui le nomme.

### Key Entities

- **Catégorie de véhicule** : prestation de mobilité, nom (Luxe, Premium, Yaris), modèles, prix de départ par jour, photo ; s'ajoute avec véhicules × jours.
- **Service de mobilité sur devis** : prestation sans prix, phrase, photo, quantité informative éventuelle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur ajoute un véhicule avec ses jours à son séjour sans quitter la page Mobilité : il règle le nombre de véhicules et de jours sur la carte de la catégorie, puis un seul bouton l'ajoute.
- **SC-002**: Les trois catégories et leurs prix de départ s'affichent à l'identique de la réponse de Franck du 2026-10-06.
- **SC-003**: Plus aucun lien du site ne renvoie vers WhatsApp faute de page Mobilité.
- **SC-004**: La page Mobilité atteint au moins 90 sur 100 aux audits automatiques de performance, accessibilité, bonnes pratiques et référencement, sur profil mobile.
- **SC-005**: Franck reconnaît l'écran 08 qu'il a validé, avec ses véhicules réels.

## Assumptions

- **Unité des prix** [HYPOTHÈSE M1] : les prix de départ des catégories sont par jour et par véhicule.
- **Avec ou sans chauffeur** [HYPOTHÈSE M2] : ces prix sont ceux de la location **sans** chauffeur ; la location avec chauffeur est sur devis.
- **Carburant, caution, permis** [HYPOTHÈSE M3] : non précisés ; la page n'en dit rien et Kibreeze les précise sur WhatsApp.
- **Transferts** [HYPOTHÈSE M4] : sur devis ; destinations citées par l'écran 08 (Douala, Yaoundé, aéroport).
- **Chauffeur privé** [HYPOTHÈSE M5] : sur devis, quantité informative en heures.
- **Transport scolaire et courses dans Kribi** (B1, 2026-09-14) : absents de l'écran 08 et du cahier d'octobre, non publiés.
- **Photos** : celles des cinq véhicules envoyées par Franck le 2026-10-06 ; pour les services sur devis, une photo de véhicule de Franck ou, à défaut, une illustration marquée « Photo illustrative ».
- **Bornes** : 1 à 5 véhicules, 1 à 30 jours ; 1 par défaut.

## Dependencies

- Features 004 (Mon séjour) et 005, livrées ; correctif du libellé au singulier (« 1 véhicule ») de la branche `fix-units-singular`, dont cette branche part.
- Réponses de Franck aux hypothèses M1 à M5 (questionnaire 6), non bloquantes.

## Out of Scope

- Réservation en ligne, disponibilité des véhicules, calcul d'itinéraire.
- Transport scolaire, courses dans Kribi, livraison (Breezy Delivery).
- Changement de la barre à onglets du téléphone.
