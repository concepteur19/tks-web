---

description: "Liste de tâches — coque du site Kibreeze et page d'accueil"
---

# Tasks: Coque du site Kibreeze et page d'accueil

**Input**: Documents de conception de `specs/002-kibreeze-core/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: demandés, conformément à [docs/testing-strategy.md](../../docs/testing-strategy.md) et au principe III de la constitution : chaque fonction pure a son test écrit **avant** son implémentation, et doit échouer avant d'être implémentée.

**Organisation**: par user story, dans l'ordre de priorité de la spec. **Ordre de réalisation conseillé** : Setup, Foundational, puis **US3 (coque) avant US1**, parce que l'accueil se construit dans la coque. Chaque story reste vérifiable seule.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable, fichiers différents, sans dépendance sur une tâche inachevée
- **[Story]** : user story concernée (US1 à US5)
- Chaque tâche cite son chemin de fichier

## Conventions de chemins

Projet unique, racine du dépôt. Code dans `src/`, tests dans `tests/`, scripts dans `scripts/`. Référence visuelle : [docs/design-exports/](../../docs/design-exports/README.md), en relevant les valeurs dans les `.html` et en les faisant passer par `src/styles/tokens.css`, jamais en copiant les classes de Stitch.

Règles valables pour toutes les tâches :

- Aucun texte visible en dur : chaînes d'interface dans `src/i18n/fr.ts` et `src/i18n/en.ts`, contenu dans `src/content/`. Seules exceptions : « Kribi is a feeling » et les noms de marque.
- Aucune valeur brute de couleur, taille, espacement ou durée dans un composant. Arrondis ≤ 4 px ; cercle réservé au bouton WhatsApp flottant et aux pastilles. Vert WhatsApp réservé aux boutons WhatsApp.
- Aucun lien interne écrit à la main : `getRoutePath` pour une page livrée, `resolveLink` / `SmartLink` pour une page qui peut ne pas l'être ([contracts/shell.md](./contracts/shell.md)).
- Aucune mention de livraison hors du nom « Breezy Delivery », aucun avis, aucun prix en dollars, aucune promesse absente du brief.

---

## Phase 1: Setup

**Objectif** : photos, tokens et scripts disponibles.

- [X] T001 Écrire `scripts/import-photos.mjs` : prend une liste de couples « fichier source dans `Elements/tri-par-activite/` → destination dans `src/assets/photos/<sujet>/<nom>.jpg` », refuse tout fichier dont le nom contient `_FILIGRANE`, redimensionne avec `sharp` à 2 400 px de large au plus, JPEG qualité 82, métadonnées EXIF retirées. Déclarer le script npm `photos:import` dans `package.json`
- [X] T002 Choisir les photos en les regardant puis les importer avec `npm run photos:import` vers `src/assets/photos/` : hero (coucher de soleil, sable mouillé, palmiers, dans `ambiance-hero-plages-couchers/`), trois catégories (chutes de la Lobé ; quad ou jet-ski ; feu de plage), quatre expériences (chutes, pirogue, croisière remplacée par un coucher de soleil car `croisiere/L6-08.jpg` est inutilisable, campement Bagyeli depuis `_a-classer_village-bagyeli/`), bande immersive (rivière Lobé vue d'une pirogue), « Qui sommes-nous » (paysage de Kribi), trois hébergements (`hebergement-et-detente/`, sinon intérieur chaleureux le plus proche), deux formules. Noter la correspondance source → destination dans `src/assets/photos/README.md`. Poids total visé : moins de 10 Mo
- [X] T003 [P] Ajouter à `src/styles/tokens.css` les tokens de coque relevés dans `docs/design-exports/01-accueil.html` et `10-accueil-ordinateur.html` : `--size-tabbar`, `--size-header`, `--size-content` (75rem), `--size-hero-mobile` (85svh), `--size-hero-max`, `--size-card-featured` (280 px), `--color-bg-subtle` (gris très clair de la section TKS®), `--color-footer-bg` (gris très sombre) et son texte crème ; vérifier les contrastes avec `npm run tokens:check` ; documenter dans `docs/design-system.md`. Retirer les trois marques `[PLACEHOLDER]` restantes (lignes 2, 11 et 14 : en-tête, `--color-accent`, `--color-bg`), ces valeurs étant validées depuis le 2026-10-04, et réécrire le commentaire d'en-tête en conséquence
- [X] T004 [P] Copier `docs/design-briefs/assets/tks-mark.png` vers `src/assets/brand/tks-mark.png`
- [X] T005 [P] Déclarer dans `package.json` les scripts `check:links` (`node scripts/check-links.mjs`) et `check:legal` (`node --experimental-strip-types scripts/check-legal.ts`), dont les fichiers sont écrits en US4 et US5
- [X] T006 Étendre `scripts/check-i18n.ts` : en mode `--production`, échouer si la chaîne `[PLACEHOLDER]` apparaît dans un fichier de `src/` (hors `src/pages/dev/`), en listant fichier et ligne (constitution, principe IV). Ajouter le cas à `tests/unit/check-i18n.test.ts` : un fichier marqué fait échouer le contrôle de production, un fichier propre le laisse passer

---

## Phase 2: Foundational (bloquant pour toutes les stories)

**Objectif** : routes, navigation, formatage des prix, schémas et données du site, prêts et testés.

**⚠️ CRITIQUE** : aucune story ne commence avant la fin de cette phase.

- [X] T007 Ajouter à `src/i18n/routes.ts` les clés `legalNotice` (`/mentions-legales`, `/en/legal-notice`), `privacy` (`/confidentialite`, `/en/privacy`) et `terms` (`/conditions-utilisation`, `/en/terms-of-use`), **sans** les ajouter à `IMPLEMENTED_ROUTES` : chaque story ajoute ses clés quand sa page existe. Étendre `tests/unit/routes.test.ts` aux nouvelles clés (pas de doublon, aller-retour FR → EN → FR)
- [X] T008 [P] Écrire `tests/unit/navigation.test.ts` (doit échouer) : `TAB_BAR` vaut `home, experiences, accommodation, packages, stay` dans cet ordre ; `DESKTOP_NAV` vaut `experiences, accommodation, packages, mobility` ; `FOOTER_LINKS` vaut `experiences, accommodation, packages, mobility, contact` ; `LEGAL_LINKS` vaut `legalNotice, privacy, terms` ; `resolveLink` renvoie `{ kind: 'internal', href }` pour une clé de `IMPLEMENTED_ROUTES` et `{ kind: 'whatsapp', href }` vers `wa.me` avec le message générique de la langue sinon ; `visible(list)` ne garde que les clés livrées
- [X] T009 Créer `src/i18n/navigation.ts` : listes de T008, `isImplemented(key)`, `visible(list)`, `resolveLink(key, locale, whatsappNumber)` qui s'appuie sur `buildWhatsAppUrl` de `src/lib/seo.ts`, conformément à [contracts/shell.md](./contracts/shell.md). Fonctions pures, sans import d'Astro
- [X] T010 [P] Écrire `tests/unit/format-price.test.ts` (doit échouer), couverture visée 100 % : `formatXaf(100000, 'fr')` → « 100 000 FCFA » avec espace insécable fine, `formatXaf(100000, 'en')` → « 100,000 FCFA » ; `formatEurEquivalent(25000, 'fr', 655.957)` → « ≈ 38,11 € », `(25000, 'en', …)` → « ≈ €38.11 », `(15000, 'fr', …)` → « ≈ 22,87 € » ; toujours deux décimales, y compris pour un montant rond ; arrondi au centime le plus proche ; montant nul ou négatif refusé
- [X] T011 Créer `src/features/estimation/formatPrice.ts` (`formatXaf`, `formatEurEquivalent`, avec `Intl.NumberFormat`) et `src/content/site/currency.json` = `{ "eurToXaf": 655.957, "source": "Parité fixe XAF/EUR (BEAC)", "since": "1999-01-01" }`
- [X] T012 [P] Étendre `tests/unit/content-schema.test.ts` (doit échouer) : `categorySchema` exige `image: { src, alt }` ; `companySchema` accepte un fichier sans `email`, sans `social` et sans champs `legal.*` hormis `legal.host`, refuse une adresse `social[].url` qui n'est pas en `https`, refuse un `social[].network` hors `facebook | instagram | tiktok` ; `currencySchema` exige `eurToXaf > 0` ; `homeSchema` exige `price.amount` entier strictement positif et `unit` dans `per_night | per_group`, avec `basePersons` pour `per_group` ; `legalSchema` exige `doc` dans `legalNotice | privacy | terms`, `locale` dans `fr | en`, `description` de 160 caractères au plus, `updatedAt` en date ISO
- [X] T013 Ajouter à `src/content/schemas.ts` `companySchema`, `currencySchema`, `homeSchema` et `legalSchema` conformes à [contracts/content.md](./contracts/content.md) et à [data-model.md](./data-model.md) ; transformer `categorySchema` en fonction `categorySchema(src)` qui reçoit le schéma d'image, comme `serviceSchema(src)`
- [X] T014 Mettre à jour `src/content.config.ts` : `categories` et `services` reçoivent le helper `image()` d'Astro (`schema: ({ image }) => …`) ; nouvelle collection `legal` (`glob` sur `src/content/legal/**/*.md`, `legalSchema`). Corriger `src/content/categories/nature-decouverte.json` et `src/content/services/excursion-en-pirogue.json` pour pointer vers des photos importées en T002, par chemin relatif au fichier JSON
- [X] T015 Créer `src/content/site/company.json` conforme à [contracts/content.md](./contracts/content.md) : `brand`, `group` « Breezy Groupe », `sisterBrands` `["TKS®", "iBreezy", "Breezy Delivery"]`, `locality` FR « Kribi, Cameroun » / EN « Kribi, Cameroon », `social: []`, `about.short` (deux premières phrases du texte de Franck, section 1 quater de `docs/client-answers.md`, mot pour mot) et `about.full` (texte complet), avec leurs traductions anglaises, `legal.host` Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis. Créer `src/lib/site.ts` qui importe `company.json` et `currency.json`, les valide avec leurs schémas au chargement (le build échoue en cas d'erreur) et exporte des objets typés. `home.json` n'existe pas encore : son import est ajouté en T024
- [X] T016 Étendre `src/layouts/BaseLayout.astro` aux propriétés de [contracts/shell.md](./contracts/shell.md) : `routeKey` (obligatoire), `ogImage`, `floatingWhatsApp` (vrai par défaut, le bouton flottant n'est rendu que s'il est vrai), `jsonLd` (rendu en `<script type="application/ld+json">`). Mettre à jour `src/pages/index.astro`, `src/pages/en/index.astro`, `src/pages/404.astro` et `src/pages/en/404.astro` pour passer `routeKey`
- [X] T017 Créer `src/components/SmartLink.astro` : reçoit `routeKey`, `locale`, un libellé et une variante de style ; rend `resolveLink` ; pour un résultat `whatsapp`, ajoute l'icône WhatsApp, `target="_blank"`, `rel="noopener noreferrer"` et un nom accessible qui mentionne WhatsApp (FR-009). Ajouter les chaînes `link.viaWhatsapp` FR et EN

**Checkpoint** : `npm run check` passe ; les fonctions pures de cette phase sont couvertes.

---

## Phase 3: User Story 1 — Découvrir Kibreeze et avoir envie de venir à Kribi (Priority: P1) 🎯 MVP

**Goal** : l'accueil touristique complet, conforme à `docs/design-exports/01-accueil.jpg` et `10-accueil-ordinateur.jpg`, dans les deux langues.

**Independent Test** : ouvrir `/` en 360 px, faire défiler toute la page, vérifier l'ordre des sections, les photos, les prix FCFA avec leur équivalent euro, puis refaire sous `/en/`.

### Tests for User Story 1

- [X] T018 [P] [US1] Écrire `tests/unit/card-price.test.ts` (doit échouer), couverture visée 100 % de `src/features/estimation/cardPrice.ts` (constitution, principe III) : service avec `pricing` fixe → forme fixe ; service à `tiers` → plus petit montant des tarifs non `quote`, en forme « à partir de » (campement Bagyeli → 7 500 `per_person`) ; tous les tarifs `quote` ou `pricing.kind = 'quote'` → badge sur devis
- [X] T019 [P] [US1] Écrire `tests/component/price.test.ts` : prix fixe FR « 25 000 FCFA / personne » puis « ≈ 38,11 € » sur une ligne distincte ; « À partir de 15 000 FCFA / nuit » ; badge « Sur devis » sans euro ; équivalents anglais ; aucune violation axe
- [X] T020 [P] [US1] Écrire `tests/e2e/home.spec.ts` : sur `/` et `/en/`, hero visible au premier écran avec logo, slogan, titre, deux boutons ; sections dans l'ordre de FR-010 (repérées par `data-section`) ; la section TKS® est plus basse que « À ne pas manquer » et ne contient pas d'image de fond ; « tarifs indicatifs » apparaît une seule fois ; chaque prix FCFA est suivi d'un équivalent euro ; pas de défilement horizontal à 320 et 360 px ; contenu lisible avec JavaScript désactivé ; aucun bouton « Ajouter à mon séjour » ; aucun nombre d'expériences sur les cartes de catégorie
- [X] T021 [US1] Mettre à jour les tests de 001 qui visent l'ancien accueil : `tests/component/home.a11y.test.ts` et `tests/e2e/skeleton.spec.ts` (texte « en cours de construction » supprimé)

### Implementation for User Story 1

- [X] T022 [P] [US1] Créer `src/content/categories/aventure.json` (order 20) et `src/content/categories/detente.json` (order 30), et compléter `nature-decouverte.json` (order 10, retirer `provisional`) : nom FR et EN (« Nature & Découverte » / « Nature & Discovery », « Aventure » / « Adventure », « Détente » / « Relaxation »), description courte, image avec texte alternatif FR et EN
- [X] T023 [P] [US1] Créer ou compléter dans `src/content/services/` les quatre expériences `featured: true` de [data-model.md](./data-model.md), contenu tiré de `docs/design-briefs/kibreeze-ecrans-stitch.md` (écran 1) et de `docs/data-model.md` : `chutes-de-la-lobe.json` (5 000, `per_person`, dimension `persons`), `excursion-en-pirogue.json` (35 000, `per_group`, `maxCapacity: 8`, retirer `provisional` et `availability: "disabled"`), `croisiere-en-bateau.json` (25 000, `per_person`, dimension `persons`), `campement-bagyeli.json` (`tiers` : individuel 7 500 `per_person` avec dimension `persons`, couple 20 000 `per_group` sans dimension, groupe `quote`) ; descriptions courtes de 160 caractères au plus, FR et EN, textes alternatifs FR et EN
- [X] T024 [P] [US1] Créer `src/content/site/home.json` (aperçus temporaires, supprimés par 005) : Chambre à partir de 15 000 `per_night`, Studio à partir de 30 000 `per_night`, Villa à partir de 150 000 `per_night` ; Package Découverte 100 000 `per_group` `basePersons: 2`, résumé « Chutes, pirogue, campement, musée, guide » ; Package Aventure 150 000 `per_group` `basePersons: 2`, résumé « Chutes, pirogue, quad, jet-ski, kayak, cheval » ; titres, résumés et textes alternatifs FR et EN. Ajouter dans `src/lib/site.ts` l'import de `home.json`, validé par `homeSchema`
- [X] T025 [US1] Créer `src/features/estimation/cardPrice.ts` : `cardPrice(service)` conforme à T018, fonction pure sans import d'Astro. Créer `src/lib/catalog.ts`, limité à l'accès aux collections : `getCategories()` triées par `order`, `getFeatured()` (services `featured`, triés par `order`), `categoryCount(id)` qui renvoie `undefined` tant que `experiences` n'est pas dans `IMPLEMENTED_ROUTES`
- [X] T026 [US1] Créer `src/components/Price.astro` : rend une sortie de `cardPrice` ou un prix d'aperçu avec `formatXaf`, le libellé d'unité (`price.unit.<unit>`, `price.from`, `price.quote`, `price.forPersons`) et, sur sa propre ligne en texte secondaire plus petit, `formatEurEquivalent` ; aucun euro pour un prix sur devis. Ajouter ces chaînes FR et EN
- [X] T027 [P] [US1] Créer `src/components/home/Hero.astro` : `<Picture>` AVIF/WebP, `loading="eager"`, `fetchpriority="high"`, `sizes="100vw"`, largeurs 640/960/1280/1920, hauteur `--size-hero-mobile` plafonnée à `--size-hero-max` ; voile en dégradé CSS du bas vers le haut ; texte ancré dans le tiers inférieur, aligné à gauche : logo crème `src/assets/brand/kibreeze-wordmark.svg` sans symbole, slogan en `--font-script`, `h1` « Découvrez Kribi autrement », phrase d'accroche, boutons « Découvrir les expériences » (plein, rouge) et « Planifier mon séjour » (contour blanc) via `SmartLink` vers `experiences` et `stay` ; chevron animé en CSS, coupé sous `prefers-reduced-motion`
- [X] T028 [P] [US1] Créer `src/components/home/CategoryCards.astro` : titre « Nos expériences », trois cartes photo entièrement cliquables via `SmartLink` vers `experiences`, voile sombre, nom, flèche discrète, nombre d'expériences seulement si `categoryCount` le fournit ; trois colonnes à partir de `lg`
- [X] T029 [P] [US1] Créer `src/components/home/FeaturedCarousel.astro` : titre « À ne pas manquer », liste en défilement horizontal avec `scroll-snap`, cartes de `--size-card-featured` débordant à droite, photo sur deux tiers, nom, description courte, `Price` ; la carte entière mène à la fiche via `SmartLink` (WhatsApp tant que 003 n'est pas livrée) ; grille de trois ou quatre colonnes à partir de `lg`
- [X] T030 [P] [US1] Créer `src/components/home/ImmersiveStrip.astro` : pleine largeur sans marge, photo de la Lobé, mots « MER · FORÊT · CHUTES · PIROGUE » centrés en capitales espacées, sans bouton ; traduction anglaise dans le dictionnaire
- [X] T031 [P] [US1] Créer `src/components/home/AccommodationTeaser.astro` : titre « Où dormir à Kribi », phrase « Dites-nous votre budget, nous trouvons le logement. », trois cartes de `home.json` en défilement horizontal avec `Price`, lien « Voir tous les hébergements » via `SmartLink` vers `accommodation`
- [X] T032 [P] [US1] Créer `src/components/home/PackagesTeaser.astro` : fond terracotta plein (`--color-brand-warm`), texte crème, titre « Des séjours déjà composés », deux cartes claires de `home.json` avec résumé et `Price` « / 2 personnes », lien « Voir les 4 formules » via `SmartLink` vers `packages`
- [X] T033 [P] [US1] Créer `src/components/home/MobilityStrip.astro` : rangée unique compacte, fond `--color-bg-subtle`, sans photo, logo `src/assets/brand/tks-mark.png` noir plus petit que le logo Kibreeze, « Mobilité & transport », « Location, transferts et chauffeur privé pour compléter votre séjour », lien « Voir » via `SmartLink` vers `mobility` (FR-016)
- [X] T034 [P] [US1] Créer `src/components/home/About.astro` : titre « Qui sommes-nous », photo de paysage, `company.about.short` mot pour mot, lien « En savoir plus » vers `getRoutePath('contact')` + `#a-propos` si `contact` est livré, sinon pas de lien
- [X] T035 [P] [US1] Créer `src/components/home/WhatsAppCta.astro` : fond rouge plein, texte crème, titre « Un séjour sur mesure ? », une phrase, bouton vert « Contacter Kibreeze sur WhatsApp » vers le message générique
- [X] T036 [US1] Créer `src/components/home/HomePage.astro` qui assemble les sections dans l'ordre de FR-010, chacune avec `data-section`, et la mention « tarifs indicatifs » une seule fois ; réduire `src/pages/index.astro` et `src/pages/en/index.astro` à un appel de `HomePage` avec la locale ; retirer les chaînes `home.intro` devenues inutiles et ajouter toutes les chaînes de l'accueil dans `src/i18n/fr.ts` et `src/i18n/en.ts`

