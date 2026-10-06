# Contrat — page Expériences et fiche

**Feature**: 003-experience-catalog · S'appuie sur le contrat de coque [002/contracts/shell.md](../../002-kibreeze-core/contracts/shell.md).

## Page Expériences

| Élément | Comportement |
|---|---|
| Bandeau | photo des chutes, voile sombre, `h1` « Expériences », phrase « Vivez Kribi autrement » |
| Onglets | `nav` nommée, liens `#<categorie>` et « Toutes » (sans ancre), collants sous l'en-tête (`top: var(--size-header)`), défilement horizontal sur téléphone ; actif = soulignement rouge épais, `aria-current="true"` posé par le script d'amélioration |
| Filtre | CSS `:has(#<categorie>:target)` masque les cartes des autres catégories ; sans `:has()` ni JavaScript, toutes les cartes restent visibles |
| Annonce | région `aria-live="polite"` : « 4 expériences — Aventure » à chaque changement d'ancre (script) |
| Cartes | `data-category`, photo, nom, description courte, `Price`, badges capacité / « Disponibilité à confirmer », lien « Voir les détails » ; une colonne sur téléphone, trois à partir de `lg` |
| Fin de page | bloc « Une envie particulière ? » + bouton WhatsApp générique ; bouton flottant actif |

## Fiche

| Élément | Comportement |
|---|---|
| Layout | `BaseLayout` avec `routeKey="experiences"`, `floatingWhatsApp={false}`, `jsonLd=[buildExperienceJsonLd(...)]`, `ogImage` = première photo |
| Fil d'Ariane | `nav` « Fil d'Ariane », liens vers la liste et la liste filtrée, page courante en `aria-current="page"` |
| Galerie | bande `scroll-snap`, compteur « k / N », vignettes = liens `#photo-k` ; photo 1 en `loading="eager"` |
| Colonnes | une colonne sur téléphone ; à partir de `lg`, galerie et contenu à gauche, carte de demande collante à droite |
| Barre fixe | sous `lg` : `fixed`, `bottom: var(--size-tabbar)`, hauteur `--size-sticky-cta`, `z-index: var(--z-sticky-cta)` ; `main` réserve tabbar + barre en marge basse |
| Demande | lien `wa.me` + `buildServiceRequestMessage`, `target="_blank"`, `rel="noopener noreferrer"`, libellé « Demander ce service » |
| Options | liste de lignes « nom — prix » sans case à cocher, phrase « À demander avec l'expérience » |
| Interdits avant 004 | aucun « Ajouter à mon séjour », aucun total, aucun sélecteur de quantité |
