# Kibreeze — Brief de design

**Statut** : actif depuis le 2026-09-25 · Remplace [direction-c-soleil-et-vie-locale.md](./direction-c-soleil-et-vie-locale.md), conservé comme trace. · **Outil de génération** : Google Stitch, export ensuite affiné dans Figma.

Ce document est un brief de conception d'interface. Génère les écrans décrits en partie 7, dans la direction artistique de la partie 6, en respectant les parties 4 et 5 à la lettre.

Stitch accepte ce fichier `.md` en pièce jointe mais ne produit qu'un écran par requête : joins le fichier, puis précise dans le message l'écran voulu (numéro et nom de la partie 7). Une conversation Stitch par écran. Demande d'abord le mobile ; une fois l'écran validé, redemande dans la même conversation la version ordinateur 1440 × 1024, en gardant le style et les contenus.

La direction artistique de la partie 6 est **déjà validée par le client** : elle est reprise telle quelle des maquettes approuvées le 2026-09-17. Ce qui change dans ce brief, c'est la marque, la hiérarchie de la page et le périmètre, pas le style.

## 1. Le produit

**Kibreeze** est une plateforme de découverte et d'expérience touristique à Kribi, au Cameroun. Sa signature est « Kribi is a feeling ».

Le visiteur découvre Kribi et ses activités, ajoute ce qui l'intéresse à un panier appelé « Mon séjour », voit un total estimatif, puis envoie sa demande à Kibreeze sur WhatsApp. Il n'y a ni paiement, ni compte utilisateur, ni réservation en ligne.

Quand quelqu'un arrive sur le site, il doit penser : « Je vais à Kribi, je veux découvrir ce qu'il y a à faire et organiser mon séjour. » Kibreeze est la réponse à ce besoin.

**TKS®** est une marque secondaire présente sur le site : c'est le pôle mobilité et transport (location de véhicules, location avec chauffeur, transferts, chauffeur privé, prestations professionnelles). Elle reste discrète et minimaliste, et sert surtout à compléter un séjour par le transport. Le site n'est pas le site de TKS.

## 2. Public et objectif

D'abord des expatriés et des touristes étrangers, puis des Camerounais de Douala et Yaoundé qui viennent passer un week-end à Kribi. Usage très majoritairement sur téléphone.

L'objectif unique est la conversion : que le visiteur écrive à Kibreeze sur WhatsApp avec une sélection de prestations. Mais avant le prix, il faut l'émotion : le site doit donner envie de venir à Kribi avant même que la personne commence à regarder les tarifs.

Priorité du parcours : **belle présentation → découverte → sélection → Mon séjour → demande WhatsApp**.

## 3. Architecture de l'information

Navigation principale, barre à onglets fixée en bas sur téléphone, cinq destinations :

**Accueil · Expériences · Hébergements · Formules · Mon séjour**

Barre du haut : logo Kibreeze à gauche, sélecteur « FR | EN », icône WhatsApp verte.

Secondaire, accessible depuis l'accueil et le pied de page, jamais dans la barre à onglets : **TKS® — Mobilité**, **À propos**, **Contact**.

Trois précisions qui structurent tout le reste :

- **« Expériences » est le catalogue unique des activités**, filtré par les trois catégories déjà arrêtées : Nature / Découverte, Aventure, Détente. Il n'y a pas de rubrique « Excursions » séparée : une excursion est une activité de la catégorie Nature / Découverte. Deux catalogues parallèles diviseraient un contenu qui n'existe qu'en un seul exemplaire.
- **« Formules » désigne les séjours packagés**, pas le panier. Le panier reste « Mon séjour ». Les deux mots ne doivent jamais se ressembler dans l'interface, sinon le visiteur confond la rubrique marketing et son propre panier.
- **La livraison n'existe pas sur ce site.** Aucune rubrique, aucun bloc, aucune mention, nulle part.

## 4. Contraintes non négociables

