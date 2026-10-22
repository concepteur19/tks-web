# Photos du site

Copies réduites (2 400 px de large au plus, JPEG qualité 82, métadonnées retirées) des photos de Franck triées dans `Elements/tri-par-activite/`, dossier ignoré par Git. La correspondance source → destination est dans [sources.json](./sources.json) ; pour réimporter : `npm run photos:import`.

Règles (spec 002, research.md décision 3) :

- Aucune photo `_FILIGRANE` : Kibreeze n'en a pas les droits. Le script les refuse.
- Photos du campement Bagyeli : accord des personnes photographiées obtenu (docs/client-answers.md, 1 quinquies).
- Sujet manquant : paysage de Kribi appartenant à Franck.

Choix du 2026-10-05 :

| Usage | Fichier | Remarque |
|---|---|---|
| Hero de l'accueil, image de partage | `hero/plage-coucher-de-soleil.jpg` | portrait 960 × 1 280 |
| Excursion en pirogue | `experiences/excursion-en-pirogue.jpg` | |
| Campement Bagyeli | `experiences/campement-bagyeli.jpg` | |
| Bande immersive | `sections/lobe-en-pirogue.jpg` | |
| Qui sommes-nous (accueil) | `sections/kribi-vue-aerienne.jpg` | |
| Qui sommes-nous (Contact) | `sections/plage-kribi.jpg` | `ambiance-hero-plages-couchers/L11-06` ; remplace le 2026-10-11 `L12-19` (palmiers), filigrane « The Tourist Guide » non repéré au premier tri |
| Aperçu Chambre | `accommodation/chambre.jpg` | `hebergement-et-detente/L12-15`, voir ci-dessous |
| Aperçu Villa | `accommodation/villa.jpg` | `hebergement-et-detente/L12-24`, voir ci-dessous |

Ajouts du 2026-10-05 (feature 003) :

| Usage | Fichier | Source |
|---|---|---|
| Quad | `experiences/quad.jpg` | `quad/L7-05` |
| Jet-ski | `experiences/jet-ski.jpg` | `jet-ski/L7-08` |
| Kayak | `experiences/kayak.jpg` | `excursion-en-pirogue/L7-04` |
| Paddle | `experiences/paddle.jpg` | `_a-classer_paddle/L6-01` |
| Balade à cheval | `experiences/balade-a-cheval.jpg` | `balade-a-cheval/L7-07` |
| Bandeau de la page Expériences | `sections/bandeau-experiences.jpg` | `chutes-de-la-lobe/L9-11` |
| Galeries | `experiences/*-2.jpg`, `*-3.jpg` | pirogue `L12-02`, `L7-09` ; campement `L12-09`, `L12-08` |

Correction du 2026-10-06 (Franck, relayé par Zobel) : les photos de la petite cascade où l'on se baigne montrent le **jacuzzi naturel**, pas les chutes de la Lobé. Elles sont rangées dans `Elements/tri-par-activite/jacuzzi-naturel/` (`L2-01` à `L2-04`, `L3-01` à `L3-03`, `L10-05` à `L10-07`, `L9-14`).

| Usage | Fichier | Source |
|---|---|---|
| Chutes de la Lobé | `experiences/chutes-de-la-lobe.jpg`, `-2`, `-3` | nouvelles photos du 2026-10-06 (`chutes/`) |
| Jacuzzi naturel | `experiences/jacuzzi-naturel.jpg`, `-2`, `-3` | `jacuzzi-naturel/L2-03`, `L2-01`, `L10-06` |

## Règle de Franck (2026-10-06)

Chaque service affiche **au moins une photo de Franck** quand il en existe une, en première position ; une image Stitch peut compléter la galerie.

Nouvelles photos reçues le 2026-10-06 (`Elements/Images ett vidéos du projet/nouvelles images/`, copiées dans `Elements/tri-par-activite/`) :

| Usage | Fichier | Source |
|---|---|---|
| Croisière, photo principale | `experiences/croisiere-en-bateau.jpg` | `croisiere/L6-08` (photo désignée par Franck) |
| Feu de plage, photo principale | `experiences/feu-de-plage.jpg` | `feux-de-plage/photo_2026-10-06_01-53-03` |
| Aperçu Chambre | `accommodation/chambre.jpg` | `hebergements-franck/photo_2026-10-06_02-14-24` |
| Aperçu Studio | `accommodation/studio.jpg` | `hebergements-franck/photo_2026-10-06_02-14-21` |
| Aperçu Villa | `accommodation/villa.jpg` | `hebergements-franck/villa_photo_2026-10-06_01-21-02` |

Autres photos reçues, gardées pour plus tard : 4 autres photos d'appartement ou studio et 9 autres photos de villa (feature 005), la vue aérienne et le panneau des chutes, 7 photos de voitures TKS® (feature 006, `voitures-tks/`).

