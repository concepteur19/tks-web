# Research — 010 Retours de Franck

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-18

Pas d'inconnue technique : chaque retour s'appuie sur un mécanisme existant (unités de quantité, valeur par défaut d'une ligne, fiches, îlots, transitions de la 009). Aucune dépendance ajoutée.

---

## 1. Plats comptés en « plats »

**Decision**: les 10 plats et l'Ebanjea passent de la dimension `persons` à `units` avec `label` « plats » / « dishes » et `labelOne` « plat » / « dish », bornes 1 à 30, 1 par défaut. Prix inchangé (`quote`).

**Rationale**: la dimension `units` et son singulier existent (correctif `fix-units-singular`) ; le message écrit déjà « 2 plats ». Une sélection enregistrée garde son nombre, simplement relu comme des plats (cas limite de la spec).

## 2. Descriptions, Ebanjea, image « Photo à venir »

**Decision**:

- descriptions de Franck en `shortDescription` (phrase d'accroche, ≤ 160 caractères, tirée de son texte) et `description` (texte complet), traduites en anglais ;
- nouveau fichier `src/content/services/ebanjea.json`, univers `specialites-culinaires`, `quote`, dimension plats ;
- champ d'image facultatif `upcoming: true` : l'étiquette affiche « Photo à venir » / « Photo coming soon » au lieu de « Photo illustrative » ; le maban et l'Ebanjea prennent une photo de la côte de Kribi de Franck, sans plat, avec ce champ.

**Rationale**: le schéma exige une image par prestation ; une photo de la côte, étiquetée honnêtement, vaut mieux qu'un plat inventé. `upcoming` et `illustrative` s'excluent (contrôle du schéma).

## 3. Pique-nique renommé

**Decision**: identifiant `pique-nique-en-bord-de-mer`, titres « Pique-nique en bord de mer » / « Beach picnic » ; redirections 301 FR et EN de l'ancienne adresse dans `public/_redirects`, comme en 008.

**Rationale**: l'adresse suit le nom affiché. Une ligne enregistrée sous l'ancien identifiant est retirée de Mon séjour avec le message existant (purge de la 004) : cas rare, comportement déjà prévu.

## 4. Mon séjour : les voyageurs d'abord

**Decision**: `defaultLine(service, travelers?)` (fonction pure de la sélection) : quand `travelers` est connu, la dimension `persons` part de ce nombre, borné par `min` et `max`. Les îlots d'ajout (`QuickAdd`, `LineCustomizer`, configurateur de fiche) passent `$selection.get().stay.travelers`. Dans `StayPage`, un libellé « Personnes pour cette activité » précède le sélecteur des dimensions `persons`.

**Rationale**: la règle reste dans la logique pure, couverte à 100 % ; les îlots ne font que transmettre la valeur. La fusion de la 004 (personnes additionnées) est inchangée.

## 5. Fiches de parcours

**Decision**:

- pages `src/pages/formules/[id].astro` et `src/pages/en/packages/[id].astro` (une par parcours publié), composant `TourDetail.astro` sur le modèle de `ExperienceDetail` : fil d'Ariane (Formules › parcours), photo, titre, description, durée, étapes numérotées (liées quand `serviceId`), tarif par `Price`, pastille minimum, mention dégressive, mention indicative, phrase sur le prix final ;
- îlot `TourActions.tsx` (`client:visible`) : sélecteur de personnes, bouton « Ajouter à mon séjour » et lien « Personnaliser ce parcours » (WhatsApp), dont le message est construit par une fonction pure `buildTourRequestMessage({ title, persons, url, locale })` dans `src/features/whatsapp/`, couverte à 100 % ; sans JavaScript, le lien WhatsApp seul, avec le nombre de personnes par défaut ;
- `TourCard` sur la page Formules : photo et titre mènent à la fiche ; ses actions restent ;
- `pageCatalog` : l'adresse d'une ligne de parcours devient la fiche (`/formules/<id>`), au lieu de l'ancre ;
- contenu : `duration` des six parcours (FR-007, « Kribi au fil de l'eau » sans durée), étape « Village Mayi (ponts de l'Esclavage et des Enclaves, phare et monument) », étape « Fleuve Lobé (inclus dans l'expérience Bagyeli) ».

**Rationale**: la consigne de Franck (« sa propre fiche ») ; le modèle des fiches d'expérience existe ; le message WhatsApp reste une fonction pure (constitution III).

## 6. Diaporama du hero

**Mise à jour du 2026-10-18 (mesure)** : les photos 2 à 4 restent dans un `<template>` et n'entrent dans la page qu'à la **première interaction** du visiteur (pointeur, clavier, défilement), moment où le défilement démarre. Insérées dès le chargement, elles étaient demandées en priorité haute et retardaient parfois la première ; insérées à 6 s, leur apparition était comptée comme nouvel élément principal (LCP) par Chrome. Mesuré : 1 mesure sur 5 à 79, puis 16 sur 16 entre 93 et 96 après correction, comme `main`.

**Decision**: `Hero.astro` empile 4 photos ; la première garde `loading="eager"` et `fetchpriority="high"`, les suivantes `loading="lazy"`. Un petit script de page (`src/scripts/hero-slideshow.ts`) passe à la photo suivante toutes les 6 s (fondu `--duration-slow`, opacité seule), **s'arrête** sous « réduire les animations », quand l'onglet est caché, et sur le bouton Pause visible (« Mettre en pause » / « Lecture », `aria-pressed`). Sans JavaScript : la première photo seule.

**Rationale**: WCAG 2.2.2 (contenu qui défile seul plus de 5 s : moyen de le mettre en pause) ; plafond de durée de la 009 respecté (le fondu dure 320 ms, l'intervalle n'est pas une animation) ; l'image prioritaire est la même qu'aujourd'hui, donc le LCP ne bouge pas (SC-005).

**Photos** : `hero/plage-coucher-de-soleil.jpg` en premier, puis trois photos de Franck déjà importées et contrôlées (sans filigrane, sans visage en gros plan), recadrées en portrait : la pirogue sur la Lobé, les chutes, la plage de Batanga. Remplacées par sa sélection (questionnaire 7, onglet Diaporama).

## 7. Aperçus de l'accueil

**Decision**:

- **Hébergements** : `home.json` gagne la carte `appartement` (photo d'appartement du lot de Franck `hebergements-franck/` contrôlée en pleine résolution, à défaut `illustrations/appartement-35000.jpg` étiquetée) ; le prix vient du palier le moins cher (`appartement-35000`, logique de la 005) ;
- **Mobilité** : `MobilityStrip.astro` est remplacé par `MobilityTeaser.astro`, sur le modèle de `AccommodationTeaser` : logo TKS®, titre, trois cartes (photo, modèles, « À partir de X FCFA / jour ») lues dans `getMobility()`, chaque carte vers `/mobilite#<id>`, lien « Voir la mobilité ». Même position qu'aujourd'hui, après les sections Kibreeze.

**Rationale**: demande de Franck des 11-12 octobre, confirmée par Zobel le 18 ; la constitution (TKS® secondaire, jamais tête d'affiche) est respectée par la position, pas par la taille. Les tests de l'accueil qui imposaient une bande « sobre » (une image, hauteur réduite) sont mis à jour.

## 8. Dates : calendrier

**Decision**:

- `Stay` gagne `arrival?` et `departure?` (`AAAA-MM-JJ`) ; `dates` (texte libre) reste lu pour les séjours enregistrés avant ;
- `applyStay` / `parseSelection` (pures) : dates valides seulement au format attendu, départ ≥ arrivée (sinon le départ est effacé) ;
- `formatStayDates(stay, locale)` (pure, `src/features/whatsapp/`) : « du 12 au 16 décembre 2026 » / « 12 to 16 December 2026 », mois différents ou années différentes écrits en entier, une seule date (« à partir du 12 décembre 2026 »), sinon le texte libre ancien ; utilisée par le message et le rappel de Mon séjour ;
- `StayPage` : deux champs `type="date"` (Arrivée, Départ ; `min` du départ = arrivée), qui ouvrent le calendrier natif du téléphone.

**Rationale**: le calendrier natif est accessible, traduit et sans dépendance ; la logique de validation et de formatage reste pure et testée.

## 9. Cadrage des photos

**Decision**: champ d'image facultatif `focus` : « X% Y% » (contrôle du schéma : deux pourcentages de 0 à 100), appliqué en `object-position` partout où la photo est recadrée (cartes, galerie, vignettes, aperçus). Pique-nique : valeur relevée sur la photo.

## 10. Photo en grand

**Decision**: dans `Gallery.astro`, chaque photo est un lien vers l'image en grand ; un petit script l'intercepte et l'ouvre dans un `<dialog>` natif (fond sombre, bouton Fermer, Échap natif, clic hors de l'image) ; sans JavaScript, le lien ouvre l'image seule.

**Rationale**: `<dialog>` gère le focus et Échap ; aucun îlot ; amélioration progressive.

## 11. Ce qui ne change pas

Estimation, fusion, purge, message (hors dates et parcours), animations de la 009. Prix individuels, liens WhatsApp multiples et sélection des photos attendent le questionnaire 7.
