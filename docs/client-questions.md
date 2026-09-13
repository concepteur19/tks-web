# Questionnaire client — TKS® site web

**À destination de** : TKS® (Franck)
**De la part de** : l'équipe de développement
**Date** : 2026-09-13
**Objectif** : valider les points qui conditionnent la première version du site. Répondez directement sous chaque question, même brièvement. Les points marqués ⭐ sont bloquants pour livrer la V1.

Pour chaque question, une **hypothèse temporaire** indique ce que nous ferons en attendant votre réponse.

---

## A. Business

**A1.** Quel est l'objectif numéro un du site pour les 6 prochains mois : recevoir des demandes WhatsApp, faire connaître TKS, ou vendre des séjours complets ?
> Hypothèse : recevoir un maximum de demandes WhatsApp qualifiées.

**A2.** Qui sont vos clients prioritaires : touristes camerounais (Douala, Yaoundé), expatriés, touristes étrangers, entreprises ?
> Hypothèse : particuliers venant de Douala et Yaoundé pour un week-end ou un séjour, francophones.

**A3.** Dans votre vocal, vous évoquiez l'idée de lancer d'abord le **tourisme**. Le cahier des charges met les trois pôles au même niveau. Quelle est votre priorité réelle au lancement : les trois pôles complets, ou Tourisme complet avec Transport et Livraison réduits (2 ou 3 services chacun) ?
> Hypothèse : les trois pôles au niveau du cahier des charges, avec le contenu Tourisme travaillé en premier.

**A4.** En une phrase, qu'est-ce qui différencie TKS des autres prestataires de Kribi ?
> Hypothèse : un seul interlocuteur pour tout le séjour (transport + activités + services), réactif sur WhatsApp.

**A5.** Existe-t-il déjà des supports (page Facebook, Instagram, flyers) dont on peut reprendre le ton et les visuels ?
> Hypothèse : non, tout est à créer.

## B. Services

**B1.** ⭐ Pour chaque pôle, donnez la liste **définitive** des services à afficher au lancement, avec pour chacun : nom, description en 2 à 3 phrases, durée si pertinent, nombre de personnes max, conditions (ce qui est inclus ou non), et photos.
> Hypothèse : nous utilisons les listes du cahier des charges avec des descriptions et photos provisoires, à remplacer avant mise en ligne.

**B2.** Les catégories à l'intérieur de chaque pôle vous conviennent-elles ?
- Transport : Courses à Kribi, Location avec chauffeur, Transferts, Transport professionnel, Transport scolaire, Location sans chauffeur
- Tourisme : Nature (Chutes de la Lobé, jacuzzi naturel), Aventure (jet-ski, quad, cheval), Détente (croisière, feux de plage), Culture (découverte de Kribi)
- Livraison : Colis, Commandes, Domicile, Courses, Professionnelle
> Hypothèse : oui.

**B3.** Certains services sont-ils **combinables uniquement** ensemble, ou **incompatibles** entre eux (ex. jet-ski et croisière le même jour) ?
> Hypothèse : aucune règle de compatibilité en V1 ; TKS arbitre dans la conversation WhatsApp.

**B4.** Certains services sont-ils saisonniers ou temporairement indisponibles ?
> Hypothèse : tous disponibles ; nous prévoyons un statut « sur demande » et « désactivé » par service.

**B5.** Les hébergements (hôtels, villas) : avez-vous déjà des partenaires signés avec des tarifs ? Sinon, acceptez-vous de les reporter à une version 2 ?
> Hypothèse : reportés en V2.

**B6.** Les formules / packs (Essentielle, Découverte, Premium) : avez-vous déjà leur contenu et leur prix ? Sinon, acceptez-vous de les reporter à une version 2 ?
> Hypothèse : reportés en V2.

## C. Pricing

**C1.** ⭐ Pour chaque service, indiquez le mode de prix :
- **Prix fixe** (ex. Transfert Douala → Kribi : 70 000 FCFA)
- **À partir de** (ex. Excursion en pirogue : à partir de 15 000 FCFA / personne)
- **Sur devis** (aucun prix affiché)
> Hypothèse : transferts et courses en prix fixe, activités en « à partir de », transport professionnel / scolaire et livraison professionnelle sur devis.

**C2.** ⭐ Pour chaque prix, précisez l'**unité** : par personne, par groupe, par course, par jour, par heure, par colis.
> Hypothèse : activités par personne, transport par course ou par jour, livraison par colis.

**C3.** Le prix varie-t-il selon le nombre de personnes (ex. dégressif à partir de 4) ? Si oui, comment ?
> Hypothèse : non, prix linéaire (prix × quantité) en V1.

**C4.** Le total affiché dans « Mon séjour » sera une **estimation**. Quel texte voulez-vous voir sous le total ? Proposition : « Prix indicatif, sous réserve de disponibilité et de confirmation par TKS. »
> Hypothèse : cette formulation.

**C5.** Faut-il afficher les prix en FCFA uniquement, ou aussi en euros pour les touristes étrangers ?
> Hypothèse : FCFA uniquement.

**C6.** Y a-t-il des frais que le visiteur doit connaître (acompte, annulation, carburant) ?
> Hypothèse : aucun affiché ; à préciser dans les conditions de chaque fiche si besoin.

## D. Parcours utilisateur

