# Research — 009 Micro-interactions et mini tuto

**Feature**: [spec.md](./spec.md) · **Date**: 2026-10-18

Le site est statique (Astro 5.18, une page HTML par adresse) avec des îlots Preact. Le design system fournit déjà trois durées (`--duration-fast` 120 ms, `--duration-base` 200 ms, `--duration-slow` 320 ms) et une courbe (`--ease-standard`) ; `global.css` ramène déjà toute transition à ~0 ms sous `prefers-reduced-motion: reduce`. Le principe directeur : **le navigateur et le CSS d'abord, le JavaScript seulement pour ce qui dépend d'un état** (tuto, ajout au séjour, partage). Aucune dépendance ajoutée.

---

## 1. Transitions entre pages : View Transitions entre documents

**Decision**: règle CSS `@view-transition { navigation: auto; }` dans `global.css`, sous `@media (prefers-reduced-motion: no-preference)`. Fondu enchaîné par défaut (`::view-transition-old/new(root)`, `--duration-base`). Éléments stables nommés pour ne pas clignoter : en-tête (`site-header`), barre à onglets (`tab-bar`). Photo partagée : la photo d'une `ExperienceCard` et la photo principale de sa fiche portent le même `view-transition-name: exp-<id>`, si bien que le navigateur la fait glisser d'une page à l'autre.

