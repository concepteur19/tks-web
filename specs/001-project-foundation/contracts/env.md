# Contrat — configuration d'environnement

**Feature**: 001-project-foundation

| Variable | Obligatoire | Format attendu | Exemple | Conséquence si absente ou invalide |
|---|---|---|---|---|
| `PUBLIC_WHATSAPP_NUMBER` | Oui | 8 à 15 chiffres, sans `+`, sans espace | `237697135388` | Le build échoue immédiatement |
| `PUBLIC_SITE_URL` | Oui | Adresse absolue avec protocole, sans barre oblique finale | `https://tks-web-1h2.pages.dev` | Le build échoue immédiatement |

Règles :

- Ces valeurs sont injectées au moment de la construction et finissent dans le HTML publié. Ce ne sont pas des secrets.
- Changer le numéro WhatsApp exige une nouvelle construction, pas un redémarrage.
- Un fichier `.env.example` documente les deux variables et reste versionné. Le fichier `.env` réel n'est jamais versionné.
- En production, les valeurs sont saisies dans l'hébergeur, par environnement, aperçu et production.
- Adresse de production actuelle : `https://tks-web-1h2.pages.dev`, attribuée par l'hébergeur le 2026-09-17. Elle sera remplacée par le domaine de TKS quand il sera acheté, ce qui exigera une nouvelle construction.
- L'environnement d'aperçu utilise volontairement la même valeur que la production : les adresses d'aperçu changent à chaque branche, et on ne veut pas de pages d'essai indexées sous leur propre adresse canonique.
