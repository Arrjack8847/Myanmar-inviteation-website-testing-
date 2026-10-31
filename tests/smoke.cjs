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
assert.equal((hero.match(/<img\\b/g) || []).length, 1, 'Hero should have exactly one image');
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
console.log('PASS: 32 archived prototype assets, single master-image hero, opening interaction, V4 master and review page verified.');
console.log('Next: test actual mobile framing, butterfly opening, natural scrolling and text readability.');
