# Golden Autumn Heritage — reusable artwork skins

The V4 invitation now has a central artwork manifest (`skin-packs.js`) and
a small adapter (`skin-loader.js`). The approved Golden Autumn is the
default and remains fully visible without JavaScript.

**Current status:** Two registered options exist: Golden Autumn Heritage
(original) and Moonlit Amethyst (a coordinated color-graded variant of our
own three master paintings). The second variant shares the composition;
it is not a separately illustrated scenery redesign.

## Creating a new skin without changing the mechanics

1. Upload your new artwork to `skins/YOUR-ID/` in this branch.
2. Copy the `golden-autumn` object in `skin-packs.js`, give it a new ID,
   and point its image paths at the uploaded files.
3. Keep all scene geometry and animation classes unchanged.
4. Preview `http://localhost:4173/?skin=YOUR-ID`.
5. Validate on 320, 390 and 430-pixel phones before offering the skin.

Your new skin needs:
- **Hero:** matching 853×1844 portrait composition, PNG + optimized WebP.
- **Family invitation:** matching 1086×1448 painted frame, PNG + WebP.
  The current frame uses the same CSS nine-slice 355/120/470/120.
- **Ceremony and reception:** matching 1086×1448 two-panel composition,
  PNG + WebP. Its painted panels must stay in the same positions.
- **Opening and motion:** transparent envelope art, wax seal, butterfly
  body and two wings, six leaf variants, divider and corner ornaments.

For the seamless garden look, paint all three large masters in a unified
style, with visually compatible edges. Swapping *only* the hero WebP while
keeping the older family/events paintings will not produce a coherent skin.
A different composition or panel position requires layout development,
not an image-only swap.

## What stays independent of the skin

The guest names, parent names, story, countdown, dates, and locations remain
editable through `app.js`. The cover reveal, butterfly flight, leaf gust,
scrolling, page layout and interaction event handlers stay shared.
`?skin=unknown` safely falls back to the original instead of resolving a
URL as an arbitrary image path. The original HTML artwork is also a fallback
when JavaScript is disabled.

Run `node tests/skin-system.cjs`, `node tests/smoke.cjs`,
`node tests/hero-interaction.cjs` and the GitHub Actions mobile browser QA
after changing any pack.
