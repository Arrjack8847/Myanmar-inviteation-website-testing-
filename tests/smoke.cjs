/** Golden Autumn Heritage — dependency-free source and artwork sanity checks.
 * Run: node tests/smoke.cjs (Node.js 18+)
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root,f), 'utf8');
const html = read('index.html'), js = read('app.js'), css = read('artwork.css');
const assets = fs.readdirSync(root).filter(f => /^\d{2}_[a-z0-9_]+\.png$/i.test(f)).sort();
assert.equal(assets.length, 32, 'Expected all 32 extracted PNG artwork assets in the repository root');
for (const file of assets) {
  // Original 32 prototype files are preserved as a recoverable fallback.
  const data = fs.readFileSync(path.join(root,file));
  assert(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'Not a PNG: '+file);
  const w=data.readUInt32BE(16),h=data.readUInt32BE(20);
  assert(w>0&&h>0, 'Invalid dimensions: '+file);
  assert.equal(data[25], 6, 'Expected RGBA (color type 6): '+file);
}
assert(html.includes('href="artwork.css"'), 'artwork.css is not linked');
assert(html.includes('src="20_butterfly_body.png"'), 'Butterfly body missing');
assert(html.includes('src="29_opening_invitation_card.png"'), 'Opening card missing');
assert(js.includes('28_leaf_small_russet.png'), 'Sixth PNG leaf not used in animation');
for (const id of ['openingCover','openInvitation','skipOpening','butterfly','leafField','days','hours','minutes','seconds','shareButton']) {
  assert(html.includes('id="'+id+'"'), 'Missing interactive element '+id);
}

/* The first section intentionally contains ONE image. The separate assets remain
   available in the repository but must not reappear in the assembled hero. */
const hero = html.split('<section class="hero"')[1]?.split('<div class="hero-topline"')[0] || '';
assert(hero.includes('src="art/golden_autumn_heritage_master_v4.png"'), 'Master image missing from hero');
assert.equal((hero.match(/<img\b/g) || []).length, 1, 'Hero should have exactly one image');
assert(!hero.includes('scene-art'), 'Old separate scenery layers should be removed');
assert(html.includes('id="leafField"'), 'Opening wind leaf field missing');
assert(!js.includes('window.setInterval'), 'Static hero must not continuously spawn leaves');
const masterPath=path.join(root,'art','golden_autumn_heritage_master_v4.png');
const masterImage=fs.readFileSync(masterPath);
assert(masterImage.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'V4 master is not a PNG');
assert(masterImage.readUInt32BE(16)>=800 && masterImage.readUInt32BE(20)>=1700, 'V4 master is unexpectedly small');
const review=read('art-review.html');
assert(review.includes('art/golden_autumn_heritage_master_v4.png'), 'Review page not linked to master image');
assert(review.includes('index.html?artReview=1'), 'Review page not linked to static scene preview');
assert(js.includes("get('artReview')"), 'Preview route not enabled');

/* Section 2 must be a single complete invitation, not disconnected overlays. */
assert(html.includes('href="invitation.css"'), 'Missing Section 2 stylesheet');
const section = html.split('<section class="content-section invitation-section"')[1]?.split('<section class="content-section details-section"')[0] || '';
assert(section.includes('class="heritage-invitation"'), 'Formal invitation card missing');
assert(section.includes('lang="my"'), 'Myanmar wording missing');
assert(section.includes('data-name="first"') && section.includes('data-name="second"'), 'Family couple names are not dynamic');
assert(section.includes('data-family="first"') && section.includes('data-family="second"'), 'Parent-name fields are missing');
assert(section.includes('data-date-text'), 'Invitation date not connected to DEMO');
assert(!section.includes('class="heritage-corner'), 'Separate artwork corners must not be layered onto the master');
assert(!section.includes('src="32_gold_corner_ornament.png"'), 'Avoid duplicated gold ornaments over the master');
const invitationArt = fs.readFileSync(path.join(root, 'art', 'section2_family_invitation_master.png'));
assert(invitationArt.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'Section 2 master is not PNG');
assert.equal(invitationArt.readUInt32BE(16), 1086, 'Section 2 master unexpected width');
assert.equal(invitationArt.readUInt32BE(20), 1448, 'Section 2 master unexpected height');
const invitationCss = read('invitation.css');
assert(invitationCss.includes('art/section2_family_invitation_master.png'), 'Uploaded Section 2 artwork not used');
assert(invitationCss.includes('border-image-slice:355 120 470 120 fill'), 'Responsive safe-edge art slicing missing');
assert(!invitationCss.includes('animation:parallax'), 'No image parallax allowed in Section 2');
assert(js.includes('firstFamily:') && js.includes('secondFamily:'), 'Parent-name customization missing');
assert(read('invitation.css').includes('.heritage-invitation-inner'), 'Invitation styling missing');
const closing = html.split('<section class="content-section closing-section"')[1] || '';
assert(closing.includes('data-name="first"') && closing.includes('data-name="second"'), 'Closing names are not linked to DEMO');
assert.equal((html.match(/class="content-section invitation-section"/g) || []).length, 1, 'Duplicate invitation section');

