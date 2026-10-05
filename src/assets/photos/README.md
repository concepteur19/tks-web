# Photos du site

Copies réduites (2 400 px de large au plus, JPEG qualité 82, métadonnées retirées) des photos de Franck triées dans `Elements/tri-par-activite/`, dossier ignoré par Git. La correspondance source → destination est dans [sources.json](./sources.json) ; pour réimporter : `npm run photos:import`.

Règles (spec 002, research.md décision 3) :

- Aucune photo `_FILIGRANE` : Kibreeze n'en a pas les droits. Le script les refuse.
- Photos du campement Bagyeli : accord des personnes photographiées relayé par Zobel le 2026-10-04 (docs/client-answers.md, 1 quinquies).
- Sujet manquant : paysage de Kribi appartenant à Franck.

Choix du 2026-10-05 :

| Usage | Fichier | Remarque |
|---|---|---|
| Hero de l'accueil, image de partage | `hero/plage-coucher-de-soleil.jpg` | portrait 960 × 1 280 |
| Catégorie Nature & Découverte | `categories/nature-decouverte.jpg` | chutes de la Lobé ; aucune photo ne montre la chute dans l'océan |
| Catégorie Aventure | `categories/aventure.jpg` | jet-ski |
| Catégorie Détente | `categories/detente.jpg` | pirogues sur la plage au soleil couchant ; les deux photos « feux de plage » montrent un pique-nique, pas un feu |
| Chutes de la Lobé | `experiences/chutes-de-la-lobe.jpg` | |
| Excursion en pirogue | `experiences/excursion-en-pirogue.jpg` | |
| Croisière en bateau | `experiences/croisiere-en-bateau.jpg` | coucher de soleil en mer : la seule photo de croisière (`croisiere/L6-08.jpg`) est inutilisable |
| Campement Bagyeli | `experiences/campement-bagyeli.jpg` | |
| Bande immersive | `sections/lobe-en-pirogue.jpg` | |
| Qui sommes-nous (accueil) | `sections/kribi-vue-aerienne.jpg` | |
| Qui sommes-nous (Contact) | `sections/kribi-palmiers.jpg` | |

## Limites connues

- **Hébergements : aucune photo utilisable.** `hebergement-et-detente/L11-01.jpg` porte un filigrane « © The Tourist Guide » que le tri du 2026-09-25 n'avait pas repéré (renommé `_FILIGRANE` localement le 2026-10-05) ; `L12-15` et `L12-24` sont de la même série et ne sont pas utilisées par prudence. Les cartes d'hébergement de l'accueil sont des blocs de couleur en attendant les photos par budget promises par Franck (L1).
- **Résolution faible** : les originaux font 680 à 1 280 px de large, vraisemblablement compressés par WhatsApp. Suffisant sur téléphone, flou sur grand écran. Demander à Franck les fichiers d'origine.