**Checkpoint** : T018 à T021 passent ; l'accueil est montrable à Franck, même dans l'ancienne coque.

---

## Phase 4: User Story 2 — Joindre Kibreeze sur WhatsApp depuis n'importe où (Priority: P2)

**Goal** : bouton flottant bien placé, page Contact avec la présentation complète.

**Independent Test** : depuis `/`, `/contact` et une 404, dans chaque langue, toucher le bouton WhatsApp et lire le message prérempli ; ouvrir `/contact` et vérifier ses informations.

### Tests for User Story 2

- [ ] T037 [P] [US2] Écrire `tests/e2e/whatsapp-contact.spec.ts` : sur `/`, `/contact`, `/en/`, `/en/contact` et une 404 de chaque langue, le bouton flottant pointe vers `https://wa.me/<numéro>?text=` + message générique de la langue (FR-LAND-5), porte `target="_blank"` et un nom accessible ; en 360 px, son bord bas est au moins 16 px au-dessus du bord haut de la barre à onglets quand elle existe ; `/contact` affiche le numéro cliquable, « Kribi, Cameroun », la section `#a-propos` avec le texte complet, aucun `form`, aucun horaire, aucun e-mail ni réseau social tant que `company.json` n'en contient pas

### Implementation for User Story 2

- [ ] T038 [US2] Repositionner `src/components/WhatsAppButton.astro` : cercle de 56 px, ancré en bas à droite, à `calc(var(--size-tabbar) + 16px)` du bas sous `lg` et à 16 px au-dessus, en remplaçant la valeur brute `bottom-4` par des tokens
- [ ] T039 [US2] Créer `src/components/contact/ContactPage.astro` : titre, bouton WhatsApp générique, numéro WhatsApp affiché au format international lisible et cliquable (`wa.me`), localité, e-mail en `mailto:` et réseaux sociaux seulement s'ils sont fournis, section `id="a-propos"` « Qui sommes-nous » avec `company.about.full` et une photo de paysage ; pas de formulaire, pas d'horaires (FR-018). Ajouter les chaînes FR et EN
- [ ] T040 [US2] Créer `src/pages/contact.astro` et `src/pages/en/contact.astro` (appel de `ContactPage`, titre et description uniques) puis ajouter `contact` à `IMPLEMENTED_ROUTES` dans `src/i18n/routes.ts`

