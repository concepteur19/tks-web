# Prompts de génération d'interfaces

**Statut** : vivant · **Créé le** : 2026-09-16 · Complète [design-system.md](./design-system.md)

Ces prompts servent à générer les maquettes à présenter à Franck, dans Figma (Make ou First Draft) ou dans un autre générateur d'interfaces. Ils traduisent le cahier des charges, les réponses du client et les exigences `FR-*` en instructions directement utilisables.

## Comment s'en servir

1. Choisir une **direction artistique** dans la section 4. En générer une par direction, sans changer le reste du prompt, pour que Franck compare des styles et non des contenus différents.
2. Coller le **bloc de contexte** de la section 2, puis le prompt de l'écran voulu de la section 3, dans le même message.
3. Générer les écrans dans cet ordre : accueil, page pôle, fiche, Mon séjour, contact. L'accueil fixe le style, les autres écrans le reprennent.
4. Générer en priorité le **mobile**, puis demander la version desktop du même écran.
5. Vérifier avec la checklist de la section 6 avant d'envoyer quoi que ce soit à Franck.

Adaptations selon l'outil : dans Figma Make, coller contexte et écran en une seule fois, puis demander les variantes. Dans un outil qui ne traite qu'un écran par requête, recoller le bloc de contexte à chaque fois.

---

## 1. Ce que le générateur doit savoir du produit

TKS® est une entreprise de Kribi, au Cameroun, qui réunit trois activités : le transport, le tourisme et la livraison. Sa signature est « Kribi is a feeling ». Le site doit donner envie d'organiser une expérience à Kribi, pas ressembler à un loueur de voitures.

Le visiteur parcourt les services, en ajoute plusieurs à un panier appelé « Mon séjour », voit une estimation de prix, puis envoie sa demande à TKS sur WhatsApp. Il n'y a ni paiement, ni compte, ni réservation en ligne.

---

## 2. Bloc de contexte à coller en tête de chaque prompt

```text
Tu conçois les maquettes d'un site vitrine interactif pour TKS®, une entreprise
de Kribi au Cameroun qui propose du transport, du tourisme et de la livraison.
Signature de marque : « Kribi is a feeling ».

Objectif du site : le visiteur découvre les services, en ajoute plusieurs à un
panier appelé « Mon séjour », voit un total estimatif, puis envoie sa demande à
TKS sur WhatsApp. Pas de paiement, pas de compte, pas de réservation en ligne.

Public : d'abord des expatriés et des touristes étrangers, puis des Camerounais
de Douala et Yaoundé qui viennent en week-end. Usage très majoritairement mobile.

Contraintes non négociables :
- Mobile d'abord : écran 390 × 844. Version desktop 1440 × 1024 ensuite.
- Interface en français. Un sélecteur de langue « FR | EN » visible dans la
  navigation, car le site sera aussi en anglais.
- Un bouton WhatsApp vert accessible en permanence : dans la navigation sur
  desktop, en bouton flottant en bas à droite sur mobile.
- Beaucoup de photographies de Kribi : mer, chutes, pirogues, nature, véhicules.
  Peu de texte.
- Trois types de prix à distinguer visuellement :
  « 70 000 FCFA », « À partir de 25 000 FCFA », et un badge « Sur devis ».
- Devise unique : le franc CFA, écrit « FCFA », séparateur de milliers par espace.
- Contraste conforme WCAG AA, zones tactiles d'au moins 44 px, libellés lisibles.
- Prévoir 30 % de longueur de texte en plus, car la version anglaise sera
  traduite depuis le français.

Microcopie exacte à utiliser, sans la reformuler :
- « Découvrir nos services », « Planifier mon séjour »
- « Ajouter à mon séjour », « Demander ce service »
- « Mon séjour », « Demander un devis », « Contacter TKS sur WhatsApp »
- « À partir de », « Sur devis », « Disponibilité à confirmer »
- « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. »

Les montants affichés sont des exemples : ajoute la mention « tarifs fictifs »
en petit dans un coin de la maquette.

Ne génère pas : avis ou notes clients, formulaire de contact, page de packs ou
de formules, hébergements, prix en euros, paiement, connexion, bandeau cookies.
```

