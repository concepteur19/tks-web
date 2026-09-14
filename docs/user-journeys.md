# Parcours utilisateur et états

**Statut** : draft · **Date** : 2026-09-13

## 1. Parcours principal : composer un séjour

```text
Accueil
   ↓  CTA « Découvrir nos services » / carte pôle
Page pôle (Tourisme prioritaire)
   ↓  filtre par catégorie, clic sur une carte
Fiche prestation
   ↓  quantité / nombre de personnes, « Ajouter à mon séjour »
Feedback d'ajout (toast + badge compteur dans la nav)
   ↓  continuer à parcourir, ou ouvrir « Mon séjour »
Mon séjour
   ↓  récapitulatif, ajustement des quantités, suppression
Estimation (total indicatif + lignes sur devis)
   ↓  date de séjour et voyageurs (optionnels ; rappel non bloquant si la sélection contient du tourisme)
CTA « Demander un devis par WhatsApp »
   ↓  ouverture de WhatsApp avec le message prérempli
Conversation WhatsApp avec TKS (hors site)
```

Le parcours est identique en français et en anglais ; seules les URL et les textes changent.

**Objectif de conversion** : maximiser le nombre de messages WhatsApp envoyés avec une sélection non vide. Chaque écran doit offrir un chemin en une action vers l'écran suivant.

## 2. Parcours secondaires

| Parcours | Entrée | Sortie attendue |
|---|---|---|
| Arrivée directe sur une fiche (SEO, lien partagé) | `/services/chutes-de-la-lobe` | Le visiteur comprend TKS grâce au layout (nav, bandeau), peut ajouter au séjour et remonter vers le pôle |
| Livraison seule | Accueil → Livraison → fiche → ajouter → WhatsApp | Même mécanique ; le message dit « je souhaite une livraison » plutôt que « organiser un séjour » |
| Contact direct sans sélection | Bouton WhatsApp flottant ou page Contact | WhatsApp s'ouvre avec un message générique « Bonjour TKS, je souhaite des informations. » |
| Changement de langue | Sélecteur FR / EN dans la navigation | Page équivalente dans l'autre langue ; sélection, dates et voyageurs conservés ; le message WhatsApp suit la nouvelle langue |
| Retour après fermeture du navigateur | Toute page | La sélection est restaurée depuis le stockage local ; le badge de la nav reflète le nombre de lignes |
| Ajout rapide depuis une carte (sans ouvrir la fiche) | Page pôle | Ajout avec quantité par défaut ; possible en V1 si le design Figma le prévoit, sinon uniquement depuis la fiche |
| Modification depuis le message WhatsApp | WhatsApp | Le visiteur peut éditer le texte avant envoi ; le site n'a pas de contrôle après l'ouverture de WhatsApp |

## 3. États de la sélection « Mon séjour »

