# Exigences fonctionnelles — MVP

**Statut** : draft · **Date** : 2026-09-13 · **Mis à jour** : 2026-09-28 (pivot Kibreeze, tarifs reçus)

Convention : `FR-<feature>-<n>`. Les features correspondent aux specs Spec Kit (voir [../specs/README.md](../specs/README.md)). Chaque exigence a au moins un critère d'acceptation Given / When / Then. Les références client entre parenthèses renvoient aux réponses de Franck dans [client-answers.md](./client-answers.md) : sections 1 et 1 bis pour les réponses de septembre, **1 ter et 1 quater pour le pivot Kibreeze et le guide tarifaire**. Toutes les exigences s'appliquent aux deux langues ; les routes citées sont les routes françaises, leurs équivalents anglais sont définis par FR-I18N-1.

---

## LAND — Landing / structure du site (spec 002)

**FR-LAND-1** Le site expose les routes : `/` (accueil), `/experiences`, `/experiences/<slug>` (fiche), `/hebergements`, `/formules`, `/mobilite` (section TKS®), `/sejour` (Mon séjour), `/contact`. En anglais : `/en/`, `/en/experiences`, `/en/experiences/<slug>`, `/en/accommodation`, `/en/packages`, `/en/mobility`, `/en/my-trip`, `/en/contact` (FR-I18N-1). **Aucune route de livraison n'existe** : ce périmètre appartient à Breezy Delivery, marque sœur, et ne figure pas sur ce site.
- Given un visiteur, When il ouvre une route, Then la page se rend sans JavaScript pour tout le contenu statique.

**FR-LAND-2** L'accueil présente, dans cet ordre : identité **Kibreeze** et signature « Kribi is a feeling » ; un hero immersif plein écran avec le titre « Découvrez Kribi autrement » et deux CTA (« Découvrir les expériences », « Planifier mon séjour ») ; les trois catégories d'expériences en cartes visuelles ; des expériences mises en avant (`featured`) ; une bande immersive ; les hébergements ; les formules ; **la section TKS® — Mobilité, visuellement plus sobre que le reste** ; un bloc « À propos de Kibreeze » ; un bloc de conversion WhatsApp ; le pied de page. Le message exprime « je vais à Kribi, Kibreeze m'aide à organiser mon séjour ». Beaucoup de photographies, peu de texte : un accueil qui ressemble à une page de présentation textuelle ne satisfait pas cette exigence.
- Given l'accueil, When le visiteur clique une catégorie, Then il arrive sur `/experiences` filtré sur cette catégorie.

**FR-LAND-3** La navigation mobile est une **barre à onglets fixée en bas**, présente sur toutes les pages, avec cinq destinations : Accueil, Expériences, Hébergements, Formules, Mon séjour (avec badge du nombre de lignes). La barre du haut contient le logo Kibreeze, le sélecteur FR / EN et un bouton WhatsApp. Il n'y a pas de menu hamburger, et pas d'icône Mon séjour dans la barre du haut.
- Given 3 lignes dans la sélection, When une page se charge, Then le badge de l'onglet Mon séjour affiche 3.

**FR-LAND-4** Un bouton WhatsApp flottant est visible sur les pages **sans CTA fixe en bas** (accueil, catalogues, contact, 404), ancré en bas à droite au-dessus de la barre à onglets, sans la chevaucher. Il n'apparaît pas sur les fiches ni sur `/sejour`, qui portent déjà une barre d'action fixe.

**FR-LAND-5** Le bouton WhatsApp sans sélection ouvre un message générique : « Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi. » En anglais : « Hello Kibreeze, I would like some information about your experiences in Kribi. »

**FR-LAND-6** Le pied de page mentionne les **quatre marques de Breezy Groupe** — Kibreeze, TKS®, iBreezy, Breezy Delivery — et rattache explicitement Kibreeze au groupe (client R6). Seule Kibreeze est cliquable vers une page du site ; les autres sont des mentions.