Photos retrouvées ou reçues le 2026-10-11 (feature 008, voir `docs/photo-tri.md`, « Réexamen du 2026-10-11 ») ; le lot du jour vient de `Elements/Images ett vidéos du projet/nouvelles images/`, les deux HEIC de `~/Downloads/Telegram Desktop/`, convertis en JPEG par `sips`, tous copiés dans `Elements/tri-par-activite/` :

| Usage | Fichiers | Source |
|---|---|---|
| Village Mayi | `experiences/village-mayi.jpg`, `-2` | `decouverte-de-kribi/L13-05` (pont des Esclaves) ; `-2` : `L13-01` (monument), **provisoire**, filigrane « The Tourist Guide », remise à la demande de Zobel le 2026-10-11 en attendant la photo de Franck |
| Débarcadère de Mboa-Manga | `experiences/debarcadere-de-mboa-manga.jpg` | `decouverte-de-kribi/L1-01`, **provisoire**, filigrane « The Tourist Guide », même décision |
| Plage du village Batanga | `experiences/plage-de-batanga.jpg` | `ambiance-hero-plages-couchers/L11-05` (plage de Kribi, à la demande de Franck) |
| Excursion en chaloupe | `experiences/excursion-en-chaloupe.jpg`, `-2`, `-3` | `chaloupe/photo_2026-10-11_18-56-09`, `18-55-32`, `18-54-10` |
| Feu de plage, galerie | `experiences/feu-de-plage-2.jpg`, `-3` | `feux-de-plage/IMG_2058`, `IMG_2060` |
| Pique-nique et bivouac | `experiences/pique-nique-bivouac.jpg`, `-2` | `pique-nique/photo_2026-10-11_18-56-48`, `feux-de-plage/L11-04` |
| Bouée tractée | `experiences/bouee-tractee.jpg`, `-2` | `bouee-tractee/photo_2026-10-11_18-56-29`, `18-56-16` (`18-56-38`, quasi identique, écartée) |
| Séance photo | `experiences/seance-photo.jpg`, `-2`, `-3` | `seance-photo/photo_2026-10-11_18-56-42`, `18-55-15`, `18-55-09` |
| Quad, galerie | `experiences/quad-2.jpg`, `-3` | `quad/photo_2026-10-11_18-56-55`, `18-55-21` |
| Jet-ski, galerie | `experiences/jet-ski-2.jpg`, `-3` | `jet-ski/photo_2026-10-11_18-55-46`, `18-55-04` |

## Illustrations « Photo illustrative » (feature 008)

À la demande de Franck (questionnaire 4, P9 et P15), les spécialités culinaires et le bateau de croisière en haute mer, faute de photo réelle, affichent une illustration réaliste générée le 2026-10-11 avec l'outil d'images de Figma (`generate_image`, modèle `gemini-3.1-flash-image`, 1 200 × 896 px, forfait Connecteur inc 360). Chaque image porte `illustrative: true` : le site affiche l'étiquette « Photo illustrative ». À remplacer par une photo de Franck dès qu'il en envoie.

Consigne commune : *Realistic documentary food photograph taken in Kribi, Cameroon: [sujet], on a weathered wooden table at a beach restaurant. Natural late-afternoon golden light, warm tones (terracotta, cream, ochre), shallow depth of field, Atlantic ocean and palm trees softly blurred in the background. 35mm lens, authentic and appetizing, not studio lighting. No people, no hands, no text, no logos, no watermark.*

| Fichier | Sujet de la consigne |
|---|---|
| `illustrations/langouste.jpg` | langouste grillée ouverte, citron vert, plantain frit, sauce pimentée |
| `illustrations/poisson-braise.jpg` | poisson entier braisé au charbon, plantain, oignons, sauce pimentée |
| `illustrations/gambas.jpg` | gambas grillées à l'ail et au piment, citron vert |
| `illustrations/crevettes.jpg` | crevettes sautées en sauce tomate pimentée, plantain |
| `illustrations/crabe.jpg` | crabes en sauce tomate pimentée, plantain |
| `illustrations/maban.jpg` | maban : poisson pimenté aux épices, en pot de terre sur feuille de bananier |
| `illustrations/noix-de-coco.jpg` | noix de coco verte ouverte avec une paille |
| `illustrations/grillades-de-plage.jpg` | barbecue sur le sable : brochettes de poisson et de viande, maïs |
| `illustrations/degustation-fruits-de-mer.jpg` | plateau de fruits de mer à partager sur la plage |
| `illustrations/repas-local.jpg` | repas camerounais sous une paillote de village (poisson en sauce, légumes, manioc, plantain, bâton de manioc) |
| `illustrations/chambre-15000.jpg` … `villa-150000.jpg` | une illustration par palier d'hébergement (005), de la chambre simple à la villa avec piscine, consigne d'intérieur ou d'extérieur « real-estate style », sans personne ; marquées « Exemple de logement à ce budget · photo illustrative » |
| `illustrations/croisiere-en-haute-mer.jpg` | bateau de croisière blanc en mer au large de la côte de Kribi (consigne de voyage, sans nourriture) |

