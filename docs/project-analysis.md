# Analyse du projet — TKS® « Kribi is a feeling »

**Statut** : draft · **Date** : 2026-09-13 · **Phase** : Discovery

## 1. Éléments fournis

| Fichier | Nature | Exploitation |
|---|---|---|
| `Elements/Cahier_des_charges_TKS_site_web.pdf` | Document de cadrage, 6 pages, 18 sections | Lu intégralement, synthèse ci-dessous |
| `Elements/WhatsApp Image 2026-09-10 at 11.57.00.jpeg` | Croquis ChatGPT, 9 écrans | Lu comme indication d'intention UX, pas comme spec UI (voir §4) |
| `Elements/WhatsApp Audio 2026-09-09 at 14.36.25.opus` | Vocal du client, 56 s | Transcrit automatiquement, utilisé comme **complément** au cahier des charges, jamais comme référence seule. Voir [audio-transcript.md](./audio-transcript.md) |

## 2. Le client et le produit

**TKS®** est une société de Kribi (Cameroun) positionnée sur trois pôles : **transport**, **tourisme / expériences**, **livraison**. Signature : « Kribi is a feeling ». Ambition : devenir le point d'entrée local pour découvrir, organiser et vivre un séjour à Kribi, et à terme une plateforme de réservation et de conciergerie.

Le site demandé n'est pas un site vitrine classique : c'est une **vitrine commerciale interactive**. Le visiteur doit pouvoir consulter les services et leurs tarifs indicatifs, en sélectionner plusieurs, composer une demande, obtenir une estimation, puis transmettre le tout à TKS via WhatsApp. TKS finalise ensuite humainement (devis, confirmation).

Parcours cible du cahier des charges : *Découvrir → sélectionner → composer → obtenir une estimation → envoyer une demande → échange avec TKS → confirmation.*

