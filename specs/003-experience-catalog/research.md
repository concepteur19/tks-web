# Research — 003 Catalogue des expériences

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-05

Les choix structurants restent ceux des ADR-001 à ADR-015. Cette feature réutilise ce que 002 a posé : collections `categories` et `services`, `cardPrice`, `formatPrice`, `Price.astro`, `SmartLink`, `IMPLEMENTED_ROUTES`, contrat de coque. Aucune nouvelle dépendance.

---

## 1. Une collection `services`, pas une collection `experiences`

**Decision**: les expériences et les options restent dans la collection `services` existante, distinguées par `section: "experience"` et `isOption`. Pas de nouvelle collection.

**Rationale**: le schéma `services` porte déjà tout ce que demande la fiche (prix, tarifs, quantités, durée, capacité, inclus / non inclus / à savoir, disponibilité, mise en avant). Les features 005 et 006 y ajouteront hébergements et mobilité par la même clé `section`, et la sélection de 004 n'aura qu'un catalogue à lire. Principe I : pas de second schéma pour la même chose.

**Alternatives considered**: collection `experiences` dédiée (rejeté : dupliquerait le schéma et obligerait 004 à fusionner deux catalogues).

## 2. Ajustements du schéma

**Decision**:

- nouveau champ facultatif `location: LocalizedString`, le lieu ou point de départ de la ligne d'informations ;
- `categoryId` reste obligatoire pour une expérience, **sauf** pour une option (`isOption: true`), qui vaut pour toutes les catégories ;
- `images` reste obligatoire (au moins une) pour une expérience, et devient facultatif pour une option, qui n'a pas de carte.

**Rationale**: FR-013 (lieu) et FR-003 (options sans carte ni catégorie). Les règles sont des `superRefine` du schéma existant, testées comme les autres.

## 3. Filtre par catégorie sans JavaScript : `:target` et `:has()`

**Decision**: chaque onglet est un lien vers une ancre de la page (`/experiences#aventure`). Une règle CSS masque les cartes des autres catégories quand une ancre de catégorie est ciblée :

```css
main:has(#aventure:target) [data-category]:not([data-category='aventure']) { display: none; }
```

L'onglet actif est stylé de la même façon. Un script en ligne de moins de 1 Ko, chargé sans framework, ajoute ce que le CSS ne peut pas faire : `aria-current` sur l'onglet actif et l'annonce du nombre de résultats dans une région `aria-live` (FR-024). Sans lui, le filtre fonctionne quand même.

