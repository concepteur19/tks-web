# Feature Specification: Hébergements, formules et parcours

**Feature Branch**: `005-accommodation-and-packages`

**Created**: 2026-10-11

**Status**: Draft

**Input**: Feature 005 de [specs/README.md](../README.md) : hébergements par type et par palier de budget, formules Kibreeze, ajout des deux à Mon séjour. Élargie par le cahier actualisé d'octobre 2026 (section 5) et les réponses U2 à U4 du questionnaire 4 : les six Parcours Kibreeze rejoignent l'onglet Formules, avec une entrée depuis la page Tourisme. Écrans validés [06a](../../docs/design-exports/06a-hebergements.jpg), [06b](../../docs/design-exports/06b-hebergements-ajout-confirme.jpg) et [07](../../docs/design-exports/07-formules.jpg).

## Contexte

Avec les features 002 à 008, le visiteur compose un séjour d'expériences et l'envoie sur WhatsApp. Il ne peut pas encore y ajouter un logement, ni partir d'un séjour déjà composé. Les onglets Hébergements et Formules existent dans la navigation prévue mais ne mènent nulle part : leurs liens ouvrent WhatsApp.

Trois offres arrivent avec cette feature :

- **Les hébergements.** Kibreeze ne publie pas de logements nommés. Le visiteur choisit un type de logement et un budget ; Kibreeze réserve ensuite chez ses partenaires (voice note du 2026-09-25, grille validée le 2026-09-26). Franck tient à ce que les budgets standards viennent d'abord et que le haut de gamme reste à part, plus bas : un montant élevé en tête de page ferait fuir le visiteur.
- **Les formules** du guide tarifaire : quatre forfaits d'activités, Découverte, Évasion, Aventure et Premium, à prix fixe pour deux personnes.
- **Les parcours** du cahier d'octobre : six circuits de visites, « à partir de X FCFA par personne, minimum 2, tarif dégressif ». Franck les range dans l'onglet Formules, veut une entrée « Parcours Kibreeze » depuis la page Tourisme, et veut que « Personnaliser ce parcours » l'ajoute à Mon séjour, où il compte dans le total (réponses U2 à U4).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ajouter un logement à son séjour (Priority: P1)

Un couple prépare trois nuits à Kribi. Sur la page Hébergements, il lit en tête le principe (« Choisissez le type de logement et le budget qui vous convient. Nous cherchons ensuite la meilleure option disponible chez nos partenaires à Kribi. »), parcourt chambre, studio, appartement et villa, choisit un studio à partir de 30 000 FCFA la nuit, règle trois nuits et l'ajoute à Mon séjour. Le séjour affiche le studio, trois nuits, 90 000 FCFA, à côté de ses expériences ; le message WhatsApp les reprend toutes.

**Why this priority**: Le logement est la première question d'un séjour, et la plus grosse dépense. Sans lui, la sélection reste un programme d'activités.

**Independent Test**: Ajouter un palier de chaque type avec un nombre de nuits différent, ouvrir Mon séjour, vérifier montants, total et message.

**Acceptance Scenarios**:

1. **Given** la page Hébergements, **When** elle s'ouvre, **Then** la phrase d'explication précède les paliers, puis viennent Chambre (à partir de 15 000), Studio (à partir de 30 000), Appartement (à partir de 35 000, 50 000 et 100 000) et Villa (à partir de 150 000), par nuit, chacun avec sa capacité et l'équivalent en euros.
2. **Given** un palier, **When** le visiteur touche « Ajouter », **Then** une ligne s'ajoute à Mon séjour avec une nuit par défaut, un message confirme l'ajout, et le compteur augmente.
3. **Given** une ligne d'hébergement dans Mon séjour, **When** le visiteur règle 3 nuits, **Then** son montant vaut le prix du palier × 3, présenté comme estimatif (prix « à partir de »).
4. **Given** la fin de la page, **When** le visiteur y arrive, **Then** un encadré « Plus grand, plus haut de gamme ? » mentionne des logements jusqu'à 300 000 FCFA la nuit et propose d'écrire à Kibreeze sur WhatsApp, sans palier chiffré ajoutable.
5. **Given** une photo de palier, **When** elle s'affiche, **Then** elle porte la mention « Exemple de logement à ce budget ».
6. **Given** le message WhatsApp d'un séjour avec hébergement, **When** Kibreeze le lit, **Then** le type, le budget choisi et le nombre de nuits y figurent.

---

### User Story 2 - Partir d'un parcours (Priority: P2)

