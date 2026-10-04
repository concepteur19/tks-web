# TKS® — Brief de design, Direction C « Soleil et vie locale »

> **Périmé depuis le 2026-09-25.** Ce brief décrit le site TKS® à trois pôles, abandonné avec la direction Kibreeze (voir [client-answers.md](../client-answers.md) section 1 ter). Il est conservé comme trace : sa direction artistique (partie 5) a été validée par Franck et reprise telle quelle dans le brief actif, [kibreeze-brief.md](./kibreeze-brief.md). C'est ce dernier qu'il faut utiliser pour générer des écrans.

**Statut** : périmé · direction artistique retenue par Franck le 2026-09-17 · **Outil de génération** : Google Stitch, export ensuite affiné dans Figma.

Ce document est un brief de conception d'interface. Génère les écrans décrits en partie 6, dans la direction artistique de la partie 5, en respectant la partie 3 et la partie 4 à la lettre.

Stitch accepte ce fichier `.md` en pièce jointe, mais ne produit qu'un écran par requête : joins le fichier puis précise dans le message l'écran voulu (numéro et nom de la partie 6), pour qu'il ne dilue pas le style en générant plusieurs écrans à la fois. Redémarre une conversation Stitch par écran. Demande d'abord le mobile ; une fois l'écran validé, redemande dans la même conversation : « Garde exactement le même style, la même mise en page logique et les mêmes contenus, mais adapte pour un écran ordinateur de 1440 × 1024 : navigation complète, grille à deux ou trois colonnes selon l'écran, panier « Mon séjour » en panneau latéral plutôt qu'en pleine page. »

## 1. Le produit

TKS® est une entreprise de Kribi, au Cameroun. Elle réunit trois activités : le transport, le tourisme et la livraison. Sa signature est « Kribi is a feeling ».

Le site est une vitrine commerciale interactive. Le visiteur découvre les services, en ajoute plusieurs à un panier appelé « Mon séjour », voit un total estimatif, puis envoie sa demande à TKS sur WhatsApp. Il n'y a ni paiement, ni compte utilisateur, ni réservation en ligne.

Le site ne doit pas donner l'impression que TKS loue des voitures. Le visiteur doit comprendre que TKS l'aide à organiser son expérience à Kribi.

## 2. Public et objectif

D'abord des expatriés et des touristes étrangers, puis des Camerounais de Douala et Yaoundé qui viennent passer un week-end à Kribi. Usage très majoritairement sur téléphone.

L'objectif unique est la conversion : que le visiteur écrive à TKS sur WhatsApp avec une sélection de prestations.

## 3. Contraintes non négociables

- Conception pour téléphone d'abord, écran de 390 × 844 pixels.
- La maquette est un instantané à une largeur donnée, mais le site final sera adaptatif, de 360 pixels à un grand écran. Conçois donc une mise en page capable de se réorganiser : colonnes qui s'empilent, largeurs proportionnelles plutôt que valeurs fixes, images qui se recadrent, libellés qui peuvent revenir à la ligne. Sur ordinateur, la grille passera à deux puis trois colonnes, la navigation s'ouvrira en entier et le panier deviendra un panneau latéral.
- Évite donc tout ce qui ne tient qu'à cette largeur précise : élément positionné en absolu pour combler un vide, grille rigide, texte incrusté dans une image, bloc dont la hauteur est figée.
- Interface en français.
- Un sélecteur de langue « FR | EN » visible dans la navigation, car le site existera aussi en anglais.
- Un bouton WhatsApp vert accessible en permanence : bouton flottant en bas à droite sur téléphone, dans la navigation sur ordinateur.
- Beaucoup de photographies de Kribi : océan, chutes d'eau, pirogues, végétation, véhicules. Peu de texte.
- Trois façons d'afficher un prix, visuellement distinctes : un prix ferme « 70 000 FCFA », un prix de départ « À partir de 25 000 FCFA », et un badge « Sur devis » sans montant.
- Devise unique, le franc CFA, écrit « FCFA », avec une espace comme séparateur de milliers.
- Contraste conforme au niveau AA des règles d'accessibilité, zones tactiles d'au moins 44 pixels.
- Prévoir environ 30 % de longueur de texte en plus, car les libellés seront traduits en anglais.
- Les montants affichés sont des exemples. Ajoute la mention « tarifs fictifs » en petit dans un coin de chaque écran.
- Navigation mobile : une barre à onglets fixée en bas de l'écran, sur toutes les pages, avec cinq destinations : Accueil, Transport, Tourisme, Livraison, Séjour (icône avec pastille de comptage). Pas de hamburger, pas d'icône « Mon séjour » séparée dans la barre du haut : c'est l'onglet « Séjour » qui en tient lieu. « À propos » et « Contact » n'ont pas d'onglet dédié : ils restent accessibles depuis le pied de page et depuis les liens internes de l'accueil.
- Empilement en bas de l'écran, toujours dans cet ordre en partant du contenu : la barre à onglets tout en bas ; au-dessus d'elle, si la page en a une, la barre de prix / CTA fixe des fiches. Sur les pages qui ont déjà une CTA WhatsApp fixe en bas (fiches, Mon séjour), pas de bouton flottant en plus : la CTA fixe suffit et évite l'empilement à trois niveaux. Le bouton WhatsApp flottant n'apparaît que sur les pages sans CTA fixe (accueil, page de pôle, contact, 404), ancré en bas à droite, avec au moins 16 pixels d'écart au-dessus de la barre à onglets.
- N'invente aucune donnée ou promesse commerciale absente de ce brief : pas de délai de réponse garanti, pas de tarif dégressif, pas de note ou d'avis chiffré. Ce qui n'est pas écrit ici n'existe pas.

