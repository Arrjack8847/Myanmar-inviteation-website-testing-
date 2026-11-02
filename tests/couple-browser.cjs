/** Real phone-width rendering for optional Bride & Groom profiles.
 * Uses synthetic fixture names and a stub file, never actual customer photos.
 */
'use strict';
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const base=process.env.QA_URL||'http://127.0.0.1:4173';
const widths=[320,390,430];
let browser,server;
async function ready(){
  for(let i=0;i<45;i++){
    try{if((await fetch(base+'/index.html')).ok)return true;}catch{}
    await new Promise(r=>setTimeout(r,250));
  }
  return false;
}
async function check(skin,width){
  const ctx=await browser.newContext({viewport:{width,height:width===320?568:width===390?844:932},
    isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/index.html?skin='+skin+'&heroPreview=1',{waitUntil:'load'});
  await page.waitForFunction(()=>document.body.classList.contains('has-opened'));
  const state=await page.evaluate(()=>{
    const couple=document.querySelector('#couple');
    const inv=document.querySelector('#invitation');
    const details=document.querySelector('#details');
    const cards=[...couple.querySelectorAll('.couple-person')];
    const rect=el=>el.getBoundingClientRect();
    return {
      names:cards.map(x=>x.querySelector('.couple-person-name').textContent),
      placeholderVisible:cards.every(x=>x.querySelector('[data-person-initial]').getClientRects().length>0),
      noPhotos:cards.every(x=>x.querySelector('img[data-person-photo]').hidden),
      readable:cards.every(x=>rect(x.querySelector('.couple-person-name')).width>140),
      sectionHeight:rect(couple).height,
      sectionWidth:rect(couple).width,
      portraitSizes:cards.map(x=>rect(x.querySelector('.couple-portrait')).width),
      seam1:Math.abs(rect(inv).bottom-rect(couple).top),
      seam2:Math.abs(rect(couple).bottom-rect(details).top),
      overflow:document.documentElement.scrollWidth-window.innerWidth,
      actualSkin:document.documentElement.dataset.skin,
      background:getComputedStyle(couple).backgroundImage,
      motion:getComputedStyle(couple,'::before').animationName
    };
  });
  assert.deepEqual(state.names,['Thiri','Min'],'Names must match invitation names');
  assert(state.placeholderVisible&&state.noPhotos,'Until provided, both portraits need initial placeholders');
  assert(state.readable&&state.sectionHeight>480,'Portrait section should be readable');
  assert.equal(state.sectionWidth,width,'Full-width garden layout');
  assert(state.portraitSizes.every(x=>x>=155&&x<=240),'Portrait frame responsive width');
  assert(state.seam1<=2&&state.seam2<=2,'Do not introduce a blank/gapped section join');
  assert(state.overflow<=2,'Page overflows horizontally '+state.overflow+'px');
  assert.equal(state.actualSkin,skin);
  assert(!state.motion||state.motion==='none','Reduced motion should disable swaying flowers');
  assert.deepEqual(errors,[],'No uncaught script errors on mobile');
  if(width===390){
    await page.locator('#couple').screenshot({path:path.join(root,'qa-screenshots','couple-'+skin+'-390.png'),
      animations:'disabled',timeout:30000});
  }
  await ctx.close();
  console.log('PASS couple garden',skin,width);
}
async function custom(){
 const ctx=await browser.newContext({viewport:{width:320,height:650},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const customData={
  skin:'golden-autumn',
  couple:{firstName:'မင်္ဂလာ သတို့သမီး အမည် အရှည်ကြီး',secondName:'မင်္ဂလာ သတို့သား အမည် အရှည်ကြီး'},
  people:{
   bride:{bio:'မိသားစုနှစ်ဖက်၏ မေတ္တာနှင့် ကောင်းချီးမင်္ဂလာများဖြင့် '.repeat(16),photo:'https://other.example/image.jpg'},
   groom:{bio:'A thoughtful personal introduction to the groom. '.repeat(12),photo:'photos/groom.webp'}
  }
 };
 await ctx.route('**/wedding-config.js',r=>r.fulfill({contentType:'application/javascript',
  body:'window.WEDDING_CUSTOMIZATION='+JSON.stringify(customData)+';'}));
 await ctx.route('**/photos/groom.webp',r=>r.fulfill({contentType:'image/png',
  body:fs.readFileSync(path.join(root,'31_gold_ornamental_divider.png'))}));
 await page.goto(base+'/index.html?heroPreview=1',{waitUntil:'load'});
 await page.waitForFunction(()=>document.body.classList.contains('has-opened'));
 await page.locator('[data-person-photo="groom"]').evaluate(img=>img.decode?.().catch(()=>{}));
 await page.waitForFunction(()=>!document.querySelector('[data-person-photo="groom"]').hidden);
 const state=await page.evaluate(()=>{
  const bride=document.querySelector('[data-person="bride"]'),groom=document.querySelector('[data-person="groom"]');
  return {
   names:[bride.querySelector('h3').textContent,groom.querySelector('h3').textContent],
   brideBio:bride.querySelector('[data-person-bio]').textContent,
   groomBio:groom.querySelector('[data-person-bio]').textContent,
   brideHidden:bride.querySelector('img[data-person-photo]').hidden,
   groomHidden:groom.querySelector('img[data-person-photo]').hidden,
   groomLoaded:groom.querySelector('.couple-portrait').classList.contains('has-photo'),
   overflow:document.documentElement.scrollWidth-innerWidth,
   cardHeight:bride.getBoundingClientRect().height
  };
 });
 assert(state.names.every(x=>x.startsWith('မင်္ဂလာ')),'Burmese names must remain untruncated');
 assert(state.brideBio.length>300&&state.groomBio.length>300,'Long profile text preserved');
 assert.equal(state.brideHidden,true,'External photo is intentionally forbidden');
 assert.equal(state.groomHidden,false,'Approved local photo may load');
 assert.equal(state.groomLoaded,true,'A loaded photo should hide monogram');
 assert(state.cardHeight>400,'Long profile should grow without clipping');
 assert(state.overflow<=2,'Long Burmese name should not create lateral page overflow');
 assert.deepEqual(errors,[],'No errors for personalized people');
 await ctx.close();
 console.log('PASS long bilingual couple profiles and safe local photo loading');
}
async function main(){
 if(!await ready()){
  server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'ignore'});
  if(!await ready())throw new Error('Local preview unavailable');
 }
 fs.mkdirSync(path.join(root,'qa-screenshots'),{recursive:true});
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const skin of ['golden-autumn','moonlit-amethyst']){
  for(const width of widths)await check(skin,width);
 }
 await custom();
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.kill();});