Une famille veut voir l'essentiel de Kribi sans tout organiser. Depuis la page Tourisme, elle touche « Parcours Kibreeze », découvre six circuits, choisit « L'Essentiel de Kribi : chutes de la Lobé, village Bagyeli, village Mayi, plage de Batanga », à partir de 30 000 FCFA par personne, minimum 2. Elle touche « Personnaliser ce parcours » pour 4 personnes : le parcours entre dans Mon séjour, où elle peut ajouter d'autres prestations avant d'envoyer le tout.

**Why this priority**: Les parcours répondent au besoin du visiteur pressé et regroupent les nouvelles visites de la 008. Ils viennent après le logement, plus central.

**Independent Test**: Ouvrir chacun des six parcours, ajouter « L'Essentiel de Kribi » pour 4 personnes, vérifier la ligne, le total et le message.

**Acceptance Scenarios**:

1. **Given** la page Tourisme, **When** elle s'affiche, **Then** une entrée « Parcours Kibreeze » mène aux parcours, dans l'onglet Formules.
2. **Given** un parcours, **When** sa carte s'affiche, **Then** elle montre ses étapes dans l'ordre, « À partir de X FCFA / personne », « minimum 2 personnes », la mention de tarif dégressif quand elle s'applique, une note indiquant que le prix dépend du groupe et des paramètres, et l'action « Personnaliser ce parcours ».
3. **Given** un parcours sur demande (Kribi & Ebodjé, Kribi au fil de l'eau), **When** sa carte s'affiche, **Then** elle porte « Sur devis » à la place du montant, et l'action reste disponible.
4. **Given** « Personnaliser ce parcours », **When** le visiteur choisit 4 personnes et confirme, **Then** une ligne unique s'ajoute à Mon séjour, comptée dans le total à 4 × le prix de départ, sous la mention « à partir de ».
5. **Given** un parcours, **When** le visiteur règle le nombre de personnes, **Then** il ne peut pas descendre sous 2.
6. **Given** une étape qui correspond à une fiche du catalogue, **When** le visiteur la touche, **Then** il arrive sur cette fiche.

---

### User Story 3 - Choisir une formule (Priority: P3)

Un couple pressé choisit la formule Évasion : chutes de la Lobé, pirogue, kayak, balade à cheval et jacuzzi naturel, 120 000 FCFA pour deux. Il l'ajoute à son séjour en un geste.

**Why this priority**: Les formules existent, ont des prix et un écran validé (07). Elles regroupent surtout des activités, là où les parcours regroupent des visites ; elles viennent après eux sur la page.

**Independent Test**: Ajouter une formule, vérifier la ligne, le total et le message ; ouvrir la page en anglais.

**Acceptance Scenarios**:

1. **Given** la page Formules, **When** elle s'affiche, **Then** la section « Parcours de visite » précède la section « Formules d'activités », et chaque formule montre sa photo, son nom, la liste de ses expériences, son prix « / 2 personnes » et son équivalent en euros, et la mention « Tous nos forfaits sont calculés sur une base de 2 personnes » précède la liste.
2. **Given** une formule, **When** le visiteur touche « Ajouter à mon séjour », **Then** une ligne unique s'ajoute, à son prix pour 2, sans détail de ses expériences dans le récapitulatif ni dans le message.
3. **Given** la fin de la page, **When** le visiteur y arrive, **Then** un encadré « Groupes jusqu'à 8 personnes sur demande » propose d'écrire à Kibreeze.

---

### Edge Cases

- **Expérience d'une formule retirée du catalogue** : la construction du site échoue, plutôt qu'une formule qui promet une expérience disparue (FR-PACK-2). Les références anciennes sont mises à jour : le Musée d'art est le Musée Batanga (Q3), le Bateau de plaisance est remplacé par le bateau de croisière en haute mer (Q2).
- **Étape de parcours sans fiche** (fleuve Lobé, inclus dans la visite du village Bagyeli) : elle s'affiche comme texte, sans lien.
- **Plus de 8 personnes sur une formule** : la formule n'est pas proposée au-delà de 2 personnes ; les groupes passent par l'encadré WhatsApp (FR-PACK-3).
- **Capacité d'un palier dépassée** : la capacité est indicative (« 2 à 3 personnes ») ; le nombre de voyageurs n'est pas contrôlé contre elle, Kibreeze ajuste lors de la réservation.
- **Même palier ajouté deux fois** : les nuits sont remplacées, pas additionnées, comme toute durée dans la sélection de la 004.
- **Deux paliers d'appartement dans le même séjour** : deux lignes distinctes, chacune avec ses nuits.
- **Parcours ajouté puis prestation de ce parcours ajoutée seule** : deux lignes distinctes ; aucune déduplication automatique, Kibreeze ajuste sur WhatsApp.
- **JavaScript désactivé** : les pages restent lisibles ; l'ajout se fait par le bouton WhatsApp.
- **Photo d'hébergement absente pour un palier** : la photo du type sert ; jamais une photo filigranée.

## Requirements *(mandatory)*

### Functional Requirements

#### Hébergements

- **FR-001**: La page Hébergements DOIT présenter les paliers validés, groupés par type, dans cet ordre : Chambre (à partir de 15 000), Studio (à partir de 30 000), Appartement (à partir de 35 000, 50 000 et 100 000), Villa (à partir de 150 000), tous par nuit, avec la capacité de chaque type (FR-HEB-1).
- **FR-002**: La phrase d'explication du principe DOIT précéder les paliers (FR-HEB-2).
- **FR-003**: Le haut de gamme DOIT apparaître après tous les paliers standards, comme un encadré qui mentionne « jusqu'à 300 000 FCFA la nuit » et ouvre WhatsApp, sans palier chiffré (FR-HEB-3, écran 06a).
- **FR-004**: Chaque palier DOIT pouvoir s'ajouter à Mon séjour, avec un nombre de nuits (1 par défaut) ; le montant d'une ligne vaut le prix du palier × le nombre de nuits, présenté comme estimatif (FR-HEB-4).
- **FR-005**: Ce qui est inclus, quand il est connu pour un palier, DOIT s'afficher juste sous le prix ; sinon rien (FR-HEB-5).
- **FR-006**: Chaque photo de palier DOIT porter la mention « Exemple de logement à ce budget » (FR-HEB-6).
- **FR-007**: Les textes DOIVENT parler de réservation par Kibreeze, jamais de mise en relation avec un propriétaire (FR-HEB-7).

#### Parcours

- **FR-008**: Les six parcours du cahier (section 5) DOIVENT être publiés avec leurs étapes et leur prix :

  | Parcours | Étapes | Prix |
  |---|---|---|
  | L'Essentiel de Kribi | Chutes de la Lobé → Village Bagyeli → Village Mayi → Plage du village Batanga | à partir de 30 000 FCFA / personne, minimum 2, dégressif |
  | Kribi Nature & Littoral | Chutes de la Lobé → Fleuve Lobé → Village Bagyeli → Plage du village Batanga | à partir de 25 000 FCFA / personne, minimum 2, dégressif |
  | Kribi Culture & Patrimoine | Village Mayi → Musée Batanga → Débarcadère de Mboa-Manga | à partir de 10 000 FCFA / personne, minimum 2, dégressif |
  | Kribi & Ebodjé | Kribi → Ebodjé → village → observation des tortues selon la période | sur demande |
  | Kribi Authentique | Village Bagyeli → Village Mayi → Village Batanga → Débarcadère de Mboa-Manga | à partir de 25 000 FCFA / personne, minimum 2, dégressif |
  | Kribi au fil de l'eau | Chutes de la Lobé → excursion sur le fleuve Lobé → plage de Batanga | sur demande |

- **FR-009**: Chaque carte de parcours DOIT afficher « À partir de X FCFA / personne » (ou « Sur devis »), le minimum de participants, la mention de tarif dégressif quand elle s'applique, une note sur les paramètres de calcul, et l'action « Personnaliser ce parcours » (cahier, section 5).
- **FR-010**: « Personnaliser ce parcours » DOIT ajouter le parcours à Mon séjour comme une ligne unique, avec un nombre de personnes (2 par défaut, jamais moins de 2) ; un parcours chiffré compte dans le total « à partir de » (réponses U3, U4).
- **FR-011**: Une étape qui correspond à une fiche publiée DOIT y mener ; une étape qui n'en a pas s'affiche comme texte.
- **FR-012**: La page Tourisme DOIT proposer une entrée « Parcours Kibreeze » vers les parcours (réponse U2).

#### Formules

- **FR-013**: La page Formules DOIT présenter deux sections, dans cet ordre : « Parcours de visite » (les six parcours, prix par personne) puis « Formules d'activités » (les quatre formules du guide tarifaire, prix fixe pour 2 personnes). Les formules restent publiées à côté des parcours (décision de Zobel du 2026-10-11 : le cahier d'octobre conserve ce qu'il ne modifie pas, et Franck a placé les parcours dans l'onglet Formules sans retirer celles-ci).
- **FR-014**: Les formules DOIVENT afficher leurs expériences, leur prix pour 2 personnes et l'encadré « Groupes jusqu'à 8 personnes sur demande », s'ajouter à Mon séjour comme une ligne unique, et la construction DOIT échouer si une formule référence une expérience retirée (FR-PACK-1 à 4).

