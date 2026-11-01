/* Verify the artwork skin registry before accepting new templates. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=filename=>fs.readFileSync(path.join(root,filename),'utf8');
const ctx={window:{}};
vm.runInNewContext(read('skin-packs.js'),ctx);
const catalog=ctx.window.INVITATION_SKINS;
assert(catalog?.packs?.[catalog.defaultId],'Missing default art pack');
for(const [id,pack] of Object.entries(catalog.packs)){
  assert(/^[a-z0-9][a-z0-9-]*$/.test(id),'Invalid skin id: '+id);
  assert(Array.isArray(pack.leaves)&&pack.leaves.length===6,'Need six leaf assets');
  assert(pack.floral && fs.existsSync(path.join(root,pack.floral)), 'Missing floral overlay for '+id);
  const paths=[
    pack.hero.png,pack.hero.webp,pack.family.png,pack.family.webp,
    pack.events.png,pack.events.webp,pack.envelope,pack.seal,
    pack.butterfly.left,pack.butterfly.right,pack.butterfly.body,
    ...pack.leaves,pack.divider,pack.corner
  ];
  for(const name of paths){
    assert(typeof name==='string'&&!name.includes('..')&&!name.startsWith('/'),
      'Unsafe artwork path: '+name);
    assert(fs.existsSync(path.join(root,name)),'Missing artwork: '+name);
  }
  for(const [field,dims] of [['hero',[853,1844]],['family',[1086,1448]],['events',[1086,1448]]]){
    const png=fs.readFileSync(path.join(root,pack[field].png));
    const webp=fs.readFileSync(path.join(root,pack[field].webp));
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(webp.toString('ascii',0,4),'RIFF');
    assert.equal(webp.toString('ascii',8,12),'WEBP');
    assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],dims,field+' art dimensions');
  }
}
const html=read('index.html');
assert(html.includes('src="skin-packs.js" defer'));
assert(html.includes('src="skin-loader.js" defer'));
assert(html.indexOf('src="skin-packs.js"')<html.indexOf('src="skin-loader.js"'));
assert(html.indexOf('src="skin-loader.js"')<html.indexOf('src="scene-motion.js"'));
assert(read('app.js').includes('INVITATION_ACTIVE_SKIN?.leaves'));
new Function(read('skin-loader.js'));
console.log('PASS: artwork skins validated and shared motion remains wired.');
