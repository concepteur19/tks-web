# Contrat — chaînes, tokens, configuration

Valeurs : [data-model.md](../data-model.md).

## Chaînes d'interface ajoutées (FR / EN)

| Clé | FR | EN |
|---|---|---|
| `guide.label` | Comment utiliser Kibreeze | How to use Kibreeze |
| `guide.progress` | Étape {n} sur 3 | Step {n} of 3 |
| `guide.explore.title` | Explorez Kribi | Explore Kribi |
| `guide.explore.text` | Parcourez le Tourisme, les hébergements et les formules : prix et photos sont sur chaque fiche. | Browse tourism, accommodation and packages: prices and photos are on every page. |
| `guide.add.title` | Composez votre séjour | Build your trip |
| `guide.add.text` | Ajoutez ce qui vous plaît à « Mon séjour », avec le nombre de personnes ou de jours. Rien n'est payé en ligne. | Add what you like to “My trip”, with the number of people or days. Nothing is paid online. |
| `guide.send.title` | Recevez votre devis | Get your quote |
| `guide.send.text` | Depuis « Mon séjour », envoyez votre demande sur WhatsApp : Kibreeze vous répond avec un devis. | From “My trip”, send your request on WhatsApp: Kibreeze replies with a quote. |
| `guide.next` | Suivant | Next |
| `guide.skip` | Passer | Skip |
| `guide.done` | C'est parti | Let's go |
| `home.how.title` | Comment ça marche | How it works |
| `home.how.1.title` | Choisissez | Choose |
| `home.how.1.text` | Visites, activités, spécialités, hébergements, formules : tout est sur Kibreeze, avec les prix. | Tours, activities, local food, accommodation, packages: it's all on Kibreeze, with prices. |
| `home.how.2.title` | Composez votre séjour | Build your trip |
| `home.how.2.text` | Ajoutez vos choix à « Mon séjour » et voyez l'estimation du total. | Add your choices to “My trip” and see the estimated total. |
| `home.how.3.title` | Recevez votre devis sur WhatsApp | Get your quote on WhatsApp |
| `home.how.3.text` | Envoyez votre séjour en un geste : Kibreeze confirme et réserve pour vous. | Send your trip in one tap: Kibreeze confirms and books for you. |
| `home.how.cta` | Découvrir le Tourisme | Discover tourism |
| `stay.added` | Ajouté ✓ | Added ✓ |
| `share.label` | Partager | Share |
| `share.aria` | Partager : {title} | Share: {title} |
| `share.copied` | Lien copié | Link copied |

L'anglais est relu par Zobel ; Franck valide les textes dans son cahier de test.

## Tokens (`src/styles/tokens.css`)

`--duration-stagger: 60ms` ; `--distance-reveal: 0.75rem`.

## Configuration

`astro.config.mjs` : `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }`, pour tous les liens internes (voir research.md §3).

## Stockage

`kibreeze.guide.v1` (voir data-model). Aucune donnée envoyée.

## Tests

`tests/e2e/guide-done.json` : état de stockage Playwright où `kibreeze.guide.v1 = "done"`, chargé par défaut par `playwright.config.ts` ; les tests du tuto le remplacent par un stockage vide.