#### Navigation, langues, référencement

- **FR-015**: Les onglets Hébergements et Formules DOIVENT mener à leurs pages, dans la barre à onglets et la navigation ordinateur ; les liens de l'accueil vers ces pages, qui ouvrent aujourd'hui WhatsApp, DOIVENT y mener.
- **FR-016**: Le message WhatsApp DOIT nommer chaque hébergement (type, budget, nuits), parcours (nom, personnes) et formule (nom), dans la langue de la page.
- **FR-017**: Tout texte ajouté DOIT exister en français et en anglais.
- **FR-018**: Les pages Hébergements et Formules DOIVENT avoir un titre, une description et une image de partage propres, figurer au plan du site, et être utilisables au clavier.

### Key Entities

- **Palier d'hébergement** : type (chambre, studio, appartement, villa), prix de départ par nuit, capacité indicative, inclus éventuel, photo représentative ; s'ajoute avec un nombre de nuits.
- **Parcours** : nom, étapes ordonnées (chacune liée ou non à une fiche), prix de départ par personne ou sur demande, minimum de participants, dégressivité, description, photo ; s'ajoute avec un nombre de personnes.
- **Formule** : nom, expériences du catalogue qu'elle contient, prix pour 2 personnes, photo ; s'ajoute comme une ligne sans quantité.
- **Ligne de séjour** : inchangée (004) ; elle accueille désormais ces trois nouvelles sortes de prestations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur ajoute un logement avec son nombre de nuits à son séjour en trois gestes au plus depuis la page Hébergements.
- **SC-002**: Les 6 parcours et les prix du cahier sont affichés à l'identique ; aucun montant haut de gamme n'apparaît avant les paliers standards.
- **SC-003**: Un séjour qui réunit un logement, un parcours et une expérience s'envoie sur WhatsApp en un geste, chaque élément nommé avec ses quantités.
- **SC-004**: Depuis la page Tourisme, le visiteur atteint les parcours en un geste.
- **SC-005**: Les pages Hébergements et Formules atteignent au moins 90 sur 100 aux audits automatiques de performance, accessibilité, bonnes pratiques et référencement, sur profil mobile.
- **SC-006**: Zéro lien interne cassé ; plus aucun lien du site ne renvoie vers WhatsApp faute de page Hébergements ou Formules.
- **SC-007**: Franck reconnaît les écrans 06a, 06b et 07 qu'il a validés, et la place des parcours qu'il a demandée.

