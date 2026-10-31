# Golden Autumn Heritage — local interactive prototype

A **working proof of concept**, not the finished 32-image production invitation. Uses original lightweight vector artwork for the sunset scene, gateway, vines and leaves. No build tools, NPM packages, database or external CDNs.

## Run on Windows

1. Unzip `Golden-Autumn-Heritage-Local.zip`.
2. Double-click `start-local.bat` (Node.js must be installed).
3. Open **http://localhost:4173** in Chrome or Edge.
4. Tap **Open Invitation** to test the reveal, then scroll.
5. Close the command prompt or press **Ctrl+C** to stop the server.

Or from PowerShell in this folder:

```powershell
node server.js
```

## What you can test
- Animated envelope and butterfly opening (with a skip option).
- Windblown autumn leaves and slowly moving border vines.
- The illustrated original ivory-and-gold gateway and sunset garden.
- Responsive hero, invitation message, ceremony details, countdown, closing.
- Working in-page navigation and copy-link action.
- Mobile viewport behavior and reduced-motion preference.

## Demo limitations
- The names `Thiri & Min`, date `20 June 2027`, and Yangon city are **fictional sample details**, not a booked wedding event. The map searches Yangon, **not a specific venue**.
- The 32 planned final image assets have **not** been produced. SVG illustrations are temporary, original prototype artwork and will be refined with the final art production.
- No payment collection, RSVP, backend, customer admin, or domain setup.
- The copied URL is only usable on **your own computer** while your server is running. This is not a publicly shared invitation link.
- The source is tracked in the GitHub repository; this is a prototype, not a final production release.

## Preview data
Edit `DEMO` at the top of `app.js` for the headline names and countdown date, and edit the sample paragraphs in `index.html` for copy. This is a prototype, not a finalized customization system.
