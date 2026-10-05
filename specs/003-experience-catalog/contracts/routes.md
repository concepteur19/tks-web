# Contrat — adresses (mise à jour 003)

**Feature**: 003-experience-catalog · Complète [002/contracts/routes.md](../../002-kibreeze-core/contracts/routes.md).

| Adresse | Français | Anglais | Livrée par |
|---|---|---|---|
| Liste | `/experiences` | `/en/experiences` | **003** (`experiences` entre dans `IMPLEMENTED_ROUTES`) |
| Liste filtrée | `/experiences#<categorie>` | `/en/experiences#<categorie>` | **003** |
| Fiche | `/experiences/<slug>` | `/en/experiences/<slug>` | **003** |

- `<categorie>` ∈ `nature-decouverte`, `aventure`, `detente` : identifiant du fichier de catégorie, identique dans les deux langues.
- `<slug>` : identifiant du fichier de service, identique dans les deux langues, minuscules, sans accent.
- Une expérience `disabled` ou une option n'a pas de fiche : son adresse sert la 404.
- Le sélecteur de langue d'une fiche mène à la même fiche dans l'autre langue ; celui de la liste conserve l'ancre de filtre quand le navigateur l'expose, sinon mène à la liste complète.
- Le plan du site inclut la liste et chaque fiche, dans les deux langues, sans ancre.