**Rationale**: zéro JavaScript, zéro changement de navigation : un navigateur qui ne connaît pas la règle (Firefox aujourd'hui) navigue exactement comme avant. Pris en charge par Chrome et Edge 126+, Safari 18.2+ (iPhone compris).

**Alternatives considered**: `<ClientRouter />` d'Astro (rejeté : transforme le site en application à navigation simulée, réhydratation des îlots, scripts à réécrire, risque sur la persistance du séjour ; trop pour un fondu) ; aucune transition (rejeté : demande explicite).

**Contrainte**: un nom de transition doit être unique dans une page, sinon le navigateur abandonne la transition. Une même expérience n'apparaît qu'une fois par page (univers, mises en avant, « Vous aimerez aussi ») ; un test de bout en bout le vérifie sur toutes les pages livrées.

## 2. Indicateur d'onglet qui glisse

**Decision**: un trait de 2 px en couleur de marque au-dessus de l'onglet actif (barre à onglets) et sous l'entrée active du menu ordinateur, nommé `tab-indicator` / `nav-indicator`. La transition entre pages le fait glisser d'un onglet à l'autre.

**Rationale**: la glissade naît de la transition du § 1, sans script. Le trait ajoute aussi un repère d'état plus net que la seule graisse du texte.

## 3. Préchargement

**Decision**: `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }` dans `astro.config.mjs` ; stratégie `hover` sur les liens des grilles longues (univers, 10 à 12 cartes) pour ne pas tout charger d'un coup.

**Rationale**: fonction intégrée d'Astro (≈ 1,5 kB) ; elle ignore les liens externes (WhatsApp) et ne précharge rien quand l'appareil signale l'économie de données ou une connexion lente (FR-015). Les pages font 20 à 60 kB de HTML : précharger les liens visibles coûte peu.

## 4. Apparition au défilement et fondu des images

**Decision**: un petit script de page (`src/scripts/reveal.ts`, chargé par `BaseLayout`, ≈ 0,7 kB) :

- au chargement, il repère les éléments `[data-reveal]` **situés sous le premier écran** et leur pose `data-reveal-pending` ; un `IntersectionObserver` le retire quand l'élément entre à l'écran ;
- dans une grille (`[data-reveal-group]`), il donne à chaque enfant une variable `--reveal-index` (de 0 à 3, les suivants restant à 3), qui décale l'apparition de `--duration-stagger` × index ;
- il pose `data-fade-pending` sur les images non encore chargées, sauf l'image prioritaire du premier écran (`fetchpriority="high"`), et le retire à l'événement `load`.

CSS : seuls les éléments `*-pending` sont masqués (opacité 0, décalage de `--distance-reveal`) ; la transition vers l'état normal utilise `--duration-slow` et `--ease-standard`.

**Rationale**: rien n'est masqué tant que le script n'a pas tourné : sans JavaScript, ou si le script échoue, tout reste visible (FR-018). Le premier écran n'est jamais touché, donc ni le LCP ni la note de performance ne bougent (FR-006, FR-007). Une transformation et une opacité ne décalent pas la mise en page.

**Alternatives considered**: animations pilotées par le défilement en CSS (`animation-timeline: view()`) (rejeté : pas encore fiables sur Safari iPhone) ; masquer en CSS puis révéler en JS (rejeté : contenu invisible si le script ne s'exécute pas).

**Tokens ajoutés** (`tokens.css`) : `--duration-stagger: 60ms`, `--distance-reveal: 0.75rem`. Une cascade complète dure au plus 3 × 60 + 320 = 500 ms (SC-006).

## 5. Survol et appui

**Decision**: trois utilitaires Tailwind v4 déclarés dans `global.css` (`@utility`), appliqués aux composants existants :

| Utilitaire | Effet | Où |
|---|---|---|
| `lift` | survol : montée de 2 px et ombre plus marquée ; appui : `scale(0.98)` | toutes les cartes (expérience, univers, aperçus de l'accueil, types d'hébergement, parcours, formules, véhicules) |
| `media-zoom` | survol de la carte parente : la photo passe à `scale(1.03)` dans son cadre | photo des cartes |
| `press` | appui : `scale(0.97)` ; survol : teinte plus foncée | boutons et liens-boutons |
| `link-slide` | survol : soulignement qui se déploie de gauche à droite | liens de texte (pied de page, liens dans le contenu) |

**Rationale**: en Tailwind v4, la variante `hover:` ne s'applique que sur les appareils qui survolent vraiment (`@media (hover: hover)`) : aucun effet « collé » sur écran tactile (FR-008). Un utilitaire par intention évite de répéter cinq classes sur trente composants.

## 6. Ajout au séjour : bouton, compteur, notification, vibration

**Decision**:

- **Bouton** : `QuickAdd`, `LineCustomizer` et le bouton de la barre d'action des fiches affichent « Ajouté ✓ » pendant 1,5 s après un ajout réussi (constante `ADDED_FLASH_MS`), puis reviennent à leur libellé ou passent à « Déjà dans mon séjour » ;
- **Compteur** : `StayBadge` compare le nombre de lignes au rendu précédent et, s'il augmente, joue une fois l'animation `bump` (échelle 1 → 1,2 → 1, `--duration-slow`) ;
- **Notification** : `Toasts` entre en glissant depuis le bas et sort en fondu (état `leaving` le temps de `--duration-base`) ;
- **Vibration** : `Toasts`, présent une seule fois par page, appelle `navigator.vibrate?.(15)` sur un événement `added` ou `merged` de `$lastEvent`.

**Rationale**: `$lastEvent` existe déjà et signale chaque ajout ; brancher la vibration dans l'unique îlot de notifications garantit une seule vibration (le compteur, lui, existe en deux exemplaires : barre à onglets et en-tête). `navigator.vibrate` n'existe pas sur iPhone : l'appel optionnel ne fait rien.

## 7. Sélecteurs, retrait d'une ligne, défilement vers une ancre

**Decision**:

- `QuantityStepper` : le champ numérique est enveloppé dans un cadre `overflow-hidden` ; à chaque changement, une clé d'animation `roll-up` ou `roll-down` fait entrer le chiffre par le haut ou le bas (`--duration-fast`) ;
- `StayPage` : une ligne retirée passe à l'état `leaving` (hauteur repliée par `grid-template-rows: 0fr`, opacité 0, `--duration-base`), puis est réellement retirée ; sous « réduire les animations », le retrait est immédiat ;
- `html { scroll-behavior: smooth }` sous `prefers-reduced-motion: no-preference`.

**Rationale**: le repli de ligne demande d'attendre la fin de l'animation avant de modifier la sélection ; ce délai est purement visuel et ne touche pas `removeLine`.

## 8. Mini tuto : un îlot et une logique pure

**Decision**:

- logique dans `src/features/guide/guide.ts`, fonctions pures couvertes à 100 % : `shouldShowGuide({ status, itemCount })`, `nextGuideState(state, event)` (événements `next`, `skip`, `added`, `finish`), `GUIDE_STEPS` (identifiant, cible téléphone, cible ordinateur, clés de texte) ;
- îlot `FirstVisitGuide.tsx`, `client:only="preact"` dans `BaseLayout` (aucun HTML sans JavaScript, FR-018), affiché après le premier moment d'inactivité du navigateur, au plus 1,5 s après le chargement ;
- mémoire : `localStorage['kibreeze.guide.v1'] = "done"` ; si le stockage est indisponible, `sessionStorage`, et à défaut une variable de page (au plus une fois par visite) ;
- cibles signalées par `data-guide="explore" | "stay"` dans `TabBar` et `Header` : un anneau en couleur d'accent pulse autour de la cible (`outline`, aucun déplacement du contenu) ; l'étape 3 signale l'onglet Mon séjour, où se trouve le bouton WhatsApp ;
- position : bulle fixe au-dessus de la barre à onglets (`bottom: calc(var(--size-tabbar) + …)`), en haut à droite sous l'en-tête sur ordinateur ;
- accessibilité : `role="dialog"`, `aria-modal="false"`, titre relié, focus **non** déplacé à l'ouverture, Échap ferme ;
- passage à l'étape 3 sur un événement `added` ou `merged` de `$lastEvent` ; pendant qu'une notification est visible, la bulle s'efface puis revient (pas de chevauchement).

**Rationale**: la règle « quand montrer, quand passer d'étape » est testable sans navigateur ; l'îlot ne fait qu'afficher. `client:only` évite d'envoyer la bulle aux visiteurs déjà guidés dans le HTML de chaque page.

**Conséquence sur les tests existants** : chaque test de bout en bout ouvre un navigateur vierge, donc verrait la bulle. La configuration Playwright charge un état de stockage où le tuto est déjà vu (`tests/e2e/guide-done.json`) ; seuls les tests du tuto partent d'un stockage vide.

## 9. « Comment ça marche »

**Decision**: composant `src/components/home/HowItWorks.astro`, **après les univers du Tourisme et avant les expériences mises en avant**, `data-section="how-it-works"`. Trois étapes en ligne sur ordinateur, en colonne sur téléphone : icône, titre, phrase ; bouton vers le Tourisme. Textes dans les dictionnaires (`home.how.*`), comme le bandeau Mobilité.

**Rationale** (emplacement laissé à Claude par Zobel) : juste sous le hero, la section repousserait l'offre, qui est ce que le visiteur vient voir ; tout en bas, elle arriverait après la décision. Entre les univers (ce que l'on peut faire) et les mises en avant (les premières choses à ajouter), elle répond à « comment ça marche ? » au moment où la question se pose, et le tuto l'a déjà dit à la première visite.

## 10. Partager

**Decision**: îlot `ShareButton.tsx` (`client:only="preact"`) sur `ExperienceDetail.astro`, à côté du titre. Ordre : `navigator.share({ title, url })` ; sinon `navigator.clipboard.writeText(url)` et notification « Lien copié » ; sinon ouverture de `https://wa.me/?text=<titre> <lien>`. Un partage annulé par le visiteur n'affiche rien.

La notification « Lien copié » passe par un second atome, `$notice` (`src/features/feedback/notice.ts`), lu par `Toasts` à côté de `$lastEvent` : le type `SelectionEvent`, qui appartient à la sélection, ne change pas.

## 11. Réduire les animations

**Decision**: chaque animation de mouvement est déclarée sous `@media (prefers-reduced-motion: no-preference)` ou neutralisée par la règle globale existante ; le script d'apparition ne pose aucun `*-pending` quand la préférence est active ; le repli de ligne est immédiat. La vibration reste (FR-013) : ce n'est pas un mouvement à l'écran.

## 12. Ce qui ne change pas

Sélection, estimation, message WhatsApp : leurs fonctions pures ne bougent pas. Aucun écran de chargement. Aucune dépendance. Contenu des pages identique sans JavaScript.