**Rationale**: SC-003 (mise à jour instantanée, sans rechargement), FR-009 (adresse partageable : l'ancre en fait partie) et principe V (HTML complet sans JavaScript) à la fois. `:has()` est pris en charge par Safari 15.4, Chrome 105 et Firefox 121 ; un navigateur plus ancien affiche toutes les expériences, ce qui reste utilisable. Les cartes de catégorie de l'accueil pointent vers ces ancres via `SmartLink` (`hash`), déjà prévu.

**Alternatives considered**: paramètre `?categorie=` filtré en JavaScript (rejeté : sans JavaScript, le lien n'a aucun effet) ; une page statique par catégorie (rejeté : trois pages quasi identiques à indexer, et l'espace `/experiences/<x>` est celui des fiches) ; îlot React (rejeté : 40 Ko pour un filtre).

## 4. Fiches : une page statique par expérience

**Decision**: `src/pages/experiences/[slug].astro` et `src/pages/en/experiences/[slug].astro`, `getStaticPaths` sur les services `section: "experience"`, non options, non `disabled`. Le slug est l'identifiant du fichier, identique dans les deux langues. Une expérience désactivée n'a pas de page : son adresse tombe sur la 404 (FR-005).

**Rationale**: contrat d'adresses de 001 et 002. Le plan du site inclut ces pages sans configuration.

## 5. Galerie sans JavaScript

**Decision**: une bande de photos en défilement horizontal avec `scroll-snap`, une photo par écran, chaque photo portant son compteur « k / N ». Les vignettes sont des liens vers l'ancre de chaque photo (`#photo-2`), qui fait défiler la bande. Une seule photo : ni compteur ni vignettes.

**Rationale**: FR-015, parcourable au doigt, au clavier (liens) et sans JavaScript. La première photo est chargée en priorité (élément LCP de la fiche), les suivantes à la demande.

**Alternatives considered**: carrousel en îlot (rejeté : JavaScript pour un gain marginal).

## 6. Barre d'action fixe et carte collante

**Decision**: un composant `StickyRequest.astro` rendu deux fois par la fiche, l'un `lg:hidden` fixé en bas au-dessus de la barre à onglets (`bottom: var(--size-tabbar)`, `z-index: var(--z-sticky-cta)`, hauteur `--size-sticky-cta`), l'autre dans la colonne de droite en `position: sticky` à partir de `lg`. La fiche passe `floatingWhatsApp={false}` à `BaseLayout`, et `main` réserve la hauteur de la barre en marge basse.

**Rationale**: FR-018 et le contrat de coque de 002 (ordre d'empilement en bas d'écran). Deux rendus d'un même composant restent plus simples qu'un bloc qui change de position par JavaScript.

## 7. Message « Demander ce service »

**Decision**: fonction pure `buildServiceRequestMessage({ title, url, locale })` dans `src/features/whatsapp/buildServiceRequestMessage.ts`, couverte à 100 % :

- FR : « Bonjour Kibreeze, je souhaite des informations sur l'expérience « Excursion en pirogue » : https://kibreeze.com/experiences/excursion-en-pirogue »
- EN : « Hello Kibreeze, I would like some information about the "Dugout canoe trip" experience: https://kibreeze.com/en/experiences/excursion-en-pirogue »

Les gabarits vivent dans les dictionnaires ; la fonction assemble. L'URL est absolue, construite depuis `PUBLIC_SITE_URL`.

**Rationale**: FR-019, FR-WA-6, principe III. La feature 004 réutilisera ce module pour `buildSelectionMessage` (même dossier, prévu par l'architecture).

## 8. Données structurées des fiches

**Decision**: `buildExperienceJsonLd` dans `src/lib/seo.ts` : `@type: "TouristTrip"`, `name`, `description`, `image`, `url`, `inLanguage`, `provider` (Kibreeze, `TravelAgency`), et `offers` seulement pour un prix ferme ou « à partir de » : `{ "@type": "Offer", price, priceCurrency: "XAF", availability }`, avec `priceSpecification.unitText` pour l'unité. Une expérience sur devis n'a pas d'`offers`.

**Rationale**: FR-026, FR-SEO-3. `TouristTrip` décrit une activité organisée et vendue, mieux que `TouristAttraction`, qui décrit un lieu (les chutes existent sans Kibreeze). Fonction pure, testée.

**Alternatives considered**: `TouristAttraction` (rejeté : c'est le lieu, pas la prestation) ; `Service` générique (rejeté : moins précis, aucun gain).

## 9. Prix sur la fiche

**Decision**: `cardPrice` (002) donne le prix de la carte et de la barre fixe. La fiche détaille en plus chaque tarif nommé (`tiers`), et le badge de capacité quand `pricing.maxCapacity` est défini : « Jusqu'à 8 personnes — au-delà, sur devis ». Les options affichent leur propre prix avec `Price.astro`.

**Rationale**: FR-014, FR-016. Aucune nouvelle règle de calcul : l'estimation reste à 004.

## 10. Photos

**Decision**: importer, avec `npm run photos:import` et après contrôle visuel des filigranes, les photos manquantes : quad, jet-ski (hors `L7-01`, suspect de filigrane), kayak (`excursion-en-pirogue/L7-04`), paddle (`_a-classer_paddle/L6-01`), cheval (`balade-a-cheval/L7-07`), bandeau de la page Expériences (chutes), et une deuxième ou troisième photo pour les galeries des chutes, de la pirogue et du campement. Chaloupe, jacuzzi, feu de plage et bateau de plaisance prennent un paysage de Kribi, avec un texte alternatif qui décrit ce qu'on voit réellement.

**Rationale**: hypothèse « Photos » de la spec ; règles du README des photos.

## 11. Effets sur la coque et l'accueil

**Decision**: ajouter `experiences` à `IMPLEMENTED_ROUTES`. Rien d'autre n'est à modifier pour que l'onglet, la navigation ordinateur, le lien du hero, le plan du site et les nombres par catégorie apparaissent : c'est le mécanisme de 002. Seule retouche : les cartes de catégorie de l'accueil passent `hash={category.id}` à `SmartLink` (FR-021), et l'aperçu de « Vous aimerez aussi » réutilise la carte compacte.

**Rationale**: vérifie que le contrat de coque de 002 tient sa promesse.

## 12. Contenu rédactionnel

**Decision**: descriptions, inclus et non inclus rédigés à partir du guide tarifaire et des réponses de Franck seulement ; tout ce qui n'y figure pas (durée, lieu, inclus) est laissé vide et donc non affiché (FR-013). Les questions correspondantes sont dans le document envoyé à Franck le 2026-10-05 (question 8). Traduction anglaise par IA, relue par Zobel.

**Rationale**: principe II et règle « aucune valeur inventée » de la spec.
