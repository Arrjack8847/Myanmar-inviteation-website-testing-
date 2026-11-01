/** Validate native-proportion story art and long Burmese/English copy in Chromium.
 * Requires playwright installed and its Chromium browser.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const url=process.env.QA_URL||'http://127.0.0.1:4173';
const sizes=[320,390,430];
const dir=path.join(root,'qa-screenshots');
fs.mkdirSync(dir,{recursive:true});
let server,browser;
async function ready(){
  for(let i=0;i<40;i++){
    try{const r=await fetch(url+'/index.html');if(r.ok)return true;}catch{}
    await new Promise(resolve=>setTimeout(resolve,300));
  }
  return false;
}
async function run(skin,width){
  const context=await browser.newContext({
    viewport:{width,height:width===320?568:width===390?844:932},
    hasTouch:true,isMobile:true,
    reducedMotion:'reduce'
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(url+'/index.html?skin='+skin+'&heroPreview=1',{waitUntil:'load'});
    await page.waitForFunction(()=>document.body.classList.contains('has-opened'));
    const art=await page.evaluate(async ()=>{
      const body=document.querySelector('.story-illustrated-body');
      const frame=document.querySelector('.story-illustrated-frame');
      const frameStyle=getComputedStyle(frame);
      const artFile='4ba5ed04-e01d-4bed-a71e-42f2bdf5f8a5.png';
      const response=await fetch(artFile);
      if(!response.ok)throw Error('Section 4 PNG unavailable: '+response.status);
      for(const p of document.querySelectorAll('[data-story-text]')){
        p.textContent=('A treasured memory, lovingly shared with family. မြန်မာစာသားများကို သေချာစွာ ဖတ်နိုင်ရမည်။ ').repeat(15);
      }
      const imageWidth=frame.getBoundingClientRect().width;
      return {
        frameWidth:imageWidth,
        topBorder:parseFloat(frameStyle.borderTopWidth),
        bottomBorder:parseFloat(frameStyle.borderBottomWidth),
        artSource:frameStyle.borderImageSource,
        repeat:frameStyle.borderImageRepeat,
        parchmentHeight:body.getBoundingClientRect().height,
        contentHeight:body.scrollHeight,
        overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        dataCount:document.querySelectorAll('[data-story-text]').length,
        chapterHeight:[...document.querySelectorAll('.story-chapter')].reduce((n,el)=>n+el.getBoundingClientRect().height,0),
        connects:Math.abs(document.getElementById('countdown').getBoundingClientRect().top-
            document.getElementById('details').getBoundingClientRect().bottom),
        paperWidth:body.querySelector('.story-paper').getBoundingClientRect().width,
        countdownInside:!!document.getElementById('countdownTitle').closest('.story-illustrated-frame'),
        timerIDs:['days','hours','minutes','seconds'].every(id=>!!document.getElementById(id)),
        countdownWidth:document.querySelector('.countdown-panel').getBoundingClientRect().width,
        countdownScrollWidth:document.querySelector('.countdown-panel').scrollWidth,
        gridColumns:getComputedStyle(document.querySelector('.countdown-grid')).gridTemplateColumns.split(' ').length,
        countdownBorder:getComputedStyle(document.querySelector('.countdown-panel')).borderTopWidth,
        countdownValues:[...document.querySelectorAll('.countdown-box strong')].map(el=>el.textContent.trim()),
        bottomPadding:parseFloat(getComputedStyle(document.querySelector('.story-countdown-section')).paddingBottom),
        demoNoteClipped:getComputedStyle(document.querySelector('.story-disclaimer')).clipPath,
        closingFade:getComputedStyle(document.querySelector('#closing'),'::before').backgroundImage,
        closingHorizon:getComputedStyle(document.querySelector('.closing-garden-horizon')).backgroundImage,
        closingHorizonSize:getComputedStyle(document.querySelector('.closing-garden-horizon')).backgroundSize,
        closingHorizonRect:document.querySelector('.closing-garden-horizon').getBoundingClientRect().toJSON(),
        closingFloralLeft:getComputedStyle(document.querySelector('.closing-floral--left')).backgroundImage,
        closingFloralPointer:getComputedStyle(document.querySelector('.closing-floral--left')).pointerEvents,
        closingHorizonPointer:getComputedStyle(document.querySelector('.closing-garden-horizon')).pointerEvents,
        closingHead:document.getElementById('closingTitle').textContent,
        closingShare:!!document.getElementById('shareButton'),
        closingScrollLink:document.querySelector('#closing .back-to-top')?.getAttribute('href'),
        gap56:Math.round(document.getElementById('closing').getBoundingClientRect().top-
             document.getElementById('countdown').getBoundingClientRect().bottom)
      };
    });
    assert.equal(art.dataCount,3,'All 3 editable story chapters must remain');
    assert(art.parchmentHeight>=art.contentHeight-2,'Long story paragraphs must fit natural parchment height');
    assert(art.overflow<=2,'Story art introduces horizontal mobile overflow: '+JSON.stringify(art));
    assert(art.connects<=3,'Section 3 to 4 layout gap: '+art.connects);
    assert(art.paperWidth>160,'Story text became too narrow');
    assert(art.chapterHeight>320,'Story content did not expand for long paragraphs');
    assert(art.countdownInside,'Countdown must stay inside the same illustrated story frame');
    assert(art.timerIDs,'All live countdown IDs must remain');
    assert(art.countdownWidth>=art.countdownScrollWidth-2,'Countdown content must fit its illustrated parchment');
    assert.equal(art.gridColumns,4,'Count down needs four legible columns');
    assert(art.countdownValues.every(v=>v!=='--'&&v.length>0),'Live countdown values failed to render');
    assert.equal(art.countdownBorder,'0px','Do not reintroduce the disconnected rectangular countdown card');
    assert(art.bottomPadding<=1,'Empty Section 5 footer band must be removed');
    assert(art.demoNoteClipped.includes('50%'),'Demo disclaimer must remain screen-reader accessible without a visual spacer');
    assert(art.closingFade.includes('linear-gradient'),'Closing must soften the garden-to-dusk edge');
    assert(Math.abs(art.gap56)<=2,'Countdown-to-closing contains empty band: '+art.gap56+'px');
    assert(art.closingShare&&art.closingScrollLink==='#home','Closing actions should still work');
    assert(art.closingHead.includes('With all our'),'Closing wedding text lost');
    assert(art.closingFloralPointer==='none'&&art.closingHorizonPointer==='none','Decorative closing art must never intercept taps');
    assert(art.closingHorizonRect.width<=width+2,'Closing illustration must not overflow phone width');
    assert(art.closingHorizonSize.includes('205%'),'Closing must zoom to landscape-only crop; no event frames');
    assert(art.closingHorizon.includes(skin==='moonlit-amethyst'?'moonlit-amethyst/events.webp':'section3_ceremony_reception_master.webp'),
      'Closing must reuse the correct garden painting for '+skin);
    if(skin==='golden-autumn'){
      assert(art.artSource.includes('4ba5ed04'),'Golden artwork must load');
      assert(art.repeat.includes('round'),'Floral sides must repeat rather than stretch');
      assert(Math.abs(art.topBorder-art.frameWidth*350/1024)<3,'Upper art cap has incorrect proportions');
      assert(Math.abs(art.bottomBorder-art.frameWidth*576/1024)<3,'Lower art cap has incorrect proportions');
    }else{
      assert.equal(art.artSource,'none','Golden art should not leak into Moonlit skin');
    }
    if(width===390) {
      await page.locator('.story-illustrated-frame').screenshot({
        path:path.join(dir,'story-v5-'+skin+'-390.png'),
        animations:'disabled',
        timeout:30000
      });
      await page.locator('.countdown-panel').screenshot({
        path:path.join(dir,'countdown-garden-'+skin+'-390.png'),
        animations:'disabled',
        timeout:30000
      });
      await page.locator('#closing').screenshot({
        path:path.join(dir,'closing-garden-'+skin+'-390.png'),
        animations:'disabled',
        timeout:30000
      });
      await page.evaluate(()=>document.getElementById('closing').scrollIntoView({behavior:'instant',block:'start'}));
      await page.screenshot({
        path:path.join(dir,'closing-viewport-'+skin+'-390.png'),
        animations:'disabled',
        timeout:30000
      });
    }
    assert.deepEqual(errors,[],'Uncaught page errors');
    console.log('PASS story long-copy',skin,width+'px',art.frameWidth+'px art');
  }finally{await context.close();}
}
async function main(){
  if(!await ready()){
    server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'ignore'});
    if(!await ready())throw Error('Preview server unavailable');
  }
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const skin of ['golden-autumn','moonlit-amethyst']){
    for(const width of sizes)await run(skin,width);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  await browser?.close();
  server?.kill();
});
