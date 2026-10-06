# Research — 004 Mon séjour, estimation et demande WhatsApp

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-06

Cette feature introduit le premier JavaScript applicatif du site. Les règles métier (sélection, estimation, message) restent des fonctions pures testées à 100 % (constitution, principe III) ; l'interface ne fait que les appliquer et les afficher.

---

## 1. Îlots en Preact plutôt qu'en React (ADR-016)

**Decision**: les îlots sont écrits en **Preact** (`@astrojs/preact`), pas en React. Nouvel ADR-016, qui remplace la partie « îlots React » de l'ADR-001. `@astrojs/react`, `react` et `react-dom` sont retirés des dépendances, puisqu'aucun îlot React n'existe encore.

**Rationale**: le moteur de React 19 pèse environ 115 Ko compressés (`react-dom-client.production.js` : 111 Ko ; `react` : 5 Ko, mesurés dans `node_modules`). TR-20 fixe 50 Ko par page de contenu et 80 Ko sur `/sejour`. Le compteur Mon séjour est présent sur toutes les pages (FR-027) : avec React, chaque page dépasserait le budget avant même d'avoir écrit une ligne. Preact offre la même API à hooks et la même syntaxe JSX pour environ 4 Ko. L'apprentissage reste transférable à React, ce qui était la raison du choix initial.

**Alternatives considered**: React avec `client:only` sur la seule page `/sejour` et du JavaScript sans framework ailleurs (rejeté : deux façons d'écrire l'interface, et la fiche dépasserait encore le budget) ; tout en JavaScript sans framework (rejeté : la page Mon séjour, avec sa liste modifiable, deviendrait du code de manipulation du DOM difficile à maintenir et à tester).

## 2. Store : nanostores et persistance (ADR-002, inchangé)

**Decision**: `nanostores` + `@nanostores/persistent` + `@nanostores/preact`, conformément à l'ADR-002 (seul le connecteur passe de React à Preact). Un atome persistant `selection`, clé `kibreeze.selection.v1`, encodage JSON. Les opérations sont des fonctions pures de `src/features/selection/selection.ts` ; `src/features/selection/store.ts` ne fait que les appliquer à l'atome et publier un événement pour les messages de confirmation.

**Rationale**: la persistance gère la synchronisation entre onglets (événement `storage`) sans code. Les fonctions pures rendent testables la fusion, les bornes, la purge et la migration.

## 3. Lecture du stockage : validation, version, purge, repli en mémoire

**Decision**: au chargement, `parseSelection(raw, catalog, now)` (pure) :

- JSON illisible, version inconnue ou forme invalide → sélection vide, sans erreur (edge case) ;
- `updatedAt` à plus de 30 jours → sélection vide ;
- lignes dont l'expérience n'existe plus, est désactivée, ou dont le tarif ou une option ont disparu → retirées, avec la liste des retraits pour le message discret (FR-007) ;
- quantités ramenées dans leurs bornes.

Si l'écriture dans le stockage échoue (navigation privée stricte, quota), le store bascule sur un atome en mémoire et un bandeau le signale (FR-008). La détection se fait par un essai d'écriture au premier chargement.

## 4. Catalogue minimal transmis aux îlots

**Decision**: `toIslandCatalog(services, locale)` (pur, `src/features/selection/islandCatalog.ts`) produit pour chaque expérience et option : identifiant, titre dans les deux langues, prix ou tarifs, règle de quantité, capacité maximale, option ou non, URL de la vignette. Il est sérialisé dans les props des îlots. Les descriptions, galeries et textes longs n'y figurent pas.

**Rationale**: architecture §5 : les îlots ne reçoivent que ce que le calcul et l'affichage compact demandent. Treize expériences et trois options tiennent en quelques kilo-octets ; la page `/sejour` reçoit le catalogue entier, la fiche seulement son expérience et les options.

## 5. Estimation

**Decision**: `computeEstimate(selection, catalog)` (pur, `src/features/estimation/computeEstimate.ts`), modèle de [docs/data-model.md](../../docs/data-model.md) §4, étendu aux tarifs et aux options :

- prix de la ligne : `pricing`, ou le tarif `tierId` ;
- montant = prix unitaire × produit des quantités ;
- capacité maximale d'un prix de groupe dépassée par le nombre de personnes → ligne sur devis (FR-013) ;
- options : prix fixe compté une fois ; prix par personne × personnes de la ligne, ou × 1 sans dimension personnes (FR-014). Une option ne rend pas chiffrée une ligne sur devis : la ligne reste sur devis, l'option est listée ;
- total, `quoteCount`, `hasFromPrices`, `isQuoteOnly` ; équivalent en euros par `formatEurEquivalent`.

