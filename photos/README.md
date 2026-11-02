# Bride & Groom Gallery assets

This folder contains **customer-approved wedding photos only**.

Upload files before enabling their paths in `wedding-config.js`:
- `photos/bride.webp` — bride portrait, ideally vertical 3:4.
- `photos/groom.webp` — groom portrait, ideally vertical 3:4.
- `photos/moment-01.webp`, etc. — gallery photos, ideally vertical 4:5.

The images should be optimized for mobile:
- WebP preferred, JPEG/PNG/AVIF supported.
- For portraits, ~900–1200px across is sufficient for mobile screens.
- Aim for ~100–350 KB each without noticeable visual degradation, especially if including eight.
- Preserve original images outside the website if the client wishes. The website only receives approved optimized copies.

**Privacy and permissions:** Obtain the couple's permission before publishing identifiable photos. Do not upload photographs containing guest information, image metadata that should stay private, or unapproved third-party pictures. If photos are absent or fail to load, the invitation displays non-interactive decorative placeholders.

**Safe relative paths:** The gallery code intentionally accepts only image files beneath `photos/` — no remote URLs or traversal. Configure names, portraits, gallery list and accessible photo descriptions in `wedding-config.js`.

The gallery is inserted **between the Love Story and countdown, within the existing illustrated parchment**, so no new garden painting or scene-boundary seam is necessary. The two skins share the gallery mechanics with separate color palettes.
