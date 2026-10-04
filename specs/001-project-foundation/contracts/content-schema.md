# Contrat — format des fichiers de contenu

**Feature**: 001-project-foundation · **Mis à jour** : 2026-10-04, modèle Kibreeze

Ce contrat lie le développeur et les futurs contributeurs de contenu. Il est vérifié à chaque construction. La sémantique complète est dans [docs/data-model.md](../../docs/data-model.md). Les schémas sont dans `src/content/schemas.ts`, branchés sur les collections par `src/content.config.ts`.

Le contrat initial du 2026-09-17 organisait le contenu en trois pôles, `transport`, `tourisme` et `livraison`. Le pivot Kibreeze du 2026-09-25 les remplace par des **sections** et retire la livraison (ADR-014).

## Catégorie

Fichier `src/content/categories/<id>.json`. L'identifiant est le nom du fichier.

```json
{
  "name": { "fr": "Nature & Découverte", "en": "Nature & Discovery" },
  "description": { "fr": "…", "en": "…" },
  "order": 10
}
```

## Service

Fichier `src/content/services/<id>.json`. L'identifiant est le nom du fichier ; il sert de clé dans la sélection et de slug d'URL.

```json
{
  "title": { "fr": "…", "en": "…" },
  "section": "experience | hebergement | formule | mobilite",
  "categoryId": "obligatoire pour une expérience",
  "isOption": false,
  "shortDescription": { "fr": "160 caractères au plus", "en": "…" },
  "description": { "fr": "…", "en": "…" },
  "images": [{ "src": "…", "alt": { "fr": "…", "en": "…" } }],
  "pricing": { "kind": "fixed | from | quote", "amount": 35000, "unit": "per_group", "maxCapacity": 8 },
  "quantity": { "dimensions": [{ "kind": "persons", "min": 1, "max": 10, "default": 2 }] },
  "availability": "available | on_request | disabled",
  "provisional": true
}
```

Un service porte **soit** `pricing`, **soit** `tiers` : plusieurs tarifs au choix, chacun avec son identifiant, son libellé, son prix et, au besoin, sa propre règle de quantité (le campement Bagyeli compte des personnes au tarif individuel, aucune au tarif couple).

Unités de prix : `per_person`, `per_group`, `per_equipment`, `per_hour`, `per_day`, `per_night`, `per_session`, `per_trip`, `per_service`. Dimensions : `persons`, `units` (avec un libellé), `days`, `nights`, `hours`.

## Ce que la construction refuse

Contrôlé par Astro pour chaque fichier, et par `npm run check:content` avant chaque construction, avec le fichier et le champ dans le message :

- Un champ obligatoire absent, ou un champ inconnu (faute de frappe).
- Un `categoryId` qui ne correspond à aucune catégorie, ou absent sur une expérience.
- Une unité de prix incohérente avec les dimensions : `per_person` sans `persons`, `per_day` sans `days`, `per_night` sans `nights`, `per_hour` sans `hours`, `per_equipment` sans `units`. Les unités `per_group`, `per_service`, `per_session` et `per_trip` n'acceptent qu'une dimension `units`, ou aucune.
- Plus de deux dimensions, deux dimensions de durée, ou la même dimension deux fois.
- Des bornes incohérentes : `min` supérieur à `default`, `default` supérieur à `max`, `max` au-delà de 50.
- Un montant nul ou négatif sur un prix ferme ou un prix de départ.
- Un `maxCapacity` sur un prix qui n'est pas `per_group`.
- `pricing` et `tiers` ensemble, ou aucun des deux.
- Un contenu `provisional` qui n'est pas `disabled`.
- En production uniquement (`npm run build:prod`) : une traduction anglaise manquante sur un champ textuel.

## Ce qui viendra avec la feature 003

- Les images passeront du chemin texte au helper `image()` d'Astro, pour l'optimisation.
- Les collections `packages` et `accommodationTiers` décrites dans [docs/data-model.md](../../docs/data-model.md).
