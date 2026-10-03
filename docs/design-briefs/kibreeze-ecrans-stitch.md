# Kibreeze — les 8 écrans, prompts Stitch détaillés

**Statut** : actif · **Date** : 2026-09-28, logos et rouge de marque mis à jour le 2026-10-02, prompts passés en anglais le 2026-10-03 · [kibreeze-brief.md](./kibreeze-brief.md) reste le document de référence sur la marque, pour nous ; il ne se joint plus à Stitch.

Ce fichier contient huit prompts prêts à coller, un par écran. Ils sont volontairement longs : sur Stitch, la qualité du rendu est proportionnelle à la précision du brief. Un prompt vague produit une page de présentation générique ; un prompt qui nomme les contenus, les proportions et les interdits produit un écran exploitable.

## Langue des prompts

Depuis le 2026-10-03, **les consignes sont en anglais et les textes de l'interface restent en français**. Stitch suit mieux de longues consignes en anglais, mais l'interface du site est en français : chaque texte affiché à l'écran est donc écrit entre guillemets droits, en français, et le bloc commun dit explicitement à Stitch de les reproduire tels quels sans les traduire.

Si Stitch sort malgré tout une interface en anglais, corrige par retouche : `Keep everything, but all on-screen text must be in French, exactly as quoted in the prompt.`

## Mode d'emploi

1. **Une conversation Stitch par écran.** Ne jamais demander deux écrans dans la même requête : Stitch dilue le style et abandonne des contraintes.
2. **Joindre seulement les logos de l'écran** (tableau ci-dessous), puis coller le bloc commun, puis le prompt de l'écran. **Ne plus joindre [kibreeze-brief.md](./kibreeze-brief.md)** : sa partie 7 décrit les écrans avec d'anciens contenus et d'anciens prix, et sa partie 8 interdit les prix en euros que ces prompts exigent. Stitch recevait deux consignes contraires. Le bloc commun reprend tout ce dont il a besoin.
3. **Générer le mobile d'abord** (390 × 844). Une fois l'écran validé, demander l'ordinateur dans la même conversation avec le prompt de la section « Version ordinateur ».
4. **Générer dans l'ordre 1 à 8.** L'accueil fixe le style ; les suivants s'y réfèrent.
5. Corriger par retouches ciblées, en anglais elles aussi (`Keep everything, but…`), jamais en relançant l'écran entier.

### Logos à joindre

Sans le fichier, Stitch invente un logo ou tape « Kibreeze » dans une police quelconque. Les PNG transparents de [assets/](./assets/) sont rendus depuis les SVG de production de `src/assets/brand/` : ce sont les seuls à joindre. Ne jamais joindre les PNG d'origine de Franck (fond blanc, versions brillantes ou floutées).

| Fichier | Usage |
|---|---|
| [kibreeze-wordmark.png](./assets/kibreeze-wordmark.png) | Barre du haut, sur fond crème. **Tous les écrans** |
| [kibreeze-wordmark-creme.png](./assets/kibreeze-wordmark-creme.png) | Hero de l'accueil, sur photo. Écran 1 |
| [kibreeze-creme.png](./assets/kibreeze-creme.png) | Logo complet, symbole au-dessus du nom, pied de page sombre. Écran 1 |
| [tks-mark.png](./assets/tks-mark.png) | Lettres « TKS® » seules, sans la signature. Écrans 1, 4, 5 et 8 |

Les autres fichiers du dossier, [kibreeze.png](./assets/kibreeze.png) (logo complet rouge) et les deux symboles seuls, ne sont joints à aucun écran : ils servent aux retouches, et le symbole seul est réservé à l'icône du site. N'en mets pas un en décoration dans une page.

Les montants viennent du **guide tarifaire du 2026-09-26**. Ce sont les vrais prix de Kibreeze, pas des exemples : ne pas les modifier. Seul le jet-ski est en attente d'arbitrage, il n'apparaît donc avec aucun montant.

---

## Bloc commun — à coller en tête de chaque écran

