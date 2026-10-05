# Contrat — coque commune des pages

**Feature**: 002-kibreeze-core · Ce contrat lie les features 003 à 006 : toute page du site passe par `BaseLayout` et respecte ces règles.

## `BaseLayout`

| Propriété | Type | Défaut | Rôle |
|---|---|---|---|
| `locale` | `Locale` | — | langue de la page |
| `routeKey` | `RouteKey` | — | onglet actif, liens alternatifs |
| `title` | `string` | — | titre unique (FR-025) |
| `description` | `string` | description du site | méta-description unique |
| `ogImage` | image | image de partage par défaut | `og:image` absolue |
| `noindex` | `boolean` | `false` | 404, pages internes |
| `floatingWhatsApp` | `boolean` | `true` | `false` sur les fiches (003) et Mon séjour (004), qui ont une barre d'action fixe |
| `jsonLd` | `object[]` | `[]` | données structurées propres à la page |

Emplacements (`slot`) : contenu principal seulement. L'en-tête, la barre à onglets, le pied de page et le bouton flottant ne sont jamais réimplémentés par une page.

## Ordre d'empilement en bas d'écran (téléphone)

Du contenu vers le bas : barre d'action fixe de la page s'il y en a une → barre à onglets tout en bas. Le bouton WhatsApp flottant n'existe que sans barre d'action fixe, à 16 px au moins au-dessus de la barre à onglets. Les hauteurs sont des tokens (`--size-tabbar`, `--size-sticky-cta`) ; `main` réserve en marge basse la somme des barres présentes. Couches : tokens `--z-tabbar`, `--z-sticky-cta`, `--z-fab`, `--z-nav`.

## Liens et WhatsApp

| Besoin | Fonction | Résultat |
|---|---|---|
| Lien vers une page livrée | `getRoutePath(key, locale)` | chemin interne |
| Lien vers une page qui peut ne pas être livrée | `resolveLink(key, locale)` | chemin interne, ou `wa.me` + message générique |
| Bouton WhatsApp sans sélection | `buildWhatsAppUrl(number, t(locale, 'whatsapp.genericMessage'))` | `wa.me` |

Tout lien `wa.me` porte `target="_blank"`, `rel="noopener noreferrer"` et un nom accessible qui mentionne WhatsApp. Un lien résolu en WhatsApp affiche l'icône WhatsApp à côté de son libellé.

## Points de rupture

| Largeur | Navigation |
|---|---|
| < `lg` (64rem) | en-tête : logo, FR \| EN, icône WhatsApp ; barre à onglets en bas |
| ≥ `lg` | en-tête : logo, liens `DESKTOP_NAV`, FR \| EN, Mon séjour avec badge (dès 004), bouton WhatsApp ; pas de barre à onglets |

Contenu limité à 1 200 px (token `--size-content`), centré, à partir de `xl`.

## Accessibilité

- `nav` distincts et nommés : « Navigation principale » (en-tête), « Navigation mobile » (onglets), « Liens du pied de page », « Informations légales ».
- Onglet ou lien actif : `aria-current="page"`.
- Lien d'évitement vers `#main` en premier élément focalisable.
- Zones tactiles d'au moins 44 × 44 px ; contraste AA vérifié par `tokens:check` et axe.

## Données de navigation

`src/i18n/navigation.ts` exporte `TAB_BAR`, `DESKTOP_NAV`, `FOOTER_LINKS`, `LEGAL_LINKS`, `isImplemented(key)` et `resolveLink(key, locale)`. Une feature qui livre une page ajoute sa clé à `IMPLEMENTED_ROUTES` et ne touche à rien d'autre de la coque.
