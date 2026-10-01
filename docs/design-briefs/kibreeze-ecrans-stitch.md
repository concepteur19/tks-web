# Kibreeze — les 8 écrans, prompts Stitch détaillés

**Statut** : actif · **Date** : 2026-09-28 · Complète [kibreeze-brief.md](./kibreeze-brief.md), qui reste le document de référence sur la marque et la direction artistique.

Ce fichier contient huit prompts prêts à coller, un par écran. Ils sont volontairement longs : sur Stitch, la qualité du rendu est proportionnelle à la précision du brief. Un prompt vague produit une page de présentation générique ; un prompt qui nomme les contenus, les proportions et les interdits produit un écran exploitable.

## Mode d'emploi

1. **Une conversation Stitch par écran.** Ne jamais demander deux écrans dans la même requête : Stitch dilue le style et abandonne des contraintes.
2. **Joindre [kibreeze-brief.md](./kibreeze-brief.md)** en pièce jointe, puis coller le bloc commun ci-dessous, puis le prompt de l'écran.
3. **Générer le mobile d'abord** (390 × 844). Une fois l'écran validé, demander l'ordinateur dans la même conversation avec la phrase de la section « Version ordinateur ».
4. **Générer dans l'ordre 1 à 8.** L'accueil fixe le style ; les suivants s'y réfèrent.
5. Corriger par retouches ciblées (« garde tout, mais… »), jamais en relançant l'écran entier.

Les montants viennent du **guide tarifaire du 2026-09-26**. Ce sont les vrais prix de Kibreeze, pas des exemples : ne pas les modifier. Seul le jet-ski est en attente d'arbitrage, il n'apparaît donc avec aucun montant.

---

## Bloc commun — à coller en tête de chaque écran

```text
CONTEXTE
Tu conçois une maquette d'interface pour Kibreeze, une marque de tourisme et
d'expériences à Kribi, au Cameroun. Signature : « Kribi is a feeling ».
Le visiteur découvre des expériences, en ajoute à un panier appelé « Mon séjour »,
voit un total estimatif, puis envoie sa demande sur WhatsApp. Pas de paiement,
pas de compte utilisateur, pas de réservation en ligne.

Public : d'abord des expatriés et des touristes étrangers, puis des Camerounais
de Douala et Yaoundé en week-end. Usage très majoritairement sur téléphone.

FORMAT
Téléphone, 390 × 844 pixels. Conçois une mise en page adaptative : colonnes qui
s'empilent, largeurs proportionnelles, images qui se recadrent, libellés qui
peuvent revenir à la ligne. Aucun élément positionné en absolu pour combler un
vide, aucune hauteur figée, aucun texte incrusté dans une image.

DIRECTION ARTISTIQUE
Chaleureuse, ancrée dans la vie locale, premium mais accessible.
- Rouge de marque #A4021F. Fonds crème #FFFAF3. Gris de texte #1C1917,
  texte secondaire #57534E. Accent chaud terracotta #A8431F.
  Accent froid turquoise #186962, réservé aux badges d'information.
  Vert #25D366 réservé au seul bouton WhatsApp, nulle part ailleurs.
- Angles francs. Rayons de coin de 0 à 4 pixels maximum sur les cartes, les
  images et les boutons. Aucun bouton en forme de pilule, aucun coin très
  arrondi : c'est ce qui distingue cette marque d'un site de voyage générique.
- Blocs de couleur pleine, aplats, aucun dégradé, aucune ombre portée marquée.
- Titres en sans-serif gras au caractère affirmé, texte courant en sans-serif
  simple et très lisible. Écriture manuscrite fine uniquement pour la signature
  « Kribi is a feeling », nulle part ailleurs.
- Grille d'espacement de 4 points. Gouttière latérale de 16 pixels minimum.
- Photographies nombreuses et grandes, cadrées serré sur les gens, l'eau, la
  végétation. Peu de texte. Une maquette qui ressemble à une page de
  présentation textuelle est ratée, même si le contenu est juste.

NAVIGATION, IDENTIQUE SUR TOUS LES ÉCRANS
- Barre du haut fixe : logo « Kibreeze » à gauche, sélecteur « FR | EN »,
  petite icône WhatsApp verte. Rien d'autre. Pas d'icône panier ici, pas de
  menu hamburger, pas d'icône ressemblant à un compte utilisateur.
- Barre à onglets fixe en bas, cinq destinations, toujours dans cet ordre :
  Accueil, Expériences, Hébergements, Formules, Mon séjour. L'onglet
  « Mon séjour » porte une pastille de comptage. L'onglet de la page courante
  est actif, en rouge de marque.
- Empilement en bas de l'écran, du contenu vers le bas : barre de prix fixe de
  la page si elle en a une, puis la barre à onglets tout en bas. Le bouton
  WhatsApp flottant n'existe QUE sur les pages sans barre de prix fixe, ancré
  en bas à droite, avec au moins 16 pixels d'écart au-dessus de la barre à
  onglets. Rien ne se chevauche jamais.

RÈGLES DE PRIX
Trois formes visuellement distinctes :
  prix ferme « 25 000 FCFA », prix de départ « À partir de 15 000 FCFA »,
  et un badge « Sur devis » sans montant.
Devise FCFA, séparateur de milliers par une espace. Sous chaque prix, en petit
gris, l'équivalent indicatif en euros : 1 000 FCFA ≈ 1,52 €.

ACCESSIBILITÉ
Contraste WCAG AA. Zones tactiles d'au moins 44 pixels. Prévoir 30 % de
longueur de texte en plus, les libellés seront traduits en anglais.

INTERDITS ABSOLUS
Pas de rubrique ni de mention de livraison. Pas d'avis, de notes ou d'étoiles.
Pas de formulaire de contact. Pas de prix en dollars. Pas de paiement, pas de
connexion, pas de bandeau de cookies. Pas de menu hamburger. Pas de promesse
commerciale absente de ce brief : aucun délai de réponse garanti, aucune
remise, aucun « meilleur prix ». Ne mets jamais TKS en tête d'affiche.
```