```text
LANGUAGE — READ FIRST
These instructions are in English, but the interface is in FRENCH.
Every piece of text in double quotes is on-screen copy: reproduce it exactly,
in French, with its accents. Never translate it into English and never
rephrase it. Any extra text you need that is not given here (a short
description, a placeholder) must also be written in French.
Single exception: the tagline "Kribi is a feeling" always stays in English.

CONTEXT
You are designing a UI mockup for Kibreeze, a tourism and experiences brand in
Kribi, Cameroon. Tagline: "Kribi is a feeling".
Visitors browse experiences, add them to a cart called "Mon séjour", see an
estimated total, then send their request over WhatsApp. No payment, no user
account, no online booking.

Audience: first expats and foreign tourists, then Cameroonians from Douala and
Yaoundé on a weekend trip. Almost all traffic comes from phones.

FORMAT
Phone, 390 × 844 px. Design a responsive layout: columns that stack,
proportional widths, images that re-crop, labels that can wrap. No absolutely
positioned element used to fill a gap, no fixed heights, no text baked into
an image.

ART DIRECTION
Warm, rooted in local life, premium yet approachable.
- Brand red #8C0120, exactly the logo's red, never brighter and never more
  orange. Cream backgrounds #FFFAF3. Text #1C1917, secondary text #57534E.
  Warm accent: terracotta #A8431F.
  Cool accent: deep teal #186962, reserved for information badges.
  Green #25D366 reserved for WhatsApp buttons only, nowhere else.
- Sharp corners. Corner radius 0 to 4 px maximum on cards, images and
  buttons. No pill-shaped buttons, no heavily rounded corners: this is what
  sets the brand apart from a generic travel website.
- Solid color blocks, flat fills, no gradients, no heavy drop shadows. The
  only gradients allowed are the dark overlays on photos described in the
  screen prompts.
- Headings in a bold sans-serif with character, body text in a plain, highly
  readable sans-serif. A thin handwritten script ONLY for the tagline
  "Kribi is a feeling", nowhere else.
- 4 px spacing grid. Side gutter of at least 16 px.
- Many large photographs, tightly framed on people, water and vegetation.
  Little text. A mockup that looks like a text-heavy brochure page has
  failed, even if its content is correct.

LOGOS, ATTACHED AS IMAGES
- The Kibreeze logo is attached as image files: an open hexagon holding a
  smiling face, with a speech-bubble tail at the bottom left, and the word
  "Kibreeze" in bold rounded letters, the K cut by a slanted notch.
  Place the attached files exactly as they are. Never redraw the logo, never
  type "Kibreeze" or "KIBREEZE" in a font in its place, never stretch or
  crop it.
- Two colors only: red #8C0120 on light backgrounds, cream #FFFAF3 on photos
  or dark backgrounds. Never a gradient, bevel, shadow or glow. Never the red
  logo on a red background or on the very dark grey footer: it becomes
  unreadable there.
- Keep clear space around the logo of at least half its height: no text or
  button touching it.
- The TKS® logo is attached separately, letters only. It stays black or very
  dark grey, always smaller than the Kibreeze logo on the same screen, and
  appears only where the screen prompt asks for it.

NAVIGATION, IDENTICAL ON EVERY SCREEN
- Fixed top bar: on the left, the attached red Kibreeze wordmark
  (kibreeze-wordmark.png), about 24 px tall, without the hexagon symbol; in
  the middle or on the right, the "FR | EN" language switch, then a small
  green WhatsApp icon. Nothing else. No cart icon here, no hamburger menu, no
  icon that could pass for a user account.
- Fixed bottom tab bar, five destinations, always in this order:
  "Accueil", "Expériences", "Hébergements", "Formules", "Mon séjour". The
  "Mon séjour" tab carries a count badge. The current page's tab is active,
  in brand red.
- Stacking at the bottom of the screen, from the content downward: the
  page's sticky price bar if it has one, then the tab bar at the very bottom.
  The floating WhatsApp button exists ONLY on pages without a sticky price
  bar, anchored bottom right, at least 16 px above the tab bar. Nothing ever
  overlaps.

PRICING RULES
Three visually distinct forms:
  a fixed price "25 000 FCFA", a starting price "À partir de 15 000 FCFA",
  and a "Sur devis" badge with no amount.
Currency is FCFA, with a space as the thousands separator. Under each price,
in small grey text, the indicative euro equivalent, in French number format:
1 000 FCFA ≈ 1,52 €.

ACCESSIBILITY
WCAG AA contrast. Touch targets of at least 44 px. Leave room for 30% longer
text: the labels will later be translated into English.

STRICTLY FORBIDDEN
No delivery section and no mention of delivery anywhere (the brand name
"Breezy Delivery" in the footer line of screen 1 is the only exception). No
reviews, ratings or stars. No contact form. No prices in dollars. No payment,
no login, no cookie banner. No hamburger menu. No commercial promise that is
not in this prompt: no guaranteed response time, no discount, no "best
price". Never give TKS® top billing.
```

