# Golden Autumn Heritage — mobile wedding invitation

An original Myanmar-inspired, mobile-first invitation website built with
plain **HTML, CSS and JavaScript**. This repository contains a **demo** with
sample names and dates, not a finalized customer's event.

## Live features
- Tap-to-open envelope with a fluttering butterfly and one-time wind gust
- Responsive painted gateway with editable, automatically fitted names
- Soft continuous *transparent overlay* leaves and swaying floral accents
- Original painted backgrounds stay intact and still (no scene parallax)
- Family wedding invitation, Burmese and English copy
- Two event panels, readable ceremony/reception information and approved maps
- Story chapters, real countdown based on the configured date, share button
- Full reduced-motion, touch-scroll and keyboard opening handling
- Two coordinated artwork skins using identical animation mechanics

**Skins:** `golden-autumn` (the original) and `moonlit-amethyst` (a cool
palette variation generated from our own approved master paintings). The
second skin is not a separate, newly hand-illustrated environment.

## Run
```powershell
git clone https://github.com/Arrjack8847/Myanmar-inviteation-website-testing-.git
cd Myanmar-inviteation-website-testing-
git switch feat/hires-garden-preview-20261101
node tests/smoke.cjs
node tests/skin-system.cjs
node tests/hero-interaction.cjs
node server.js
```
Open `http://localhost:4173` for the demo and
`http://localhost:4173/skins-gallery.html` to compare the two skins.

## Prepare a customer order
Edit **`wedding-config.js`** and change `skin`, `couple`, `story` and
`events`. The single editable file overrides demo defaults in
`app.js`. Confirm all names, map links and dates with the couple.
See `CLIENT_RELEASE_CHECKLIST.md` before publishing.

## Development & verification
- `art-review.html`: source artwork and typography at three phone sizes
- `flow-review.html`: check exactly where painted scene edges meet
- `tests/browser-flow.cjs`: real Chromium touch and width regression suite
- `tests/skin-system.cjs`: verify each registered skin and file dimensions
- `.github/workflows/mobile-browser-qa.yml`: test each branch push
- `.github/workflows/create-marketing-reels.yml`: render two vertical demos
- `MARKETING_LAUNCH.md`: launch script, captions and customer workflow

## Release policy
Sample details and imagery are for demonstration only. Keep the customer's
site/deployment separate and do not publish an invitation until the couple
approves names, dates, wording and venue links. Run mobile browser QA and
inspect a real iPhone/Android as well. A Vercel deployment requires the
repository's GitHub connection in the destination Vercel account.

`README_HISTORY.md` contains earlier prototype implementation notes.
