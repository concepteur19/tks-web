# Exigences fonctionnelles — MVP

**Statut** : draft · **Date** : 2026-09-13

Convention : `FR-<feature>-<n>`. Les features correspondent aux specs Spec Kit (voir [../specs/README.md](../specs/README.md)). Chaque exigence a au moins un critère d'acceptation Given / When / Then. Les points marqués `[À CONFIRMER]` dépendent d'une réponse client (référence vers [client-questions.md](./client-questions.md)).

---

## LAND — Landing / structure du site (spec 002)

**FR-LAND-1** Le site expose les routes : `/` (accueil), `/transport`, `/tourisme`, `/livraison`, `/services/<slug>` (fiche), `/sejour` (Mon séjour), `/contact`.
- Given un visiteur, When il ouvre une route, Then la page se rend sans JavaScript pour tout le contenu statique.

**FR-LAND-2** L'accueil présente : identité TKS® et signature « Kribi is a feeling », un hero avec visuel et deux CTA (« Découvrir nos services », « Planifier mon séjour »), les trois pôles avec lien, une section « Pourquoi choisir TKS », une section d'expériences mises en avant (services `featured`), une section « À propos », un pied de page avec coordonnées.
- Given l'accueil, When le visiteur clique un pôle, Then il arrive sur la page du pôle.

**FR-LAND-3** Une navigation persistante contient les liens vers les pôles, Mon séjour (avec badge du nombre de lignes) et un bouton WhatsApp.
- Given 3 lignes dans la sélection, When une page se charge, Then le badge affiche 3.

**FR-LAND-4** Sur mobile, un bouton WhatsApp flottant est visible sur toutes les pages sauf `/sejour`.

**FR-LAND-5** Le bouton WhatsApp sans sélection ouvre un message générique : « Bonjour TKS, je souhaite des informations sur vos services. »

**FR-LAND-6** Toutes les chaînes d'interface sont centralisées dans un fichier unique pour permettre une traduction ultérieure.

---

## CAT — Catalogue de services (spec 003)

**FR-CAT-1** Le catalogue est défini dans des fichiers de données versionnés (un fichier par service), validés par un schéma au build. Un fichier invalide fait échouer le build avec un message explicite.
- Given un service sans `title`, When on lance le build, Then le build échoue en nommant le fichier et le champ.

**FR-CAT-2** Chaque page de pôle liste les services `available` et `on_request` de ce pôle, groupés ou filtrables par catégorie, dans l'ordre `order` puis alphabétique.
- Given 2 catégories dans Tourisme, When le visiteur choisit « Aventure », Then seules les cartes de cette catégorie sont visibles ; « Tous » rétablit la liste.

**FR-CAT-3** Une carte de service affiche : image, titre, description courte, étiquette de prix (voir FR-EST-1), badge « Disponibilité à confirmer » si `on_request`, lien vers la fiche.

**FR-CAT-4** La fiche `/services/<slug>` affiche : galerie (1 à N images), titre, description longue, prix, durée, capacité, conditions (inclus / non inclus / à savoir), sélecteur de quantité conforme à la règle du service, bouton « Ajouter à mon séjour », bouton « Demander un devis » (ouvre WhatsApp avec ce service seul).

**FR-CAT-5** Un service `disabled` n'apparaît nulle part et sa route renvoie une 404.

**FR-CAT-6** Chaque page de pôle contient un bloc « Besoin d'un service spécifique ? » avec CTA WhatsApp générique.

**FR-CAT-7** La page Livraison peut, à défaut de fiches détaillées, présenter les types de livraison comme cartes ajoutables directement, avec un prix `quote` par défaut `[À CONFIRMER C1]`.

---

## SEL — Sélection « Mon séjour » (spec 004)

**FR-SEL-1** Le visiteur peut ajouter un service à la sélection avec une quantité comprise entre `min` et `max` de sa règle.
- Given quantité 2 sur la fiche « Excursion en pirogue », When « Ajouter », Then la sélection contient une ligne pirogue × 2.

**FR-SEL-2** Ajouter un service déjà présent incrémente sa quantité au lieu de créer une ligne, dans la limite de `max`.
- Given pirogue × 2 (max 10), When ajout de 3, Then pirogue × 5. Given pirogue × 9, When ajout de 3, Then pirogue × 10 et message « Maximum atteint ».

**FR-SEL-3** Le visiteur peut modifier la quantité d'une ligne (stepper et saisie), la retirer, et vider toute la sélection après confirmation.

**FR-SEL-4** Les services dont la règle de quantité est `none` s'ajoutent avec quantité 1 sans stepper et ne peuvent pas être dupliqués.

**FR-SEL-5** La sélection persiste dans le stockage local du navigateur et est restaurée au chargement, avec un numéro de version de schéma permettant une migration.
- Given une sélection, When le navigateur est fermé puis rouvert, Then la sélection est identique.

