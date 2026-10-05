# Contrat — fichiers de contenu (ajouts 002)

**Feature**: 002-kibreeze-core · Complète [001/contracts/content-schema.md](../../001-project-foundation/contracts/content-schema.md). Sémantique des champs : [data-model.md](../data-model.md).

Tous les textes de contenu sont des `LocalizedString` (`{ fr, en? }`) : le français est obligatoire au schéma, l'anglais est exigé par `check-i18n` au build de production.

## Changements de schéma

| Collection | Changement | Compatibilité |
|---|---|---|
| `categories` | `image: { src: image(), alt: LocalizedString }` obligatoire | le fichier existant `nature-decouverte.json` reçoit une image |
| `services` | `images[].src` : `z.string()` → `image()`, chemin relatif au fichier JSON vers `src/assets/photos/` | le fichier existant `excursion-en-pirogue.json` voit son chemin corrigé |

Les tests de `content-schema.test.ts` continuent d'injecter `z.string()` comme schéma d'image : `serviceSchema(src)` garde son paramètre, seul `content.config.ts` passe `image()`.

## Nouveaux fichiers

### `src/content/site/company.json`

Validé par `companySchema` (Zod, `.strict()`), chargé par une collection `site` en fichier unique.

```json
{
  "brand": "Kibreeze",
  "group": "Breezy Groupe",
  "sisterBrands": ["TKS®", "iBreezy", "Breezy Delivery"],
  "locality": { "fr": "Kribi, Cameroun", "en": "Kribi, Cameroon" },
  "social": [],
  "about": {
    "short": { "fr": "Nous sommes Kibreeze, … adaptées à vos envies.", "en": "…" },
    "full": { "fr": "Nous sommes Kibreeze, … vous venez la vivre.", "en": "…" }
  },
  "legal": {
    "host": {
      "name": "Cloudflare, Inc.",
      "address": "101 Townsend St, San Francisco, CA 94107, États-Unis",
      "url": "https://www.cloudflare.com"
    }
  }
}
```

Champs facultatifs : `email`, `social[]`, `legal.publisherName`, `legal.legalForm`, `legal.registration.{rccm,niu}`, `legal.address`, `legal.publicationDirector`. `social[].url` doit être une adresse `https`.

### `src/content/site/currency.json`

`{ eurToXaf: number > 0, source: string, since: date ISO }`.

### `src/content/site/home.json`

Voir `HomeTeasers` dans [data-model.md](../data-model.md). `price.amount` entier strictement positif ; `unit` limité à `per_night` (hébergements) et `per_group` avec `basePersons` (formules).

### `src/content/legal/<locale>/<doc>.md`

Frontmatter : `doc`, `locale`, `title`, `description` (≤ 160 caractères), `updatedAt`. Contrôles :

- un fichier par couple (`doc`, `locale`) : ni doublon, ni absence ;
- `locale` égal au nom du dossier ;
- en production, l'absence d'un document anglais fait échouer `check-i18n`, comme un champ `en` manquant.

## Contrôles au build

| Script | Ce qu'il ajoute | Échec |
|---|---|---|
| `check-content` | les trois catégories référencées par les services existent ; `featured` porté par au plus 4 services | oui |
| `check-i18n` | dictionnaire, `company.json`, `home.json`, et paires de documents légaux | en production |
| `check-legal` (nouveau) | liste les champs `legal.*` absents de `company.json` | **jamais** : avertissement seulement, voir la checklist de lancement de [quickstart.md](../quickstart.md) |
