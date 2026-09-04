# Fonctionnalités

Inventaire complet de ce que fait le projet, avant découpage en modules.
Chaque fonctionnalité porte un identifiant (`F-xx`) réutilisé dans les specs.

---

## Contexte

Page-cadeau pour les 30 ans de Charlotte. Elle scanne un QR code gravé sur
une plaque imprimée en 3D, qui l'amène sur une page révélant progressivement
une invitation à faire le GR58 (Tour du Queyras) ensemble.

Deux adresses vivent en parallèle :

| Adresse | Rôle | Statut |
|---|---|---|
| `mikv.io/30` | La page offerte, visée par le QR imprimé | **Gelée** — ne plus modifier |
| `mikv.io/31` | Copie de travail, bandeau `DEV` | Modifiable |

---

## A. Contenu et récit

### F-01 · Révélation en cascade
Ouverture en plein écran : « Joyeux anniversaire », « Charlotte », puis un
grand **30 ans**. Les quatre blocs apparaissent en fondu montant décalé
(0,15 s à 2,1 s). Le mot « ans » est en vert sapin, à un tiers de la taille
du chiffre, aligné sur sa ligne de base.

### F-02 · Itinéraire du trek
Trois étapes du GR58, choisies comme le trio consécutif le plus accessible
du tour (étapes 7, 8 et 9 officielles) :

| Jour | Trajet | Marche | D+ | D− |
|---|---|---|---|---|
| 1 | Souliers → Chalp d'Arvieux (col Tronchet) | 4h | +510 m | −660 m |
| 2 | Chalp d'Arvieux → Refuge de Furfande | 5h | +820 m | −210 m |
| 3 | Refuge de Furfande → Bramousse (col Lauze) | 4h30 | +210 m | −1000 m |

Source : étapes officielles du Tour du Queyras (lequeyras.com). Les distances
en kilomètres sont volontairement absentes : la source ne les fournit pas.

### F-03 · Proposition ouverte
Aucune date imposée. La page dit « Et si on partait crapahuter ensemble ? »
et précise la fenêtre praticable (fin juin à mi-septembre, contrainte par
l'ouverture des refuges et l'enneigement des cols).

### F-04 · Récapitulatif pratique
Nuits en refuge en demi-pension, matériel, période, répartition des rôles.

### F-05 · Section vidéo optionnelle
Pilotée par la constante `VIDEO`. Vide → la section n'existe pas dans le
HTML produit. Renseignée → une dernière section affiche un lecteur avec
`controls` et `playsinline` (la lecture automatique avec son est refusée par
les navigateurs, donc démarrage au toucher).

---

## B. Décor et direction artistique

### F-06 · Palette
Papier crème, encre brune, terracotta, ocre, vert sapin, pierre chaude.
Déclarée en variables CSS, un seul point de changement.

### F-07 · Séparations en plans successifs
Entre les sections, un paysage dessiné : chaîne lointaine en pierre chaude
avec sommets enneigés, versant boisé planté de sapins, alpage ocre, puis un
premier plan qui **prend la couleur de la section suivante** pour assurer la
transition. Contours au trait fin.

### F-08 · Massif d'ouverture
Décor de montagne dessiné derrière le grand 30 : trois sommets, deux neiges,
pente boisée, alpage. Apparaît en fondu montant au chargement.

### F-09 · Fond propre aux étapes
La section des étapes a un fond ocre soutenu texturé de **courbes de niveau**
(motif SVG répété en `data:` URI), qui la distingue au premier coup d'œil des
autres blocs et fait ressortir les cartes.

### F-10 · Cartes d'étape en photo pleine
Chaque étape est une carte unique : la photo occupe tout le bloc, un voile
dégradé (transparent en haut, 90 % en bas) garantit la lisibilité du texte
posé dessus, quelle que soit l'image. Coins biseautés en haut à gauche et en
bas à droite.

### F-11 · Photothèque libre de droits
Trois photos des lieux réels, issues de Wikimedia Commons sous licence libre,
avec leur crédit conservé dans le code. Aucune image sous droits, aucun
hotlink vers un site tiers susceptible de casser.

---

## C. Animation et interaction

### F-12 · Feu d'artifice d'accueil
Canvas 2D dans la section d'ouverture. Des fusées montent, éclatent en
gerbes de particules aux couleurs de la palette, avec gravité et
amortissement. Dure ~7 s puis **l'animation s'arrête complètement** (pas de
boucle qui consommerait la batterie). Désactivée si le système demande des
animations réduites.

### F-13 · Sentier vertical
Colonne de gauche : un chemin en lacets (huit courbes) tracé en SVG sur toute
la hauteur de la fenêtre. La portion **déjà parcourue se dessine** en couleur
derrière la randonneuse (`stroke-dashoffset`), la suite reste en pointillés
pâles.

### F-14 · Randonneuse animée
Personnage en aplats (cheveux roux ondulés, sac ocre, veste verte, bâton).

- **Apparition** : invisible au chargement, elle émerge du 30 doré dès les
  premiers pixels de défilement, en grandissant depuis le centre du chiffre.
