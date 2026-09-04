# Musique — F-18

## Intention

Faire entendre « Joyeux anniversaire » à l'ouverture de la page, sans
héberger de fichier et sans acquitter de droits.

## Comportement attendu

La mélodie est **synthétisée à la volée** par l'API Web Audio : deux
oscillateurs à l'octave par note, enveloppe douce, timbre de boîte à
musique. Elle joue deux fois, soit environ 23 secondes, puis s'arrête.

Un bouton rond en haut à droite permet de couper, ou de relancer une fois
terminée.

## Contraintes et pièges

**Le son ne peut pas démarrer tout seul.** C'est une règle des navigateurs,
non contournable. Chrome comme Safari n'acceptent qu'une **activation
utilisateur discrète** — appui, clic, touche. **Un défilement n'en est pas
une**, malgré les apparences.

Le code applique donc trois précautions, chacune ayant corrigé un échec
réel :

1. **Tampon muet joué pendant le geste** — un son d'un échantillon, qui
   ouvre réellement la sortie audio sur iOS. Sans lui, rien ne sortait.
2. **`resume()` appelé dans le geste même**, le contexte naissant suspendu.
3. **Nouvelle tentative à chaque geste suivant** — la version initiale
   posait `lance = true` avant de savoir si le réveil avait réussi, et
   n'essayait donc jamais de nouveau. C'était un vrai bug.

**Repli visible, parce que ça peut échouer quand même.** Le bouton pulse
tant que la musique n'a pas démarré, et une mention « Appuie pour la
musique » apparaît si le défilement a commencé sans son. C'est la réponse
au cas où le navigateur refuse malgré tout.

**Deux passes plutôt qu'une boucle.** Une passe dure 11,2 s ; deux font
23 s et se terminent sur une phrase complète. Couper net à 20 s tomberait
au milieu d'une mesure, ce qui s'entend immédiatement.

**Sur iPhone, l'interrupteur silencieux coupe le Web Audio.** Aucun code ne
peut passer outre. À savoir avant de conclure à un bug.

## Écarté

**Un enregistrement audio hébergé** — poids, droits sur l'interprétation,
et un fichier de plus à servir. La synthèse ne coûte rien.

**Le démarrage sur `scroll`** — écouté, mais ne constitue pas une
activation valide. Conservé dans la liste des événements par acquit de
conscience, sans y compter.

## Fichiers

- `src/components/music/music.js` — mélodie, bouton, logique de déblocage

## Prompt

> `src/components/music/music.js` joue « Joyeux anniversaire » synthétisé
> par l'API Web Audio, sans aucun fichier. Les navigateurs interdisent le
> son sans geste utilisateur discret — un défilement ne suffit pas. Le code
> débloque la sortie par un tampon muet joué pendant le geste, appelle
> `resume()` dans ce même geste, et réessaie à chaque geste suivant si ça a
> échoué. Garde le repli visuel (bouton qui pulse, mention « Appuie pour la
> musique »). La mélodie joue deux fois pour finir sur une phrase complète.
