# Research — 002 Coque du site Kibreeze et page d'accueil

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-05

Les choix structurants (Astro statique, i18n maison, Tailwind v4, Cloudflare Pages) sont fixés par les ADR-001 à ADR-015 de [technical-decisions.md](../../docs/technical-decisions.md). Ce document tranche les questions de mise en œuvre propres à cette feature. Aucune nouvelle dépendance npm n'est ajoutée : l'optimisation d'images utilise `sharp`, déjà installé avec Astro (0.34.5).

---

## 1. Lien vers une page non livrée

**Decision**: une fonction pure `resolveLink(key, locale)` dans `src/i18n/navigation.ts` renvoie `{ kind: 'internal', href }` si la route figure dans `IMPLEMENTED_ROUTES`, sinon `{ kind: 'whatsapp', href }` vers le message générique de la langue. Les composants n'écrivent jamais un `href` interne à la main : ils passent par `getRoutePath` pour une page livrée, par `resolveLink` pour une cible qui peut ne pas l'être. La navigation (onglets, barre ordinateur, pied de page) filtre simplement sur `IMPLEMENTED_ROUTES`.

**Rationale**: `IMPLEMENTED_ROUTES` existe déjà depuis 001. Une seule liste à modifier quand une feature livre sa page : la navigation, le plan du site et les liens de l'accueil basculent ensemble, ce qui satisfait FR-004, FR-009 et l'acceptation 3 de l'histoire 3. La règle est testable sans rendu.

**Alternatives considered**: désactiver visuellement les onglets non livrés (rejeté : un onglet grisé promet une page, contraire à la spec) ; afficher les liens et laisser la 404 répondre (rejeté : SC-004).

## 2. Nouvelles routes

**Decision**: trois clés ajoutées à `ROUTES` et à `IMPLEMENTED_ROUTES`, en plus de `contact` :

| Clé | Français | Anglais |
|---|---|---|
| `legalNotice` | `/mentions-legales` | `/en/legal-notice` |
| `privacy` | `/confidentialite` | `/en/privacy` |
| `terms` | `/conditions-utilisation` | `/en/terms-of-use` |

La section cookies est une ancre `#cookies` de la page confidentialité, pas une page distincte.

**Rationale**: slugs traduits, en minuscules et sans accent, conformes au contrat d'adresses de 001. Une page « cookies » séparée répéterait le contexte de la politique de confidentialité ; le libellé de lien « Confidentialité et cookies » rend la section trouvable.

**Alternatives considered**: page `/cookies` dédiée (rejeté, voir ci-dessus) ; textes légaux dans une seule page (rejeté : les trois ont des lecteurs et des mises à jour différents).

## 3. Photos et optimisation

**Decision**: les photos utilisées sont copiées depuis `Elements/tri-par-activite/` vers `src/assets/photos/<sujet>/`, redimensionnées une fois à 2 400 px de large au plus et versionnées. Le rendu passe par `<Picture>` d'`astro:assets`, formats AVIF et WebP avec repli JPEG, tailles responsives. Le schéma `services` passe du chemin texte au helper `image()` d'Astro, comme 001 l'avait annoncé pour 003 : 002 publie les premières expériences avec photo, la bascule a lieu ici.

Choix des photos, faits au moment de l'implémentation en regardant les fichiers, sous trois contraintes : aucun fichier `_FILIGRANE`, photos du village Bagyeli autorisées (accord relayé le 2026-10-04), et repli sur un paysage de Kribi quand le sujet manque. La seule photo de croisière (`croisiere/L6-08.jpg`) a été jugée inutilisable lors du tri : la carte Croisière prend un coucher de soleil du dossier `ambiance-hero-plages-couchers/`.

**Rationale**: `Elements/` est ignoré par Git (décision du 2026-09-25) ; le build en CI et sur Cloudflare a besoin des fichiers dans le dépôt. Les originaux font jusqu'à plusieurs Mo, le redimensionnement préalable garde le dépôt léger (cible : moins de 10 Mo pour cette feature). FR-SEO-4 et SC-001 exigent des formats modernes.

**Alternatives considered**: photos dans `public/` (rejeté : aucune optimisation) ; hébergement d'images externe (rejeté : principe I, dépendance de service).

## 4. Image du hero et performance

**Decision**: `<Picture>` avec `loading="eager"`, `fetchpriority="high"`, `sizes="100vw"`, largeurs 640, 960, 1 280, 1 920. Le voile sombre est un dégradé CSS par-dessus l'image, jamais intégré à la photo. Hauteur : `85svh` sur téléphone, plafonnée sur ordinateur (`max-height` en token).

