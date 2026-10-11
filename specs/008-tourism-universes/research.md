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

**Rationale**: FR-016. La règle vit dans le contenu, pas dans un composant (principe IV). Si la réponse Q5 restreint les options prestation par prestation, un champ au niveau de la prestation s'ajoutera alors ; pas avant (principe I).

## 9. Ce que la sélection gère déjà

**Vérifié dans `src/features/selection/selection.ts`** : à la lecture du stockage, une ligne dont la prestation n'est plus au catalogue (désactivée), ou dont le tarif n'existe plus (anciens tarifs du campement Bagyeli), est retirée et signalée par le message de la 004. Aucune modification des fonctions pures de sélection, d'estimation ou de message n'est nécessaire : les nouvelles prestations n'utilisent que des unités et des dimensions existantes (`per_session` + `units`, `per_hour` + `hours`, `per_group` + `maxCapacity`, `from`, `quote` avec `persons` informatif).

## 10. Prestations retirées : désactivées, pas supprimées

**Decision**: `croisiere-en-bateau` et `bateau-de-plaisance` passent en `availability: "disabled"` [HYPOTHÈSE Q1, Q2]. Leur fichier reste, leurs fiches disparaissent (page d'erreur), et elles sont purgées des séjours enregistrés.

La croisière était l'une des quatre expériences mises en avant sur l'accueil. Le jet-ski la remplace, pour que la section « À ne pas manquer » garde quatre cartes (FR-009 : le reste de l'accueil ne change pas) : il a une vraie photo de Franck, et son prix vient d'être fixé.

**Rationale**: réversible en une ligne si Franck répond qu'elles restent.

## 11. Photos des nouvelles prestations

**Decision**: le schéma exige au moins une image par prestation. En attendant les photos de Franck (questionnaire 4, onglet Photos), chaque nouvelle prestation reçoit une photo d'ambiance de son univers, tirée de ses envois sans filigrane, avec un texte alternatif qui décrit ce que la photo montre :

| Univers | Photo de remplacement | Source |
|---|---|---|
| Visites & Découvertes | vue aérienne de la côte de Kribi | `sections/kribi-vue-aerienne.jpg` (déjà importée) |
| Activités & Loisirs | plage de Kribi au coucher du soleil | `hero/plage-coucher-de-soleil.jpg` (déjà importée) |
| Spécialités culinaires | étal de poissons frais | `decouverte-de-kribi/L14-02.jpg`, à importer |

Les photos des cartes d'univers : les chutes de la Lobé (visites), le jet-ski (activités), l'étal de poissons (spécialités).

**Rationale**: spec, edge case « prestation sans photo » : jamais la photo d'une autre prestation présentée comme celle-ci, jamais de filigrane. Les images Stitch de la 003 ne couvrent pas ces sujets.

## 12. Textes des nouvelles prestations

**Decision**: nom, phrase courte et description rédigés à partir du cahier, sans durée, lieu ni « inclus » inventés : ces rubriques restent vides, donc omises, jusqu'aux réponses de l'onglet 3 du questionnaire. Seuls les lieux que le cahier donne comme inclus (Village Mayi, Village Bagyeli) remplissent « Ce qui est inclus ». Traduction anglaise par IA, relue par Zobel (ADR-013).

## 13. Contrôle du contenu

**Decision**: `catalogIssues` (pur, testé) vérifie en plus :

- toute prestation publiée hors options appartient à un univers (FR-001) ;
- aucun identifiant de prestation n'est égal au slug d'un univers, dans l'une ou l'autre langue (§2) ;
- les slugs d'univers sont uniques par langue.

## 14. Ce qui ne change pas

Mon séjour, l'estimation, le message WhatsApp, les îlots de la 004, la barre à onglets, la coque, les pages légales, l'accueil hors cartes d'univers et mise en avant, la table des adresses, `IMPLEMENTED_ROUTES`. Aucune dépendance ajoutée, donc aucun ADR.
