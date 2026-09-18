# Modèle de données — phase 1

**Feature**: 001-project-foundation · **Date**: 2026-09-17

La référence complète du domaine est [docs/data-model.md](../../docs/data-model.md). Ce document ne décrit que ce que cette feature livre réellement : le socle de types, pas le catalogue.

## Entités livrées

### `Locale`

```ts
export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';
```

### `LocalizedString`

```ts
export type LocalizedString = { fr: string; en?: string };
```

`en` est optionnel dans le schéma pour accepter le contenu livré au fil de l'eau. Le contrôle de production l'exige partout.

### `RouteKey` et table des routes

```ts
export type RouteKey = 'home' | 'transport' | 'tourism' | 'delivery' | 'stay' | 'contact' | 'notFound';

export const ROUTES: Record<RouteKey, Record<Locale, string>> = {
  home:      { fr: '/',           en: '/en/' },
  transport: { fr: '/transport',  en: '/en/transport' },
  tourism:   { fr: '/tourisme',   en: '/en/tourism' },
  delivery:  { fr: '/livraison',  en: '/en/delivery' },
  stay:      { fr: '/sejour',     en: '/en/my-trip' },
  contact:   { fr: '/contact',    en: '/en/contact' },
  notFound:  { fr: '/404',        en: '/en/404' },
};
```

Règles vérifiées par les tests : chaque clé possède un chemin dans chaque langue, aucun chemin n'est utilisé deux fois dans une même langue, et passer du français à l'anglais puis revenir redonne le chemin de départ. Seules `home` et `notFound` ont une page dans cette feature ; les autres clés existent pour que le sélecteur de langue et le plan du site soient prêts.

Fonctions associées : `getLocaleFromPath(path)`, `getAlternatePath(path, locale)`, `getRoutePath(key, locale)`.

### `Dictionary`

```ts
export type Dictionary = typeof fr;           // le français fait référence
export const en = { ... } satisfies Dictionary; // une clé manquante casse la compilation
```

Fonctions : `t(locale, key, params?)` avec interpolation et pluriels via `Intl.PluralRules`, et `localize(value, locale)` qui replie sur le français en signalant le manque.

### Schémas de contenu

Deux collections déclarées, avec leurs champs localisés, conformément à [docs/data-model.md](../../docs/data-model.md) :

- `categories` : `id`, `pole`, `name`, `description?`, `order`
- `services` : `id`, `title`, `pole`, `categoryId`, `shortDescription`, `description`, `images`, `pricing`, `quantity`, `duration?`, `capacity?`, `conditions?`, `availability`, `featured?`, `order?`, `seo?`

Règles de validation implémentées ici :

| Règle | Comportement |
|---|---|
| Champ obligatoire absent | Le build échoue en nommant le fichier et le champ |
| `categoryId` inconnu | Le build échoue |
| Unité de prix incohérente avec les dimensions | Le build échoue en expliquant l'incohérence |
| Plus de deux dimensions, ou deux durées | Le build échoue |
| `min > default > max` | Le build échoue |
| Traduction anglaise absente | Avertissement hors production, échec en production |

Le contenu livré se limite à une catégorie et une fiche d'exemple, marquées comme provisoires et suivies dans [content-tracker.md](../../docs/content-tracker.md).

### `EnvConfig`

| Variable | Format | Rôle |
|---|---|---|
| `PUBLIC_WHATSAPP_NUMBER` | suite de chiffres, format international sans `+` | Construction des liens WhatsApp |
| `PUBLIC_SITE_URL` | adresse absolue | Adresses canoniques, liens alternatifs, plan du site |

Les deux sont exigées au build. Aucune n'est un secret : elles finissent dans le HTML publié.

## Ce que cette feature ne livre pas

La sélection, l'estimation et le message WhatsApp, avec leurs entités `SelectedService`, `PriceEstimate` et `WhatsAppMessage`, appartiennent aux features 004 à 006.