**FR-LAND-7** La section TKS® — Mobilité de l'accueil reste secondaire : elle n'utilise ni photographie plein écran, ni le traitement visuel des cartes d'expérience, et ne précède jamais les expériences dans l'ordre de lecture (client, direction du 2026-09-25).

---

## I18N — Français et anglais (spec 001, puis toutes les features)

**FR-I18N-1** Le site existe en français, langue par défaut servie sans préfixe, et en anglais sous `/en/`. Les slugs des pages sont traduits ; les slugs des fiches services sont identiques dans les deux langues.

| Page | Français | Anglais |
|---|---|---|
| Accueil | `/` | `/en/` |
| Expériences | `/experiences` | `/en/experiences` |
| Fiche d'expérience | `/experiences/<slug>` | `/en/experiences/<slug>` |
| Hébergements | `/hebergements` | `/en/accommodation` |
| Formules | `/formules` | `/en/packages` |
| TKS® — Mobilité | `/mobilite` | `/en/mobility` |
| Mon séjour | `/sejour` | `/en/my-trip` |
| Contact | `/contact` | `/en/contact` |

- Given `/experiences`, When le visiteur choisit « English », Then il arrive sur `/en/experiences`.

**FR-I18N-2** Un sélecteur de langue est visible dans la navigation de toutes les pages, sur mobile et sur desktop. Il mène à la page équivalente dans l'autre langue. Aucune détection automatique, aucune redirection.
- Given `/en/experiences/jet-ski`, When le visiteur choisit « Français », Then il arrive sur `/experiences/jet-ski`.

**FR-I18N-3** Chaque page déclare `<html lang>`, des liens `hreflang` fr, en et x-default (x-default pointe vers le français), une URL canonique propre à sa langue, `og:locale` et `og:locale:alternate`.

**FR-I18N-4** Aucun texte visible n'est écrit en dur dans un composant. Les chaînes d'interface sont dans les dictionnaires ; les textes de contenu sont dans les fichiers de contenu, en français et en anglais.

**FR-I18N-5** La sélection Mon séjour est commune aux deux langues : changer de langue conserve les lignes, les quantités, les dates et le nombre de voyageurs.
- Given 2 lignes sur `/sejour`, When le visiteur choisit « English », Then `/en/my-trip` affiche les 2 mêmes lignes avec les libellés anglais.

**FR-I18N-6** Le message WhatsApp est rédigé dans la langue de la page d'où il part : introduction, libellés, titres des services, total et formule de clôture.
- Given `/en/my-trip` avec une sélection, When le visiteur clique sur WhatsApp, Then le message commence par « Hello Kibreeze » et liste les titres anglais.

**FR-I18N-7** Les montants sont formatés selon la langue : « 100 000 FCFA » en français, « 100,000 FCFA » en anglais.

**FR-I18N-8** Si un texte anglais manque, le texte français s'affiche en développement et en aperçu, avec un avertissement au build. Le build de production échoue en listant les textes manquants.
- Given un service sans `title.en`, When on lance le build de production, Then il échoue en nommant le fichier et le champ.

---

## CAT — Catalogue d'expériences (spec 003)

**FR-CAT-1** Le catalogue est défini dans des fichiers de données versionnés (un fichier par service), validés par un schéma au build. Un fichier invalide fait échouer le build avec un message explicite.
- Given un service sans `title`, When on lance le build, Then le build échoue en nommant le fichier et le champ.

**FR-CAT-2** La page Expériences liste les expériences `available` et `on_request`, filtrables par les trois catégories (Nature / Découverte, Aventure, Détente), dans l'ordre `order` puis alphabétique. Un onglet « Toutes » est actif par défaut.
- Given 2 catégories dans Tourisme, When le visiteur choisit « Aventure », Then seules les cartes de cette catégorie sont visibles ; « Tous » rétablit la liste.

**FR-CAT-3** Une carte de service affiche : image, titre, description courte, étiquette de prix (voir FR-EST-1), badge « Disponibilité à confirmer » si `on_request`, lien vers la fiche.