La même fonction sert à la fiche (sélection d'une seule ligne, non enregistrée), à `/sejour` et au message (FR-018).

## 6. Message récapitulatif

**Decision**: `buildSelectionMessage(estimate, stay, { intent, locale, catalog })` (pur, `src/features/whatsapp/buildSelectionMessage.ts`). Gabarits dans les dictionnaires. Structure FR :

```text
Bonjour Kibreeze, je souhaite organiser un séjour à Kribi.
Dates : du 12 au 15 décembre
Voyageurs : 4

• Excursion en pirogue — 6 personnes : 35 000 FCFA
  + Guide touristique : 5 000 FCFA
• Chutes de la Lobé — 2 personnes : 10 000 FCFA
• Jet-ski : sur devis

Total estimatif : 50 000 FCFA (+ 1 prestation sur devis)
Merci, à bientôt !
```

Deux intentions : `quote` (« Demander un devis », intro ci-dessus) et `single` (fiche : intro « je souhaite des informations sur l'expérience », une seule ligne, adresse de la fiche). Troncature : tant que `encodeURIComponent(message).length > 1800`, la dernière ligne est retirée et remplacée par « … et N autres prestations » ; le total reste celui de l'estimation complète (FR-025).

`buildServiceRequestMessage` de la 003 est remplacé par l'intention `single` pour inclure quantités et options ; ses tests sont repris.

## 7. Îlots et hydratation

| Îlot | Où | Directive | Rôle |
|---|---|---|---|
| `StayBadge` | onglet Mon séjour, icône de l'en-tête | `client:idle` | compteur ; espace réservé en HTML pour éviter tout décalage (FR-027) |
| `ExperienceConfigurator` | fiche (barre fixe et carte collante) | `client:load` | sélecteurs, tarif, options, total, « Ajouter », « Demander ce service » |
| `QuickAdd` | cartes de la liste et de l'accueil | `client:visible` | ajout en un geste avec les valeurs par défaut |
| `StayPage` | `/sejour` | `client:load` | toute la page : lignes, champs, total, envoi, états vide et sur devis |
| `Toasts` | layout | `client:idle` | confirmations et annonces `aria-live` |

Sans JavaScript : la fiche garde le lien « Demander ce service » de la 003 (HTML statique, remplacé à l'hydratation) ; `/sejour` affiche un `<noscript>` expliquant que la page nécessite JavaScript et proposant WhatsApp.

## 8. Mise en page de la fiche

**Decision**: l'îlot `ExperienceConfigurator` remplace le contenu de `StickyRequest` (barre fixe sur téléphone, carte collante sur ordinateur) et l'encadré des options. Sur téléphone, sélecteurs, tarif et cases à cocher sont dans le corps de la page (rubrique « Votre réservation » sous le bloc prix) ; la barre fixe ne garde que le total et les deux actions, comme la maquette 03. Les options deviennent des cases à cocher dans l'encadré existant.

## 9. Mon séjour sur ordinateur

**Decision**: page en deux colonnes à partir de `lg` : lignes et champs à gauche, encadré du total et bouton d'envoi dans un panneau collant à droite (FR-023). L'icône Mon séjour de l'en-tête mène à `/sejour` ; pas de tiroir (hypothèse de la spec).

## 10. Budgets JavaScript

**Decision**: `scripts/check-bundle-size.mjs` applique désormais deux seuils : 50 Ko compressés par page, 80 Ko sur `/sejour` et `/en/my-trip` (TR-20). Objectif réaliste : environ 15 Ko sur les pages de contenu (Preact, nanostores, compteur, messages) et 25 Ko sur `/sejour`.

## 11. Confidentialité

**Decision**: la section cookies de `privacy.md` (FR et EN) liste la clé `kibreeze.selection.v1` : stockage local, contenu (lignes, dates, voyageurs), conservation 30 jours après la dernière modification, effacement par « Vider » ou par le navigateur. `DOCUMENTED_STORAGE` du test e2e des cookies l'inclut (FR-029). Toujours aucun cookie.

## 12. Effets sur la coque et l'accueil

**Decision**: `stay` entre dans `IMPLEMENTED_ROUTES` : l'onglet Mon séjour, l'icône de l'en-tête et le lien « Planifier mon séjour » apparaissent par le mécanisme de 002. Les expériences mises en avant et les cartes de la liste reçoivent l'îlot `QuickAdd` (FR-002, FR-028).
