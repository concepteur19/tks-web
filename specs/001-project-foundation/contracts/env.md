# Contrat — configuration d'environnement

**Feature**: 001-project-foundation

| Variable | Obligatoire | Format attendu | Exemple | Si elle est absente | Si elle est mal formée |
|---|---|---|---|---|---|
| `PUBLIC_WHATSAPP_NUMBER` | Non, repli documenté | 8 à 15 chiffres, sans `+`, sans espace | `237697135388` | Repli sur le numéro versionné dans `config/resolve-env.mjs` | Le build échoue immédiatement |
| `PUBLIC_SITE_URL` | Non, repli documenté | Adresse absolue avec protocole, sans barre oblique finale | `https://tks-web-1h2.pages.dev` | Repli sur l'adresse fournie par l'hébergeur, sinon sur `http://localhost:4321` | Le build échoue immédiatement |

Ordre de résolution, du plus fort au plus faible : la variable explicite, puis l'adresse que Cloudflare expose à chaque construction, puis la valeur de repli du dépôt. La résolution est dans `config/resolve-env.mjs`, la validation de format dans `src/lib/env.ts`.

Pourquoi un repli plutôt qu'un échec : ces deux valeurs sont publiques, elles finissent dans le HTML, et une variable oubliée sur un environnement d'aperçu bloquait toute la chaîne. Le prix à payer est assumé : une adresse non configurée ne fait plus échouer la construction, elle produit des adresses canoniques pointant vers l'aperçu. La configuration de production reste donc à vérifier, ce que fait la tâche T049.

Règles :

- Ces valeurs sont injectées au moment de la construction et finissent dans le HTML publié. Ce ne sont pas des secrets.
- Changer le numéro WhatsApp exige une nouvelle construction, pas un redémarrage.
- Un fichier `.env.example` documente les deux variables et reste versionné. Le fichier `.env` réel n'est jamais versionné.
- Chez l'hébergeur, ces valeurs sont des variables **de construction**, pas d'exécution. Le site étant statique, une variable d'exécution ne l'atteint jamais. Elles se configurent séparément pour l'aperçu et pour la production.
- Adresse de production actuelle : `https://tks-web-1h2.pages.dev`, attribuée par l'hébergeur le 2026-09-17. Elle sera remplacée par le domaine de TKS quand il sera acheté, ce qui exigera une nouvelle construction.
- L'environnement d'aperçu utilise volontairement la même valeur que la production : les adresses d'aperçu changent à chaque branche, et on ne veut pas de pages d'essai indexées sous leur propre adresse canonique.
