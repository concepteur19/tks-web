# Contrat — contenu

Complète [specs/005-accommodation-and-packages/contracts/content.md](../../005-accommodation-and-packages/contracts/content.md). Valeurs : [data-model.md](../data-model.md).

## Schéma de prestation (`serviceSchema`)

```text
models   string[], 1 au moins   section mobilite uniquement, facultatif
```

Message d'erreur (par fichier), en français : « models n'est permis que pour la mobilité ». Ajouté à la liste `sectionFields` de la 005, mais facultatif dans sa section : seuls les champs de la 005 sont obligatoires.

Aucun contrôle transversal nouveau dans `catalogIssues`.

## Fonctions d'accès (`src/lib/catalog.ts`)

| Fonction | Rôle |
|---|---|
| `getMobility()` | prestations de mobilité publiées, par ordre ; la page les sépare en catégories de véhicules (avec `models`) et services (sans) |

## Catalogue des îlots (`src/lib/pageCatalog.ts`)

Ajoute les prestations de mobilité, avec vignette. Adresse d'une ligne :

| Section | FR | EN |
|---|---|---|
| `mobilite` | `/mobilite#<id>` | `/en/mobility#<id>` |

## Import des photos (`scripts/import-photos.mjs`)

Une entrée de `sources.json` est une chaîne (source) ou un objet :

```text
{ source: string, blur?: [{ left, top, width, height }] }   fractions 0 à 1 de l'image après rotation
```

Chaque zone est floutée avant réduction. Une zone hors de l'image fait échouer l'import (`[photos] zone de flou hors de l'image : <source>`). La règle `_FILIGRANE` s'applique aux deux formes.

## Routes

`mobility` dans `IMPLEMENTED_ROUTES`. `DESKTOP_NAV` et `TAB_BAR` inchangés.

## Chaînes d'interface ajoutées (FR / EN)

| Clé | FR | EN |
|---|---|---|
| `mobility.title` | Mobilité & transport | Mobility & transport |
| `mobility.tagline` | Location, transferts et chauffeur privé pour compléter votre séjour | Car hire, transfers and private driver to complete your trip |
| `mobility.brand` | TKS® est la marque de mobilité de Breezy Groupe, aux côtés de Kibreeze. | TKS® is Breezy Groupe's mobility brand, alongside Kibreeze. |
| `mobility.vehicles.title` | Location de véhicules | Vehicle hire |
| `mobility.vehicles.note` | Prix de départ par jour et par véhicule, confirmés par Kibreeze sur WhatsApp. | Starting prices per day and per vehicle, confirmed by Kibreeze on WhatsApp. |
| `mobility.services.title` | Transport sur devis | Transport on request |
| `mobility.add` | Ajouter à mon séjour | Add to my trip |
| `mobility.custom.title` | Besoin d'un transport sur mesure ? | Need tailored transport? |
| `mobility.custom.text` | Dites-nous vos dates et votre trajet, nous vous répondons avec un prix. | Tell us your dates and route, we reply with a price. |
| `mobility.custom.cta` | Contacter Kibreeze sur WhatsApp | Contact Kibreeze on WhatsApp |
| `mobility.request` | Demander ce service | Ask for this service |
| `mobility.requestMessage` | Bonjour Kibreeze, je souhaite un prix pour : {title}. | Hello Kibreeze, I would like a price for: {title}. |
| `mobility.seo.title` | Mobilité TKS® à Kribi : location, transferts, chauffeur | TKS® mobility in Kribi: car hire, transfers, driver |
| `mobility.seo.description` | Louez un véhicule (Luxe, Premium, Yaris) ou demandez un transfert ou un chauffeur privé pour votre séjour à Kribi. | Hire a vehicle (Luxury, Premium, Yaris) or ask for a transfer or a private driver for your stay in Kribi. |

L'anglais est relu par Zobel avant la mise en ligne.