---

## 3. Prompts par écran

### 3.1 Accueil

```text
Écran : page d'accueil, mobile 390 × 844, à dérouler en pleine hauteur.

Structure de haut en bas :
1. Barre de navigation fixe : logo « TKS® » à gauche, sélecteur « FR | EN »,
   icône « Mon séjour » avec une pastille indiquant 0, bouton WhatsApp vert.
   Menu hamburger donnant Transport, Tourisme, Livraison, À propos, Contact.
2. Grande image plein écran d'une plage de Kribi au soleil couchant, avec un
   voile sombre pour la lisibilité. Titre « Découvrez Kribi autrement »,
   signature manuscrite « Kribi is a feeling », sous-titre
   « Transport • Tourisme • Livraison ». Deux boutons : « Découvrir nos
   services » en plein, « Planifier mon séjour » en contour.
3. Trois cartes d'accès aux pôles, empilées sur mobile : Transport, Tourisme,
   Livraison. Chacune a une photo, un titre, une phrase courte et un lien
   « Voir nos services ».
4. Bande « Pourquoi choisir TKS ? » avec quatre arguments et une icône chacun :
   réactivité, équipe locale, expérience sur mesure, plusieurs services réunis.
5. Section « Nos expériences » : carrousel de quatre activités mises en avant,
   avec photo, nom, prix « À partir de X FCFA » et bouton
   « Ajouter à mon séjour ». Activités : Chutes de la Lobé, Excursion en
   pirogue, Jacuzzi naturel, Croisière.
6. Bloc « À propos de TKS » : une photo d'équipe, trois phrases, lien
   « En savoir plus ».
7. Bloc de conversion : fond de marque, titre « Un besoin particulier ? »,
   bouton « Contacter TKS sur WhatsApp ».
8. Pied de page : logo, signature, liens des trois pôles, coordonnées
   « Kribi, Cameroun », icônes de réseaux sociaux, mention légale.
9. Bouton WhatsApp flottant en bas à droite, au-dessus du contenu.
```

### 3.2 Page d'un pôle, exemple Tourisme

```text
Écran : page « Tourisme », mobile 390 × 844.

1. Bandeau plus court que celui de l'accueil : photo des chutes de la Lobé,
   titre « Tourisme », phrase « Vivez des expériences uniques à Kribi ».
2. Onglets de catégories défilant horizontalement : « Tous »,
   « Nature / Découverte », « Aventure », « Détente ». « Tous » est actif.
3. Grille d'activités, une colonne sur mobile et trois sur desktop. Neuf cartes :
   Chutes de la Lobé, Jacuzzi naturel, Excursion en pirogue, Découverte de
   Kribi, Jet-ski, Quad, Balade à cheval, Croisière, Feux de plage.
   Chaque carte : photo en haut, nom, une phrase de description, prix, bouton
   « Voir les détails ».
   Varie les prix pour montrer les trois cas : « 45 000 FCFA »,
   « À partir de 25 000 FCFA / personne », et un badge « Sur devis ».
   Mets un badge « Disponibilité à confirmer » sur une seule carte.
4. Bloc en bas : « Besoin d'une expérience sur mesure ? » avec le bouton
   « Contacter TKS sur WhatsApp ».

Montre aussi l'état où l'onglet « Aventure » est actif et où seules trois
cartes restent affichées.
```

### 3.3 Fiche d'une activité