**Rationale**: le hero est l'élément LCP. `svh` évite le saut provoqué par la barre d'adresse mobile. Un dégradé CSS garde la photo réutilisable comme image de partage.

**Alternatives considered**: vidéo (hors périmètre, hypothèse de la spec) ; image de fond CSS (rejeté : pas de formats responsives ni de priorité de chargement).

## 5. Barre à onglets, navigation ordinateur, carrousel : sans JavaScript

**Decision**: tout est en HTML et CSS. La barre à onglets est un `<nav>` fixé en bas, masqué à partir du point de rupture `lg` (64rem), où la navigation passe dans l'en-tête. L'onglet actif porte `aria-current="page"`. Le carrousel « À ne pas manquer » est une liste en défilement horizontal avec `scroll-snap`, cartes de 280 px. Le chevron du hero est animé en CSS, coupé sous `prefers-reduced-motion`.

**Rationale**: principe V, le HTML est complet sans JavaScript ; seul l'îlot de sélection de 004 en dépendra. Aucun JavaScript sur les pages de 002, ce qui laisse le budget de 50 kB intact.

**Alternatives considered**: carrousel avec boutons précédent / suivant en îlot (rejeté : JavaScript pour un confort marginal, ajoutable plus tard si un test utilisateur le demande).

## 6. Conversion en euros

**Decision**: parité officielle fixe **1 € = 655,957 FCFA**, stockée avec sa source et sa date dans `src/content/site/currency.json`. Fonctions pures dans `src/features/estimation/formatPrice.ts` :

- `formatXaf(amount, locale)` : « 100 000 FCFA » en français, « 100,000 FCFA » en anglais ;
- `formatEurEquivalent(amount, locale, rate)` : « ≈ 38,11 € » en français, « ≈ €38.11 » en anglais, toujours deux décimales, arrondi au centime le plus proche.

Couverture de tests à 100 %, conformément au principe III ; la feature 004 réutilise ces fonctions pour le total.

**Rationale**: le franc CFA d'Afrique centrale est rattaché à l'euro par une parité fixe depuis 1999. Ce n'est pas un taux de marché : il ne bouge pas, donc il n'y a pas de date de relevé à rafraîchir. L'exemple du brief, 1 000 FCFA ≈ 1,52 €, est un arrondi qui donnerait 38,00 € pour 25 000 FCFA au lieu de 38,11 €, soit un écart de 0,3 % : la parité exacte est à la fois plus juste et plus simple à justifier. L'exemple de FR-EUR-2 est corrigé en conséquence.

**Alternatives considered**: taux arrondi de 1,52 € pour 1 000 FCFA (rejeté : faux de 0,3 % sans bénéfice) ; API de change (rejeté par FR-EUR-2).

## 7. Données de l'accueil

**Decision**:

- **Catégories** : trois fichiers dans la collection `categories` existante, avec une photo (`image()`) et un `slug` de filtre.
- **Expériences mises en avant** : quatre fichiers dans la collection `services`, `featured: true`, contenu tiré du guide tarifaire. Ils sont complets (photos, textes FR et EN, prix) et deviennent des fiches en 003 sans réécriture.
- **Aperçus hébergements et formules** : un fichier `src/content/site/home.json` porte les cartes d'aperçu (libellé, prix de départ, unité, photo). La feature 005 les remplace par une lecture de ses collections et supprime ces entrées.
- **Coordonnées et identité légale** : `src/content/site/company.json`, emplacement déjà prévu par [architecture.md](../../docs/architecture.md) et par le content-tracker.

Nombre d'expériences par catégorie : calculé à partir de la collection `services` au build. Avec seulement les expériences publiées par 002, le compte serait faux (FR « Nature & Découverte : 1 expérience ») : il n'est affiché qu'à partir du moment où la route `experiences` est livrée, c'est-à-dire quand le catalogue est complet.

**Rationale**: principe IV, aucun prix ni texte dans un composant. Créer maintenant les collections `accommodation` et `packages` anticiperait des schémas que 005 doit concevoir (principe I) ; un fichier d'aperçu temporaire est moins coûteux à jeter qu'un schéma à refaire.

**Alternatives considered**: aperçus dans les dictionnaires (rejeté : ce sont des prix, donc du contenu) ; collections 005 créées dès maintenant (rejeté, voir ci-dessus).

## 8. Textes légaux