---

## Écran 1 — Accueil

L'écran le plus important. Il doit donner envie de venir à Kribi avant que le visiteur regarde un seul prix.

```text
ÉCRAN 1 — ACCUEIL, page longue à faire défiler.

1. HERO, plein écran, environ 85 % de la hauteur visible.
   Photographie d'une plage de Kribi au soleil couchant : sable sombre et
   humide au premier plan, vagues basses, cocotiers penchés en silhouette à
   droite, ciel orange et rose. Voile sombre dégradé du bas vers le haut pour
   la lisibilité, jamais uniforme.
   Dessus, alignés à gauche, ancrés dans le tiers bas :
     - le mot « KIBREEZE » en capitales, très grand, blanc crème ;
     - juste en dessous, « Kribi is a feeling » en écriture manuscrite fine ;
     - un titre « Découvrez Kribi autrement », gras, deux lignes maximum ;
     - une phrase en corps courant, trois lignes maximum : « Des expériences,
       des excursions et des séjours pensés pour vous faire vivre Kribi
       autrement. » ;
     - deux boutons côte à côte, pleine largeur sur mobile, empilés si
       nécessaire : « Découvrir les expériences » en aplat rouge de marque,
       « Planifier mon séjour » en contour blanc sur fond transparent.
   Un petit chevron animé en bas du hero invite à faire défiler.

2. LES TROIS CATÉGORIES, sur fond crème, titre de section « Nos expériences ».
   Trois cartes empilées, chacune haute d'environ 200 pixels, photo en fond
   couvrant toute la carte, voile sombre, texte en surimpression :
     - « Nature & Découverte » — photo des chutes de la Lobé se jetant dans
       l'océan — « 6 expériences »
     - « Aventure » — photo d'un quad sur le sable ou d'un jet-ski en mouvement
       — « 3 expériences »
     - « Détente » — photo d'un feu de plage au crépuscule — « 3 expériences »
   Chaque carte est entièrement cliquable, avec une flèche discrète à droite.

3. EXPÉRIENCES MISES EN AVANT, titre « À ne pas manquer ».
   Carrousel horizontal, cartes de 280 pixels de large, débordant légèrement
   du bord droit de l'écran pour signaler qu'on peut faire défiler.
   Quatre cartes, photo en haut occupant les deux tiers de la carte, puis nom,
   une ligne de description, prix, et un bouton « Ajouter à mon séjour » :
     - Chutes de la Lobé — « La seule cascade au monde qui se jette dans
       l'océan » — 5 000 FCFA / personne
     - Excursion en pirogue — « Remontez la Lobé entre mangrove et forêt » —
       35 000 FCFA / groupe
     - Croisière en bateau — « Le coucher de soleil vu du large » —
       25 000 FCFA / personne
     - Campement Bagyeli — « À la rencontre du peuple de la forêt » —
       7 500 FCFA / personne

4. BANDE IMMERSIVE, pleine largeur, sans marge latérale, hauteur 280 pixels.
   Photographie large de la Lobé vue depuis une pirogue. Par-dessus, centrés,
   quatre mots séparés par des points médians, en capitales espacées, blancs :
   MER · FORÊT · CHUTES · PIROGUE. Aucun bouton, aucun autre texte. C'est une
   respiration visuelle, pas une section d'information.

5. HÉBERGEMENTS, sur fond crème, titre « Où dormir à Kribi ».
   Une phrase d'introduction : « Dites-nous votre budget, nous trouvons le
   logement. » Puis trois cartes côte à côte en défilement horizontal :
   « Chambre — à partir de 15 000 FCFA / nuit », « Studio — à partir de
   30 000 FCFA / nuit », « Villa — à partir de 150 000 FCFA / nuit », chacune
   avec une photo d'intérieur chaleureux. Lien « Voir tous les hébergements ».

6. FORMULES, sur fond terracotta en aplat, texte crème pour contraster avec le
   reste de la page. Titre « Des séjours déjà composés ». Deux cartes claires
   posées sur ce fond :
     - « Package Découverte » — « Chutes, pirogue, campement, musée, guide » —
       100 000 FCFA / 2 personnes
     - « Package Aventure » — « Chutes, pirogue, quad, jet-ski, kayak,
       cheval » — 150 000 FCFA / 2 personnes
   Lien « Voir les 4 formules ».

7. TKS® — MOBILITÉ. Section volontairement sobre et compacte, hauteur réduite,
   fond gris très clair, PAS de photographie en fond, PAS le traitement visuel
   des cartes d'expérience. Une seule ligne horizontale : à gauche le logo
   TKS®, au centre « Mobilité & transport » puis « Location, transferts et
   chauffeur privé pour compléter votre séjour », à droite un lien « Voir ».
   Cette section ne doit jamais attirer l'œil plus que les expériences.

8. À PROPOS, fond crème, titre « Qui sommes-nous ».
   Une grande photographie de Kribi — un paysage, pas une équipe. À côté ou en
   dessous, ce texte exact, sans le reformuler :
   « Nous sommes Kibreeze, une marque dédiée à la découverte et aux expériences
   à Kribi. Nous voulons vous faire découvrir Kribi autrement, à travers ses
   paysages, ses activités, ses excursions et des expériences adaptées à vos
   envies. »
   Lien « En savoir plus ».

9. BLOC DE CONVERSION, fond rouge de marque en aplat, texte crème.
   Titre « Un séjour sur mesure ? », une phrase, et un bouton vert WhatsApp
   « Contacter Kibreeze sur WhatsApp ».

10. PIED DE PAGE, fond gris très sombre, texte crème.
    Logo Kibreeze, signature manuscrite, puis trois colonnes de liens :
    Expériences / Hébergements / Formules, puis Mobilité TKS® / À propos /
    Contact. En dessous « Kribi, Cameroun », les icônes de réseaux sociaux, et
    une ligne fine et discrète : « Kibreeze est une marque de Breezy Groupe,
    avec TKS®, iBreezy et Breezy Delivery. »

11. Bouton WhatsApp flottant vert en bas à droite, au-dessus de la barre à
    onglets, sans la toucher. Barre à onglets avec « Accueil » actif et la
    pastille de Mon séjour à 0.

Ajoute la mention « tarifs indicatifs » en petit dans un coin.
```