```text
Écran : fiche « Excursion en pirogue », mobile 390 × 844.

1. Fil d'Ariane : Tourisme › Nature / Découverte › Excursion en pirogue.
2. Galerie : une grande photo et trois miniatures sous elle.
3. Titre, puis prix « À partir de 25 000 FCFA / personne » bien visible, suivi
   en petit de « Prix indicatif, sous réserve de disponibilité et de
   confirmation par TKS. »
4. Ligne d'informations avec icônes : durée « 2 à 3 heures », capacité
   « 1 à 10 personnes », lieu « Embouchure de la Lobé ».
5. Description en deux paragraphes courts.
6. Deux colonnes : « Ce qui est inclus » et « Ce qui n'est pas inclus », en
   listes à puces avec une coche et une croix.
7. Sélecteur de quantité : libellé « Nombre de personnes », bouton moins,
   champ affichant 2, bouton plus.
8. Barre fixe en bas de l'écran : le prix total à gauche, bouton
   « Ajouter à mon séjour » à droite, et sous lui un lien discret
   « Demander ce service » qui écrit directement sur WhatsApp.
9. Sous la barre, une bande « Vous aimerez aussi » avec trois autres activités.

Génère une seconde version de cette fiche pour « Location avec chauffeur », du
pôle Transport, avec deux sélecteurs côte à côte : « Véhicules » réglé sur 2 et
« Jours » réglé sur 3, et un prix « À partir de 50 000 FCFA / jour ». Le total
affiché dans la barre du bas vaut alors 300 000 FCFA.
```

### 3.4 Mon séjour

```text
Écran : page « Mon séjour », mobile 390 × 844. Génère trois états.

État plein :
1. Titre « Mon séjour », sous-titre « 4 prestations sélectionnées », lien
   « Vider mon séjour » discret.
2. Deux champs optionnels côte à côte : « Dates du séjour » et
   « Nombre de voyageurs ». Sous eux, un rappel discret, non bloquant :
   « Ajoute tes dates pour une réponse plus rapide ».
3. Liste des lignes. Chaque ligne : vignette photo, nom, quantité avec son
   libellé, prix de la ligne, un sélecteur de quantité compact et une icône
   de suppression. Contenu :
   - Transfert Douala → Kribi, 1 véhicule, 70 000 FCFA
   - Excursion en pirogue, 2 personnes, à partir de 50 000 FCFA
   - Location avec chauffeur, 2 véhicules × 3 jours, à partir de 300 000 FCFA
   - Transport professionnel, badge « Sur devis », sans montant
4. Encadré de total : « Total estimatif 420 000 FCFA », en dessous
   « + 1 prestation sur devis », puis la mention « Prix indicatif, sous réserve
   de disponibilité et de confirmation par TKS. »
5. Barre fixe en bas : bouton principal vert « Demander un devis par WhatsApp »,
   et sous lui un lien « Continuer mes recherches ».

État vide : une illustration ou une photo douce, le titre « Votre séjour est
vide », une phrase d'encouragement, et un bouton « Découvrir nos expériences ».

État sur devis uniquement : deux lignes portant le badge « Sur devis », et à la
place du total la mention « Total : sur devis (2 prestations) ».
```

### 3.5 Contact

```text
Écran : page « Contact », mobile 390 × 844.

1. Bandeau court avec une photo de Kribi et le titre « Contactez TKS ».
2. Carte principale mise en avant : icône WhatsApp, titre
   « Écrivez-nous sur WhatsApp », phrase « Réponse rapide, 7 j / 7 »,
   numéro « +237 697 13 53 88 », bouton vert « Contacter TKS sur WhatsApp ».
3. Sous elle, deux blocs simples : « Téléphone » et « E-mail ».
4. Bloc « Où nous trouver » : « Kribi, Cameroun », avec une image de carte
   stylisée, sans service de cartographie interactif.
5. Icônes des réseaux sociaux.
6. Pas de formulaire de contact.
```

### 3.6 Écrans à générer en anglais

Une fois la direction choisie, régénérer l'accueil et une fiche en anglais, avec « EN » actif dans le sélecteur, les titres traduits, et les prix toujours en FCFA. Cela permet de vérifier que les libellés plus longs ne cassent pas la mise en page.

---

## 4. Les trois directions artistiques à proposer

Générer les mêmes écrans dans chaque direction. Ne changer que le bloc ci-dessous.

### Direction A — Mer et sable, clair et apaisant

