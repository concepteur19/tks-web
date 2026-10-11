# Research — 008 Les trois univers du Tourisme

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-11

Pas d'inconnue technique : la feature réorganise des pages et du contenu avec les outils déjà en place. Les décisions ci-dessous tranchent la façon de le faire au plus simple (constitution, principe I), et vérifient ce que le code existant couvre déjà.

---

## 1. Les univers remplacent les catégories, dans la même collection

**Decision**: la collection `categories` porte désormais les trois univers. Ses trois fichiers (`nature-decouverte`, `aventure`, `detente`) sont remplacés par `visites`, `activites` et `specialites-culinaires`. Le champ `categoryId` des prestations pointe vers un univers. Le schéma gagne deux champs : `slug` (adresse de la page de l'univers, par langue) et `withOptions` (les options sont-elles proposées sur les fiches de cet univers, `true` par défaut).

**Rationale**: un univers joue exactement le rôle d'une catégorie (regrouper des prestations, avec nom, phrase, photo et ordre). Renommer la collection, le champ et leurs usages toucherait une trentaine de fichiers et de tests sans rien changer pour le visiteur. Le mot anglais `category` reste juste dans le code ; « univers » est le terme des textes et de la documentation.

**Alternatives considered**: nouvelle collection `universes` et champ `universeId` (rejeté : renommage sans valeur, risque de régression) ; univers en dur dans le code (rejeté : principe IV, le contenu est de la donnée).

## 2. Adresses : la page d'entrée garde `/experiences`, chaque univers a la sienne

**Decision**:

| Page | Français | Anglais |
|---|---|---|
| Page d'entrée | `/experiences` | `/en/experiences` |
| Visites & Découvertes | `/experiences/visites` | `/en/experiences/visits` |
| Activités & Loisirs | `/experiences/activites` | `/en/experiences/activities` |
| Spécialités culinaires | `/experiences/specialites-culinaires` | `/en/experiences/local-food` |
| Fiche (inchangée) | `/experiences/<slug>` | `/en/experiences/<slug>` |

La route `experiences` de la table des adresses reste la page d'entrée : l'onglet, la navigation, le plan du site et `IMPLEMENTED_ROUTES` ne changent pas. Les pages d'univers et les fiches partagent la même route dynamique, qui génère les deux sortes de pages. Le contrôle du contenu refuse une prestation dont l'identifiant entrerait en collision avec l'adresse d'un univers, dans l'une ou l'autre langue.

**Rationale**: les adresses des fiches ne bougent pas (FR-007) : liens partagés, plan du site et référencement sont préservés. Les anciennes adresses de filtre (`/experiences#aventure`) mènent naturellement à la page d'entrée, puisque l'ancre n'y désigne plus rien : aucune redirection à écrire. Le slug d'univers est traduit (FR-004), comme les adresses des pages ; celui des fiches reste commun aux deux langues (003, FR-012).

**Alternatives considered**: `/experiences/univers/<slug>` (rejeté : adresse plus longue, pour éviter une collision qu'un contrôle au build empêche déjà) ; une route `tourism` distincte (rejeté : changerait l'onglet, le plan du site et les liens de l'accueil, alors que le nom de l'onglet attend la réponse U1).

## 3. Page d'entrée : plus d'onglets de filtre

**Decision**: `ExperiencesPage.astro` devient la page d'entrée : bandeau, titre « Découvrez Kribi selon vos envies », trois cartes d'univers (`UniverseCard.astro`), bloc « Une envie particulière ? ». `CategoryTabs.astro`, son CSS généré et son script en ligne sont supprimés, comme les chaînes d'interface des onglets.

Chaque carte d'univers montre la photo de l'univers, son nom, sa phrase, le nombre de prestations, les noms des trois premières prestations publiées de l'univers dans l'ordre défini (FR-003), et un lien « Voir le catalogue ». Toute la carte est cliquable, par un seul lien accessible.

**Rationale**: le filtre en CSS de la 003 n'a plus d'objet : chaque univers a sa page. La page d'entrée devient plus légère qu'aujourd'hui, sans liste ni îlot d'ajout rapide.

## 4. Page d'un univers : la liste de la 003, restreinte

**Decision**: nouveau `UniversePage.astro` : fil d'Ariane « Expériences › univers », bandeau plus bas que celui de la page d'entrée avec la photo, le nom et la phrase de l'univers, navigation entre univers (`UniverseNav.astro`), nombre de prestations et mention « prix indicatifs », grille de `ExperienceCard` (inchangée, avec son îlot `QuickAdd`), bloc « Une envie particulière ? ».

`UniverseNav` est une liste de trois liens, l'univers courant marqué `aria-current="page"` et souligné comme l'onglet actif de la 003. Elle remplit FR-005 sans JavaScript.

**Rationale**: réutiliser la carte et la grille de la 003 garde le style des écrans validés 02a et 02b, pour lesquels aucune maquette d'univers n'existe (spec, Out of Scope).

## 5. Bandeaux recadrés au build

**Decision**: les photos de bandeau (page d'entrée et univers) passent par `fit="cover"` en 16:9, comme le bandeau des expériences depuis la 004 (`f2da094`).

**Rationale**: une photo en portrait affichée dans une bande se télécharge sinon entière ; c'est ce qui avait fait tomber `/experiences` à 87 sur Lighthouse.

## 6. Minimum de participants : déjà dans le modèle

**Decision**: aucun nouveau champ. Le minimum est la borne `min` de la dimension `persons` de la règle de quantité, qui borne déjà le sélecteur sur la fiche, à l'ajout rapide et dans Mon séjour (`clampQuantities`). Une fonction pure `minimumParticipants(service)` (`src/features/catalog/`) renvoie ce minimum quand il dépasse 1, et `undefined` sinon. La carte et le bloc prix l'affichent (« Minimum 2 personnes »).

**Rationale**: une seule source pour le plancher et pour la mention ; impossible d'afficher un minimum que le sélecteur ne respecterait pas.

**Vérifié dans le code de la 004**: `defaultLine` prend la valeur par défaut de la dimension, que le schéma oblige déjà à être ≥ `min` ; `parseSelection` ramène une quantité enregistrée sous le nouveau minimum dans ses bornes.

## 7. Tarif dégressif : un indicateur, une phrase

**Decision**: champ facultatif `degressive: true` sur la prestation. Le bloc prix de la fiche affiche alors « Tarif dégressif : le prix par personne peut baisser avec la taille du groupe. » Rien sur la carte, rien dans le calcul.

**Rationale**: le cahier demande d'indiquer la dégressivité « sans imposer tous les paliers en V1 » (section 11). L'estimation reste celle du prix affiché ; le total est déjà présenté comme indicatif.

## 8. Options par univers

**Decision**: `withOptions: false` sur l'univers Spécialités culinaires. La fiche d'une prestation de cet univers ne reçoit aucune option : ni configurateur d'options, ni encadré `noscript`.

**Rationale**: FR-016, réponse Q5 (« les options partout » sur les visites et activités). La règle vit dans le contenu, pas dans un composant (principe IV).

## 9. Ce que la sélection gère déjà

**Vérifié dans `src/features/selection/selection.ts`** : à la lecture du stockage, une ligne dont la prestation n'est plus au catalogue (désactivée), ou dont le tarif n'existe plus (anciens tarifs du campement Bagyeli), est retirée et signalée par le message de la 004. Aucune modification des fonctions pures de sélection, d'estimation ou de message n'est nécessaire : les nouvelles prestations n'utilisent que des unités et des dimensions existantes (`per_session` + `units`, `per_hour` + `hours`, `per_group` + `maxCapacity`, `from`, `quote` avec `persons` informatif).

## 10. Croisière et bateau de plaisance : remplacés, avec redirection

**Decision** (réponses Q1, Q2) : `croisiere-en-bateau` et `bateau-de-plaisance` passent en `availability: "disabled"` ; le bateau de croisière en haute mer est une nouvelle fiche, `croisiere-en-haute-mer`. Leurs anciennes adresses redirigent en 301 vers elle, par un fichier `public/_redirects` (format Cloudflare Pages), dans les deux langues. Un séjour enregistré qui les contient perd la ligne au chargement, avec le message de la 004.

La croisière était l'une des quatre expériences mises en avant sur l'accueil. Le jet-ski la remplace, pour que la section « À ne pas manquer » garde quatre cartes.

**Rationale**: reprendre l'ancienne fiche sous un nouveau prix changerait son unité (personne → heure) : `parseSelection` ramènerait alors en silence « 2 personnes » à « 2 heures », soit 300 000 FCFA. Une nouvelle fiche plus une redirection préservent les liens sans fausser un séjour. `_redirects` est lu par Cloudflare Pages ; l'image nginx de développement l'ignore, sans conséquence hors production.

## 11. Photos : celles de Franck d'abord, puis l'ambiance, puis l'illustration

**Decision**: chaque prestation reçoit, dans cet ordre de préférence :

1. **les photos de Franck** qui la montrent, retrouvées au réexamen du 2026-10-11 et dans le lot ajouté le même jour (tableau dans [data-model.md](./data-model.md)) ;
2. **une photo d'ambiance de son univers**, avec un texte alternatif qui décrit le paysage, pour les visites dont Franck enverra la photo (Ebodjé, Port Autonome, Golden K, Musée Batanga) ;
3. **une illustration réaliste marquée « Photo illustrative »** (§14) pour les spécialités culinaires et le bateau de croisière, à la demande de Franck.

Les 5 photos du feu de plage restées en HEIC dans `~/Downloads/Telegram Desktop` sont converties en JPEG par `sips` (outil intégré à macOS) et copiées dans `Elements/tri-par-activite/feux-de-plage/`. `scripts/import-photos.mjs` lit les sources relatives à `Elements/tri-par-activite/` : les photos du lot du 2026-10-11 y sont copiées dans le dossier de leur activité, sous leur nom d'origine, avant import.

Exclues : toute photo filigranée (phare `L13-02` à `L13-04`, `18-58-17`, `18-59-20`, parasols `L11-01` et `18-58-27`), les doublons en plus basse résolution d'une photo déjà importée.

Cartes d'univers : chutes de la Lobé (visites), jet-ski (activités), étal de poissons `L14-02` (spécialités culinaires, photo réelle de Franck).

## 12. Textes des fiches

**Decision**: lieu, inclus, non inclus et « à savoir » viennent de l'onglet 3 du questionnaire 4. Règle de reprise : une phrase dont le seul contenu est une réserve (« Lieu de départ à confirmer avec le prestataire », « Site à confirmer ») n'est pas publiée ; une phrase qui informe et ajoute une réserve est gardée (« Accès soumis aux règles et autorisations du port »). Les mentions « Photo illustrative » des « à savoir » culinaires ne vont pas dans le texte : la mention est portée par l'image (§14). Les descriptions déjà publiées des 13 prestations existantes restent ; la phrase de Franck sert de description aux 21 nouvelles. Quad, jet-ski et bouée tractée reçoivent « Une personne par engin » dans « À savoir » (Q4). Traduction anglaise par IA, relue par Zobel (ADR-013).

**Rationale**: répétée sur trente fiches, la mention « à confirmer » donnerait l'image d'un site inachevé ; la confirmation passe de toute façon par WhatsApp (cahier, section 2).

## 13. Contrôle du contenu

**Decision**: `catalogIssues` (pur, testé) vérifie en plus :

- toute prestation publiée hors options appartient à un univers (FR-001) ;
- aucun identifiant de prestation n'est égal au slug d'un univers, dans l'une ou l'autre langue (§2) ;
- les slugs d'univers sont uniques par langue.

## 14. Images illustratives

**Decision**: le schéma d'image (`{ src, alt }`) gagne `illustrative` (booléen, facultatif). `ExperienceCard`, `CompactCard` et la galerie de la fiche affichent alors une étiquette « Photo illustrative » / « Illustrative photo » en bas à gauche de l'image (texte `text-xs`, fond `fg` à 70 %, texte `bg`), dont le texte figure aussi dans le texte alternatif. Les illustrations sont générées avec l'outil d'images de Figma, une par spécialité et une pour le bateau de croisière : photographie réaliste, lumière naturelle de fin d'après-midi, tons chauds de la direction artistique, aucune personne identifiable, aucun texte ni logo. Elles vivent dans `src/assets/photos/illustrations/` ; le prompt de chacune est noté dans `src/assets/photos/README.md`.

**Rationale**: demande explicite de Franck (questionnaire 4, P9 et P15). L'étiquette visible évite de présenter une image générée comme une photo de Kribi.

## 15. Onglet « Tourisme »

**Decision** (U1) : les chaînes `nav.experiences` et `experiences.title` deviennent « Tourisme » / « Tourism ». La clé de route `experiences`, les adresses et les identifiants de test restent. Les tests qui cherchent le lien « Expériences » sont mis à jour.

## 16. Option « Musée d'art » retirée

**Decision** (Q3) : `musee-d-art` passe en `availability: "disabled"`. `parseSelection` retire déjà une option disparue d'une ligne enregistrée, avec le message de la 004 : rien à coder.

## 17. Ce qui ne change pas

Mon séjour, l'estimation, le message WhatsApp, les îlots de la 004, la barre à onglets, la coque, les pages légales, l'accueil hors cartes d'univers et mise en avant, la table des adresses, `IMPLEMENTED_ROUTES`. Aucune dépendance ajoutée, donc aucun ADR.
