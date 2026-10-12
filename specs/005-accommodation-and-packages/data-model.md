# Data Model — 005 Hébergements, formules et parcours

**Feature**: [spec.md](./spec.md) · Décisions : [research.md](./research.md) · Schémas : [contracts/content.md](./contracts/content.md)

## Schéma de prestation : ajouts

| Champ | Type | Règle |
|---|---|---|
| `section` | enum | gagne `parcours` |
| `accommodationType` | `chambre` \| `studio` \| `appartement` \| `villa` | obligatoire si `section: hebergement`, interdit sinon |
| `steps` | `{ label: { fr, en }, serviceId?: string }[]` | obligatoire (2 étapes au moins) si `section: parcours`, interdit sinon |
| `serviceIds` | `string[]` | obligatoire (2 au moins) si `section: formule`, interdit sinon |
| `badge` | `{ fr, en }` | facultatif : étiquette de carte (« Le plus complet ») |
| unité de prix | enum | gagne `per_couple` (« / 2 personnes ») |

`categoryId` reste réservé aux expériences.

## Hébergements (`section: hebergement`)

Prix `{ kind: "from", unit: "per_night" }`, quantité `nights` 1 à 30, défaut 1.

| Identifiant | Type | Prix de départ / nuit | Capacité | Ordre | Photo |
|---|---|---|---|---|---|
| `chambre-15000` | chambre | 15 000 | 1 à 2 | 10 | `accommodation/chambre.jpg` |
| `studio-30000` | studio | 30 000 | 2 à 3 | 20 | `accommodation/studio.jpg` |
| `appartement-35000` | appartement | 35 000 | 2 à 6 | 30 | `accommodation/appartement.jpg` (nouvelle) |
| `appartement-50000` | appartement | 50 000 | 2 à 6 | 31 | idem |
| `appartement-100000` | appartement | 100 000 | 2 à 6 | 32 | idem |
| `villa-150000` | villa | 150 000 | 6 à 12 | 40 | `accommodation/villa.jpg` |

Titre (ligne de séjour et message) : « Chambre, à partir de 15 000 FCFA la nuit » / « Room, from 15,000 FCFA a night », sur ce modèle pour chaque palier. Pas de haut de gamme chiffré : encadré WhatsApp.

## Parcours (`section: parcours`)

Quantité `persons` 2 à 20, défaut 2. Un parcours chiffré : `{ kind: "from", unit: "per_person" }`, `degressive: true`.

| Ordre | Identifiant | Nom | Étapes (`serviceId` ou texte) | Prix |
|---|---|---|---|---|
| 10 | `essentiel-de-kribi` | L'Essentiel de Kribi | `chutes-de-la-lobe`, `campement-bagyeli`, `village-mayi`, `plage-de-batanga` | from 30 000 |
| 20 | `nature-et-littoral` | Kribi Nature & Littoral | `chutes-de-la-lobe`, « Fleuve Lobé », `campement-bagyeli`, `plage-de-batanga` | from 25 000 |
| 30 | `culture-et-patrimoine` | Kribi Culture & Patrimoine | `village-mayi`, `musee-batanga`, `debarcadere-de-mboa-manga` | from 10 000 |
| 40 | `kribi-et-ebodje` | Kribi & Ebodjé | « Kribi », `village-ebodje`, « Observation des tortues selon la période », « Retour » | quote |
| 50 | `kribi-authentique` | Kribi Authentique | `campement-bagyeli`, `village-mayi`, « Village Batanga », `debarcadere-de-mboa-manga` | from 25 000 |
| 60 | `au-fil-de-l-eau` | Kribi au fil de l'eau | `chutes-de-la-lobe`, `excursion-en-pirogue` (« Excursion sur le fleuve Lobé »), `plage-de-batanga` | quote |

« Village Batanga » reste du texte : ni la plage ni le musée de Batanga ne le recouvrent exactement. L'excursion sur le fleuve Lobé renvoie à la pirogue, la sortie de Kibreeze sur ce fleuve.

## Formules (`section: formule`)

Prix `{ kind: "fixed", unit: "per_couple" }`, aucune dimension.

| Ordre | Identifiant | Nom | `serviceIds` | Prix | Photo |
|---|---|---|---|---|---|
| 10 | `formule-decouverte` | Formule Découverte | `chutes-de-la-lobe`, `excursion-en-pirogue`, `campement-bagyeli`, `musee-batanga`, `guide-touristique` | 100 000 | pirogue |
| 20 | `formule-evasion` | Formule Évasion | `chutes-de-la-lobe`, `excursion-en-pirogue`, `kayak`, `balade-a-cheval`, `jacuzzi-naturel` | 120 000 | balade à cheval |
| 30 | `formule-aventure` | Formule Aventure | `chutes-de-la-lobe`, `excursion-en-pirogue`, `quad`, `jet-ski`, `kayak`, `balade-a-cheval` | 150 000 | quad |
| 40 | `formule-premium` | Formule Premium, badge « Le plus complet » | `chutes-de-la-lobe`, `excursion-en-chaloupe`, `croisiere-en-haute-mer`, `quad`, `jet-ski`, `kayak`, `balade-a-cheval`, `jacuzzi-naturel` | 300 000 | illustration du bateau de croisière |

Musée d'art → `musee-batanga` (Q3) ; bateau de plaisance → `croisiere-en-haute-mer` (Q2). Prix de la Premium à faire confirmer par Franck.

## Totaux

16 prestations nouvelles : 6 paliers, 6 parcours, 4 formules. Le catalogue publie 32 expériences, 2 options et ces 16.

## Cas de référence (tests)

| Cas | Attendu |
|---|---|
| `studio-30000`, 3 nuits | 90 000 FCFA, total « estimatif » |
| `appartement-35000` et `appartement-50000` ajoutés | deux lignes |
| `studio-30000` ajouté deux fois (1 puis 4 nuits) | une ligne, 4 nuits (durée remplacée, 004) |
| `essentiel-de-kribi`, 4 personnes | 120 000 FCFA, « à partir de » |
| `essentiel-de-kribi`, bouton « moins » à 2 | désactivé |
| `kribi-et-ebodje`, 3 personnes | ligne sur devis, hors total |
| `formule-evasion` ajoutée deux fois | une ligne, « Déjà dans mon séjour » |
| Formule qui référence `bateau-de-plaisance` | erreur au build |
| Étape de parcours vers une prestation inconnue | erreur au build |
| Message d'un séjour studio 3 nuits + Essentiel 4 + Évasion | « Studio, à partir de 30 000 FCFA la nuit — 3 nuits », « L'Essentiel de Kribi — 4 personnes », « Formule Évasion » |
