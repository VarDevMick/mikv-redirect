# Ouverture — F-01, F-08, F-12

## Intention

C'est la première chose que Charlotte voit après avoir scanné le QR. Elle
doit comprendre en une seconde que c'est pour elle, puis avoir envie de
faire défiler. Le trek n'est pas encore révélé ici.

## Comportement attendu

Quatre blocs apparaissent en fondu montant décalé : « Joyeux
anniversaire » (0,15 s), « Charlotte » (0,5 s), un grand **30 ans**
(0,9 s), puis l'accroche (1,5 s) et l'invitation à descendre (2,1 s).

Derrière le chiffre, un massif de montagne se lève en 1,8 s. Un feu
d'artifice part du bas et éclate au-dessus du 30 pendant environ sept
secondes.

Le « ans » fait un tiers de la taille du chiffre, aligné sur sa ligne de
base, en vert sapin.

## Contraintes et pièges

**Une seule montagne dans cette section.** Le massif *ou* une séparation en
bas, jamais les deux : avoir les deux a été jugé « bizarre, un double
massif ». La section d'ouverture n'a donc pas de `separation()`.

**Le feu d'artifice s'arrête pour de bon.** Après ~7 s et une fois les
dernières particules éteintes, la boucle `requestAnimationFrame` sort et ne
se relance pas. Une animation qui tournerait en fond viderait la batterie
d'un téléphone pour rien.

**Le canvas passe derrière le texte.** Les enfants directs de `.p1`
remontent en `z-index: 2`, le canvas reste à 1, le massif à 0.

**Le `#grosTrente` est un point d'ancrage.** La randonneuse mesure sa
position pour en émerger — voir `specs/trail.md`. Ne pas retirer cet
identifiant.

## Écarté

**Un soleil terracotta** derrière le chiffre — remplacé par le massif :
« peut-être autre chose que le soleil, je veux de l'esprit montagne ».

**Un dégradé doré animé sur le 30** — jurait avec la sobriété du trait une
fois la direction artistique passée au dessin.

**Un ciel étoilé scintillant** — sans objet sur un fond clair.

## Fichiers

- `src/components/hero/hero.js` — markup, styles, feu d'artifice
- Le texte est isolé dans l'objet `contenu`, en haut du fichier

## Prompt

> `src/components/hero/hero.js` est l'ouverture de la page : révélation en
> cascade, massif de montagne derrière le grand 30, feu d'artifice de
> bienvenue. Contraintes : une seule montagne dans la section (le massif,
> pas de séparation en bas), le feu d'artifice doit s'arrêter complètement
> après la fête, et l'identifiant `#grosTrente` sert d'ancrage à la
> randonneuse. Un soleil et un 30 doré ont déjà été essayés et rejetés.