**FR-CAT-4** La fiche `/experiences/<slug>` affiche : galerie (1 à N images), titre, description longue, prix, durée, capacité, conditions (inclus / non inclus / à savoir), un sélecteur par dimension de quantité du service, par exemple véhicules et jours (client D1, complété le 2026-09-16), bouton « Ajouter à mon séjour », bouton « Demander ce service » (ouvre WhatsApp avec ce service seul, client B1).

**FR-CAT-5** Un service `disabled` n'apparaît nulle part et sa route renvoie une 404.

**FR-CAT-6** La page Expériences contient un bloc « Une envie particulière ? » avec CTA WhatsApp générique.

---

## SEL — Sélection « Mon séjour » (spec 004)

**FR-SEL-1** Le visiteur peut ajouter un service à la sélection en renseignant chacune de ses dimensions de quantité, chacune bornée par ses `min` et `max`. Un service sans dimension s'ajoute tel quel.
- Given quantité 2 sur la fiche « Excursion en pirogue », When « Ajouter », Then la sélection contient une ligne pirogue × 2 personnes.
- Given 2 véhicules et 3 jours sur « Location avec chauffeur », When « Ajouter », Then la ligne porte 2 véhicules × 3 jours et son montant vaut le prix du jour × 6.

**FR-SEL-2** Ajouter un service déjà présent met à jour sa ligne au lieu d'en créer une seconde : les dimensions `persons` et `units` s'additionnent dans la limite de leur `max`, les dimensions de durée prennent la nouvelle valeur.
- Given pirogue × 2 personnes (max 10), When ajout de 3, Then pirogue × 5. Given pirogue × 9, When ajout de 3, Then pirogue × 10 et message « Maximum atteint ».
- Given location 1 véhicule × 2 jours, When ajout de 1 véhicule × 5 jours, Then la ligne porte 2 véhicules × 5 jours.

**FR-SEL-3** Le visiteur peut modifier la quantité d'une ligne (stepper et saisie), la retirer, et vider toute la sélection après confirmation.

**FR-SEL-4** Les services sans dimension de quantité, forfaits et prestations sur devis, s'ajoutent tels quels, sans sélecteur, et ne peuvent pas être dupliqués.

**FR-SEL-5** La sélection persiste dans le stockage local du navigateur et est restaurée au chargement, avec un numéro de version de schéma permettant une migration.
- Given une sélection, When le navigateur est fermé puis rouvert, Then la sélection est identique.

**FR-SEL-6** Au chargement, les lignes dont le service n'existe plus ou est `disabled` sont retirées, et un message discret l'indique.

**FR-SEL-7** Si le stockage local est indisponible, la sélection fonctionne en mémoire et un bandeau informe que la sélection ne sera pas conservée.

**FR-SEL-8** Chaque ajout, modification ou suppression donne un retour visuel (toast) et met à jour le badge de navigation, sans rechargement de page.

**FR-SEL-9** La page `/sejour` affiche l'état vide avec un CTA vers Tourisme quand la sélection est vide.

**FR-SEL-10** La page `/sejour` propose deux champs optionnels : dates de séjour (texte libre) et nombre de voyageurs, persistés avec la sélection. Si la sélection contient au moins une expérience ou un hébergement et que l'un de ces champs est vide, un rappel non bloquant s'affiche près du CTA WhatsApp (« Ajoute tes dates et le nombre de voyageurs pour une réponse plus rapide »). L'envoi reste toujours possible (client D2 : recommandé, jamais bloquant).
- Given une sélection tourisme sans dates, When le visiteur ouvre `/sejour`, Then le rappel est visible et le CTA WhatsApp reste actif.

**FR-SEL-11** Sur desktop, un panneau latéral offre un récap court (lignes, total, CTA) accessible depuis la navigation. Sur mobile, la page `/sejour` est le récap.

---

## EST — Estimation (spec 005)

