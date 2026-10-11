# Contrat — contenu

Complète `specs/001-project-foundation/contracts/content-schema.md` et la 003. Valeurs : [data-model.md](../data-model.md).

## Schéma d'univers (`categorySchema`)

```text
name         { fr, en }            obligatoire
description  { fr, en }            obligatoire (était facultatif)
slug         { fr, en }            obligatoire, /^[a-z0-9]+(-[a-z0-9]+)*$/
order        entier
image        { src, alt { fr, en } }
withOptions  booléen               facultatif, true par défaut
provisional  booléen               facultatif (inchangé)
```

Objet strict : tout champ inconnu est une erreur.

## Schéma de prestation (`serviceSchema`)

Deux ajouts : `degressive` (booléen, facultatif) et, dans chaque image, `illustrative` (booléen, facultatif). Tout le reste est inchangé ; le minimum de participants est la borne `min` de la dimension `persons`.

Schéma d'image : `{ src, alt { fr, en }, illustrative? }`, strict.

## Contrôles transversaux (`catalogIssues`, pur)

Signature élargie pour recevoir les univers entiers (identifiant et slugs), et non plus seulement leurs identifiants. Erreurs produites, en français, avec le fichier en cause :

| Règle | Message (forme) |
|---|---|
| `categoryId` inconnu (existant) | `services/<id> : categoryId « x » ne correspond à aucun univers` |
| identifiant de prestation égal à un slug d'univers | `services/<id> : identifiant identique à l'adresse de l'univers « x »` |
| slug d'univers en double dans une langue | `categories/<id> → slug.<langue> : déjà utilisé par l'univers « x »` |

L'appartenance à un univers est déjà imposée par le schéma (« categoryId est obligatoire pour une expérience »). `scripts/check-content.ts` exécute ces contrôles avant chaque construction, comme aujourd'hui.

## Fonctions d'accès (`src/lib/catalog.ts`)

| Fonction | Rôle |
|---|---|
| `getCategories()` | univers triés par ordre (inchangé) |
| `categoriesWithExperiences()` | univers qui ont au moins une prestation publiée (inchangé) ; ils seuls ont une page et une carte |
| `getUniverseExperiences(id)` | **nouveau** : prestations publiées d'un univers, par ordre puis nom |
| `getOptionsFor(service)` | **nouveau** : options publiées (guide touristique, maître-nageur ; `musee-d-art` est désactivé) si l'univers de la prestation a `withOptions` différent de `false`, sinon liste vide |
| `categoryCount(id)` | inchangé |

## Fonction pure (`src/features/catalog/`)

`minimumParticipants(service) → number | undefined` : la borne `min` de la dimension `persons` de la règle de quantité de la prestation si elle est supérieure à 1, sinon `undefined`. Couverte à 100 % (principe III).
