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
      const top=document.querySelector('.story-illustrated-cap--top');
      const bottom=document.querySelector('.story-illustrated-cap--bottom');
      const artFile='4ba5ed04-e01d-4bed-a71e-42f2bdf5f8a5.png';
      const response=await fetch(artFile);
      if(!response.ok)throw Error('Section 4 PNG unavailable: '+response.status);
      for(const p of document.querySelectorAll('[data-story-text]')){
        p.textContent=('A treasured memory, lovingly shared with family. မြန်မာစာသားများကို သေချာစွာ ဖတ်နိုင်ရမည်။ ').repeat(15);
      }
      const imageWidth=frame.getBoundingClientRect().width;
      return {
        frameWidth:imageWidth,
        topHeight:top.getBoundingClientRect().height,
        bottomHeight:bottom.getBoundingClientRect().height,
        topDisplay:getComputedStyle(top).display,
        bottomDisplay:getComputedStyle(bottom).display,
        topBg:getComputedStyle(top).backgroundImage,
        parchmentHeight:body.getBoundingClientRect().height,
        contentHeight:body.scrollHeight,
        overflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        dataCount:document.querySelectorAll('[data-story-text]').length,
        chapterHeight:[...document.querySelectorAll('.story-chapter')].reduce((n,el)=>n+el.getBoundingClientRect().height,0),
        connects:Math.abs(document.getElementById('countdown').getBoundingClientRect().top-
            document.getElementById('details').getBoundingClientRect().bottom),
        paperWidth:body.querySelector('.story-paper').getBoundingClientRect().width
      };
    });
    assert.equal(art.dataCount,3,'All 3 editable story chapters must remain');
    assert(art.parchmentHeight>=art.contentHeight-2,'Long story paragraphs must fit natural parchment height');
    assert(art.overflow<=2,'Story art introduces horizontal mobile overflow: '+JSON.stringify(art));
    assert(art.connects<=3,'Section 3 to 4 layout gap: '+art.connects);
    assert(art.paperWidth>160,'Story text became too narrow');
    assert(art.chapterHeight>320,'Story content did not expand for long paragraphs');
    if(skin==='golden-autumn'){
      assert(art.topBg.includes('4ba5ed04'),'Golden artwork must load');
      assert(Math.abs(art.topHeight-art.frameWidth*350/1024)<3,'Upper art cap was stretched');
      assert(Math.abs(art.bottomHeight-art.frameWidth*576/1024)<3,'Lower art cap was stretched');
    }else{
      assert.equal(art.topDisplay,'none','Golden art should not leak into Moonlit skin');
      assert.equal(art.bottomDisplay,'none','Golden art should not leak into Moonlit skin');
    }
    if(width===390) {
      await page.locator('.story-illustrated-frame').screenshot({
        path:path.join(dir,'story-v5-'+skin+'-390.png'),
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