---

## Écran 2 — Expériences

```text
ÉCRAN 2 — CATALOGUE « EXPÉRIENCES ».

1. Bandeau court, 220 pixels de haut : photographie des chutes de la Lobé,
   voile sombre, titre « Expériences » et la phrase « Vivez Kribi autrement ».

2. Onglets de catégories en défilement horizontal, collants sous la barre du
   haut quand on fait défiler : « Toutes » (actif), « Nature & Découverte »,
   « Aventure », « Détente ». L'onglet actif est souligné d'un trait rouge
   épais, pas d'une pilule colorée.

3. Grille d'expériences, une colonne sur mobile, cartes à photo dominante :
   l'image occupe environ 60 % de la hauteur de la carte, cadrée serré.
   Sous la photo : le nom en gras, une ligne de description, le prix, et un
   bouton « Voir les détails » discret en contour.
   Les douze cartes, dans cet ordre, avec ces prix exacts :
     - Chutes de la Lobé — 5 000 FCFA / personne
     - Excursion en pirogue — 35 000 FCFA / groupe — badge turquoise
       « 8 personnes max »
     - Excursion en chaloupe — 65 000 FCFA / groupe — badge « 8 personnes max »
     - Campement Bagyeli — À partir de 7 500 FCFA / personne
     - Jacuzzi naturel — 5 000 FCFA / personne
     - Croisière en bateau — 25 000 FCFA / personne
     - Feu de plage — 50 000 FCFA / groupe
     - Quad — 10 000 FCFA / session
     - Kayak — 10 000 FCFA / personne
     - Paddle — 10 000 FCFA / personne
     - Balade à cheval — 5 000 FCFA / personne
     - Bateau de plaisance — badge « Sur devis », sans montant
   Mets un badge « Disponibilité à confirmer » sur une seule carte, celle du
   bateau de plaisance.

4. En bas, un bloc « Une envie particulière ? » avec un bouton vert
   « Contacter Kibreeze sur WhatsApp ».

5. Bouton WhatsApp flottant, barre à onglets avec « Expériences » actif.

Génère ensuite, dans la même conversation, la variante où l'onglet
« Aventure » est actif et où seules quatre cartes restent visibles : Quad,
Kayak, Paddle, Balade à cheval.
```