/* Section 3: independently editable ceremony and reception with gated directions. */
assert(html.includes('href="events.css"'), 'Missing ceremony/reception stylesheet');
const eventsSection = html.split('<section class="content-section details-section"')[1]?.split('<section class="content-section countdown-section"')[0] || '';
assert(eventsSection.includes('data-event="ceremony"'), 'Ceremony card missing');
assert(eventsSection.includes('data-event="reception"'), 'Reception card missing');
assert.equal((eventsSection.match(/data-event-link hidden/g) || []).length, 2, 'Directions should start hidden');
assert.equal((eventsSection.match(/data-event-pending/g) || []).length, 2, 'Missing unconfirmed-venue notices');
assert.equal((eventsSection.match(/data-event-field="venue"/g) || []).length, 2, 'Venue editing fields missing');
assert.equal((eventsSection.match(/data-event-field="date"/g) || []).length, 2, 'Date editing fields missing');
assert.equal((eventsSection.match(/data-event-field="time"/g) || []).length, 2, 'Time editing fields missing');
assert(!eventsSection.includes('href="https://www.google.com/maps/search/?api=1&amp;query=Yangon'), 'Generic Yangon directions must not be offered');
assert(js.includes('const WEDDING_EVENTS = {'), 'Central event configuration missing');
assert(js.includes('function renderWeddingEvents()'), 'Event rendering missing');
assert(js.includes('function approvedMapUrl(rawUrl)'), 'Map URL validation missing');
assert(js.includes('event.venueConfirmed ? approvedMapUrl(event.mapUrl)'), 'Directions must require venue confirmation');
assert(js.includes('renderWeddingEvents();'), 'Event rendering not called');
assert(read('events.css').includes('.celebration-events'), 'Event card styling missing');

/* Section 3: the artwork is one complete illustrated source from the user's
   testing-version-2 upload. The live text floats inside its two original
   frames, not inside duplicated rectangular/card borders. */
const section3MasterUrl='https://raw.githubusercontent.com/Arrjack8847/testing-version-2/66f9366ae4037238345f232e4185be4b44aaf697/1d9dbc80-eada-40a7-b1be-7182c2cffbbe.png';
assert(eventsSection.includes(section3MasterUrl), 'Uploaded section 3 source missing');
assert.equal((eventsSection.match(/class="ceremony-master-art"/g)||[]).length, 1, 'Section 3 must render exactly one master image');
assert.equal((eventsSection.match(/class="celebration-event"/g)||[]).length, 2, 'Expected exactly two live overlays for the two painted panels');
assert(!eventsSection.includes('class="celebration-event-number"'), 'Do not reintroduce floating extra artwork ornaments');
const eventsArtCss = read('events-art.css');
assert(html.includes('href="events-art.css"'), 'Section 3 art CSS is not linked');
assert(eventsArtCss.includes('.ceremony-master-scene'), 'Unified Section 3 scene styles missing');
assert(eventsArtCss.includes('aspect-ratio:1086 / 1448'), 'Do not stretch the complete Section 3 illustration');
assert(eventsArtCss.includes('background:transparent'), 'Native ornamented panels must stay visible beneath live text');
assert(!eventsArtCss.includes('ScrollTrigger')&&!eventsArtCss.includes('parallax'), 'Section 3 must stay still during page scroll');


/* Section 4: optional factual story copy and live countdown. */
assert(html.includes('href="story.css"'), 'Missing Love Story stylesheet');
const storySection = html.split('<section class="content-section countdown-section story-countdown-section"')[1]?.split('<section class="content-section closing-section"')[0] || '';
assert(storySection.includes('id="storyTitle"'), 'Love Story heading missing');
assert(storySection.includes('id="countdownTitle"'), 'Countdown heading missing');
assert(storySection.includes('lang="my"'), 'Love Story Myanmar heading missing');
assert.equal((storySection.match(/class="story-chapter"/g) || []).length, 3, 'Expect three editable story chapters');
assert.equal((storySection.match(/data-story-title="[0-2]"/g) || []).length, 3, 'Story chapter titles not editable');
assert.equal((storySection.match(/data-story-text="[0-2]"/g) || []).length, 3, 'Story chapter body not editable');
assert(storySection.includes('data-story-intro'), 'Story introduction missing');
assert(storySection.includes('data-date-text'), 'Countdown display date not linked to shared date');
assert(storySection.includes('id="countdownStatus"'), 'Countdown state message missing');
for (const id of ['days','hours','minutes','seconds']) {
  assert(storySection.includes('id="' + id + '"'), 'Countdown field missing: '+id);
}
assert(js.includes('const LOVE_STORY = {'), 'Love Story configuration missing');
assert(js.includes('function renderLoveStory()'), 'Love Story renderer missing');
assert(js.includes('renderLoveStory();'), 'Love Story renderer never called');
assert(js.includes('Number.isFinite(deadline)'), 'Countdown should guard invalid dates');
assert(js.includes('The wedding day has arrived'), 'Countdown should show the past-date state');
assert(read('story.css').includes('.story-paper-inner'), 'Love Story styles missing');
assert(read('story.css').includes('@media(max-width:520px)'), 'Love Story mobile styling missing');
assert.equal((html.match(/class="content-section countdown-section story-countdown-section"/g) || []).length, 1, 'Duplicate Section 4');



console.log('PASS: V4 unified garden, Section 2 safe-edge frame, Section 3 illustrated two-panel scene, editable events, story and countdown.');
console.log('Next: test actual mobile framing, butterfly opening, natural scrolling and text readability.');
