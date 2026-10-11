# Quickstart — 008 Les trois univers du Tourisme

Guide de vérification. Règles : [contracts/](./contracts/), [data-model.md](./data-model.md).

## Contrôles automatiques

```bash
npm run check          # minimumParticipants et catalogIssues à 100 % ; schémas ; composants
npm run build:prod     # 32 fiches + 1 page d'entrée + 3 univers, × 2 langues ; traductions complètes
npm run check:links    # aucun lien cassé, y compris fil d'Ariane et navigation entre univers
npm run check:bundle   # page d'entrée sans îlot d'ajout ; univers ≤ 50 Ko
npm run test:e2e       # page d'entrée, univers, fiches, minimum, séjour multi-univers
npm run lighthouse     # page d'entrée, un univers, une nouvelle fiche ≥ 90 (SC-006)
```

`lighthouserc.json` reçoit `/experiences/visites.html` et `/experiences/village-mayi.html`.

## Scénarios à dérouler à la main (17)

En 360 × 800 puis en 1 440 × 1 024, en français puis en anglais.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Onglet Tourisme | « Découvrez Kribi selon vos envies », 3 cartes d'univers, aucune carte d'expérience | US1-1, FR-002 |
| 2 | Lire une carte d'univers | photo, nom, phrase, 3 exemples, nombre, « Voir le catalogue » | US1-2, FR-003 |
| 3 | Toucher « Activités & Loisirs » | 13 activités, rien d'autre | US1-3, FR-004 |
| 4 | Depuis Activités, toucher « Spécialités culinaires » dans la navigation | 10 spécialités, toutes « Sur demande » | US1-4, US2-3 |
| 5 | Copier l'adresse d'un univers, l'ouvrir dans un autre onglet, changer de langue | même univers ; en anglais, adresse traduite | US1-5 |
| 6 | Accueil, cartes d'univers | 3 univers, chacune mène à sa page | US1-6, FR-009 |
| 7 | Ancien lien `/experiences#aventure` | page d'entrée | FR-007 |
| 8 | Fiche Village Mayi | prix 5 000 FCFA / personne, mention dégressive, « Ce qui est inclus » cite ponts, phare et monument | US2-2, FR-014, FR-018 |
| 9 | Fiche Village Bagyeli | « À partir de 15 000 FCFA », « Minimum 2 personnes », dégressif ; le sélecteur ne descend pas sous 2 | US3 |
| 10 | Fiche jet-ski | 10 000 FCFA la session | US2-4 |
| 11 | Fiche langouste | aucun montant, aucune option | FR-013, FR-016 |
| 12 | Ajouter Mayi, quad et langouste, ouvrir Mon séjour, envoyer | 3 lignes ; total sans la langouste, comptée « sur devis » ; message qui nomme les trois | US2-5, US2-6 |
| 13 | Ancienne fiche `/experiences/croisiere-en-bateau`, sur l'aperçu Cloudflare | redirection vers le bateau de croisière en haute mer | FR-007 |
| 14 | Sans JavaScript | page d'entrée, univers et fiches lisibles, univers atteignables par lien | Edge cases |
| 15 | Fiche langouste, carte du bateau de croisière | étiquette « Photo illustrative » sur l'image | FR-024 |
| 16 | Fiche pirogue | options guide et maître-nageur, plus de musée | FR-016 |
| 17 | Fiches feu de plage, chaloupe, bouée tractée | photos de Franck, plus d'image générée | FR-025 |

## Résultats relevés

Contrôles automatiques du 2026-10-11 (T040) :

| Contrôle | Résultat |
|---|---|
| `npm run check` | 181 tests unitaires (couverture 100 %), 37 tests de composants, lint, types, contrastes : tout passe |
| `npm run build:prod` | 86 pages (page d'entrée, 3 univers et 32 fiches, × 2 langues, plus le reste du site), traductions complètes |
| `npm run check:links` | 2 634 liens internes, aucun cassé |
| `npm run check:bundle` | toutes les pages sous budget ; la plus lourde, Mon séjour, 25,6 Ko |
| `npm run test:e2e` | 345 parcours, Chromium et WebKit : tout passe (3 ignorés sous WebKit, comme avant) |
| `public/_redirects` | 4 redirections vérifiées par `tests/unit/redirects.test.ts` ; leur effet ne se voit que sur Cloudflare Pages (scénario 13) |

Lighthouse, profil mobile, médiane de trois passages :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | LCP simulé | CLS |
|---|---|---|---|---|---|---|
| `/experiences` (page d'entrée) | 97 | 100 | 100 | 100 | 2,55 s | 0 |
| `/experiences/visites` | 94 | 100 | 100 | 100 | 3,00 s | 0 |
| `/experiences/village-mayi` | 94 | 100 | 100 | 100 | 3,00 s | 0,001 |
| `/experiences/excursion-en-pirogue` | 95 | 100 | 100 | 100 | 2,85 s | 0 |

## Comparaison visuelle (T041)

Captures à 390 px (2x) et 1 440 px de la page d'entrée et des pages d'univers, comparées aux illustrations fonctionnelles du cahier (pages 2 et 4) et au style des écrans 02a et 02b.

- Page d'entrée : conforme à la page 4 du cahier (titre, trois univers, quelques exemples, « Voir le catalogue ») ; une colonne sur téléphone, trois sur ordinateur.
- Pages d'univers : grille et cartes des écrans 02a et 02b, navigation entre univers à l'emplacement de leurs onglets.
- Corrigé : le bandeau de l'univers Activités coupait la photo du jet-ski (portrait) au niveau du torse ; l'univers prend désormais la photo en paysage `jet-ski-2`.
- Corrigé en cours de vérification : cinq photos portaient un filigrane « The Tourist Guide » non repéré au premier tri, dont celle de la page Contact, en ligne depuis la 002 (voir `docs/photo-tri.md`).

Scénarios manuels 1 à 17 : à dérouler par Zobel (T042).