**FR-SEL-6** Au chargement, les lignes dont le service n'existe plus ou est `disabled` sont retirées, et un message discret l'indique.

**FR-SEL-7** Si le stockage local est indisponible, la sélection fonctionne en mémoire et un bandeau informe que la sélection ne sera pas conservée.

**FR-SEL-8** Chaque ajout, modification ou suppression donne un retour visuel (toast) et met à jour le badge de navigation, sans rechargement de page.

**FR-SEL-9** La page `/sejour` affiche l'état vide avec un CTA vers Tourisme quand la sélection est vide.

**FR-SEL-10** La page `/sejour` propose deux champs optionnels : dates de séjour (texte libre ou sélecteur, `[À CONFIRMER D2]`) et nombre de voyageurs. Ils sont persistés avec la sélection.

**FR-SEL-11** Sur desktop, un panneau latéral offre un récap court (lignes, total, CTA) accessible depuis la navigation. Sur mobile, la page `/sejour` est le récap.

---

## EST — Estimation (spec 005)

**FR-EST-1** Le prix d'un service est de l'un des trois types : `fixed` (« 70 000 FCFA »), `from` (« à partir de 25 000 FCFA »), `quote` (« Sur devis »). L'unité est affichée quand elle est pertinente (« / personne », « / jour », « / course », « / colis »).

**FR-EST-2** Le montant d'une ligne = montant unitaire × quantité pour `fixed` et `from` ; nul pour `quote`.

**FR-EST-3** Le total estimatif = somme des montants de lignes non nuls. Le nombre de lignes `quote` est affiché à côté : « + 2 prestations sur devis ».
- Given fixed 70 000 × 1, from 15 000 × 2, quote × 1, When calcul, Then total 100 000, quoteCount 1, hasFromPrices true.

**FR-EST-4** Si au moins une ligne est `from`, le total porte le libellé « Total estimatif » et la mention « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. » `[À CONFIRMER C4]`. Si toutes les lignes sont `fixed`, le libellé est « Total indicatif » avec la même mention (TKS garde la main sur le prix final, §16 du CDC).

**FR-EST-5** Si toutes les lignes sont `quote`, aucun montant n'est affiché : « Total : sur devis (N prestations) ».

**FR-EST-6** Les montants sont en francs CFA (`XAF`), entiers, formatés avec séparateur de milliers espace insécable et suffixe « FCFA » (« 100 000 FCFA »).

**FR-EST-7** Le calcul est une fonction pure, sans dépendance à l'interface, couverte à 100 % par des tests unitaires.

---

## WA — Conversion WhatsApp (spec 006)

**FR-WA-1** Le numéro WhatsApp est une variable de configuration au build (`PUBLIC_WHATSAPP_NUMBER`, format international sans `+`). `[À CONFIRMER E1]`

**FR-WA-2** Le lien est de la forme `https://wa.me/<numéro>?text=<message URL-encodé>` et s'ouvre dans un nouvel onglet avec `rel="noopener"`.

**FR-WA-3** Le message récapitulatif contient, dans l'ordre : salutation et intention (« organiser un séjour à Kribi » ou « une livraison » selon les pôles présents), dates et voyageurs s'ils sont renseignés, la liste des lignes (titre × quantité, montant ou « sur devis »), le total estimatif avec le nombre de lignes sur devis, une formule de clôture. `[À CONFIRMER E3]`

**FR-WA-4** Le message est produit par une fonction pure à partir de la sélection et du catalogue, couverte à 100 % par des tests, avec un test de non-régression sur un exemple complet.

**FR-WA-5** Si le message encodé dépasse 1 800 caractères, les lignes sont tronquées à partir de la fin avec « … et N autres prestations », le total restant exact.

**FR-WA-6** Le bouton « Demander un devis » d'une fiche génère un message pour ce seul service, sans toucher à la sélection.

**FR-WA-7** La page `/contact` affiche le numéro WhatsApp cliquable, la zone d'intervention, les réseaux sociaux si fournis, et le CTA WhatsApp générique. Aucun formulaire en V1. `[À CONFIRMER F4]`

---

## SEO — Référencement, performance, accessibilité (transverse, spec 002 + 003)

**FR-SEO-1** Chaque page a un `title` et une `meta description` uniques, des balises Open Graph avec image, une URL canonique.

**FR-SEO-2** Un `sitemap.xml` et un `robots.txt` sont générés au build.

**FR-SEO-3** L'accueil expose un JSON-LD `LocalBusiness` (nom, zone, téléphone) ; chaque fiche expose un JSON-LD `Service` ou `TouristAttraction` avec `offers` quand le prix est `fixed` ou `from`.

**FR-SEO-4** Les images du catalogue sont optimisées au build (formats modernes, tailles responsives, lazy loading hors hero).

**FR-SEO-5** Scores Lighthouse mobile ≥ 90 en performance, accessibilité, bonnes pratiques et SEO sur l'accueil, une page de pôle, une fiche et `/sejour`.

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