## Assumptions

- **Grille d'hébergement** : celle du 2026-09-26 (client-answers 1 quater), sans la ligne à 5 000 FCFA retirée par Franck.
- **Haut de gamme** : un encadré WhatsApp, pas un palier, comme sur l'écran validé 06a.
- **Nuits** : 1 par défaut, 30 au plus ; les dates du séjour restent celles du champ de Mon séjour (004).
- **Photos d'hébergement** : celles envoyées par Franck le 2026-10-06 (appartement et studio, villa), présentées comme exemples de logement à ce budget ; une par type, la chambre reprenant l'aperçu déjà publié sur l'accueil.
- **Parcours** : textes de l'onglet 3 du questionnaire 4 (« un parcours d'une journée » pour L'Essentiel de Kribi, départ à convenir), selon la règle de la 008 : pas de rubrique réduite à « à confirmer ».
- **Formules** : le Musée d'art de la formule Découverte devient la visite du Musée Batanga (Q3), le Bateau de plaisance de la formule Premium devient le bateau de croisière en haute mer (Q2) ; les formules complètes avec hébergement et transport attendent leurs prix (FR-PACK-5) et ne sont pas publiées. La formule Premium garde le prix de 300 000 FCFA du guide, à faire confirmer par Franck puisque le bateau de croisière (150 000 FCFA l'heure) remplace le bateau de plaisance (100 000 à 120 000 FCFA l'heure).
- **Mon séjour** : son fonctionnement ne change pas ; il reçoit trois nouvelles sortes de lignes. Une formule et un parcours sont une ligne unique, sans détail de leurs étapes dans le récapitulatif.

## Dependencies

- Features 004 (Mon séjour) et 008 (univers du Tourisme, page Tourisme, nouvelles visites référencées par les parcours), livrées.
- Écrans validés 06a, 06b, 07.
- Confirmation par Franck du prix de la formule Premium, non bloquante (Assumptions).

## Out of Scope

- Logements nommés, disponibilités, réservation ou paiement en ligne.
- Formules complètes avec hébergement et transport, faute de prix (FR-PACK-5).
- Mobilité TKS® : feature 006.
- Paliers de prix dégressifs détaillés pour les parcours.