**Checkpoint** : T037 passe ; le lien « En savoir plus » de l'accueil mène à `/contact#a-propos`.

---

## Phase 5: User Story 3 — Se repérer et changer de langue sur toutes les pages (Priority: P3)

**Goal** : en-tête, barre à onglets, navigation ordinateur, pied de page et 404 définitifs.

**Independent Test** : parcourir `/`, `/contact` et une 404 en 360 px puis en 1 440 px, dans les deux langues, au clavier, et vérifier que chaque lien mène à une page existante.

### Tests for User Story 3

- [X] T041 [P] [US3] Écrire `tests/component/shell.test.ts` : `Header` contient le logo, le sélecteur FR | EN et un lien WhatsApp, aucun bouton de menu ; `TabBar` ne rend que les onglets livrés, avec `aria-current="page"` sur l'onglet courant ; `Footer` cite Kibreeze, TKS®, iBreezy et Breezy Delivery, seule Kibreeze est un lien, et seuls les liens livrés sont rendus ; quatre `nav` nommés distincts ; aucune violation axe
- [X] T042 [P] [US3] Écrire `tests/e2e/shell.spec.ts` : en 360 px, barre à onglets visible en bas, en-tête sans icône Mon séjour ni menu hamburger ; en 1 440 px, barre à onglets masquée et liens livrés dans l'en-tête, contenu limité à `--size-content` ; sélecteur de langue sur chaque page vers la page équivalente, sans redirection ; une adresse inexistante sous `/` et sous `/en/` sert la 404 de sa langue, avec coque et retour vers l'accueil ; parcours au clavier : lien d'évitement en premier, focus visible ; **sur chaque page livrée des deux langues**, aucun défilement horizontal à 320, 360, 1 440 et 1 920 px (SC-005) ; **sur chaque page livrée**, le texte visible ne contient ni « livraison » ni « delivery » hors de « Breezy Delivery », ni « $ », ni étoile de notation ou mot « avis » / « review » (FR-022)