## 4. Microcopie exacte, à ne pas reformuler

- Boutons d'accueil : « Découvrir nos services », « Planifier mon séjour »
- Sur une fiche : « Ajouter à mon séjour », « Demander ce service »
- Panier : « Mon séjour », « Demander un devis », « Contacter TKS sur WhatsApp »
- Prix : « À partir de », « Sur devis », « Disponibilité à confirmer »
- Sous un total : « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. »

## 5. Direction artistique

Chaleureuse, colorée, ancrée dans la vie locale.

- Couleurs : un terracotta et un orange soleil pour la marque, un crème pour les fonds, un turquoise pour les accents secondaires. Le vert est réservé au seul bouton WhatsApp.
- Typographies : un sans-serif au caractère marqué pour les titres, un sans-serif simple pour le texte courant, et une écriture manuscrite fine uniquement pour la signature « Kribi is a feeling ».
- Formes : cartes aux angles francs, blocs de couleur pleine, photographies cadrées serré sur les gens et les scènes de vie, petits motifs discrets en séparateurs. Rayons de coin nuls ou très légers seulement (jamais de coins très arrondis ni de boutons en forme de pilule) : c'est ce qui distingue cette direction de la direction A, plus douce et arrondie. Vérifie chaque bouton, carte et vignette généré : s'il ressemble à un bouton de pilule ou une carte aux coins très ronds, redemande-le avec des angles droits.
- Sensation visée : accueil, proximité, énergie locale.

## 6. Écrans à produire

### Écran 1 — Accueil

De haut en bas :

1. Barre du haut fixe : logo texte « TKS® » à gauche, sélecteur « FR | EN », icône WhatsApp verte. Pas d'icône « Mon séjour » ni de menu hamburger ici : la navigation principale est la barre à onglets du bas (Accueil actif, Transport, Tourisme, Livraison, Séjour avec pastille à 0).
2. Grande image plein écran d'une plage de Kribi au soleil couchant, assombrie pour la lisibilité. Titre « Découvrez Kribi autrement », signature manuscrite « Kribi is a feeling », sous-titre « Transport • Tourisme • Livraison ». Deux boutons : « Découvrir nos services » en plein, « Planifier mon séjour » en contour.
3. Trois cartes empilées pour les pôles : Transport, Tourisme, Livraison. Photo, titre, une phrase, lien « Voir nos services ».
4. Bande « Pourquoi choisir TKS ? » avec quatre arguments et une icône chacun : réactivité, équipe locale, expérience sur mesure, plusieurs services réunis.
5. Section « Nos expériences » : quatre activités défilant horizontalement, avec photo, nom, prix « À partir de X FCFA » et bouton « Ajouter à mon séjour ». Activités : Chutes de la Lobé, Excursion en pirogue, Jacuzzi naturel, Croisière.
6. Bloc « À propos de TKS » : une photo d'équipe, trois phrases, lien « En savoir plus ».
7. Bloc de conversion sur fond de marque : titre « Un besoin particulier ? », bouton « Contacter TKS sur WhatsApp ».
8. Pied de page : logo, signature, liens des trois pôles, « Kribi, Cameroun », icônes de réseaux sociaux.
9. Bouton WhatsApp flottant en bas à droite, superposé au contenu.

