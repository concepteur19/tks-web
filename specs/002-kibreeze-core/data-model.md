# Data Model — 002 Coque du site Kibreeze et page d'accueil

**Feature**: [spec.md](./spec.md) · **Recherche**: [research.md](./research.md)

Ce document décrit les entités ajoutées ou modifiées par cette feature. Le modèle métier général (services, prix, quantités) reste celui de [docs/data-model.md](../../docs/data-model.md) et du contrat [content-schema.md](../001-project-foundation/contracts/content-schema.md) de 001. Les schémas exacts sont dans [contracts/content.md](./contracts/content.md).

---

## Destination de navigation

Pas un fichier de contenu : une configuration typée dans `src/i18n/navigation.ts`, dérivée de la table `ROUTES`.

| Champ | Type | Règle |
|---|---|---|
| `key` | `RouteKey` | clé existante de `ROUTES` |
| `label` | clé de dictionnaire | `nav.<key>`, présente en FR et en EN |
| `icon` | identifiant d'icône | onglets seulement |

Listes ordonnées :

- `TAB_BAR` : `home`, `experiences`, `accommodation`, `packages`, `stay` (FR-002)
- `DESKTOP_NAV` : `experiences`, `accommodation`, `packages`, `mobility` ; `stay` est rendu à part, en icône avec badge (FR-003)
- `FOOTER_LINKS` : `experiences`, `accommodation`, `packages`, `mobility`, `contact` ; le lien « À propos » vise `contact` avec l'ancre `#a-propos`
- `LEGAL_LINKS` : `legalNotice`, `privacy`, `terms`

**État livré** : une destination est rendue si et seulement si sa clé figure dans `IMPLEMENTED_ROUTES`. Après cette feature : `home`, `contact`, `legalNotice`, `privacy`, `terms`, `notFound`.

## Lien résolu

Sortie de `resolveLink(key, locale)`, fonction pure.

```ts
type ResolvedLink =
  | { kind: 'internal'; href: string }   // route livrée
  | { kind: 'whatsapp'; href: string };  // route non livrée → wa.me + message générique
```

Transition : une clé passe de `whatsapp` à `internal` dès qu'elle entre dans `IMPLEMENTED_ROUTES`. Aucune autre modification n'est nécessaire dans les composants.

## Catégorie (collection `categories`, modifiée)

| Champ | Changement |
|---|---|
| `image` | **ajouté**, obligatoire : `{ src: image(), alt: LocalizedString }` |
| `name`, `description`, `order`, `provisional` | inchangés |

Trois fichiers : `nature-decouverte` (order 10), `aventure` (20), `detente` (30). L'identifiant du fichier sert de valeur de filtre pour `/experiences?categorie=<id>` en 003.

## Service (collection `services`, modifiée)

| Champ | Changement |
|---|---|
| `images[].src` | **chemin texte → `image()`** d'Astro, résolu au build |
| autres champs | inchangés |

Quatre fichiers `featured: true` publiés par cette feature :

| Fichier | Prix | Forme |
|---|---|---|
| `chutes-de-la-lobe` | 5 000 `per_person` | prix ferme |
| `excursion-en-pirogue` | 35 000 `per_group`, 8 pers. max | prix ferme |
| `croisiere-en-bateau` | 25 000 `per_person` | prix ferme |
| `campement-bagyeli` | 3 tarifs (`tiers`) ; la carte affiche le tarif individuel 7 500 `per_person` comme « à partir de » | à partir de |

Prix affiché sur une carte : `pricing` si présent ; sinon le plus petit montant des `tiers` non `quote`, en forme « à partir de » ; badge « sur devis » si tout est `quote`. Cette règle est une fonction pure, `cardPrice(service)`, testée.

`excursion-en-pirogue` perd `provisional` et `availability: "disabled"` une fois ses textes et sa photo validés.

## Aperçus de l'accueil (`src/content/site/home.json`, nouveau, temporaire)

