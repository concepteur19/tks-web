# Contrat — adresses publiques

**Feature**: 001-project-foundation

Les adresses sont un contrat public : elles sont partagées, indexées, et ne changent pas sans redirection.

| Clé | Français | Anglais | Livrée par cette feature |
|---|---|---|---|
| `home` | `/` | `/en/` | Oui |
| `experiences` | `/experiences` | `/en/experiences` | Non, feature 003 |
| `accommodation` | `/hebergements` | `/en/accommodation` | Non, feature 005 |
| `packages` | `/formules` | `/en/packages` | Non, feature 005 |
| `mobility` | `/mobilite` | `/en/mobility` | Non, feature 006 |
| `stay` | `/sejour` | `/en/my-trip` | Non, feature 004 |
| `contact` | `/contact` | `/en/contact` | Non, feature 002 |
| `notFound` | `/404` | `/en/404` | Oui |

Fiches d'expérience, feature 003 : `/experiences/<slug>` et `/en/experiences/<slug>`, le slug étant identique dans les deux langues.

Règles :

- Le français est servi sans préfixe, l'anglais sous `/en/`.
- Aucune redirection automatique selon la langue du navigateur.
- Chaque page déclare sa langue, son adresse canonique, et des liens alternatifs vers l'autre langue ainsi qu'une valeur par défaut pointant vers le français.
- Le plan du site liste les deux langues avec leurs alternatives.
- Les adresses sont en minuscules, sans accent.

Une page interne de démonstration des tokens existe en développement, exclue du plan du site, de l'indexation et du build de production.
