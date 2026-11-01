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

## Section 2 art integration — uploaded November 1

`art/section2_family_invitation_master.png` is the approved cohesive family invitation background. Its top edge is a continuation of the Section 1 walkway and flowers, and its bottom contains sunset garden and burgundy rose edges for the future transition to Section 3. It is rendered in `invitation.css` using a single-source nine-slice frame (source crop guides: top 355px, left/right 120px, bottom 470px); only blank parchment space stretches for live text. The old nested ivory card and duplicate corner/divider PNGs are removed from Section 2. No new scrolling effects.

**Open visual issue:** Physical phone screenshots must confirm that the Section 1→2 edge is convincing. The final Section 2→3 edge depends on generating and integrating the matching Section 3 illustration; a matching palette alone is not proof of a seamless join.

## Section 3 illustrated master — now locally stored

The original 1086×1448 two-panel ceremony illustration is now in `art/section3_ceremony_reception_master.png`, a byte-identical copy of the user's source image. Verified SHA `fca0d987ac2e13686dfd08463401a6c5f24e023e`. The source is no longer fetched from another repository at runtime. Its static landscape, rose arrangements and both gilt panels remain unchanged and all event wording is editable HTML.

The event illustration's upper pathway does not match the end of Section 2 pixel-for-pixel. Existing CSS feathering softens the transition, but achieving an invisible physical join requires a new approved edge-repainted image rather than stacking loose flower PNGs or distorting the frames.

## November 1 follow-up — mobile scrolling and painted section joins

Actual mobile screenshots exposed large empty peach space between Sections 2 and 3, caused by an earlier `100svh`/centered/overflow-hidden treatment. `flow-quality.css` now overrides those constraints after all legacy stylesheets: Section 2's parchment takes its natural content height and Section 3's complete 1086:1448 artwork follows directly. Document scroll replaces nested touch scrollbars. Optional gentle alpha overlaps soften the existing painted boundaries without introducing independent moving flowers, parallax, or a flattened all-sections JPG/PNG with baked-in names. Both sections retain editable HTML details. The CSS seam blend is a best-effort transition, not a claim that the underlying separate PNG edges match pixel-for-pixel.

A simplified Chrome mobile rendering using the exact three approved painting files and representative markup was checked at 320×568, 390×844 and 430×932. It showed **18px Section 1→2 overlap, 22px Section 2→3 overlap, and no horizontal overflow**. This is not yet a verified live render of the GitHub checkout; actual device screenshots remain the release gate.