- **Progression** : sa position est calculée sur la courbe du sentier
  (`getPointAtLength`), donc elle marche exactement sur le tracé.
- **Orientation** : elle se retourne selon le sens de la pente.
- **Démarche** : jambes alternées, bras qui balance, buste qui tangue, mèche
  qui ondule.

### F-15 · Bivouacs aux étapes
À hauteur de chaque étape, elle s'arrête (animation figée), une tente
apparaît sur le sentier et elle se tourne vers elle.

### F-16 · Couchage final
En fin de page, elle quitte le sentier, rejoint le milieu bas, s'efface et
cède la place à une scène de sommeil : duvet, oreiller, cheveux étalés,
sourire, sac posé, « z » qui montent, respiration du duvet.

### F-17 · Carte interactive des étapes
Plan collé en haut de la section des étapes : tracé stylisé à quatre points
clés. À mesure qu'on atteint chaque étape, le point s'active et le trait
parcouru progresse. Utilise `IntersectionObserver`.

### F-18 · Musique d'anniversaire
Mélodie de « Joyeux anniversaire » **synthétisée à la volée** par l'API Web
Audio (mélodie du domaine public, aucun fichier hébergé, aucun droit à
acquitter). Deux oscillateurs à l'octave pour un timbre chaud. Jouée deux
fois, soit ~23 s.

Contrainte navigateur : le son est interdit sans geste utilisateur. Le code
en tient compte — déblocage par tampon muet, `resume()` dans le geste même,
nouvelle tentative à chaque geste suivant. Repli visuel si le navigateur
refuse quand même : le bouton pulse et une mention « Appuie pour la musique »
apparaît.

### F-19 · Défilement
Barre de défilement masquée, alignement doux des sections (`scroll-snap`
proximity). Le défilement appartient au document, condition nécessaire pour
que tout ce qui suit le scroll fonctionne.

---

## D. Fabrication du QR code

### F-20 · Génération du QR
Encode `https://mikv.io/30`, niveau de correction **H** (30 % de redondance).
Sorties : SVG vectoriel, PNG pour l'impression papier, fichier OpenSCAD.

### F-21 · Style arrondi
Les suites horizontales de modules deviennent des barres à bouts ronds, les
modules isolés des points. Les trois repères d'angle sont des anneaux
arrondis.

**Piège vérifié** : au-delà d'un rayon de 1,2 module, les coins des repères
disparaissent et le code devient illisible. La valeur est plafonnée.

### F-22 · Chiffre au centre
Zone de 11 × 11 modules évidée au centre pour loger un « 30 ». Représente
14 % du code, largement dans les 30 % que la correction H sait reconstituer.

### F-23 · Texte gravé
Texte sous le QR, converti en géométrie 3D depuis une vraie police
(`opentype.js` pour les contours, `earcut` pour la triangulation, extrusion
maison). Se redimensionne : un texte long rétrécit, un texte court grossit.

### F-24 · Plaque bicolore imprimable
Deux STL alignés dans le même repère — plaque blanche, motif noir — à charger
ensemble dans le trancheur et à affecter à deux filaments. **Une seule
transition de couleur** sur toute l'impression, donc une purge minimale.
Coins arrondis, taille paramétrable par la taille d'un module.

### F-25 · Vérification du QR
Chaîne de contrôle avant impression, pour ne pas graver un code illisible :

1. Comparaison **module par module** de la géométrie produite contre la
   matrice théorique (841 modules, 0 divergence attendue).
2. Décodage réel du rendu par le moteur **Vision d'Apple**, le même que
   l'appareil photo de l'iPhone.
3. Test de robustesse : décodage encore réussi sur une image réduite à
   160 px de large.

---

## E. Publication

### F-26 · Export statique
`scripts/build-static.mjs` transforme les pages en fichiers statiques dans
`docs/`, plus une page d'accueil neutre à la racine et le fichier `CNAME`.

### F-27 · Hébergement
GitHub Pages sert `docs/` sur le domaine `mikv.io`. Le DNS reste chez
Porkbun : un enregistrement **ALIAS** pointe vers `vardevmick.github.io`,
sans changement de serveurs de noms. HTTPS forcé, certificat automatique.

**Piège rencontré** : GitHub n'avait pas demandé le certificat de lui-même.
Retirer puis remettre le domaine personnalisé force la vérification DNS et
débloque l'émission.

### F-28 · Adresse sans slash
Le QR encode `https://mikv.io/30`, sans slash final. GitHub Pages redirige
en 301 vers `/30/` et sert la page — vérifié de bout en bout.

---

## Dette connue

- `src/page-30.js` reste monolithique (~1200 lignes) : c'est voulu, la page
  est gelée. `/31` a été découpée en composants sous `src/components/`.
- `src/index.js` et `wrangler.toml` sont les reliquats de la première
  tentative d'hébergement sur Cloudflare Workers, abandonnée. Non utilisés.
- `.wrangler/` traîne dans le dépôt sans être ignoré.
