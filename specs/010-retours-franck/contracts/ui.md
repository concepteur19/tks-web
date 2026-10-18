# Contrat — interface

Décisions : [research.md](../research.md). Valeurs : [data-model.md](../data-model.md). Tokens et règles de mouvement de la 009.

## Fiche de parcours (`/formules/<id>`, `/en/packages/<id>`)

1. Fil d'Ariane : Formules › nom du parcours.
2. Photo (cadrage `focus`), titre, durée (si définie), description.
3. Étapes numérotées dans l'ordre, liées à la fiche de l'étape quand elle existe.
4. Tarif (`Price`) : « À partir de X FCFA / personne » ou « Tarif sur demande » ; pastille « Minimum 2 personnes » ; mention dégressive ; `packages.tours.indicative` ; `packages.tours.finalPrice`.
5. Îlot `TourActions` (`client:visible`) : sélecteur « Nombre de personnes » (départ : voyageurs du séjour, sinon défaut du parcours), bouton « Ajouter à mon séjour » (`data-guide="add"`), lien « Personnaliser ce parcours » vers WhatsApp (message `buildTourRequestMessage`). `data-testid="tour-actions"`. Sans JavaScript : le lien WhatsApp seul.
6. Métadonnées : titre, description, image de partage = photo du parcours.

Page Formules : la photo et le titre d'une `TourCard` mènent à la fiche (`data-testid="tour-link"`).

## Accueil

- **Hero** : première photo dans la page, photos 2 à 4 dans un `<template>` insérées à la première interaction (démarrage du défilement) ; une seule visible (`data-active`) ; fondu `--duration-slow` ; bouton Pause / Lecture (`aria-pressed`, `data-testid="hero-pause"`), dans le coin du hero, au-dessus de l'indication de défilement ; aucun défilement sous réduire les animations ni onglet caché.
- **Aperçu Hébergements** : 4 cartes (chambre, studio, appartement, villa).
- **Aperçu Mobilité** (`MobilityTeaser`, `data-section="mobility"`) : logo TKS®, titre `home.mobility.title`, phrase, 3 cartes (photo carrée ou 4:3, nom, modèles, prix par jour), lien `home.mobility.cta` vers la page ; même gabarit que l'aperçu Hébergements.

## Mon séjour

- Champs **Arrivée** et **Départ** (`type="date"`, libellés `stay.arrival`, `stay.departure`, `min` du départ = arrivée) à la place du champ texte.
- Au-dessus du sélecteur d'une dimension `persons` : libellé `stay.personsForActivity`.

## Fiches d'expérience

- Galerie : chaque photo est un lien vers l'image en grand ; ouverture dans un `<dialog>` (`data-testid="lightbox"`), fond sombre, image entière, bouton Fermer (`lightbox.close`), Échap et clic hors de l'image ferment ; le focus revient à la photo.
- Étiquette `experiences.upcoming` (« Photo à venir ») pour une image `upcoming`.

## Cadrage

Toute image recadrée (`object-cover`) applique `object-position: <focus>` quand il est défini.
