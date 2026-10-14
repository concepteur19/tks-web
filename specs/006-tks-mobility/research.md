# Research — 006 Mobilité TKS®

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-14

Pas d'inconnue technique. Le schéma prévoit la section `mobilite` depuis la 001, l'unité `per_day` et les dimensions `units` et `days` ; l'estimation multiplie le prix par toutes les dimensions (004) ; le libellé au singulier (`labelOne`) existe depuis le correctif `fix-units-singular`. Les décisions ci-dessous étendent l'existant au plus simple (constitution, principe I). Les inconnues de prix (M1 à M5) sont des hypothèses de contenu, pas de code : une réponse de Franck change un fichier JSON, rien d'autre.

---

## 1. Tout reste dans la collection `services`

**Decision**: catégories de véhicules et services sur devis sont des entrées de `src/content/services/` avec `section: "mobilite"` : 3 catégories (`vehicule-luxe`, `vehicule-premium`, `vehicule-yaris`) et 4 services (`location-avec-chauffeur`, `transferts`, `chauffeur-prive`, `prestations-professionnelles`).

**Rationale**: sélection, estimation, message WhatsApp, catalogue des îlots et purge d'une ligne disparue reposent sur cette collection (005, research §1). Rien à dupliquer.

**Alternatives considered**: collection `vehicles` (rejeté : la sélection ne la verrait pas) ; une seule prestation « Location de véhicules » avec trois tarifs (`tiers`) (rejeté : la spec veut un bouton par catégorie et deux lignes distinctes pour deux catégories, comme les paliers d'hébergement de la 005).

## 2. Catégorie de véhicule : `per_day` × véhicules × jours

**Decision**: prix `{ kind: "from", unit: "per_day" }` ; deux dimensions, dans cet ordre : `units` (« véhicules », `labelOne` « véhicule », 1 à 5, défaut 1) puis `days` (1 à 30, défaut 1).

**Rationale**: `quantityIssues` accepte déjà une dimension `units` à côté de la dimension exigée (`days` pour `per_day`), et `computeEstimate` multiplie le prix par toutes les dimensions : 35 000 × 1 × 4 = 140 000 sans changer une ligne de logique. Le message écrit « 1 véhicule × 4 jours » grâce à `labelOne`. `units` d'abord : la ligne se lit « 2 véhicules × 3 jours », comme dans la spec. La règle de fusion de la 004 donne le cas limite de la spec (véhicules additionnés, jours remplacés).

## 3. Champ `models`, réservé à la mobilité

**Decision**: champ facultatif `models: string[]` (au moins un), permis seulement pour `section: "mobilite"`, sur le modèle des champs de section de la 005 (`superRefine`, message « `models` n'est permis que pour la mobilité »). Les noms de modèles ne se traduisent pas : simples chaînes. La page range dans « Location de véhicules » les prestations qui ont `models`, et dans la liste des services celles qui n'en ont pas.

**Rationale**: FR-004 exige les modèles ; un champ dédié les affiche en liste et les garde hors de la description. Classer par `models` plutôt que par le prix : quand Franck donnera un prix de transfert (questionnaire 6), le transfert restera un service, pas une catégorie de véhicule.

**Alternatives considered**: modèles dans `shortDescription` (rejeté : texte libre, non vérifiable) ; champ `mobilityKind` (rejeté : redondant avec la présence de `models`).

## 4. Services sur devis : quantité informative

**Decision**: `pricing: { kind: "quote" }`. Quantités :

| Service | Dimension | Bornes |
|---|---|---|
| `location-avec-chauffeur` | `days` | 1 à 30, défaut 1 |
| `chauffeur-prive` | `hours` | 1 à 24, défaut 4 |
| `transferts` | aucune | — |
| `prestations-professionnelles` | aucune | — |

**Rationale**: FR-008. `quantityIssues` ne contrôle pas les dimensions d'un prix sur devis ; la ligne reste hors du total et le message reprend la quantité (« Chauffeur privé — 4 heures : sur devis »). Défaut de 4 heures : la soirée de l'exemple de l'écran 08 (« à l'heure ou à la journée ») ; ajustable dans Mon séjour. Un service sans dimension ne se duplique pas (« Déjà dans mon séjour »), comme une formule.

## 5. Îlot : généraliser `TourCustomizer` en `LineCustomizer`

**Decision**: `TourCustomizer` (005) devient `LineCustomizer` : un `QuantityStepper` par dimension de la règle (libellés de `ExperienceConfigurator` : `detail.dimension.units` avec le libellé de la dimension, `detail.dimension.days`…), puis un bouton dont le libellé vient d'une prop. Le parcours garde « Personnaliser ce parcours » ; la catégorie de véhicule prend `mobility.add` (« Ajouter à mon séjour »). Les services sur devis gardent `QuickAdd`.

**Rationale**: US1 demande de régler véhicules et jours avant l'ajout ; `TourCustomizer` ne savait régler que les personnes. Un îlot générique remplace l'ancien au lieu d'en ajouter un second presque identique (principe I). Les tests du parcours sont repris tels quels sous le nouveau nom.

**Alternatives considered**: `VehicleCustomizer` à côté de `TourCustomizer` (rejeté : duplication) ; `QuickAdd` puis réglage dans Mon séjour (rejeté : US1-3 règle les quantités sur la page).

## 6. Catalogue des îlots et adresses

**Decision**: `getMobility()` dans `src/lib/catalog.ts` (sur `publishedIn('mobilite')`) ; `getPageCatalog` publie aussi la mobilité, avec vignette, adresse `/mobilite#<id>` (`/en/mobility#<id>`). Chaque carte ou rangée porte l'`id` de la prestation.

**Rationale**: même règle qu'en 005 : un catalogue incomplet ferait purger les lignes de mobilité par Mon séjour sur les autres pages.

## 7. Photos : plaques floutées à l'import

**Decision**: `scripts/import-photos.mjs` accepte, dans `sources.json`, une entrée objet `{ "source": "…", "blur": [{ "left", "top", "width", "height" }] }` en fractions de l'image (0 à 1, après rotation EXIF) ; chaque zone est extraite, floutée (`sharp.blur`), recomposée avant la réduction. Les entrées chaîne restent valides.

| Destination | Source (`voitures-tks/`) | Véhicule |
|---|---|---|
| `mobility/luxe.jpg` | `photo_2026-10-06_06-34-19` | Land Cruiser Prado TXL |
| `mobility/luxe-2.jpg` | `photo_2026-10-06_06-34-25` | Land Cruiser |
| `mobility/premium.jpg` | `photo_2026-10-06_06-34-13` | RAV4 (arrière) |
| `mobility/premium-2.jpg` | `photo_2026-10-06_06-33-08` | Avensis (avant) |
| `mobility/yaris.jpg` | `photo_2026-10-06_06-34-31` | Yaris |

Services sur devis : location avec chauffeur → `luxe-2`, transferts → `premium-2`, chauffeur privé → `luxe`, prestations professionnelles → `premium`, en attendant d'autres photos (questionnaire 6, P2). Les deux autres photos (Avensis arrière, RAV4 avant) ne sont pas publiées.

**Rationale**: FR-006. Le floutage dans le script est reproductible : un réimport ne republie jamais une plaque lisible, et les originaux restent intacts dans `Elements/`. Les zones sont relevées une fois, à l'import, et vérifiées à l'œil en pleine résolution.

**Alternatives considered**: flouter à la main et versionner le résultat (rejeté : perdu au prochain `photos:import`) ; recadrer (rejeté : coupe l'avant des véhicules).

## 8. Navigation : la dernière route livrée

**Decision**: `mobility` entre dans `IMPLEMENTED_ROUTES`. Navigation ordinateur (`DESKTOP_NAV`), plan du site et bandeau TKS® de l'accueil (`SmartLink`) mènent à la page sans autre changement ; `TAB_BAR` reste à cinq onglets.

Conséquence : plus aucune page n'est « non livrée ». La branche WhatsApp de `resolveLink` reste couverte par les tests unitaires, qui passent leur propre liste de routes livrées (paramètre `implemented`) ; les tests de bout en bout qui prenaient `mobility` comme exemple de page non livrée vérifient désormais le lien interne (SC-003).

## 9. Page Mobilité

**Decision**: `src/components/mobility/MobilityPage.astro`, pages `src/pages/mobilite.astro` et `src/pages/en/mobility.astro`. Pas de bandeau photo : en-tête sobre de l'écran 08 (logo TKS®, titre, phrase, mention Breezy Groupe), puis « Location de véhicules », puis la liste compacte des services, puis l'encadré « Besoin d'un transport sur mesure ? ». Image de partage : `mobility/luxe.jpg`. `lighthouserc.json` reçoit `/mobilite.html`.

**Rationale**: FR-001, FR-002 (sobre, petites photos, aucune photo plein écran). L'écran 08 affichait la location « Sur devis » : il date d'avant les prix du 2026-10-06 ; la spec le remplace par les catégories chiffrées.

## 10. Textes

Chaînes `mobility.*` en français et en anglais (en-tête, sections, encadré, `requestMessage` de repli sans JavaScript, `add`), titres et descriptions des sept prestations. Pas d'information de carburant, caution ou permis (hypothèse M3). Anglais relu par Zobel.

## 11. Ce qui ne change pas

Sélection, estimation, message WhatsApp, Mon séjour : leurs fonctions pures restent identiques, seules les données s'ajoutent. Barre à onglets du téléphone. Aucune dépendance ajoutée (`sharp` est déjà là).
