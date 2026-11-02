/** Create a self-contained, dependency-free RC1 phone review bundle.
 * Uses only committed public demo assets (never .env, .git, CI credentials).
 * Requires Node >=18; tests and server remain source-only in repository.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const root=path.resolve(__dirname,'..');
const output=path.join(root,'dist','rc1-phone-review');
const keepAtRoot=name=>
  /\.(html|css|js)$/i.test(name) ||
  /^([0-2][0-9]|3[0-2])_.*\.png$/.test(name) ||
  name==='4ba5ed04-e01d-4bed-a71e-42f2bdf5f8a5.png' ||
  name==='vercel.json' ||
  name==='RELEASE_CANDIDATE.md' ||
  name==='FINAL_VISUAL_QA.md';
const artwork=/^(golden_autumn_heritage_master_v4|section2_family_invitation_master|section3_ceremony_reception_master)\.(png|webp)$/i;
function crawl(dir,rel=''){
  const files=[];
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    if(item.isSymbolicLink())throw new Error('Symlink forbidden: '+item.name);
    const relative=path.posix.join(rel,item.name);
    if(item.isDirectory()){
      if(rel==='' && ['art','assets','skins'].includes(item.name))files.push(...crawl(path.join(dir,item.name),relative));
      else if(rel==='skins'&&item.name==='moonlit-amethyst')files.push(...crawl(path.join(dir,item.name),relative));
      continue;
    }
    if(!item.isFile())continue;
    if(rel===''&&keepAtRoot(item.name))files.push(relative);
    if(rel==='art'&&artwork.test(item.name))files.push(relative);
    if(rel==='assets'&&item.name.endsWith('.svg'))files.push(relative);
    if(rel==='skins/moonlit-amethyst'&&/\.(png|webp)$/i.test(item.name))files.push(relative);
  }
  return files;
}
const relativeFiles=[...new Set(crawl(root))].sort();
if(relativeFiles.length<75)throw new Error('Too few static files — review candidate incomplete: '+relativeFiles.length);
for(const mandatory of [
  'index.html','app.js','wedding-config.js','share-link.js','skin-packs.js',
  '4ba5ed04-e01d-4bed-a71e-42f2bdf5f8a5.png',
  'art/golden_autumn_heritage_master_v4.webp',
  'art/section2_family_invitation_master.webp',
  'art/section3_ceremony_reception_master.webp',
  'skins/moonlit-amethyst/gateway.webp',
  'skins/moonlit-amethyst/events.webp',
  'story-art-v5.css','countdown-garden.css','closing-garden.css','story-closing-bridge.css'
]){
  if(!relativeFiles.includes(mandatory))throw new Error('Mandatory RC file missing: '+mandatory);
}
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
const manifest=[];
for(const relative of relativeFiles){
  const source=path.join(root,relative);
  const dest=path.join(output,relative);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(source,dest);
  const b=fs.readFileSync(dest);
  manifest.push({file:relative,size:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});
}
const metadata={
  name:'Golden Autumn Heritage RC1 — phone review only',
  status:'development preview, sample wedding details',
  commit:process.env.GITHUB_SHA||'local-build',
  fileCount:manifest.length,
  totalBytes:manifest.reduce((sum,f)=>sum+f.size,0),
  files:manifest
};
fs.writeFileSync(path.join(output,'RC1_FILE_MANIFEST.json'),JSON.stringify(metadata,null,2));
fs.writeFileSync(path.join(output,'START_PHONE_PREVIEW.txt'),[
 'GOLDEN AUTUMN HERITAGE — RC1 PHONE TEST',
 '',
 'This is a sample invitation, not a real customer wedding.',
 'Unzip the complete folder. In PowerShell, cd into this folder and run:',
 '  node server.js',
 'On the laptop visit http://localhost:4173.',
 '',
 'To view on your phone using the SAME private Wi-Fi:',
 '  $env:HOST="0.0.0.0"',
 '  node server.js',
 'Find your computer IPv4 with ipconfig, then visit:',
 '  http://YOUR-COMPUTER-IP:4173',
 'Do not open this development server to public networks or the internet.',
 'When finished press Ctrl+C and run: Remove-Item Env:HOST',
 '',
 'Both artwork skins:',
 '  /index.html?skin=golden-autumn',
 '  /index.html?skin=moonlit-amethyst',
 '',
 'TEST: open animation, all six sections, edge joins, Myanmar/English',
 'long text, event cards, countdown, copying links, scrolling and controls.',
 'The local share button intentionally refuses to copy an unusable LAN URL.',
 'DO NOT publish as a customer invitation until real event details are confirmed.',
 'Further guidance: RELEASE_CANDIDATE.md',
 ''
].join('\n'));
console.log('PASS RC1 phone package:',manifest.length,'files',metadata.totalBytes,'bytes; commit:',metadata.commit);
