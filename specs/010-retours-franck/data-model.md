# Data Model — 010 Retours de Franck

**Feature**: [spec.md](./spec.md) · Décisions : [research.md](./research.md)

## Image de prestation : ajouts

| Champ | Type | Règle |
|---|---|---|
| `focus` | `"X% Y%"` | facultatif ; deux pourcentages de 0 à 100 ; point gardé visible au recadrage |
| `upcoming` | `boolean` | facultatif ; étiquette « Photo à venir » ; incompatible avec `illustrative` |

## Plats (`categoryId: specialites-culinaires`)

Dimension (les 11) :

```json
{ "kind": "units", "label": { "fr": "plats", "en": "dishes" }, "labelOne": { "fr": "plat", "en": "dish" }, "min": 1, "max": 30, "default": 1 }
```

Textes : descriptions de Franck du 2026-10-18 (`shortDescription` = première phrase ou accroche ≤ 160 caractères ; `description` = texte complet).

| Identifiant | Titre FR | Nouveauté |
|---|---|---|
| `ebanjea` | Ebanjea, spécialité batanga | nouveau ; `quote` ; image côte + `upcoming` |
| `maban` | Maban, poisson pimenté | image générée remplacée par la côte + `upcoming` |

## Pique-nique

| Avant | Après |
|---|---|
| `pique-nique-bivouac`, « Pique-nique et bivouac en bord de mer » | `pique-nique-en-bord-de-mer`, « Pique-nique en bord de mer » / « Beach picnic » ; 301 FR et EN ; `focus` sur la photo |

## Séjour (`Stay`)

```ts
type Stay = {
  dates?: string;      // texte libre, séjours enregistrés avant la 010 (lu, jamais écrit par les nouveaux champs)
  arrival?: string;    // AAAA-MM-JJ
  departure?: string;  // AAAA-MM-JJ, ≥ arrival
  travelers?: number;  // 1 à 50 (inchangé)
};
```

| Règle | Fonction pure |
|---|---|
| Une ligne nouvelle part de `travelers` pour sa dimension `persons`, borné par `min`/`max` | `defaultLine(service, travelers?)` |
| Dates au format `AAAA-MM-JJ` seulement ; départ antérieur à l'arrivée effacé | `applyStay`, `parseSelection` |
| Dates écrites pour le message | `formatStayDates(stay, locale)` |

Exemples de `formatStayDates` (FR / EN) : 12 → 16 déc. 2026 : « du 12 au 16 décembre 2026 » / « 12 to 16 December 2026 » ; 28 déc. → 3 janv. : « du 28 décembre 2026 au 3 janvier 2027 » / « 28 December 2026 to 3 January 2027 » ; arrivée seule : « à partir du 12 décembre 2026 » / « from 12 December 2026 » ; ancien texte : tel quel.

## Parcours

| Identifiant | `duration` FR / EN | Précision d'étape |
|---|---|---|
| `essentiel-de-kribi` | Une journée / One day | étape Mayi détaillée |
| `nature-et-littoral` | Une journée / One day | « Fleuve Lobé (inclus dans l'expérience Bagyeli) » |
| `culture-et-patrimoine` | Une demi-journée / Half a day | étape Mayi détaillée |
| `kribi-et-ebodje` | Une journée complète / A full day | — |
| `kribi-authentique` | Une demi-journée ou une journée complète, selon le programme / Half a day or a full day, depending on the programme | étape Mayi détaillée |
| `au-fil-de-l-eau` | aucune | — |

Étape Mayi détaillée : « Village Mayi (ponts de l'Esclavage et des Enclaves, phare et monument) » / « Mayi village (Slavery and Enclaves bridges, lighthouse and monument) ».

Adresse d'une ligne de parcours (catalogue des îlots) : `/formules/<id>` (`/en/packages/<id>`).

Message « Personnaliser ce parcours » (`buildTourRequestMessage`) : « Bonjour Kibreeze, je souhaite personnaliser le parcours « {title} » pour {persons} personnes. {url} ».

## Accueil

- `home.json`, aperçus hébergement : `chambre`, `studio`, `appartement` (nouveau), `villa`.
- Diaporama : 4 photos (`hero/plage-coucher-de-soleil.jpg` puis 3 photos de Franck en portrait), intervalle 6 s.
