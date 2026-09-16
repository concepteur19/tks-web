# Suivi du contenu client

**Statut** : vivant · **Créé le** : 2026-09-14

Franck envoie ses éléments au fil de l'eau. Ce fichier dit ce qui est attendu, ce qui est arrivé, où ça va dans le dépôt, et où en est la traduction anglaise. On le met à jour à chaque envoi.

## Légende

| Symbole | Colonne FR : contenu de Franck | Colonne EN : traduction |
|---|---|---|
| ⏳ | Attendu | À traduire |
| 📝 | Base reçue, à compléter | Traduit avec IA, à relire |
| 🔄 | Provisoire en place dans le site | — |
| ✅ | Reçu et validé | Relu et validé |
| — | Sans objet | Sans objet |

## Quand un élément arrive

1. Déposer l'original dans `Elements/incoming/<AAAA-MM-JJ>/`. Les photos et vidéos brutes ne sont pas versionnées dans Git.
2. Mettre à jour la ligne concernée ci-dessous : statut FR, date de réception.
3. Si l'élément change une décision, par exemple un tarif au kilomètre, l'ajouter à [client-answers.md](./client-answers.md).
4. Traduire en anglais avec l'IA, relire, puis passer le statut EN à ✅.
5. Une fois le code en place : intégrer la version optimisée dans `src/content/` ou `src/assets/`.
6. Commiter français et anglais ensemble : `content: add <élément>`.

## Règles de mise en ligne

- Le build de production échoue s'il reste un contenu `[PLACEHOLDER]` ou un texte anglais manquant.
- Un service sans tarif ne part en « sur devis » qu'avec l'accord de Franck.
- Un service sans photo validée est désactivé jusqu'à réception, plutôt que publié avec une image provisoire.

## Éléments globaux

| Élément | Page | FR | EN | Reçu le | Destination | Bloque la mise en ligne |
|---|---|---|---|---|---|---|
| Logo TKS® haute résolution, SVG idéalement | global | ⏳ | — | | `src/assets/brand/logo.svg` | Oui |
| Numéro WhatsApp | global | ✅ +237 697 13 53 88 | — | 2026-09-14 | variable `PUBLIC_WHATSAPP_NUMBER` | — |
| Nom de domaine | global | ⏳ | — | | variable `PUBLIC_SITE_URL`, DNS Cloudflare | Oui |
| Photos d'accueil | accueil | ⏳ | ⏳ textes alternatifs | | `src/assets/home/` | Oui |
| Vidéo d'accueil courte et légère | accueil | ⏳ optionnelle | — | | `src/assets/home/` | Non |
| Photos de bandeau des trois pôles | transport, tourisme, livraison | ⏳ | ⏳ textes alternatifs | | `src/assets/poles/` | Oui |
| Présentation courte de TKS | accueil | 📝 idée reçue (F3) | ⏳ | 2026-09-14 | `src/content/site/company.json` | Oui |
| Texte « À propos » | accueil | 📝 idée reçue (F3) | ⏳ | 2026-09-14 | `src/content/site/company.json` | Oui |
| Raisons de choisir TKS | accueil | 📝 réactivité, service local, expérience personnalisée, plusieurs services réunis (F3) | ⏳ | 2026-09-14 | `src/content/site/company.json` | Oui |
| Téléphone, si différent du WhatsApp | contact | ⏳ | — | | `src/content/site/company.json` | Non |
| E-mail professionnel | contact | ⏳ | — | | `src/content/site/company.json` | Non |
| Liens des réseaux sociaux | contact, pied de page | ⏳ | — | | `src/content/site/company.json` | Non |
| Supports existants : Facebook, Instagram, flyers | inspiration design | ⏳ | — | | `Elements/incoming/` | Non |

## Services

Pour chaque service, Franck doit fournir : le tarif avec son mode et son unité, des photos, une description, les informations importantes. Le fichier de destination est `src/content/services/<fichier>.json`, les photos vont dans `src/assets/services/<fichier>/`.

Les unités et les dimensions de quantité ont été arrêtées avec Franck le 2026-09-16, service par service. Elles figurent dans les tableaux ci-dessous et dans [data-model.md](./data-model.md). Ce qui manque encore, ce sont les montants.

### Transport