- Conception pour téléphone d'abord, écran de 390 × 844 pixels.
- La maquette est un instantané à une largeur donnée, mais le site final sera adaptatif, de 360 pixels à un grand écran. Conçois une mise en page capable de se réorganiser : colonnes qui s'empilent, largeurs proportionnelles plutôt que valeurs fixes, images qui se recadrent, libellés qui peuvent revenir à la ligne. Sur ordinateur, la grille passe à deux ou trois colonnes, la navigation s'ouvre en entier et le panier devient un panneau latéral.
- Évite tout ce qui ne tient qu'à cette largeur précise : élément positionné en absolu pour combler un vide, grille rigide, texte incrusté dans une image, bloc dont la hauteur est figée.
- Interface en français. Un sélecteur « FR | EN » visible dans la barre du haut, car le site existera aussi en anglais.
- Navigation mobile : la barre à onglets décrite en partie 3, sur toutes les pages. Pas de menu hamburger. Pas d'icône « Mon séjour » séparée dans la barre du haut : c'est l'onglet « Mon séjour » qui en tient lieu, avec sa pastille de comptage.
- Empilement en bas de l'écran, en partant du contenu : la barre à onglets tout en bas ; au-dessus d'elle, si la page en a une, la barre de prix / CTA fixe des fiches. Sur les pages qui ont déjà une CTA WhatsApp fixe en bas (fiches, Mon séjour), pas de bouton flottant en plus. Le bouton WhatsApp flottant n'apparaît que sur les pages sans CTA fixe (accueil, catalogues, contact, 404), ancré en bas à droite, avec au moins 16 pixels d'écart au-dessus de la barre à onglets. Rien ne se chevauche jamais.
- **Beaucoup de photographies, peu de texte.** C'est la contrainte la plus importante de ce brief. Grandes images de Kribi : mer, forêt, chutes, pirogues, plages, scènes de vie. Chaque section de l'accueil doit porter une image forte. Un écran qui ressemble à une page de présentation textuelle est raté, même si le contenu est juste.
- Trois façons d'afficher un prix, visuellement distinctes : un prix ferme « 70 000 FCFA », un prix de départ « À partir de 25 000 FCFA », et un badge « Sur devis » sans montant.
- Devise unique, le franc CFA, écrit « FCFA », avec une espace comme séparateur de milliers.
- Contraste conforme au niveau AA des règles d'accessibilité, zones tactiles d'au moins 44 pixels.
- Prévoir environ 30 % de longueur de texte en plus, car les libellés seront traduits en anglais.
- Les montants affichés sont des exemples. Ajoute la mention « tarifs fictifs » en petit dans un coin de chaque écran.
- N'invente aucune donnée ou promesse commerciale absente de ce brief : pas de délai de réponse garanti, pas de tarif dégressif, pas de note ou d'avis chiffré. Ce qui n'est pas écrit ici n'existe pas.

## 5. Microcopie exacte, à ne pas reformuler

- Accueil : « Découvrir les expériences », « Planifier mon séjour »
- Sur une fiche : « Ajouter à mon séjour », « Demander ce service »
- Panier : « Mon séjour », « Demander un devis », « Contacter Kibreeze sur WhatsApp »
- Prix : « À partir de », « Sur devis », « Disponibilité à confirmer »
- Sous un total : « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. »
- Signature de marque, toujours écrite ainsi : « Kribi is a feeling »
- La marque secondaire s'écrit toujours « TKS® », jamais « TKS » seul.

## 6. Direction artistique (validée, ne pas réinventer)

Chaleureuse, colorée, ancrée dans la vie locale.

