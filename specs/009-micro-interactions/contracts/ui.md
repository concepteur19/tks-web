# Contrat — interface

Décisions : [research.md](../research.md). Valeurs : [data-model.md](../data-model.md). Toute durée et toute distance passent par les tokens (principe VI) ; toute animation de mouvement disparaît sous `prefers-reduced-motion: reduce`.

## Catalogue des micro-interactions

| # | Moment | Élément | Effet | Durée | Mécanisme |
|---|---|---|---|---|---|
| 1 | Changement de page | page entière | fondu enchaîné | base | `@view-transition` |
| 2 | Carte → fiche | photo d'une carte d'expérience (univers, accueil, suggestions) → photo principale | glissement et mise à l'échelle | base | `view-transition-name: exp-<id>` |
| 3 | Changement de page | trait de l'onglet / de l'entrée active | glissement | base | `view-transition-name: tab-indicator`, `nav-indicator` |
| 4 | Défilement | sections et cartes `[data-reveal]` sous le premier écran | fondu + montée de `--distance-reveal`, cascade ≤ 4 vagues | slow + stagger | `src/scripts/reveal.ts` |
| 5 | Image chargée | images hors image prioritaire | fondu sur `bg-muted` | slow | `data-fade-pending` |
| 6 | Survol (souris) | cartes | montée 2 px, ombre ; photo `scale(1.03)` | base | utilitaires `lift`, `media-zoom` |
| 7 | Survol (souris) | boutons | teinte plus foncée | base | `press` |
| 8 | Survol (souris) | liens de texte | soulignement qui se déploie | base | `link-slide` |
| 9 | Appui | boutons / cartes | `scale(0.97)` / `scale(0.98)` | fast | `press`, `lift` |
| 10 | Ajout au séjour | bouton d'ajout | « Ajouté ✓ » 1,5 s | — | `QuickAdd`, `LineCustomizer`, `RequestBar` |
| 11 | Ajout au séjour | compteur Mon séjour | rebond 1 → 1,2 → 1, une fois | slow | `StayBadge`, keyframes `bump` |
| 12 | Ajout au séjour | notification | entrée par le bas ; sortie en fondu | slow / base | `Toasts` |
| 13 | Ajout au séjour | téléphone Android | vibration 15 ms | — | `Toasts` |
| 14 | + / − | chiffre du sélecteur | entre par le haut ou le bas | fast | `QuantityStepper`, keyframes `roll-up`, `roll-down` |
| 15 | Retrait | ligne de Mon séjour | repli de hauteur + fondu | base | `StayPage`, état `leaving` |
| 16 | Lien vers une ancre | page | défilement doux | navigateur | `scroll-behavior: smooth` |
| 17 | Tuto | cible signalée | anneau d'accent : deux pulsations puis fixe (outline) | 2 × slow | `FirstVisitGuide` |
| 18 | Tuto | bulle | entrée en fondu + montée | slow | `FirstVisitGuide` |

Non animés : l'image prioritaire et le texte du premier écran, le contenu sans JavaScript, toute mise en page (aucune animation de `width`, `height`, `top`… hors repli de ligne via `grid-template-rows`).

## Mini tuto (`FirstVisitGuide`, `client:only="preact"`, dans `BaseLayout`)

- Apparaît au plus 1,5 s après le chargement, si `shouldShowGuide` le permet.
- Téléphone : bulle pleine largeur moins les marges, **au-dessus de la barre à onglets** ; ordinateur : 22 rem de large, en haut à droite sous l'en-tête.
- Contenu : « Étape n sur 3 », titre, phrase ; boutons « Passer » (secondaire) et « Suivant » (principal), qui devient « C'est parti » à l'étape 3. `data-testid="guide"`.
- `role="dialog"`, `aria-modal="false"`, `aria-labelledby` vers le titre ; le focus reste où il est ; Échap ferme (= « Passer »).
- Pas de voile, page utilisable pendant l'affichage. Pendant qu'une notification est visible, la bulle s'efface et revient ensuite.
- La cible de l'étape, choisie par `guideTarget` (étape 1 : `explore` ; étape 2 : `add` visible, sinon `stay` ; étape 3 : `send`, sinon `stay`), reçoit l'attribut `data-guide-active`, qui dessine l'anneau : deux pulsations, puis anneau fixe.

## « Comment ça marche » (`HowItWorks.astro`)

Accueil, après `data-section="categories"`, avant `data-section="featured"` : `data-section="how-it-works"`. Titre `home.how.title` ; trois étapes (icône, `home.how.<n>.title`, `home.how.<n>.text`), en colonne sur téléphone, en ligne à partir de `lg` ; bouton `home.how.cta` vers `getRoutePath('experiences')`. Les étapes portent `data-reveal` (cascade).

## Partager (`ShareButton`, `client:only="preact"`, dans `ExperienceDetail.astro`)

Bouton secondaire avec icône, libellé `share.label`, `aria-label` « Partager : <titre> ». Ordre : partage natif ; sinon copie du lien et notification `share.copied` ; sinon lien WhatsApp `https://wa.me/?text=`. Absent sans JavaScript. `data-testid="share"`.

## Marquage à poser dans les composants existants

| Composant | Ajout |
|---|---|
| `BaseLayout.astro` | script `reveal`, îlot `FirstVisitGuide`, `view-transition-name` de l'en-tête et de la barre à onglets |
| `Header.astro`, `TabBar.astro` | trait d'état actif nommé ; `data-guide="explore"` sur la navigation, `data-guide="stay"` sur Mon séjour |
| `QuickAdd`, `LineCustomizer`, `RequestBar` | `data-guide="add"` sur le bouton d'ajout |
| `StayPage` | `data-guide="send"` sur le bouton WhatsApp |
| `ExperienceCard.astro`, `FeaturedCarousel.astro`, `CompactCard.astro`, `ExperienceDetail.astro` (photo principale) | `view-transition-name: exp-<id>` ; `lift` / `media-zoom` sur les cartes |
| `UniverseCard`, `CompactCard`, aperçus de l'accueil, `AccommodationPage`, `TourCard`, `PackageCard`, `MobilityPage` | `lift`, `media-zoom`, `data-reveal` / `data-reveal-group` |
| Boutons (`QuickAdd`, `LineCustomizer`, `RequestBar`, liens WhatsApp, appels à l'action) | `press` |
| `Footer.astro`, liens de texte | `link-slide` |
| `HomePage.astro` | `HowItWorks` entre les univers et les mises en avant |
