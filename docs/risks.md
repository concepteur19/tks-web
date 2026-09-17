# Risques

**Statut** : draft · **Date** : 2026-09-13

Impact et probabilité : Faible / Moyen / Élevé.

| # | Risque | Impact | Probabilité | Mitigation |
|---|---|---|---|---|
| R1 | **Prix non fournis ou instables** : le client ne sait pas fixer ses tarifs, ou les change souvent | Élevé (le total estimatif est le cœur du produit) | Élevé | Trois modes de prix dont « sur devis » ; le site fonctionne avec 100 % de sur devis ; catalogue en fichiers modifiables en minutes ; question C1/C2 marquée bloquante |
| R2 | **Numéro WhatsApp changé** après mise en ligne | Élevé | Faible | Numéro reçu (+237 697 13 53 88, E1) ; variable de build unique ; redéploiement en 3 minutes |
| R3 | **Contenu manquant** (photos, textes, logo) retardant la mise en ligne | Élevé | Élevé | Placeholders clairement marqués ; livraison technique possible avant le contenu final ; suivi élément par élément dans `content-tracker.md` au fil des envois de Franck |
| R4 | **Design Figma en retard** ou livré sans variables | Moyen | Moyen | Design system structurel prêt ; développement avec tokens placeholders ; procédure Figma → tokens documentée |
| R5 | **Dépendance à WhatsApp** : message trop long, application absente, changement du format `wa.me` | Moyen | Faible | Troncature contrôlée ; repli sur WhatsApp Web ; page Contact avec numéro cliquable ; test manuel à chaque release |
| R6 | **Attente d'un backoffice dès la V1** par le client (P1 dans le CDC) | Moyen | Moyen | Expliquer dès le kick-off le compromis fichiers → CMS V3 ; montrer la rapidité d'un changement de prix |
| R7 | **Scope creep** : packs, hébergements, formulaires détaillés, vidéo d'accueil demandés en cours de route (le client cite packs et vidéo parmi ses indispensables, G4) | Moyen | Élevé | Tableau de scope validé ; V2 confirmée par le client pour packs et hébergements (B5, B6) ; toute demande passe par une nouvelle spec |
| R8 | **localStorage bloqué** (navigation privée, iOS Safari en mode restreint) | Faible | Faible | Mode mémoire dégradé, bandeau d'information |
| R9 | **Performance des images** : photos lourdes fournies par le client | Moyen | Élevé | Optimisation au build (AVIF/WebP, tailles), budgets Lighthouse en CI |
| R10 | **Hébergement et domaine non décidés** à la livraison | Moyen | Moyen | adresse `workers.dev` disponible immédiatement ; domaine branché plus tard sans reconstruction |
| R11 | **Maintenance du catalogue par le développeur** en V1 : goulot d'étranglement | Moyen | Moyen | Format JSON simple et documenté ; PR de contenu ; migration CMS git-based en V3 |
| R12 | **Complexité DevOps** qui déborde sur le produit | Moyen | Moyen | Kubernetes isolé dans `k8s/` et une spec dédiée (007), hors chemin de prod ; time-box des exercices |
| R13 | **Deux syntaxes (Astro + React)** ralentissent le développement | Faible | Moyen | Règle simple : contenu = Astro, interaction = React ; îlots peu nombreux et listés |
| R14 | **SEO local faible** faute de contenu et de domaine | Moyen | Moyen | JSON-LD LocalBusiness, une URL par service, textes orientés « Kribi » ; Google Business Profile recommandé au client |
| R15 | **Faux avis / prix trompeurs** si les placeholders restent en prod | Élevé | Faible | Vérification pré-release : aucun `[PLACEHOLDER]` dans le build (test automatisé sur `dist/`) |
| R16 | **Coût client mal cadré** (le CDC demande coût et calendrier) | Moyen | Moyen | Le tableau de scope et la roadmap servent de base au chiffrage ; hors périmètre de ce document |
| R17 | **Traduction anglaise en retard ou de qualité inégale** | Moyen | Moyen | Repli sur le français en aperçu, build de production bloqué si un texte manque, relecture par Zobel avant chaque release, statut EN suivi dans `content-tracker.md` |
| R19 | **Quantités à deux dimensions** plus complexes à concevoir et à tester que prévu | Moyen | Moyen | Deux dimensions au maximum, dont une seule durée ; cohérence unité / dimensions vérifiée au build ; tests dédiés sur le calcul et la fusion |
| R18 | **Contenu doublé à maintenir** : chaque changement de texte doit être fait dans les deux langues | Moyen | Élevé | Un seul fichier par service avec les champs `{ fr, en }` côte à côte ; commit de contenu toujours bilingue ; contrôle au build |

## Suivi

Ce tableau est revu au début de chaque feature Spec Kit. Un risque matérialisé devient une entrée dans le `research.md` de la feature concernée.