- Couleurs : le **rouge du logo Kibreeze** (#A4021F) comme couleur de marque, un crème (#FFFAF3) pour les fonds, un terracotta (#A8431F) en accent chaud secondaire, un turquoise profond (#186962) en accent froid. Le vert est réservé au seul bouton WhatsApp. Le rouge est celui du logo réel : ne le remplace pas par un rouge plus vif ni par un orange.
- Le logo Kibreeze est un hexagone contenant un visage souriant, avec une pointe de bulle de discussion en bas, accompagné du mot « Kibreeze » en sans-serif gras arrondi. Utilise-le à plat, en aplat de couleur : jamais de dégradé brillant, jamais d'effet de relief ou de halo, même si on te fournit une version brillante.
- Typographies : un sans-serif au caractère marqué pour les titres, un sans-serif simple pour le texte courant, et une écriture manuscrite fine uniquement pour la signature « Kribi is a feeling ».
- Formes : cartes aux angles francs, blocs de couleur pleine, photographies cadrées serré sur les gens et les scènes de vie, petits motifs discrets en séparateurs. Rayons de coin nuls ou très légers seulement, jamais de boutons en forme de pilule.
- Sensation visée : accueil, proximité, énergie locale, envie de partir.
- Premium mais accessible, moderne, chaleureux, très touristique. Beaucoup d'espace, bien utilisé.

## 7. Écrans à produire

### Écran 1 — Accueil

C'est l'écran le plus important du site et celui qui change le plus. De haut en bas :

1. Barre du haut fixe : logo « Kibreeze » à gauche, sélecteur « FR | EN », icône WhatsApp verte.
2. **Hero immersif plein écran** : grande photographie de Kribi au soleil couchant, mer et végétation, assombrie juste ce qu'il faut pour la lisibilité. Dessus : le nom « KIBREEZE », la signature manuscrite « Kribi is a feeling », le titre « Découvrez Kribi autrement », et la phrase « Des expériences, des excursions et des séjours pensés pour vous faire vivre Kribi autrement. » Deux boutons : « Découvrir les expériences » en plein, « Planifier mon séjour » en contour. Le hero doit faire ressentir en une seconde : mer, nature, détente, aventure.
3. **Les trois catégories d'expériences**, en cartes visuelles plein format avec une photo forte chacune : « Nature / Découverte », « Aventure », « Détente ». Une phrase courte par carte, et le nombre d'activités.
4. **« Nos expériences à ne pas manquer »** : carrousel horizontal de quatre activités avec grande photo, nom, prix « À partir de X FCFA » et bouton « Ajouter à mon séjour ». Activités : Chutes de la Lobé, Excursion en pirogue, Jacuzzi naturel, Croisière.
5. **Bande immersive « Kribi, c'est… »** : une large photographie en pleine largeur (plage ou chutes), avec trois ou quatre mots-clés discrets posés dessus — mer, forêt, chutes, pirogue. Peu de texte, beaucoup d'image. C'est un moment de respiration visuelle, pas une section d'information.
6. **Hébergements** : deux ou trois cartes visuelles avec photo, nom, une ligne de description, et un lien « Voir les hébergements ».
7. **Formules** : deux cartes de séjours packagés, avec photo, titre (par exemple « Week-end découverte, 2 jours »), ce que la formule contient en trois puces maximum, prix « À partir de X FCFA », et un lien « Voir les formules ».
8. **TKS® — Mobilité**, section discrète et compacte, visuellement plus sobre que le reste : un bandeau ou une carte unique avec le logo TKS®, la mention « Mobilité & transport », une phrase « Location de véhicules, transferts et chauffeur privé pour compléter votre séjour », et un lien « Voir les services de mobilité ». Cette section ne doit jamais dominer l'écran ni ressembler aux cartes d'expériences.
9. **Bloc « À propos de Kibreeze »** : une photo, trois phrases, lien « En savoir plus ».
10. **Bloc de conversion sur fond de marque** : titre « Un séjour sur mesure ? », bouton « Contacter Kibreeze sur WhatsApp ».
11. Pied de page : logo Kibreeze, signature, liens (Expériences, Hébergements, Formules, TKS® — Mobilité, À propos, Contact), « Kribi, Cameroun », icônes de réseaux sociaux.
12. Barre à onglets fixe en bas : Accueil (actif), Expériences, Hébergements, Formules, Mon séjour avec pastille à 0. Bouton WhatsApp flottant en bas à droite, au-dessus de la barre, sans la toucher.

### Écran 2 — Catalogue « Expériences »

1. Bandeau plus court que le hero de l'accueil : photographie des chutes de la Lobé, titre « Expériences », phrase « Vivez des expériences uniques à Kribi ».
2. Onglets de catégories défilant horizontalement : « Toutes », « Nature / Découverte », « Aventure », « Détente ». « Toutes » est actif.
3. Grille d'activités, une colonne sur mobile, **avec de grandes photos** : la photo occupe la majeure partie de la carte. Neuf cartes : Chutes de la Lobé, Jacuzzi naturel, Excursion en pirogue, Découverte de Kribi, Jet-ski, Quad, Balade à cheval, Croisière, Feu de plage. Chaque carte : photo, nom, une phrase de description, prix, bouton « Voir les détails ». Varie les prix pour montrer les trois cas : « 45 000 FCFA », « À partir de 25 000 FCFA / personne », et un badge « Sur devis ». Mets un badge « Disponibilité à confirmer » sur une seule carte.
4. Bloc en bas : « Une envie particulière ? » avec le bouton « Contacter Kibreeze sur WhatsApp ».

Génère ensuite, dans la même conversation, l'état où l'onglet « Aventure » est actif et où seules les cartes Jet-ski, Quad et Balade à cheval restent affichées.

### Écran 3 — Fiche d'une activité, « Excursion en pirogue »

1. Fil d'Ariane : Expériences › Nature / Découverte › Excursion en pirogue.
2. Galerie : une grande photo, trois miniatures en dessous.
3. Titre, puis prix « À partir de 25 000 FCFA / personne » bien visible, suivi en petit de « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. »
4. Ligne d'informations avec icônes : durée « 2 à 3 heures », capacité « 1 à 10 personnes », lieu « Embouchure de la Lobé ».
5. Description en deux paragraphes courts.
6. Deux listes côte à côte : « Ce qui est inclus » avec des coches, « Ce qui n'est pas inclus » avec des croix.
7. Sélecteur de quantité : libellé « Nombre de personnes », bouton moins, valeur 2, bouton plus.
8. Barre fixe en bas de l'écran, au-dessus de la barre à onglets : total à gauche, bouton « Ajouter à mon séjour » à droite, et sous la barre un lien discret « Demander ce service ». Pas de bouton WhatsApp flottant sur cet écran.
9. Bande « Vous aimerez aussi » avec trois autres activités.

### Écran 4 — Mon séjour, état plein

1. Titre « Mon séjour », sous-titre « 4 prestations sélectionnées », lien discret « Vider mon séjour ».
2. Deux champs optionnels côte à côte, **vides** : « Dates du séjour » et « Nombre de voyageurs ». Sous eux, un rappel discret : « Ajoute tes dates pour une réponse plus rapide ». Ce rappel n'a de sens que parce que les champs sont vides : ne les pré-remplis pas.
3. Quatre lignes de sélection. Chaque ligne porte une vignette photo, le nom, la quantité avec son libellé, le prix de la ligne, une icône de suppression, et un sélecteur de quantité compact **seulement pour les trois premières** :
   - Excursion en pirogue, 2 personnes, à partir de 50 000 FCFA
   - Chutes de la Lobé, 2 personnes, 30 000 FCFA
   - Hébergement — Chambre, 3 nuits, à partir de 30 000 FCFA
   - TKS® — Transfert Douala → Kribi, badge « Sur devis », sans montant, **sans sélecteur de quantité** : seule la corbeille apparaît sur cette ligne
4. Encadré de total : « Total estimatif 110 000 FCFA » (50 000 + 30 000 + 30 000), puis « + 1 prestation sur devis », puis « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. »
5. Barre fixe en bas : bouton vert « Demander un devis par WhatsApp », et sous lui un lien « Continuer mes recherches ». Pas de bouton WhatsApp flottant sur cet écran.

Cet écran montre le cœur du produit : on peut mélanger dans un même séjour des activités, un hébergement et une prestation de mobilité TKS®.

### Écran 5 — Mon séjour, état vide et état sur devis

Dans la même conversation que l'écran 4, deux variantes.

État vide : une belle photographie de Kribi plutôt qu'une illustration abstraite, le titre « Votre séjour est vide », une phrase d'encouragement courte, un bouton « Découvrir les expériences ». Pas de liste, pas de total.

État sur devis uniquement : deux lignes portant le badge « Sur devis », sans montant ni sélecteur de quantité. À la place du total, « Total : sur devis (2 prestations) ». Le bouton du bas reste « Demander un devis par WhatsApp ».

### Écran 6 — Hébergements

Écran particulier : **ce n'est pas un catalogue de logements nommés**, c'est un choix par type et par budget. Le visiteur dit « je veux une chambre autour de 10 000 FCFA la nuit » ; Kibreeze cherche ensuite le logement disponible à ce prix chez ses partenaires. Aucun nom d'établissement, aucune photo d'un logement précis, car le logement exact n'est pas connu au moment du choix.

1. Bandeau court : photographie d'une terrasse ou d'une vue de Kribi au réveil, titre « Hébergements », phrase « Dites-nous votre budget, on trouve le logement ».
2. Une phrase d'explication courte, indispensable pour que le visiteur comprenne le principe : « Choisissez le type de logement et le budget qui vous convient. Nous cherchons ensuite la meilleure option disponible chez nos partenaires à Kribi. »
3. **Trois blocs de type de logement**, empilés : « Chambre », « Appartement », « Villa ». Chaque bloc porte une grande photographie d'ambiance (une chambre, un salon d'appartement, une villa — des images génériques et honnêtes, pas un établissement identifiable), le nom du type, une ligne de description, la capacité indicative (« 1 à 2 personnes », « 2 à 6 personnes », « 6 à 12 personnes »).
4. Dans chaque bloc, **deux ou trois choix de budget en boutons**, avec un prix repère par nuit, et un bouton « Ajouter à mon séjour » par choix :
   - Chambre : « À partir de 10 000 FCFA / nuit », « À partir de 15 000 FCFA / nuit »
   - Appartement : « À partir de 35 000 FCFA / nuit », « À partir de 50 000 FCFA / nuit »
   - Villa : « À partir de 150 000 FCFA / nuit »
