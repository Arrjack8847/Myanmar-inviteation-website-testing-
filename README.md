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

## Section 1 — Production-quality improvement pass (current focus)

All work from here is limited to the initial **envelope/butterfly opening** and the **Golden Autumn Gateway hero**. Sections 2–6 are not part of the current development scope.

The approved 853×1844 garden master remains a **single, complete illustration**. The new `hero-quality.css` file is loaded last. After reviewing the actual phone screenshot, we corrected the first attempt: `object-fit:contain` produced obvious peach side bars. The phone layout now uses `object-fit:cover` with a deliberate vertical crop (without image distortion), positions wedding names in the arch, removes the unwanted keyboard-focus box around the noninteractive names, and handles short screens without parallax or scroll snapping. The original master file is unchanged.

Opening improvements:
- The envelope/butterfly is a native HTML button, accessible to mouse, touch, and keyboard users.
- The opening overlay is labeled as a modal; background controls stay inert while it is active.
- Open, Skip, Escape, Tab, Shift+Tab, and reduced-motion opening paths are supported; focus moves to the couple's names when opened.
- Hero image dimensions are declared to reduce avoidable layout shift, and the scroll cue has an accessible focus state.

Run tests:

```powershell
node tests/smoke.cjs
node tests/hero-interaction.cjs
node server.js
```

View `http://localhost:4173/art-review.html` to compare actual **320×568**, **390×844**, **430×932** virtual phone sizes, with or without the invitation text.

The acceptance criteria for calling Section 1 production-ready are defined in `HERO_QA.md`. Source checks and isolated JavaScript behavior simulations have passed, but real browser screenshots, iOS/Android accessibility checks, Lighthouse measurements, and master-image optimization remain **unverified**. Do not treat this as a final 10/10 release until those gates pass.

## Section 2 — formal family invitation

The second section now uses your newly uploaded **one-piece illustrated invitation master** `art/section2_family_invitation_master.png` (1086 × 1448 PNG). The stone path along its top is intended to continue Section 1; its burgundy flowers, gold frame and sunset are all painted as ONE matching picture. Burmese-first and English invitation wording, two family blocks, and the wedding date stay accessible, editable HTML.

**Responsive edge handling:** The ornate image is presented with CSS `border-image` nine-slicing: the top arch, all four corners, and bottom scenery remain intact, while only the spacious parchment center adjusts for longer family names or Burmese text. We do not stretch the whole illustration vertically, crop away the frame, or add separate decorative PNG overlays. This is one master source, not nineteen independent artwork layers. The precise Section 1→2 join still needs real-phone review. Section 3's dedicated transition illustration is not yet integrated.

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

## Section 3 — ceremony and reception master artwork

Section 3 now displays a **single, complete original image**, with its two ivory-and-gold frames and surrounding autumn garden painted together. The existing HTML ceremony and reception details overlay the two empty panels. The flowers, carvings, lanterns, stone path and sunset are not reassembled from separate assets.

**Upload location:** the approved 1086×1448 image was uploaded to the public repository `Arrjack8847/testing-version-2` as `1d9dbc80-eada-40a7-b1be-7182c2cffbbe.png` at commit `66f9366ae4037238345f232e4185be4b44aaf697`, rather than the Golden Autumn Heritage V4 repo. The image bytes were checked against the generated Section 3 artwork (matching Git blob `fca0d987ac2e13686dfd08463401a6c5f24e023e`).

Until that PNG is copied to this repository, `index.html` loads a **fixed-commit** public raw GitHub URL for the artwork. This is a **temporary external dependency**: the remote file must remain publicly accessible during previews. Before production, upload that exact PNG to `art/section3_ceremony_reception_master.png` in this repository and change the `<img class="ceremony-master-art">` source to the local path.

Both events remain customizable via `WEDDING_EVENTS` in `app.js`. Unconfirmed locations show a pending notice and never offer invented directions. Actual long Burmese/venue text and visual joins at 320/390/430px must still be reviewed on a phone. Styling and responsive panel overlays are in `events-art.css`.

Preview: `http://localhost:4173/index.html?heroPreview=1#details`.

## Mobile QA and simplified scrolling styles (next pass)

To reduce cascading-layout bugs, the old `screen-fit.css` is **no longer loaded**. It remains in the repository as a historical backup only. The final live stylesheets now load `hero-quality.css` followed by `flow-quality.css`. The scroll anchor uses only one 34px offset for the fixed demo bar, avoiding unintended extra top space.

Open `http://localhost:4173/flow-review.html` to inspect the **actual website** at 320 × 568, 390 × 844 or 430 × 932, jump between the three painted scenes, and run automatic page-geometry checks. The page reports the measured space/overlap at both joins, any horizontal overflow, whether the whole document scrolls, and whether the invitation still has an unwanted nested scrollbar. It requires no npm packages.