### Écran 2 — Fiche d'une activité, « Excursion en pirogue »

1. Fil d'Ariane : Tourisme › Nature / Découverte › Excursion en pirogue.
2. Galerie : une grande photo, trois miniatures en dessous.
3. Titre, puis prix « À partir de 25 000 FCFA / personne » bien visible, suivi en petit de « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. »
4. Ligne d'informations avec icônes : durée « 2 à 3 heures », capacité « 1 à 10 personnes », lieu « Embouchure de la Lobé ».
5. Description en deux paragraphes courts.
6. Deux listes côte à côte : « Ce qui est inclus » avec des coches, « Ce qui n'est pas inclus » avec des croix.
7. Sélecteur de quantité : libellé « Nombre de personnes », bouton moins, valeur 2, bouton plus.
8. Barre fixe en bas de l'écran : total à gauche, bouton « Ajouter à mon séjour » à droite, et sous la barre un lien discret « Demander ce service ».
9. Bande « Vous aimerez aussi » avec trois autres activités.

### Écran 3 — Mon séjour, état plein

1. Titre « Mon séjour », sous-titre « 4 prestations sélectionnées », lien discret « Vider mon séjour ».
2. Deux champs optionnels côte à côte : « Dates du séjour » et « Nombre de voyageurs », vides. Sous eux, un rappel discret : « Ajoute tes dates pour une réponse plus rapide ». Ce rappel n'apparaît que parce que les champs sont vides ; ne les pré-remplis pas sur cet écran, sinon le rappel n'a plus de sens.
3. Quatre lignes de sélection. Chaque ligne porte une vignette photo, le nom, la quantité avec son libellé, le prix de la ligne, une icône de suppression, et un sélecteur de quantité compact **seulement pour les trois premières lignes** :
   - Transfert Douala → Kribi, 1 véhicule, 70 000 FCFA
   - Excursion en pirogue, 2 personnes, à partir de 50 000 FCFA
   - Location avec chauffeur, 2 véhicules × 3 jours, à partir de 300 000 FCFA
   - Transport professionnel, badge « Sur devis », sans montant, **sans sélecteur de quantité** : ce service n'a pas de dimension de quantité, seule l'icône de suppression apparaît sur sa ligne
4. Encadré de total : « Total estimatif 420 000 FCFA », puis « + 1 prestation sur devis », puis la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. »
5. Barre fixe en bas : bouton vert « Demander un devis par WhatsApp », et sous lui un lien « Continuer mes recherches ».

### Écran 4 — Page de pôle, exemple Tourisme

1. Bandeau plus court que celui de l'accueil : photo des chutes de la Lobé, titre « Tourisme », phrase « Vivez des expériences uniques à Kribi ».
2. Onglets de catégories défilant horizontalement : « Tous », « Nature / Découverte », « Aventure », « Détente ». « Tous » est actif.
3. Grille d'activités, une colonne sur mobile. Neuf cartes : Chutes de la Lobé, Jacuzzi naturel, Excursion en pirogue, Découverte de Kribi, Jet-ski, Quad, Balade à cheval, Croisière, Feux de plage. Chaque carte : photo en haut, nom, une phrase de description, prix, bouton « Voir les détails ». Varie les prix pour montrer les trois cas : « 45 000 FCFA », « À partir de 25 000 FCFA / personne », et un badge « Sur devis ». Mets un badge « Disponibilité à confirmer » sur une seule carte.
4. Bloc en bas : « Besoin d'une expérience sur mesure ? » avec le bouton « Contacter TKS sur WhatsApp ».

Génère ensuite, dans la même conversation, l'état où l'onglet « Aventure » est actif et où seules trois cartes restent affichées : « Garde le même écran, mais l'onglet actif est maintenant « Aventure » et seules les cartes Jet-ski, Quad et Balade à cheval restent visibles. »

### Écran 5 — Fiche « Location avec chauffeur », pôle Transport

