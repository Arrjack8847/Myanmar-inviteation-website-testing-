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
const allRefs = new Set((html + '\n' + js + '\n' + css).match(/\d{2}_[a-z0-9_]+\.png/gi) || []);
for (const file of assets) {
  assert(allRefs.has(file), 'Artwork not referenced: ' + file);
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
console.log('PASS: 32 valid PNGs, every asset referenced, interaction hooks and stylesheet present.');
console.log('Next: open in a real browser, tap Open/Skip, scroll to venue and test mobile layout.');