### Implementation for User Story 3

- [X] T043 [US3] Créer `src/components/Header.astro` en remplacement de `src/components/Nav.astro` (supprimé, références mises à jour) : sous `lg`, logo rouge `kibreeze-wordmark.svg` sans symbole, `LanguageSwitcher`, icône WhatsApp ; à partir de `lg`, ajout des liens `visible(DESKTOP_NAV)` avec `aria-current`, et emplacement Mon séjour rendu seulement si `stay` est livré ; `nav` nommé « Navigation principale »
- [X] T044 [P] [US3] Créer `src/components/TabBar.astro` : `nav` « Navigation mobile » fixé en bas, hauteur `--size-tabbar`, `z-index: var(--z-tabbar)`, onglets `visible(TAB_BAR)` avec icône et libellé, onglet actif en rouge et `aria-current="page"`, emplacement du badge Mon séjour prévu mais non rendu avant 004 ; masqué à partir de `lg`. Ajouter les libellés `nav.<key>` FR et EN
- [X] T045 [P] [US3] Refaire `src/components/Footer.astro` : fond `--color-footer-bg`, logo complet crème (jamais la version rouge sur ce fond), slogan, liens `visible(FOOTER_LINKS)` plus « À propos » vers `contact#a-propos` si livré, localité, icônes des réseaux de `company.social` seulement s'il y en a, ligne « Kibreeze est une marque de Breezy Groupe, avec TKS®, iBreezy et Breezy Delivery. » avec seule Kibreeze en lien vers l'accueil, rangée `nav` « Informations légales » avec `visible(LEGAL_LINKS)`, copyright
- [X] T046 [US3] Brancher la coque dans `src/layouts/BaseLayout.astro` : `Header`, `TabBar` avec `routeKey`, `Footer`, bouton flottant ; marge basse de `main` égale à `--size-tabbar` sous `lg` pour qu'aucun contenu ne reste masqué
- [X] T047 [US3] Refaire `src/pages/404.astro` et `src/pages/en/404.astro` dans la coque, via un composant partagé `src/components/NotFoundPage.astro` : titre, texte, retour vers l'accueil, `noindex`