**FR-EST-1** Le prix d'un service est de l'un des trois types : `fixed` (« 70 000 FCFA »), `from` (« à partir de 25 000 FCFA »), `quote` (« Sur devis »). L'unité est affichée quand elle est pertinente : « / personne », « / groupe », « / équipement », « / heure », « / jour », « / nuit », « / session », « / course », « / prestation » (client C2, complété le 2026-09-16, puis par le guide tarifaire du 2026-09-26). L'unité `per_delivery` est retirée avec le périmètre livraison.

**FR-EST-1 bis** Un prix de groupe porte une **capacité maximale**. Au-delà, le service bascule sur `quote` plutôt que de multiplier le forfait : l'excursion en pirogue coûte 35 000 pour 8 personnes au maximum, et une demande pour 10 personnes part en devis (client T6).
- Given une pirogue à 35 000 pour 8 personnes maximum, When le visiteur sélectionne 10 personnes, Then la ligne affiche « Sur devis » et aucun montant n'entre dans le total.

**FR-EST-1 ter** Un service peut porter **plusieurs tarifs alternatifs** que le visiteur choisit. Le campement Bagyeli propose individuel à 7 500 par personne, couple à 20 000, et groupe sur devis (client T3). Chaque option est une ligne de prix du même service, jamais un service distinct.

**FR-EST-2** Le montant d'une ligne = montant unitaire × produit des quantités de toutes ses dimensions, pour `fixed` et `from` ; nul pour `quote`.
- Given un prix de 50 000 / jour, 2 véhicules et 3 jours, When calcul, Then le montant de la ligne vaut 300 000.

**FR-EST-3** Le total estimatif = somme des montants de lignes non nuls. Le nombre de lignes `quote` est affiché à côté : « + 2 prestations sur devis ».
- Given fixed 70 000 × 1, from 15 000 × 2, quote × 1, When calcul, Then total 100 000, quoteCount 1, hasFromPrices true.

**FR-EST-4** Si au moins une ligne est `from`, le total porte le libellé « Total estimatif » et la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par Kibreeze. » (validée par le client, C4). Si toutes les lignes sont `fixed`, le libellé est « Total indicatif » avec la même mention (Kibreeze garde la main sur le prix final, §16 du CDC).

**FR-EST-5** Si toutes les lignes sont `quote`, aucun montant n'est affiché : « Total : sur devis (N prestations) ».

**FR-EST-6** Les montants sont en francs CFA (`XAF`), entiers, formatés selon la langue avec le suffixe « FCFA » : « 100 000 FCFA » en français, « 100,000 FCFA » en anglais (FR-I18N-7).

**FR-EST-7** Le calcul est une fonction pure, sans dépendance à l'interface, couverte à 100 % par des tests unitaires.

---

## WA — Conversion WhatsApp (spec 006)

**FR-WA-1** Le numéro WhatsApp est une variable de configuration au build (`PUBLIC_WHATSAPP_NUMBER`, format international sans `+`). Valeur de production : `237697135388`, numéro unique pour Kibreeze et TKS® (client E1, E2, confirmé K6 le 2026-09-25).

**FR-WA-2** Le lien est de la forme `https://wa.me/<numéro>?text=<message URL-encodé>` et s'ouvre dans un nouvel onglet avec `rel="noopener"`.

**FR-WA-3** Le message récapitulatif contient, dans l'ordre : salutation et intention (« organiser un séjour à Kribi »), dates et voyageurs s'ils sont renseignés, la liste des lignes (titre, quantités avec leurs libellés comme « 2 véhicules × 3 jours », montant ou « sur devis »), le total estimatif avec le nombre de lignes sur devis, une formule de clôture (format validé par le client, E3). Deux gabarits existent, français et anglais, avec la même structure (FR-I18N-6).

**FR-WA-4** Le message est produit par une fonction pure à partir de la sélection et du catalogue, couverte à 100 % par des tests, avec un test de non-régression sur un exemple complet.

**FR-WA-5** Si le message encodé dépasse 1 800 caractères, les lignes sont tronquées à partir de la fin avec « … et N autres prestations », le total restant exact.

**FR-WA-6** Le bouton « Demander ce service » d'une fiche génère un message pour ce seul service, sans toucher à la sélection. Sur `/sejour`, « Demander un devis » et « Contacter Kibreeze sur WhatsApp » ouvrent le même récapitulatif avec une phrase d'introduction différente (client D4).

