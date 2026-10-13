# Research — 005 Hébergements, formules et parcours

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-12

Pas d'inconnue technique. Le schéma de contenu prévoit depuis la 001 les sections `hebergement` et `formule`, l'unité `per_night` et la dimension `nights` ; la sélection de la 004 sait déjà ajouter, fusionner et purger n'importe quelle prestation de la collection `services`. Les décisions ci-dessous étendent ce qui existe au plus simple (constitution, principe I).

---

## 1. Tout reste dans la collection `services`

**Decision**: paliers d'hébergement, parcours et formules sont des entrées de `src/content/services/`, distinguées par leur `section` : `hebergement` (6 paliers), `parcours` (6, **section nouvelle**), `formule` (4).

**Rationale**: la sélection, l'estimation, le message WhatsApp, le catalogue des îlots et la purge d'une ligne disparue (004) reposent tous sur cette collection et sur l'identifiant de la prestation. Une collection séparée obligerait à dupliquer ce circuit. La section `parcours` est distincte de `formule` parce que leurs données diffèrent (étapes, prix par personne, minimum) et que la page les montre dans deux sections.

**Alternatives considered**: collections `accommodation` et `packages` (rejeté : la sélection ne les verrait pas sans réécriture) ; parcours et formules dans la même section avec un champ de genre (rejeté : moins lisible qu'une section).

## 2. Un palier = une prestation

**Decision**: chaque palier est une prestation à part (`appartement-50000`…), avec un champ `accommodationType` (`chambre`, `studio`, `appartement`, `villa`) qui sert à grouper l'affichage. Prix `from` + `per_night`, dimension `nights` 1 à 30, 1 par défaut.

**Rationale**: l'écran 06a montre un bouton « Ajouter » par palier, et la spec veut deux lignes distinctes pour deux paliers d'appartement. Les tarifs multiples d'une prestation (`tiers`, 004) ne donnent qu'une ligne par prestation.

## 3. Formules : nouvelle unité `per_couple`

**Decision**: prix `fixed` + unité **`per_couple`** (« / 2 personnes », « / 2 people »), aucune dimension de quantité. Une formule s'ajoute donc comme une ligne unique et ne se duplique pas (« Déjà dans mon séjour »), comme le feu de plage avant la 008.

**Rationale**: FR-PACK-1 exige que la base de 2 personnes soit affichée avec le prix. `per_group` afficherait « / groupe », faux. Une unité de plus est une chaîne par langue ; `computeEstimate` ne fait rien de particulier pour une unité sans dimension.

## 4. Parcours : étapes, minimum, dégressivité

**Decision**: un parcours a `steps` (liste ordonnée de `{ label, serviceId? }`), un prix `from` + `per_person` ou `quote`, une dimension `persons` de minimum 2 (le minimum de la 008), `degressive: true` quand le cahier l'indique. Une étape avec `serviceId` mène à la fiche ; sans, c'est du texte (fleuve Lobé, observation des tortues).

**Rationale**: le cahier impose « minimum 2 » et la mention dégressive ; `minimumParticipants` et la pastille de la 008 s'appliquent sans changement.

## 5. Références vérifiées au build

**Decision**: `catalogIssues` vérifie en plus que chaque `serviceId` d'une étape de parcours ou d'une formule (`serviceIds`) désigne une prestation publiée, expérience ou option. Le schéma impose, fichier par fichier : `accommodationType` pour un hébergement, `steps` pour un parcours, `serviceIds` pour une formule.

**Rationale**: FR-PACK-2 et FR-011 : une formule ou un parcours qui citerait une expérience retirée doit faire échouer la construction. C'est le cas de la formule Premium (bateau de plaisance, retiré en 008) et de Découverte (musée d'art).

## 6. Catalogue des îlots et adresses des lignes

**Decision**: `getPageCatalog` publie aussi les hébergements, parcours et formules, chacun avec sa vignette et une adresse : `/hebergements#<id>` (ou `/en/accommodation#<id>`) pour un palier, `/formules#<id>` (ou `/en/packages#<id>`) pour un parcours ou une formule. Chaque carte porte l'`id` correspondant.

**Rationale**: le catalogue doit être complet sur toutes les pages, sinon Mon séjour purgerait les lignes absentes (004, research §4). Le lien de la ligne dans Mon séjour ramène à la carte.

## 7. Îlots

**Decision**:

- paliers et formules : `QuickAdd` existant (valeurs par défaut : 1 nuit, ou ligne sans quantité), avec une option `wide` pour le bouton pleine largeur des formules (écran 07) ;
- parcours : un îlot nouveau, `TourCustomizer` (`client:visible`) : le `QuantityStepper` de la 004 (« Nombre de personnes », minimum 2) et le bouton « Personnaliser ce parcours », qui ajoute la ligne avec le nombre choisi.

**Rationale**: US2 demande de choisir le nombre de personnes avant d'ajouter. `TourCustomizer` n'assemble que des pièces existantes (stepper, `defaultLine`, `add`) ; quelques centaines d'octets.

## 8. Pages et navigation

**Decision**: `accommodation` et `packages` entrent dans `IMPLEMENTED_ROUTES`. Les onglets, la navigation ordinateur, le plan du site et les liens de l'accueil (`SmartLink`) cessent d'ouvrir WhatsApp et mènent aux pages, sans autre changement (mécanisme de la 002). Pages : `src/pages/hebergements.astro`, `src/pages/en/accommodation.astro`, `src/pages/formules.astro`, `src/pages/en/packages.astro`.

La page Tourisme (`ExperiencesPage.astro`) reçoit, après les cartes d'univers, une carte « Parcours Kibreeze » vers `/formules#parcours` (U2).

## 9. Photos

**Decision**:

- hébergements : les aperçus Chambre, Studio et Villa déjà publiés sur l'accueil (`accommodation/*.jpg`, PR n°5), plus une photo d'appartement du lot du 2026-10-06 (`hebergements-franck/`), contrôlée en pleine résolution. Chaque photo de la page porte l'étiquette « Exemple de logement à ce budget » (composant `IllustrativeTag` de la 008, autre libellé) ;
- parcours : la photo de la première étape publiée ;
- formules : la photo d'une de leurs activités, comme sur l'écran 07 (pirogue, cheval, quad) ; la Premium prend l'illustration du bateau de croisière, marquée « Photo illustrative ».

## 10. Textes

Parcours : description, inclus, non inclus et « à savoir » de l'onglet 3 du questionnaire 4, avec la règle de la 008 (pas de phrase réduite à une réserve). Formules : phrase d'accroche de l'écran 07. Hébergements : phrase d'explication de FR-HEB-2, encadré haut de gamme de l'écran 06a. Tout en français et en anglais, anglais relu par Zobel.

## 11. Ce qui ne change pas

Sélection, estimation, message WhatsApp (leurs fonctions pures restent identiques ; seules les données s'ajoutent), Mon séjour, fiches et univers de la 008. Aucune dépendance ajoutée.
