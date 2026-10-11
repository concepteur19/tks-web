# Data Model — 008 Les trois univers du Tourisme

**Feature**: [spec.md](./spec.md) · Décisions : [research.md](./research.md) · Schémas : [contracts/content.md](./contracts/content.md)

## Univers (collection `categories`)

| Champ | Type | Règle |
|---|---|---|
| `name` | `{ fr, en }` | obligatoire |
| `description` | `{ fr, en }` | phrase de présentation du cahier, section 3 ; devient obligatoire |
| `slug` | `{ fr, en }` | **nouveau**, obligatoire ; minuscules, chiffres, tirets ; unique par langue ; jamais égal à un identifiant de prestation |
| `order` | entier | ordre d'affichage |
| `image` | `{ src, alt }` | photo de la carte et du bandeau |
| `withOptions` | booléen | **nouveau**, facultatif, `true` par défaut ; `false` : aucune option sur les fiches de l'univers |

| Fichier | Nom FR / EN | Slug FR / EN | Ordre | Options |
|---|---|---|---|---|
| `visites.json` | Visites & Découvertes / Visits & Discoveries | `visites` / `visits` | 10 | oui |
| `activites.json` | Activités & Loisirs / Activities & Leisure | `activites` / `activities` | 20 | oui |
| `specialites-culinaires.json` | Spécialités culinaires / Local Food | `specialites-culinaires` / `local-food` | 30 | non |

Phrases (cahier, section 3) : « Explorer les lieux, paysages, villages, patrimoines et sites de Kribi. » · « Vivre des expériences entre mer, nature, aventure et détente. » · « Découvrir les saveurs et spécialités de la côte. »

Supprimés : `nature-decouverte.json`, `aventure.json`, `detente.json`.

## Prestation (collection `services`) : ce qui change

| Champ | Changement |
|---|---|
| `categoryId` | pointe vers un univers ; obligatoire pour toute prestation publiée hors options (contrôle au build) |
| `degressive` | **nouveau**, booléen facultatif : affiche la mention « tarif dégressif » sur la fiche |
| `conditions.included` | porte les lieux inclus d'une visite (Village Mayi, Village Bagyeli) |
| minimum de participants | pas de champ : borne `min` de la dimension `persons` ([research.md](./research.md) §6) |

## Catalogue

Unités et dimensions existantes uniquement ([research.md](./research.md) §9). « persons info » : dimension `persons` informative (prix de groupe ou sur demande), qui ne multiplie pas le prix.

### Visites & Découvertes (`visites`)

| Ordre | Identifiant | Nom FR | Prix | Quantité | Dégressif | État |
|---|---|---|---|---|---|---|
| 10 | `chutes-de-la-lobe` | Chutes de la Lobé | fixed 5 000 `per_person` | persons 1–20, déf. 2 | | univers changé |
| 20 | `campement-bagyeli` | Village Bagyeli | **from 15 000 `per_person`** | persons **2**–20, déf. 2 | oui | tarifs supprimés ; inclus : fleuve Lobé, campement, pont Lobé |
| 30 | `village-mayi` | Village Mayi | fixed 5 000 `per_person` | persons 1–20, déf. 2 | oui | nouveau ; inclus : pont de l'Esclavage, pont des Enclaves, phare, monument |
| 40 | `village-ebodje` | Village Ebodjé et tortues marines | quote | persons info, déf. 2 | | nouveau |
| 50 | `port-autonome-de-kribi` | Port Autonome de Kribi | quote | persons info, déf. 2 | | nouveau |
| 60 | `hotel-golden-k` | Hôtel Golden K | from 5 000 `per_person` | persons 1–20, déf. 2 | oui | nouveau |
| 70 | `plage-de-batanga` | Plage du village Batanga | from 5 000 `per_person` | persons 1–20, déf. 2 | oui | nouveau |
| 80 | `musee-batanga` | Musée Batanga | fixed 2 000 `per_person` | persons 1–20, déf. 2 | | nouveau |
| 90 | `debarcadere-de-mboa-manga` | Débarcadère de Mboa-Manga | fixed 2 000 `per_person` | persons 1–20, déf. 2 | | nouveau |

### Activités & Loisirs (`activites`)

