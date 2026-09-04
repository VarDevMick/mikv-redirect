# Publication — F-26, F-27, F-28

## Intention

Servir la page à l'adresse exacte que vise le QR code gravé sur la plaque :
`https://mikv.io/30`. Cette adresse est figée dans un objet physique, elle
ne peut plus changer.

## Comportement attendu

`node scripts/build-static.mjs` écrit dans `docs/` :

| Fichier | Adresse | Statut |
|---|---|---|
| `docs/30/index.html` | `mikv.io/30` | **gelée** |
| `docs/31/index.html` | `mikv.io/31` | page de travail, bandeau DEV |
| `docs/index.html` | `mikv.io` | page neutre, ne dévoile rien |
| `docs/CNAME` | — | domaine personnalisé |

GitHub Pages sert `docs/` depuis la branche `main`. Chaque `git push`
redéploie en une à deux minutes.

## Contraintes et pièges

**Le DNS reste chez Porkbun.** Un enregistrement **ALIAS** pointe vers
`vardevmick.github.io`, sans changer les serveurs de noms. Un ALIAS suit
automatiquement GitHub si leurs adresses IP changent, contrairement à des
enregistrements A figés.

C'est aussi ce qui a permis d'éviter Cloudflare, dont l'ajout de domaine
exigeait de lui confier tout le DNS — l'étape qui bloquait.

**Le certificat HTTPS peut ne jamais être demandé.** GitHub le déclenche
normalement après validation du DNS ; ici il ne l'a pas fait, et l'attente
aurait pu durer indéfiniment. Le remède : **retirer puis remettre le domaine
personnalisé**, ce qui force la vérification. Certificat approuvé en
quelques secondes.

```bash
gh api -X PUT repos/OWNER/REPO/pages -f cname=""
gh api -X PUT repos/OWNER/REPO/pages -f cname="mikv.io"
```

Attention : ces appels commitent eux-mêmes `docs/CNAME` dans le dépôt. Un
`git pull --rebase` sera nécessaire avant le prochain push.

**Le QR encode l'adresse sans slash final.** GitHub Pages redirige `/30`
vers `/30/` en 301 puis sert la page — vérifié de bout en bout. Le HTTP
bascule aussi vers HTTPS, donc même un lecteur ancien retombe sur ses
pieds.

**Le dépôt est public** parce que GitHub Pages sur dépôt privé exige un
abonnement payant. Sans conséquence ici : la page est publique de toute
façon, seul le code source devient visible.

## Après chaque modification

1. `node scripts/build-static.mjs`
2. Vérifier que `docs/30/index.html` **n'a pas changé** — `/30` est gelée
3. Publier, attendre le déploiement, contrôler l'adresse en ligne

## Écarté

**Cloudflare Workers** — première approche, abandonnée : l'ajout du domaine
dans Cloudflare restait bloqué, et il aurait fallu confier tout le DNS. Ses
fichiers ont été supprimés du dépôt.

**GitHub Pages sur dépôt privé** — nécessite GitHub Pro.

**Netlify** — aurait gardé le dépôt privé, écarté pour éviter un compte de
plus.

## Fichiers

- `scripts/build-static.mjs` — l'export
- `docs/` — ce que GitHub sert

## Prompt

> `scripts/build-static.mjs` exporte les pages en statique dans `docs/`,
> servi par GitHub Pages sur `mikv.io`, DNS chez Porkbun via un ALIAS.
> `/30` est gelée : après toute modification, vérifie que
> `docs/30/index.html` n'a pas bougé. Si le certificat HTTPS n'est pas émis,
> retire puis remets le domaine personnalisé via l'API GitHub, ce qui force
> la vérification — et pense au `git pull --rebase` ensuite, ces appels
> commitent `docs/CNAME`.
