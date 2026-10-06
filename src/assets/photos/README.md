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
| Catégorie Nature & Découverte | `categories/nature-decouverte.jpg` | chutes de la Lobé ; aucune photo ne montre la chute dans l'océan |
| Catégorie Aventure | `categories/aventure.jpg` | jet-ski |
| Catégorie Détente | `categories/detente.jpg` | pirogues sur la plage au soleil couchant ; les deux photos « feux de plage » montrent un pique-nique, pas un feu |
| Excursion en pirogue | `experiences/excursion-en-pirogue.jpg` | |
| Campement Bagyeli | `experiences/campement-bagyeli.jpg` | |
| Bande immersive | `sections/lobe-en-pirogue.jpg` | |
| Qui sommes-nous (accueil) | `sections/kribi-vue-aerienne.jpg` | |
| Qui sommes-nous (Contact) | `sections/kribi-palmiers.jpg` | |
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

## Images générées par Google Stitch (provisoires)

Décision de Zobel du 2026-10-05 : en attendant les photos de Franck, les sujets sans photo prennent l'image générée par Stitch pour les écrans validés. Les liens d'origine de ces images sont privés : elles sont découpées dans les captures validées de `docs/design-exports/`, sans les badges incrustés. À remplacer une à une dès réception des photos (questionnaire `docs/questions-kibreeze-franck-3.xlsx`, onglet Photos).

| Usage | Fichier | Capture d'origine |
|---|---|---|
| Excursion en chaloupe | `stitch/excursion-en-chaloupe.jpg` | `02a-experiences-toutes` |
| Croisière en bateau | `stitch/croisiere-en-bateau.jpg` | `02a-experiences-toutes` |
| Feu de plage | `stitch/feu-de-plage.jpg` | `02a-experiences-toutes` |
| Bateau de plaisance | `stitch/bateau-de-plaisance.jpg` | `02a-experiences-toutes` |

## Limites connues

- **Hébergements.** `hebergement-et-detente/L11-01.jpg` porte un filigrane « © The Tourist Guide » que le tri du 2026-09-25 n'avait pas repéré : renommé `_FILIGRANE` localement le 2026-10-05, jamais utilisé. Les aperçus Chambre, Studio et Villa utilisent depuis le 2026-10-06 les photos de Franck ; `L12-15` et `L12-24` ne sont plus utilisées.
- **Résolution faible** : les originaux font 680 à 1 280 px de large, vraisemblablement compressés par WhatsApp. Suffisant sur téléphone, flou sur grand écran. Demander à Franck les fichiers d'origine.