---

## Écran 3 — Fiche d'une expérience

```text
ÉCRAN 3 — FICHE « EXCURSION EN PIROGUE ».

1. Fil d'Ariane discret : Expériences › Nature & Découverte › Excursion en
   pirogue.

2. Galerie : une grande photographie de 280 pixels de haut montrant une pirogue
   colorée sur la Lobé bordée de végétation dense, avec un compteur « 1 / 4 »
   en surimpression dans le coin bas droit. Sous elle, trois miniatures
   carrées de 72 pixels alignées à gauche.

3. Titre « Excursion en pirogue » en gras, avec sous lui un petit badge
   turquoise « Nature & Découverte ».

4. Bloc de prix, visuellement fort : « 35 000 FCFA » en très grand rouge de
   marque, suivi de « / groupe » en plus petit gris, puis en dessous
   « ≈ 53 € — montant indicatif » en gris clair, puis en petit
   « Prix indicatif, sous réserve de disponibilité et de confirmation par
   Kibreeze. » Enfin, sur sa propre ligne, un badge turquoise
   « Jusqu'à 8 personnes — au-delà, sur devis ».

5. Ligne d'informations à trois colonnes, séparées par de fines lignes
   verticales, chacune avec une icône fine au-dessus : « 2 à 3 heures » /
   « 1 à 8 personnes » / « Embouchure de la Lobé ».

6. Description, deux paragraphes courts de trois lignes maximum chacun.

7. Deux listes empilées, pas côte à côte, pour rester lisibles sur mobile :
   « Ce qui est inclus » avec des coches vertes — pirogue et équipement de
   sécurité, piroguier local, gilets de sauvetage, rafraîchissements — puis
   « Ce qui n'est pas inclus » avec des croix grises — pourboires, dépenses
   personnelles, transport jusqu'au point d'embarquement.

8. AJOUTS FACULTATIFS, encadré sur fond crème plus soutenu, titre « Complétez
   votre expérience ». Trois cases à cocher, décochées par défaut, chacune avec
   son prix à droite :
     - Guide touristique — 5 000 FCFA
     - Maître-nageur — 5 000 FCFA
     - Musée d'art — 1 500 FCFA / personne
   Ces options ne sont pas des cartes, ce sont des lignes avec case à cocher.

9. Sélecteur de quantité : libellé « Nombre de personnes », un bouton moins
   carré, la valeur 2 au centre, un bouton plus carré. Tous deux d'au moins
   44 pixels.

10. Bande « Vous aimerez aussi » : trois cartes horizontales compactes —
    Chutes de la Lobé 5 000 FCFA, Jacuzzi naturel 5 000 FCFA, Croisière
    25 000 FCFA.

11. BARRE FIXE EN BAS, juste au-dessus de la barre à onglets, fond crème avec
    une fine bordure supérieure : à gauche « Total » en petit gris et
    « 35 000 FCFA » en gras au-dessus de « ≈ 53 € », à droite un bouton rouge
    « Ajouter à mon séjour ». Sous le bouton, un lien discret souligné
    « Demander ce service ».
    PAS de bouton WhatsApp flottant sur cet écran : la barre fixe le remplace.

12. Barre à onglets avec « Expériences » actif.
```