**Checkpoint** : T041 et T042 passent ; tous les liens de la coque mènent à une page existante.

---

## Phase 6: User Story 4 — Être trouvé et bien présenté (Priority: P4)

**Goal** : métadonnées uniques, image de partage, données structurées, plan du site, aucun lien cassé.

**Independent Test** : lire les métadonnées de chaque page livrée, le plan du site, et lancer `npm run check:links`.

### Tests for User Story 4

- [ ] T048 [P] [US4] Écrire `tests/unit/seo-jsonld.test.ts` (doit échouer) : `buildLocalBusinessJsonLd(company, locale, siteUrl, phone)` produit `@type: "TravelAgency"`, `name: "Kibreeze"`, `areaServed` Kribi, `address` avec `addressLocality: "Kribi"` et `addressCountry: "CM"`, `telephone` au format `+237…`, `url` absolue, `logo` absolu, `inLanguage` égal à la locale
- [ ] T049 [P] [US4] Écrire `tests/e2e/seo.spec.ts` : sur chaque page livrée des deux langues, `title` et `meta description` uniques sur tout le site, `og:image` en adresse absolue, `link rel="canonical"` propre à la langue, liens `hreflang` fr, en et x-default ; JSON-LD `TravelAgency` présent sur l'accueil seulement ; `sitemap-index.xml` liste les pages livrées dans les deux langues, sans 404 ni `/dev/`