---

## Écran 1 — Accueil

L'écran le plus important. Il doit donner envie de venir à Kribi avant que le visiteur regarde un seul prix.

```text
SCREEN 1 — HOME ("Accueil"), a long scrolling page.

1. HERO, full screen, about 85% of the visible height.
   Photograph of a Kribi beach at sunset: dark wet sand in the foreground, low
   waves, leaning palm trees in silhouette on the right, orange and pink sky.
   A dark overlay fading from bottom to top for readability, never uniform.
   On top of it, left-aligned, anchored in the bottom third:
     - the attached cream Kibreeze wordmark (kibreeze-wordmark-creme.png),
       large, about 56 px tall, without the hexagon symbol. Do NOT type the
       word "KIBREEZE" in capitals;
     - right below it, "Kribi is a feeling" in a thin handwritten script;
     - a heading "Découvrez Kribi autrement", bold, two lines maximum;
     - one sentence of body text, three lines maximum: "Des expériences, des
       excursions et des séjours pensés pour vous faire vivre Kribi
       autrement.";
     - two buttons side by side, full width on mobile, stacked if needed:
       "Découvrir les expériences" as a solid brand-red button,
       "Planifier mon séjour" as a white outline button on a transparent
       background.
   A small animated chevron at the bottom of the hero invites scrolling.

2. THE THREE CATEGORIES, on a cream background, section title
   "Nos expériences".
   Three stacked cards, each about 200 px tall, a photo covering the whole
   card, a dark overlay, text on top:
     - "Nature & Découverte" — photo of the Lobé waterfalls pouring into the
       ocean — "6 expériences"
     - "Aventure" — photo of a quad bike on the sand or a jet ski in motion —
       "3 expériences"
     - "Détente" — photo of a beach bonfire at dusk — "3 expériences"
   Each card is fully clickable, with a discreet arrow on the right.

3. FEATURED EXPERIENCES, title "À ne pas manquer".
   Horizontal carousel, cards 280 px wide, slightly overflowing the right
   edge of the screen to signal that it scrolls.
   Four cards: photo on top taking two thirds of the card, then the name, a
   one-line description, the price, and an "Ajouter à mon séjour" button:
     - "Chutes de la Lobé" — "La seule cascade au monde qui se jette dans
       l'océan" — "5 000 FCFA / personne"
     - "Excursion en pirogue" — "Remontez la Lobé entre mangrove et forêt" —
       "35 000 FCFA / groupe"
     - "Croisière en bateau" — "Le coucher de soleil vu du large" —
       "25 000 FCFA / personne"
     - "Campement Bagyeli" — "À la rencontre du peuple de la forêt" —
       "7 500 FCFA / personne"

4. IMMERSIVE STRIP, full bleed, no side margin, 280 px tall.
   Wide photograph of the Lobé river seen from a dugout canoe. On top,
   centered, four words separated by middle dots, in widely spaced capitals,
   white: "MER · FORÊT · CHUTES · PIROGUE". No button, no other text. This is
   a visual breathing space, not an information section.

5. ACCOMMODATION, on a cream background, title "Où dormir à Kribi".
   An intro sentence: "Dites-nous votre budget, nous trouvons le logement."
   Then three cards side by side in a horizontal scroll:
   "Chambre — à partir de 15 000 FCFA / nuit", "Studio — à partir de
   30 000 FCFA / nuit", "Villa — à partir de 150 000 FCFA / nuit", each with
   a photo of a warm interior. Link "Voir tous les hébergements".

6. PACKAGES, on a solid terracotta background, cream text, to contrast with
   the rest of the page. Title "Des séjours déjà composés". Two light cards
   sitting on that background:
     - "Package Découverte" — "Chutes, pirogue, campement, musée, guide" —
       "100 000 FCFA / 2 personnes"
     - "Package Aventure" — "Chutes, pirogue, quad, jet-ski, kayak, cheval" —
       "150 000 FCFA / 2 personnes"
   Link "Voir les 4 formules".

7. TKS® — MOBILITY. A deliberately plain and compact section, reduced height,
   very light grey background, NO background photo, NOT the visual treatment
   of the experience cards. A single horizontal row: on the left the
   attached TKS® logo (tks-mark.png), black, about 20 px tall; in the middle
   "Mobilité & transport" then "Location, transferts et chauffeur privé pour
   compléter votre séjour"; on the right a link "Voir".
   This section must never draw more attention than the experiences.

8. ABOUT, cream background, title "Qui sommes-nous".
   A large photograph of Kribi — a landscape, not a team. Next to it or
   below it, this exact text, without rephrasing it:
   "Nous sommes Kibreeze, une marque dédiée à la découverte et aux
   expériences à Kribi. Nous voulons vous faire découvrir Kribi autrement, à
   travers ses paysages, ses activités, ses excursions et des expériences
   adaptées à vos envies."
   Link "En savoir plus".

9. CONVERSION BLOCK, solid brand-red background, cream text.
   Title "Un séjour sur mesure ?", one sentence, and a green WhatsApp button
   "Contacter Kibreeze sur WhatsApp".

10. FOOTER, very dark grey background, cream text.
    The attached full Kibreeze logo in cream (kibreeze-creme.png), symbol
    above the name, about 72 px tall; never the red version on this
    background. Then the handwritten tagline, then three columns of links:
    "Expériences" / "Hébergements" / "Formules", then "Mobilité TKS®" /
    "À propos" / "Contact". Below: "Kribi, Cameroun", the social media icons,
    and a thin, discreet line: "Kibreeze est une marque de Breezy Groupe,
    avec TKS®, iBreezy et Breezy Delivery."

11. Green floating WhatsApp button at the bottom right, above the tab bar,
    not touching it. Tab bar with "Accueil" active and the "Mon séjour" badge
    at 0.

Add the note "tarifs indicatifs" in small type in one corner.
```

