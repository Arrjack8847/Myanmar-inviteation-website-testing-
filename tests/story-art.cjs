/** Storybook continuity / static asset contract. Node 18+. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html');
const css=read('story-art-v5.css');
const imageName='4ba5ed04-e01d-4bed-a71e-42f2bdf5f8a5.png';
const png=fs.readFileSync(path.join(root,imageName));
assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a','Uploaded story artwork is not PNG');
assert.equal(png.readUInt32BE(16),1024,'Story artwork width must match approved asset');
assert.equal(png.readUInt32BE(20),1536,'Story artwork height must match approved asset');
assert(html.includes('href="story-art-v5.css"'),'Artwork stylesheet is not linked');
assert(css.includes(imageName),'Uploaded artwork not referenced');
assert(css.includes('aspect-ratio:1024 / 350'),'Upper decorative cap lost fixed proportions');
assert(css.includes('aspect-ratio:1024 / 576'),'Lower cap or complete crest not retained');
assert(!css.includes('background-size:100% 100%'),'Do not stretch flowers and crests');
const section=html.split('<section class="content-section countdown-section')[1]?.split('<section class="content-section closing-section"')[0]||'';
assert(section.includes('story-illustrated-cap--top'),'Missing upper illustrated edge');
assert(section.includes('story-illustrated-cap--bottom'),'Missing lower illustrated edge');
assert(section.includes('story-illustrated-body'),'Expandable parchment missing');
for(const n of [0,1,2]) {
  assert(section.includes('data-story-title="'+n+'"'),'Missing editable story title '+n);
  assert(section.includes('data-story-text="'+n+'"'),'Missing editable story paragraph '+n);
}
assert(section.includes('data-story-intro'),'Editable story introduction must survive');
assert(section.includes('id="countdownTitle"'),'Countdown must still exist');
assert(css.includes('html[data-skin="moonlit-amethyst"] .story-illustrated-cap'),
 'Do not expose golden-only artwork in unapproved Moonlit skin');
assert(css.includes('prefers-reduced-motion:reduce'),'Reduced-motion support missing');
console.log('PASS story artwork, live text fields, native edge caps and Moonlit fallback');
