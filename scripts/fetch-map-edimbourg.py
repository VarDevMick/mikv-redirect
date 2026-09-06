#!/usr/bin/env python3
"""Régénère le fond de plan d'Édimbourg à partir d'OpenStreetMap.

Usage ponctuel (pas partie de `npm run build`) : à relancer seulement si
la liste des lieux change. Nécessite Pillow (`pip3 install --user Pillow`).

Étapes :
  1. Géocode chaque lieu via Nominatim (le géocodeur d'OSM).
  2. Calcule la fenêtre de pixels (projection Web Mercator standard) qui
     contient tous les lieux avec une marge, à un niveau de zoom fixe.
  3. Télécharge les tuiles OSM qui couvrent cette fenêtre et les assemble.
  4. Découpe exactement à la fenêtre calculée et enregistre le résultat
     dans src/assets/edimbourg/plan-fond.png.
  5. Affiche les coordonnées pixel de chaque lieu dans cette image, à
     recopier dans src/data/edimbourg.js (PARCOURS[].reperes).

Le zoom et les marges sont ceux utilisés pour l'image actuellement en
dépôt (zoom 15 ; marges 140px à gauche pour l'étiquette « Dean Village »,
170px à droite pour « Calton Hill », 363px en haut et en bas). Le semis
de lieux est plus large que haut ; la marge verticale généreuse ramène
l'image à peu près au carré pour qu'elle domine l'écran sur un
téléphone, sans rien déformer (même zoom, donc même échelle, dans les
deux axes — la marge ajoute seulement du contexte urbain réel).

Après régénération, les coordonnées pixel affichées en sortie doivent
être multipliées par 0.36 (voir le commentaire au-dessus de PARCOURS
dans src/data/edimbourg.js) avant d'être recopiées dans ce fichier.
"""
import json
import math
import time
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT_PNG = HERE.parent / "src/assets/edimbourg/plan-fond.png"
UA = "mikv-redirect-birthday-page/1.0 (personal project; one-time build asset; contact varlet.micka@gmail.com)"

ZOOM = 15
TILE = 256
MARGIN_LEFT = 140
MARGIN_RIGHT = 170
MARGIN_TOP = 363
MARGIN_BOTTOM = 363

# Les lieux affichés en repère sur le plan (voir PARCOURS dans
# src/data/edimbourg.js) — un point par repère, sans point intermédiaire :
# les tracés relient les repères en ligne droite, à l'échelle réelle.
LIEUX = [
    ("royal-mile", "St Giles' Cathedral, Edinburgh"),
    ("grassmarket", "Grassmarket, Edinburgh"),
    ("musee", "National Museum of Scotland, Edinburgh"),
    ("chateau", "Edinburgh Castle"),
    ("princes-st", "Princes Street, Edinburgh"),
    ("calton-hill", "Calton Hill, Edinburgh"),
    ("dean-village", "Dean Village, Edinburgh"),
    ("stockbridge", "Stockbridge, Edinburgh"),
]


def geocode(query):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"q": query, "format": "json", "limit": 1}
    )
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.load(resp)
    if not data:
        raise SystemExit(f"Lieu introuvable : {query}")
    return float(data[0]["lat"]), float(data[0]["lon"])


def project(lat, lon, zoom):
    scale = TILE * (2 ** zoom)
    siny = min(max(math.sin(math.radians(lat)), -0.9999), 0.9999)
    x = scale * (0.5 + lon / 360)
    y = scale * (0.5 - math.log((1 + siny) / (1 - siny)) / (4 * math.pi))
    return x, y


def main():
    points = {}
    for pid, query in LIEUX:
        lat, lon = geocode(query)
        points[pid] = project(lat, lon, ZOOM)
        print(f"{pid}: {lat},{lon}", flush=True)
        time.sleep(1.1)  # politique d'usage de Nominatim : 1 req/s max

    xs = [p[0] for p in points.values()]
    ys = [p[1] for p in points.values()]
    min_x, max_x = min(xs) - MARGIN_LEFT, max(xs) + MARGIN_RIGHT
    min_y, max_y = min(ys) - MARGIN_TOP, max(ys) + MARGIN_BOTTOM
    width, height = round(max_x - min_x), round(max_y - min_y)
    print(f"image {width}x{height}, aspect {width/height:.3f}")

    tx0, ty0 = int(min_x // TILE), int(min_y // TILE)
    tx1, ty1 = int(max_x // TILE), int(max_y // TILE)
    canvas = Image.new("RGB", ((tx1 - tx0 + 1) * TILE, (ty1 - ty0 + 1) * TILE))

    opener = urllib.request.build_opener()
    opener.addheaders = [("User-Agent", UA)]
    servers = ["a", "b", "c"]
    i = 0
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            s = servers[i % 3]
            url = f"https://{s}.tile.openstreetmap.org/{ZOOM}/{tx}/{ty}.png"
            with opener.open(url, timeout=10) as resp:
                tile_bytes = resp.read()
            tmp = HERE / "_tile.png"
            tmp.write_bytes(tile_bytes)
            canvas.paste(Image.open(tmp).convert("RGB"), ((tx - tx0) * TILE, (ty - ty0) * TILE))
            i += 1
            time.sleep(0.25)  # usage raisonnable de tile.openstreetmap.org
    (HERE / "_tile.png").unlink(missing_ok=True)

    offset_x = round(min_x - tx0 * TILE)
    offset_y = round(min_y - ty0 * TILE)
    final = canvas.crop((offset_x, offset_y, offset_x + width, offset_y + height))
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    final.quantize(colors=128, method=Image.MEDIANCUT).save(OUT_PNG, optimize=True)
    print(f"écrit : {OUT_PNG} ({OUT_PNG.stat().st_size // 1024} Ko)")

    print("\nCoordonnées pixel (à recopier dans src/data/edimbourg.js) :")
    for pid in points:
        x, y = points[pid]
        print(f"  {pid}: x={round(x - min_x)}, y={round(y - min_y)}")


if __name__ == "__main__":
    main()