| État | Déclencheur | Comportement attendu |
|---|---|---|
| **Vide** | Première visite, ou après « Vider » | Page Mon séjour : illustration + texte « Votre séjour est vide » + CTA vers Tourisme. Badge nav masqué. CTA WhatsApp générique disponible |
| **Une ligne** | Premier ajout | Toast « Ajouté à mon séjour » avec lien « Voir ». Badge nav = 1. Total = prix × quantité ou « sur devis » |
| **Plusieurs lignes** | Ajouts successifs | Lignes triées par ordre d'ajout, groupées visuellement par pôle si le design le prévoit |
| **Doublon** | Ajout d'un service déjà présent | Pas de nouvelle ligne : la quantité de la ligne existante est incrémentée de la quantité demandée, dans la limite du maximum. Toast « Quantité mise à jour » |
| **Quantité modifiée** | Stepper +/− ou saisie | Recalcul immédiat de la ligne et du total. Bornes min / max du service respectées ; le bouton − à la valeur min supprime la ligne après confirmation légère (ou passe à 0 puis retire, selon design) |
| **Suppression** | Icône corbeille | Ligne retirée, total recalculé, toast avec « Annuler » pendant 5 s |
| **Vider** | Lien « Vider mon séjour » | Confirmation, puis état Vide |
| **Ligne sur devis** | Service `pricing.kind = quote` | Ligne affichée avec badge « Sur devis », pas de montant. Comptée dans « + N prestation(s) sur devis » sous le total |
| **Ligne « à partir de »** | Service `pricing.kind = from` | Montant calculé, préfixe « à partir de » sur la ligne. Le total porte la mention « estimatif » |
| **Total = 0, uniquement du sur devis** | Toutes les lignes sont `quote` | Pas de montant affiché : « Total : sur devis (N prestations) ». CTA inchangé |
| **Service désactivé dans les données** | Ligne persistée dont le service est `disabled` ou absent du catalogue | Ligne purgée au chargement, message discret « Une prestation n'est plus disponible et a été retirée » |
| **Service « sur demande »** | `availability = on_request` | Ajout possible, badge « Disponibilité à confirmer » sur la fiche et la ligne |
| **Quantité au maximum** | Stepper à `max` | Bouton + désactivé, aide « Maximum N » ; pour un groupe plus grand, invitation à préciser sur WhatsApp |
| **Stockage local indisponible** | Navigation privée stricte, quota, erreur | Mode dégradé : sélection en mémoire pour la session, bandeau discret « Votre sélection ne sera pas conservée après fermeture » |
| **Message WhatsApp trop long** | Sélection très grande | Le message est tronqué proprement (lignes complètes), suivi de « … et N autres prestations ». Le total reste exact |
| **Dates ou voyageurs manquants avec du tourisme** | Au moins une ligne du pôle tourisme, champ vide | Rappel discret près du CTA (« Ajoute tes dates et le nombre de voyageurs pour une réponse plus rapide »). Le CTA reste actif ; le message WhatsApp omet les champs vides (client D2) |
| **Traduction anglaise manquante** | Texte `en` absent d'un service ou d'une page | En aperçu : le texte français s'affiche. En production : impossible, le build échoue |

## 4. États d'affichage par support

| Support | Accès à la sélection | CTA WhatsApp |
|---|---|---|
| **Mobile** (< 768 px) | Icône dans la barre supérieure avec badge ; page Mon séjour plein écran ; barre sticky en bas de fiche avec « Ajouter » ; barre sticky en bas de Mon séjour avec le total et le CTA | Bouton flottant en bas à droite sur les pages de contenu ; masqué sur Mon séjour pour ne pas doubler le CTA principal |
| **Desktop** (≥ 1024 px) | Icône nav avec badge ouvrant un panneau latéral (drawer) avec récap court et lien vers la page complète | Bouton dans la nav ; le lien ouvre WhatsApp Web ou l'application de bureau |
| **Tablette** | Comportement desktop avec drawer | idem desktop |

## 5. Comportement du lien WhatsApp

- Format : `https://wa.me/<numéro international sans +>?text=<message encodé>`.
- Mobile : ouvre l'application WhatsApp si installée, sinon la page web avec invitation à installer.
- Desktop : ouvre WhatsApp Web (ou l'application de bureau si le système le propose).
- Le lien s'ouvre dans un nouvel onglet ; la page Mon séjour reste ouverte avec sa sélection intacte.
- Un événement de conversion (V2 analytics) est déclenché au clic.

## 6. Accessibilité des parcours

- Tous les parcours sont réalisables au clavier : cartes et boutons focusables, ordre de tabulation logique, drawer piégeant le focus et fermable par Échap.
- Les changements de total et les toasts sont annoncés via une région `aria-live="polite"`.
- Les steppers sont des groupes avec boutons libellés « Diminuer » / « Augmenter » et un champ numérique.
- Les badges de prix ont un texte explicite (« à partir de 25 000 francs CFA par personne »), pas uniquement une abréviation visuelle.
- `<html lang>` correspond à la langue de la page ; le sélecteur signale la langue courante avec `aria-current`, et chaque lien porte `lang` et `hreflang`.

## Documents liés

- [functional-requirements.md](./functional-requirements.md) : chaque état ci-dessus est couvert par un FR
- [data-model.md](./data-model.md) : `Pricing`, `QuantityRule`, `availability`