**FR-WA-7** La page `/contact` affiche le numéro WhatsApp cliquable, le téléphone s'il est différent, l'e-mail professionnel, « Kribi, Cameroun », les réseaux sociaux Kibreeze, et le CTA WhatsApp générique. Pas d'horaires, aucun formulaire en V1 (client F4). Les valeurs manquantes (téléphone, e-mail, réseaux) sont simplement omises tant qu'elles ne sont pas fournies.

---

## HEB — Hébergements (spec 005)

Modèle confirmé par Franck le 2026-09-25 (vocal) : le site n'affiche **pas de logement nommé**, mais un **type de logement à un palier de budget**. Kibreeze cherche ensuite le logement correspondant chez ses partenaires.

**FR-HEB-1** La page Hébergements affiche des paliers, groupés par type. Grille validée le 2026-09-26 : Chambre à partir de 15 000 ; Studio à partir de 30 000 ; Appartement à partir de 35 000, 50 000 et 100 000 ; Villa à partir de 150 000 ; tous par nuit. La ligne à 5 000 a été retirée par le client, qu'il jugeait incompatible avec le positionnement de la marque.
- Given la page Hébergements, When elle se charge, Then aucun nom d'établissement n'apparaît.

**FR-HEB-2** Une phrase d'explication précède les paliers, sans quoi le principe est incompréhensible : « Choisissez le type de logement et le budget qui vous convient. Nous cherchons ensuite la meilleure option disponible chez nos partenaires à Kribi. »

