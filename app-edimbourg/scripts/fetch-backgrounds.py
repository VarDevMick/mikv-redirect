#!/usr/bin/env python3
"""Fabrique les fonds de carte du voyage à partir d'OpenStreetMap.

Usage ponctuel, hors `npm run build` — à relancer seulement si un cadrage
change. Nécessite Pillow.

    python3 scripts/fetch-backgrounds.py

Pourquoi des images et non des tuiles : la caméra ne s'arrête jamais de
bouger, et une couche de tuiles réclamait près de 1 700 tuiles (~47 Mo) par
visite, en flux tendu pendant le récit. Trois images pesant quelques
centaines de kilo-octets, chargées une fois, suffisent — et plus rien
n'arrive en retard pendant le scroll.

Chaque fond couvre une échelle. On passe de l'un à l'autre en fondu, selon
l'étendue visible à l'écran (voir setBackdropForSpan dans journeyMap.ts) :

    couloir   niveau 10   le trajet Reims → Roissy, vu de près
    france    niveau 8    la montée de l'avion, la Manche
    ecosse    niveau 8    la descente et la révélation
    europe    niveau 6    la croisière

Le script écrit les images dans src/assets/fonds/ et leurs coordonnées
exactes dans src/data/backdrops.generated.ts.
"""
import math
import sys
import time
import urllib.request
from pathlib import Path

from PIL import Image

ICI = Path(__file__).resolve().parent
DOSSIER_IMAGES = ICI.parent / "src/assets/fonds"
FICHIER_TS = ICI.parent / "src/data/backdrops.generated.ts"

UA = (
    "mikv-redirect-birthday-page/1.0 (projet personnel ; fabrication ponctuelle "
    "d'un fond de carte ; contact varlet.micka@gmail.com)"
)
TUILE = 256

# Sud, ouest, nord, est — et le niveau de zoom auquel l'image est fabriquée.
# Les cadrages du récit sont dans src/map/framings.ts et dans les scènes ;
# ces fenêtres doivent les contenir largement, marges comprises.
FONDS = [
    {
        # Assez haut pour tenir le recul de caméra du milieu de trajet : à
        # 95 km de large sur un téléphone, l'écran couvre déjà 215 km du nord
        # au sud. Une fenêtre trop juste laissait apparaître le fond suivant,
        # plus flou, sur les bords.
        "id": "couloir",
        "zoom": 10,
        "sud": 47.60,
        "ouest": 2.00,
        "nord": 50.60,
        "est": 4.60,
    },
    {
        "id": "france",
        "zoom": 8,
        "sud": 45.50,
        "ouest": -2.00,
        "nord": 53.00,
        "est": 7.00,
    },
    {
        # L'arrivée est le sommet du récit : elle mérite un fond net, et non
        # l'Europe entière étirée. Couvre l'Écosse et le nord de l'Angleterre.
        "id": "ecosse",
        "zoom": 8,
        "sud": 53.50,
        "ouest": -8.50,
        "nord": 59.50,
        "est": 0.50,
    },
    {
        "id": "europe",
        "zoom": 6,
        "sud": 42.00,
        "ouest": -12.00,
        "nord": 61.00,
        "est": 10.00,
    },
]


def en_pixels(lat, lng, zoom):
    """Projection Web Mercator : degrés vers pixels, au zoom donné."""
    monde = TUILE * 2**zoom
    x = (lng + 180.0) / 360.0 * monde
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * monde
    return x, y


def telecharger(url, ouvreur):
    with ouvreur.open(url, timeout=20) as reponse:
        return reponse.read()


def fabriquer(fond, ouvreur):
    zoom = fond["zoom"]
    gauche, haut = en_pixels(fond["nord"], fond["ouest"], zoom)
    droite, bas = en_pixels(fond["sud"], fond["est"], zoom)

    tx0, ty0 = int(gauche // TUILE), int(haut // TUILE)
    tx1, ty1 = int(droite // TUILE), int(bas // TUILE)

    largeur = (tx1 - tx0 + 1) * TUILE
    hauteur = (ty1 - ty0 + 1) * TUILE
    planche = Image.new("RGB", (largeur, hauteur))

    total = (tx1 - tx0 + 1) * (ty1 - ty0 + 1)
    print(f"{fond['id']} : {total} tuiles au niveau {zoom}")

    fait = 0
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            url = f"https://tile.openstreetmap.org/{zoom}/{tx}/{ty}.png"
            temporaire = ICI / "_tuile.png"
            temporaire.write_bytes(telecharger(url, ouvreur))
            with Image.open(temporaire) as tuile:
                planche.paste(
                    tuile.convert("RGB"),
                    ((tx - tx0) * TUILE, (ty - ty0) * TUILE),
                )
            fait += 1
            if fait % 20 == 0:
                print(f"  {fait}/{total}")
            # Usage raisonnable de tile.openstreetmap.org.
            time.sleep(0.25)
    (ICI / "_tuile.png").unlink(missing_ok=True)

    # Découpe exacte à la fenêtre demandée : les coordonnées écrites dans le
    # fichier TypeScript décrivent alors précisément l'image livrée.
    image = planche.crop(
        (
            round(gauche - tx0 * TUILE),
            round(haut - ty0 * TUILE),
            round(droite - tx0 * TUILE),
            round(bas - ty0 * TUILE),
        )
    )

    DOSSIER_IMAGES.mkdir(parents=True, exist_ok=True)
    chemin = DOSSIER_IMAGES / f"{fond['id']}.webp"
    image.save(chemin, "WEBP", quality=72, method=6)
    poids = chemin.stat().st_size / 1024
    print(f"  → {chemin.name} : {image.width}×{image.height} px, {poids:.0f} Ko")
    return image.width, image.height


def main():
    # Un identifiant en argument ne refabrique que ce fond-là.
    voulus = set(sys.argv[1:])
    ouvreur = urllib.request.build_opener()
    ouvreur.addheaders = [("User-Agent", UA)]

    lignes = []
    for fond in FONDS:
        if voulus and fond["id"] not in voulus:
            chemin = DOSSIER_IMAGES / f"{fond['id']}.webp"
            with Image.open(chemin) as image:
                largeur, hauteur = image.width, image.height
            print(f"{fond['id']} : inchangé")
        else:
            largeur, hauteur = fabriquer(fond, ouvreur)
        lignes.append(
            f"""  {fond['id']}: {{
    bounds: [
      [{fond['sud']}, {fond['ouest']}],
      [{fond['nord']}, {fond['est']}],
    ],
    zoom: {fond['zoom']},
    width: {largeur},
    height: {hauteur},
  }},"""
        )

    FICHIER_TS.write_text(
        """// Généré par scripts/fetch-backgrounds.py — ne pas modifier à la main.
//
// Coordonnées exactes des fonds de carte livrés avec le site. Chaque fond
// couvre une échelle du voyage ; journeyMap les superpose et passe de l'un à
// l'autre en fondu selon l'étendue visible.
export interface Backdrop {
  /** Sud-ouest puis nord-est, en degrés. */
  bounds: [[number, number], [number, number]];
  /** Niveau de zoom OpenStreetMap auquel l'image a été fabriquée. */
  zoom: number;
  width: number;
  height: number;
}

export const FONDS = {
"""
        + "\n".join(lignes)
        + """
} satisfies Record<string, Backdrop>;

export type BackdropId = keyof typeof FONDS;
"""
    )
    print(f"\n{FICHIER_TS.name} écrit.")


if __name__ == "__main__":
    main()