---

## Écran 4 — Mon séjour, état plein

```text
ÉCRAN 4 — « MON SÉJOUR », PANIER REMPLI.

1. Titre « Mon séjour » en grand, sous-titre gris « 5 prestations
   sélectionnées », et à droite un lien discret « Vider ».

2. Deux champs côte à côte, VIDES, avec leur libellé au-dessus et un texte
   d'invite gris à l'intérieur : « Dates du séjour » / « Sélectionner » et
   « Voyageurs » / « Combien ? ». Sous eux, une ligne turquoise discrète avec
   une petite icône d'information : « Ajoute tes dates pour une réponse plus
   rapide ». Ce rappel n'a de sens que parce que les champs sont vides : ne
   les pré-remplis pas.

3. Liste des lignes sélectionnées. Chaque ligne est une carte horizontale de
   96 pixels de haut : vignette photo carrée à gauche, au centre le nom en
   gras puis la quantité en gris, à droite le prix en rouge et une petite
   icône de corbeille en haut à droite. Sous le nom, un sélecteur de quantité
   compact quand la ligne en accepte un.
     - Excursion en pirogue — 1 groupe — 35 000 FCFA — avec sélecteur
     - Chutes de la Lobé — 2 personnes — 10 000 FCFA — avec sélecteur
     - Campement Bagyeli — tarif couple — 20 000 FCFA — avec sélecteur
     - Hébergement, Chambre — 3 nuits — À partir de 45 000 FCFA — avec
       sélecteur
     - TKS® — Transfert Douala → Kribi — badge « Sur devis », aucun montant,
       AUCUN sélecteur de quantité, seule la corbeille apparaît sur cette
       ligne
   La ligne TKS porte un petit logo TKS® pour montrer qu'elle vient d'une
   autre marque.

4. Encadré de total, fond crème soutenu, bordure fine :
   « Total estimatif » à gauche, « 110 000 FCFA » à droite en très grand
   rouge, et sous le montant « ≈ 167 € — montant indicatif ».
   En dessous, une ligne turquoise « + 1 prestation sur devis ».
   Puis en petit gris : « Prix indicatif, sous réserve de disponibilité et de
   confirmation par Kibreeze. »

5. BARRE FIXE EN BAS, au-dessus de la barre à onglets : un bouton vert pleine
   largeur « Demander un devis par WhatsApp », et sous lui un lien discret
   « Continuer mes recherches ».
   PAS de bouton WhatsApp flottant sur cet écran.

6. Barre à onglets avec « Mon séjour » actif et la pastille à 5.

Cet écran montre le cœur du produit : on mélange dans un même séjour des
expériences, un hébergement et une prestation de mobilité TKS®.
```

