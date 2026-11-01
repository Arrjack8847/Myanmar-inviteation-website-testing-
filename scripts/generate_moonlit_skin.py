#!/usr/bin/env python3
"""Build an original-work derivative moonlit palette from the approved artwork.

This is a color-graded sister skin, not a separately commissioned illustration.
Every painting and transparent sprite is transformed by the SAME grade so the
family/events panels keep compatible palette and their existing geometry.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "skins" / "moonlit-amethyst"
OUT.mkdir(parents=True, exist_ok=True)

MASTERS = {
    "art/golden_autumn_heritage_master_v4.png": "gateway",
    "art/section2_family_invitation_master.png": "family",
    "art/section3_ceremony_reception_master.png": "events",
}
SPRITES = {
    "18_hanging_flower_sprig.png":"floral.png",
    "20_butterfly_body.png":"butterfly-body.png",
    "21_butterfly_left_wing.png":"butterfly-left.png",
    "22_butterfly_right_wing.png":"butterfly-right.png",
    "23_leaf_golden_teak.png":"leaf-1.png",
    "24_leaf_copper_teak.png":"leaf-2.png",
    "25_leaf_burgundy_teak.png":"leaf-3.png",
    "26_leaf_golden_bodhi.png":"leaf-4.png",
    "27_leaf_orange_bodhi.png":"leaf-5.png",
    "28_leaf_small_russet.png":"leaf-6.png",
    "29_opening_invitation_card.png":"envelope.png",
    "30_wax_seal.png":"seal.png",
    "31_gold_ornamental_divider.png":"divider.png",
    "32_gold_corner_ornament.png":"corner.png",
}

def moonlit(img):
    rgba = img.convert("RGBA")
    alpha = rgba.getchannel("A")
    original = rgba.convert("RGB")
    luminance = ImageOps.grayscale(original)
    twilight = ImageOps.colorize(
        luminance,
        black="#1a2440",
        mid="#8b82b1",
        white="#f8e9e0",
        midpoint=128,
    )
    # Retain painted detail, highlights, natural shadows and subtle rose colors.
    blended = Image.blend(original, twilight, 0.77)
    blended = ImageEnhance.Contrast(blended).enhance(1.045)
    blended = ImageEnhance.Color(blended).enhance(0.9)
    result = blended.convert("RGBA")
    result.putalpha(alpha)
    return result

for src, target in MASTERS.items():
    image = moonlit(Image.open(ROOT / src))
    image.save(OUT / (target + ".png"), optimize=True)
    image.convert("RGB").save(
        OUT / (target + ".webp"), format="WEBP", quality=83, method=6,
    )
    print(f"MASTER {target}: {image.size}")

for src, target in SPRITES.items():
    image = moonlit(Image.open(ROOT / src))
    image.save(OUT / target, optimize=True)
    print(f"SPRITE {target}: {image.size}")

print("Saved matching illustrated paintings and transparent motion artwork")