The browser review page is a **local diagnostic**; passing geometry checks does not establish that the independently painted illustrations are pixel-perfect at the joins. Continue inspecting actual phone screenshots before publishing.

## Continuous scrolling — Sections 1, 2 and 3 (latest repair)

The November 1 mobile screenshots exposed a major layout regression: Section 2 was fixed to `100svh`, leaving a **large empty peach band** before Section 3. Scroll gestures could also get captured by nested parchment/event scroll containers.

The corrective **`flow-quality.css`** stylesheet is loaded **last**, after `hero-quality.css` (the obsolete `screen-fit.css` is no longer linked). It restores natural vertical document flow.

- **Section 1** remains a single-viewport gateway scene. Its complete static painting and live HTML names remain unchanged. The visible scroll cue stays above the transition.
- **Section 2** now grows to fit its actual bilingual family-invitation content. No fixed section height, no filler band, no extra inner scroll. The approved one-piece nine-slice gold floral artwork is unchanged.
- **Section 3** begins immediately after Section 2, sized at the artwork's native 1086:1448 aspect ratio. Its two event panels remain editable live HTML; the complete illustration is unchanged.
- On browsers supporting CSS masking, **small 18–28px feathered overlaps** soften the Section 1 → 2 and Section 2 → 3 handoffs. This helps but does **not** guarantee pixel-perfect seams between separately painted images. On browsers without mask support, the sections still join directly with no empty spacer.
- Normal **touch swipes scroll the whole page**, with no scroll snapping, parallax, fixed-height image sections or nested scrolling traps.

**Trade-off:** Section 2 is no longer guaranteed to fit in exactly one screen on short phones. Showing all real names, Burmese wording and dates without clipping is more important. The website scrolls naturally like a long invitation.

The top banner still identifies the site as a local demo with sample details. The redundant long section disclaimers remain in accessible markup but no longer take up extra visual strips between the illustrations.

To test:
```powershell
git pull --ff-only origin feat/hires-garden-preview-20261101
node tests/smoke.cjs
node tests/hero-interaction.cjs
node server.js
```

Preview: `http://localhost:4173/index.html?heroPreview=1#home`. Swipe from the garden path through the family invitation into the ceremony without being stopped by empty colored space. Review at 320×568, 390×844, and 430×932.

## Section 4 — Love Story & Countdown

Section 4 is a static ivory stationery story paired with a live four-part countdown; there is **no scroll-triggered scenery animation**.

- Three original story chapters, with placeholder prompts (no fabricated relationship history)
- Burmese and English headings, antique-gold decorative frames, accessible live text
- One `LOVE_STORY` object in `app.js` controls the introduction, chapter titles and chapter paragraphs
- The countdown uses `DEMO.weddingDateISO` and displays days, hours, minutes and seconds in Myanmar-time sample configuration
- Invalid wedding dates display `--` and a pending status; elapsed dates display zero and a day-arrived message
- The sample dates and all story details **must be replaced with confirmed couple information**

Example personalization in `app.js`:

```js
const LOVE_STORY = {
  introduction: 'The moments that make your story uniquely yours.',
  chapters: [
    { title: 'The Beginning', text: 'Add how the couple met.' },
    { title: 'Our Cherished Moments', text: 'Share a memory.' },
    { title: 'A New Chapter', text: 'Add a personal message.' }
  ]
};
```

The styled content and responsive countdown are in `story.css`. Preview Section 4 directly at:

`http://localhost:4173/index.html?heroPreview=1#countdown`

## Assets

- `art/golden_autumn_heritage_master_v4.png` — sole garden image on the first section
- `art/section2_family_invitation_master.png` — approved Section 2 illustration, protected by safe-edge scaling
- `20_butterfly_body.png`, `21_butterfly_left_wing.png`, `22_butterfly_right_wing.png` — opening butterfly
- `23_...` to `28_...` — leaves for brief opening gust
- `29_...` to `30_...` — invitation card and seal
- `31_...` to `32_...` — ornaments for lower sections

Earlier individual garden and gateway assets remain in the repository as unused backups, not active scenery. See `V4_ART_DIRECTION.md`.

## Sample details and status

Names **Thiri & Min**, date **20 June 2027**, and Yangon event information are **fictional placeholders**. Change couple names/date in the `DEMO` object and event details in `WEDDING_EVENTS` in `app.js`.

This remains a local, un-deployed prototype: no RSVP database, payment system or public domain. The master artwork is relatively large; image compression and real-device QA are recommended before production.
