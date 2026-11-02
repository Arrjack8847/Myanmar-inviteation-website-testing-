/* Static integrity and safe upload contract for the couple gallery. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html'),css=read('couple-gallery.css'),js=read('couple-gallery.js');
const config=read('wedding-config.js');
assert(html.includes('href="couple-gallery.css"'),'Gallery CSS not included');
assert(html.includes('src="couple-gallery.js" defer'),'Gallery JS not included');
assert(html.indexOf('src="app.js"')<html.indexOf('src="couple-gallery.js"'),
  'Gallery must initialize after names are personalized');
const s=html.slice(html.indexOf('<section class="couple-gallery-section"'),html.indexOf('<!-- The countdown belongs'));
assert(s.includes('id="gallery"')&&s.includes('id="coupleGalleryGrid"'),'Semantic gallery missing');
assert(s.includes('data-gallery-portrait="bride"')&&s.includes('data-gallery-portrait="groom"'),
  'Individual bride/groom portraits missing');
assert(s.includes('data-gallery-name="bride"')&&s.includes('data-gallery-name="groom"'),
  'Individual bride/groom names missing');
assert(html.includes('id="galleryLightbox"')&&html.includes('<dialog'),
  'Native accessible photo viewer missing');
assert(html.includes('data-gallery-close')&&html.includes('data-gallery-prev')&&html.includes('data-gallery-next'),
  'Lightbox keyboard-friendly controls missing');
assert(css.includes('.couple-portrait-grid')&&css.includes('.couple-gallery-grid'),'Responsive grids missing');
assert(css.includes('html[data-skin="moonlit-amethyst"]'),'Moonlit gallery styling missing');
assert(css.includes('prefers-reduced-motion:reduce'),'Reduced-motion support missing');
assert(js.includes("safePhotoPath")&&js.includes("photos"),'Local-only photo path validation missing');
assert(js.includes('img.addEventListener(\'error\''),'Missing graceful missing-photo fallback');
assert(js.includes('dialog.showModal()')&&js.includes("event.key==='ArrowRight'"),
  'Photo viewer interaction missing');
assert(config.includes('gallery: {')&&config.includes('bride: {')&&config.includes('groom: {'),
  'Customer gallery configuration missing');
assert(!/src=["']https?:/i.test(s),'Gallery must not contain remote sample photos');
const story=html.indexOf('<div class="story-paper"');
const gallery=html.indexOf('<section class="couple-gallery-section"');
const countdown=html.indexOf('<div class="countdown-panel"');
const closing=html.indexOf('<section class="content-section closing-section"');
assert(story>0&&gallery>story&&countdown>gallery&&closing>countdown,
  'Gallery must be between story and countdown without creating a new garden edge');
new Function(js);
console.log('PASS bride/groom gallery source integrity and skin separation');
