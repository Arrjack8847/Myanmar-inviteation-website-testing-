/* Render a real 9:16, browser-recorded demonstration for each skin.
 * Uses actual invitation page, existing assets and actual interactive opening.
 * No invented reviews, couple details or provider trademarks.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'reel-output');
const videoDir=path.join(output,'raw');
fs.mkdirSync(videoDir,{recursive:true});
let server=null,browser=null;
const base='http://127.0.0.1:4173';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function ready(){
  for(let i=0;i<45;i++){
    try{const r=await fetch(base+'/index.html');if(r.ok)return true;}catch{}
    await sleep(250);
  }
  return false;
}
async function scrollToSection(page,id,duration){
  await page.evaluate(({id,duration})=>new Promise(resolve=>{
    const el=document.getElementById(id);
    if(!el){resolve();return;}
    const start=window.scrollY;
    const goal=Math.max(0,el.getBoundingClientRect().top+start-4);
    const now=performance.now();
    function run(t){
      const p=Math.min(1,(t-now)/duration);
      const eased=p*p*(3-2*p);
      window.scrollTo(0,start+(goal-start)*eased);
      if(p<1)requestAnimationFrame(run);else resolve();
    }
    requestAnimationFrame(run);
  }),{id,duration});
}
async function render(skin){
  const context=await browser.newContext({
    viewport:{width:360,height:640},
    deviceScaleFactor:1,
    recordVideo:{dir:videoDir,size:{width:360,height:640}}
  });
  const page=await context.newPage();
  try{
    await page.goto(base+'/index.html?skin='+skin,{waitUntil:'networkidle'});
    await page.addStyleTag({content:`
      .demo-bar{display:none!important}
      .hero{margin-top:0!important;height:100svh!important}
      .cover .skip-button{display:none!important}
      .hero .scroll-cue{bottom:18px!important}
      .reel-watermark{position:fixed;left:50%;bottom:10px;
       transform:translateX(-50%);z-index:999;
       padding:5px 10px;border-radius:99px;pointer-events:none;
       font:600 9px/1.4 system-ui,sans-serif;letter-spacing:.06em;
       background:#2f263bce;color:#fff0d8;white-space:nowrap}
    `});
    await page.evaluate(()=>{
      const label=document.createElement('div');
      label.className='reel-watermark';
      label.textContent='INVITATION DESIGN DEMO · SAMPLE DETAILS';
      document.body.appendChild(label);
    });
    await sleep(750);
    await page.locator('#openInvitation').click();
    await sleep(2850);
    await sleep(550);
    await page.locator('#heroButterfly').click();
    await sleep(1650);
    await scrollToSection(page,'invitation',1400);
    await sleep(400);
    await scrollToSection(page,'details',1550);
    await sleep(500);
    await scrollToSection(page,'countdown',1250);
    await sleep(450);
    await scrollToSection(page,'closing',1250);
    await sleep(900);
  }finally{
    const video=page.video();
    await context.close();
    const pathname=await video.path();
    const dest=path.join(output,skin+'.webm');
    fs.copyFileSync(pathname,dest);
    console.log('Recorded '+dest+' ('+fs.statSync(dest).size+' bytes)');
  }
}
async function main(){
  if(!await ready()){
    server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'ignore'});
    if(!await ready())throw Error('Unable to start preview server');
  }
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const skin of ['golden-autumn','moonlit-amethyst'])await render(skin);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{
  await browser?.close();
  server?.kill();
});
