# Golden Autumn Heritage — PNG-integrated interactive prototype

A **mobile-first Myanmar-inspired digital wedding invitation prototype** featuring romantic golden-hour lighting, an original carved gateway, animated butterfly, drifting leaves, and interactive wedding content.

The **32 original prototype PNGs** supplied in this repository are now referenced by the page. The website uses live HTML text, CSS layering and JavaScript animation rather than flattening the scene into a single image.

## What's integrated

- **01–03**: Sunset backdrop, distant trees and foreground autumn framing
- **04–08**: Five-part ivory and antique-gold gateway (pillars, arch, foundation, crest)
- **09–11**: Garden, ceremonial path and foreground bushes
- **12–19**: Eight independently positioned floral and vine components
- **20–22**: Butterfly body and separate animated wings
- **23–28**: Six individual PNG leaves reused for gust and ambient drift
- **29–30**: Invitation artwork and decorative wax seal on the opening envelope
- **31–32**: Gold divider and reusable corner ornament

The **PNG files are stored in the repository root** because that's where they were uploaded. The earlier SVG proofs remain in `assets/` for comparison but the updated page no longer relies on them.

## Local testing on Windows

Requires Node.js 18+; no npm install or build tools.

```powershell
git clone https://github.com/Arrjack8847/Myanmar-inviteation-website-testing-.git
cd Myanmar-inviteation-website-testing-
node tests/smoke.cjs
node server.js
```

Open **http://localhost:4173** in Chrome or Edge, then:

1. Press **Open Invitation** or tap the envelope; verify the butterfly and scattered leaves.
2. Reload and press **Skip opening**; verify the hero is immediately visible.
3. View the ivory-and-gold gateway, trees, pathway and animated floral edges.
4. Scroll to family invitation, ceremony details, countdown and closing.
5. Test the 320px–430px mobile layout and a reduced-motion setting.

The `start-local.bat` launcher also starts the local server.

## Current status and limitations

- This is **an integrated design prototype, not a finished sales release**. Image dimensions are relatively small (many artworks under 350 px across), so large displays can show softness.
- **Thiri & Min**, **20 June 2027**, and **Yangon** are fictional demonstration details. The map is not an actual wedding venue.
- No customer checkout, backend, RSVP, or live domain exists.
- Do not share `localhost` as a public invitation link. A public deployment requires a separate step.
- Customize example names and date in `app.js` (the `DEMO` object); other example details currently live in `index.html`.
