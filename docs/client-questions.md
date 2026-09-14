# Questions pour le site TKS®

**Pour** : Franck (TKS®)
**De** : Zobel
**Date** : 2026-09-13
**Réponses** : reçues le 2026-09-14, voir [client-answers.md](./client-answers.md). Restent ouverts : tarifs par service (C1, C2), quantité par service transport (D1), logo et photos (F1, F2), coordonnées détaillées (F4), domaine (F8).

Salut Franck. Avant de coder la première version du site, j'ai besoin que tu tranches quelques points. Réponds directement sous chaque question, même en deux mots. Les questions marquées ⭐ sont celles sans lesquelles je ne peux pas mettre le site en ligne.

Sous chaque question, je t'indique ce que je ferai **si tu ne réponds pas** : comme ça, on avance quand même.

---

## A. Business

**A1.** C'est quoi l'objectif numéro un du site pour les 6 prochains mois : recevoir des demandes sur WhatsApp, faire connaître TKS, ou vendre des séjours complets ?
> Hypothèse : recevoir un maximum de demandes WhatsApp sérieuses.

**A2.** Tes clients prioritaires, c'est qui : des Camerounais de Douala et Yaoundé, des expatriés, des touristes étrangers, des entreprises ?
> Hypothèse : des particuliers de Douala et Yaoundé qui viennent pour un week-end ou un séjour, francophones.

**A3.** Dans ton vocal, tu parlais de lancer d'abord le **tourisme**. Dans le cahier des charges, les trois pôles sont au même niveau. Au lancement, tu veux quoi : les trois pôles complets, ou Tourisme complet avec Transport et Livraison réduits à 2 ou 3 services chacun ?
> Hypothèse : les trois pôles comme dans le cahier des charges, et je travaille le contenu Tourisme en premier.

**A4.** En une phrase : qu'est-ce qui fait que quelqu'un choisit TKS plutôt qu'un autre à Kribi ?
> Hypothèse : un seul interlocuteur pour tout le séjour (transport + activités + services), qui répond vite sur WhatsApp.

**A5.** Tu as déjà une page Facebook, un compte Instagram, des flyers ? Si oui, envoie-moi les liens ou les fichiers, je m'en inspire pour le ton et les visuels.
> Hypothèse : non, tout est à créer.

## B. Services

**B1.** ⭐ Pour chaque pôle, donne-moi la liste **définitive** des services à afficher au lancement. Pour chacun : le nom, 2 ou 3 phrases de description, la durée si ça a un sens, le nombre de personnes max, ce qui est inclus et ce qui ne l'est pas, et des photos.
> Hypothèse : je pars des listes du cahier des charges avec des descriptions et des photos provisoires, à remplacer avant la mise en ligne.

**B2.** Les catégories dans chaque pôle, ça te va ?
- Transport : Courses à Kribi, Location avec chauffeur, Transferts, Transport professionnel, Transport scolaire, Location sans chauffeur
- Tourisme : Nature (Chutes de la Lobé, jacuzzi naturel), Aventure (jet-ski, quad, cheval), Détente (croisière, feux de plage), Culture (découverte de Kribi)
- Livraison : Colis, Commandes, Domicile, Courses, Professionnelle
> Hypothèse : oui.

**B3.** Il y a des services qui vont **forcément ensemble**, ou qui sont **incompatibles** (genre jet-ski et croisière le même jour) ?
> Hypothèse : aucune règle dans la V1 ; tu arbitres dans la conversation WhatsApp.

**B4.** Il y a des services saisonniers, ou pas toujours disponibles ?
> Hypothèse : tout est disponible ; je prévois quand même un statut « sur demande » et un statut « désactivé » par service.

**B5.** Les hébergements (hôtels, villas) : tu as déjà des partenaires signés avec des tarifs ? Sinon, OK pour les mettre dans une version 2 ?
> Hypothèse : version 2.

**B6.** Les formules / packs (Essentielle, Découverte, Premium) : tu as déjà leur contenu et leur prix ? Sinon, OK pour la version 2 ?
> Hypothèse : version 2.

## C. Prix

