# Data Model — 006 Mobilité TKS®

**Feature**: [spec.md](./spec.md) · Décisions : [research.md](./research.md) · Schémas : [contracts/content.md](./contracts/content.md)

## Schéma de prestation : ajout

| Champ | Type | Règle |
|---|---|---|
| `models` | `string[]` (au moins 1) | facultatif ; permis seulement si `section: mobilite`. Présent = catégorie de véhicule ; absent = service |

Aucune unité, section ni dimension nouvelle : `mobilite`, `per_day`, `units` (avec `labelOne`), `days` et `hours` existent.

## Catégories de véhicules (`section: mobilite`, avec `models`)

Prix `{ kind: "from", unit: "per_day" }` [HYPOTHÈSE M1, M2 : par jour, sans chauffeur]. Quantité, dans cet ordre :

```json
[
  { "kind": "units", "label": { "fr": "véhicules", "en": "vehicles" }, "labelOne": { "fr": "véhicule", "en": "vehicle" }, "min": 1, "max": 5, "default": 1 },
  { "kind": "days", "min": 1, "max": 30, "default": 1 }
]
```

| Ordre | Identifiant | Titre FR / EN | Modèles | Prix de départ / jour | Photo |
|---|---|---|---|---|---|
| 10 | `vehicule-luxe` | Luxe / Luxury | Toyota Land Cruiser Prado TXL, Toyota Land Cruiser | 100 000 | `mobility/luxe.jpg`, `luxe-2.jpg` |
| 20 | `vehicule-premium` | Premium / Premium | Toyota RAV4, Toyota Avensis | 35 000 | `mobility/premium.jpg`, `premium-2.jpg` |
| 30 | `vehicule-yaris` | Yaris / Yaris | Toyota Yaris | 25 000 | `mobility/yaris.jpg` |

« Toyota Avensis (tête de cochon) » : le surnom reste hors du site.

## Services sur devis (`section: mobilite`, sans `models`)

Prix `{ kind: "quote" }`.

| Ordre | Identifiant | Titre FR / EN | Phrase (écran 08) | Quantité | Photo |
|---|---|---|---|---|---|
| 40 | `location-avec-chauffeur` | Location avec chauffeur / Car hire with driver | Un véhicule et son chauffeur à la journée ou au séjour | `days` 1 à 30, défaut 1 | `mobility/luxe-2.jpg` |
| 50 | `transferts` | Transferts / Transfers | Douala, Yaoundé, aéroport [HYPOTHÈSE M4] | aucune | `mobility/premium-2.jpg` |
| 60 | `chauffeur-prive` | Chauffeur privé / Private driver | À l'heure ou à la journée | `hours` 1 à 24, défaut 4 [HYPOTHÈSE M5] | `mobility/luxe.jpg` |
| 70 | `prestations-professionnelles` | Prestations professionnelles / Business services | Transport d'équipes et d'entreprises | aucune | `mobility/premium.jpg` |

Chaque prestation a `shortDescription`, `description` et le texte alternatif de ses images, en français et en anglais. Aucune mention de carburant, caution ou permis [HYPOTHÈSE M3].

## Cas de référence (estimation et message)

| Sélection | Ligne | Montant |
|---|---|---|
| `vehicule-premium`, [1, 4] | Premium — 1 véhicule × 4 jours | 140 000 FCFA |
| `vehicule-yaris`, [2, 3] | Yaris — 2 véhicules × 3 jours | 150 000 FCFA |
| `vehicule-luxe`, [1, 1] | Luxe — 1 véhicule × 1 jour | 100 000 FCFA |
| `vehicule-premium` [1, 4] puis [1, 2] | fusion 004 : Premium — 2 véhicules × 2 jours | 140 000 FCFA |
| `transferts` | Transferts : sur devis | hors total, « + 1 prestation sur devis » |
| `chauffeur-prive`, [4] | Chauffeur privé — 4 heures : sur devis | hors total |

Total d'un séjour avec une catégorie de véhicule : « estimatif » (prix `from`).

## Photos (`src/assets/photos/sources.json`)

Entrée objet pour flouter une plaque :

```json
"mobility/luxe.jpg": {
  "source": "voitures-tks/photo_2026-10-06_06-34-19.jpg",
  "blur": [{ "left": 0.38, "top": 0.78, "width": 0.16, "height": 0.07 }]
}
```

Valeurs **d'exemple** : les vraies zones sont relevées sur chaque original à l'import (fractions de l'image, 0 à 1), une zone par plaque visible.
