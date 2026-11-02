# Golden Autumn Heritage — Release Candidate 1

**Status:** Development candidate, **not commercially released**. Review this branch through [PR #4](https://github.com/Arrjack8847/Myanmar-inviteation-website-testing-/pull/4). The standalone public Vercel V4 demonstration is not automatically updated by GitHub.

**Branch:** `feat/section4-connected-story-art-20261102`.

## Exactly what is in the candidate

- Sections 1–3: original approved painted masters, butterfly/garden motion, family invitation and readable wedding event cards.
- Sections 4–5: new expandable illustrated story and live countdown, using the uploaded 1024×1536 PNG for Golden Autumn; separate lavender fallback for Moonlit Amethyst.
- Section 6: skin-matched evening garden closing, functional share and back-to-garden controls.
- Styling and QA for 320 / 390 / 430 CSS-pixel phones and long Burmese/English text.
- Share-link safety: remove `heroPreview`, `artReview`, fragments and tracking parameters; preserve a valid explicit `skin` selection; never copy localhost/LAN URLs as guest links.
- Customized countdown note: avoid a false default Myanmar time-zone claim when the client provides a different date/time offset.

## Review on a Windows laptop

Open PowerShell in the existing repository:

```powershell
git fetch origin
git switch feat/section4-connected-story-art-20261102
git pull --ff-only origin feat/section4-connected-story-art-20261102
node tests/smoke.cjs
node tests/skin-system.cjs
node tests/hero-interaction.cjs
node tests/release-candidate.cjs
node tests/story-art.cjs
node server.js
```

Open `http://localhost:4173`. The opening screen is the actual guest experience; `?heroPreview=1` skips the cover for design review only. Check the two skins:

- `http://localhost:4173/index.html?skin=golden-autumn`
- `http://localhost:4173/index.html?skin=moonlit-amethyst`

Stop the server with **Ctrl+C**. This is a preview, not a publicly shareable link.

## Review on a real iPhone / Android over the same **private** Wi-Fi

Stop any existing local preview and run:

```powershell
$env:HOST="0.0.0.0"
node server.js
```

Find the computer's private-network IPv4 with `ipconfig`, then open **`http://YOUR-COMPUTER-LAN-IP:4173`** from Safari / Chrome on the phone while both devices use the same trusted Wi-Fi. Allow access through Windows Firewall for **Private** networks only if asked. Never expose this development server to public Wi-Fi or the internet. After checking, stop the server and clear the temporary override:

```powershell
# Ctrl+C to stop server first
Remove-Item Env:HOST
```

The copy invitation button intentionally refuses a LAN link; only use it on a real public HTTPS preview.

## Acceptance

- [x] Automated source, art, and mobile Chromium checks passing on the release candidate (confirm the **latest** PR run).
- [x] Guest-link canonicalization / local preview safeguards implemented.
- [x] Customer personalization, map whitelist, live countdown and guest interactions covered by browser tests.
- [ ] Confirm the subtle reflected stone texture at the Section 5 → 6 seam is acceptable; the join is not a custom-painted perfect match.
- [ ] Real iPhone Safari complete scroll and interaction review.
- [ ] Real Android Chrome complete scroll and interaction review.
- [ ] Final owner-approved names, Myanmar-language copy, families, story, event venues, dates and map links.
- [ ] Commercial-compatible hosting, HTTPS, distinct customer deployment, agreed support/expiry period.
- [ ] Final customer-approved guest link and explicit sign-off.

**Do not remove the demonstration notices or publish client data before confirmation.** Merge to `main` and deploy only after acceptance. See `FINAL_VISUAL_QA.md` and `CLIENT_RELEASE_CHECKLIST.md`.
