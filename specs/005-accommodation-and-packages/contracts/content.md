# Contrat — contenu

Complète [specs/008-tourism-universes/contracts/content.md](../../008-tourism-universes/contracts/content.md). Valeurs : [data-model.md](../data-model.md).

## Schéma de prestation (`serviceSchema`)

```text
section            + 'parcours'
accommodationType  'chambre' | 'studio' | 'appartement' | 'villa'   section hebergement uniquement, obligatoire
steps              [{ label { fr, en }, serviceId? }], 2 au moins    section parcours uniquement, obligatoire
serviceIds         string[], 2 au moins                              section formule uniquement, obligatoire
badge              { fr, en }                                         facultatif
pricing.unit       + 'per_couple'
```

Messages d'erreur (par fichier), en français : « accommodationType est obligatoire pour un hébergement », « steps est obligatoire pour un parcours », « serviceIds est obligatoire pour une formule », et « … n'est permis que pour … » quand le champ apparaît dans une autre section.

## Contrôles transversaux (`catalogIssues`)

| Règle | Message (forme) |
|---|---|
| étape de parcours vers une prestation inconnue ou désactivée | `services/<id> → steps[n] : « x » ne correspond à aucune prestation publiée` |
| formule vers une prestation inconnue ou désactivée | `services/<id> → serviceIds : « x » ne correspond à aucune prestation publiée` |

Une prestation publiée est une expérience ou une option dont `availability` n'est pas `disabled`.

## Fonctions d'accès (`src/lib/catalog.ts`)

| Fonction | Rôle |
|---|---|
| `getAccommodation()` | paliers publiés, par ordre |
| `getTours()` | parcours publiés, par ordre |
| `getPackages()` | formules publiées, par ordre |

## Catalogue des îlots (`src/lib/pageCatalog.ts`)

Contient expériences, options, paliers, parcours et formules publiés. Adresse d'une ligne :

| Section | FR | EN |
|---|---|---|
| `experience` | `/experiences/<id>` | `/en/experiences/<id>` |
| `hebergement` | `/hebergements#<id>` | `/en/accommodation#<id>` |
| `parcours`, `formule` | `/formules#<id>` | `/en/packages#<id>` |

## Chaînes d'interface ajoutées (FR / EN)

| Clé | FR | EN |
|---|---|---|
| `price.unit.per_couple` | / 2 personnes | / 2 people |
| `accommodation.title` | Hébergements | Accommodation |
| `accommodation.tagline` | Dites-nous votre budget, nous trouvons le logement | Tell us your budget, we find the place |
| `accommodation.intro` | Choisissez le type de logement et le budget qui vous convient. Nous cherchons ensuite la meilleure option disponible chez nos partenaires à Kribi. | Choose the type of accommodation and the budget that suit you. We then find the best option available among our partners in Kribi. |
| `accommodation.example` | Exemple de logement à ce budget | Example of accommodation at this budget |
| `accommodation.type.chambre` … `.villa` | Chambre, Studio, Appartement, Villa | Room, Studio, Apartment, Villa |
| `accommodation.premium.title` | Plus grand, plus haut de gamme ? | Bigger, more upmarket? |
| `accommodation.premium.text` | Appartements et villas d'exception, jusqu'à 300 000 FCFA la nuit. Nous réservons pour vous. | Exceptional apartments and villas, up to 300,000 FCFA a night. We book for you. |
| `packages.title` | Formules | Packages |
| `packages.tagline` | Des séjours déjà composés, ajustables avec nous | Ready-made trips you can adjust with us |
| `packages.tours.title` | Parcours de visite | Guided tours |
| `packages.tours.note` | Prix de départ par personne : il dépend du groupe, des étapes et de la saison. | Starting price per person: it depends on the group, the stops and the season. |
| `packages.customise` | Personnaliser ce parcours | Customise this tour |
| `packages.activities.title` | Formules d'activités | Activity packages |
| `packages.base` | Tous nos forfaits sont calculés sur une base de 2 personnes. | All our packages are priced for 2 people. |
| `packages.groups.title` | Groupes jusqu'à 8 personnes sur demande | Groups of up to 8 on request |
| `packages.groups.text` | Chaque formule est ajustable : dites-nous ce que vous voulez changer. | Every package can be adjusted: tell us what you'd like to change. |
| `experiences.toursEntry.title` | Parcours Kibreeze | Kibreeze tours |
| `experiences.toursEntry.text` | Six circuits déjà composés pour découvrir Kribi en une journée. | Six ready-made tours to discover Kribi in a day. |
