# Quickstart — 002 Coque du site Kibreeze et page d'accueil

Guide de vérification : comment prouver que la feature fonctionne. Les règles détaillées sont dans [contracts/](./contracts/) et [data-model.md](./data-model.md).

## Prérequis

Ceux de [001/quickstart.md](../001-project-foundation/quickstart.md) : Node 22, `npm ci`, un `.env` copié de `.env.example`.

## Lancer

```bash
npm run dev                 # http://localhost:4321 et http://localhost:4321/en/
npm run build:prod && npm run preview   # version de production, sur http://localhost:4321
```

## Contrôles automatiques

```bash
npm run check               # lint, format, types, tokens, contenu, tests unitaires et de composants
npm run build:prod          # échoue si un texte ou un document légal anglais manque
npm run check:links         # aucun lien interne cassé dans dist/ (SC-004)
npm run check:legal         # liste les champs d'identité légale manquants, sans échouer
npm run check:bundle        # aucune page de 002 ne charge de JavaScript
npm run test:e2e            # parcours, accessibilité, cookies, défilement horizontal
npm run lighthouse          # ≥ 90 sur les quatre catégories (SC-002)
```

## Scénarios à dérouler à la main

Sur un téléphone réel ou en émulation 360 × 800, puis en 1 440 × 1 024.

| # | Scénario | Résultat attendu | Spec |
|---|---|---|---|
| 1 | Ouvrir `/` | hero plein écran, logo crème, « Kribi is a feeling », titre, deux boutons | US1-1 |
| 2 | Faire défiler `/` | ordre : catégories, À ne pas manquer, bande immersive, Où dormir, formules, TKS® compact, Qui sommes-nous, bloc WhatsApp, pied de page | US1-2, FR-010 |
| 3 | Lire un prix | « 25 000 FCFA / personne » puis, dessous, « ≈ 38,11 € » ; « tarifs indicatifs » une seule fois | US1-4, FR-015 |
| 4 | Toucher « Découvrir les expériences » | WhatsApp s'ouvre (la page Expériences n'est pas encore livrée), libellé ou icône WhatsApp visibles | FR-009 |
| 5 | Toucher le bouton flottant sur `/`, `/contact`, une 404 | message « Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi. » | US2-1 |
| 6 | Même chose sous `/en/` | message « Hello Kibreeze, I would like some information about your experiences in Kribi. » | US2-2 |
| 7 | Regarder le bas d'écran sur téléphone | bouton flottant au-dessus de la barre à onglets, sans chevauchement ; seul l'onglet Accueil est présent | US2-3, FR-004 |
| 8 | Passer en 1 440 px | barre à onglets absente, navigation dans l'en-tête, contenu centré | US3-2 |
| 9 | Basculer FR → EN → FR sur chaque page | page équivalente, sans redirection ; en anglais, les libellés plus longs passent à la ligne sans casser la mise en page | US3-4, edge case |
| 10 | Lire le pied de page | quatre marques, seule Kibreeze cliquable ; trois liens légaux | US3-5, US5-1 |
| 11 | Ouvrir `/mentions-legales`, `/confidentialite#cookies`, `/conditions-utilisation` et leurs équivalents anglais | contenu complet, date de mise à jour, hébergeur cité, aucun cookie listé | US5 |
| 12 | Parcourir `/` au clavier seul | lien d'évitement, focus visible, tous les liens atteignables | SC-006 |
| 13 | Désactiver JavaScript et recharger `/` | tout est lisible, carrousel défilable, liens WhatsApp fonctionnels | edge case |
| 14 | Coller l'adresse de `/` et `/en/contact` dans un outil d'aperçu de partage | titre, description et image propres à la page | US4-1 |

## Checklist de lancement sous kibreeze.com

Ne s'applique pas à l'adresse provisoire `*.pages.dev`.

- [ ] `npm run check:legal` ne signale plus aucun champ manquant (identité de l'éditeur, question K3)
- [ ] Textes légaux relus par un professionnel du droit
- [ ] `PUBLIC_SITE_URL` réglée sur `https://kibreeze.com` dans l'environnement de production
- [ ] Trace écrite des accords des personnes photographiées au campement Bagyeli conservée par Franck
- [ ] Relecture de l'accueil par Franck sur son téléphone (SC-008)

## Résultats relevés

À compléter à la fin de l'implémentation : scores Lighthouse de `/`, `/en/`, `/contact`, et temps d'affichage du hero (SC-001).
