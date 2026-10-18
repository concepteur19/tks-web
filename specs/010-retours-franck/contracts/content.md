# Contrat — contenu, chaînes, redirections

Valeurs : [data-model.md](../data-model.md).

## Schéma

```text
image.focus      "X% Y%"   facultatif, 0 à 100 %
image.upcoming   boolean   facultatif, incompatible avec illustrative (« upcoming et illustrative s'excluent »)
```

## Fonctions pures

| Fonction | Fichier | Couverture |
|---|---|---|
| `defaultLine(service, travelers?)` | `src/features/selection/selection.ts` | 100 % |
| `applyStay`, `parseSelection` (dates) | idem | 100 % |
| `formatStayDates(stay, locale)` | `src/features/whatsapp/formatStayDates.ts` | 100 % |
| `buildTourRequestMessage({ title, persons, url, locale })` | `src/features/whatsapp/buildTourRequestMessage.ts` | 100 % |

## Chaînes ajoutées (FR / EN)

| Clé | FR | EN |
|---|---|---|
| `experiences.upcoming` | Photo à venir | Photo coming soon |
| `stay.arrival` | Arrivée | Arrival |
| `stay.departure` | Départ | Departure |
| `stay.personsForActivity` | Personnes pour cette activité | People for this activity |
| `message.datesRange` | du {from} au {to} | {from} to {to} |
| `message.datesFrom` | à partir du {from} | from {from} |
| `packages.tours.indicative` | Prix indicatif, sous réserve de disponibilité et de confirmation par KIBREEZE. | Indicative price, subject to availability and confirmation by KIBREEZE. |
| `packages.tours.finalPrice` | Le prix final dépend du nombre de participants, de la date, du transport, des options choisies et des conditions de réalisation. | The final price depends on the number of participants, the date, transport, the options chosen and the conditions on the day. |
| `packages.tours.duration` | Durée | Duration |
| `packages.tours.steps` | Les étapes | The stops |
| `packages.tours.open` | Voir le parcours | See the tour |
| `packages.customiseMessage` | Bonjour Kibreeze, je souhaite personnaliser le parcours « {title} » pour {persons} personnes. {url} | Hello Kibreeze, I would like to customise the “{title}” tour for {persons} people. {url} |
| `home.hero.pause` | Mettre le diaporama en pause | Pause the slideshow |
| `home.hero.play` | Relancer le diaporama | Play the slideshow |
| `home.mobility.text` (inchangé), `home.mobility.cta` | Voir la mobilité | See mobility |
| `lightbox.close` | Fermer | Close |
| `lightbox.open` | Voir la photo en grand | View the photo full size |

`packages.customise` devient « Personnaliser ce parcours » pour le lien WhatsApp ; le bouton d'ajout utilise `stay.add`.

## Redirections (`public/_redirects`)

```text
/experiences/pique-nique-bivouac       /experiences/pique-nique-en-bord-de-mer       301
/en/experiences/pique-nique-bivouac    /en/experiences/pique-nique-en-bord-de-mer    301
```

## Confidentialité

Le séjour enregistré (`kibreeze.selection.v1`) gagne l'arrivée et le départ : la ligne de la politique de confidentialité mentionne déjà « dates et nombre de voyageurs », rien à changer.
