# Contrat — interface

Référence : écrans validés [06a](../../../docs/design-exports/06a-hebergements.jpg), [06b](../../../docs/design-exports/06b-hebergements-ajout-confirme.jpg), [07](../../../docs/design-exports/07-formules.jpg) ; carte de parcours : illustration du cahier (page 6). Tout passe par les tokens (principe VI).

## Page Hébergements (`/hebergements`, `/en/accommodation`)

1. Bandeau : photo de villa, titre `accommodation.title`, phrase `accommodation.tagline`.
2. Encadré d'explication `accommodation.intro` (filet d'accent à gauche, fond `bg-muted`), avant tout palier.
3. Une carte par type, dans l'ordre chambre, studio, appartement, villa : photo (étiquette `accommodation.example`), nom du type, capacité ; puis une rangée par palier : « À partir de X FCFA / nuit », équivalent en euros, inclus éventuel, bouton `QuickAdd` (« Ajouter »). `id` de la rangée = identifiant du palier. `data-testid="accommodation-type"`.
4. Mention `detail.priceNote`.
5. Encadré sombre « Plus grand, plus haut de gamme ? » avec bouton WhatsApp, **après** tous les paliers. Aucun montant haut de gamme avant.
6. Bouton WhatsApp flottant.

L'ajout affiche le message de confirmation de la 004 (écran 06b).

Vocabulaire (FR-007) : « nous réservons », « Kibreeze réserve » ; jamais « propriétaire », « mise en relation », « contacter l'hôte ».

Sans JavaScript : sous chaque `QuickAdd`, un `<noscript>` offre un lien WhatsApp « Demander ce logement » (`accommodation.request`) dont le message nomme le palier. Même principe sur les cartes de parcours et de formules (`packages.request`).

## Page Formules (`/formules`, `/en/packages`)

1. Bandeau : titre `packages.title`, phrase `packages.tagline`.
2. Section `id="parcours"`, titre `packages.tours.title`. Une carte par parcours (`data-testid="tour-card"`, `id` = identifiant) : photo, nom, étapes numérotées dans l'ordre (lien vers la fiche quand elle existe), « À partir de X FCFA / personne » ou « Sur devis », pastille « Minimum 2 personnes », mention dégressive, note `packages.tours.note` (sur chaque carte, comme l'exige le cahier, page 6), puis l'îlot `TourCustomizer`.
3. Section `id="formules"`, titre `packages.activities.title`, mention `packages.base`. Une carte par formule (`data-testid="package-card"`, `id` = identifiant) : photo, nom, badge éventuel, liste cochée de ses prestations (liens vers les fiches), « X FCFA / 2 personnes », euro, `QuickAdd` pleine largeur (« Ajouter à mon séjour »).
4. Encadré `packages.groups.*` avec bouton WhatsApp.

## Îlot `TourCustomizer` (`client:visible`)

`QuantityStepper` « Nombre de personnes » (bornes de la dimension, minimum 2) et bouton `packages.customise`, qui ajoute la ligne `{ serviceId, quantities: [n] }` ; message de confirmation de la 004. Un second ajout suit la règle de fusion de la 004, comme depuis une fiche : personnes additionnées, plafonnées au maximum de la dimension ; le visiteur ajuste ensuite dans Mon séjour. `data-testid="tour-customizer"`.

## `QuickAdd`

Prop facultative `wide` : bouton pleine largeur, libellé `stay.add` (« Ajouter à mon séjour ») au lieu de `stay.addShort`.

## Page Tourisme (`ExperiencesPage.astro`)

Après les cartes d'univers : carte « Parcours Kibreeze » (`experiences.toursEntry.*`), lien vers `/formules#parcours`. `data-testid="tours-entry"`.

## Accueil

L'aperçu Hébergements de l'accueil (`AccommodationTeaser.astro`) lit ses prix dans les paliers (`getAccommodation()`, plus petit palier de chaque type) au lieu de `src/content/site/home.json` : une seule source pour les prix. `home.json` ne garde que les photos et textes de l'aperçu.

## Navigation

`accommodation` et `packages` dans `IMPLEMENTED_ROUTES` : onglets Hébergements et Formules, navigation ordinateur, plan du site ; les liens `SmartLink` de l'accueil vers ces pages cessent d'ouvrir WhatsApp.
