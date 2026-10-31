# Golden Autumn Heritage — approved unified hero

The file `golden_autumn_heritage_master_v4.png` is the **single, complete background image for Section 1**, including its gateway, trees, garden, pathway and floral borders.

## Design decision (November 1, 2026)

Keep the garden illustration intact rather than rebuilding it from individually generated layers, which caused misalignments and inconsistent lighting. The HTML/CSS website now displays this image directly:

```html
<img class="hero-master" src="art/golden_autumn_heritage_master_v4.png" alt="" fetchpriority="high" />
```

Wedding names and date remain editable, accessible live HTML text over the image. The separate butterfly and six leaf images are used solely for the *opening interaction*, not to reconstruct the scenery. The hero does not parallax or move during scrolling; the page naturally continues to invitation details.

The image was copied without re-encoding from the uploaded `download.png` in the repository. Other prototype art remains archived but is not rendered in the hero.

Preview: `http://localhost:4173/art-review.html`, after running `node server.js`.

## Section 2 — approved painted family invitation

- `section2_family_invitation_master.png` is an unchanged copy of the user-uploaded `3b176df0-2def-4450-a24d-a070e3838c18.png` in this same folder (both SHA `2d622fd5a6aa92ba3a9f794682442a2c1b848df2`).
- The complete floral/gold/stone-path illustration is treated as **one cohesive source**.
- To allow longer live text without cutting off carved corners, CSS nine-slice scaling extends the *blank parchment center*. The top arch, rose corners and lower garden remain aligned.
- The artwork is static; no parallax or animated floral layers.
- Do not swap the Section 1 garden or assume the Section 2 → 3 seam is final before Section 3's matching art is ready.

Review: `http://localhost:4173/index.html?heroPreview=1#invitation`.
