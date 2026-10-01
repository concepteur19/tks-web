# Prompts — visuels provisoires en attendant Franck

**Statut** : vivant · **Créé le** : 2026-09-18

Franck n'a pas encore envoyé le logo haute définition ni les photos (voir [content-tracker.md](../content-tracker.md), tout est marqué ⏳). Ces prompts servent à générer des visuels provisoires de qualité pour avancer les maquettes Stitch/Figma et, plus tard, le développement, sans attendre.

**Règle non négociable** : ces visuels ne sont jamais la version finale. Ils ne doivent jamais représenter l'équipe réelle de TKS ni être présentés à Franck ou à un visiteur comme authentiques. La règle de mise en ligne existe déjà dans [content-tracker.md](../content-tracker.md) : *« Le build de production échoue s'il reste un contenu `[PLACEHOLDER]` »* et *« Un service sans photo validée est désactivé jusqu'à réception, plutôt que publié avec une image provisoire »*. Ici on applique la même logique en amont : chaque fichier généré part dans `Elements/incoming/placeholders/` (git-ignoré comme le reste des médias bruts), nommé `PLACEHOLDER-<usage>.png`, et une bannière ou un filigrane « visuel provisoire » reste visible tant que la vraie ressource n'est pas arrivée.

Outil recommandé : un générateur d'images à part (Midjourney, Ideogram, Google ImageFX/Gemini) plutôt que Stitch, qui est fait pour des interfaces et pas des photos ou des logos vectoriels propres. Pour le logo, préfère un outil qui sort du vectoriel net (Ideogram, Recraft) : les générateurs photoréalistes produisent du texte flou ou déformé.

## 1. Logo provisoire « TKS° »

```text
Flat vector logotype for a travel and transport company, text mark reading
"TKS" with a small superscript circle like a registered trademark symbol.
Warm sun-soleil color palette: terracotta / burnt orange (#A8431F) as the
primary mark color on a cream background (#FFFAF3). Bold, confident,
slightly rounded geometric sans-serif letterforms with local, warm,
approachable character — not corporate, not a car-rental brand. Include one
small abstract sun or wave motif integrated into the mark, optional. Clean
vector shapes, no gradients, no photographic texture, works small on a
mobile navigation bar. Deliver on transparent background.
```

Variantes à redemander avec le même prompt, en ne changeant que la fin :
- « …in a single dark charcoal ink (#1C1917), for use on a light background. »
- « …in a single cream ink (#FFFAF3), for use on a dark terracotta background. »
- « …as an icon-only mark, without the letters, for use as a favicon. »

Une fois choisi, exporter en SVG (redessiner à la main si le générateur ne sort que du raster — un logo provisoire mal vectorisé vaut moins qu'un simple texte « TKS® » en `font-display`, qui reste l'option par défaut tant que rien de mieux n'existe).

## 2. Photo de hero (accueil)

```text
Photograph of a tropical Atlantic coast beach at golden hour sunset, warm
orange and terracotta sky, silhouettes of palm trees leaning over the sand,
calm ocean with gentle waves catching the light. West/Central African
coastline (Kribi, Cameroon) — not Caribbean, not Southeast Asian palms.
Candid, documentary travel-photography feel, tightly framed on the scene
rather than a wide empty postcard shot. Some sense of human presence in the
distance (a fisherman, a pirogue) without being the main subject. Natural
light only, no text, no logo overlay. Vertical 9:16 crop for mobile hero,
also usable cropped to 16:9 for desktop.
```

## 3. Photos de bandeau des trois pôles

```text
[Transport] Photograph, warm late-afternoon light, a clean 4x4 or sedan
vehicle on a coastal road near palm trees and ocean glimpses in the
background, Central African setting. Candid travel-photography feel, tight
framing on the vehicle and road rather than a wide empty landscape. No
text, no logo.

[Tourisme] Photograph, a traditional wooden pirogue on a calm brown-green
river bordered by dense tropical vegetation, golden hour light, a local
guide paddling, tightly framed on the boat and water rather than a wide
landscape. Central African river delta setting (like the Lobé river mouth,
Kribi). No text, no logo.

[Livraison] Photograph, a delivery rider on a motorbike with a delivery box,
candid street scene in a warm-toned Central African coastal town, tight
framing on the rider and bike rather than a wide empty street. Warm
terracotta and cream tones in the environment (walls, market stalls). No
text, no logo.
```

## 4. Photo « équipe » (bloc À propos)

```text
Photograph, a small group of 4 to 6 Cameroonian professionals in matching
warm-toned polo shirts (terracotta/orange), standing together outdoors near
the coast, natural candid smiles, mid-shot framing on the people rather
than a wide empty background, golden hour light. No text, no logo, no
visible name badges.
```

Utiliser cette image uniquement en interne (maquettes, dev). Ne jamais la présenter à un visiteur du site comme « notre équipe » : ce sont des personnes qui n'existent pas et qui ne travaillent pas chez TKS. Elle disparaît dès que Franck envoie une vraie photo d'équipe.

## 5. Quand Franck envoie les vraies ressources

Suivre la procédure déjà écrite dans [content-tracker.md](../content-tracker.md) : dépôt dans `Elements/incoming/<date>/`, mise à jour du tableau, remplacement du fichier `PLACEHOLDER-*` par le vrai fichier au même usage, suppression du filigrane. Rien de spécifique à ce document.