Reprends exactement la structure de l'écran 2 (fil d'Ariane, galerie, titre et prix, ligne d'informations, description, inclus / non inclus, sélecteur de quantité, barre fixe, « Vous aimerez aussi »), mais pour le service « Location avec chauffeur » du pôle Transport, avec deux sélecteurs de quantité côte à côte à l'étape du sélecteur : « Véhicules » réglé sur 2 et « Jours » réglé sur 3. Prix affiché : « À partir de 50 000 FCFA / jour ». Le total dans la barre fixe du bas vaut alors 300 000 FCFA.

### Écran 6 — Mon séjour, état vide et état sur devis

Dans la même conversation que l'écran 3, génère deux variantes supplémentaires du même écran « Mon séjour ».

État vide : une illustration ou une photo douce en rapport avec Kribi, le titre « Votre séjour est vide », une phrase d'encouragement courte, et un bouton « Découvrir nos expériences ». Pas de liste, pas d'encadré de total.

État sur devis uniquement : deux lignes portant chacune le badge « Sur devis », aucun montant et aucun sélecteur de quantité (comme la ligne « Transport professionnel » de l'écran 3). À la place de l'encadré de total, la mention « Total : sur devis (2 prestations) ». Le bouton du bas reste « Demander un devis par WhatsApp ».

### Écran 7 — Contact

1. Bandeau court avec une photo de Kribi et le titre « Contactez TKS ».
2. Carte principale mise en avant : icône WhatsApp, titre « Écrivez-nous sur WhatsApp », phrase « Réponse rapide, 7 j / 7 », numéro « +237 697 13 53 88 », bouton vert « Contacter TKS sur WhatsApp ».
3. Sous elle, deux blocs simples : « Téléphone » et « E-mail ».
4. Bloc « Où nous trouver » : « Kribi, Cameroun », avec une image de carte stylisée, sans service de cartographie interactif.
5. Icônes des réseaux sociaux.
6. Pas de formulaire de contact.

### Écran 8 — Page 404

1. Reprend la barre de navigation fixe de l'accueil, identique.
2. Centre de l'écran : une illustration ou une photo légère de Kribi (pas d'image sombre ni inquiétante), un titre « Cette page s'est perdue en route vers Kribi », une phrase courte, un bouton plein « Retour à l'accueil » et un lien « Voir nos services ».
3. Bouton WhatsApp flottant en bas à droite, comme sur toutes les pages.

### Écran 9 — Barre à onglets, état séjour rempli

Reprends l'écran 1 (Accueil), mais avec l'onglet « Séjour » de la barre du bas affichant une pastille « 4 » au lieu de « 0 », et cet onglet actif (l'utilisateur vient de naviguer sur la page Mon séjour). Sert à vérifier que la pastille reste lisible à deux chiffres.

### Écran 10 — Accueil et fiche en anglais

Régénère l'écran 1 (Accueil) et l'écran 2 (fiche « Excursion en pirogue », renommée « Pirogue excursion ») avec « EN » actif dans le sélecteur de langue, tous les titres et boutons traduits en anglais, les prix toujours affichés en FCFA. Objectif : vérifier que les libellés anglais, plus longs que le français d'environ 30 %, ne cassent pas la mise en page.

## 7. Ne génère pas

Pas d'avis ni de notes clients. Pas de formulaire de contact. Pas de page de formules ou de packs. Pas d'hébergements. Pas de prix en euros. Pas de paiement, pas de connexion, pas de bandeau de cookies. Pas de menu hamburger. Pas de promesse commerciale, de délai garanti ou de remise qui ne figure pas explicitement dans ce brief.

## 8. Nommage et variables

- Nomme les écrans « 01 Accueil », « 02 Fiche pirogue », « 03 Mon séjour plein », « 04 Tourisme », « 05 Fiche location avec chauffeur », « 06 Mon séjour vide », « 07 Mon séjour sur devis », « 08 Contact », « 09 404 », « 10 Barre à onglets état séjour rempli », « 11 Accueil EN », « 12 Fiche pirogue EN », suffixés « mobile » ou « desktop ».
- Déclare les couleurs et les typographies comme variables réutilisables, nommées par leur rôle et non par leur teinte : `brand`, `brand-contrast`, `accent`, `bg`, `bg-muted`, `fg`, `fg-muted`, `border`, `success`, `warning`, `danger`.
- Utilise une grille d'espacement de 4 points et des rayons cohérents.
- Regroupe en composants réutilisables : bouton, carte de service, étiquette de prix, badge, sélecteur de quantité, ligne de séjour, barre fixe.
