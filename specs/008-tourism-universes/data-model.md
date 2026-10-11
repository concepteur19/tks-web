# Data Model — 008 Les trois univers du Tourisme

**Feature**: [spec.md](./spec.md) · Décisions : [research.md](./research.md) · Schémas : [contracts/content.md](./contracts/content.md)

## Univers (collection `categories`)

| Champ | Type | Règle |
|---|---|---|
| `name` | `{ fr, en }` | obligatoire |
| `description` | `{ fr, en }` | phrase de présentation du cahier, section 3 ; devient obligatoire |
| `urlSlug` | `{ fr, en }` | **nouveau** (`slug` est réservé par Astro), obligatoire ; minuscules, chiffres, tirets ; unique par langue ; jamais égal à un identifiant de prestation |
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
| `images[].illustrative` | **nouveau**, booléen facultatif : image générée, étiquetée « Photo illustrative » |
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

Toutes : `pricing: { kind: "quote" }`, quantité persons info 1–30, déf. 2 (U6), aucune option (`withOptions: false`).

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

### Remplacées (Q1, Q2)

| Identifiant | Avant | Après |
|---|---|---|
| `croisiere-en-bateau` | 25 000 `per_person`, mise en avant | `availability: "disabled"`, plus mise en avant ; adresse redirigée (301) vers `croisiere-en-haute-mer` |
| `bateau-de-plaisance` | quote | `availability: "disabled"` ; adresse redirigée (301) vers `croisiere-en-haute-mer` |

### Options (Q3, Q5)

| Identifiant | État |
|---|---|
| `guide-touristique` | inchangé, proposé sur `visites` et `activites` |
| `maitre-nageur` | inchangé, proposé sur `visites` et `activites` |
| `musee-d-art` | `availability: "disabled"` : c'est le Musée Batanga, publié comme visite |

### « À savoir » imposés

Quad, jet-ski, bouée tractée : « Une personne par engin » / « One person per vehicle » (Q4).

## Photos par prestation

Sources relatives à `Elements/tri-par-activite/` (`NEW/…` : lot du 2026-10-11, à copier d'abord dans le dossier de l'activité ; `HEIC` : `~/Downloads/Telegram Desktop`, à convertir). Destination : `src/assets/photos/experiences/<id>[-2|-3].jpg`, ou `illustrations/<id>.jpg` pour une image illustrative.

| Prestation | Photos (ordre de la galerie) | Nature |
|---|---|---|
| `village-mayi` | `decouverte-de-kribi/L13-05` (pont des Esclaves) ; `L13-01` (monument) écartée, filigranée | Franck |
| `debarcadere-de-mboa-manga` | `sections/kribi-vue-aerienne.jpg` (`L1-01` écartée, filigranée) | ambiance |
| `plage-de-batanga` | `ambiance-hero-plages-couchers/L11-05` (plage de Kribi) | Franck, à sa demande ; texte alternatif « Plage de Kribi » |
| `village-ebodje`, `port-autonome-de-kribi`, `hotel-golden-k`, `musee-batanga` | `sections/kribi-vue-aerienne.jpg` (déjà importée) | ambiance ; texte alternatif « Vue aérienne de la côte de Kribi » |
| `excursion-en-chaloupe` | `NEW/18-56-09` (bateau couvert), `NEW/chaloupe/18-55-32`, `NEW/chaloupe/18-54-10` | Franck, remplace l'image Stitch |
| `feu-de-plage` | photo actuelle (`feux-de-plage/photo_2026-10-06_01-53-03`, PR n°5), puis `HEIC/IMG_2058`, `HEIC/IMG_2060` | Franck ; les deux HEIC remplacent l'image Stitch en seconde position |
| `pique-nique-bivouac` | `NEW/18-56-48` (paillote au coucher du soleil), `feux-de-plage/L11-04` | Franck |
| `bouee-tractee` | `NEW/18-56-29` (bouée tirée par un bateau), `NEW/18-56-16` (`18-56-38`, quasi identique, écartée) | Franck |
| `seance-photo` | `NEW/18-56-42`, `NEW/quad et jet sky/18-55-15`, `NEW/quad et jet sky/18-55-09` | Franck (personnes qui posent) |
| `quad` | photo actuelle, puis `NEW/18-56-55`, `NEW/quad et jet sky/18-55-21` | Franck, galerie complétée |
| `jet-ski` | photo actuelle, puis `NEW/18-55-46`, `NEW/quad et jet sky/18-55-04` | Franck, galerie complétée |
| `croisiere-en-haute-mer` | `illustrations/croisiere-en-haute-mer.jpg` | illustrative |
| 10 spécialités culinaires | `illustrations/<id>.jpg` | illustrative |

Univers : `visites` → `experiences/chutes-de-la-lobe.jpg` ; `activites` → `experiences/jet-ski.jpg` ; `specialites-culinaires` → `illustrations/degustation-fruits-de-mer.jpg`, marquée illustrative (`L14-02`, étal de poissons, écartée : filigranée).

Exclues : toute photo filigranée (`L13-02` à `L13-04`, `L11-01`, `18-58-17`, `18-58-27`, `18-59-20`) et les doublons de plus basse résolution.

## Totaux

- 32 prestations publiées : 9 + 13 + 10. 21 nouvelles, 11 existantes déplacées, 2 remplacées. 2 options publiées.
- 4 mises en avant : chutes de la Lobé, Village Bagyeli, excursion en pirogue, jet-ski.

## Cas de référence (tests)

| Cas | Attendu |
|---|---|
| Ajout rapide du Village Bagyeli | ligne à 2 personnes, 30 000 FCFA, total « estimatif » (prix « à partir de ») |
| Sélecteur du Village Bagyeli à 2, bouton « moins » | désactivé |
| Séjour enregistré avec `campement-bagyeli` au tarif `couple` | ligne retirée au chargement, message de la 004 |
| Séjour enregistré avec `croisiere-en-bateau` | ligne retirée au chargement, message de la 004 |
| Séjour enregistré avec la pirogue et l'option `musee-d-art` | option retirée au chargement, message de la 004 |
| `/experiences/croisiere-en-bateau` en production | redirection 301 vers `/experiences/croisiere-en-haute-mer` |
| Feu de plage pour 12 personnes | ligne « sur devis » (au-delà de 10) |
| Bateau de croisière, 2 heures | 300 000 FCFA |
| Jet-ski, 2 sessions | 20 000 FCFA |
| Langouste pour 4 | ligne sur demande, « 4 personnes » dans le message, hors total |
| `minimumParticipants(campement-bagyeli)` | 2 ; `minimumParticipants(chutes-de-la-lobe)` : `undefined` |
| Prestation `visites` sans univers | erreur de contrôle au build |
| Prestation d'identifiant `activites` | erreur de contrôle au build (collision avec un slug d'univers) |
