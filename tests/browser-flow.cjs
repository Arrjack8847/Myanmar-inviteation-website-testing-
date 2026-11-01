/**
 * Golden Autumn Heritage: real Chromium mobile regression checks.
 * Requires `playwright` and its Chromium runtime in CI, or locally:
 *   npm install --no-save --no-package-lock playwright
 *   npx playwright install chromium
 *   node tests/browser-flow.cjs
 *
 * The test starts the existing dependency-free `server.js` when necessary,
 * validates normal document swipes and image-to-image section continuity, and
 * saves real page screenshots. No mock DOM or synthetic artwork is used.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');

const url = process.env.QA_URL || 'http://127.0.0.1:4173';
const root = path.resolve(__dirname,'..');
const output = path.join(root, 'qa-screenshots');
fs.mkdirSync(output, {recursive:true});
const sizes = [{width:320,height:568},{width:390,height:844},{width:430,height:932}];
let server, browser;

async function serverReady() {
  for(let i=0;i<45;i++){
    try{
      const r=await fetch(url+'/index.html');
      if(r.ok && (await r.text()).includes('Golden Autumn Heritage'))return true;
    }catch{/* not ready */}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  return false;
}

function measure() {
  const ids=['home','invitation','details'];
  const elements=ids.map(id=>document.getElementById(id));
  const [home,invitation,details]=elements;
  if(elements.some(x=>!x))throw new Error('A required illustration section is missing');
  const top=x=>x.getBoundingClientRect().top+window.scrollY;
  const bottom=x=>x.getBoundingClientRect().bottom+window.scrollY;
  const paper=document.querySelector('.heritage-invitation-inner');
  const scene=document.querySelector('.ceremony-master-art');
  const master=document.querySelector('.hero-master');
  const art2=document.querySelector('.heritage-invitation');
  const section2Style=getComputedStyle(art2);
  const paperStyle=getComputedStyle(paper);
  const eventInner=document.querySelector('.celebration-event-inner');
  const eventStyle=getComputedStyle(eventInner);
  const allImgs=[master,scene];
  return {
    gap12:Math.round(top(invitation)-bottom(home)),
    gap23:Math.round(top(details)-bottom(invitation)),
    horizontalOverflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
    totalHeight:document.documentElement.scrollHeight,
    viewportHeight:window.innerHeight,
    paperOverflow:paperStyle.overflowY,
    eventOverflow:eventStyle.overflowY,
    section2Height:Math.round(invitation.getBoundingClientRect().height),
    paperScrollHeight:paper.scrollHeight,
    paperClientHeight:paper.clientHeight,
    art1Loaded:allImgs[0].complete && allImgs[0].naturalWidth>0,
    art3Loaded:allImgs[1].complete && allImgs[1].naturalWidth>0,
    art2Set:section2Style.borderImageSource.includes('section2_family_invitation_master.png'),
    art1Fit:getComputedStyle(master).objectFit,
    bodyScroll:getComputedStyle(document.body).overflowY
  };
}
async function testSize(size) {
  const context=await browser.newContext({
    viewport:size,
    deviceScaleFactor:1,
    hasTouch:true,
    isMobile:true
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(url+'/index.html?heroPreview=1#home',{waitUntil:'load',timeout:30000});
    await page.waitForFunction(()=>document.body.classList.contains('has-opened'));
    await page.locator('.ceremony-master-art').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(250);
    const metrics=await page.evaluate(measure);
    assert(Math.abs(metrics.gap12)<=42,'Garden → invitation gap too large: '+metrics.gap12+'px');
    assert(Math.abs(metrics.gap23)<=42,'Invitation → events gap too large: '+metrics.gap23+'px');
    assert(metrics.horizontalOverflow<=2,'Horizontal page overflow: '+metrics.horizontalOverflow+'px');
    assert(metrics.totalHeight>metrics.viewportHeight*1.8,'Page no longer scrolls as a long invitation');
    assert(metrics.paperOverflow!=='auto'&&metrics.paperOverflow!=='scroll','Nested invitation scrollbar traps touch swipes');
    assert(metrics.eventOverflow!=='auto'&&metrics.eventOverflow!=='scroll','Nested event scrollbar traps touch swipes');
    assert(metrics.art1Loaded,'Approved gateway master failed to load');
    assert(metrics.art2Set,'Section 2 illustration was not applied');
    assert(metrics.art3Loaded,'Section 3 original illustration failed to load');
    assert(metrics.art1Fit==='cover','Hero must fill the phone without wide side gutters');
    assert.deepEqual(errors,[],'Uncaught JS errors: '+errors.join('; '));

    await page.screenshot({path:path.join(output,`gateway-${size.width}x${size.height}.png`)});
    // A swipe over the invitation must advance the document itself.
    // Place the pointer on the invitation, then wheel. This specifically
    // catches nested scrolling panes that consume swipes instead of moving
    // the overall page.
    await page.evaluate(()=>{
      const el=document.getElementById('invitation');
      window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY+30,behavior:'instant'});
    });
    await page.evaluate(()=>window.scrollBy({top:-110,behavior:'instant'}));
    await page.waitForTimeout(280);
    const before=await page.evaluate(()=>window.scrollY);
    const target=page.locator('.heritage-invitation-inner');
    const box=await target.boundingBox();
    if(box)await page.mouse.move(box.x+box.width/2,Math.min(box.y+box.height/2,size.height-55));
    await page.mouse.wheel(0,250);
    await page.waitForTimeout(900);
    const after=await page.evaluate(()=>window.scrollY);
    assert(after>before+30,`Document scroll blocked over the parchment: ${before} → ${after}`);
    // Align each section to the viewport TOP for reproducible screenshots.
    // scrollIntoViewIfNeeded() only ensured partial visibility and sometimes
    // captured half of the previous illustrated section in the screenshot.
    for(const id of ['invitation','details']){
      await page.evaluate(id=>{
        const node=document.getElementById(id);
        const top=node.getBoundingClientRect().top+window.scrollY-34;
        window.scrollTo({top,behavior:'instant'});
      },id);
      await page.waitForTimeout(220);
      await page.screenshot({path:path.join(output,`${id==='invitation'?'invitation':'events'}-${size.width}x${size.height}.png`)});
    }
    if(size.width===390) {
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:path.join(output,'full-page-390.png'),fullPage:true});
    }
    console.log('PASS',size.width+'x'+size.height,JSON.stringify({...metrics,scrollDelta:Math.round(after-before)}));
  }finally{await context.close();}
}

async function main(){
  if(!await serverReady()){
    server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'ignore'});
    if(!await serverReady())throw Error('Could not start local invitation server');
  }
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const size of sizes)await testSize(size);
  console.log('PASS all mobile browser checks; screenshots:',output);
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close();
  if(server)server.kill();
});
