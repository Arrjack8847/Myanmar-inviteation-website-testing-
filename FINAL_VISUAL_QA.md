# Golden Autumn Heritage — final illustrated flow review

**Scope:** Design and QA of Sections 1–6 on `feat/section4-connected-story-art-20261102`, not the currently published V4 demo.

## Scene-by-scene acceptance

| Section | Reused approved imagery | Native HTML and key acceptance |
| --- | --- | --- |
| 1. Gateway | Original golden or Moonlit hero master | Couples' names stay legible; butterfly and scroll cue remain tappable |
| 2. Family invitation | Original matching family master + responsive border slice | Burmese and English names/wording can grow without being cut off |
| 3. Ceremony & reception | Original event painting, **plus actual readable venue cards** | Dates, addresses, optional confirmed direction links stay usable and higher-contrast |
| 4. Love story | Uploaded 1024×1536 original illustrated story frame (Golden); lavender readable fallback (Moonlit) | Three custom chapters grow vertically; floral side strips repeat rather than stretch |
| 5. Countdown | Lives **inside** the same story frame | Four live timer values; no disconnected rectangular panel, frozen numbers or extra blank spacer |
| 6. Closing | Cropped lower garden source in each skin, original decorative overlays | Editable couple names, functional share button and back-to-top link; dusk palette and no ceremony text reappearing |

## Boundary and asset rules

1. Compare the *actual rendered* image at 320, 390 and 430 CSS-pixel widths. Cropping is different at each phone size.
2. Never repeat the ceremony gold text frames or add a duplicated rectangular cobblestone strip at a boundary.
3. Only decorative layers can cross boundaries. Keep their `pointer-events:none` and protect readable content.
4. The original painted masters are immutable; make every crop proportional.
5. Check Moonlit separately. Do not show the Golden story painting or Golden-only story closing reflection on its lavender skin.
6. The Golden story-to-closing bridge is a **short vertical reflection** of the last edge of the existing illustration. This reduces the obvious seam, but is not a bespoke hand-painted continuation. Preserve this limitation in release notes.

## Automated checks

- `node tests/smoke.cjs`: core source/art validation.
- `node tests/skin-system.cjs`: original skin assets, formats and dimensions.
- `node tests/hero-interaction.cjs`: opening and navigation.
- `node tests/browser-flow.cjs`: image joins, touch scrolling, keyboard interactions and longer names/venues at 320, 390 and 430.
- `node tests/story-art.cjs`: original Section 4 PNG and the six-section layout's source contract.
- `node tests/story-art-browser.cjs`: both skins, all three phone widths, very long Burmese/English story copy, countdown, closing artwork, seam images, and ceremony/venue text contrast against a conservative white-paper baseline.

The CI action saves PNG screenshots to the workflow's **golden-autumn-mobile-screenshots** artifact. Review `event-reading-<skin>-<width>.png`, `story-to-closing-<skin>-390.png`, and `closing-garden-<skin>-390.png`.

### Physical-device sign-off — **not yet complete**

Before merging into a commercial customer release, manually review the complete link on a real iPhone Safari and Android Chrome:
- Touch open, skip, scrolling, fluttering butterfly, 44px buttons and share link.
- First three painted scenes: top/bottom floral edges during natural scrolling.
- Long Burmese text, larger system font/accessibility text size and line wraps.
- Ceremony/reception map buttons, only after verified venue URLs are supplied.
- Long couple names, three long story chapters, timer and dusk farewell.
- Reduce Motion enabled, portrait phone width, and slow connection.
- Photos/screenshots of all five section joins on each real device.

## Commercial release gate

A passing automated suite **does not** approve personal wedding data, physical devices or hosting. The current Vercel deployment is a standalone non-commercial demo. Use permitted commercial hosting, confirm the client's content, and keep every customer's published invitation separate. Do not merge or claim a visually perfect garden until the remaining checks are accepted.
