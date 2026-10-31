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

## Section 3 — ceremony and reception cards

The wedding-details section now presents two matching, responsive ivory-and-antique-gold cards: **Wedding Ceremony** and **Wedding Reception**. Each displays a date, time, venue, address and an optional directions link.

All event-specific values are stored in the `WEDDING_EVENTS` object near the beginning of `app.js`, separate from the shared couple information in `DEMO`:

```js
const WEDDING_EVENTS = {
  ceremony: {
    dateLabel: DEMO.displayDate,
    dateISO: DEMO.weddingDateISO.slice(0, 10),
    time: '4:30 PM · MYANMAR TIME',
    venue: 'Venue to be confirmed',
    address: 'Yangon, Myanmar — sample city only',
    venueConfirmed: false,
    mapUrl: ''
  },
  reception: {
    dateLabel: 'Date to be confirmed',
    dateISO: '',
    time: 'Time to be confirmed',
    venue: 'Reception venue to be confirmed',
    address: 'Venue and address to be added',
    venueConfirmed: false,
    mapUrl: ''
  }
};
```

**Important:** These are **demonstration placeholders**, not actual event reservations or addresses. A directions link is only displayed when `venueConfirmed: true` **and** `mapUrl` contains a valid HTTPS Google Maps or Waze URL. Until then, visitors see a courteous pending notice instead of misleading directions.

Open `http://localhost:4173/index.html?heroPreview=1#details` to jump directly to Section 3 and review both cards. Responsive styles live in `events.css`.

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
- `20_butterfly_body.png`, `21_butterfly_left_wing.png`, `22_butterfly_right_wing.png` — opening butterfly
- `23_...` to `28_...` — leaves for brief opening gust
- `29_...` to `30_...` — invitation card and seal
- `31_...` to `32_...` — ornaments for lower sections

Earlier individual garden and gateway assets remain in the repository as unused backups, not active scenery. See `V4_ART_DIRECTION.md`.

## Sample details and status

Names **Thiri & Min**, date **20 June 2027**, and Yangon event information are **fictional placeholders**. Change couple names/date in the `DEMO` object and event details in `WEDDING_EVENTS` in `app.js`.

This remains a local, un-deployed prototype: no RSVP database, payment system or public domain. The master artwork is relatively large; image compression and real-device QA are recommended before production.
