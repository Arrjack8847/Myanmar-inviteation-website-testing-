# Golden Autumn Heritage V4 — unified garden hero

## Approved choice

The first section uses **ONE untouched master illustration**: `art/golden_autumn_heritage_master_v4.png`.

Previously, assembling a gateway, flower borders, trees and pathway from independent images made the illustration feel disconnected. Those parts have now been removed from the first section's HTML. The hero shows the original scene as one static image without extra color grading, scrolling/parallax motion or animated stone/floral pieces.

## What remains interactive

- The separate opening envelope and butterfly
- A short wind-driven leaf burst during opening; **no continuous falling leaves**
- Live sample couple names, date and text placed over the arch opening
- Ordinary user scrolling into wedding invitation, venue, countdown and closing sections

The full image naturally crops slightly on device ratios other than the portrait master. Use `object-fit:cover` with centered framing and review 320px, 390px and 430px phone widths before production.

## Test locally

```powershell
git fetch origin
git switch feat/hires-garden-preview-20261101
git pull --ff-only origin feat/hires-garden-preview-20261101
node tests/smoke.cjs
node server.js
```

Open `http://localhost:4173/art-review.html` for mobile-width artwork/text previews, then `http://localhost:4173` for the full opening and natural page scroll.

## Before merging

Verify small-screen framing, readable names, functional open/skip controls, reduced motion and smooth ordinary scroll. No Vercel deployment has been created. Keep the old numbered and high-resolution individual PNGs as unused backups for now.
