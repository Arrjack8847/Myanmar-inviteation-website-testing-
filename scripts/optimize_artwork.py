#!/usr/bin/env python3
"""Build production WebP copies of the three approved V4 master illustrations.

Run from the repository root: python scripts/optimize_artwork.py
Requires Pillow >= 10. Original PNGs remain untouched as browser fallbacks.
The source Git hashes prevent replacing the approved art by accident.
"""
from __future__ import annotations

import hashlib
import io
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "art"
QUALITY = 94
SOURCES = {
    "golden_autumn_heritage_master_v4": ("0ffb8c755d2667a79f3330cb2b24641af4c1f9bb", (853, 1844)),
    "section2_family_invitation_master": ("2d622fd5a6aa92ba3a9f794682442a2c1b848df2", (1086, 1448)),
    "section3_ceremony_reception_master": ("fca0d987ac2e13686dfd08463401a6c5f24e023e", (1086, 1448)),
}

def main() -> None:
    total_png = total_webp = 0
    for stem, (expected_sha, expected_size) in SOURCES.items():
        source = ART / f"{stem}.png"
        output = ART / f"{stem}.webp"
        if not source.exists():
            raise SystemExit(f"Missing approved source: {source}")
        actual_sha = subprocess.check_output(
            ["git", "hash-object", str(source)], text=True, cwd=ROOT
        ).strip()
        if actual_sha != expected_sha:
            raise SystemExit(f"{stem}: approved source SHA changed: {actual_sha}")

        with Image.open(source) as image:
            image.load()
            if image.size != expected_size:
                raise SystemExit(f"{stem}: unexpected dimensions {image.size}")
            image.save(output, "WEBP", quality=QUALITY, method=6)
            with Image.open(output) as check:
                check.load()
                if check.size != image.size:
                    raise SystemExit(f"{stem}: optimized dimensions differ")

        src_bytes = source.stat().st_size
        out_bytes = output.stat().st_size
        if out_bytes >= src_bytes * 0.55:
            raise SystemExit(f"{stem}: insufficient compression ({out_bytes}/{src_bytes})")
        total_png += src_bytes
        total_webp += out_bytes
        print(f"PASS {output.name}: {src_bytes:,} -> {out_bytes:,} bytes "
              f"({100*(1-out_bytes/src_bytes):.1f}% saved), {expected_size}")

    print(f"PASS 3 artwork masters: {total_png:,} -> {total_webp:,} bytes "
          f"({100*(1-total_webp/total_png):.1f}% saved); PNG fallbacks retained.")


if __name__ == "__main__":
    main()