**D1.** Pour les activités, le visiteur choisit-il un **nombre de personnes** ? Pour le transport, un **nombre de véhicules** ou de jours ? Pour la livraison, un **nombre de colis** ?
> Hypothèse : oui pour chacun, avec une quantité par défaut de 1 et un maximum raisonnable (10 personnes, 5 véhicules, 10 colis).

**D2.** Le visiteur doit-il obligatoirement renseigner une date de séjour et un nombre de voyageurs avant d'envoyer sa demande ?
> Hypothèse : optionnels ; s'ils sont vides, le message WhatsApp les omet.

**D3.** Faut-il demander des informations détaillées par service (heure de départ, adresse, type de colis) avant l'envoi, ou préférez-vous les obtenir dans la conversation WhatsApp ?
> Hypothèse : dans la conversation WhatsApp en V1 ; formulaires détaillés en V2.

**D4.** Le bouton « Demander un devis » et le bouton « Contacter sur WhatsApp » doivent-ils faire la même chose (ouvrir WhatsApp avec le récapitulatif) ?
> Hypothèse : oui, avec un message d'introduction différent.

**D5.** Si le visiteur revient sur le site plusieurs jours après, doit-il retrouver sa sélection ?
> Hypothèse : oui, conservée sur son appareil pendant 30 jours.

## E. WhatsApp

**E1.** ⭐ Quel est le numéro WhatsApp officiel de TKS, au format international (ex. +237 6XX XX XX XX) ? Est-ce un compte WhatsApp Business ?
> Hypothèse : un seul numéro, à fournir. Nous mettons un numéro factice en attendant.

**E2.** Un seul numéro pour tout, ou un numéro par pôle (transport, tourisme, livraison) ?
> Hypothèse : un seul numéro.

**E3.** Validez-vous ce format de message généré (le visiteur peut le modifier avant envoi) ?
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

**E4.** Souhaitez-vous que le message contienne le nom du visiteur ? Cela impose un champ supplémentaire.
> Hypothèse : non, WhatsApp affiche déjà le nom du contact.

**E5.** Sur ordinateur, WhatsApp s'ouvrira dans WhatsApp Web ou l'application de bureau. Est-ce acceptable ?
> Hypothèse : oui.

## F. Contenu

**F1.** ⭐ Avez-vous un logo en haute résolution (idéalement vectoriel : SVG, AI, PDF) ?
> Hypothèse : non ; nous utilisons un texte stylisé « TKS® » en attendant.

**F2.** ⭐ Avez-vous des photos de vos véhicules, des activités, de Kribi ? Avez-vous les droits pour les utiliser ?
> Hypothèse : photos provisoires libres de droits, à remplacer avant mise en ligne.

**F3.** Pouvez-vous fournir les textes suivants : présentation courte de TKS (2 phrases), présentation longue « À propos » (1 paragraphe), 4 raisons de choisir TKS ?
> Hypothèse : nous rédigeons une proposition que vous validerez.

**F4.** Coordonnées à afficher : téléphone, e-mail, adresse ou zone (Kribi), horaires, réseaux sociaux ?
> Hypothèse : WhatsApp + « Kribi, Cameroun » uniquement.

**F5.** Avez-vous des témoignages clients réels que l'on peut citer ? Sinon, nous n'afficherons pas de section avis.
> Hypothèse : pas de section avis en V1.

**F6.** Faut-il une FAQ ? Si oui, quelles sont les 5 questions que vos clients posent le plus ?
> Hypothèse : pas de FAQ en V1.

**F7.** Le site sera en français. Faut-il une version anglaise ?
> Hypothèse : français uniquement en V1.

**F8.** Avez-vous un nom de domaine (ex. tks-kribi.com) ? Des adresses e-mail professionnelles ?
> Hypothèse : à acheter ; nous proposerons des options.

## G. Design

**G1.** Le croquis utilise du bleu marine, du vert et du blanc. Sont-ce les couleurs de TKS ou une proposition à retravailler ?
> Hypothèse : proposition à retravailler dans Figma.

**G2.** Avez-vous une charte graphique (couleurs, typographies) existante ?
> Hypothèse : non.

**G3.** Quels sites ou applications aimez-vous, dans le tourisme ou ailleurs ? Donnez 2 ou 3 références.
> Hypothèse : aucune.

**G4.** Dans le croquis, quels éléments voulez-vous absolument conserver ? Lesquels abandonner ?
> Hypothèse : conserver la structure (hero, 3 pôles, grilles de cartes, panier, WhatsApp permanent) ; abandonner les avis, la vidéo, les formules.

**G5.** Le style souhaité : plutôt luxe et épuré, plutôt chaleureux et coloré, plutôt aventure et nature ?
> Hypothèse : chaleureux, orienté nature et mer, professionnel.

---

## Récapitulatif des points bloquants ⭐

| Réf. | Point | Pourquoi bloquant |
|---|---|---|
| B1 | Liste définitive des services | Sans elle, le site affiche des placeholders |
| C1, C2 | Mode de prix et unité par service | Détermine l'affichage et le calcul du total |
| E1 | Numéro WhatsApp | Sans lui, aucune conversion possible |
| F1, F2 | Logo et photos | Un site tourisme sans vraies photos ne convertit pas |

Tout le reste peut être décidé pendant le développement.
