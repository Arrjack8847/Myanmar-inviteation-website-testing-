# Golden Autumn Heritage — unified garden invitation (V4 preview)

An original, mobile-first Myanmar-inspired digital wedding invitation. This V4 branch intentionally shows **one complete garden illustration** for the first section: an ivory-and-gold gateway, roses, autumn trees, path and sunset all remain perfectly connected.

The master image is `art/golden_autumn_heritage_master_v4.png`. It is displayed as one static image, with **real HTML wedding names and date** on top. There are **no separate moving scenery layers and no scroll/parallax animation** in the first section.

The opening retains a decorative envelope, butterfly with independent wings, a brief wind-and-leaf effect and optional Skip. After opening, the garden stays still and guests simply scroll to the invitation and event information.

## Run the V4 preview locally

Requires Node.js 18+. No npm install or build is required.

```powershell
git clone https://github.com/Arrjack8847/Myanmar-inviteation-website-testing-.git
cd Myanmar-inviteation-website-testing-
git switch feat/hires-garden-preview-20261101
node tests/smoke.cjs
node server.js
```

Open these URLs:

- `http://localhost:4173` — full invitation and opening
- `http://localhost:4173/art-review.html` — switch 320/390/430-pixel phone widths and show artwork with or without live text
- `http://localhost:4173/index.html?heroPreview=1` — jump directly to the hero with text, skipping the opening

For an existing cloned repository, use `git fetch origin` followed by `git switch feat/hires-garden-preview-20261101` and `git pull --ff-only origin feat/hires-garden-preview-20261101`.

## Section 2 — formal family invitation

The second section is a new ivory-and-antique-gold wedding stationery card with Burmese-first wording, English translation, two family blocks, gold corner ornaments, and a live wedding date. The design is static and scrolls naturally after the complete garden illustration.

To personalize the demo, change these values in `app.js`:

```js
const DEMO = {
  firstName: 'Thiri',
  secondName: 'Min',
  firstFamily: "Parents' names to be added",
  secondFamily: "Parents' names to be added",
  weddingDateISO: '2027-06-20T16:30:00+06:30',
  displayDate: '20 JUNE 2027',
};
```

The parent fields deliberately show placeholders rather than invented family names. Replace them with **confirmed** names before publishing a customer's invitation. Review and customize the Burmese wording with the couple for the appropriate ceremony and formality.

Open `http://localhost:4173/index.html?heroPreview=1#invitation` to skip the cover and jump straight to Section 2.

## Assets

- `art/golden_autumn_heritage_master_v4.png` — sole garden image on the first section
- `20_butterfly_body.png`, `21_butterfly_left_wing.png`, `22_butterfly_right_wing.png` — opening butterfly
- `23_...` to `28_...` — leaves for brief opening gust
- `29_...` to `30_...` — invitation card and seal
- `31_...` to `32_...` — ornaments for lower sections

Earlier individual garden and gateway assets remain in the repository as unused backups, not active scenery. See `V4_ART_DIRECTION.md`.

## Sample details and status

Names **Thiri & Min**, date **20 June 2027**, and Yangon event information are **fictional placeholders**. Change the demonstration names/date in the `DEMO` object in `app.js` and real event details in `index.html`.

This remains a local, un-deployed prototype: no RSVP database, payment system or public domain. The master artwork is relatively large; image compression and real-device QA are recommended before production.