```ts
type HomeTeasers = {
  accommodation: TeaserCard[];  // Chambre, Studio, Villa
  packages: TeaserCard[];       // Package Découverte, Package Aventure
};
type TeaserCard = {
  id: string;
  title: LocalizedString;
  summary?: LocalizedString;    // « Chutes, pirogue, campement, musée, guide »
  price: { kind: 'from' | 'fixed'; amount: number; unit: 'per_night' | 'per_group'; basePersons?: number };
  image: { src: image(); alt: LocalizedString };
};
```

Montants : Chambre à partir de 15 000 / nuit, Studio à partir de 30 000 / nuit, Villa à partir de 150 000 / nuit ; Découverte 100 000 et Aventure 150 000 pour 2 personnes. **Durée de vie** : supprimé par la feature 005, qui lit ses propres collections.

## Coordonnées et identité (`src/content/site/company.json`, nouveau)

| Champ | Type | Obligatoire | Source |
|---|---|---|---|
| `brand` | `"Kibreeze"` | oui | — |
| `group` | `"Breezy Groupe"` | oui | client K5 |
| `sisterBrands` | `string[]` | oui | `["TKS®", "iBreezy", "Breezy Delivery"]` |
| `locality` | `LocalizedString` | oui | « Kribi, Cameroun » |
| `whatsapp` | — | — | **pas ici** : variable `PUBLIC_WHATSAPP_NUMBER` (contrat env de 001) |
| `email` | `string` (e-mail) | non | ⏳ Franck |
| `social` | `{ network: 'facebook' \| 'instagram' \| 'tiktok'; url: string }[]` | non, peut être vide | ⏳ Franck |
| `about` | `{ short: LocalizedString; full: LocalizedString }` | oui | texte de Franck, 1 quater |
| `legal.publisherName` | `string` | non au build, oui au lancement | ⏳ K3 |
| `legal.legalForm` | `string` | idem | ⏳ K3 |
| `legal.registration` | `{ rccm?: string; niu?: string }` | idem | ⏳ K3 |
| `legal.address` | `string` | idem | ⏳ K3 |
| `legal.publicationDirector` | `string` | idem | ⏳ K3 |
| `legal.host` | `{ name; address; url }` | oui | Cloudflare, Inc. |

Règle d'affichage : un champ facultatif absent n'est pas rendu, sans emplacement vide (FR-018, edge case « information légale manquante »). `scripts/check-legal.ts` liste les champs `legal.*` absents.

## Taux de change (`src/content/site/currency.json`, nouveau)

```json
{ "eurToXaf": 655.957, "source": "Parité fixe XAF/EUR (BEAC)", "since": "1999-01-01" }
```

Utilisé par `formatEurEquivalent`. Ne change jamais tout seul (FR-EUR-2).

## Document légal (collection `legal`, nouvelle)

Fichiers `src/content/legal/fr/*.md` et `src/content/legal/en/*.md`.

| Champ frontmatter | Type | Règle |
|---|---|---|
| `doc` | `'legalNotice' \| 'privacy' \| 'terms'` | un fichier par `doc` et par langue, contrôlé au build |
| `locale` | `Locale` | doit correspondre au dossier |
| `title` | `string` | unique sur le site |
| `description` | `string` | 160 caractères au plus |
| `updatedAt` | date ISO | affichée en tête de page (FR-033) |

Corps Markdown. Le document `privacy` contient une section dont l'ancre est `cookies`, avec le tableau des stockages : vide de cookie pour 002.

## Prix affiché

Sortie de `formatXaf` et `formatEurEquivalent` (fonctions pures, `src/features/estimation/formatPrice.ts`) :

| Entrée | FR | EN |
|---|---|---|
| 25 000, `per_person`, fixe | « 25 000 FCFA / personne » + « ≈ 38,11 € » | « 25,000 FCFA / person » + « ≈ €38.11 » |
| 15 000, `per_night`, à partir de | « À partir de 15 000 FCFA / nuit » + « ≈ 22,87 € » | « From 15,000 FCFA / night » + « ≈ €22.87 » |
| `quote` | badge « Sur devis », pas d'euro | badge « On request », pas d'euro |

Séparateur de milliers : espace insécable fine en français, virgule en anglais. Les libellés d'unité viennent des dictionnaires (`price.unit.<unit>`).
