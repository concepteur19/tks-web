# Écrans validés — exports Stitch

**Statut** : référence visuelle du code · **Validés par Franck** : 2026-10-04, relayé par Zobel · **Projet Stitch** : « Kibreeze Mobile Tourism App » (`2605669886339350810`)

Ces fichiers sont la référence visuelle des features 002 à 006. Les liens Stitch ne sont pas stables : un écran retouché change d'identifiant. C'est donc ce dossier qui fait foi, pas le projet Stitch.

Chaque écran existe en deux fichiers :

- `.jpg` : la capture pleine page. Mobile en 780 px de large (390 px affichés en 2x), ordinateur en 1440 px.
- `.html` : le code produit par Stitch. Il sert à relever les espacements, les tailles et les classes, jamais à être copié tel quel : le code du site passe par les tokens de [src/styles/tokens.css](../../src/styles/tokens.css) (constitution, principe VI).

| Fichier | Écran | Brief | Feature |
|---|---|---|---|
| `01-accueil` | Accueil | Écran 1 | 002 |
| `02a-experiences-toutes` | Expériences, onglet « Toutes » | Écran 2 | 003 |
| `02b-experiences-aventure` | Expériences, onglet « Aventure » | Écran 2 | 003 |
| `03-fiche-pirogue` | Fiche « Excursion en pirogue » | Écran 3 | 003 |
| `04-mon-sejour-plein` | Mon séjour, panier rempli | Écran 4 | 004 |
| `05a-mon-sejour-vide` | Mon séjour, panier vide | Écran 5 A | 004 |
| `05b-mon-sejour-sur-devis` | Mon séjour, prestations sur devis | Écran 5 B | 004 |
| `06a-hebergements` | Hébergements | Écran 6 | 005 |
| `06b-hebergements-ajout-confirme` | Hébergements, bandeau d'ajout | Écran 6 | 005 |
| `07-formules` | Formules | Écran 7 | 005 |
| `08-tks-mobilite` | TKS® Mobilité | Écran 8 | 006 |
| `10-accueil-ordinateur` | Accueil, version ordinateur | Version ordinateur | 002 |
| `11-fiche-pirogue-ordinateur` | Fiche, version ordinateur | Version ordinateur | 003 |

Les six autres écrans n'ont pas de maquette ordinateur : ils se déduisent des règles de la section « Version ordinateur » de [kibreeze-ecrans-stitch.md](../design-briefs/kibreeze-ecrans-stitch.md#version-ordinateur).

## Ce que les maquettes ne règlent pas

- **Photos** : celles des maquettes sont générées par Stitch. Le site utilise les photos de Franck triées dans `Elements/tri-par-activite/`, et des photos d'illustration là où il n'en existe pas, notamment pour les hébergements et les véhicules TKS®.
- **Prix des hébergements** : ils viennent de la note vocale de Franck du 2026-09-25 et du brief. Franck ne les a pas encore confirmés comme une grille ferme.
- **Rendu** : les captures `02a`, `05a` et `07` ont été refaites à partir du HTML, parce que Stitch les avait prises avant la fin du chargement. Les autres sont les captures de Stitch.

## Écarts connus, acceptés

- Bouton WhatsApp flottant : cercle sur certains écrans, carré à coins arrondis sur d'autres. Le code utilise un cercle de 56 px partout, comme le demande le brief.
- Croisière, versions ordinateur : la photo montre une pirogue à moteur. Le site utilisera la photo de croisière de Franck.
- Pied de page ordinateur : une phrase d'accroche inventée par Stitch, absente du brief. Le code suit le brief.