### Implementation for User Story 4

- [ ] T050 [US4] Ajouter `buildLocalBusinessJsonLd` à `src/lib/seo.ts`, et le passer en `jsonLd` depuis `HomePage.astro`
- [ ] T051 [US4] Générer l'image de partage par défaut dans `src/layouts/BaseLayout.astro` avec `getImage` d'`astro:assets` depuis la photo du hero, 1 200 × 630, JPEG ; `og:image`, `og:image:width`, `og:image:height` et `og:image:alt` absolus ; propriété `ogImage` pour la remplacer
- [ ] T052 [US4] Exclure la 404 du plan du site dans le filtre de `astro.config.mjs`, en plus de `/dev/`
- [ ] T053 [US4] Écrire `scripts/check-links.mjs` : parcourt `dist/**/*.html`, extrait chaque `href` et `src` commençant par `/` (ancre et paramètres retirés), échoue en listant page et lien si la cible n'existe ni en fichier, ni en `<chemin>.html`, ni en `<chemin>/index.html` ; ajouter l'étape `npm run check:links` après `npm run build:prod` dans `.github/workflows/ci.yml`
- [ ] T054 [US4] Passer `lighthouserc.json` au profil mobile (retirer `"preset": "desktop"`) et ajouter `/contact.html`, `/en/contact.html`, `/404.html` et `/en/404.html` aux adresses auditées (SC-002)

