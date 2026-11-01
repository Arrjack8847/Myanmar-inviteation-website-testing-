/* Section 4 source and integration guards for the V5 Love Story painting.
 * No dependencies: node tests/story-art.cjs
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const art='4ba5ed04-e01d-4bed-a71e-42f2bdf5f8a5.png';
const png=fs.readFileSync(path.join(root,art));
assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Section 4 asset must be a genuine PNG');
assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[1024,1536],'Section 4 artwork proportions changed unexpectedly');
const html=read('index.html');
const css=read('story-art-v5.css');
assert(html.includes('href="story-art-v5.css"'),'Section 4 asset CSS not loaded');
assert(html.indexOf('href="story-art-v5.css"')>html.indexOf('href="flow-quality.css"'),'New edge rules must override earlier layout fixes');
assert(css.includes('url("'+art+'")'),'Uploaded source painting not wired into the story');
assert(css.includes('border-image-slice: 225 125 320 125 fill'),'Nine-slice protected edges missing');
assert(!/background-size:\\s*cover/.test(css),'Never crop painted crests with a cover background');
assert(!/height:\\s*(?:[0-9]+(?:px|vh|svh))/.test(css),'Do not force the story into a fixed height');
assert(css.includes('html[data-skin="moonlit-amethyst"]'),'Second skin must have coordinated treatment');
assert(css.includes('prefers-reduced-motion'),'Reduced Motion coverage missing');
const story=html.split('class="content-section countdown-section story-countdown-section"')[1]?.split('class="content-section closing-section"')[0]||'';
assert(story.indexOf('class="story-paper-inner"')<story.indexOf('class="story-intro"'),'Story heading must be inside the illustrated frame');
assert(story.indexOf('class="story-intro"')<story.indexOf('class="story-chapters"'),'Story content order is broken');
assert.equal((story.match(/class="story-chapter"/g)||[]).length,3,'Three editable chapters must remain');
assert.equal((story.match(/data-story-title="[0-2]"/g)||[]).length,3,'Story titles must stay dynamic HTML');
assert.equal((story.match(/data-story-text="[0-2]"/g)||[]).length,3,'Story text must stay dynamic HTML');
assert(!story.includes('story-corner--tl'),'Do not duplicate painted gold corners');
assert(story.includes('id="countdownTitle"'),'Do not remove countdown');
console.log('PASS: Section 4 source image, responsive painted frame and editable story verified.');
