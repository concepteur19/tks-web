# Contrat — contenu du catalogue (ajouts 003)

**Feature**: 003-experience-catalog · Complète [002/contracts/content.md](../../002-kibreeze-core/contracts/content.md). Sémantique : [data-model.md](../data-model.md).

## Changements du schéma `services`

```ts
location?: LocalizedString            // nouveau
categoryId: string                    // obligatoire si section = experience et non isOption
images: Image[]                       // ≥ 1, sauf isOption
```

Tests de schéma ajoutés : option sans `categoryId` ni image acceptée ; expérience sans `categoryId` refusée ; expérience sans image refusée ; `location` localisé.

## Contrôles au build

| Script | Ajout |
|---|---|
| `check-content` | chaque catégorie référencée existe (inchangé) ; au moins une expérience publiée par catégorie déclarée, sinon avertissement ; au plus 4 `featured` (inchangé) |
| `check-i18n` | inchangé : tout champ `{ fr }` des 16 fichiers exige son `en` en production |

## Rédaction

- Aucun champ inventé : durée, lieu, inclus, non inclus et à savoir ne sont renseignés que s'ils viennent de Franck (guide tarifaire, réponses écrites).
- Textes alternatifs : décrivent ce que montre la photo. Une photo de remplacement est décrite comme telle (« Coucher de soleil sur l'océan à Kribi »), jamais comme l'activité.
