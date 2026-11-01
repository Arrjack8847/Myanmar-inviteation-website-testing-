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
assert(css.includes('border-image-slice:350 95 576 95 fill'),'Original top/bottom ornament slices missing');
assert(css.includes('border-image-repeat:stretch round'),'Floral side borders must repeat instead of elongating');
assert(!css.includes('background-size:100% 100%'),'Do not stretch flowers and crests');
const section=html.split('<section class="content-section countdown-section')[1]?.split('<section class="content-section closing-section"')[0]||'';
assert(section.includes('story-illustrated-frame'),'Illustrated frame missing');
assert(section.includes('story-illustrated-body'),'Expandable parchment missing');
for(const n of [0,1,2]) {
  assert(section.includes('data-story-title="'+n+'"'),'Missing editable story title '+n);
  assert(section.includes('data-story-text="'+n+'"'),'Missing editable story paragraph '+n);
}
assert(section.includes('data-story-intro'),'Editable story introduction must survive');
assert(section.includes('id="countdownTitle"'),'Countdown must still exist');
assert(html.includes('href="countdown-garden.css"'),'Missing connected countdown stylesheet');
const countdownCSS=read('countdown-garden.css');
assert(countdownCSS.includes('.story-illustrated-frame .countdown-panel'),'Countdown is not styled as part of the illustrated frame');
assert(countdownCSS.includes('html[data-skin="moonlit-amethyst"]'),'Moonlit countdown palette missing');
assert(countdownCSS.includes('prefers-reduced-motion:reduce'),'Countdown motion preference not respected');
assert(section.includes('class="story-ornament countdown-ornament"'),'Skin-swappable countdown divider missing');
for(const id of ['countdownTitle','days','hours','minutes','seconds']){
  assert(section.includes('id="'+id+'"'),'Existing live countdown element lost: '+id);
}
assert(css.includes('html[data-skin="moonlit-amethyst"] .story-illustrated-frame'),
 'Do not expose golden-only artwork in unapproved Moonlit skin');
assert(css.includes('prefers-reduced-motion:reduce'),'Reduced-motion support missing');
console.log('PASS story artwork, live text fields, native edge caps and Moonlit fallback');
