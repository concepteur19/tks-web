# Quickstart — 004 Mon séjour, estimation et demande WhatsApp

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # sélection, estimation, message : 100 % de couverture ; composants Preact (axe)
npm run build:prod
npm run check:links
npm run check:bundle   # ≤ 50 Ko par page de contenu, ≤ 80 Ko sur /sejour
npm run test:e2e       # ajout, fusion, persistance, Mon séjour, message, stockage indisponible, sans JavaScript
npm run lighthouse     # /sejour ≥ 90 (SC-005)
```

## Scénarios à dérouler à la main

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Fiche pirogue : 6 personnes + guide, « Ajouter » | message de confirmation, compteur 1, total barre = 40 000 FCFA | US1-1, US1-5 |
| 2 | Réajouter la pirogue avec 3 personnes | une seule ligne, 9 personnes → sur devis (au-delà de 8) | US1-2, FR-013 |
| 3 | Campement : tarif couple, ajouter | ligne « tarif couple » 20 000 FCFA | US1-4 |
| 4 | Feu de plage : ajouter deux fois | la seconde fois, « Déjà dans mon séjour » | US1-6 |
| 5 | Liste : « Ajouter » sur la carte des chutes | ligne avec 2 personnes (valeur par défaut) | FR-002 |
| 6 | Fermer et rouvrir le navigateur | sélection identique | US1-7 |
| 7 | Ouvrir Mon séjour | lignes, quantités en toutes lettres, total, euro, « + N sur devis » | US2-1 |
| 8 | Modifier une quantité, supprimer une ligne, « Vider » | total et compteur à jour ; confirmation avant de vider ; état vide | US2-3, US2-4, US2-7 |
| 9 | Laisser dates et voyageurs vides | rappel visible, envoi possible | US2-5 |
| 10 | « Demander un devis par WhatsApp » | message complet dans la langue de la page | US3-1, US3-2 |
| 11 | Changer de langue sur Mon séjour | mêmes lignes, libellés traduits, montants au format de la langue | FR-009 |
| 12 | Navigation privée stricte (Safari) | bandeau « sélection non conservée », tout fonctionne | FR-008 |
| 13 | Sur ordinateur, Mon séjour | panneau du total collant à droite ; icône de l'en-tête avec compteur | FR-023, US4 |
| 14 | Accueil : « Planifier mon séjour » | mène à Mon séjour | FR-028 |

## Résultats relevés

Contrôles automatiques du 2026-10-10 (T031) :

| Contrôle | Résultat |
|---|---|
| `npm run check` | 168 tests unitaires (couverture 100 %), 36 tests de composants et d'îlots, lint, types, contrastes : tout passe |
| `npm run build:prod` | 42 pages, traductions complètes |
| `npm run check:links` | 1 220 liens internes, aucun cassé |
| `npm run check:bundle` | pages de contenu 20 à 24,5 Ko compressés (budget 50 Ko) ; Mon séjour 24,8 Ko (budget 80 Ko) |
| `npm run test:e2e` | 289 parcours, Chromium et WebKit : tout passe (3 ignorés sous WebKit, comme avant) |

Lighthouse, profil mobile, médiane de trois passages :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP simulé | CLS |
|---|---|---|---|---|---|---|
| `/` | 94 | 100 | 100 | 100 | 3,01 s | 0,001 |
| `/experiences` | 96 | 100 | 100 | 100 | 2,79 s | 0 |
| `/experiences/excursion-en-pirogue` | 96 | 100 | 100 | 100 | 2,78 s | 0 |
| `/sejour` | 99 | 100 | 100 | 100 | 1,80 s | 0 |
| `/contact` | 99 | 100 | 100 | 100 | 1,80 s | 0,001 |

Deux corrections ont été nécessaires pour y arriver :

- **`/sejour` était à 78** (CLS 0,499) : l'îlot n'existe qu'après chargement, et le pied de page remontait puis redescendait à l'arrivée du contenu. La zone de l'îlot réserve désormais un écran de haut (`StayPageShell.astro`).
- **`/experiences` était tombé à 87-91** (LCP 4,0 s, contre 93 et 3,83 s à la livraison de la 003) : la photo du bandeau, en portrait 960 × 1 280, était téléchargée entière (141 Ko) pour une bande de 224 px de haut. Elle est maintenant recadrée en 16:9 au build (74 Ko) ; la partie visible ne change pas.

Le test « l'apparition du compteur ne décale pas la mise en page » échouait une fois sur dix environ. Ce n'était pas le compteur : Chromium peint parfois l'en-tête à mi-lecture, arrêté au script d'hydratation d'Astro placé avant le premier îlot, sans le bouton WhatsApp qui suit (décalage de 0,0013, sans effet perceptible). Le test fait maintenant apparaître le compteur sur une page déjà chargée, par un ajout fait dans un autre onglet, et ne mesure que ce moment ; il échoue bien si le compteur sort de sa position absolue.

Comparaison avec les maquettes : voir T032. Scénarios manuels 1 à 14 : à dérouler par Zobel (T033).