**FR-HEB-3** Les paliers haut de gamme (jusqu'à 300 000 FCFA) apparaissent dans une **section séparée, après les paliers standards**, jamais avant. Exigence explicite du client : un montant élevé en tête de page fait fuir le visiteur.

**FR-HEB-4** Un palier s'ajoute à Mon séjour avec une dimension de quantité `nights`. Le montant d'une ligne vaut le prix du palier multiplié par le nombre de nuits.
- Given « Chambre à partir de 15 000 » et 3 nuits, When la ligne est ajoutée, Then elle affiche « à partir de 45 000 FCFA ».

**FR-HEB-5** Ce qui est inclus varie selon le logement (client L2) : le champ est libre par palier et s'affiche immédiatement sous le prix. Un palier sans information d'inclusion n'affiche rien plutôt qu'une valeur par défaut.

**FR-HEB-6** Les visuels sont des photographies représentatives du budget, jamais d'un logement identifiable, et portent la mention « exemple de logement à ce budget » (client L1).

**FR-HEB-7** Le site formule une **réservation**, pas une mise en relation : Kibreeze réserve pour le client (client R4). Aucun texte ne doit laisser croire que le visiteur traite directement avec le propriétaire.

---

## PACK — Formules (spec 005)

**FR-PACK-1** La page Formules affiche les quatre packages du guide tarifaire : Découverte 100 000, Évasion 120 000, Aventure 150 000, Premium 300 000, tous **sur une base de 2 personnes**. La base est affichée avec le prix, jamais séparée de lui.

**FR-PACK-2** Chaque formule liste les expériences qu'elle contient, reprises du catalogue et non ressaisies : une expérience retirée du catalogue doit faire échouer le build si une formule la référence encore.

**FR-PACK-3** Au-delà de 2 personnes et jusqu'à 8, la formule bascule sur `quote` avec la mention « Groupes jusqu'à 8 personnes sur demande ».

**FR-PACK-4** Une formule s'ajoute à Mon séjour comme une ligne unique, sans détailler ses expériences dans le récapitulatif ni dans le message WhatsApp.

**FR-PACK-5** ⏳ Les formules incluant hébergement et transport (client R3, « les deux versions ») attendent leurs prix. Tant qu'ils manquent, seules les formules d'activités sont publiées.

---

## MOB — TKS® Mobilité (spec 006)

**FR-MOB-1** La page Mobilité présente les services TKS® en **liste compacte**, sans photographie plein écran ni traitement visuel des cartes d'expérience : location de véhicules, location avec chauffeur, transferts, chauffeur privé, prestations professionnelles.

**FR-MOB-2** Un service de mobilité s'ajoute à Mon séjour comme prestation complémentaire, avec les mêmes règles de quantité que les expériences.

**FR-MOB-3** ⏳ **Aucun tarif de mobilité n'a jamais été fourni.** Tant que c'est le cas, tous les services de la page sont `quote` et la page ne propose que le contact WhatsApp. Cette exigence est le seul blocage restant de la spec 006.

---

## EUR — Affichage en euros (spec 004)

**FR-EUR-1** Chaque montant affiche, sous le montant en FCFA et en plus petit, son équivalent indicatif en euros (client R7, qui renverse la réponse C5). Le FCFA reste la devise de référence : le total, le panier et le message WhatsApp sont en FCFA.

**FR-EUR-2** La conversion utilise un **taux fixe stocké en configuration**, pas un service externe : aucun appel réseau au chargement, et un prix ne change jamais tout seul. Le taux est documenté avec sa date de relevé.
- Given la parité officielle 1 € = 655,957 FCFA, When une expérience coûte 25 000 FCFA, Then le site affiche « ≈ 38,11 € » (corrigé le 2026-10-05 : l'exemple précédent, 1 000 FCFA ≈ 1,52 €, était un arrondi faux de 0,3 %). Le montant en euros a toujours deux décimales, en format français, sans parenthèses, sur sa propre ligne (décision du 2026-10-04).

**FR-EUR-3** La mention « montant indicatif » accompagne la conversion, une fois par page et non à chaque ligne.

---

## SEO — Référencement, performance, accessibilité (transverse, spec 002 + 003)

**FR-SEO-1** Chaque page, dans chaque langue, a un `title` et une `meta description` uniques, des balises Open Graph avec image, une URL canonique.

**FR-SEO-2** Un `sitemap.xml` listant les deux langues avec leurs alternates, et un `robots.txt`, sont générés au build.

**FR-SEO-3** L'accueil expose un JSON-LD `LocalBusiness` (nom, zone, téléphone) ; chaque fiche expose un JSON-LD `Service` ou `TouristAttraction` avec `offers` quand le prix est `fixed` ou `from`. Le JSON-LD porte `inLanguage` selon la langue de la page.

**FR-SEO-4** Les images du catalogue sont optimisées au build (formats modernes, tailles responsives, lazy loading hors hero).

**FR-SEO-5** Scores Lighthouse mobile ≥ 90 en performance, accessibilité, bonnes pratiques et SEO sur l'accueil, la page Expériences, une fiche et `/sejour`.

**FR-SEO-6** Toute l'interface est utilisable au clavier ; les composants interactifs ont des noms accessibles ; le contraste respecte WCAG AA ; les changements dynamiques sont annoncés.

---

## Matrice états → exigences

| État ([user-journeys.md](./user-journeys.md) §3) | Exigences |
|---|---|
| Vide | FR-SEL-9, FR-LAND-5 |
| Une / plusieurs lignes | FR-SEL-1, FR-SEL-8, FR-EST-3 |
| Doublon | FR-SEL-2 |
| Quantité modifiée | FR-SEL-3, FR-EST-2 |
| Suppression / vider | FR-SEL-3 |
| Sur devis | FR-EST-1, FR-EST-3, FR-EST-5 |
| À partir de | FR-EST-1, FR-EST-4 |
| Service désactivé | FR-CAT-5, FR-SEL-6 |
| Sur demande | FR-CAT-3 |
| Quantité max | FR-SEL-1, FR-SEL-2 |
| Stockage indisponible | FR-SEL-7 |
| Message trop long | FR-WA-5 |
| Mobile / desktop | FR-LAND-3, FR-LAND-4, FR-SEL-11 |
| Changement de langue | FR-I18N-2, FR-I18N-5 |
| Traduction anglaise manquante | FR-I18N-8 |