5. **En bas, une section visuellement distincte** et plus sobre : « Plus grand, plus haut de gamme ? », avec une phrase « Appartements et villas d'exception, jusqu'à 300 000 FCFA la nuit », et le bouton « Contacter Kibreeze sur WhatsApp ». Le haut de gamme ne doit jamais apparaître avant les prix standards : c'est une demande explicite du client, pour ne pas faire fuir le visiteur avec un montant élevé en premier.
6. Sous les prix, la mention habituelle : « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. »

Génère aussi, dans la même conversation, l'état où une ligne d'hébergement vient d'être ajoutée : un retour visuel discret confirmant « Chambre, 10 000 FCFA / nuit, ajoutée à votre séjour ».

### Écran 7 — Formules

1. Bandeau court : photographie de plage au lever du jour, titre « Formules », phrase « Des séjours déjà composés, à ajuster avec nous ».
2. Trois cartes verticales de formule, chacune avec une grande photo, un titre (« Week-end découverte, 2 jours », « Kribi aventure, 3 jours », « Détente en famille, 4 jours »), trois puces maximum décrivant ce que la formule contient, un prix « À partir de X FCFA / personne », et un bouton « Ajouter à mon séjour ».
3. Sous les cartes, une phrase : « Chaque formule est ajustable : dites-nous ce que vous voulez changer. »

