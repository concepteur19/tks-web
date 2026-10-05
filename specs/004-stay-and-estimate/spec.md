# Feature Specification: Mon séjour, estimation et demande WhatsApp

**Feature Branch**: `004-stay-and-estimate`

**Created**: 2026-10-05

**Status**: Draft

**Input**: Store persistant, ajout au séjour, sélecteurs de quantité, badge, page Mon séjour et ses états, calcul de l'estimation, conversion en euros, message récapitulatif WhatsApp. Exigences FR-SEL-*, FR-EST-*, FR-WA-*, FR-I18N-5/6/7. Référence visuelle : `docs/design-exports/` (03, 04, 05a, 05b, 11).

## Contexte

Les features 002 et 003 ont livré la vitrine : l'accueil, le catalogue des 13 expériences et leurs fiches. Le visiteur peut déjà demander une expérience à la fois sur WhatsApp. Il ne peut pas encore composer un séjour, c'est-à-dire réunir plusieurs expériences, voir ce que cela coûterait, puis tout envoyer d'un coup.

C'est le parcours au cœur du produit : découvrir, sélectionner, estimer, envoyer sur WhatsApp. Cette feature le rend possible pour les expériences. Les hébergements et la mobilité TKS® s'y brancheront avec les features 005 et 006, sans changer le fonctionnement de la sélection.

Les fiches de la 003 affichent déjà les options sans case à cocher et ne proposent aucun ajout au séjour, faute de sélection. Cette feature leur donne ces interactions, conformément aux écrans validés [03](../../docs/design-exports/03-fiche-pirogue.jpg) et [11](../../docs/design-exports/11-fiche-pirogue-ordinateur.jpg). La page Mon séjour suit les écrans [04](../../docs/design-exports/04-mon-sejour-plein.jpg), [05a](../../docs/design-exports/05a-mon-sejour-vide.jpg) et [05b](../../docs/design-exports/05b-mon-sejour-sur-devis.jpg).

Exigences de référence : FR-SEL-1 à 11, FR-EST-1 à 7 (dont 1 bis et 1 ter), FR-WA-1 à 6, FR-EUR-1 à 3 et FR-I18N-5 à 7 de [functional-requirements.md](../../docs/functional-requirements.md).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ajouter des expériences à son séjour (Priority: P1)

Le visiteur parcourt les fiches. Sur celle de l'excursion en pirogue, il choisit le nombre de personnes, coche le guide touristique, voit le total de la ligne se mettre à jour, puis touche « Ajouter à mon séjour ». Un message confirme l'ajout et le compteur de l'onglet Mon séjour passe à 1. Il fait de même avec les chutes de la Lobé. Depuis la liste des expériences, il peut aussi ajouter une expérience en un geste, avec la quantité par défaut.

**Why this priority**: Sans sélection, rien d'autre de cette feature n'existe. C'est aussi le geste que Franck attend : « ajout rapide depuis les listes, au lancement ».

**Independent Test**: Ajouter trois expériences depuis leur fiche et une depuis la liste, recharger la page, fermer puis rouvrir le navigateur, et vérifier que les quatre lignes et le compteur sont toujours là.

**Acceptance Scenarios**:

1. **Given** la fiche de l'excursion en pirogue, **When** le visiteur choisit 6 personnes et touche « Ajouter à mon séjour », **Then** la sélection contient une ligne « Excursion en pirogue » pour 6 personnes, un message confirme l'ajout, et le compteur de Mon séjour indique 1.
2. **Given** une ligne pirogue de 2 personnes déjà sélectionnée, **When** le visiteur en ajoute 3 de plus, **Then** la ligne passe à 5 personnes au lieu d'en créer une seconde.
3. **Given** une quantité qui atteindrait le maximum autorisé, **When** le visiteur ajoute, **Then** la quantité s'arrête au maximum et un message l'indique.
4. **Given** la fiche du campement Bagyeli, **When** le visiteur choisit le tarif « Couple » puis ajoute, **Then** la ligne porte ce tarif et son prix de 20 000 FCFA.
5. **Given** la fiche d'une expérience, **When** le visiteur coche le guide touristique et le maître-nageur, **Then** le total affiché dans la barre fixe intègre leur prix, et la ligne ajoutée les mentionne.
6. **Given** une expérience sans quantité (feu de plage) ou sur devis (jet-ski), **When** elle est déjà dans la sélection, **Then** le bouton indique « Déjà dans mon séjour » plutôt que de l'ajouter une seconde fois.
7. **Given** une sélection, **When** le visiteur ferme le navigateur puis le rouvre, **Then** la sélection est identique.