```text
Direction artistique : lumineuse et aérée, inspirée de l'océan et du sable.
Couleurs : bleu profond de l'Atlantique pour les éléments de marque, sable
clair et blanc cassé pour les fonds, corail chaud pour les accents.
Le vert reste réservé au seul bouton WhatsApp.
Typographies : un sans-serif géométrique pour les titres, un sans-serif humaniste
très lisible pour le texte, et une écriture manuscrite fine pour la seule
signature « Kribi is a feeling ».
Formes : coins largement arrondis, cartes posées sur fond clair avec une ombre
douce, beaucoup d'espace blanc, photos en grand format.
Sensation visée : vacances, calme, confiance.
```

### Direction B — Nuit tropicale, contrastée et premium

```text
Direction artistique : sombre et élégante, un tourisme haut de gamme accessible.
Couleurs : vert forêt très foncé et nuit profonde pour les fonds, blanc cassé
pour le texte, doré sable pour les accents et les prix.
Le vert du bouton WhatsApp reste le vert de la marque WhatsApp.
Typographies : une serif contemporaine pour les titres, un sans-serif neutre
pour le texte.
Formes : coins peu arrondis, cartes à bordure fine plutôt qu'à ombre, photos en
pleine largeur avec dégradé sombre, lettrage espacé pour les intertitres.
Sensation visée : expérience soignée, prestation de qualité, exclusivité.
```

### Direction C — Soleil et vie locale, chaleureuse et vivante

```text
Direction artistique : chaleureuse, colorée, ancrée dans la vie locale.
Couleurs : terracotta et orange soleil en couleurs de marque, crème pour les
fonds, turquoise pour les accents secondaires.
Le vert reste réservé au bouton WhatsApp.
Typographies : un sans-serif au caractère marqué pour les titres, un sans-serif
simple pour le texte.
Formes : cartes aux angles francs, blocs de couleur pleine, photos cadrées
serré sur les gens et les scènes de vie, petites illustrations ou motifs
discrets en séparateurs.
Sensation visée : accueil, proximité, énergie locale.
```

---

## 5. Instructions de sortie

À ajouter à la fin du prompt quand l'outil le permet.

```text
Sortie attendue :
- Nomme les écrans ainsi : « 01 Accueil », « 02 Tourisme », « 03 Fiche »,
  « 04 Mon séjour », « 05 Contact », suffixés « mobile » ou « desktop ».
- Déclare les couleurs et les typographies comme variables réutilisables, avec
  des noms de rôle et non de teinte : brand, brand-contrast, accent, bg,
  bg-muted, fg, fg-muted, border, success, warning, danger.
- Utilise une grille d'espacement de 4 points et des rayons cohérents.
- Regroupe les éléments répétés en composants : bouton, carte de service,
  étiquette de prix, badge, sélecteur de quantité, ligne de séjour, barre fixe.
```

Ces noms de variables sont ceux du futur fichier de tokens du site. Les reprendre dans Figma évite un travail de traduction au moment d'intégrer le design.

---

## 6. Checklist avant de montrer à Franck

- Les trois directions montrent exactement le même contenu, seuls les styles diffèrent.
- Le bouton WhatsApp est visible sans défiler, sur chaque écran.
- Les trois types de prix apparaissent au moins une fois chacun.
- La mention de prix indicatif est présente sur la fiche et sur Mon séjour.
- Le sélecteur de langue est visible partout.
- La fiche transport montre bien deux sélecteurs de quantité.
- Mon séjour existe dans ses trois états, dont l'état vide.
- Aucun avis client, aucun prix en euros, aucun formulaire de contact.
- La mention « tarifs fictifs » figure sur les maquettes.
- Les noms des activités sont ceux de la liste validée par Franck, sans invention.

## 7. Après le choix de Franck

1. Affiner la direction retenue dans Figma, en corrigeant contrastes et espacements.
2. Exporter les variables de couleur et de typographie.
3. Reporter ces valeurs dans `src/styles/tokens.css`, en remplaçant les valeurs marquées `[PLACEHOLDER]` de [design-system.md](./design-system.md).
4. Vérifier les contrastes, puis produire les écrans manquants : 404, états de chargement, menu mobile ouvert.
