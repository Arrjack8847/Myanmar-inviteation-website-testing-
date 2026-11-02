/** Guest-share URL release contract — dependency-free, Node 18+. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'share-link.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ctx={window:{},URL:Object.create(null)};
ctx.URL=URL;
vm.runInNewContext(source,ctx);
const build=ctx.window.INVITATION_SHARE.build;
const skins={'golden-autumn':{},'moonlit-amethyst':{}};
const cases=[
  ['https://invite.example.com/?heroPreview=1#home','https://invite.example.com/'],
  ['https://invite.example.com/index.html?skin=moonlit-amethyst&heroPreview=1#closing',
    'https://invite.example.com/index.html?skin=moonlit-amethyst'],
  ['https://invite.example.com/index.html?skin=NOT-REGISTERED&artReview=1&utm_source=test#countdown',
    'https://invite.example.com/index.html'],
  ['https://invite.example.com/invite?skin=golden-autumn&ref=private',
    'https://invite.example.com/invite?skin=golden-autumn']
];
for(const [original,expected] of cases){
  assert.equal(build(original,skins),expected,'Share canonicalization failed: '+original);
}
for(const original of [
  'http://localhost:4173/index.html',
  'http://127.0.0.1:4173/?heroPreview=1',
  'http://0.0.0.0:4173/',
  'http://192.168.1.20:4173/index.html',
  'http://172.18.4.5:4173/',
  'http://10.3.4.5:4173/',
  'http://169.254.10.20:4173/',
  'http://[::1]:4173/',
  'file:///Users/test/index.html',
  'javascript:alert(1)',
  'ftp://example.org/card.html'
]){
  assert.equal(build(original,skins),null,'Unusable / unsafe link must not share: '+original);
}
assert(html.includes('src="share-link.js" defer'),'Share helper must load in guest page');
assert(html.indexOf('src="share-link.js"')<html.indexOf('src="app.js"'),
  'Share URL helper must load before app event handler');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(app.includes('window.INVITATION_SHARE?.build'),'Guest share link must use the safe canonical builder');
assert(app.includes('customWeddingDate'),'Personalized wedding countdown must remove sample timezone claim');
console.log('PASS release candidate share URL safeguards and custom countdown wording');