---

## Écran 5 — Mon séjour, états vide et sur devis

```text
ÉCRAN 5 — DEUX VARIANTES DE « MON SÉJOUR ».

VARIANTE A, séjour vide :
Titre « Mon séjour ». Au centre de l'écran, une belle photographie carrée de
Kribi aux angles francs — une plage au soleil couchant, pas une illustration
abstraite ni un pictogramme. Sous elle, le titre « Votre séjour est vide »,
une phrase « Ajoutez des expériences pour composer votre séjour à Kribi », et
un bouton rouge « Découvrir les expériences ». Aucune liste, aucun total,
aucune barre fixe en bas. Le bouton WhatsApp flottant est présent, puisqu'il
n'y a pas de barre fixe. Pastille de la barre à onglets à 0.

VARIANTE B, uniquement des prestations sur devis :
Même structure que l'écran 4, mais deux lignes seulement, portant chacune le
badge « Sur devis », sans montant et sans sélecteur de quantité :
  - Bateau de plaisance — Sur devis
  - TKS® — Transfert Douala → Kribi — Sur devis
À la place de l'encadré de total, un encadré plus sobre avec la seule mention
« Total : sur devis (2 prestations) », sans montant en euros.
La barre fixe du bas garde le bouton vert « Demander un devis par WhatsApp ».
Pastille à 2.
```

---

## Écran 6 — Hébergements

C'est l'écran le plus inhabituel du site : on ne vend pas un logement, on vend un budget. Il ne se devine pas, il doit être dessiné.

```text
ÉCRAN 6 — HÉBERGEMENTS.

1. Bandeau court de 200 pixels : photographie d'une terrasse ouverte sur la
   mer au petit matin, voile sombre, titre « Hébergements » et la phrase
   « Dites-nous votre budget, nous trouvons le logement ».

2. Encadré d'explication sur fond crème soutenu, avec une fine bordure gauche
   turquoise de 3 pixels. C'est la clé de compréhension de la page, il doit
   être impossible à manquer :
   « Choisissez le type de logement et le budget qui vous conviennent. Nous
   cherchons ensuite la meilleure option disponible chez nos partenaires à
   Kribi. »

3. TROIS BLOCS DE TYPE, empilés, séparés par de larges espaces.
   Chaque bloc commence par une photographie pleine largeur de 180 pixels —
   un intérieur chaleureux, lumineux, jamais un hall d'hôtel impersonnel —
   surmontée d'un petit texte en surimpression « photo d'illustration ».
   Sous la photo, le nom du type en gras, la capacité en gris, puis les
   paliers de budget sous forme de lignes cliquables, chacune avec son prix à
   gauche et un bouton compact « Ajouter » à droite :

   CHAMBRE — 1 à 2 personnes
     · À partir de 15 000 FCFA / nuit — ≈ 23 €

   STUDIO — 2 à 3 personnes
     · À partir de 30 000 FCFA / nuit — ≈ 46 €

   APPARTEMENT — 2 à 6 personnes
     · À partir de 35 000 FCFA / nuit — ≈ 53 €
     · À partir de 50 000 FCFA / nuit — ≈ 76 €
     · À partir de 100 000 FCFA / nuit — ≈ 152 €

   VILLA — 6 à 12 personnes
     · À partir de 150 000 FCFA / nuit — ≈ 228 €

4. SECTION HAUT DE GAMME, nettement séparée par un large espace et un fond
   différent, plus sombre et sobre. Elle vient APRÈS les paliers standards,
   jamais avant : un montant élevé en tête de page ferait fuir le visiteur.
   Titre « Plus grand, plus haut de gamme ? », phrase « Appartements et villas
   d'exception, jusqu'à 300 000 FCFA la nuit », et un bouton vert
   « Contacter Kibreeze sur WhatsApp ». Pas de bouton « Ajouter » ici.

5. Sous les paliers, en petit gris : « Prix indicatif, sous réserve de
   disponibilité et de confirmation par Kibreeze. »

6. Bouton WhatsApp flottant, barre à onglets avec « Hébergements » actif.

Génère ensuite, dans la même conversation, l'état juste après un ajout : une
bande de confirmation discrète qui glisse depuis le bas, au-dessus de la barre
à onglets, avec le texte « Chambre, 15 000 FCFA / nuit — ajoutée à votre
séjour » et un lien « Voir mon séjour ». Elle ne vole pas le focus et
disparaît seule.
```

