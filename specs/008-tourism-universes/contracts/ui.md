# Contrat — interface

Référence visuelle : illustrations fonctionnelles du cahier (pages 2 et 4) et style des écrans validés 02a et 02b (`docs/design-exports/`). Tout passe par les tokens (principe VI). Aucun îlot nouveau.

## Page d'entrée (`ExperiencesPage.astro`)

1. Bandeau photographique (inchangé, recadré en 16:9) : titre « Tourisme » / « Tourism », phrase d'accroche.
2. Titre de section « Découvrez Kribi selon vos envies » (`h2`).
3. Trois `UniverseCard`, une colonne sur téléphone, trois à partir de `lg`, dans l'ordre des univers.
4. Bloc « Une envie particulière ? » (inchangé).

Supprimés : `CategoryTabs.astro`, son style généré, son script, la grille de cartes de la page.

## `UniverseCard.astro`

| Élément | Contenu |
|---|---|
| Photo | `image` de l'univers, ratio fixe, texte alternatif de l'univers |
| Nom | `name` (`h3`) |
| Phrase | `description` |
| Exemples | noms des trois premières prestations publiées de l'univers, séparés par « · » |
| Nombre | « N expériences » (chaîne existante `experiences.count`) |
| Action | « Voir le catalogue » |

Un seul lien couvre la carte (nom accessible : nom de l'univers), vers la page de l'univers. `data-testid="universe-card"`.

## Page d'un univers (`UniversePage.astro`)

1. Fil d'Ariane : « Tourisme » (lien vers la page d'entrée) › nom de l'univers (`aria-current="page"`).
2. Bandeau : photo de l'univers recadrée en 16:9, nom (`h1`), phrase.
3. `UniverseNav` : `<nav>` nommé « Univers », trois liens, l'univers courant avec `aria-current="page"` et le style de l'onglet actif de la 003 (rouge, gras, soulignement). Collé sous la barre du haut au défilement, comme les onglets de la 003. `data-testid="universe-nav"`.
4. Ligne d'information : « N expériences » et « Prix indicatifs ».
5. Grille de `ExperienceCard` (inchangée : photo, nom, phrase, prix, `QuickAdd`, « Voir les détails »).
6. Bloc « Une envie particulière ? ».

Métadonnées : titre « <univers> — Tourisme à Kribi », description = phrase de l'univers, image de partage = photo de l'univers. Liens alternatifs vers l'autre langue.

## Fiche (`ExperienceDetail.astro`)

- Fil d'Ariane : « Tourisme › <univers> › <nom> », l'univers menant à sa page (et non plus à une ancre).
- Galerie : une image `illustrative` porte l'étiquette « Photo illustrative ».
- Badge d'univers à la place du badge de catégorie (même style).
- Options : `getOptionsFor(service)` ; liste vide → ni encadré d'options dans le configurateur, ni encadré `noscript`.
- Bloc prix (`PriceBlock.astro`), sous la pastille de capacité :
  - « Minimum N personnes » quand `minimumParticipants` est défini (pastille `accent-soft`, comme la capacité) ;
  - « Tarif dégressif : le prix par personne peut baisser avec la taille du groupe. » quand `degressive` (texte `fg-muted`, taille de la mention de prix indicatif).

## Carte d'expérience (`ExperienceCard.astro`, `CompactCard.astro`)

Étiquette « Photo illustrative » en bas à gauche de la photo quand l'image est `illustrative` : `text-xs`, fond `fg` à 70 %, texte `bg`, angles `rounded-sm`.

Pastille « Min. N pers. » sur la photo, à côté de « N personnes max », quand `minimumParticipants` est défini.

## Accueil (`CategoryCards.astro`)

Les cartes affichent les univers qui ont au moins une prestation publiée (`categoriesWithExperiences()`), avec nom, photo et nombre, et mènent à la page de l'univers, sans ancre. Le reste de l'accueil est inchangé. La page d'entrée utilise la même liste.

## Chaînes d'interface ajoutées (FR et EN)

| Clé | FR | EN |
|---|---|---|
| `experiences.universesTitle` | Découvrez Kribi selon vos envies | Discover Kribi your way |
| `experiences.seeCatalogue` | Voir le catalogue | See the catalogue |
| `experiences.universeNav` | Univers | Themes |
| `experiences.universeMetaTitle` | {name} — Tourisme à Kribi | {name} — Tourism in Kribi |
| `experiences.illustrative` | Photo illustrative | Illustrative photo |
| `price.minimum` | Minimum {count} personnes | Minimum {count} people |
| `price.minimumShort` | Min. {count} pers. | Min. {count} ppl |
| `price.degressive` | Tarif dégressif : le prix par personne peut baisser avec la taille du groupe. | Group pricing: the price per person may drop for larger groups. |

Modifiées : `nav.experiences` et `experiences.title` → « Tourisme » / « Tourism » (U1) ; `experiences.description` réécrite sans prestation retirée (« Visites, activités et spécialités culinaires : découvrez Kribi selon vos envies, avec des prix indicatifs. » / « Visits, activities and local food: discover Kribi your way, with indicative prices. »).

Supprimées : `experiences.all`, `experiences.tabsLabel` et les autres chaînes propres aux onglets de filtre.