---

## Écran 2 — Expériences

```text
SCREEN 2 — "EXPÉRIENCES" CATALOG.

1. Short banner, 220 px tall: photograph of the Lobé waterfalls, dark
   overlay, title "Expériences" and the sentence "Vivez Kribi autrement".

2. Category tabs in a horizontal scroll, sticking under the top bar while
   scrolling: "Toutes" (active), "Nature & Découverte", "Aventure",
   "Détente". The active tab is underlined with a thick red line, not shown
   as a colored pill.

3. Experience grid, one column on mobile, photo-led cards: the image takes
   about 60% of the card height, tightly framed.
   Below the photo: the name in bold, a one-line description, the price, and
   a discreet outline button "Voir les détails".
   The twelve cards, in this order, with these exact prices:
     - "Chutes de la Lobé" — "5 000 FCFA / personne"
     - "Excursion en pirogue" — "35 000 FCFA / groupe" — teal badge
       "8 personnes max"
     - "Excursion en chaloupe" — "65 000 FCFA / groupe" — badge
       "8 personnes max"
     - "Campement Bagyeli" — "À partir de 7 500 FCFA / personne"
     - "Jacuzzi naturel" — "5 000 FCFA / personne"
     - "Croisière en bateau" — "25 000 FCFA / personne"
     - "Feu de plage" — "50 000 FCFA / groupe"
     - "Quad" — "10 000 FCFA / session"
     - "Kayak" — "10 000 FCFA / personne"
     - "Paddle" — "10 000 FCFA / personne"
     - "Balade à cheval" — "5 000 FCFA / personne"
     - "Bateau de plaisance" — "Sur devis" badge, no amount
   Put a "Disponibilité à confirmer" badge on one card only: the
   "Bateau de plaisance" card.

4. At the bottom, a block "Une envie particulière ?" with a green button
   "Contacter Kibreeze sur WhatsApp".

5. Floating WhatsApp button, tab bar with "Expériences" active.

Then, in the same conversation, generate the variant where the "Aventure"
tab is active and only four cards remain visible: "Quad", "Kayak", "Paddle",
"Balade à cheval".
```

