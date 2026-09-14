# Design system — structure d'accueil du design Figma

**Statut** : draft · **Date** : 2026-09-13

## 1. Positionnement

Le design final sera produit dans **Figma** : le développeur génère plusieurs propositions responsives avec les outils d'IA de Figma (abonnement premium), les soumet au client, puis affine la direction retenue. Les réponses du bloc G du questionnaire client alimentent ces générations (logo, charte, références, ambiance). Ce document ne définit pas l'apparence du site ; il définit **la structure qui recevra le design** : tokens, composants, variantes, états, accessibilité. Les valeurs indiquées sont des placeholders issus du croquis, toutes marquées `[PLACEHOLDER]`, et seront remplacées par les valeurs Figma.

Règle : **aucune valeur brute dans les composants**. Toute couleur, taille, espacement, rayon ou durée passe par un token.

### Direction reçue du client (réponses G1 à G7, 2026-09-14)

- **Palette** : à explorer autour de la mer, la nature, le soleil, l'expérience touristique. Le bleu marine / vert / blanc du croquis n'est pas une charte ; le noir / blanc / or vu sur certains supports n'est pas officiel non plus.
- **Identité fixe** : le logo TKS® et la signature « Kribi is a feeling ».
- **Style** : simplicité, belles photos, « premium accessible », navigation claire, mobile d'abord, cartes de services modernes, peu de texte.
- **Ambiance** : nature + mer + chaleureuse + moderne + professionnelle. À éviter : froid, administratif, « simple site de transport ».
- **Écrans indispensables** : grande image (ou vidéo si fournie) d'accueil, trois pôles, cartes de services avec photo et prix, « Ajouter à mon séjour », Mon séjour, demande de devis, WhatsApp toujours accessible.
- **Process** : 2 ou 3 propositions Figma distinctes, puis choix d'une direction et affinage. Franck valide seul et veut du temps pour un retour précis.
- **Langues** : site bilingue FR / EN, sélecteur de langue visible dans la navigation.

## 2. Implémentation des tokens

Tailwind CSS v4 lit les tokens depuis des custom properties CSS déclarées dans `src/styles/tokens.css` via `@theme`. Les composants utilisent les classes utilitaires générées (`bg-brand`, `text-fg-muted`, `rounded-card`…). Changer une valeur Figma revient à modifier une ligne de ce fichier.

```css
/* src/styles/tokens.css — extrait */
@theme {
  /* Couleurs sémantiques, pas des noms de teintes */
  --color-brand:          #0B2A4A; /* [PLACEHOLDER] marine du croquis */
  --color-brand-contrast: #FFFFFF;
  --color-accent:         #25D366; /* [PLACEHOLDER] vert WhatsApp, à distinguer d'un accent de marque */
  --color-bg:             #FFFFFF;
  --color-bg-muted:       #F4F6F8;
  --color-fg:             #0F172A;
  --color-fg-muted:       #475569;
  --color-border:         #E2E8F0;
  --color-success / --color-warning / --color-danger / --color-info

  /* Typographie */
  --font-sans:    "Inter", system-ui, sans-serif;      /* [PLACEHOLDER] */
  --font-display: "Inter", system-ui, sans-serif;      /* [PLACEHOLDER] titres */
  --font-script:  "Caveat", cursive;                   /* [PLACEHOLDER] signature « Kribi is a feeling » */
  --text-xs … --text-5xl (échelle 1.25)
  --leading-tight / --leading-normal / --leading-relaxed

  /* Espacement : grille 4 pt */
  --spacing: 0.25rem;  /* Tailwind v4 dérive 1..96 */

  /* Rayons */
  --radius-sm: 0.375rem; --radius-md: 0.75rem; --radius-card: 1rem; --radius-pill: 9999px;

  /* Ombres */
  --shadow-card: …; --shadow-drawer: …;

  /* Breakpoints */
  --breakpoint-sm: 640px; --breakpoint-md: 768px; --breakpoint-lg: 1024px; --breakpoint-xl: 1280px;

  /* Mouvement */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --duration-fast: 120ms; --duration-base: 200ms; --duration-slow: 320ms;
}

/* z-index nommés, hors @theme */
:root {
  --z-nav: 40; --z-drawer: 50; --z-toast: 60; --z-fab: 30;
}
```

Mode sombre : non prévu en V1 (site vitrine, photos claires). Les tokens sémantiques le rendent possible plus tard sans toucher aux composants.

## 3. Catégories de tokens et provenance Figma

| Catégorie | Source Figma | Token |
|---|---|---|
| Couleurs | Variables de couleur (collection « Semantic ») | `--color-*` |
| Typographie | Text styles | `--font-*`, `--text-*`, `--leading-*` |
| Espacement | Variables numériques, auto-layout | grille 4 pt |
| Rayons | Variables numériques | `--radius-*` |
| Ombres | Effect styles | `--shadow-*` |
| Breakpoints | Frames Mobile / Tablet / Desktop | `--breakpoint-*` |
| Mouvement | Prototypage (smart animate) | `--duration-*`, `--ease-*` |