**Checkpoint** : T048 et T049 passent, `npm run check:links` passe.

---

## Phase 7: User Story 5 — Consulter les informations légales (Priority: P5)

**Goal** : mentions légales, confidentialité et cookies, conditions d'utilisation, en FR et en EN, liées depuis le pied de page.

**Independent Test** : depuis le pied de page, ouvrir les trois pages dans chaque langue et y retrouver éditeur, hébergeur, traitements, absence de cookie et conditions.

### Tests for User Story 5

- [ ] T055 [P] [US5] Écrire `tests/unit/check-legal.test.ts` (doit échouer) : `missingLegalFields(company)` liste `publisherName`, `legalForm`, `registration.rccm`, `registration.niu`, `address`, `publicationDirector` quand ils manquent, renvoie une liste vide quand tout est présent ; le script affiche un avertissement et sort avec le code 0 dans les deux cas
- [ ] T056 [P] [US5] Étendre `tests/unit/check-i18n.test.ts` : un document légal présent en `fr` mais absent en `en` fait échouer le contrôle de production en nommant le document ; un `locale` de frontmatter différent du dossier est signalé
- [ ] T057 [P] [US5] Écrire `tests/e2e/legal.spec.ts` : les trois liens légaux du pied de page mènent aux pages de leur langue ; chaque page affiche sa date de mise à jour ; les mentions légales citent Cloudflare, Inc. et son adresse ; `/confidentialite#cookies` et `/en/privacy#cookies` existent ; **sur chaque page livrée**, `document.cookie` est vide et les clés de `localStorage` sont un sous-ensemble de la liste documentée (vide pour 002) (SC-010)

### Implementation for User Story 5

