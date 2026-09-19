# Brief — mini-site immersif, 60 ans de Carol

Brief fourni par Mickael le 2026-09-19. Il remplace le concept décrit dans
`projet-60-edimbourg.md` (page défilante à plan fixe) par une **expérience
cartographique continue** pilotée au scroll. `projet-60-edimbourg.md` reste
la référence pour la partie opérationnelle : plaque QR, gel de `/60`.

Le travail se fait sur `/61`. `/60` est le rendu final : on n'y touche pas
tant que `/61` n'est pas validée.

Correction apportée le même jour : le vol part de **Roissy-Charles-de-Gaulle**,
et non d'Orly comme l'écrivait le brief d'origine.

## Vision

Ce n'est ni un site touristique, ni une application de réservation, ni une
succession de pages. C'est une **expérience cadeau verticale**, découverte
au pouce sur un smartphone. Le principe narratif tient en une phrase :

> Le scroll fait avancer le voyage.

La carte est le fil rouge de bout en bout :

```
Reims → 🚗 → Paris-Roissy → ✈️ → Édimbourg → 🗺️
  Jour 1 (4 arrêts) → Jour 2 (4 arrêts) → Jour 3 (4 arrêts)
    → ❤️ Joyeux 60 ans Maman
```

## Les faits

| Sujet | Valeur |
|---|---|
| Fêtée | Carol, 60 ans |
| Offert par | Chloé, sa fille |
| Troisième voyageur | Hector, 11 mois, en poussette |
| Dates | du 1er au 3 décembre 2026 |
| Destination | Édimbourg, Écosse |
| Trajet | Reims → Paris-Roissy en voiture, puis vol vers Édimbourg |

## Carte unique

Point fondamental : **une seule carte** accompagne toute l'histoire, seule
sa caméra change d'échelle. Ne pas créer une carte par étape.

1. **France** — vue large Reims + Paris, zoom sur Reims, la voiture part
2. **Vol** — fort dézoom : Paris → France → Manche → Royaume-Uni → Écosse
3. **Édimbourg** — rapprochement progressif jusqu'au niveau rue
4. **Exploration** — même carte, échelle ville, un tracé par journée

## Stack

React, TypeScript, Vite, Leaflet + OpenStreetMap, GSAP + ScrollTrigger.
Pas de dépendance ajoutée sans valeur réelle.

## Mobile first

Cibles : 375×667, 390×844, 430×932, en portrait. Tablette et desktop
doivent fonctionner, mais le design ne part jamais du desktop. Sur desktop,
mise en page cinématographique : texte à gauche, carte à droite.

## Séquences

**Intro** — fond sombre, texte révélé progressivement, aucune grosse
animation. « Carol, » · « Pour tes 60 ans... » · « J'avais envie de
t'offrir quelque chose qu'on ne peut pas vraiment emballer. » · « Alors
j'ai préparé un petit voyage. » · « ↓ Fais défiler »

**Révélation** — « Prépare ta valise... » · « On part... » · puis
**ÉDIMBOURG** · « 🏴 Écosse » · « 1er → 3 décembre 2026 ». Premier moment
waouh.

**Reims → Roissy** — la carte apparaît, zoom sur Reims, une voiture suit une
vraie trajectoire géographique, la caméra la suit, le tracé se dessine
derrière elle. « Première étape... » · « 🚗 Reims → Paris-Roissy ».

**Roissy** — la voiture s'arrête, pause. « Paris-Roissy » · « Bon... Maintenant,
on décolle. » La voiture disparaît, la carte dézoome.

**Vol** — avion simple et élégant, en sept temps : au sol, décollage,
montée, dézoom (Paris, France, Manche, Royaume-Uni), route, zoom sur
l'Écosse, arrivée. L'avion ralentit puis disparaît.

**Arrivée** — respiration. « BIENVENUE À ÉDIMBOURG » · « Trois jours. Tous
ensemble. » · « Chloé + Carol + Hector ❤️ ». La carte devient carte de
ville : les rues apparaissent, puis « Maintenant... découvrons Édimbourg. »

**Anniversaire** — entre le jour 1 et le jour 2 : « Au fait... » · « Ce
voyage est pour toi. » · « Parce que 60 ans, ça mérite quand même un petit
détour par l'Écosse. » Ton légèrement drôle, mais élégant.

**Fin** — la carte ralentit, marqueurs visibles, résumé : « 3 jours »,
« 12 découvertes », « 1 nouvelle ville ». Puis « Mais surtout... », la
carte s'efface, fond sombre : « Des souvenirs à créer ensemble. » ·
« Joyeux 60 ans Maman ❤️ » · « Ce voyage est pour toi. » · « Avec tout mon
amour, Chloé » · « On part à Édimbourg. » Enfin, réapparition brève de la
carte avec le trajet complet Reims → Édimbourg, puis dernier dézoom.

## Programme — 3 jours, 4 activités par jour

**Jour 1 · 1er décembre — Premiers pas à Édimbourg**
« On découvre la ville tranquillement. »
Edinburgh Castle · Royal Mile · Victoria Street · Grassmarket

**Jour 2 · 2 décembre — Édimbourg en hiver**
« Aujourd'hui, on profite de l'ambiance de décembre. »
Princes Street Gardens · Edinburgh Christmas Market · National Museum of
Scotland · Calton Hill

Prévoir dans les données une alternative à Calton Hill si la météo ou la
poussette rendent l'étape peu pratique.

