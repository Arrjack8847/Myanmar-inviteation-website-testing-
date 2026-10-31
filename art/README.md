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