---

## Écran 7 — Formules

```text
ÉCRAN 7 — FORMULES.

1. Bandeau court de 200 pixels : photographie d'une plage au lever du jour,
   titre « Formules » et la phrase « Des séjours déjà composés, ajustables
   avec nous ».

2. Une ligne d'information sous le bandeau, centrée, en gris :
   « Tous nos forfaits sont calculés sur une base de 2 personnes. »

3. QUATRE CARTES VERTICALES, empilées, séparées par 24 pixels.
   Chaque carte : photographie pleine largeur de 160 pixels en haut, puis le
   nom du package en gras, puis la liste de ce qu'il contient sous forme de
   lignes courtes précédées d'une petite coche rouge, puis une fine ligne de
   séparation, puis le prix en grand rouge avec « / 2 personnes » en petit
   juste après, l'équivalent en euros en dessous, et enfin un bouton rouge
   pleine largeur « Ajouter à mon séjour ».

   PACKAGE DÉCOUVERTE — 100 000 FCFA / 2 personnes — ≈ 152 €
     Chutes de la Lobé · Excursion en pirogue · Campement Bagyeli ·
     Musée d'art · Guide touristique

   PACKAGE ÉVASION — 120 000 FCFA / 2 personnes — ≈ 182 €
     Chutes de la Lobé · Excursion en pirogue · Kayak · Balade à cheval ·
     Jacuzzi naturel

   PACKAGE AVENTURE — 150 000 FCFA / 2 personnes — ≈ 228 €
     Chutes de la Lobé · Excursion en pirogue · Quad · Jet-ski · Kayak ·
     Balade à cheval

   PACKAGE PREMIUM — 300 000 FCFA / 2 personnes — ≈ 456 €
     Chutes de la Lobé · Excursion en chaloupe · Bateau de plaisance · Quad ·
     Jet-ski · Kayak · Balade à cheval · Jacuzzi naturel

   Distingue visuellement le Premium : une fine bordure rouge et un petit
   badge « Le plus complet » en haut de la carte. Pas de couleur de fond
   différente, pas d'effet doré.

4. En bas, un encadré sur fond crème soutenu : « Groupes jusqu'à 8 personnes
   sur demande » et « Chaque formule est ajustable : dites-nous ce que vous
   voulez changer », avec un bouton vert « Contacter Kibreeze sur WhatsApp ».

5. Bouton WhatsApp flottant, barre à onglets avec « Formules » actif.
```

---

## Écran 8 — TKS® Mobilité

Écran délibérément sobre. S'il est aussi beau que les expériences, il est raté : il doit se lire comme une annexe utile.

