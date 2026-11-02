/** Bride & Groom source contract — no real personal photo bundled. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html'),css=read('bride-groom.css'),js=read('app.js');
const start=html.indexOf('id="invitation"');
const couple=html.indexOf('id="couple"');
const details=html.indexOf('id="details"');
assert(start>=0&&start<couple&&couple<details,'Bride and groom should be between family and ceremony');
assert(html.includes('href="bride-groom.css"'),'New layout style missing');
assert.equal((html.match(/class="couple-person" data-person=/g)||[]).length,2,'Exactly two people');
for(const role of ['bride','groom']){
 for(const name of ['data-person-name','data-person-bio','data-person-initial','data-person-photo']){
  assert(html.includes(name+'="'+role+'"'),'Missing '+name+' for '+role);
 }
 assert(html.includes('data-person="'+role+'"'),'No role-specific card '+role);
}
assert(css.includes("html[data-skin=\"moonlit-amethyst\"]"),'Both skin styles required');
assert(css.includes('prefers-reduced-motion:reduce'),'Reduced motion rules missing');
assert(js.includes('renderBrideAndGroom();'),'Couple section not hydrated with client names');
assert(js.includes("new RegExp('^photos/"),'Photo URL must remain restricted to local photos directory');
assert(!/src="photos\/(?:bride|groom)\./.test(html),'Demo must not invent real portraits');
const config=read('wedding-config.js');
assert(config.includes('people:')&&config.includes('bride:')&&config.includes('groom:'),
  'Photo/bio config not documented');
console.log('PASS bride and groom static/skin/config contract');
