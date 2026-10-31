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

## Section 3 illustrated master (external-source preview)

The new Section 3 image is one cohesive, unchanged 1086×1448 graphic with two gold-framed panels, flowers, lanterns and a bottom sunset landscape. Its top begins with autumn stone pavement and roses to continue Section 2. It was uploaded to the separate `Arrjack8847/testing-version-2` repo; we verified its exact bytes through its Git SHA. To avoid incorrectly claiming it is in V4, the image is temporarily referenced by immutable `raw.githubusercontent.com` URL in `index.html` while the couple/event text remains live HTML. Before public release, move the source PNG to `art/section3_ceremony_reception_master.png` in the V4 repo and switch the URL.

The actual edge match between Sections 2 and 3 is still unapproved until viewed on mobile. Unlike Section 2's nine-slice frame, Section 3 must preserve both original hand-painted panels in one unwarped 1086:1448 portrait scene.