### Écran 8 — TKS® — Mobilité

Écran volontairement plus sobre que le reste du site, pour montrer que ce pôle est secondaire.

1. Bandeau court avec le logo TKS® et le titre « TKS® — Mobilité & transport », phrase « Location, transferts et chauffeur privé pour compléter votre séjour ».
2. Liste compacte de cinq services, en lignes plutôt qu'en grandes cartes photo : Location de véhicules, Location avec chauffeur, Transferts, Chauffeur privé, Prestations professionnelles. Chaque ligne : petite vignette, nom, une phrase, prix ou badge « Sur devis », bouton « Voir les détails ».
3. Bloc en bas : « Besoin d'un transport sur mesure ? » avec le bouton « Contacter Kibreeze sur WhatsApp ».

Aucune photographie plein écran ici, aucune mise en scène : c'est une rubrique utilitaire.

### Écran 9 — Contact

1. Bandeau court avec une photo de Kribi et le titre « Contactez Kibreeze ».
2. Carte principale mise en avant : icône WhatsApp, titre « Écrivez-nous sur WhatsApp », phrase « Réponse rapide, 7 j / 7 », numéro « +237 697 13 53 88 », bouton vert « Contacter Kibreeze sur WhatsApp ».
3. Sous elle, deux blocs simples : « Téléphone » et « E-mail ».
4. Bloc « Où nous trouver » : « Kribi, Cameroun », avec une image de carte stylisée, sans service de cartographie interactif.
5. Icônes des réseaux sociaux.
6. Pas de formulaire de contact.