```text
ÉCRAN 8 — TKS® — MOBILITÉ.

Cet écran doit être visiblement plus sobre que le reste du site. Pas de
photographie plein écran, pas de grandes cartes illustrées, pas de bandeau
immersif. C'est une rubrique utilitaire qui complète un séjour, pas une
vitrine d'expériences.

1. Bandeau court et bas, 130 pixels seulement, fond gris très clair sans
   photographie. À gauche le logo TKS®, à droite le titre « Mobilité &
   transport » et la phrase « Location, transferts et chauffeur privé pour
   compléter votre séjour ».

2. Une phrase de rattachement, en gris, sous le bandeau : « TKS® est la marque
   de mobilité de Breezy Groupe, aux côtés de Kibreeze. »

3. LISTE COMPACTE de cinq services, en lignes et non en cartes. Chaque ligne
   fait 72 pixels de haut : une petite vignette carrée de 56 pixels à gauche,
   le nom en gras au centre avec une ligne de description en gris dessous, et
   à droite le badge « Sur devis » puis un chevron.
     - Location de véhicules — « Berlines et 4x4, avec ou sans chauffeur »
     - Location avec chauffeur — « Un véhicule et son chauffeur à la journée »
     - Transferts — « Douala, Yaoundé, aéroport »
     - Chauffeur privé — « À l'heure ou à la journée »
     - Prestations professionnelles — « Transport d'équipes et d'entreprises »
   Les cinq portent le badge « Sur devis » : aucun tarif de mobilité n'est
   disponible. N'invente aucun montant.

4. Un encadré sobre : « Besoin d'un transport sur mesure ? Dites-nous vos
   dates et votre trajet, nous vous répondons avec un prix. » et un bouton
   vert « Contacter Kibreeze sur WhatsApp ».

5. Bouton WhatsApp flottant. Barre à onglets : aucun onglet n'est actif, cette
   page n'en a pas. Garde la barre telle quelle, sans état actif.
```

---

## Version ordinateur

Une fois chaque écran validé en mobile, demander dans la même conversation :

```text
Garde exactement le même style, les mêmes contenus et la même hiérarchie, mais
adapte cet écran à un ordinateur de 1440 × 1024 :
- la barre à onglets du bas disparaît, remplacée par une navigation complète
  dans la barre du haut : Expériences, Hébergements, Formules, Mobilité, et à
  droite le sélecteur FR | EN, une icône « Mon séjour » avec sa pastille, et le
  bouton WhatsApp ;
- le contenu est limité à 1 200 pixels de large, centré, avec de larges marges ;
- les grilles de cartes passent à trois colonnes, les listes d'hébergement à
  deux ;
- sur la fiche, la galerie occupe la colonne de gauche et le bloc de prix avec
  son bouton devient une carte fixe dans la colonne de droite ;
- sur Mon séjour, le récapitulatif devient un panneau latéral droit qui reste
  visible pendant le défilement ;
- le hero de l'accueil garde son voile et son texte aligné à gauche, sans
  s'étirer démesurément en hauteur.
```

## Contrôle avant de montrer à Franck

- Le rouge du logo, #A4021F, est bien la couleur de marque, et le vert n'apparaît que sur les boutons WhatsApp.
- Les angles sont francs partout, aucun bouton en pilule.
- Aucun chevauchement en bas d'écran entre la barre de prix, la barre à onglets et le bouton flottant.
- Les trois formes de prix apparaissent, et chaque montant porte son équivalent en euros.
- Les prix sont exactement ceux du guide tarifaire, sans arrondi ni invention.
- Le jet-ski n'affiche aucun prix tant que T1 n'est pas tranché.
- Aucune mention de livraison nulle part.
- TKS® n'apparaît jamais avant les expériences dans l'ordre de lecture.
- Le pied de page cite les quatre marques de Breezy Groupe.
- Les écrans 3, 4 et 5-B n'ont pas de bouton WhatsApp flottant.
