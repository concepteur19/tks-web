# Quickstart — 003 Catalogue des expériences

Guide de vérification. Règles détaillées : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Prérequis

Ceux de [002/quickstart.md](../002-kibreeze-core/quickstart.md).

## Contrôles automatiques

```bash
npm run check          # schémas, fonctions pures (message, JSON-LD, related), composants
npm run build:prod     # 13 fiches × 2 langues construites, traductions complètes
npm run check:links    # aucune fiche ni ancre cassée
npm run check:bundle   # seul le script du filtre, < 1 Ko, sur /experiences
npm run test:e2e       # liste, filtre avec et sans JavaScript, fiches, demande WhatsApp
npm run lighthouse     # /experiences et une fiche ≥ 90 (SC-004)
```

## Scénarios à dérouler à la main

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Ouvrir `/experiences` | bandeau, onglet « Toutes » actif, 13 cartes | US1-1 |
| 2 | Toucher « Aventure » | 5 cartes (quad, jet-ski, kayak, paddle, cheval), adresse en `#aventure` | US1-2 |
| 3 | Copier l'adresse filtrée dans un nouvel onglet | même filtre | FR-009 |
| 4 | Toucher une carte de catégorie sur l'accueil | liste déjà filtrée | US1-5 |
| 5 | Lire la carte de la pirogue et du bateau de plaisance | badge « 8 personnes max » ; badge « Disponibilité à confirmer » et « Sur devis » | US1-4 |
| 6 | Ouvrir la fiche de la pirogue | fil d'Ariane, galerie « 1 / N », prix 35 000 FCFA ≈ 53,36 €, badge capacité, infos, inclus / non inclus, options, « Vous aimerez aussi » | US2 |
| 7 | Ouvrir la fiche du campement Bagyeli | trois tarifs nommés | US2-4 |
| 8 | Ouvrir une fiche sans durée ni inclus (ex. kayak) | rubriques absentes, aucun vide | US2-6 |
| 9 | Toucher « Demander ce service » | WhatsApp, message qui nomme l'expérience et donne l'adresse, dans la langue de la page | US3 |
| 10 | Regarder le bas d'écran d'une fiche sur téléphone | barre fixe au-dessus des onglets, pas de bouton flottant | FR-018 |
| 11 | Fiche en 1 440 px | carte de demande collante à droite | US3-5 |
| 12 | Désactiver JavaScript | filtre par onglets fonctionnel, galerie parcourable, demande WhatsApp fonctionnelle | edge cases |
| 13 | Ouvrir `/experiences/decouverte-de-kribi` | 404 | FR-005 |
| 14 | Accueil | onglet Expériences présent, nombres sur les cartes de catégorie, cartes mises en avant vers leur fiche | FR-021 |

## Résultats relevés

Contrôles automatiques du 2026-10-05 (T037) :

| Contrôle | Résultat |
|---|---|
| `npm run check` | 139 tests unitaires et de composants, lint, types, contrastes : tout passe |
| `npm run build:prod` | 40 pages (dont 13 fiches × 2 langues), traductions complètes |
| `npm run check:links` | 1 098 liens internes, aucun cassé |
| `npm run check:bundle` | aucune page ne charge de script externe (le filtre est un script en ligne < 1 Ko) |
| `npm run test:e2e` | 234 parcours, Chromium et WebKit : tout passe |

Lighthouse, profil mobile, médiane de trois passages :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP simulé |
|---|---|---|---|---|---|
| `/experiences` | 93 | 100 | 100 | 100 | 3,83 s |
| `/experiences/excursion-en-pirogue` | 98 | 100 | 100 | 100 | 2,33 s |

Le LCP de `/experiences` est le bandeau photo ; 65 % du délai est du temps de rendu sous le processeur simulé, comme pour le hero de l'accueil (002). À remesurer sur un vrai téléphone lors des scénarios manuels.

Scénarios manuels 1 à 14 : à dérouler par Zobel (T038).