Le vocal du client (complément d'information, pas une source de référence : voir [audio-transcript.md](./audio-transcript.md)) formule le besoin ressenti en une phrase : **choisir des activités par catégorie, récapituler, écrire sur WhatsApp**. Il évoquait aussi, avec un « peut-être », l'envie de lancer le **tourisme** en premier. Le client a depuis confirmé que **les trois pôles sont tous importants** (question A3) : aucun n'est prioritaire.

## 3. Synthèse du cahier des charges

| § | Sujet | Contenu essentiel | Lecture discovery |
|---|---|---|---|
| 1 | Vision | Vitrine interactive, sélection multiple, estimation, contact WhatsApp, devis final humain | Définit le MVP à lui seul |
| 2 | Positionnement | Acteur local de référence, accompagnement avant et pendant le séjour | Contenu marketing à obtenir du client |
| 3 | Architecture | 8 rubriques : Accueil, Transport, Tourisme, Mon séjour/Panier, Formules/Packs, Livraison, À propos, Contact | 6 rubriques en MVP, Packs en V2, À propos = section de l'accueil |
| 4 | Accueil | Identité, visuel fort, 3 pôles, 4 CTA, expériences mises en avant, WhatsApp visible | MVP |
| 5 | Transport | 7 services envisagés, catalogue évolutif sans modification de code, prix indicatif ou « sur devis », champs de demande (date, heure, départ, destination, personnes, durée) | Catalogue MVP ; champs de qualification détaillés en V2 |
| 6 | Tourisme | Axe stratégique. 9 activités listées + hébergements partenaires | Activités MVP ; hébergements V2 (aucun partenaire signé connu) |
| 7 | Fiche prestation | Nom, photos, descriptions, prix indicatif, durée, capacité, conditions, disponibilité, boutons Ajouter / Devis | MVP, définit le modèle `Service` |
| 8 | Mon séjour / Panier | Ajouter, retirer, quantité / nombre de personnes, récap, total estimatif, « sur devis » identifié, CTA devis + WhatsApp | **Cœur du MVP** |
| 9 | Formules / Packs | Packs prédéfinis, prix indicatif, sélection directe ou personnalisation | P1 dans le CDC → V2 ici (aucun pack défini) |
| 10 | Livraison | 5 types, formulaire recommandé (retrait, destination, colis, date, coordonnées) | Catalogue MVP ; formulaire détaillé V2 |
| 11 | WhatsApp | Message récapitulatif généré automatiquement, exemple fourni | MVP, pas de paiement en V1 |
| 12 | Administration | Espace admin pour services, prix, photos, packs, partenaires, demandes | P1 dans le CDC → V3 ici (nécessite backend) |
| 13 | UX / Design | Mobile-first, moderne, orienté tourisme, photos de qualité, CTA visibles, extensible | Contraintes MVP |
| 14 | Priorités | P0 : accueil, 3 pôles, fiches, panier, devis, WhatsApp. P1 : packs, admin. P2 : réservation, paiement, comptes, partenaires | Base du tableau de scope |
| 15 | Évolutions | Réservation, paiement, disponibilités, comptes, notifications, partenaires, plateforme | Roadmap Future |
| 16 | Principe commercial | Distinguer **prix fixe**, **prix indicatif**, **sur devis** ; ne pas enfermer TKS dans des prix rigides | Règle métier structurante du modèle `Pricing` |
| 17 | Résultat attendu | Comprendre TKS, découvrir, consulter, sélectionner, construire, transmettre en quelques étapes | Critère de succès du MVP |
| 18 | Points à définir | Techno, hébergement, domaine, CMS, panier, WhatsApp, photos, sécurité, SEO, analytics, coût, calendrier | Couverts par les docs de cette phase + questions client |

## 4. Lecture du croquis

Le croquis (généré par ChatGPT) montre 9 écrans. Il est utile pour comprendre l'intention, pas pour fixer l'UI : le design final sera produit dans Figma.

**Intentions UX que l'on retient**

- Navigation sticky avec un bouton WhatsApp vert permanent en haut à droite.
- Hero plein écran avec photo de Kribi, titre « Découvrez Kribi autrement », sous-titre « Transport • Tourisme • Livraison • Expériences », deux CTA.
- Trois cartes d'accès rapide aux pôles, section « Pourquoi choisir TKS ? » avec 4 arguments.
- Pages de pôle : bandeau, **filtres par onglets** (catégories), grille de cartes avec image, titre, **« À partir de X FCFA »** ou badge **« Sur devis »**, bouton « Voir les détails ».
- Fiche détail : galerie, prix indicatif, durée, nombre de personnes, niveau, inclus / non inclus, **stepper de quantité**, bouton « Ajouter à mon séjour ».
- Page « Mon séjour » : liste des lignes avec vignette, quantité, dates, prix, suppression, **total estimatif** avec mention « prix indicatif, sous réserve de disponibilité et de confirmation par TKS », CTA « Demander un devis par WhatsApp ».
- Bloc « Besoin d'un service spécifique ? » renvoyant vers WhatsApp sur chaque page de pôle.
- Aperçu mobile : panier accessible en plein écran, CTA WhatsApp en bas.
- Palette suggérée : bleu marine profond + vert WhatsApp + blanc, typographie sans-serif, signature en script.

**Ce que l'on ne retient pas comme exigence**

- Notes et avis (« 4.8 (120 avis) ») : aucune source d'avis en V1.
- Vidéo dans la section « Kribi » : contenu non fourni, coûteux en performance.
- Horaires d'ouverture, adresse mail, réseaux sociaux : à confirmer par le client.
- Tous les prix affichés (50 000 FCFA / jour, 25 000 FCFA, 290 000 FCFA…) sont des **placeholders**.
- Page « Nos formules » avec 3 packs : V2.
- Formulaire de devis sur la page Contact : sans backend, un formulaire n'envoie rien. En V1, le formulaire est remplacé par le message WhatsApp prérempli.
- Dates par ligne de panier (« 12 jan. 2025 ») : la saisie de dates par service est reportée en V2, une date de séjour globale suffit.

## 5. Écarts entre le brief et le cahier des charges

| Sujet | Brief (développeur) | Cahier des charges (client) | Décision |
|---|---|---|---|
| Forme du site | « Landing page interactive » | 8 rubriques, fiches détail | **Site multi-pages léger** : Accueil, Transport, Tourisme, Livraison, Mon séjour, Contact, fiches générées depuis les données. Meilleur pour le SEO par service et fidèle au croquis |
| Backend / admin | Frontend only, aucun backoffice | Admin en P1 | **Aucun backend en MVP**. Le catalogue vit dans des fichiers de données versionnés ; l'admin devient une V3 avec CMS headless |
| Packs | Non mentionnés | P1 | V2, le modèle de données réserve la place |
| Hébergements | Non mentionnés | Dans le pôle Tourisme | V2, aucun partenaire connu |
| Formulaire de contact | Non mentionné | « WhatsApp, formulaire et coordonnées » | V1 : coordonnées + WhatsApp. Formulaire en V2 si le client le juge indispensable (question client) |

## 6. Ce que l'on sait, et ce qui reste ouvert

Le client a répondu au questionnaire le 2026-09-14 : voir [client-answers.md](./client-answers.md). Résolu : les trois pôles ont la même priorité, objectif (demandes WhatsApp), cible (expatriés et touristes étrangers d'abord, puis Douala / Yaoundé), liste des services et catégories, statuts de disponibilité, modes de prix et unités par pôle, mention sous le total, dates et voyageurs recommandés mais non bloquants, numéro WhatsApp unique, format du message, contenu de la page Contact, packs et hébergements en V2, direction de design.

Reste ouvert :

1. **Tarifs service par service** (montant, mode, unité) : promis, non reçus.
2. Pour chaque service transport, quantité en véhicules ou en jours.
3. Logo HD, photos et droits : promis, à recevoir progressivement.
4. Nom de domaine, e-mail professionnel, téléphone et réseaux sociaux.

Aucun de ces points ne bloque les specs 001 à 006, qui travaillent sur des données d'exemple marquées. Ils bloquent la mise en ligne.

## 7. Documents liés

- [product-scope.md](./product-scope.md) : classification MVP / V2 / V3 / Future / Hors scope
- [client-questions.md](./client-questions.md) : questionnaire à envoyer
- [user-journeys.md](./user-journeys.md) : parcours et états
- [functional-requirements.md](./functional-requirements.md) : exigences FR-xxx
- [architecture.md](./architecture.md) et [technical-decisions.md](./technical-decisions.md) : stack et ADR
- [roadmap.md](./roadmap.md) : trajectoire produit