---

## Écran 3 — Fiche d'une expérience

```text
SCREEN 3 — DETAIL PAGE "EXCURSION EN PIROGUE".

1. Discreet breadcrumb: "Expériences › Nature & Découverte › Excursion en
   pirogue".

2. Gallery: one large photograph, 280 px tall, showing a colorful dugout
   canoe on the Lobé river lined with dense vegetation, with a "1 / 4"
   counter overlaid in the bottom right corner. Below it, three square
   72 px thumbnails, left-aligned.

3. Title "Excursion en pirogue" in bold, with a small teal badge
   "Nature & Découverte" below it.

4. Price block, visually strong: "35 000 FCFA" very large in brand red,
   followed by "/ groupe" smaller in grey, then below "≈ 53 € — montant
   indicatif" in light grey, then in small type "Prix indicatif, sous
   réserve de disponibilité et de confirmation par Kibreeze." Finally, on
   its own line, a teal badge "Jusqu'à 8 personnes — au-delà, sur devis".

5. A three-column info row, separated by thin vertical rules, each with a
   thin icon above: "2 à 3 heures" / "1 à 8 personnes" /
   "Embouchure de la Lobé".

6. Description: two short paragraphs, three lines maximum each, in French.

7. Two stacked lists, not side by side, to stay readable on mobile:
   "Ce qui est inclus" with green check marks — "Pirogue et équipement de
   sécurité", "Piroguier local", "Gilets de sauvetage", "Rafraîchissements" —
   then "Ce qui n'est pas inclus" with grey crosses — "Pourboires",
   "Dépenses personnelles", "Transport jusqu'au point d'embarquement".

8. OPTIONAL ADD-ONS, a box on a deeper cream background, title "Complétez
   votre expérience". Three checkboxes, unchecked by default, each with its
   price on the right:
     - "Guide touristique" — "5 000 FCFA"
     - "Maître-nageur" — "5 000 FCFA"
     - "Musée d'art" — "1 500 FCFA / personne"
   These options are not cards: they are rows with a checkbox.

9. Quantity selector: label "Nombre de personnes", a square minus button,
   the value 2 in the middle, a square plus button. Both buttons at least
   44 px.

10. "Vous aimerez aussi" strip: three compact horizontal cards —
    "Chutes de la Lobé" "5 000 FCFA", "Jacuzzi naturel" "5 000 FCFA",
    "Croisière" "25 000 FCFA".

11. STICKY BOTTOM BAR, right above the tab bar, cream background with a thin
    top border: on the left "Total" in small grey and "35 000 FCFA" in bold
    above "≈ 53 €"; on the right a red button "Ajouter à mon séjour". Below
    the button, a discreet underlined link "Demander ce service".
    NO floating WhatsApp button on this screen: the sticky bar replaces it.

12. Tab bar with "Expériences" active.
```

---

## Écran 4 — Mon séjour, état plein