- [ ] T058 [US5] Écrire `scripts/check-legal.ts` (`missingLegalFields`, sortie toujours 0) et l'appeler, en avertissement, depuis `build:prod` dans `package.json`
- [ ] T059 [US5] Étendre `scripts/check-i18n.ts` aux documents de la collection `legal` : une paire FR / EN par `doc`, `locale` cohérent avec le dossier
- [ ] T060 [P] [US5] Rédiger `src/content/legal/fr/legal-notice.md` et `src/content/legal/en/legal-notice.md` : éditeur (rendu par `PublisherIdentity`), responsable de la publication, hébergeur, propriété intellectuelle des textes, logos et photographies (photos propriété de Kibreeze ou utilisées avec l'accord des personnes photographiées), liens hypertextes, droit applicable ; références à la loi camerounaise n° 2010/021 sur le commerce électronique et n° 2010/012 sur la cybersécurité ; frontmatter conforme à `legalSchema`
- [ ] T061 [P] [US5] Rédiger `src/content/legal/fr/privacy.md` et `src/content/legal/en/privacy.md` : responsable du traitement, aucune collecte par formulaire, journaux techniques de l'hébergeur, sélection conservée sur l'appareil (à partir de la feature 004), messages WhatsApp reçus par Kibreeze (finalité : répondre et organiser le séjour ; base légale : mesures précontractuelles ; conservation ; destinataires ; transfert hors du pays du visiteur via WhatsApp et Cloudflare) ; droits d'accès, de rectification, d'effacement et d'opposition et moyen de les exercer (WhatsApp, e-mail quand il existe) ; références à la loi camerounaise n° 2024/017 et au RGPD ; section `## Cookies {#cookies}` (ancre `cookies`) : aucun cookie, aucun traceur publicitaire ni de mesure d'audience, tableau des stockages vide pour 002, engagement de mise à jour avant tout ajout
- [ ] T062 [P] [US5] Rédiger `src/content/legal/fr/terms.md` et `src/content/legal/en/terms.md` : objet du site, prix indicatifs en FCFA et équivalent en euros indicatif, estimation non contractuelle, une demande WhatsApp devient une réservation seulement après confirmation de Kibreeze, conditions de la prestation communiquées avec le devis, responsabilités, propriété intellectuelle, droit camerounais applicable, date de dernière mise à jour
- [ ] T063 [US5] Créer `src/components/legal/PublisherIdentity.astro` (rend les champs `legal.*` présents de `company.json`, omet les absents sans emplacement vide) et `src/components/legal/LegalPage.astro` (titre, date de mise à jour formatée selon la langue, corps Markdown, `PublisherIdentity` en tête des mentions légales seulement) ; ajouter les chaînes FR et EN
- [ ] T064 [US5] Créer les six pages `src/pages/mentions-legales.astro`, `src/pages/confidentialite.astro`, `src/pages/conditions-utilisation.astro`, `src/pages/en/legal-notice.astro`, `src/pages/en/privacy.astro`, `src/pages/en/terms-of-use.astro`, chacune lisant son document de la collection `legal` ; puis ajouter `legalNotice`, `privacy` et `terms` à `IMPLEMENTED_ROUTES`

**Checkpoint** : T055 à T057 passent ; les liens légaux apparaissent dans le pied de page de toutes les pages.

---

## Phase 8: Polish & vérification finale

- [ ] T065 [P] Mettre à jour la documentation : arborescence des pages dans `docs/architecture.md`, photos utilisées et état des coordonnées dans `docs/content-tracker.md`, statut de 002 dans `specs/README.md`
- [ ] T066 Lancer `npm run check`, `npm run build:prod`, `npm run check:links`, `npm run check:bundle`, `npm run test:e2e` et `npm run lighthouse` ; corriger jusqu'à ce que tout passe
- [ ] T067 Dérouler les 14 scénarios manuels de [quickstart.md](./quickstart.md) sur téléphone et en 1 440 px, puis consigner dans sa section « Résultats relevés » les scores Lighthouse de `/`, `/en/`, `/contact` et le temps d'affichage du hero
- [ ] T068 Ouvrir la proposition de modification de `002-kibreeze-core` vers `main`, vérifier que la CI passe, et partager l'adresse d'aperçu avec Franck pour la relecture de SC-008

---

## Dépendances

```text
Phase 1 Setup
   ↓
Phase 2 Foundational   ← bloque toutes les stories
   ↓
   ├── US3 (P3)  ← à faire en premier : la coque
   ├── US1 (P1)  ← MVP visible, se construit dans la coque
   ├── US2 (P2)  ← Contact ; « En savoir plus » de US1 s'active quand elle est livrée
   ├── US4 (P4)  ← a besoin des pages de US1 et US2 pour être vérifiée entièrement
   └── US5 (P5)  ← indépendante ; ses liens apparaissent dans le pied de page de US3
   ↓
Phase 8 Polish
```

Détail des dépendances internes :

- T002 dépend de T001. T006 dépend de T003. T014 dépend de T002 et T013. T015 dépend de T013.
- T009 dépend de T007 et T008. T011 dépend de T010. T013 dépend de T012. T017 dépend de T009.
- T025 dépend de T014, T018 et T022 à T024. L'import de `home.json` dans `src/lib/site.ts` (T024) suppose T015. T026 dépend de T011 et T025. T027 à T035 dépendent de T017 et T026. T036 dépend de T027 à T035.
- T039 dépend de T015. T040 dépend de T039.
- T043 à T045 dépendent de T009. T046 dépend de T043 à T045 et T016. T047 dépend de T046.
- T050 dépend de T048 et T036. T051 dépend de T002. T054 dépend de T040.
- T058 dépend de T055. T059 dépend de T056. T063 dépend de T015. T064 dépend de T060 à T063.
- T066 dépend de toutes les tâches précédentes.

## Exécutions parallèles possibles

- Setup : T003, T004 et T005 en parallèle de T001 ; T006 après T003.
- Foundational : T008, T010 et T012 (tests) en parallèle ; puis T009, T011 et T013 chacun après son test.
- US1 : T018, T019 et T020 en parallèle ; T022, T023 et T024 en parallèle ; puis les neuf sections T027 à T035 en parallèle, un fichier chacune.
- US3 : T041 et T042 en parallèle ; T044 et T045 en parallèle après T043.
- US4 : T048 et T049 en parallèle.
- US5 : T055, T056 et T057 en parallèle ; T060, T061 et T062 (textes) en parallèle.

## Stratégie de livraison

1. **Socle** : phases 1 et 2.
2. **Coque** : phase 5 (US3). Le squelette de 001 prend sa navigation définitive.
3. **MVP** : phase 3 (US1). L'accueil est montrable à Franck.
4. **Conversion** : phase 4 (US2). La page Contact est livrée.
5. **Visibilité** : phase 6 (US4).
6. **Légal** : phase 7 (US5). Requis avant la mise en ligne sous kibreeze.com, avec la checklist de lancement de [quickstart.md](./quickstart.md).
7. **Clôture** : phase 8, puis fusion vers `main`.

## Total

68 tâches : 6 en setup, 11 en fondation, 19 pour US1, 4 pour US2, 7 pour US3, 7 pour US4, 10 pour US5, 4 en finition.
