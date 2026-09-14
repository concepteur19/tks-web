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

Pour la quantité, ce qui est déjà acquis vient de sa réponse D1 : personnes pour les activités, colis pour la livraison. Pour le transport, la dimension reste à confirmer service par service.

### Transport

| Service | Fichier | Tarif | Quantité | Photos | Texte FR | Texte EN |
|---|---|---|---|---|---|---|
| Courses / déplacements à Kribi | `courses-kribi` | ⏳ | ⏳ véhicules ? | ⏳ | ⏳ | ⏳ |
| Location avec chauffeur | `location-avec-chauffeur` | ⏳ | ⏳ jours ? | ⏳ | ⏳ | ⏳ |
| Chauffeur privé | `chauffeur-prive` | ⏳ | ⏳ heures ou jours ? | ⏳ | ⏳ | ⏳ |
| Transferts | `transferts` | ⏳ | ⏳ véhicules ? | ⏳ | ⏳ | ⏳ |
| Transport professionnel | `transport-professionnel` | ⏳ sur devis ? | ⏳ | ⏳ | ⏳ | ⏳ |
| Transport scolaire | `transport-scolaire` | ⏳ sur devis ? | ⏳ | ⏳ | ⏳ | ⏳ |
| Location sans chauffeur | `location-sans-chauffeur` | ⏳ | ⏳ jours ? | ⏳ | ⏳ | ⏳ |

### Tourisme

| Activité | Fichier | Tarif | Quantité | Photos | Texte FR | Texte EN |
|---|---|---|---|---|---|---|
| Chutes de la Lobé | `chutes-de-la-lobe` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Jacuzzi naturel | `jacuzzi-naturel` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Jet-ski | `jet-ski` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Quad | `quad` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Balade à cheval | `balade-a-cheval` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Croisière | `croisiere` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Feux de plage | `feux-de-plage` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |
| Découverte de Kribi | `decouverte-de-kribi` | ⏳ | ✅ personnes | ⏳ | ⏳ | ⏳ |

### Livraison

| Service | Fichier | Tarif | Quantité | Photos | Texte FR | Texte EN |
|---|---|---|---|---|---|---|
| Colis | `livraison-colis` | ⏳ sur devis si distance | ✅ colis | ⏳ | ⏳ | ⏳ |
| Commandes | `livraison-commandes` | ⏳ | ✅ colis | ⏳ | ⏳ | ⏳ |
| Domicile | `livraison-domicile` | ⏳ | ✅ colis | ⏳ | ⏳ | ⏳ |
| Courses | `livraison-courses` | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Professionnelle | `livraison-professionnelle` | ⏳ sur devis ? | ⏳ | ⏳ | ⏳ | ⏳ |

## À redemander à Franck

- **Excursion en pirogue** : elle figure dans le cahier des charges et le croquis, mais pas dans sa liste B1. On la garde ?
- **« Autres activités »** : sa réponse B1 les mentionne sans les nommer. Lesquelles ?
- **Quantité en transport** : pour chaque service, on compte en véhicules, en jours ou en heures ?
- **Tarifs par groupe** : quelles activités sont vendues au groupe plutôt qu'à la personne ?