Photo d'équipe (2026-10-21) : `illustrations/equipe.jpg`, bloc « Qui sommes-nous » de l'accueil, à la place de `sections/kribi-vue-aerienne.jpg`. Illustration fournie par Zobel : l'équipe en t-shirts rouges Kibreeze, redessinée d'après la photo d'équipe en t-shirts « Trip Master » (pas le temps de refaire la photo). Recadrée en 4:3 (768 × 576, lignes 395 à 971 de l'original 768 × 1 376), étiquetée « Illustration ». À remplacer par une vraie photo de l'équipe en tenue Kibreeze.

## Retours de Franck (feature 010)

Contrôlées en pleine résolution le 2026-10-18, sans filigrane. Provisoires : Franck choisira lui-même (questionnaire 7, onglets Photos et Diaporama).

| Usage | Fichier | Source | Remarque |
|---|---|---|---|
| Diaporama de l'accueil, photo 2 | `hero/kribi-2.jpg` | `ambiance-hero-plages-couchers/L11-10` | Franck sur une pirogue, plage |
| Diaporama, photo 3 | `hero/kribi-3.jpg` | `ambiance-hero-plages-couchers/L11-05` | plage au soleil |
| Diaporama, photo 4 | `hero/kribi-4.jpg` | `chutes-de-la-lobe/L10-10` | chutes, sans personne |
| Aperçu Appartement (accueil) | `accommodation/appartement.jpg` | `hebergements-franck/photo_2026-10-06_02-14-35` | salle à manger et salon |

`chutes-de-la-lobe/L9-15` (Franck en gilet aux chutes) n'est pas dans le diaporama : son visage tomberait sous le titre du hero.

## Port Autonome de Kribi (2026-10-22)

Cinq photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/port-autonome-de-kribi/`. Elles remplacent la vue aérienne de la côte, sans filigrane ni personne identifiable.

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/port-autonome-de-kribi.jpg` | `plage-pirogues-et-port` (photo désignée par Zobel) |
| Galerie | `experiences/port-autonome-de-kribi-2.jpg` … `-5.jpg` | `portiques`, `kribi-conteneurs-terminal`, `navire-au-large`, `panneau-deep-sea-port` |

## Village Ebodjé (2026-10-22)

Quatre photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/village-ebodje/`. Elles remplacent la vue aérienne de la côte. Petites (600 à 1 074 px de large) : à remplacer par des photos de Franck en meilleure définition.

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/village-ebodje.jpg` | `tortue-luth` |
| Galerie | `experiences/village-ebodje-2.jpg` … `-4.jpg` | `plage-rochers`, `musee-des-tortues`, `plage-cocotiers` |

## Musée d'art de Grand Batanga, Luma (2026-10-22)

Page renommée le 2026-10-22 « Musée d'art de Grand Batanga (Luma) », comme sur le panneau (« Musée Batanga » avant) ; l'identifiant `musee-batanga` ne change pas.

Quatre photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/musee-batanga/`. Elles remplacent la vue aérienne de la côte. Petites (720 px de large) : à remplacer par des photos de Franck en meilleure définition.

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/musee-batanga.jpg` | `batiment` |
| Galerie | `experiences/musee-batanga-2.jpg` … `-4.jpg` | `panneau`, `leopard`, `tortue` |

## Photos mises en avant (2026-10-22)

Trois photos envoyées par Zobel le 2026-10-22 « à mettre en avant » : chacune devient la photo principale de sa page, les photos précédentes passent en galerie.

| Page | Fichier | Source |
|---|---|---|
| Campement Bagyeli | `experiences/campement-bagyeli-4.jpg` | `_a-classer_village-bagyeli/couple-en-foret` |
| Port Autonome de Kribi | `experiences/port-autonome-de-kribi-6.jpg` | `port-autonome-de-kribi/vue-aerienne` |
| Village Ebodjé | `experiences/village-ebodje-5.jpg` | `village-ebodje/tortues-sur-la-plage` |

Les trois sont aussi les photos 5 à 7 du diaporama de l'accueil, après `hero/kribi-4.jpg`. Ce sont des photos paysage dans un cadre portrait sur téléphone : `Hero.astro` les recadre une par une (`object-position`) pour garder le sujet visible.

## Hôtel Golden K (2026-10-22)

