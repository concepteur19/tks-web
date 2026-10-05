# Contrat — adresses publiques (mise à jour 002)

**Feature**: 002-kibreeze-core · Remplace [001/contracts/routes.md](../../001-project-foundation/contracts/routes.md), dont toutes les règles restent valables.

| Clé | Français | Anglais | Livrée par |
|---|---|---|---|
| `home` | `/` | `/en/` | 001, refaite en 002 |
| `experiences` | `/experiences` | `/en/experiences` | 003 |
| `accommodation` | `/hebergements` | `/en/accommodation` | 005 |
| `packages` | `/formules` | `/en/packages` | 005 |
| `mobility` | `/mobilite` | `/en/mobility` | 006 |
| `stay` | `/sejour` | `/en/my-trip` | 004 |
| `contact` | `/contact` | `/en/contact` | **002** |
| `legalNotice` | `/mentions-legales` | `/en/legal-notice` | **002** |
| `privacy` | `/confidentialite` | `/en/privacy` | **002** |
| `terms` | `/conditions-utilisation` | `/en/terms-of-use` | **002** |
| `notFound` | `/404` | `/en/404` | 001, refaite en 002 |

Ancres stables, partageables :

| Ancre | Page | Contenu |
|---|---|---|
| `#a-propos` | `contact` | présentation complète de Kibreeze, cible de « À propos » et « En savoir plus » |
| `#cookies` | `privacy` | section cookies et stockage |

Règles ajoutées :

- `IMPLEMENTED_ROUTES` est la seule source de l'état livré. Après 002 : `home`, `contact`, `legalNotice`, `privacy`, `terms`, `notFound`.
- Une route non livrée n'est ni dans la navigation, ni dans le plan du site, ni dans un `href` interne. Un lien qui la vise est résolu en lien WhatsApp ([shell.md](./shell.md)).
- `notFound` est exclue du plan du site et porte `noindex`.
