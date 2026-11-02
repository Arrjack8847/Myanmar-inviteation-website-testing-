# Bride & Groom Gallery — phone test guide

This ZIP is a **development preview** from PR #6, not the public wedding invitation or a real couple's finished invitation. It includes Golden Autumn and Moonlit Amethyst skins; no client photographs have been uploaded. The decorative portrait and gallery placeholders are intentional.

## 1. Start it on Windows

Unzip the complete archive into a normal folder, open PowerShell **in the extracted folder**, and enter:

```powershell
node server.js
```

Visit `http://localhost:4173/index.html?skin=golden-autumn` on the computer.

The two themed versions are `?skin=golden-autumn` and `?skin=moonlit-amethyst`.

## 2. Test it on a phone (same private Wi-Fi)

Stop the existing server with Ctrl+C, then run:

```powershell
$env:HOST="0.0.0.0"
node server.js
```

In another PowerShell window run `ipconfig` and find the **IPv4 address** under the connected Wi-Fi adapter (for example `192.168.1.15`). Open `http://YOUR-LAPTOP-IP:4173` in iPhone Safari or Android Chrome on that same private network. Avoid public Wi-Fi, internet port forwarding or sharing this preview address with guests. Stop the server with Ctrl+C and clear the environment variable afterward using `Remove-Item Env:HOST`.

## 3. What to inspect

- Open the invitation from the butterfly/envelope, scroll through the existing illustrated garden to **Our Love Story**.
- Immediately after the three story chapters, inspect **The Bride & Groom**. Check the two 3:4 portrait frames, captions and their name wrapping in English/Burmese.
- The **Our Photo Gallery** grid shows four decorative placeholders until real couple-approved pictures are installed.
- Continue to the live countdown: the gallery should remain **inside the same garden parchment**, with no break or repeated path artwork.
- Switch to Moonlit Amethyst and check its violet floral-paper styling and no Golden-only border.
- Check on 320px, 390px and 430px phones where possible, including larger accessibility text and reduced motion.

## 4. Test the photo viewer with approved example photos (optional)

Only use images you have permission to publish. Put copies in the `photos/` subfolder and edit `wedding-config.js`. The template accepts `photos/bride.webp`, `photos/groom.webp`, and up to 8 shared images, for example `photos/moment-01.webp`. Set meaningful `alt` text and captions.

The viewer can be opened by tapping a gallery photo, navigated with previous/next controls (or left/right keyboard arrows), and closed with Escape or the X button. Missing images fall back without breaking the page.

**Do not publish this test as a customer invitation** until dates, names, venue links and photo permissions are confirmed. Real photos are intentionally not shipped in this preview.

## 5. Verify the package

`RC1_FILE_MANIFEST.json` records every included file's SHA-256 digest and the exact GitHub commit. Use the GitHub Actions results for browser QA; a passing Chromium test is not a substitute for physical Safari/Android acceptance.