**C1.** ⭐ Pour chaque service, dis-moi comment le prix s'affiche :
- **Prix fixe** (ex. Transfert Douala → Kribi : 70 000 FCFA)
- **À partir de** (ex. Excursion en pirogue : à partir de 15 000 FCFA / personne)
- **Sur devis** (aucun prix affiché)
> Hypothèse : transferts et courses en prix fixe, activités en « à partir de », transport professionnel / scolaire et livraison professionnelle sur devis.

**C2.** ⭐ Pour chaque prix, c'est **par quoi** : par personne, par groupe, par course, par jour, par heure, par colis ?
> Hypothèse : activités par personne, transport par course ou par jour, livraison par colis.

**C3.** Le prix change selon le nombre de personnes (dégressif à partir de 4, par exemple) ? Si oui, comment ?
> Hypothèse : non, prix × quantité, simple.

**C4.** Le total dans « Mon séjour » sera une **estimation**. Quel texte tu veux sous le total ? Je propose : « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. »
> Hypothèse : cette phrase.

**C5.** Les prix en FCFA uniquement, ou aussi en euros pour les étrangers ?
> Hypothèse : FCFA uniquement.

**C6.** Il y a des frais que le visiteur doit connaître (acompte, annulation, carburant) ?
> Hypothèse : rien d'affiché ; on le mettra dans les conditions de chaque fiche si besoin.

## D. Parcours sur le site

**D1.** Pour une activité, le visiteur choisit un **nombre de personnes** ? Pour le transport, un **nombre de véhicules** ou de jours ? Pour la livraison, un **nombre de colis** ?
> Hypothèse : oui pour chacun, quantité 1 par défaut, avec un maximum raisonnable (10 personnes, 5 véhicules, 10 colis).

**D2.** Le visiteur doit obligatoirement donner ses dates de séjour et le nombre de voyageurs avant d'envoyer sa demande ?
> Hypothèse : c'est optionnel ; si c'est vide, le message WhatsApp n'en parle pas.

**D3.** Tu veux qu'on demande des détails par service (heure de départ, adresse, type de colis) avant l'envoi, ou tu préfères les obtenir dans la conversation WhatsApp ?
> Hypothèse : dans la conversation WhatsApp pour la V1 ; formulaires détaillés en V2.

**D4.** Le bouton « Demander un devis » et le bouton « Contacter sur WhatsApp » font la même chose (ouvrir WhatsApp avec le récap) ?
> Hypothèse : oui, avec une phrase d'intro différente.

**D5.** Si le visiteur revient sur le site plusieurs jours après, il retrouve sa sélection ?
> Hypothèse : oui, gardée sur son téléphone ou son ordinateur pendant 30 jours.

## E. WhatsApp

**E1.** ⭐ C'est quoi le numéro WhatsApp officiel de TKS, au format international (ex. +237 6XX XX XX XX) ? C'est un compte WhatsApp Business ?
> Hypothèse : un seul numéro, que tu m'envoies. Je mets un faux numéro en attendant.

**E2.** Un seul numéro pour tout, ou un numéro par pôle (transport, tourisme, livraison) ?
> Hypothèse : un seul numéro.

