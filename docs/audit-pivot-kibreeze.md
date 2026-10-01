# Audit — ce que le pivot Kibreeze touche réellement

**Statut** : audit complet, à valider avant exécution · **Date** : 2026-09-25

Balayage de tous les fichiers versionnés du dépôt, ligne par ligne, à la recherche des traces du produit précédent (TKS en tête d'affiche, trois pôles, livraison). **48 fichiers portent une trace.** Ils ne demandent pas tous le même traitement, et c'est le point important de cet audit : une partie ne doit surtout pas être réécrite.

## Ce que l'audit change par rapport à ce qu'on croyait

Trois découvertes qui modifient le plan, au-delà du simple décompte.

**1. Le modèle de données avait déjà prévu les hébergements.** `data-model.md` ligne 132 : « Un hébergement sera un `Service` du pôle `tourisme`, catégorie `hebergement`, avec `unit: 'per_night'` ajouté à `PriceUnit` le moment venu. » Le chemin existe donc déjà. Mais il décrit un logement nommé, alors que le modèle de Franck est un **palier de budget** (« Chambre, à partir de 10 000 »). La structure `Service` convient toujours, il faut seulement ajouter l'unité `per_night` **et une dimension de quantité `nights`** : aujourd'hui les dimensions sont `persons`, `units`, `days`, `hours`, et « 3 nuits » n'est pas « 3 jours » dans l'hôtellerie (3 nuits = 4 jours sur place).

**2. La constitution est périmée sur deux points, pas un.** Son titre et sa description définissent le produit comme le site de TKS®. Mais son **principe VI dit aussi « Design comes from Figma, through tokens »**, alors qu'on génère dans Google Stitch depuis le 2026-09-18. Un amendement doit traiter les deux, et le changement de périmètre produit justifie une version majeure : 1.1.0 → 2.0.0.

**3. La découpe des features 002 à 007 est à refaire, pas à retoucher.** `specs/README.md` décrit une 003 `service-catalog` avec « pages de pôle avec filtres » pour trois pôles, et une 002 `landing-page` avec une section « pourquoi TKS ». Surtout, **il manque des features entières** : hébergements et formules n'existent nulle part dans la découpe, alors qu'elles sont maintenant dans la navigation principale. C'est le document le plus structurant à reprendre, parce que tout l'ordre de travail en découle.

## A. Documents vivants à mettre à jour

Ils décrivent le produit tel qu'il doit être. Ils doivent dire Kibreeze.

| Fichier | Lignes | Ce qu'il faut y faire |
|---|---:|---|
| `specs/README.md` | 27 | Refaire la découpe 002 à 007 : retirer la livraison, rétrograder le transport, ajouter hébergements et formules, réordonner selon la nouvelle priorité touristique |
| `docs/functional-requirements.md` | 186 | Les exigences `FR-*` que toutes les specs référencent. Les `FR-LAND-*` décrivent un accueil à trois pôles ; il faut des exigences pour les hébergements et les formules |
| `docs/data-model.md` | 301 | `Pole = 'transport' \| 'tourisme' \| 'livraison'` à revoir, `per_night` et la dimension `nights` à ajouter, tableau des unités par service à reprendre |
| `docs/product-scope.md` | 91 | Le tableau de classification MVP/V2 : « Catalogue Livraison, P0, MVP » à sortir, hébergements et formules à reclasser |
| `docs/design-prompts.md` | 306 | **Oublié lors du premier passage.** Décrit encore les trois directions pour le site TKS à trois pôles. Référencé depuis `design-system.md` |
| `docs/devops.md` | 173 | Le nom du projet Cloudflare et les procédures de déploiement |
| `docs/roadmap.md` | 68 | Hébergements sortis de V2 (contenu réel confirmé) ; formules toujours conditionnées |
| `docs/architecture.md` | 135 | Arborescence des pages et des collections |
| `docs/user-journeys.md` | 90 | Les parcours partent des trois pôles |
| `docs/technical-requirements.md` | 103 | 1 occurrence, cosmétique |
| `docs/testing-strategy.md` | 104 | 2 occurrences, cosmétique |
| `docs/risks.md` | 31 | 2 occurrences ; à compléter avec les risques nés du pivot |
| `docs/technical-decisions.md` | 237 | Accueille l'ADR du pivot et l'explication de l'amendement de la constitution |

## B. Gouvernance

| Fichier | Ce qu'il faut y faire |
|---|---|
| `.specify/memory/constitution.md` | Amendement : titre, description du produit, principe VI (Figma → l'outil de génération actuel). Version 1.1.0 → **2.0.0**. La gouvernance impose d'expliquer le changement dans `technical-decisions.md` |

## C. Code, tests et configuration

Un seul commit, sauf ce qui dépend du domaine (section D). Volume réel : très faible.

| Fichier | Ce qu'il contient |
|---|---|
| `src/i18n/fr.ts` | `site.name: 'TKS®'`, description, `home.subtitle: 'Transport • Tourisme • Livraison'`, libellés WhatsApp |
| `src/i18n/en.ts` | Les mêmes cinq clés |
| `src/i18n/routes.ts` | `RouteKey` contient `delivery` ; routes `/transport`, `/tourisme`, `/livraison`. À remplacer par la nouvelle navigation |
| `tests/unit/routes.test.ts` | Teste les routes `/tourisme` et `/en/tourism` |
| `tests/component/home.a11y.test.ts` | Ligne 50 : `expect(brand?.textContent).toContain('TKS®')` — **casse au renommage** |
| `package.json` | `"name": "tks-web"` |
| `README.md` | Titre et description du dépôt |
| `src/styles/tokens.css` | Commentaire d'en-tête |
| `config/resolve-env.mjs` | Commentaire sur le numéro WhatsApp |

## D. Infrastructure — bloquée par la réponse de Franck

L'adresse `tks-web-1h2.pages.dev` est codée en dur à cinq endroits. **Un projet Cloudflare Pages ne se renomme pas** : il faut en créer un nouveau, ce qui change l'URL partout. Cette opération dépend du nom de domaine, question K1 du classeur envoyé à Franck. À faire en une fois, quand il aura répondu.

| Fichier | Occurrence |
|---|---|
| `.github/workflows/ci.yml` | `PUBLIC_SITE_URL: https://tks-web-1h2.pages.dev` |
| `public/robots.txt` | URL du sitemap |
| `.env.example` | Valeur de production documentée |
| `tests/unit/resolve-env.test.ts` | 5 occurrences dans les cas de test |
| `specs/001-project-foundation/contracts/env.md` | Contrat d'environnement |

## E. Archives — à marquer, jamais à réécrire

Ces fichiers sont la trace de ce qui a été dit, demandé et livré à une date donnée. Les réécrire effacerait l'historique dont dépend la méthode Spec Kit, et ferait disparaître la preuve de ce que le client avait validé. Le traitement correct est un bandeau en tête, comme celui déjà posé sur la direction C.

| Fichier | Nature |
|---|---|
| `docs/client-answers.md` | Réponses du client. **Déjà traité** : section 1 ter, avec le tableau de ce que le pivot annule |
| `docs/client-questions.md` | Le questionnaire tel qu'envoyé le 2026-09-13 |
| `docs/audio-transcript.md` | Transcriptions des vocaux. **Déjà correct** |
| `docs/project-analysis.md` | Analyse du cahier des charges d'origine |
| `docs/design-briefs/direction-a-mer-et-sable.md` | Proposition soumise à Franck |
| `docs/design-briefs/direction-b-nuit-tropicale.md` | Proposition soumise à Franck |
| `docs/design-briefs/direction-c-soleil-et-vie-locale.md` | **Déjà marqué périmé** |
| `specs/001-project-foundation/` (8 fichiers) | Une feature livrée : `spec.md`, `plan.md`, `tasks.md`, `quickstart.md`, `data-model.md`, `contracts/routes.md`, `contracts/env.md`, `contracts/content-schema.md`. Elle décrit ce qui a été construit, pas ce qu'on veut construire. Le nouveau monde passe par la spec 002 |

## F. Faux positifs, rien à faire

- `.specify/templates/tasks-template.md` — le mot « Incremental **Delivery** », sans rapport
- `specs/001-project-foundation/checklists/requirements.md` — « la **dé**pendance », capturé par le motif de recherche
- `package-lock.json` — nom du paquet, changera automatiquement avec `package.json`
- `.claude/skills/speckit-tasks/SKILL.md` — outil, pas produit

## Ordre d'exécution proposé

1. **`specs/README.md` et `functional-requirements.md`** d'abord. Tout le reste en découle, et tant qu'ils décrivent l'ancien produit, écrire la spec 002 construirait sur du faux.
2. **`data-model.md`** ensuite : `per_night`, dimension `nights`, pôles. C'est le seul endroit où il y a une vraie décision technique à prendre.
3. **L'amendement de la constitution**, une fois le périmètre stabilisé.
4. **Les autres documents vivants**, mécanique.
5. **Le code et les tests**, un commit.
6. **Les bandeaux sur les archives**, rapide.
7. **L'infrastructure Cloudflare**, quand Franck aura donné le domaine.
