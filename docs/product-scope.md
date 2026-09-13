# Périmètre produit — Scope analysis

**Statut** : draft · **Date** : 2026-09-13

## Principe

Le cahier des charges décrit une plateforme complète. Le MVP est **frontend only** : aucun backend, aucune base de données, aucune authentification, aucun backoffice. Chaque fonctionnalité du cahier des charges est classée ci-dessous. Une fonctionnalité sort du MVP dès qu'elle nécessite un backend, un contenu que le client n'a pas encore, ou qu'elle n'est pas sur le chemin critique « découvrir → sélectionner → récapituler → WhatsApp ».

Niveaux : **MVP** (V1 livrée), **V2** (évolution frontend possible sans backend, ou avec service tiers léger), **V3** (nécessite backend ou CMS), **Future** (plateforme), **Hors scope** (non prévu).

Complexité : S (< 1 jour), M (1 à 3 jours), L (> 3 jours), XL (projet à part).

## Tableau de classification

| Fonctionnalité | Priorité CDC | MVP ? | Complexité | Dépendances | Justification |
|---|---|---|---|---|---|
| Accueil : identité, signature, hero, présentation courte | P0 | **MVP** | S | Textes, photos, logo | Porte d'entrée, conversion |
| Accueil : accès aux 3 pôles + 4 CTA | P0 | **MVP** | S | — | Navigation vers les catalogues |
| Accueil : expériences / formules mises en avant | P0 | **MVP** (expériences seulement) | S | Catalogue | Les formules sont V2 ; on met en avant des services `featured` |
| Bouton WhatsApp permanent (header + flottant mobile) | P0 | **MVP** | S | Numéro WhatsApp | CTA principal |
| Section « À propos » | — | **MVP** (section de l'accueil, pas de page dédiée) | S | Texte client | Positionnement ; une page séparée n'apporte rien en V1 |
| Catalogue Transport (liste, catégories, cartes) | P0 | **MVP** | M | Données services | Pôle P0 |
| Catalogue Tourisme / activités | P0 | **MVP** | M | Données, photos | Axe stratégique du CDC (§6) ; l'audio suggère de le lancer en premier, à confirmer (question A3) |
| Catalogue Livraison | P0 | **MVP** | S | Données | Pôle P0, peu de fiches |
| Filtres par catégorie dans un pôle | croquis | **MVP** | S | Catégories | Simple, améliore la découverte |
| Fiche détail prestation (photos, descriptions, prix, durée, capacité, conditions) | P0 | **MVP** | M | Données, photos | Page SEO par service, point d'ajout |
| Distinction prix fixe / indicatif / sur devis | §16 | **MVP** | S | — | Règle métier structurante |
| Mention « tarif indicatif, TKS confirme le prix final » | §7 | **MVP** | S | — | Protection commerciale |
| Catalogue évolutif sans modification de code | §5 | **MVP** (données en fichiers JSON/MD versionnés) | S | — | Le développeur édite des fichiers de données, pas des composants. Vrai « sans code » = V3 |
| Mon séjour : ajouter / retirer | P0 | **MVP** | M | — | Cœur du produit |
| Mon séjour : quantité ou nombre de personnes | P0 | **MVP** | S | Règle par service | Cœur du produit |
| Mon séjour : persistance locale (retour après fermeture) | — | **MVP** | S | localStorage | Sans elle, la sélection multi-pages est perdue |
| Mon séjour : récapitulatif + total estimatif | P0 | **MVP** | M | Prix | Cœur du produit |
| Mon séjour : identification des lignes « sur devis » | P0 | **MVP** | S | — | Règle métier |
| Mon séjour : date de séjour et nombre de voyageurs globaux | §11 (exemple de message) | **MVP** | S | — | Le message WhatsApp exemple les contient ; deux champs optionnels suffisent |
| Génération du message WhatsApp récapitulatif | P0 | **MVP** | M | Numéro, format | Conversion |
| Bouton « Demander un devis » | P0 | **MVP** (même action que WhatsApp, libellé différent) | S | — | Sans backend, un devis = un message WhatsApp |
| Page Contact : coordonnées, WhatsApp, localisation | P0 | **MVP** | S | Coordonnées | Rubrique CDC |
| Formulaire de contact avec envoi d'e-mail | §3 | **V2** | S | Service tiers (Formspree, Resend…) ou backend | Sans backend rien n'est envoyé ; WhatsApp couvre le besoin en V1. Question client |
| SEO de base : métadonnées, OG, sitemap, robots, JSON-LD LocalBusiness | §18 | **MVP** | S | Domaine | Référencement local |
| Mobile-first, accessibilité, performance | §13 | **MVP** | transverse | — | Exigence explicite |
| Champs de qualification par service (date, heure, départ, destination, durée…) | §5, §10 | **V2** | M | UX à concevoir | Alourdit le panier ; en V1 ces détails se donnent dans la conversation WhatsApp |
| Formulaire livraison structuré (retrait, destination, colis…) | §10 | **V2** | M | idem | idem |
| Formules / Packs (contenu, prix, sélection, personnalisation) | P1 | **V2** | M | Packs définis par le client | Aucun pack n'existe encore ; le modèle réserve `Pack` |
| Hébergements partenaires (hôtels, villas, appartements) | §6 | **V2** | M | Partenaires signés, photos | Aucun partenaire connu ; s'intègre comme une catégorie du pôle Tourisme |
| Analytics (trafic, clics WhatsApp) | §18 | **V2** | S | Choix outil, consentement | Utile pour mesurer la conversion, pas nécessaire pour livrer |
| Multilingue (FR / EN) | — | **V2** | M | Traductions | Non demandé ; chaînes UI centralisées dès la V1 pour ne pas fermer la porte |
| Administration du catalogue (services, prix, photos, packs, partenaires) | P1 | **V3** | L | CMS headless ou backend + auth | Le CDC veut ne plus dépendre du développeur : un CMS headless (git-based ou hébergé) répond au besoin. Les données en fichiers de la V1 migrent facilement |
| Consultation des demandes reçues | §12 | **V3** | L | Backend, stockage | Nécessite de capter les demandes ailleurs que dans WhatsApp |
| Gestion des partenaires / prestataires | P2 | **V3** | L | Backend | idem |
| Réservation en ligne | P2 | **Future** | XL | Backend, disponibilités, partenaires | Change la nature du produit |
| Paiement en ligne | P2 | **Future** | XL | Backend, PSP local (Mobile Money), juridique | Explicitement exclu de la V1 par le CDC |
| Comptes clients / espace client | P2 | **Future** | XL | Backend, auth | Aucune valeur sans réservation |
| Gestion des disponibilités | P2 | **Future** | XL | Backend, partenaires | idem |
| Notifications | §15 | **Future** | L | Backend | idem |
| Espace partenaires | §15 | **Future** | XL | Backend | idem |
| Plateforme de conciergerie | §15 | **Future** | XL | Tout ce qui précède | Vision long terme |
| Notes et avis clients | croquis | **Hors scope** | M | Source d'avis | Aucune donnée ; afficher de faux avis nuit à la crédibilité |
| Vidéo hero | croquis | **Hors scope** | S | Contenu vidéo | Contenu absent, coût performance |
| Backend, base de données, authentification | — | **Hors scope MVP** | — | — | Décision de cadrage |

## Périmètre MVP en une page

Le visiteur peut :

1. Comprendre TKS et ses trois pôles dès l'accueil.
2. Parcourir Transport, Tourisme et Livraison, filtrer par catégorie.
3. Ouvrir une fiche prestation avec photos, description, prix (fixe, à partir de, sur devis), durée, capacité, conditions.
4. Ajouter une prestation à « Mon séjour » avec une quantité ou un nombre de personnes.
5. Retrouver sa sélection après avoir fermé le navigateur.
6. Voir un récapitulatif, un total estimatif, les lignes sur devis, une mention d'indicativité.
7. Modifier ou retirer des lignes, vider la sélection.
8. Renseigner optionnellement une date de séjour et un nombre de voyageurs.
9. Envoyer le tout à TKS via WhatsApp, avec un message prérempli.
10. Contacter TKS à tout moment via le bouton WhatsApp permanent ou la page Contact.

Le site est mobile-first, accessible, rapide, indexable, et son catalogue est modifiable en éditant des fichiers de données sans toucher aux composants.

## Pourquoi Packs et Administration sortent du MVP

- **Packs** : le CDC les met en P1, mais aucun pack n'est défini (contenu, prix). Livrer une page « Formules » vide ou avec des placeholders nuit à la conversion. Le modèle de données réserve une entité `Pack` composée de services existants ; l'ajouter en V2 ne touche pas le panier.
- **Administration** : le CDC les met en P1 pour ne plus dépendre du développeur. Cela implique un backend ou un CMS. La V1 met le catalogue dans des fichiers structurés et validés (schéma), ce qui rend un changement de prix trivial pour le développeur et rend la migration vers un CMS headless en V3 quasi mécanique.

## Documents liés

- [project-analysis.md](./project-analysis.md)
- [roadmap.md](./roadmap.md)
- [functional-requirements.md](./functional-requirements.md)
