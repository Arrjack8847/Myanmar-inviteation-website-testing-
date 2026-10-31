# Golden Autumn Heritage — V4 soft-heritage refinement

The V4 branch includes the approved flattened master illustration, matched high-resolution individual prototype layers and CSS adjustments for the softer heritage direction.

## Current art direction

- Subdued ivory, peach, rust, plum and antique-gold tones
- Restrained carved-gateway saturation and metallic highlights
- Smaller floral edges to frame, not overpower, the gateway
- A clear central text-safe zone for wedding names
- Independent layer architecture to preserve future butterfly, wind and scroll motion

## Master artwork

The approved original is stored at `art/golden_autumn_heritage_master_v4.png`, reused without re-encoding from the image uploaded to `main` as `download.png`.

**Important:** This is a flattened reference illustration, not a replacement for the animation layers. It cannot be animated as if each flower, pillar and tree were separate without rebuilding those parts.

## Visual alignment

Open `http://localhost:4173/art-review.html` after running `node server.js`, and use the percentage slider to align the assembled website scene with the approved master at 390 × 844. The comparison iframe uses `index.html?artReview=1` to hide invitation text/cover and freeze swaying movement.

Review these landmarks first: upper arch peak, right and left pillar bases, staircase width/top, distant horizon and garden foreground. The current artwork files were independently generated and may not match the master perfectly; verify visually before modifying the scene.

## Release checklist

1. `node tests/smoke.cjs` — check asset format, references and DOM hooks.
2. `node server.js`, then view `/art-review.html` for overlay comparison.
3. Open the normal `/index.html` and test the 2.55-second butterfly, wind and leaf reveal.
4. Test mobile widths of 320px, 390px and 430px, plus reduced motion.
5. Confirm flowering branches and pillars do not obscure names.
6. Optimize heavy PNGs to appropriate image formats before public deployment.
7. Keep any extra changes on the draft PR until browser testing passes.

There has been no deployment and `main` remains unchanged by the V4 code updates.
