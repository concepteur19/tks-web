# Contrat — îlots et page Mon séjour

**Feature**: 004-stay-and-estimate · Coque : [002/contracts/shell.md](../../002-kibreeze-core/contracts/shell.md) · Fiche : [003/contracts/ui.md](../../003-experience-catalog/contracts/ui.md).

## Îlots (Preact)

| Îlot | Props | Directive | Repli sans JavaScript |
|---|---|---|---|
| `StayBadge` | `locale`, `variant: 'tab' \| 'header'` | `client:idle` | rien (espace réservé, aucun décalage) |
| `ExperienceConfigurator` | `service: IslandService`, `options: IslandService[]`, `locale`, `pageUrl`, `whatsappNumber`, `eurToXaf`, `strings` | `client:load` | lien statique « Demander ce service » de la 003 |
| `QuickAdd` | `service: IslandService`, `locale`, `strings` | `client:visible` | rien (la carte reste un lien vers la fiche) |
| `StayPage` | `catalog: IslandService[]`, `locale`, `whatsappNumber`, `eurToXaf`, `strings`, `emptyImage` | `client:load` | `<noscript>` : explication + bouton WhatsApp générique |
| `Toasts` | `locale`, `strings` | `client:idle` | rien |

`strings` : sous-ensemble des dictionnaires de la langue de la page, passé en props ; aucun texte en dur dans un `.tsx` (règle ESLint de 001).

## Fiche

- Rubrique « Votre réservation » sous le bloc prix : un sélecteur par dimension (− / valeur / +, 44 px, valeur éditable au clavier), choix du tarif en boutons radio, cases à cocher des options (encadré « Complétez votre expérience »).
- Barre fixe (téléphone) et carte collante (ordinateur) : total de la configuration et son équivalent en euros, bouton « Ajouter à mon séjour » (ou « Déjà dans mon séjour » pour une ligne non duplicable), lien « Demander ce service » (intention `single`).

## Page `/sejour` (`/en/my-trip`)

| Zone | Contenu |
|---|---|
| En-tête | `h1` « Mon séjour », « N prestations sélectionnées », lien « Vider » avec confirmation (`dialog` natif) |
| Champs | « Dates du séjour » (texte), « Voyageurs » (nombre) ; rappel turquoise si vides et qu'il y a des lignes |
| Lignes | vignette, nom, quantités en toutes lettres, tarif, options, prix ou badge sur devis, sélecteur compact, suppression |
| Total | « Total estimatif » ou « Total indicatif », montant, euro, « + N prestations sur devis », mention ; ou « Total : sur devis (N prestations) » |
| Actions | barre fixe sur téléphone : « Demander un devis par WhatsApp » (vert) + « Continuer mes recherches » ; panneau collant à droite sur ordinateur |
| Vide | photo de Kribi, « Votre séjour est vide », phrase, bouton « Découvrir les expériences », bouton flottant WhatsApp, pas de barre fixe |

`BaseLayout` : `floatingWhatsApp` vrai seulement quand la sélection est vide (piloté par l'îlot via un attribut sur `body`, le bouton flottant étant masqué en CSS sinon).
