# Contrat — format des fichiers de contenu

**Feature**: 001-project-foundation

Ce contrat lie le développeur et les futurs contributeurs de contenu. Il est vérifié à chaque construction. La sémantique complète est dans [docs/data-model.md](../../docs/data-model.md).

## Catégorie

```json
{
  "id": "nature-decouverte",
  "pole": "tourisme",
  "name": { "fr": "Nature / Découverte", "en": "Nature & Discovery" },
  "order": 10
}
```

## Service

```json
{
  "title": { "fr": "…", "en": "…" },
  "pole": "transport | tourisme | livraison",
  "categoryId": "identifiant d'une catégorie existante",
  "shortDescription": { "fr": "…", "en": "…" },
  "description": { "fr": "…", "en": "…" },
  "images": [{ "src": "./images/…", "alt": { "fr": "…", "en": "…" } }],
  "pricing": { "kind": "fixed | from | quote", "amount": 25000, "unit": "per_person" },
  "quantity": { "dimensions": [{ "kind": "persons", "min": 1, "max": 10, "default": 2 }] },
  "availability": "available | on_request | disabled"
}
```

## Ce que la construction refuse

- Un champ obligatoire absent, avec le nom du fichier et du champ dans le message.
- Un `categoryId` qui ne correspond à aucune catégorie.
- Une unité de prix incohérente avec les dimensions déclarées : `per_person` sans dimension `persons`, `per_day` sans dimension `days`, `per_hour` sans dimension `hours`, `per_equipment` sans dimension `units`.
- Plus de deux dimensions de quantité, ou deux dimensions de durée.
- Des bornes incohérentes, `min` supérieur à `default`, ou `default` supérieur à `max`.
- Un montant nul ou négatif sur un prix ferme ou un prix de départ.
- En production uniquement : une traduction anglaise manquante sur un champ textuel.
