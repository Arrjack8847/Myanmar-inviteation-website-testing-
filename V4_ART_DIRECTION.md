# Golden Autumn Heritage — V4 soft-heritage refinement

This branch applies the November 1, 2026 art-direction changes to the V3 hi-res composition:

- Subdue saturation and harsh metallic gold across scenery, carved gateway, and flowers
- Restore softer ivory, peach, rust, plum and antique-gold tonal balance
- Reduce size and visual dominance of upper flowers and foreground borders
- Protect the central wedding-name area with a soft luminous veil
- Preserve the layered DOM and existing butterfly/wind animation architecture
- Respect reduced-motion preferences

**Important distinction:** This branch currently uses the existing GitHub hi-res individual artwork with CSS toning. It does **not** yet contain the newly generated, softened *flat master illustration*.

## Exact master artwork handoff

The newly approved master image is available in the ChatGPT conversation as `golden_autumn_heritage_gateway.png` (RGB PNG, 853 × 1844). Upload it manually to this repository under `art/golden_autumn_heritage_master_v4.png` after checking the final framing. Preserve the flat master as an art-direction **reference**, rather than replacing the animation layers: flattening the scene would remove independent gateway, flower and leaf movement.

For a working production version, the next step after uploading the master is to rebuild or repaint individual matched layers from that master. This avoids duplicated florals, floating pieces and mismatched lighting.

## Review before merging

1. Pull branch `feat/hires-garden-preview-20261101` locally.
2. Run `node tests/smoke.cjs` then `node server.js` and open http://localhost:4173.
3. Test opening and reveal on 390 × 844, 320 × 568 and 430 × 932 viewports.
4. Verify both pillars meet the upper arch and the steps; adjust transforms if needed.
5. Ensure floral clusters don't cover family text or couple names.
6. Check image loading and reduce large PNG transfer sizes (WebP) before production.

No public deployment or `main` merge has occurred.
