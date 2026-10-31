# Golden Autumn Heritage — V4 master image

`golden_autumn_heritage_master_v4.png` is the **approved softened illustration**, copied directly from the original GitHub upload `download.png` on `main` (same image bytes, not recompressed).

This flattened image is the **visual target**, not the animated website layer. Existing background, gateway, flower, vine and pathway PNG elements remain independently movable.

## Compare scene to reference

Run the local static server from the repository root:

```powershell
node server.js
```

Visit **http://localhost:4173/art-review.html**. Use the overlay-opacity slider to compare the approved static master against the actual assembled hero at 390 × 844 logical pixels. Switch between website only and master only, and display text-safe guides. Reference details:
- Gateway arch, pillar joints and step positions should coincide
- Background horizon should match in height and perspective
- Floral edges should frame the center without obscuring names
- Dramatic sunlight should be softened toward romantic ivory and peach

The standard website still lives at `index.html`. The `?artReview=1` query is exclusively for the static alignment comparison.