**Jour 3 · 3 décembre — Une dernière journée**
« Avant de reprendre l'avion... »
Royal Yacht Britannia · Dean Village · Stockbridge · un dernier lieu à
choisir plus tard, plus émotionnel que touristique.

Le rythme n'est pas une course : Hector a 11 mois, il y a une poussette,
des pauses, des repas, de la fatigue, la météo de décembre et des temps de
déplacement. Les activités sont les grandes étapes du séjour, pas des
obligations horaires.

## Micro-messages

Rares, pour la personnalité, jamais pour faire dessin animé : « Petite
pause poussette 👶 » · « Pause café obligatoire ☕ » · « Hector valide. » ·
« On continue ? » · « Pas mal pour commencer... » · « Il fait froid ? On
rentre se réchauffer. »

## Comportement de la carte

Sticky pendant les journées, mise à jour selon l'activité active. Sur
mobile : carte en haut, carte d'activité en dessous. Le scroll vertical
reste prioritaire — limiter ou désactiver les interactions tactiles de
Leaflet pendant les séquences animées. La carte est contrôlée par le
récit, jamais manipulée à la main.

Apparence personnalisée, pas d'aspect « outil technique » : peu de labels,
peu de POI, peu de couleurs. Les lieux importants ressortent, le reste
reste secondaire.

Quand une activité devient active : titre, marqueur, déplacement de
caméra, tracé qui se dessine, mise en évidence du lieu, puis contenu.

## Données

Séparées des composants, coordonnées GPS **vérifiées** (jamais inventées),
centralisées — aucun `lat`/`lng` en dur dans un composant.

```ts
interface Activity {
  id: string; title: string; description: string; time?: string;
  lat: number; lng: number; icon?: string; babyFriendly?: boolean;
}
interface Day {
  id: string; date: string; title: string; subtitle: string;
  activities: Activity[];
}
```

Pour les trajets urbains, préférer un tracé cohérent avec les rues à une
ligne droite quand c'est possible — mais **l'expérience visuelle prime sur
la précision** : le site n'est pas un GPS.

## Design

Hiver, Écosse, élégant, chaleureux, familial, légèrement cinématographique.
Bleu nuit, gris pierre, blanc cassé, doré, bordeaux. Une police élégante
pour les grands titres, une très lisible pour les textes.

L'expérience ne dépend pas des images : carte, typographie, animations,
formes et couleurs suffisent. Prévoir quand même des emplacements photo,
faciles à remplir plus tard.

## Contraintes techniques

- Animer `opacity` et `transform` (scale, translate, rotation légère) ;
  éviter ce qui provoque un reflow, et les grosses animations simultanées
- Viser 60 FPS sur mobile ; surveiller Leaflet, ScrollTrigger, parallax,
  blur, images, animations de caméra
- Contraste, tailles tactiles, `prefers-reduced-motion` : réduire
  fortement les déplacements sans perdre le récit
- Aucun son en autoplay. Musique éventuelle : bouton discret, volontaire,
  avec volume, et le site marche sans
- Jamais de narration calée sur un nombre de pixels : progression calculée
  dynamiquement, correcte du petit téléphone au desktop

## Ordre de développement

1. Squelette : projet, sections, styles, responsive
2. Storytelling : intro, révélation, destination, fin
3. Carte Leaflet : zoom, déplacement, marqueurs, tracé
4. Reims → Roissy : carte France, voiture, itinéraire, caméra
5. Roissy → Édimbourg : avion, trajectoire, dézoom, zoom, arrivée
6. Système générique `DaySection → ActivityStep → mise à jour carte`
7. Les 12 activités
8. Synchronisation fine scroll ↔ carte ↔ contenu
9. Micro-interactions, détails familiaux, séquence anniversaire
10. Optimisation mobile

**Ne pas implémenter les 12 activités tant que la première séquence
(intro → révélation → Reims → voiture → Roissy) n'est pas visuellement
satisfaisante.**

## Règle de design

À chaque décision : *est-ce que cela rend le voyage plus magique à
découvrir en scrollant ?* Si oui, on garde. Si ça ressemble à une
fonctionnalité d'application classique, on simplifie. Le résultat doit
ressembler à un petit film interactif, pas à un site touristique. Et pas
de sur-ingénierie : le projet reste petit, maintenable, facile à modifier.

## Critères d'acceptation

**Expérience** — on comprend immédiatement que c'est un cadeau ; Carol est
interpellée ; les 60 ans sont clairs ; Chloé est identifiée ; Hector fait
partie de l'histoire ; on a envie de continuer à scroller.

**Voyage** — Reims apparaît ; la voiture roule vers Roissy ; Roissy apparaît ;
l'avion décolle, traverse France/Manche/Royaume-Uni, arrive à Édimbourg ;
la caméra se rapproche progressivement de la ville.

**Carte** — une seule logique cartographique ; zooms naturels ; marqueurs
au bon moment ; itinéraires animés ; caméra au service du récit.

**Programme** — 3 jours, 4 activités par jour, 12 au total,
géographiquement cohérentes, compatibles avec un bébé de 11 mois, pauses
possibles.

**Final** — le cadeau des 60 ans est rappelé ; « Joyeux 60 ans Maman ❤️ »
apparaît ; Chloé signe ; la dernière séquence rappelle visuellement
Reims → Édimbourg.
