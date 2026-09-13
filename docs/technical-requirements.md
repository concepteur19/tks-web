# Exigences techniques — MVP

**Statut** : draft · **Date** : 2026-09-13

## 1. Contraintes de cadrage

| Réf. | Exigence | Justification |
|---|---|---|
| TR-1 | Aucun backend, aucune base de données, aucune authentification en V1 | Décision de cadrage ; le produit est un site statique |
| TR-2 | Le site est un **build statique** (HTML/CSS/JS + assets) déployable sur n'importe quel hébergeur de fichiers ou serveur web | Portabilité : Cloudflare Pages en prod, nginx en container pour le labo |
| TR-3 | Le catalogue est stocké dans des fichiers de données versionnés dans le dépôt, validés par un schéma au build | Le catalogue évolue sans toucher aux composants (CDC §5) ; migration CMS facilitée |
| TR-4 | Toute configuration spécifique à un environnement passe par des variables `PUBLIC_*` injectées au build (numéro WhatsApp, URL du site) | Pas de secret côté client ; un seul build par environnement |
| TR-5 | Node.js 22 LTS, gestionnaire de paquets npm avec lockfile commité | Version présente localement, LTS jusqu'en 2027 |

## 2. Qualité du code

| Réf. | Exigence |
|---|---|
| TR-10 | TypeScript en mode `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| TR-11 | ESLint (TypeScript, Astro, React, jsx-a11y) et Prettier, exécutés en pré-commit et en CI |
| TR-12 | Conventional Commits ; branche `main` protégée ; une branche par feature Spec Kit (`00X-feature`) |
| TR-13 | La logique métier (estimation, message WhatsApp, règles de sélection) est écrite en fonctions pures TypeScript, sans dépendance à React ni au DOM |
| TR-14 | Les types métier sont dérivés des schémas de validation (une seule source de vérité) |
| TR-15 | Aucune dépendance ajoutée sans ADR ou justification dans le plan de la feature |

## 3. Performance

| Réf. | Exigence | Mesure |
|---|---|---|
| TR-20 | JavaScript envoyé au client sur une page de contenu ≤ 50 kB gzip ; sur `/sejour` ≤ 80 kB gzip | Rapport de build + Lighthouse |
| TR-21 | LCP < 2,5 s, CLS < 0,1, INP < 200 ms sur mobile émulé (Moto G, 4G lente) | Lighthouse CI |
| TR-22 | Images en AVIF/WebP avec `srcset`, dimensions explicites, lazy loading hors hero | Build Astro |
| TR-23 | Polices : au plus 2 familles, sous-ensemble latin, `font-display: swap`, préchargées | Audit |
| TR-24 | Cache long sur les assets fingerprintés, cache court sur le HTML | Config hébergeur / nginx |

## 4. Accessibilité

| Réf. | Exigence |
|---|---|
| TR-30 | Conformité WCAG 2.2 niveau AA sur les parcours principaux |
| TR-31 | Navigation clavier complète, focus visible, pièges de focus dans les panneaux modaux, fermeture par Échap |
| TR-32 | Régions `aria-live` pour les toasts et le total |
| TR-33 | Tests automatiques d'accessibilité (axe) dans les tests de composants et E2E |
| TR-34 | Respect de `prefers-reduced-motion` pour toutes les animations |

## 5. SEO

| Réf. | Exigence |
|---|---|
| TR-40 | HTML sémantique (`header`, `nav`, `main`, `article`, `section`, `footer`), un seul `h1` par page |
| TR-41 | Métadonnées par page centralisées dans le layout, générées depuis les données du catalogue pour les fiches |
| TR-42 | `sitemap.xml`, `robots.txt`, canonical, Open Graph, Twitter Card |
| TR-43 | JSON-LD `LocalBusiness` et `Service` / `TouristAttraction` |
| TR-44 | URLs stables en français, en minuscules, sans accents (`/services/chutes-de-la-lobe`) |

## 6. Compatibilité

| Réf. | Exigence |
|---|---|
| TR-50 | Navigateurs : 2 dernières versions de Chrome, Safari, Firefox, Edge ; Safari iOS 16+ ; Chrome Android 3 dernières versions |
| TR-51 | Fonctionnement sans JavaScript pour tout le contenu ; la sélection nécessite JavaScript et l'indique proprement (`<noscript>`) |
| TR-52 | Largeur minimale supportée : 360 px |

## 7. Sécurité et confidentialité

| Réf. | Exigence |
|---|---|
| TR-60 | Aucune donnée personnelle collectée par le site ; la sélection reste sur l'appareil du visiteur |
| TR-61 | En-têtes de sécurité (`Content-Security-Policy` compatible avec le site statique, `X-Content-Type-Options`, `Referrer-Policy`) configurés sur l'hébergeur et dans nginx |
| TR-62 | Liens externes avec `rel="noopener noreferrer"` |
| TR-63 | Dépendances auditées en CI (`npm audit` niveau high) ; mises à jour via Dependabot ou Renovate |

## 8. Observabilité (minimale)

| Réf. | Exigence |
|---|---|
| TR-70 | Pas d'analytics en V1 ; l'architecture prévoit un point d'extension unique (`trackEvent`) appelé sur ajout, suppression et clic WhatsApp, sans implémentation |
| TR-71 | Erreurs de chargement de la sélection persistée journalisées en console en dev uniquement |

## 9. Livraison

| Réf. | Exigence |
|---|---|
| TR-80 | CI sur chaque push : lint, typecheck, tests unitaires, build, tests E2E, audit Lighthouse sur l'aperçu |
| TR-81 | Déploiement automatique de `main` en production ; aperçu par pull request |
| TR-82 | Image Docker construite en CI pour les tags de version, publiée dans le registre GitHub |
| TR-83 | Rollback = redéploiement du commit ou du tag précédent, sans migration à gérer |

## Documents liés

- [architecture.md](./architecture.md)
- [devops.md](./devops.md)
- [testing-strategy.md](./testing-strategy.md)