```text
SCREEN 4 — "MON SÉJOUR", FILLED CART.

1. Large title "Mon séjour", grey subtitle "5 prestations sélectionnées",
   and on the right a discreet link "Vider".

2. Two fields side by side, EMPTY, each with its label above and grey
   placeholder text inside: "Dates du séjour" / "Sélectionner" and
   "Voyageurs" / "Combien ?". Below them, a discreet teal line with a small
   info icon: "Ajoute tes dates pour une réponse plus rapide". This reminder
   only makes sense because the fields are empty: do not pre-fill them.

3. List of selected items. Each item is a horizontal card 96 px tall: a
   square photo thumbnail on the left, in the middle the name in bold then
   the quantity in grey, on the right the price in red and a small trash
   icon in the top right corner. Below the name, a compact quantity selector
   when the item accepts one.
     - "Excursion en pirogue" — "1 groupe" — "35 000 FCFA" — with selector
     - "Chutes de la Lobé" — "2 personnes" — "10 000 FCFA" — with selector
     - "Campement Bagyeli" — "tarif couple" — "20 000 FCFA" — with selector
     - "Hébergement, Chambre" — "3 nuits" — "À partir de 45 000 FCFA" —
       with selector
     - "TKS® — Transfert Douala → Kribi" — "Sur devis" badge, no amount,
       NO quantity selector, only the trash icon on this item
   The TKS item shows the attached TKS® logo (tks-mark.png), black, about
   14 px tall, right before the name, to show it comes from another brand.

4. Total box, deeper cream background, thin border:
   "Total estimatif" on the left, "110 000 FCFA" on the right, very large
   and red, and under the amount "≈ 167 € — montant indicatif".
   Below, a teal line "+ 1 prestation sur devis".
   Then in small grey: "Prix indicatif, sous réserve de disponibilité et de
   confirmation par Kibreeze."

5. STICKY BOTTOM BAR, above the tab bar: a full-width green button
   "Demander un devis par WhatsApp", and below it a discreet link
   "Continuer mes recherches".
   NO floating WhatsApp button on this screen.

6. Tab bar with "Mon séjour" active and its badge at 5.

This screen shows the heart of the product: a single trip mixes
experiences, accommodation and a TKS® mobility service.
```

---

## Écran 5 — Mon séjour, états vide et sur devis

```text
SCREEN 5 — TWO VARIANTS OF "MON SÉJOUR".

VARIANT A, empty cart:
Title "Mon séjour". In the middle of the screen, a beautiful square
photograph of Kribi with sharp corners — a beach at sunset, not an abstract
illustration or an icon. Below it, the heading "Votre séjour est vide", the
sentence "Ajoutez des expériences pour composer votre séjour à Kribi", and a
red button "Découvrir les expériences". No list, no total, no sticky bar at
the bottom. The floating WhatsApp button is present, since there is no
sticky bar. Tab bar badge at 0.

VARIANT B, quote-only items:
Same structure as screen 4, but only two items, each carrying the
"Sur devis" badge, with no amount and no quantity selector:
  - "Bateau de plaisance" — "Sur devis"
  - "TKS® — Transfert Douala → Kribi" — "Sur devis"
Instead of the total box, a plainer box with only the text
"Total : sur devis (2 prestations)", with no euro amount.
The sticky bottom bar keeps the green button "Demander un devis par
WhatsApp". Badge at 2.
```

---

## Écran 6 — Hébergements

C'est l'écran le plus inhabituel du site : on ne vend pas un logement, on vend un budget. Il ne se devine pas, il doit être dessiné.

