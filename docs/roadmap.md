# Roadmap

**Statut** : draft · **Date** : 2026-09-13

Pas de dates : chaque étape est déclenchée par un **signal métier**, pas par un calendrier. Le détail des fonctionnalités et leur justification sont dans [product-scope.md](./product-scope.md).

```text
MVP (V1)            V2                    V3                    Future platform
site statique   →   enrichissement    →   contenu géré      →   réservation
+ sélection         frontend              par TKS               + paiement
+ WhatsApp          (packs, détails,      (CMS, demandes)       + comptes
                    analytics)                                  + partenaires
```

## MVP — V1

**Objectif** : générer des demandes WhatsApp qualifiées.

Contenu : accueil, trois pôles, fiches, sélection persistante, estimation, message WhatsApp, contact, SEO, mobile-first, Docker, CI/CD, labo Kubernetes.

Specs : 001 à 007 (voir [../specs/README.md](../specs/README.md)).

**Signal de fin** : le client reçoit des messages WhatsApp générés par le site avec de vraies sélections.

## V2 — Enrichissement frontend (toujours sans backend)

Déclencheur : le MVP tourne, TKS a stabilisé son catalogue et observe les demandes.

| Fonctionnalité | Déclencheur métier |
|---|---|
| Packs / formules | TKS a défini au moins 2 packs avec contenu et prix |
| Hébergements partenaires | Au moins un partenaire signé avec tarifs |
| Champs de qualification par service (dates, départ, destination, colis) | Les conversations WhatsApp montrent que les mêmes questions reviennent |
| Formulaire de contact (Cloudflare Function ou service tiers) | Des visiteurs ne veulent pas passer par WhatsApp |
| Analytics de conversion (Plausible ou Umami) | TKS veut mesurer les clics et les pages performantes |
| Version anglaise | Des demandes arrivent en anglais |
| Ajout rapide depuis les cartes | Le design Figma le prévoit, les données de sélection le confirment utile |

## V3 — Contenu géré par TKS

Déclencheur : les changements de catalogue deviennent fréquents et le passage par le développeur est un frein.

| Fonctionnalité | Approche |
|---|---|
| Administration du catalogue | CMS git-based (Keystatic) éditant les fichiers existants, ou CMS headless hébergé si des non-techniciens multiples doivent éditer |
| Consultation des demandes reçues | Nécessite de capter les demandes ailleurs que dans WhatsApp : formulaire + stockage (Cloudflare D1/KV ou service tiers), avec accès protégé |
| Gestion des partenaires | Collection `partners` dans le CMS |

À ce stade un backend léger (fonctions serverless) apparaît. L'architecture V1 (schémas, composants, logique pure) est conservée.

## Future platform

Déclencheur : volume de demandes et partenaires justifiant l'automatisation.

| Fonctionnalité | Prérequis |
|---|---|
| Réservation en ligne avec disponibilités | Backend, base de données, partenaires connectés |
| Paiement en ligne (Mobile Money, carte) | PSP local, cadre juridique, réservation |
| Comptes clients, historique, notifications | Authentification, backend |
| Espace partenaires | Multi-tenant, rôles |
| Conciergerie | Tout ce qui précède |

Ces fonctionnalités changent la nature du produit (application métier). Elles feront l'objet d'une nouvelle phase de discovery.

## Ce qui n'est pas prévu

Notes et avis, vidéo hero, application mobile native. Ils peuvent revenir sur signal métier explicite.