**E3.** Ce format de message te va ? (Le visiteur peut le modifier avant d'envoyer.)
```text
Bonjour TKS, je souhaite organiser un séjour à Kribi.
Dates : 12 au 14 janvier
Voyageurs : 2

Ma sélection :
- Transfert Douala → Kribi × 1 — 70 000 FCFA
- Excursion en pirogue × 2 pers. — à partir de 30 000 FCFA
- Transport professionnel × 1 — sur devis

Total estimatif : 100 000 FCFA (+ 1 prestation sur devis)

Merci de me faire une proposition.
```
> Hypothèse : ce format.

**E4.** Tu veux que le message contienne le nom du visiteur ? Ça oblige à lui demander un champ en plus.
> Hypothèse : non, WhatsApp t'affiche déjà le nom du contact.

**E5.** Sur ordinateur, WhatsApp s'ouvrira dans WhatsApp Web ou l'appli de bureau. Ça te va ?
> Hypothèse : oui.

## F. Contenu

**F1.** ⭐ Tu as un logo en haute résolution (idéalement vectoriel : SVG, AI, PDF) ?
> Hypothèse : non ; je mets un texte stylisé « TKS® » en attendant.

**F2.** ⭐ Tu as des photos de tes véhicules, des activités, de Kribi ? Tu as le droit de les utiliser (ce sont les tiennes ou tu as l'accord) ?
> Hypothèse : photos provisoires libres de droits, à remplacer avant la mise en ligne.

**F3.** Tu peux m'écrire : une présentation courte de TKS (2 phrases), une présentation longue pour « À propos » (1 paragraphe), et 4 raisons de choisir TKS ?
> Hypothèse : je rédige une proposition et tu la valides.

**F4.** Qu'est-ce qu'on affiche comme coordonnées : téléphone, e-mail, adresse ou zone (Kribi), horaires, réseaux sociaux ?
> Hypothèse : WhatsApp + « Kribi, Cameroun », c'est tout.

**F5.** Tu as des témoignages de vrais clients qu'on peut citer ? Sinon, pas de section avis.
> Hypothèse : pas de section avis en V1.

**F6.** Tu veux une FAQ ? Si oui, c'est quoi les 5 questions que tes clients posent le plus ?
> Hypothèse : pas de FAQ en V1.

**F7.** Le site sera en français. Tu veux aussi une version anglaise ?
> Hypothèse : français uniquement en V1.

**F8.** Tu as un nom de domaine (ex. tks-kribi.com) ? Des adresses e-mail pro ?
> Hypothèse : à acheter ; je te proposerai des options.

## G. Design

**Comment on va faire pour le design.** Tu n'as pas à dessiner les écrans. Je vais préparer dans Figma plusieurs propositions de maquettes complètes, sur téléphone et sur ordinateur, et je te les montre pour que tu choisisses une direction. Les questions ci-dessous servent à orienter ces propositions : plus tu es précis, plus les premières maquettes seront proches de ce que tu veux.

**G1.** Le croquis utilise du bleu marine, du vert et du blanc. Ce sont les couleurs officielles de TKS, ou je peux explorer d'autres palettes ?
> Hypothèse : couleurs libres ; je te propose au moins une version proche du croquis et une version différente.

**G2.** Tu as une charte graphique (logo avec ses couleurs exactes, typographies, règles d'usage) ? Si oui, envoie-la : elle s'imposera à toutes les propositions.
> Hypothèse : non ; le logo (question F1) est la seule contrainte.

**G3.** Cite-moi 2 ou 3 sites ou applis que tu aimes (tourisme, transport, ou n'importe quoi d'autre) et dis-moi en un mot ce que tu aimes dedans (couleurs, photos, simplicité, ambiance…).
> Hypothèse : aucune référence ; je m'appuie sur ce qui se fait de bien dans le tourisme et la conciergerie.

**G4.** Dans le croquis, qu'est-ce que tu veux absolument retrouver ? Qu'est-ce qu'on peut laisser tomber ?
> Hypothèse : on garde la structure (grande image d'accueil, 3 pôles, grilles de cartes, panier, WhatsApp toujours visible) ; on abandonne les avis, la vidéo, les formules.

**G5.** Quelle ambiance tu veux que le visiteur ressente : luxe et épuré, chaleureux et coloré, aventure et nature, autre chose ? Il y a une ambiance à éviter absolument ?
> Hypothèse : chaleureux, orienté nature et mer, professionnel.

**G6.** C'est toi seul qui valides le design, ou quelqu'un d'autre aussi ? Il te faut combien de temps pour donner un retour sur une proposition ?
> Hypothèse : toi seul, retour sous une semaine.

**G7.** Tu préfères recevoir 2 ou 3 propositions différentes à comparer, ou une seule qu'on affine ensemble ?
> Hypothèse : 2 propositions différentes, puis on affine celle que tu choisis.

---

## Les points bloquants ⭐ en résumé

| Réf. | Point | Pourquoi c'est bloquant |
|---|---|---|
| B1 | Liste définitive des services | Sans elle, le site affiche du faux contenu |
| C1, C2 | Mode de prix et unité par service | Ça détermine l'affichage et le calcul du total |
| E1 | Numéro WhatsApp | Sans lui, aucune demande n'arrive |
| F1, F2 | Logo et photos | Un site tourisme sans vraies photos ne donne pas envie |

Tout le reste, on peut le décider pendant le développement.
