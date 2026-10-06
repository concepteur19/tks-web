# Data Model — 003 Catalogue des expériences

**Feature**: [spec.md](./spec.md) · **Recherche**: [research.md](./research.md)

Le modèle général est celui de [docs/data-model.md](../../docs/data-model.md) et de [002/data-model.md](../002-kibreeze-core/data-model.md). Ce document décrit ce que la 003 ajoute ou modifie.

## Service (collection `services`, modifiée)

| Champ | Changement | Règle |
|---|---|---|
| `location` | **ajouté**, facultatif | `LocalizedString` : lieu ou point de départ, affiché dans la ligne d'informations |
| `categoryId` | règle assouplie | obligatoire si `section = "experience"` **et** `isOption` faux |
| `images` | règle assouplie | au moins une image, sauf si `isOption` vrai |

Règles inchangées : `pricing` XOR `tiers` ; cohérence unité / dimensions ; `shortDescription` ≤ 160 caractères ; `availability` parmi `available`, `on_request`, `disabled`.

### Expériences publiées (13)

| Fichier | Catégorie | Prix | Unité | Dimensions | Capacité | Disponibilité |
|---|---|---|---|---|---|---|
| `chutes-de-la-lobe` | nature-decouverte | 5 000 | `per_person` | persons | — | available |
| `excursion-en-pirogue` | nature-decouverte | 35 000 | `per_group`, `maxCapacity: 8` | — | 1 à 8 | available |
| `excursion-en-chaloupe` | nature-decouverte | 65 000 | `per_group`, `maxCapacity: 8` | — | 1 à 8 | available |
| `campement-bagyeli` | nature-decouverte | tarifs : 7 500 `per_person` / 20 000 `per_group` / devis | — | persons (individuel) | — | available |
| `jacuzzi-naturel` | nature-decouverte | 5 000 | `per_person` | persons | — | available |
| `croisiere-en-bateau` | detente | 25 000 | `per_person` | persons | — | available |
| `feu-de-plage` | detente | 50 000 | `per_group` | — | — | available |
| `bateau-de-plaisance` | detente | devis | — | — | — | **on_request** |
| `quad` | aventure | 10 000 | `per_session` | units « sessions » | — | available |
| `jet-ski` | aventure | devis (T1) | — | — | — | available |
| `kayak` | aventure | 10 000 | `per_person` | persons | — | available |
| `paddle` | aventure | 10 000 | `per_person` | persons | — | available |
| `balade-a-cheval` | aventure | 5 000 | `per_person` | persons | — | available |

`order` : par dizaines dans l'ordre de l'écran validé 02a, le jet-ski après le quad. Les quatre `featured` de 002 restent mis en avant.

### Options (3)

| Fichier | Prix | Unité | Dimensions | `isOption` |
|---|---|---|---|---|
| `guide-touristique` | 5 000 | `per_service` | — | vrai |
| `maitre-nageur` | 5 000 | `per_service` | — | vrai |
| `musee-d-art` | 1 500 | `per_person` | persons | vrai |

Section `experience`, sans `categoryId` ni image. Elles n'apparaissent ni dans la liste ni sur l'accueil, seulement dans l'encadré « Complétez votre expérience » de chaque fiche.

## Filtre de catégorie

Pas de donnée stockée : l'état du filtre est l'ancre de l'adresse (`#nature-decouverte`, `#aventure`, `#detente`), égale à l'identifiant du fichier de catégorie. Pas d'ancre = « Toutes ». Un onglet n'existe que si sa catégorie compte au moins une expérience publiée.

## Message de demande

```ts
buildServiceRequestMessage(input: { title: string; url: string; locale: Locale }): string
```

Entrées déjà localisées (titre dans la langue de la page, URL absolue de la fiche dans cette langue). Sortie : texte brut, encodé ensuite par `buildWhatsAppUrl`.

## Données structurées d'une fiche

```ts
buildExperienceJsonLd(input: {
  title: string; description: string; url: string; imageUrl: string;
  locale: Locale; price: CardPrice; siteUrl: string;
}): Record<string, unknown>
```

`TouristTrip` ; `offers` présent si et seulement si `price.kind` vaut `fixed` ou `from`, avec `priceCurrency: "XAF"`.

## « Vous aimerez aussi »

Fonction pure `relatedExperiences(current, all, limit = 3)` : expériences publiées autres que `current`, d'abord celles de la même catégorie par `order`, puis les autres par `order`, tronquées à `limit`.