| Service | Fichier | Unité | Dimensions | Montant | Photos | Texte FR | Texte EN |
|---|---|---|---|---|---|---|---|
| Courses / déplacements à Kribi | `courses-kribi` | ✅ par course | ✅ aucune ou courses | ⏳ | ⏳ | ⏳ | ⏳ |
| Location avec chauffeur | `location-avec-chauffeur` | ✅ par jour ou par heure | ✅ véhicules + durée | ⏳ | ⏳ | ⏳ | ⏳ |
| Chauffeur privé | `chauffeur-prive` | ✅ par heure ou par jour | ✅ heures ou jours | ⏳ | ⏳ | ⏳ | ⏳ |
| Transferts | `transferts` | ✅ par trajet | ✅ véhicules | ⏳ | ⏳ | ⏳ | ⏳ |
| Transport professionnel | `transport-professionnel` | ✅ sur devis | ✅ aucune | — | ⏳ | ⏳ | ⏳ |
| Transport scolaire | `transport-scolaire` | ✅ sur devis | ✅ aucune | — | ⏳ | ⏳ | ⏳ |
| Location sans chauffeur | `location-sans-chauffeur` | ✅ par jour | ✅ véhicules + jours | ⏳ | ⏳ | ⏳ | ⏳ |

### Tourisme

Trois catégories arrêtées le 2026-09-16 : Nature / Découverte, Aventure, Détente. Pas de catégorie « autres activités » en V1.

| Activité | Fichier | Catégorie | Unité | Montant | Photos | Texte FR | Texte EN |
|---|---|---|---|---|---|---|---|
| Chutes de la Lobé | `chutes-de-la-lobe` | Nature / Découverte | ⏳ personne ou groupe | ⏳ | ⏳ | ⏳ | ⏳ |
| Jacuzzi naturel | `jacuzzi-naturel` | Nature / Découverte | ✅ par personne | ⏳ | ⏳ | ⏳ | ⏳ |
| Excursion en pirogue | `excursion-en-pirogue` | Nature / Découverte | ⏳ personne ou groupe selon la formule | ⏳ | ⏳ | ⏳ | ⏳ |
| Découverte de Kribi | `decouverte-de-kribi` | Nature / Découverte | ⏳ personne ou groupe | ⏳ | ⏳ | ⏳ | ⏳ |
| Jet-ski | `jet-ski` | Aventure | ⏳ équipement, heure ou personne | ⏳ | ⏳ | ⏳ | ⏳ |
| Quad | `quad` | Aventure | ⏳ équipement, heure ou personne | ⏳ | ⏳ | ⏳ | ⏳ |
| Balade à cheval | `balade-a-cheval` | Aventure | ⏳ équipement, heure ou personne | ⏳ | ⏳ | ⏳ | ⏳ |
| Croisière | `croisiere` | Détente | ✅ par personne | ⏳ | ⏳ | ⏳ | ⏳ |
| Feux de plage | `feux-de-plage` | Détente | ⏳ groupe ou personne selon la formule | ⏳ | ⏳ | ⏳ | ⏳ |

### Livraison

| Service | Fichier | Unité | Dimensions | Montant | Photos | Texte FR | Texte EN |
|---|---|---|---|---|---|---|---|
| Colis | `livraison-colis` | ⏳ livraison, ou sur devis si distance | ✅ colis | ⏳ | ⏳ | ⏳ | ⏳ |
| Commandes | `livraison-commandes` | ⏳ | ✅ colis | ⏳ | ⏳ | ⏳ | ⏳ |
| Domicile | `livraison-domicile` | ⏳ | ✅ colis | ⏳ | ⏳ | ⏳ | ⏳ |
| Courses | `livraison-courses` | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Professionnelle | `livraison-professionnelle` | ⏳ sur devis ? | ✅ aucune | — | ⏳ | ⏳ | ⏳ |

## À redemander à Franck

- **Montants** : le tarif de chaque service, avec son mode (prix fixe, à partir de, sur devis). C'est ce qui manque le plus.
- **Unité par activité** : pour le jet-ski, le quad, la balade à cheval, les chutes de la Lobé, la découverte de Kribi, la pirogue et les feux de plage, l'unité dépend du tarif réellement appliqué. À figer une fois les prix connus.
- **Bateau, chaloupe, prestations de campement** : cités le 2026-09-16 comme exemples de tarification au groupe, mais absents de la liste de lancement. Ce sont de nouveaux services à ajouter, ou des variantes d'activités existantes ?

Réglé le 2026-09-16 : l'excursion en pirogue est gardée, il n'y a pas de catégorie « autres activités », et les dimensions de quantité sont définies service par service.
