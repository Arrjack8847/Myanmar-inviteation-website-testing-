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
const allRefs = new Set((html + '\\n' + js + '\\n' + css).match(/[A-Za-z0-9 _-]+\\.png/gi) || []);
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
const hires = [
  'b65423f6-2734-44c9-aea4-e5f8664c6791.png',
  '33f72e4a-3e85-427e-bdf7-c39f1593c12d.png',
  '3a622f26-2c76-4e0e-a027-ccf977620914.png',
  'a45d4cf5-76f6-4f6f-b51d-c45dc5941e2a.png',
  '0c0a99fe-bb8c-42e5-8a73-7618b6eb4f56.png',
  'cbb45c37-2362-4c72-a679-465a61b6fee3.png',
  '3ec0cb2d-82c0-46df-a41f-204ec1736509.png',
  '43aed033-b3ac-42c6-9647-da91c4aeceda.png',
  '21a52e66-2e3e-4bd8-a7cf-4f39403eb9ce.png',
  'e4deaafc-bcc6-4006-bf5c-76a59bb63a8e.png',
  '7b9ea3d4-30ec-4ff0-8191-bb7965ea4c3c.png',
  'right gateway pillar.png',
  'bc49a68d-c598-4e98-b901-193bb6db44e8.png'
];
for (const file of hires) {
  assert(fs.existsSync(path.join(root,file)), 'Missing high-resolution source: ' + file);
  assert(html.includes('src="'+file+'"'), 'High-resolution art not used in hero: ' + file);
  const b = fs.readFileSync(path.join(root,file));
  assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'Not PNG: '+file);
}
console.log('PASS: 32 archived prototypes valid; 13 high-resolution artworks found and used; interactive hooks present.');
console.log('Next: open in a real browser, tap Open/Skip, scroll to venue and test mobile layout.');