---

### User Story 2 - Voir et ajuster son séjour, avec une estimation (Priority: P2)

Le visiteur ouvre Mon séjour. Il y voit chaque prestation choisie avec sa quantité et son prix, peut changer une quantité ou retirer une ligne, renseigner ses dates et le nombre de voyageurs, et lit un total estimatif en FCFA avec son équivalent en euros.

**Why this priority**: L'estimation est ce qui distingue Kibreeze d'un simple formulaire de contact : le visiteur sait à quoi s'attendre avant d'écrire.

**Independent Test**: Avec une sélection de trois expériences dont une sur devis, vérifier chaque montant de ligne, le total, la mention des prestations sur devis, puis modifier une quantité et retirer une ligne.

**Acceptance Scenarios**:

1. **Given** une sélection pirogue (35 000 par groupe), chutes de la Lobé × 2 personnes (5 000 par personne) et jet-ski (sur devis), **When** la page Mon séjour s'ouvre, **Then** elle affiche « 3 prestations sélectionnées », chaque ligne avec son prix, un total de 45 000 FCFA, « ≈ 68,60 € » et « + 1 prestation sur devis ».
2. **Given** une ligne pirogue, **When** le visiteur porte la quantité à 10 personnes, au-delà des 8 autorisés, **Then** la ligne bascule sur « Sur devis » et son montant sort du total.
3. **Given** une ligne, **When** le visiteur touche l'icône de suppression, **Then** la ligne disparaît, le total et le compteur se mettent à jour, et un message permet de comprendre ce qui s'est passé.
4. **Given** une sélection, **When** le visiteur touche « Vider » et confirme, **Then** la sélection est vide et la page affiche l'état vide.
5. **Given** une sélection d'expériences sans dates ni voyageurs, **When** la page s'affiche, **Then** un rappel discret invite à les renseigner, sans empêcher l'envoi.
6. **Given** une sélection composée uniquement de prestations sur devis, **When** la page s'affiche, **Then** aucun montant n'apparaît, seulement « Total : sur devis (N prestations) ».
7. **Given** une sélection vide, **When** la page s'affiche, **Then** une photo de Kribi, « Votre séjour est vide », une phrase et le bouton « Découvrir les expériences » remplacent la liste.
8. **Given** une ligne dont l'expérience a été retirée du catalogue entre deux visites, **When** la page s'ouvre, **Then** la ligne est retirée et un message discret l'indique.

---

### User Story 3 - Envoyer son séjour à Kibreeze sur WhatsApp (Priority: P3)

Le visiteur a composé son séjour. Il touche « Demander un devis par WhatsApp » : WhatsApp s'ouvre avec un message déjà rédigé dans sa langue, qui reprend ses dates, le nombre de voyageurs, chaque prestation avec sa quantité et son prix, le total et les prestations sur devis. Il peut le modifier avant de l'envoyer.

**Why this priority**: C'est la conversion. Elle dépend des deux histoires précédentes.

**Independent Test**: Composer un séjour de quatre lignes avec dates et voyageurs, dans chaque langue, toucher le bouton et lire le message prérempli.

**Acceptance Scenarios**:

1. **Given** une sélection et des dates renseignées, **When** le visiteur touche « Demander un devis par WhatsApp », **Then** WhatsApp s'ouvre vers le numéro de Kibreeze avec un message qui salue Kibreeze, annonce l'intention d'organiser un séjour à Kribi, donne les dates et les voyageurs, liste chaque prestation avec ses quantités, ses options et son montant ou « sur devis », puis le total estimatif et le nombre de prestations sur devis, et se termine par une formule de clôture.
2. **Given** la même sélection sur une page anglaise, **When** le visiteur envoie, **Then** le message est entièrement en anglais, titres des expériences compris, et les montants suivent le format anglais.
3. **Given** une très grande sélection, **When** le message dépasserait la longueur que WhatsApp accepte, **Then** les dernières lignes sont résumées par « … et N autres prestations », et le total reste exact.
4. **Given** une fiche, **When** le visiteur touche « Demander ce service », **Then** le message ne concerne que cette expérience, avec la quantité et les options choisies sur la fiche, et la sélection n'est pas modifiée.

---

