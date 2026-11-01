# Golden Autumn Heritage — verified mobile browser QA
**Date:** November 1, 2026

## Test environment
GitHub Actions Ubuntu runner, Chromium installed through Playwright, Node 22, actual `index.html` and original artwork served with `node server.js`. Initial successful run: https://github.com/Arrjack8847/Myanmar-inviteation-website-testing-/actions/runs/41255221333

The test `tests/browser-flow.cjs` navigated the actual site at the three listed phone viewport sizes, not a mocked HTML approximation. It captured 9 rendered screenshots as a GitHub Actions artifact.

| Rendering check | 320 × 568 | 390 × 844 | 430 × 932 |
|:--|--:|--:|--:|
| Gateway → family boundary | -18px overlap | -18px overlap | -18px overlap |
| Family → ceremony/reception boundary | -22px overlap | -22px overlap | -22px overlap |
| Horizontal overflow | **0px** | **0px** | **0px** |
| Total document height | 4156px | 4330px | 4541px |
| Swiping over family invitation | +250px page scroll | +250px page scroll | +250px page scroll |
| Inner paper scroll overflow | visible | visible | visible |
| Inner event scroll overflow | visible | visible | visible |
| All 3 artwork sources loaded | Yes | Yes | Yes |
| Uncaught JavaScript errors | None | None | None |

## Interpretation
- The large peach-colored **empty layout gap** visible in the previous phone screenshots was a fixed-height container problem and is **eliminated in these tested Chromium sizes**.
- The touch/wheel scroll event delivered over the parchment moves the entire webpage instead of getting stuck in a nested scroll area.
- The Section 1 hero image is displayed with `object-fit:cover` so it fills the viewport without letterbox sidebars.
- The 18px/22px negative boundaries are intentionally controlled CSS overlaps, not empty space.
- Source-level smoke and opening/keyboard tests passed in the same GitHub Actions run.

## Visual assessment from actual screenshots
The first successful run includes `gateway-*`, `invitation-*`, and `events-*` screenshots. They confirm intact ornate artwork and readable headlines, although the **small fine-print in the two event cards** remains a potential polish/accessibility issue on narrow phones. Avoid declaring perfect accessibility without a real screen-reader and text-scaling test. Fine seams between differently illustrated scenes remain an artistic QA concern; pixel overlap does not guarantee an invisible join.

## Improved capture method
After inspecting the screenshot artifacts, `tests/browser-flow.cjs` was updated to capture the top of each section accurately rather than merely scrolling it into view. It also captures one complete `full-page-390.png` for page composition review. These updates are in subsequent GitHub Actions runs; do not attribute the new screenshots to the initial run.

## Running locally
```powershell
git pull --ff-only origin feat/hires-garden-preview-20261101
node tests/smoke.cjs
node tests/hero-interaction.cjs
node server.js
```

For browser QA install Playwright and its browser separately:
```powershell
npm install --no-save --no-package-lock playwright@1.56.0
npx playwright install chromium
node tests/browser-flow.cjs
```

The test also runs automatically on branch pushes from `.github/workflows/mobile-browser-qa.yml`; screenshots are stored as a 7-day GitHub Actions artifact. The preview `flow-review.html` provides interactive measurements without any local package installation.

## Release limitations
Actual physical iOS Safari/Android testing, dynamic enlarged Burmese copy, text contrast, independent assistive technology, performance/Lighthouse, and publication of the Section 3 image locally in this repository are NOT yet complete. Keep the draft PR unmerged.
