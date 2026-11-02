/** Real Chromium gallery QA: placeholders, customer photos, keyboard viewer,
 * long names and both visual skins at 320 / 390 / 430px.
 */
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=process.env.QA_URL||'http://127.0.0.1:4173';
const dir=path.join(root,'qa-screenshots');
fs.mkdirSync(dir,{recursive:true});
const tinyPNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WoQMgAAAABJRU5ErkJggg==','base64');
let browser,server;
async function ready(){
  for(let i=0;i<35;i++){
    try{if((await fetch(base+'/index.html')).ok)return true;}catch{}
    await new Promise(ok=>setTimeout(ok,250));
  }
  return false;
}
async function test(skin,width,configured){
  const context=await browser.newContext({
    viewport:{width,height:width===320?568:width===390?844:932},
    isMobile:true,hasTouch:true,reducedMotion:'reduce'
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
    if(configured){
      const config={
        skin,
        couple:{firstName:'A very long bride name — မြန်မာအမည်',secondName:'A very long groom name — မြန်မာအမည်'},
        gallery:{
          bride:{photo:'photos/bride.png',caption:'Our beautiful bride'},
          groom:{photo:'photos/groom.png',caption:'Our handsome groom'},
          photos:[
            {src:'photos/moment-01.png',alt:'Couple under a tree',caption:'The first beautiful memory'},
            {src:'photos/moment-02.png',alt:'Couple celebrating outdoors',caption:'Another cherished chapter'},
            {src:'https://unsafe.example.com/photo.png',caption:'Must be ignored'},
            {src:'photos/../private.png',caption:'Must be ignored'}
          ]
        }
      };
      await page.route('**/wedding-config.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:'window.WEDDING_CUSTOMIZATION='+JSON.stringify(config)+';'}));
      await page.route('**/photos/*.png',r=>{
        if(r.request().url().endsWith('/photos/groom.png'))return r.fulfill({status:404,body:'Not uploaded'});
        return r.fulfill({status:200,contentType:'image/png',body:tinyPNG});
      });
    }
    await page.goto(base+'/index.html?skin='+skin+'&heroPreview=1',{waitUntil:'load'});
    await page.waitForFunction(()=>document.body.classList.contains('has-opened'));
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    if(configured){
      await page.waitForFunction(()=>document.querySelector('[data-gallery-portrait="bride"]').hidden===false);
      await page.waitForFunction(()=>document.querySelector('[data-gallery-portrait="groom"]').hidden===true);
      await page.locator('.couple-gallery-photo-button').first().waitFor();
    }
    const state=await page.evaluate(()=>{
      const section=document.getElementById('gallery');
      const story=document.querySelector('.story-paper');
      const countdown=document.querySelector('.countdown-panel');
      const br=document.querySelector('[data-gallery-portrait="bride"]');
      const gr=document.querySelector('[data-gallery-portrait="groom"]');
      return {
        width:section.getBoundingClientRect().width,
        overflow:document.documentElement.scrollWidth-window.innerWidth,
        frame:!!section.closest('.story-illustrated-frame'),
        between:story.compareDocumentPosition(section)&Node.DOCUMENT_POSITION_FOLLOWING &&
          section.compareDocumentPosition(countdown)&Node.DOCUMENT_POSITION_FOLLOWING,
        names:['bride','groom'].map(role=>section.querySelector('[data-gallery-name="'+role+'"]').textContent),
        brideVisible:!br.hidden,
        groomVisible:!gr.hidden,
        placeholders:section.querySelectorAll('.couple-gallery-placeholder').length,
        photoButtons:section.querySelectorAll('.couple-gallery-photo-button').length,
        skin:document.documentElement.dataset.skin,
        photoSrcs:[...section.querySelectorAll('img[src]')].map(x=>x.getAttribute('src'))
      };
    });
    assert(state.frame&&state.between,'Gallery must stay inside the continuous story/countdown frame');
    assert(state.overflow<=2,'Horizontal mobile overflow: '+JSON.stringify(state));
    assert(state.width<=width,'Gallery too wide for phone');
    assert.equal(state.skin,skin);
    assert(state.photoSrcs.every(src=>!src.includes('unsafe.example.com')&&!src.includes('../')),
      'Untrusted external/traversal photo loaded');
    if(configured){
      assert(state.names[0].includes('မြန်မာအမည်'));
      assert(state.names[1].includes('မြန်မာအမည်'));
      assert(state.brideVisible&&!state.groomVisible,'Valid bride should load; missing groom falls back');
      assert.equal(state.photoButtons,2,'Only two safe uploaded gallery entries');
      assert(state.placeholders>=2,'Incomplete photo grid should keep tasteful placeholders');
      await page.locator('.couple-gallery-photo-button').first().click();
      assert(await page.locator('#galleryLightbox').evaluate(x=>x.open),'Gallery photo dialog failed to open');
      assert.equal(await page.locator('#galleryLightboxCaption').textContent(),'The first beautiful memory');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#galleryLightboxCaption').textContent(),'Another cherished chapter');
      await page.keyboard.press('Escape');
      assert(!await page.locator('#galleryLightbox').evaluate(x=>x.open),'Escape should close viewer');
      assert(await page.locator('.couple-gallery-photo-button').first().evaluate(x=>x===document.activeElement),'Focus not restored');
    }else{
      assert.deepEqual(state.names,['Thiri','Min']);
      assert(!state.brideVisible&&!state.groomVisible,'No customer pictures should be fabricated');
      assert.equal(state.photoButtons,0);
      assert.equal(state.placeholders,4);
    }
    if(width===390)await page.locator('#gallery').screenshot({
      path:path.join(dir,'bride-groom-gallery-'+(configured?'configured':'placeholders')+'-'+skin+'-390.png'),
      animations:'disabled',timeout:30000
    });
    assert.deepEqual(errors,[],'JavaScript errors');
    console.log('PASS gallery',skin,width,configured?'configured':'placeholders');
  }finally{await context.close();}
}
async function main(){
  if(!await ready()){
    server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'ignore'});
    if(!await ready())throw Error('Local preview unavailable');
  }
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const skin of ['golden-autumn','moonlit-amethyst']){
    for(const width of [320,390,430]){
      await test(skin,width,false);
      await test(skin,width,true);
    }
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.kill();});