### User Story 4 - Retrouver son séjour depuis n'importe quelle page (Priority: P4)

Où qu'il soit sur le site, le visiteur voit combien de prestations il a choisies et rejoint son séjour en un geste : par l'onglet Mon séjour sur téléphone, par l'icône de l'en-tête sur ordinateur.

**Why this priority**: Utile dès qu'une sélection existe, mais secondaire par rapport au parcours d'ajout, d'estimation et d'envoi.

**Independent Test**: Ajouter deux expériences, naviguer sur l'accueil, Contact et une page légale, et vérifier le compteur et l'accès à Mon séjour sur téléphone et sur ordinateur.

**Acceptance Scenarios**:

1. **Given** deux lignes dans la sélection, **When** n'importe quelle page se charge, **Then** l'onglet Mon séjour (téléphone) et l'icône Mon séjour de l'en-tête (ordinateur) affichent 2.
2. **Given** une sélection vide, **When** une page se charge, **Then** le compteur affiche 0 ou n'apparaît pas, sans décalage de mise en page.
3. **Given** l'accueil, **When** le visiteur touche « Planifier mon séjour », **Then** il arrive sur Mon séjour.

---

### Edge Cases

- **Stockage indisponible** (navigation privée stricte, stockage plein) : la sélection fonctionne pour la visite en cours, et un bandeau prévient qu'elle ne sera pas conservée (FR-SEL-7).
- **Sélection ancienne** : une sélection non modifiée depuis plus de 30 jours est effacée au chargement, sans message d'erreur.
- **Données enregistrées illisibles ou d'une version inconnue** : la sélection repart vide proprement, sans bloquer la page.
- **Deux onglets ouverts** : un ajout dans un onglet est reflété dans l'autre au plus tard à son prochain affichage.
- **Changement de langue** : la sélection, les quantités, les options, les dates et les voyageurs sont conservés ; seuls les libellés changent (FR-I18N-5).
- **Quantité saisie hors bornes** (0, négative, au-delà du maximum, texte) : ramenée à la borne la plus proche.
- **Capacité dépassée** pour la pirogue ou la chaloupe : la ligne passe sur devis, ce qui est expliqué sur la ligne.
- **Option au prix par personne** (musée d'art) sur une expérience sans nombre de personnes : comptée pour une personne.
- **JavaScript désactivé** : les fiches et la liste restent lisibles et « Demander ce service » fonctionne ; l'ajout au séjour et la page Mon séjour annoncent qu'ils nécessitent JavaScript.
- **Lien WhatsApp trop long** : troncature des lignes, total intact (FR-WA-5).

## Requirements *(mandatory)*

### Functional Requirements

#### Sélection

- **FR-001**: Le visiteur DOIT pouvoir ajouter une expérience à sa sélection depuis sa fiche, en choisissant chacune de ses quantités dans leurs bornes, le tarif s'il y en a plusieurs, et les options souhaitées (FR-SEL-1).
- **FR-002**: Le visiteur DOIT pouvoir ajouter une expérience depuis la liste des expériences et depuis les expériences mises en avant de l'accueil, en un geste, avec les quantités par défaut, sans options.
- **FR-003**: Ajouter une expérience déjà présente DOIT mettre à jour sa ligne : les personnes et unités s'additionnent dans la limite du maximum, avec un message si le maximum est atteint ; le tarif et les options prennent les nouvelles valeurs (FR-SEL-2).
- **FR-004**: Une expérience sans quantité ou sur devis NE DOIT PAS pouvoir être ajoutée deux fois ; son bouton DOIT alors indiquer qu'elle est déjà dans le séjour (FR-SEL-4).
- **FR-005**: Chaque ajout, modification ou retrait DOIT donner un retour visible et annoncé aux technologies d'assistance, et mettre à jour le compteur sans recharger la page (FR-SEL-8).
- **FR-006**: La sélection DOIT être conservée sur l'appareil entre les visites, avec un numéro de version, restaurée au chargement, effacée si elle n'a pas été modifiée depuis plus de 30 jours, et repartir vide si elle est illisible (FR-SEL-5).
- **FR-007**: Au chargement, les lignes dont l'expérience n'existe plus ou est désactivée DOIVENT être retirées, avec un message discret (FR-SEL-6).
- **FR-008**: Si le stockage est indisponible, la sélection DOIT fonctionner pour la visite en cours, avec un bandeau qui le signale (FR-SEL-7).
- **FR-009**: La sélection, les quantités, les options, les dates et les voyageurs DOIVENT être communs aux deux langues (FR-I18N-5).

#### Fiche

- **FR-010**: La fiche DOIT proposer un sélecteur par dimension de quantité (boutons − et + d'au moins 44 px et une valeur), un choix de tarif quand l'expérience en a plusieurs, et une case à cocher par option, décochée par défaut.
- **FR-011**: La barre fixe (téléphone) et la carte collante (ordinateur) DOIVENT afficher le total de la configuration choisie, avec son équivalent en euros, le bouton « Ajouter à mon séjour » et le lien « Demander ce service », qui envoie cette seule configuration sur WhatsApp sans toucher à la sélection (FR-WA-6).

#### Estimation

- **FR-012**: Le montant d'une ligne DOIT valoir le prix unitaire multiplié par toutes ses quantités, plus ses options ; une ligne sur devis n'a pas de montant (FR-EST-2).
- **FR-013**: Une ligne dont le nombre de personnes dépasse la capacité maximale d'un prix de groupe DOIT passer sur devis (FR-EST-1 bis).
- **FR-014**: Une option au prix fixe DOIT compter une fois par ligne ; une option au prix par personne DOIT être multipliée par le nombre de personnes de la ligne, ou compter pour une personne si la ligne n'en a pas.
- **FR-015**: Le total DOIT être la somme des montants des lignes chiffrées, accompagné du nombre de lignes sur devis (« + N prestations sur devis ») et de son équivalent en euros (FR-EST-3, FR-EUR-1).
- **FR-016**: Le libellé du total DOIT être « Total estimatif » si au moins une ligne porte un prix « à partir de », « Total indicatif » sinon, toujours suivi de la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. » (FR-EST-4).
- **FR-017**: Si toutes les lignes sont sur devis, aucun montant NE DOIT être affiché : « Total : sur devis (N prestations) » (FR-EST-5).
- **FR-018**: Le calcul de l'estimation DOIT être une règle unique, utilisée par la fiche, la page Mon séjour et le message, et vérifiée à 100 % par des tests (FR-EST-7).

#### Page Mon séjour

- **FR-019**: La page Mon séjour DOIT exister à `/sejour` et `/en/my-trip`, avec le titre, le nombre de prestations, le lien « Vider » (avec confirmation), la liste des lignes, les champs dates et voyageurs, l'encadré du total et une barre fixe « Demander un devis par WhatsApp » avec le lien « Continuer mes recherches ».
- **FR-020**: Chaque ligne DOIT afficher sa photo, son nom, ses quantités en toutes lettres (« 2 personnes », « tarif couple »), ses options, son prix, un sélecteur compact quand elle a des quantités, et une icône de suppression ; une ligne sur devis n'a ni montant ni sélecteur.
- **FR-021**: Les champs dates (texte libre) et voyageurs (nombre) DOIVENT être facultatifs et conservés avec la sélection ; s'ils sont vides, un rappel non bloquant DOIT s'afficher (FR-SEL-10).
- **FR-022**: Une sélection vide DOIT afficher l'état vide de la maquette 05a, avec le bouton WhatsApp flottant et sans barre fixe (FR-SEL-9).
- **FR-023**: Sur ordinateur, l'encadré du total et le bouton d'envoi DOIVENT former un panneau à droite qui reste visible pendant le défilement (FR-SEL-11).

#### Message WhatsApp

- **FR-024**: « Demander un devis par WhatsApp » DOIT ouvrir WhatsApp avec un message, dans la langue de la page, contenant dans l'ordre : salutation et intention, dates et voyageurs s'ils sont renseignés, chaque ligne avec son titre, ses quantités, ses options et son montant ou « sur devis », le total avec le nombre de prestations sur devis, et une formule de clôture (FR-WA-3, FR-I18N-6).
- **FR-025**: Si le message encodé dépasse 1 800 caractères, les dernières lignes DOIVENT être remplacées par « … et N autres prestations », le total restant exact (FR-WA-5).
- **FR-026**: Le message DOIT être produit par une règle unique, vérifiée à 100 % par des tests, dont un exemple complet de non-régression (FR-WA-4).

#### Coque, accueil, confidentialité

- **FR-027**: Le compteur DOIT apparaître sur l'onglet Mon séjour (téléphone) et sur l'icône Mon séjour de l'en-tête (ordinateur), sans décalage de mise en page au chargement.
- **FR-028**: « Planifier mon séjour » sur l'accueil DOIT mener à Mon séjour ; les expériences mises en avant DOIVENT proposer « Ajouter à mon séjour ».
- **FR-029**: La politique de confidentialité DOIT décrire la conservation de la sélection sur l'appareil (nom de la donnée, contenu, durée de 30 jours, moyen de l'effacer), et la liste des stockages vérifiée par les tests DOIT l'inclure (FR-031 de la feature 002).
- **FR-030**: Tout texte visible DOIT exister en français et en anglais ; les montants DOIVENT suivre le format de la langue (FR-I18N-7).

### Key Entities

- **Sélection** : l'ensemble des lignes choisies, les dates et le nombre de voyageurs, la date de dernière modification et un numéro de version. Une seule par appareil, commune aux deux langues.
- **Ligne de sélection** : une expérience, ses quantités dans l'ordre de ses dimensions, le tarif choisi s'il y en a plusieurs, et les options cochées.
- **Estimation** : pour chaque ligne, son prix unitaire, son montant ou « sur devis » ; pour l'ensemble, le total, le nombre de lignes sur devis, et la présence de prix « à partir de ».
- **Message de demande** : le texte envoyé à WhatsApp, dans une langue, pour la sélection entière ou pour une seule configuration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur compose un séjour de trois expériences et l'envoie sur WhatsApp en moins de 2 minutes, depuis l'accueil.
- **SC-002**: Le total affiché et celui du message sont identiques, et justes au franc près pour tous les cas du guide tarifaire (prix ferme, par groupe, tarifs multiples, capacité dépassée, options, sur devis).
- **SC-003**: La sélection survit à la fermeture du navigateur dans 100 % des cas où le stockage est disponible.
- **SC-004**: Le compteur, la ligne et le total se mettent à jour en moins de 100 ms après un ajout ou une modification, sans rechargement.
- **SC-005**: La page Mon séjour atteint au moins 90 sur 100 aux quatre audits automatiques sur profil mobile, et le code exécuté par le visiteur reste sous 80 Ko compressés sur cette page et sous 50 Ko sur les autres.
- **SC-006**: Toutes les interactions (sélecteurs, cases, ajout, suppression, vider, envoyer) sont réalisables au clavier et annoncées aux technologies d'assistance, sans violation automatique d'accessibilité.
- **SC-007**: Le message WhatsApp ne dépasse jamais 1 800 caractères encodés.

## Assumptions

- **Périmètre** : seules les expériences entrent dans la sélection pour l'instant ; hébergements (005) et mobilité TKS® (006) s'y ajouteront sans changer ses règles.
- **Options** : elles sont rattachées à la ligne de l'expérience où elles ont été cochées, et non vendues comme des lignes séparées ; elles apparaissent sous la ligne dans Mon séjour et dans le message.
- **Ajout depuis la liste** : quantités par défaut du catalogue, tarif le moins cher s'il y en a plusieurs, aucune option ; le visiteur ajuste ensuite dans Mon séjour.
- **Panneau ordinateur** : l'icône Mon séjour de l'en-tête mène à la page Mon séjour, dont le total forme un panneau latéral collant. Pas de tiroir qui s'ouvre par-dessus la page courante.
- **Dates** : champ de texte libre (« du 12 au 15 décembre »), sans calendrier, comme le prévoit FR-SEL-10.
- **Formule de clôture du message** : « Merci, à bientôt ! » / « Thank you, see you soon! », dans le ton du site ; à ajuster si Franck en préfère une autre.
- **Conservation** : sur l'appareil seulement, jamais transmise à Kibreeze sans l'envoi volontaire sur WhatsApp ; durée de 30 jours après la dernière modification.

## Dependencies

- Features 002 et 003 : coque, compteur prévu dans l'onglet et l'en-tête, fiches, `cardPrice`, `formatPrice`, `buildServiceRequestMessage`, schémas de quantités et de tarifs.
- Écrans validés 03, 04, 05a, 05b et 11.

## Out of Scope

- Hébergements et formules dans la sélection : feature 005. Mobilité TKS® : feature 006.
- Paiement, réservation en ligne, compte visiteur, synchronisation entre appareils.
- Envoi par un autre canal que WhatsApp (e-mail, formulaire).
- Tiroir de récapitulatif ouvert par-dessus la page courante.
