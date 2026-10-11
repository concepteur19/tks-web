# Contrat — adresses

Complète le contrat d'adresses de la 002 (`specs/002-kibreeze-core/contracts/routes.md`) et de la 003. Décision : [research.md](../research.md) §2.

## Pages

| Page | FR | EN | Générée si |
|---|---|---|---|
| Page d'entrée du Tourisme | `/experiences` | `/en/experiences` | toujours (route `experiences`, inchangée) |
| Page d'un univers | `/experiences/<univers.slug.fr>` | `/en/experiences/<univers.slug.en>` | l'univers a au moins une prestation publiée |
| Fiche | `/experiences/<id>` | `/en/experiences/<id>` | la prestation est publiée (inchangé, 003) |

- Pages d'univers et fiches sont produites par la même route dynamique (`src/pages/experiences/[slug].astro` et `src/pages/en/experiences/[slug].astro`).
- Les liens alternatifs (`hreflang`) et le sélecteur de langue d'une page d'univers pointent vers la même page dans l'autre langue, slug traduit compris.
- Un univers sans prestation publiée n'a pas de page : son adresse renvoie la page d'erreur de la langue.

## Invariants (vérifiés au build)

- Aucun identifiant de prestation n'est égal à un slug d'univers, dans l'une ou l'autre langue.
- Les slugs d'univers sont uniques dans chaque langue.
- La table des adresses (`src/i18n/routes.ts`) et `IMPLEMENTED_ROUTES` ne changent pas.

## Adresses héritées

| Adresse | Comportement |
|---|---|
| `/experiences#nature-decouverte`, `#aventure`, `#detente`, `#toutes` (et `/en/…`) | page d'entrée ; l'ancre ne désigne plus rien (FR-007) |
| `/experiences/croisiere-en-bateau`, `/experiences/bateau-de-plaisance` | page d'erreur, prestations désactivées [HYPOTHÈSE Q1, Q2] |
| Toute autre fiche existante | inchangée |

## Plan du site

La page d'entrée, les trois pages d'univers et les 32 fiches, dans les deux langues. Ni les prestations désactivées, ni les options.
