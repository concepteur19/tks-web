# Contrat — interface

Référence : écran validé [08](../../../docs/design-exports/08-tks-mobilite.jpg), avec une différence voulue : la location de véhicules y était « Sur devis », elle montre désormais les trois catégories chiffrées (spec, contexte). Tout passe par les tokens (principe VI).

## Page Mobilité (`/mobilite`, `/en/mobility`)

Sobre (FR-002) : ni bandeau photo, ni carte d'expérience ; en-tête et pied de page Kibreeze inchangés.

1. En-tête : logo TKS® (`assets/brand/tks-mark.png`), titre `mobility.title`, phrase `mobility.tagline`, mention `mobility.brand` en petit.
2. Section `id="vehicules"`, titre `mobility.vehicles.title`. Une rangée par catégorie, dans l'ordre Luxe, Premium, Yaris (`data-testid="vehicle-category"`, `id` = identifiant) : petite photo (vignette carrée, pas pleine largeur), nom, modèles séparés par des virgules, « À partir de X FCFA / jour », équivalent en euros, puis l'îlot `LineCustomizer` (`client:visible`). Sous la liste, `mobility.vehicles.note`.
3. Section `id="services"`, titre `mobility.services.title`. Liste compacte (`data-testid="mobility-service"`, `id` = identifiant) : petite photo, nom, phrase, « Sur devis », `QuickAdd`.
4. Encadré `mobility.custom.*` avec bouton WhatsApp (message générique), en fin de page (FR-003).
5. Bouton WhatsApp flottant.

L'ajout affiche le message de confirmation de la 004.

Sans JavaScript (FR-011) : sous chaque îlot, un `<noscript>` offre un lien WhatsApp `mobility.request` dont le message (`mobility.requestMessage`) nomme la prestation.

Une colonne à 360 px ; à partir de `lg`, les catégories de véhicules en grille de trois.

## Îlot `LineCustomizer` (remplace `TourCustomizer`)

Props : `service`, `locale`, `title`, `buttonLabel`. Un `QuantityStepper` par dimension de la règle de quantité, borné par `min` et `max`, initialisé à `default` ; libellés `detail.dimension.<kind>` (`detail.dimension.units` avec le libellé de la dimension : « Nombre de véhicules »). Le bouton ajoute `{ ...defaultLine(service), quantities }` ; un second ajout suit la fusion de la 004. `aria-label` du bouton : `<buttonLabel> : <title>`. `data-testid="line-customizer"`.

`TourCard.astro` l'utilise avec `buttonLabel = packages.customise` ; le comportement du parcours ne change pas.

## Accueil

Le bandeau TKS® (`MobilityStrip.astro`) mène à la page par `SmartLink`, sans modification du composant.

## Navigation

`mobility` dans `IMPLEMENTED_ROUTES` : l'entrée « Mobilité TKS® » de la navigation ordinateur, le plan du site et le pied de page mènent à la page. Barre à onglets du téléphone inchangée (cinq onglets).
