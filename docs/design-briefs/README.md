# Briefs prêts à téléverser dans un générateur d'interfaces

Trois fichiers, un par direction artistique. Chacun est **autonome** : contexte, contraintes, microcopie, direction, écrans à produire, interdits. C'est ce qu'on téléverse dans le formulaire de l'outil.

| Fichier | Direction |
|---|---|
| [direction-a-mer-et-sable.md](./direction-a-mer-et-sable.md) | Clair et apaisant, bleu océan, sable, corail |
| [direction-b-nuit-tropicale.md](./direction-b-nuit-tropicale.md) | Sombre et premium, vert forêt, doré |
| [direction-c-soleil-et-vie-locale.md](./direction-c-soleil-et-vie-locale.md) | Chaleureux, terracotta, turquoise |

Les trois fichiers décrivent **exactement le même contenu**. Seule la partie 5 change. C'est voulu : Franck doit comparer des styles, pas trois sites différents.

Ne téléverse jamais [../design-prompts.md](../design-prompts.md) dans l'outil. Ce fichier est notre document de travail : il contient les trois directions à la fois et des consignes qui ne s'adressent pas au générateur.

## Comment remplir le formulaire

| Champ du formulaire | Ce qu'on met |
|---|---|
| Fichier `.md` | **Un seul** brief, celui de la direction en cours |
| Fichier `.fig` | Rien. Il n'existe pas encore de maquette |
| Code | Rien. Le code du site n'est pas écrit |
| Images | Facultatif : deux à quatre photos de Kribi en référence d'ambiance. Aucune photo de TKS n'est encore disponible |
| Polices | Rien. TKS n'a pas de charte typographique |
| Logo | Rien pour l'instant. Le logo haute définition est encore attendu, le texte « TKS® » suffit |
| Dépôt GitHub | Non. Le dépôt ne contient que de la documentation, il n'aiderait pas et ajouterait du bruit |
| Site web | Non. TKS n'a pas encore de site |
| Instructions supplémentaires | La phrase qui cible un seul écran, voir ci-dessous |

## Instructions supplémentaires, à coller telles quelles

Un écran à la fois. Si l'outil en génère plusieurs d'un coup, il dilue la qualité et ignore des contraintes.

**Écran 1, accueil**
```text
Génère uniquement l'écran 1 « Accueil » décrit en partie 6 du brief, pour téléphone, 390 × 844, en français. Respecte la microcopie de la partie 4 mot pour mot et la direction artistique de la partie 5. Le bouton WhatsApp flottant doit être visible sans faire défiler la page.
```

**Écran 2, fiche d'activité**
```text
Génère uniquement l'écran 2 « Fiche Excursion en pirogue » décrit en partie 6 du brief, pour téléphone, 390 × 844, en français, dans le même style que l'écran d'accueil précédent. Le prix doit s'afficher « À partir de 25 000 FCFA / personne » et la mention de prix indicatif doit apparaître juste en dessous.
```

**Écran 3, Mon séjour**
```text
Génère uniquement l'écran 3 « Mon séjour, état plein » décrit en partie 6 du brief, pour téléphone, 390 × 844, en français, dans le même style que les écrans précédents. Les quatre lignes et leurs montants doivent être repris exactement, y compris la ligne « Transport professionnel » qui porte le badge « Sur devis » sans montant, et la ligne « Location avec chauffeur » qui affiche « 2 véhicules × 3 jours ».
```

## Ordre de travail

1. Direction A : écran 1, puis 2, puis 3.
2. Direction B : les mêmes trois écrans, avec le brief B.
3. Direction C : les mêmes trois écrans, avec le brief C.

Neuf écrans en tout. C'est ce que voit Franck.

Quand un détail est raté, ne relance pas tout l'écran. Reprends l'outil sur ce point précis, par exemple : « Garde tout, mais rends le badge Sur devis lisible sur fond clair » ou « Garde tout, mais le bouton WhatsApp doit rester vert WhatsApp, pas de la couleur de la marque ».

## Contrôle avant de montrer à Franck

- Bouton WhatsApp visible sans défiler, sur les trois écrans.
- Les trois formes de prix apparaissent : montant ferme, « À partir de », badge « Sur devis ».
- La mention de prix indicatif est présente sur la fiche et sur Mon séjour.
- Le sélecteur « FR | EN » est visible dans la navigation.
- Les noms d'activités sont ceux validés par Franck, sans invention.
- La mention « tarifs fictifs » figure sur chaque écran.
- Aucun avis client, aucun prix en euros, aucun formulaire de contact.

La checklist complète est en partie 6 de [../design-prompts.md](../design-prompts.md).

## Ensuite

Une fois la direction choisie par Franck, on complète seulement celle-là : page de pôle, contact, versions ordinateur, fiche transport avec ses deux sélecteurs, états vide et sur devis de Mon séjour, et deux écrans en anglais. Tout est décrit en partie 3 de [../design-prompts.md](../design-prompts.md).
