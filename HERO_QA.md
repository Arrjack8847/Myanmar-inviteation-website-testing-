# Golden Autumn Heritage — Section 1 release acceptance

**Scope:** Cover/opening + static Golden Autumn Gateway hero only. Sections 2–6 are frozen until the first scene has passed QA.

## Architecture
- Original approved `art/golden_autumn_heritage_master_v4.png` is the **only painted hero scene** (853 × 1844). No extra standalone roses/trees/columns, nine-slicing, parallax or snap scrolling.
- HTML controls/text overlay the illustration. The image now uses `object-fit: cover` on mobile, maintaining aspect ratio and filling the viewport without side bars; this intentionally crops some top/bottom scenery on short screens, not the central gateway.
- Mobile typography sits within the gateway opening. On very short screens, decorative eyebrow/subtitle may be omitted but names/date remain.
- Demo banner is fixed at 34px. Hero occupies remaining small viewport height.
- The initial envelope/butterfly is an HTML `button` with a label; decorative wing/body PNGs are not separate controls.

## Functional acceptance — test in Chrome + iOS Safari + Android Chrome
1. Loading without query parameters opens the cover with an obvious **Open Invitation** control.
2. Both clicking/tapping the butterfly envelope and the Open button begin the same **one-time** opening.
3. Skip Opening immediately reveals the hero; it must work with keyboard, touchscreen and screen reader.
4. **Tab** and **Shift+Tab** cycle between envelope, Open, and Skip while the modal is active; **Escape** skips.
5. Section 1 background is not keyboard reachable before opening. After opening, focus transfers to the couple names and the main invitation becomes reachable.
6. Changing operating-system **Reduce motion** preference removes distracting animations; opening still works.
7. A second tap during the reveal must not double-trigger leaf effects or restart the timer.
8. With the initial cover closed, the scroll cue takes guests to Section 2 using normal page scroll.
9. No browser console errors, missing image placeholders, clipping of names/date, or unexpected horizontal page scrolling.
10. Check the actual artwork edge and text-safe zone at **320×568**, **390×844**, **430×932**, and one landscape/tablet viewport.

## Visual acceptance
- The Kanote-inspired crest and BOTH pillars remain visible. Some outer canopy/path may be cropped on short screens; review exact art composition at the target devices.
- The couple names and date are inside the arch rather than painted over the pillars.
- On phones there must be NO solid peach side bars, NO image stretching, and NO black browser-focus rectangle around the names.
- Opening leaves and butterfly appear only over the cover/hero, without changing the painted garden scenery.
- Links and controls are clearly visible and have keyboard focus indicators.
- The hero feels balanced with long sample couple names as well as the default **Thiri & Min**.

## Performance acceptance
- Measure the full mobile page using Lighthouse in Chrome, not assumptions from source code.
- Target Lighthouse **Performance ≥90**, **Accessibility ≥95**, and **Best Practices ≥95** under comparable mobile throttling.
- No missing images; eliminate preventable layout shifts and excessive layout thrashing.
- Hero PNG is currently ~3.05 MB. Before final release, prepare a smaller optimized mobile format (such as WebP/AVIF with the approved image visually unchanged), upload it, and confirm visual quality/performance with the actual resulting file. **This optimization has not yet happened**.

## How to test
```powershell
cd "C:\Users\ASUS\Downloads\Golden-Autumn-Heritage-V4"
git pull --ff-only origin feat/hires-garden-preview-20261101
node tests/smoke.cjs
node server.js
```

Preview:
- Normal opening: `http://localhost:4173/`
- First scene without cover: `http://localhost:4173/index.html?heroPreview=1#home`
- Width/height comparison: `http://localhost:4173/art-review.html`

**Status:** Source-level checks and JS syntax have been inspected via the GitHub connector. The actual local Node smoke test, interactive real browser/mobile QA, full Lighthouse run and optimized-image release are still pending. No honest 10/10 claim until the complete gate passes.

## Screenshot regression recorded (November 1, 2026)

A phone simulator screenshot showed a **narrow contained illustration with obvious peach side bars**, a **black programmatic-focus outline around the names**, and **undersized, constrained wedding text**. Changes in `hero-quality.css` now use mobile `object-fit:cover;object-position:center 47%`, an improved arch text width/font, and suppress focus outlines on the *noninteractive, programmatically focused* heading only (real interactive focus outlines remain). Validate after pulling; screenshot still needs a side-by-side browser check.

## Latest real-mobile-scroll QA (November 1)

GitHub Actions runs the full website in headless Chromium at **320×568, 390×844, and 430×932** via `tests/browser-flow.cjs`. Completed run at `f8a919d174` reported **success** with real `touchStart/touchMove/touchEnd` gestures over the invitation. This provides stronger evidence than prior source-only checks. Screenshots are saved in the action's `golden-autumn-mobile-screenshots` artifact.

A visual review of these phone screenshots revealed that the **Scroll to Explore** cue was not visible immediately after opening the garden, because its old transition delayed opacity. A new patch in `hero-quality.css` makes it visible quickly with a 48px high contrast touch target, and `tests/browser-flow.cjs` now checks its opacity, visible bounds, tap target size and destination at all three phone sizes. Verify that the newer Actions run passes before marking that regression resolved.

These checks do **not** replace real iOS Safari screenshots, the user's visual approval of cross-section painted seams, or mobile Lighthouse performance scores. Do not claim 10/10 without those.
