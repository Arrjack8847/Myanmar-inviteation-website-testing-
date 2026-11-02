# Bride & Groom introduction (RC2)

New illustrated section in the continuous wedding invitation: **after the family invitation and before the ceremony/reception painting**.

## What guests see

- **The Bride** — optional oval portrait, name already sourced from `couple.firstName`, an optional short introduction
- Antique-gold ornament and ampersand
- **The Groom** — oval portrait, name already sourced from `couple.secondName`, an optional short introduction
- Matching golden garden foliage or skin-specific Moonlit Amethyst florals, bilingual labels, and real text that can grow for Burmese/English copy

No AI-generated portraits or fictional details are presented as actual customers. Until real photos are supplied, the portrait displays the first letter of the correct name.

## Configuration

Edit `wedding-config.js` in each **separate customer invitation**:

```js
window.WEDDING_CUSTOMIZATION = {
  skin: 'golden-autumn',
  couple: {
    firstName: 'Confirmed Bride Name',
    secondName: 'Confirmed Groom Name'
  },
  people: {
    bride: {
      bio: 'Approved short introduction to the bride.',
      photo: 'photos/bride.webp'
    },
    groom: {
      bio: 'Approved short introduction to the groom.',
      photo: 'photos/groom.webp'
    }
  }
};
```

These are examples; preserve other existing configuration fields. Neither person needs to provide a photo. To omit a portrait, leave `photo` commented out and the monogram remains visible.

**Allowed photo paths:** relative local files in `photos/`, with PNG, JPG/JPEG, WebP or AVIF extension. Remote addresses, data URLs and parent-directory traversal are rejected by the runtime. If a permitted file fails to load, the initial remains visible.

For best quality, request a couple-approved portrait for each person:
- Portrait aspect ratio 4:5, ideally 800×1000 or 1200×1500 pixels
- Crop around the face and shoulders to suit the oval frame
- Prefer optimized WebP (ideally below 400 KB per photo)
- Confirm permission to use each photo on the guest-facing invitation
- Do not commit private customer photos to the shared demo repository; use the client's separate deployment

The `scripts/package-phone-review.cjs` script packages optional approved image files in `photos/` when present.

## Technical QA

`node tests/couple-section.cjs` for source/config contract; `node tests/couple-browser.cjs` for real Chromium at 320, 390 and 430px on both skins, long Burmese copy, optional local portraits, invalid external image URLs and screenshot captures.

The paintings from the original hero, family and ceremony sections are not modified. The new connecting scenery uses color-matched gradients and existing approved floral overlays, **not** a new hand-painted master. The new edges still need artistic review and physical-phone sign-off.

This development branch is **RC2**, and PR #4 remains unmerged. Any previously downloaded **RC1** ZIP does not include the Bride & Groom section.