```text
SCREEN 6 — ACCOMMODATION ("HÉBERGEMENTS").

1. Short banner, 200 px tall: photograph of a terrace opening onto the sea in
   the early morning, dark overlay, title "Hébergements" and the sentence
   "Dites-nous votre budget, nous trouvons le logement".

2. Explanation box on a deeper cream background, with a thin 3 px teal left
   border. It is the key to understanding the page and must be impossible to
   miss:
   "Choisissez le type de logement et le budget qui vous conviennent. Nous
   cherchons ensuite la meilleure option disponible chez nos partenaires à
   Kribi."

3. FOUR ACCOMMODATION-TYPE BLOCKS, stacked, separated by generous spacing.
   Each block starts with a full-width 180 px photograph — a warm, bright
   interior, never an impersonal hotel lobby — with a small overlaid label
   "photo d'illustration".
   Below the photo, the type name in bold, the capacity in grey, then the
   budget tiers as clickable rows, each with its price on the left and a
   compact "Ajouter" button on the right:

   "CHAMBRE" — "1 à 2 personnes"
     · "À partir de 15 000 FCFA / nuit" — "≈ 23 €"

   "STUDIO" — "2 à 3 personnes"
     · "À partir de 30 000 FCFA / nuit" — "≈ 46 €"

   "APPARTEMENT" — "2 à 6 personnes"
     · "À partir de 35 000 FCFA / nuit" — "≈ 53 €"
     · "À partir de 50 000 FCFA / nuit" — "≈ 76 €"
     · "À partir de 100 000 FCFA / nuit" — "≈ 152 €"

   "VILLA" — "6 à 12 personnes"
     · "À partir de 150 000 FCFA / nuit" — "≈ 228 €"

4. HIGH-END SECTION, clearly separated by wide spacing and a different,
   darker and plainer background. It comes AFTER the standard tiers, never
   before: a high amount at the top of the page would scare visitors away.
   Title "Plus grand, plus haut de gamme ?", sentence "Appartements et villas
   d'exception, jusqu'à 300 000 FCFA la nuit", and a green button
   "Contacter Kibreeze sur WhatsApp". No "Ajouter" button here.

5. Below the tiers, in small grey: "Prix indicatif, sous réserve de
   disponibilité et de confirmation par Kibreeze."

6. Floating WhatsApp button, tab bar with "Hébergements" active.

Then, in the same conversation, generate the state right after an item is
added: a discreet confirmation strip sliding up from the bottom, above the
tab bar, with the text "Chambre, 15 000 FCFA / nuit — ajoutée à votre
séjour" and a link "Voir mon séjour". It does not steal focus and disappears
on its own.
```

---

## Écran 7 — Formules

```text
SCREEN 7 — PACKAGES ("FORMULES").

1. Short banner, 200 px tall: photograph of a beach at sunrise, title
   "Formules" and the sentence "Des séjours déjà composés, ajustables avec
   nous".

2. An info line below the banner, centered, in grey:
   "Tous nos forfaits sont calculés sur une base de 2 personnes."

3. FOUR VERTICAL CARDS, stacked, 24 px apart.
   Each card: a full-width 160 px photograph at the top, then the package
   name in bold, then the list of what it includes as short lines preceded
   by a small red check mark, then a thin divider, then the price large in
   red with "/ 2 personnes" small right after it, the euro equivalent below,
   and finally a full-width red button "Ajouter à mon séjour".

   "PACKAGE DÉCOUVERTE" — "100 000 FCFA / 2 personnes" — "≈ 152 €"
     "Chutes de la Lobé" · "Excursion en pirogue" · "Campement Bagyeli" ·
     "Musée d'art" · "Guide touristique"

   "PACKAGE ÉVASION" — "120 000 FCFA / 2 personnes" — "≈ 182 €"
     "Chutes de la Lobé" · "Excursion en pirogue" · "Kayak" ·
     "Balade à cheval" · "Jacuzzi naturel"

   "PACKAGE AVENTURE" — "150 000 FCFA / 2 personnes" — "≈ 228 €"
     "Chutes de la Lobé" · "Excursion en pirogue" · "Quad" · "Jet-ski" ·
     "Kayak" · "Balade à cheval"

   "PACKAGE PREMIUM" — "300 000 FCFA / 2 personnes" — "≈ 456 €"
     "Chutes de la Lobé" · "Excursion en chaloupe" · "Bateau de plaisance" ·
     "Quad" · "Jet-ski" · "Kayak" · "Balade à cheval" · "Jacuzzi naturel"

   Make the Premium card visually distinct: a thin red border and a small
   "Le plus complet" badge at the top of the card. No different background
   color, no gold effect.

4. At the bottom, a box on a deeper cream background: "Groupes jusqu'à
   8 personnes sur demande" and "Chaque formule est ajustable : dites-nous
   ce que vous voulez changer", with a green button "Contacter Kibreeze sur
   WhatsApp".

5. Floating WhatsApp button, tab bar with "Formules" active.
```

---

## Écran 8 — TKS® Mobilité

Écran délibérément sobre. S'il est aussi beau que les expériences, il est raté : il doit se lire comme une annexe utile.