| Ordre | Identifiant | Nom FR | Prix | Quantité | État |
|---|---|---|---|---|---|
| 10 | `quad` | Quad | fixed 10 000 `per_session` | units « sessions » 1–10, déf. 1 | univers changé |
| 20 | `jet-ski` | Jet-ski | **fixed 10 000 `per_session`** | units « sessions » 1–10, déf. 1 | prix fixé ; mis en avant |
| 30 | `kayak` | Kayak | fixed 10 000 `per_person` | inchangée | univers changé |
| 40 | `paddle` | Paddle | fixed 10 000 `per_person` | inchangée | univers changé |
| 50 | `balade-a-cheval` | Balade à cheval | fixed 5 000 `per_person` | inchangée | univers changé |
| 60 | `excursion-en-chaloupe` | Excursion en chaloupe | fixed 65 000 `per_group`, max 8 | inchangée | univers changé |
| 70 | `excursion-en-pirogue` | Excursion en pirogue | fixed 35 000 `per_group`, max 8 | inchangée | univers changé |
| 80 | `croisiere-en-haute-mer` | Bateau de croisière en haute mer | fixed 150 000 `per_hour` | hours 1–8, déf. 1 | nouveau |
| 90 | `jacuzzi-naturel` | Jacuzzi naturel | fixed 5 000 `per_person` | inchangée | univers changé |
| 100 | `feu-de-plage` | Feu de camp / feu de plage | fixed 50 000 `per_group`, **max 10** | **persons info 1–30, déf. 2** | capacité ajoutée |
| 110 | `seance-photo` | Séance photo à Kribi | from 10 000 `per_person` | persons 1–20, déf. 2 | nouveau |
| 120 | `pique-nique-bivouac` | Pique-nique et bivouac en bord de mer | quote | persons info, déf. 2 | nouveau |
| 130 | `bouee-tractee` | Bouée tractée | fixed 10 000 `per_session` | units « sessions » 1–10, déf. 1 | nouveau |

### Spécialités culinaires (`specialites-culinaires`)

Toutes : `pricing: { kind: "quote" }`, quantité persons info 1–30, déf. 2 [HYPOTHÈSE U6], aucune option (`withOptions: false`).

| Ordre | Identifiant | Nom FR |
|---|---|---|
| 10 | `poisson-braise` | Poisson frais ou braisé |
| 20 | `gambas` | Gambas |
| 30 | `crevettes` | Crevettes |
| 40 | `crabe` | Crabe |
| 50 | `langouste` | Langouste |
| 60 | `maban` | Maban, poisson pimenté |
| 70 | `noix-de-coco` | Noix de coco fraîche à boire |
| 80 | `grillades-de-plage` | Grillades et barbecue de plage |
| 90 | `degustation-fruits-de-mer` | Dégustation de fruits de mer en bord de mer |
| 100 | `repas-local` | Expérience de repas local |

### Désactivées [HYPOTHÈSE Q1, Q2]

| Identifiant | Avant | Après |
|---|---|---|
| `croisiere-en-bateau` | 25 000 `per_person`, mise en avant | `availability: "disabled"`, plus mise en avant |
| `bateau-de-plaisance` | quote | `availability: "disabled"` |

### Options (inchangées)

`guide-touristique`, `maitre-nageur`, `musee-d-art` [HYPOTHÈSE Q3] : proposées sur les univers `visites` et `activites`.

## Totaux

- 32 prestations publiées : 9 + 13 + 10. 21 nouvelles, 11 existantes déplacées, 2 désactivées.
- 4 mises en avant : chutes de la Lobé, Village Bagyeli, excursion en pirogue, jet-ski.

## Cas de référence (tests)

| Cas | Attendu |
|---|---|
| Ajout rapide du Village Bagyeli | ligne à 2 personnes, 30 000 FCFA, total « estimatif » (prix « à partir de ») |
| Sélecteur du Village Bagyeli à 2, bouton « moins » | désactivé |
| Séjour enregistré avec `campement-bagyeli` au tarif `couple` | ligne retirée au chargement, message de la 004 |
| Séjour enregistré avec `croisiere-en-bateau` | ligne retirée au chargement, message de la 004 |
| Feu de plage pour 12 personnes | ligne « sur devis » (au-delà de 10) |
| Bateau de croisière, 2 heures | 300 000 FCFA |
| Jet-ski, 2 sessions | 20 000 FCFA |
| Langouste pour 4 | ligne sur demande, « 4 personnes » dans le message, hors total |
| `minimumParticipants(campement-bagyeli)` | 2 ; `minimumParticipants(chutes-de-la-lobe)` : `undefined` |
| Prestation `visites` sans univers | erreur de contrôle au build |
| Prestation d'identifiant `activites` | erreur de contrôle au build (collision avec un slug d'univers) |