Deux photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/hotel-golden-k/`. Elles remplacent la vue aérienne de la côte.

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/hotel-golden-k.jpg` | `piscine-et-facade` |
| Galerie | `experiences/hotel-golden-k-2.jpg` | `escalier-et-facade` |

## Bateau de croisière en haute mer (2026-10-22)

Trois photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/croisiere-en-haute-mer/`. Elles remplacent l'illustration générée sur la page du service, qui perd son étiquette « Photo illustrative ». La Formule Premium prend aussi la photo principale (accord de Zobel le 2026-10-22) : l'illustration `illustrations/croisiere-en-haute-mer.jpg` n'est plus utilisée.

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/croisiere-en-haute-mer.jpg` | `bateau-a-quai` |
| Galerie | `experiences/croisiere-en-haute-mer-2.jpg`, `-3.jpg` | `marina-toits-bleus`, `marina-ponton` |

## Ebanjea (2026-10-22)

Deux photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/ebanjea/`. Elles remplacent la photo de la côte marquée « Photo à venir ».

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/ebanjea.jpg` | `assiette` |
| Galerie | `experiences/ebanjea-2.jpg` | `marmite` |

## Maban (2026-10-22)

Deux photos envoyées par Zobel le 2026-10-22, rangées dans `Elements/tri-par-activite/maban/`. Elles remplacent la photo de la côte marquée « Photo à venir » : plus aucun plat n'attend sa photo.

| Usage | Fichier | Source |
|---|---|---|
| Photo principale | `experiences/maban.jpg` | `poisson-en-main` |
| Galerie | `experiences/maban-2.jpg` | `poissons-epices` |

## Véhicules TKS® (feature 006)

Photos des cinq véhicules envoyées par Franck le 2026-10-06 (`voitures-tks/`). Les plaques d'immatriculation sont floutées **à l'import** : l'entrée de `sources.json` donne les zones à flouter (`blur`, fractions de l'image après rotation), si bien qu'un réimport ne republie jamais une plaque lisible. Contrôlées en pleine résolution le 2026-10-17, plaques des taxis en arrière-plan comprises.

| Usage | Fichier | Source | Zones floutées |
|---|---|---|---|
| Luxe (Land Cruiser Prado TXL), chauffeur privé | `mobility/luxe.jpg` | `photo_2026-10-06_06-34-19` | plaque avant |
| Luxe (Land Cruiser), location avec chauffeur | `mobility/luxe-2.jpg` | `photo_2026-10-06_06-34-25` | plaque avant |
| Premium (RAV4, arrière), prestations professionnelles | `mobility/premium.jpg` | `photo_2026-10-06_06-34-13` | plaque arrière |
| Premium (Avensis), transferts | `mobility/premium-2.jpg` | `photo_2026-10-06_06-33-08` | plaque avant, deux taxis en arrière-plan |
| Yaris | `mobility/yaris.jpg` | `photo_2026-10-06_06-34-31` | plaque avant |

Non publiées : Avensis vue de l'arrière (`06-33-27`), RAV4 vu de l'avant (`06-33-48`).

## Images générées par Google Stitch (provisoires)

Décision de Zobel du 2026-10-05 : en attendant les photos de Franck, les sujets sans photo prennent l'image générée par Stitch pour les écrans validés. Les liens d'origine de ces images sont privés : elles sont découpées dans les captures validées de `docs/design-exports/`, sans les badges incrustés. À remplacer une à une dès réception des photos (questionnaire `docs/questions-kibreeze-franck-3.xlsx`, onglet Photos).

| Usage | Fichier | Capture d'origine |
|---|---|---|
| Croisière en bateau | `stitch/croisiere-en-bateau.jpg` | `02a-experiences-toutes` |
| Bateau de plaisance | `stitch/bateau-de-plaisance.jpg` | `02a-experiences-toutes` |

## Limites connues

- **Hébergements.** `hebergement-et-detente/L11-01.jpg` porte un filigrane « © The Tourist Guide » que le tri du 2026-09-25 n'avait pas repéré : renommé `_FILIGRANE` localement le 2026-10-05, jamais utilisé. Les aperçus Chambre, Studio et Villa utilisent depuis le 2026-10-06 les photos de Franck ; `L12-15` et `L12-24` ne sont plus utilisées.
- **Résolution faible** : les originaux font 680 à 1 280 px de large, vraisemblablement compressés par WhatsApp. Suffisant sur téléphone, flou sur grand écran. Demander à Franck les fichiers d'origine.

- **Filigranes manqués** (contrôle du 2026-10-11) : `L12-19`, `L14-02`, `L13-01`, `L1-01` et `L14-01` portent « © The Tourist Guide » en petit, au milieu de l'image ; le tri du 2026-09-25 ne les avait pas vus. Toute nouvelle photo du lot du 2026-09-25 se contrôle en pleine résolution avant import. Détail : `docs/photo-tri.md`.