### Écran 10 — Page 404

1. Barre du haut et barre à onglets identiques aux autres pages.
2. Centre : une photographie lumineuse de Kribi, le titre « Cette page s'est perdue en route vers Kribi », une phrase courte, un bouton plein « Retour à l'accueil » et un lien « Découvrir les expériences ».
3. Bouton WhatsApp flottant en bas à droite.

### Écran 11 — Accueil et fiche en anglais

Régénère l'écran 1 et l'écran 3 avec « EN » actif, titres et boutons traduits, prix toujours en FCFA. La signature « Kribi is a feeling » et les noms de marque « Kibreeze » et « TKS® » ne se traduisent pas. Objectif : vérifier que les libellés anglais, plus longs d'environ 30 %, ne cassent pas la mise en page.

## 8. Ne génère pas

Pas de rubrique, de bloc ni de mention de **livraison**, nulle part. Pas d'avis ni de notes clients. Pas de formulaire de contact. Pas de prix en euros. Pas de paiement, pas de connexion, pas de compte utilisateur, pas de bandeau de cookies. Pas de menu hamburger. Pas de rubrique « Excursions » distincte des Expériences. Pas de promesse commerciale, de délai garanti ou de remise qui ne figure pas dans ce brief. Ne mets jamais TKS® en tête d'affiche.

## 9. Nommage et variables

- Nomme les écrans « 01 Accueil », « 02 Expériences », « 03 Fiche pirogue », « 04 Mon séjour plein », « 05 Mon séjour vide », « 06 Hébergements », « 07 Formules », « 08 TKS Mobilité », « 09 Contact », « 10 404 », « 11 Accueil EN », suffixés « mobile » ou « desktop ».
- Déclare les couleurs et les typographies comme variables réutilisables, nommées par leur rôle et non par leur teinte : `brand`, `brand-contrast`, `accent`, `bg`, `bg-muted`, `fg`, `fg-muted`, `border`, `success`, `warning`, `danger`.
- Utilise une grille d'espacement de 4 points et des rayons cohérents.
- Regroupe en composants réutilisables : bouton, carte d'expérience, étiquette de prix, badge, sélecteur de quantité, ligne de séjour, barre fixe, barre à onglets.

## 10. Ce que ce brief ne tranche pas

Les écrans 6 et 7 sont dessinés avec des contenus d'exemple, ce qui ne préjuge pas du contenu réel.

- **Hébergements** : confirmés le 2026-09-25 (vocal, voir [audio-transcript.md](../audio-transcript.md)). Le modèle est un choix **par type et par prix repère**, pas un catalogue de logements nommés : Kibreeze trouve le logement chez ses partenaires après la demande. Les montants de l'écran 6 sont ceux cités de vive voix par Franck, donc des exemples parlés et non une grille validée. À confirmer avant mise en ligne.
- **Formules** : aucune formule composée n'est confirmée à ce jour. Si Franck n'en fournit pas au moins deux avec contenu et prix, cette rubrique sort de la barre à onglets et ne reste qu'une section de l'accueil.
- **Excursions** : ce brief les fond dans les Expériences (partie 3). Si Franck tient à une rubrique distincte, il faut d'abord qu'il dise ce qui distingue une excursion d'une activité.