**Decision**: collection Markdown `legal` dans `src/content/legal/<locale>/<doc>.md`, frontmatter `doc` (`legalNotice`, `privacy`, `terms`), `title`, `description`, `updatedAt`. Le bloc d'identité de l'éditeur des mentions légales n'est pas écrit dans le Markdown : un composant le rend depuis `company.json`, en omettant les champs absents. Le contrôle `check-i18n` vérifie que chaque document existe dans les deux langues.

Rédaction : textes rédigés par nos soins, structurés par les obligations du droit camerounais (loi n° 2010/012 sur la cybersécurité et la cybercriminalité, loi n° 2010/021 sur le commerce électronique, loi n° 2024/017 sur la protection des données à caractère personnel) et par le RGPD, applicable parce que le site vise des visiteurs situés dans l'Union européenne. Hébergeur : Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis. Les textes portent une date de mise à jour et ne constituent pas un avis juridique ; une relecture professionnelle est recommandée avant le lancement.

Contrôle de lancement : un script `scripts/check-legal.ts` liste les champs d'identité manquants dans `company.json`. Il avertit dans tous les builds et **n'échoue pas** : le site en adresse provisoire doit rester publiable. La mise en ligne sous kibreeze.com est conditionnée à une sortie vide, consignée dans la checklist de lancement de [quickstart.md](./quickstart.md).

**Rationale**: des pages de prose longue sont du contenu éditorial, mieux servi par Markdown que par des dictionnaires de chaînes. Séparer l'identité de l'éditeur permet de compléter les mentions légales en modifiant un seul fichier de données, sans toucher aux textes.

**Alternatives considered**: générateur de mentions légales en ligne (rejeté : textes génériques français, pas adaptés au droit camerounais ni bilingues) ; échec du build si l'identité manque (rejeté : bloquerait toute publication de `main` jusqu'à la réponse de Franck).

## 9. Cookies et stockage

**Decision**: aucun cookie, aucun traceur, aucun bandeau. Un test Playwright vérifie, sur chaque page livrée, que `document.cookie` est vide et que les clés de `localStorage` sont un sous-ensemble de la liste documentée dans la section cookies, vide pour 002. La feature 004 ajoutera sa clé de sélection à la liste et au texte dans la même modification.

**Rationale**: SC-010 et FR-031. Les liens `wa.me` ne déposent rien sur le domaine du site. Les polices sont auto-hébergées (ADR-015), il n'y a donc pas d'appel à Google Fonts. Cloudflare Pages ne pose pas de cookie sur un site statique sans fonctionnalité de sécurité activée ; si le défi anti-robots de Cloudflare était activé un jour, son cookie technique serait à ajouter à la liste.

**Alternatives considered**: bandeau de consentement par précaution (rejeté : inutile juridiquement sans traceur, interdit par le brief, et nuisible à la première impression).

## 10. Données structurées et partage

**Decision**: `buildLocalBusinessJsonLd(company, locale, siteUrl)` dans `src/lib/seo.ts`, type `TravelAgency` (sous-type de `LocalBusiness`), avec `name`, `areaServed` Kribi, `address` (localité Kribi, pays CM), `telephone` au format international, `url`, `logo`, `inLanguage`. Rendu uniquement sur l'accueil. L'image de partage est générée au build depuis la photo du hero, recadrée en 1 200 × 630, et sert de valeur par défaut pour toutes les pages ; `og:image` est une adresse absolue.

**Rationale**: FR-SEO-1 et FR-SEO-3. `TravelAgency` décrit mieux Kibreeze qu'un `LocalBusiness` générique et reste reconnu comme entreprise locale.

**Alternatives considered**: image de partage dessinée à la main par page (rejeté : coût de production sans gain pour quatre pages).

## 11. Contrôle des liens internes

**Decision**: `scripts/check-links.mjs` parcourt `dist/` après le build, extrait chaque `href` et `src` commençant par `/`, et échoue si le fichier cible n'existe pas. Branché dans la CI après `build:prod`, et dans le script npm `check:links`.

**Rationale**: SC-004. Une soixantaine de lignes, sans dépendance, sur le modèle de `check-bundle-size.mjs`.

**Alternatives considered**: outil de vérification de liens externe (rejeté : dépendance pour un contrôle trivial sur un site statique).

## 12. Bouton WhatsApp flottant

**Decision**: `BaseLayout` reçoit une propriété `floatingWhatsApp` (vrai par défaut). Sur téléphone, le bouton est placé à `calc(hauteur de la barre à onglets + 16 px)` du bas, hauteur exposée en token `--size-tabbar`. Le contenu principal reçoit une marge basse équivalente pour ne jamais rester masqué.

**Rationale**: FR-007. Les fiches et `/sejour` des features 003 et 004 passeront `floatingWhatsApp={false}`.