Procédure « Figma → code » : (1) exporter les variables Figma (plugin Variables to CSS ou lecture manuelle), (2) mettre à jour `tokens.css`, (3) vérifier les contrastes AA avec un script (`npm run tokens:check`), (4) revue visuelle des composants dans une page de démonstration interne `/dev/ui` (exclue du build de prod).

## 4. Composants attendus

| Composant | Type | Variantes | États | A11y |
|---|---|---|---|---|
| `Button` | Astro + React (partagé via classes) | `primary`, `secondary`, `ghost`, `whatsapp` ; tailles `sm`, `md`, `lg` ; icône optionnelle | default, hover, focus-visible, active, disabled, loading | `<button>` ou `<a>` selon usage, nom accessible, focus visible ≥ 3:1 |
| `Nav` | Astro | mobile (menu), desktop | ouvert / fermé | `<nav aria-label>`, bouton menu `aria-expanded`, Échap ferme |
| `SelectionBadge` | React | avec / sans compteur | 0 (masqué), n | `aria-label="Mon séjour, 3 prestations"` |
| `Hero` | Astro | accueil (plein), pôle (bandeau) | — | `h1` unique, image avec `alt` ou décorative |
| `PoleCard` | Astro | transport, tourisme, livraison | hover, focus | Carte entièrement cliquable via lien étendu |
| `ServiceCard` | Astro | standard, featured | hover, focus, `on_request` | Lien sur le titre, image `alt`, prix lisible |
| `PriceTag` | Astro + React | `fixed`, `from`, `quote` ; avec / sans unité | — | Texte complet pour lecteurs d'écran |
| `Badge` | Astro | `info`, `warning` (« à confirmer »), `quote` | — | — |
| `CategoryTabs` | Astro + JS minimal ou React | onglets | sélectionné | `role="tablist"` ou liens filtrants avec `aria-current` |
| `Gallery` | Astro | 1 image, N images | — | Miniatures = boutons, image principale `alt` |
| `QuantityStepper` | React | `units`, `persons` | min atteint, max atteint, disabled | Groupe avec label, boutons « Diminuer » / « Augmenter », `inputmode="numeric"` |
| `AddToStay` | React | fiche, carte (V1 optionnel) | idle, ajouté (feedback) | Annonce via `aria-live` |
| `SelectionLine` | React | avec prix, sur devis | édition quantité, suppression | Bouton supprimer nommé « Retirer <titre> » |
| `EstimateSummary` | React | estimatif, indicatif, sur devis uniquement, vide | — | `aria-live="polite"` sur le total |
| `SelectionDrawer` | React | desktop | ouvert / fermé | `role="dialog"`, `aria-modal`, piège de focus, Échap |
| `Toast` / `Toaster` | React | success, info, warning ; avec action « Annuler » | visible, disparition | `role="status"`, pas de focus volé |
| `WhatsAppButton` | Astro | nav, flottant, inline, CTA principal | — | `aria-label="Contacter TKS sur WhatsApp"` |
| `LanguageSwitcher` | Astro | nav desktop, menu mobile | langue courante | Liens « Français » / « English » avec `lang`, `hreflang` et `aria-current` sur la langue active |
| `Section` | Astro | default, muted, brand | — | `<section aria-labelledby>` |
| `Footer` | Astro | — | — | `<footer>`, liens groupés |
| `EmptyState` | React | séjour vide | — | — |

## 5. Règles d'accessibilité transverses

- Contraste texte ≥ 4.5:1, éléments d'interface ≥ 3:1 (vérifié sur les tokens).
- Cibles tactiles ≥ 44 × 44 px sur mobile.
- Prévoir environ 30 % de longueur de texte en plus : aucun libellé ne doit casser la mise en page, ni en français ni en anglais.
- Focus visible partout, jamais supprimé sans remplacement.
- `prefers-reduced-motion` : toutes les transitions passent à 0 ms.
- Aucune information portée uniquement par la couleur (badge « sur devis » a un texte).
- Images de contenu avec `alt` descriptif fourni dans les données ; images décoratives avec `alt=""`.

## 6. Responsive

Mobile-first. Trois paliers de mise en page : `< md` (1 colonne, nav en menu, CTA sticky bas), `md` à `< lg` (2 colonnes de cartes), `≥ lg` (3 colonnes, drawer latéral, nav complète). Le contenu principal est limité à 1 200 px de large avec gouttière 16 px minimum.

## 7. Ce que le design Figma devra fournir

- Les écrans : Accueil, page pôle (avec onglets), fiche, Mon séjour (vide, plein, sur devis), Contact, 404, en mobile et desktop. Au moins l'accueil et une fiche aussi en anglais.
- Le sélecteur de langue FR / EN, dans la navigation mobile et desktop.
- Les composants ci-dessus avec leurs variantes et états.
- Les variables (couleurs, typo, espacement, rayons) nommées de façon sémantique.
- Le logo en SVG et une image de hero libre de droits.

## Documents liés

- [architecture.md](./architecture.md)
- [technical-decisions.md](./technical-decisions.md) (ADR-003)