```text
SCREEN 8 — TKS® — MOBILITY.

This screen must look visibly plainer than the rest of the site. No
full-screen photograph, no large illustrated cards, no immersive banner. It
is a utility section that completes a trip, not a showcase of experiences.

1. Short, low banner, only 130 px tall, very light grey background, no
   photograph. On the left the attached TKS® logo (tks-mark.png), black,
   about 22 px tall, never larger than the Kibreeze logo in the top bar. On
   the right the title "Mobilité & transport" and the sentence "Location,
   transferts et chauffeur privé pour compléter votre séjour".

2. A brand-affiliation sentence, in grey, below the banner: "TKS® est la
   marque de mobilité de Breezy Groupe, aux côtés de Kibreeze."

3. COMPACT LIST of five services, as rows, not cards. Each row is 72 px
   tall: a small 56 px square thumbnail on the left, the name in bold in the
   middle with a one-line grey description below it, and on the right the
   "Sur devis" badge then a chevron.
     - "Location de véhicules" — "Berlines et 4x4, avec ou sans chauffeur"
     - "Location avec chauffeur" — "Un véhicule et son chauffeur à la
       journée"
     - "Transferts" — "Douala, Yaoundé, aéroport"
     - "Chauffeur privé" — "À l'heure ou à la journée"
     - "Prestations professionnelles" — "Transport d'équipes et
       d'entreprises"
   All five carry the "Sur devis" badge: no mobility prices exist yet. Do
   not invent any amount.

4. A plain box: "Besoin d'un transport sur mesure ? Dites-nous vos dates et
   votre trajet, nous vous répondons avec un prix." and a green button
   "Contacter Kibreeze sur WhatsApp".

5. Floating WhatsApp button. Tab bar: no tab is active, this page has none.
   Keep the bar as is, with no active state.
```

---

## Version ordinateur

Une fois chaque écran validé en mobile, demander dans la même conversation :

```text
Keep exactly the same style, the same content and the same hierarchy, and
keep all on-screen text in French, but adapt this screen to a 1440 × 1024
desktop:
- the bottom tab bar disappears, replaced by a full navigation in the top
  bar: on the left the same attached Kibreeze wordmark, about 28 px tall,
  then "Expériences", "Hébergements", "Formules", "Mobilité", and on the
  right the "FR | EN" switch, a "Mon séjour" icon with its count badge, and
  the WhatsApp button;
- content is limited to 1 200 px wide, centered, with wide margins;
- card grids switch to three columns, accommodation lists to two;
- on the detail page, the gallery takes the left column and the price block
  with its button becomes a sticky card in the right column;
- on "Mon séjour", the summary becomes a right-hand side panel that stays
  visible while scrolling;
- the home hero keeps its overlay and its left-aligned text, without
  stretching excessively in height.
```

## Contrôle avant de montrer à Franck

- Tous les textes de l'interface sont en français, mot pour mot, sauf « Kribi is a feeling ».
- Le rouge du logo, #8C0120, est bien la couleur de marque, et le vert n'apparaît que sur les boutons WhatsApp.
- Le logo est le fichier joint, pas une imitation : même tracé, K entaillé, hexagone ouvert avec sa pointe de bulle. Aucun « KIBREEZE » tapé en capitales dans le hero.
- Logo rouge sur les fonds clairs, crème sur les photos, le pied de page et les fonds rouges. Jamais de dégradé, de relief ni de halo.
- Le logo TKS® est noir, plus discret que celui de Kibreeze, et n'apparaît que sur les écrans 1, 4, 5 et 8.
- Les angles sont francs partout, aucun bouton en pilule.
- Aucun chevauchement en bas d'écran entre la barre de prix, la barre à onglets et le bouton flottant.
- Les trois formes de prix apparaissent, et chaque montant porte son équivalent en euros.
- Les prix sont exactement ceux du guide tarifaire, sans arrondi ni invention.
- Le jet-ski n'affiche aucun prix tant que T1 n'est pas tranché.
- Aucune mention de livraison nulle part.
- TKS® n'apparaît jamais avant les expériences dans l'ordre de lecture.
- Le pied de page cite les quatre marques de Breezy Groupe.
- Les écrans 3, 4 et 5-B n'ont pas de bouton WhatsApp flottant.
