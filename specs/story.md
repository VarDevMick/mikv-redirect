# Récit — F-03, F-04, F-05

## Intention

Enchaîner entre l'anniversaire et les étapes : poser l'invitation, nommer
la destination, puis conclure sur le concret. Le ton reste celui d'une
proposition entre frère et sœur, pas d'un descriptif d'agence.

## Comportement attendu

Deux sections d'enchaînement, puis une conclusion :

- **Invitation** — « Et si on partait crapahuter ensemble ? », « Quand tu
  veux, tu choisis. »
- **Destination** — boussole, GR58, Tour du Queyras, 3 jours et 2 nuits, la
  mention que ce sont les étapes les plus douces du tour.
- **Le bon plan** — refuges en demi-pension, matériel, période, répartition
  des rôles, puis la signature.

Une section vidéo apparaît en dernier si la constante `VIDEO` est
renseignée.

## Contraintes et pièges

**Rien n'est imposé.** La formulation est interrogative et la date ouverte.
Une version antérieure annonçait « Cet automne, on part crapahuter » : c'est
factuellement faux, les refuges ferment fin septembre, et ça retirait à
Charlotte le choix de la date.

**La fenêtre praticable est fin juin à mi-septembre**, contrainte par
l'enneigement des cols et l'ouverture des refuges — le refuge de Furfande
ferme le 26 septembre. Ne pas élargir cette fenêtre sans vérifier.

**La vidéo ne démarre pas seule.** Les navigateurs refusent la lecture
automatique avec le son. Elle porte donc `controls` et `playsinline`, et
démarre au toucher. Elle est placée en toute fin, comme mot de la fin.

**Au-delà de 100 Mo, GitHub refuse le fichier.** Une minute filmée en 4K
dépasse largement. Prévoir un passage en 1080p, ou un hébergement externe.

## Écarté

**Une date annoncée** — voir ci-dessus.

**La section vidéo toujours présente mais vide** — laissait un bloc creux.
Elle n'existe désormais pas du tout dans le HTML tant que `VIDEO` est vide.

## Fichiers

- `src/components/story/story.js` — les deux sections d'enchaînement, la
  conclusion, et la constante `VIDEO`

## Prompt

> `src/components/story/story.js` porte les sections de récit entre
> l'ouverture et les étapes, plus la conclusion. Le ton est une proposition
> ouverte : aucune date imposée, la fenêtre praticable est fin juin à
> mi-septembre à cause des refuges. La section vidéo n'apparaît que si la
> constante `VIDEO` est renseignée, et elle démarre au toucher — la lecture
> automatique avec son est refusée par les navigateurs.
