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
    art3Local:scene.getAttribute('src')==='art/section3_ceremony_reception_master.png',
    art1Webp:master.currentSrc.endsWith('/art/golden_autumn_heritage_master_v4.webp'),
    art2Webp:section2Style.borderImageSource.includes('section2_family_invitation_master.webp'),
    art3Webp:scene.currentSrc.endsWith('/art/section3_ceremony_reception_master.webp'),
    art2Set:section2Style.borderImageSource.includes('section2_family_invitation_master.png'),
    art2MaskActive:getComputedStyle(art2).maskImage!=='none',
    art3MaskActive:getComputedStyle(document.querySelector('.ceremony-master-scene')).maskImage!=='none',
    art1Fit:getComputedStyle(master).objectFit,
    eventReadingCount:document.querySelectorAll('.event-reading-card').length,
    eventReadingVisible:[...document.querySelectorAll('.event-reading-card')].every(node=>{
      const r=node.getBoundingClientRect();
      return r.height>=190 && getComputedStyle(node).display!=='none';
    }),
    addressFontSizes:[...document.querySelectorAll('.event-reading-address')].map(el=>parseFloat(getComputedStyle(el).fontSize)),
    venueFontSizes:[...document.querySelectorAll('.event-reading-venue')].map(el=>parseFloat(getComputedStyle(el).fontSize)),
    directionsInitiallyHidden:[...document.querySelectorAll('.event-reading-directions')].every(el=>el.hidden),
    eventPaintingSummaryNonInteractive:document.querySelector('.celebration-events')?.getAttribute('aria-hidden')==='true',
    artSummariesFit:[...document.querySelectorAll('.celebration-event-inner')].every(el=>el.scrollHeight<=el.clientHeight+3),
    eventCardOverflow:[...document.querySelectorAll('.event-reading-card')].map(el=>el.scrollWidth-el.clientWidth),
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
    assert.equal(await page.locator('html').getAttribute('data-skin'), 'golden-autumn',
      'Approved default skin must load without altering the rendered invitation');
    // Guests should see a clear, touch-friendly way to continue immediately
    // after the cover, not a button hidden by a delayed opacity transition.
    await page.waitForTimeout(400);
    const cue=await page.locator('.scroll-cue').evaluate(node=>{
      const s=getComputedStyle(node),r=node.getBoundingClientRect();
      return {
        opacity:Number(s.opacity),
        width:r.width,
        height:r.height,
        visible:r.bottom<=innerHeight+1&&r.top>=0,
        href:node.getAttribute('href')
      };
    });
    assert(cue.opacity>.85,'Scroll cue must be visible promptly after opening: '+cue.opacity);
    assert(cue.width>=150&&cue.height>=44,'Scroll cue tap target is too small: '+JSON.stringify(cue));
    assert(cue.visible,'Scroll cue must fit inside the first phone viewport');
    assert.equal(cue.href,'#invitation','Scroll cue should take guests to the family invitation');
    // Resting butterfly is static until explicitly tapped, and cannot trap
    // swipes or restart its flight repeatedly on rapid taps.
    const replay=page.locator('#heroButterfly');
    const butterflyRest=await replay.evaluate(button=>{
      const r=button.getBoundingClientRect();
      return {
        width:r.width, height:r.height,
        inViewport:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,
        animation:getComputedStyle(button.querySelector('.hero-butterfly')).animationName
      };
    });
    assert(butterflyRest.inViewport && butterflyRest.width>=44 && butterflyRest.height>=44,
      'Replay butterfly must be an accessible phone touch target: '+JSON.stringify(butterflyRest));
    assert(butterflyRest.animation==='none','Resting butterfly must not animate automatically');
    const hintOpacity=await page.locator('.hero-butterfly-hint')
      .evaluate(el=>Number(getComputedStyle(el).opacity));
    assert(hintOpacity===0,'Butterfly caption must not overlap wedding titles on touchscreen: '+hintOpacity);

    await replay.click();
    assert.equal(await replay.evaluate(el=>el.classList.contains('is-flying')),true,
      'Tapping the butterfly must trigger one short flight');
    await replay.evaluate(button=>button.click()); // double-tap should be ignored
    await page.waitForTimeout(1850);
    assert.equal(await replay.evaluate(el=>el.classList.contains('is-flying')),false,
      'Short butterfly flight must end and return to resting state');
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
    assert(metrics.art1Webp,'Browser did not choose optimized gateway WebP');
    assert(metrics.art2Set,'Section 2 illustration was not applied');
    assert(metrics.art2Webp,'CSS did not select optimized Section 2 border art');
    assert(metrics.art2MaskActive,'Responsive garden → invitation seam mask is missing');
    assert(metrics.art3MaskActive,'Responsive invitation → events seam mask is missing');
    assert(metrics.art3Loaded,'Section 3 original illustration failed to load');
    assert(metrics.art3Webp,'Browser did not choose optimized Section 3 WebP');
    assert(metrics.art3Local,'Section 3 must use its local verified source, not another repository');
    assert(metrics.art1Fit==='cover','Hero must fill the phone without wide side gutters');
    assert.equal(metrics.eventReadingCount,2,'Ceremony and reception must have two readable detail cards');
    assert(metrics.eventReadingVisible,'One or more event detail cards are missing or collapsed');
    assert(metrics.addressFontSizes.every(px=>px>=14),'Event address is too small: '+metrics.addressFontSizes);
    assert(metrics.venueFontSizes.every(px=>px>=16),'Event venue is too small: '+metrics.venueFontSizes);
    assert(metrics.directionsInitiallyHidden,'Unknown venue must not offer invented map directions');
    assert(metrics.eventPaintingSummaryNonInteractive,'Decorative summary should not be duplicated for screen readers');
    assert(metrics.artSummariesFit,'Compact artwork labels must fit within the painted event panels');
    assert(metrics.eventCardOverflow.every(px=>px<=2),'Readable event cards have horizontal text overflow');
    assert.deepEqual(errors,[],'Uncaught JS errors: '+errors.join('; '));

    await page.screenshot({path:path.join(output,`gateway-${size.width}x${size.height}.png`)});
    // Visual sign-off artifacts: center the viewport on each IMAGE JOIN,
    // not only on the beginning of a section. This lets reviewers evaluate
    // whether the independently painted flowers/pathway feel continuous.
    for(const [name,from,to] of [
      ['garden-family','home','invitation'],
      ['family-events','invitation','details']
    ]){
      const seamY=await page.evaluate(({from,to})=>{
        const a=document.getElementById(from),b=document.getElementById(to);
        return (a.getBoundingClientRect().bottom+b.getBoundingClientRect().top)/2+scrollY;
      },{from,to});
      await page.evaluate(y=>window.scrollTo({top:Math.max(0,y-innerHeight*.47),behavior:'instant'}),seamY);
      await page.waitForTimeout(260);
      await page.screenshot({path:path.join(output,`seam-${name}-${size.width}x${size.height}.png`)});
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));

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

    // Simulate a literal finger dragging upward over the parchment, not just
    // a desktop wheel. On Chromium this should pan the document rather than
    // being eaten by an independent child scroller.
    await page.evaluate(()=>{
      const el=document.getElementById('invitation');
      window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-34,behavior:'instant'});
    });
    await page.waitForTimeout(180);
    const touchBefore=await page.evaluate(()=>window.scrollY);
    const cdp=await context.newCDPSession(page);
    const x=Math.round(size.width/2);
    const y=Math.round(Math.min(size.height-80,Math.max(250,size.height*.68)));
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for(let step=1;step<=12;step++){
      await cdp.send('Input.dispatchTouchEvent',{
        type:'touchMove',
        touchPoints:[{x,y:y-step*16,id:1}]
      });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await page.waitForTimeout(450);
    const touchAfter=await page.evaluate(()=>window.scrollY);
    assert(touchAfter>touchBefore+25,
      `Mobile touch swipe was blocked: ${touchBefore} → ${touchAfter}`);
    await cdp.detach();

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
      if(id==='details'){
        await page.evaluate(()=>{
          const n=document.querySelector('.event-reading-section');
          const top=n.getBoundingClientRect().top+scrollY-34;
          window.scrollTo({top,behavior:'instant'});
        });
        await page.waitForTimeout(220);
        await page.screenshot({path:path.join(output,`readable-event-details-${size.width}x${size.height}.png`)});
      }
    }
    if(size.width===390) {
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:path.join(output,'full-page-390.png'),fullPage:true});
    }
    // Verify the second skin uses all three coordinated paintings without
    // changing the original mechanics or HTML event information.
    if(size.width===390){
      const alt=await context.newPage();
      const altErrors=[];
      alt.on('pageerror',e=>altErrors.push(e.message));
      try{
        await alt.goto(url+'/index.html?heroPreview=1&skin=moonlit-amethyst',{waitUntil:'load'});
        await alt.waitForFunction(()=>document.body.classList.contains('has-opened'));
        await alt.waitForTimeout(500);
        const variant=await alt.evaluate(()=>{
          const gateway=document.querySelector('.hero-master');
          const events=document.querySelector('.ceremony-master-art');
          const family=document.querySelector('.heritage-invitation');
          return{
            id:document.documentElement.dataset.skin,
            gateway:gateway.currentSrc,events:events.currentSrc,
            family:getComputedStyle(family).borderImageSource,
            loaded:gateway.naturalWidth>0&&events.naturalWidth>0,
            name:document.querySelector('.hero-topline .skin-name')?.textContent,
            horizontal:document.documentElement.scrollWidth-innerWidth,
            ambientCount:document.querySelectorAll('.garden-ambient-leaf').length
          };
        });
        assert.equal(variant.id,'moonlit-amethyst');
        assert(variant.gateway.endsWith('/skins/moonlit-amethyst/gateway.webp'));
        assert(variant.events.endsWith('/skins/moonlit-amethyst/events.webp'));
        assert(variant.family.includes('skins/moonlit-amethyst/family.webp'));
        assert(variant.loaded && variant.horizontal<=2);
        assert.equal(variant.ambientCount,6);
        assert(variant.name.includes('MOONLIT AMETHYST'));
        assert.deepEqual(altErrors,[],'Second skin JS errors');
        await alt.screenshot({path:path.join(output,'moonlit-amethyst-390.png')});
      }finally{await alt.close();}
    }

    // Verify that real customer data longer than the placeholders expands the
    // readable cards instead of squeezing fonts, clipping text, or creating a
    // horizontal scroll trap. This occurs AFTER all screenshot captures.
    const longContent=await page.evaluate(()=>{
      const card=document.querySelector('.event-reading-card[data-event="ceremony"]');
      const venue=card.querySelector('[data-event-field="venue"]');
      const address=card.querySelector('[data-event-field="address"]');
      const originalHeight=card.getBoundingClientRect().height;
      venue.textContent='Grand Celebration Hall of Golden Autumn Heritage and Family Gathering';
      address.textContent='A confirmed venue address with a long building name, full street description, township, city, state, landmark information and detailed arrival instructions for invited guests';
      const newHeight=card.getBoundingClientRect().height;
      return {
        originalHeight,
        newHeight,
        cardOverflow:card.scrollWidth-card.clientWidth,
        pageOverflow:document.documentElement.scrollWidth-innerWidth,
        textOverflow:Math.max(venue.scrollWidth-venue.clientWidth,address.scrollWidth-address.clientWidth)
      };
    });
    assert(longContent.newHeight>longContent.originalHeight+10,
      'Long venue details should expand the card instead of being clipped: '+JSON.stringify(longContent));
    assert(longContent.cardOverflow<=2&&longContent.pageOverflow<=2&&longContent.textOverflow<=2,
      'Long customer details overflow the mobile layout: '+JSON.stringify(longContent));


    // Reusable invitation QA: actual customer names can be much longer than
    // the short default pair. The name fit may reduce only text size; it must
    // keep all letters readable within the hero and never cause horizontal drag.
    await page.evaluate(()=>{
      document.querySelectorAll('[data-name="first"]').forEach(node=>{node.textContent='Mya Thazin Aung';});
      document.querySelectorAll('[data-name="second"]').forEach(node=>{node.textContent='Min Khant Kyaw';});
      window.scrollTo({top:0,behavior:'instant'});
    });
    await page.waitForTimeout(250);
    const longNames=await page.evaluate(()=>{
      const words=document.getElementById('heroWords');
      const heading=document.getElementById('heroTitle');
      const hero=document.getElementById('home');
      const cue=document.querySelector('.scroll-cue');
      const w=words.getBoundingClientRect(),h=hero.getBoundingClientRect(),q=cue.getBoundingClientRect();
      return {
        wordsHeight:w.height,
        safeHeight:Math.round(hero.clientHeight*.33),
        insideHero:w.top>=h.top+25&&w.bottom<h.bottom-45,
        clearOfScrollCue:w.bottom<q.top-8,
        horizontalOverflow:document.documentElement.scrollWidth-innerWidth,
        spanOverflow:[...heading.children].map(n=>n.scrollWidth-n.clientWidth),
        displayedSize:parseFloat(getComputedStyle(heading).fontSize),
        names:heading.innerText
      };
    });
    assert(longNames.names.includes('Mya Thazin Aung')&&longNames.names.includes('Min Khant Kyaw'),
      'Personalized names disappeared: '+JSON.stringify(longNames));
    assert(longNames.insideHero&&longNames.clearOfScrollCue,
      'Long personalized names overlap the hero controls: '+JSON.stringify(longNames));
    assert(longNames.horizontalOverflow<=2&&longNames.spanOverflow.every(n=>n<=2),
      'Long personalized names overflow mobile width: '+JSON.stringify(longNames));
    assert(longNames.displayedSize>=21,'Name fit must preserve minimum readable type');
    await page.screenshot({path:path.join(output,`long-names-${size.width}x${size.height}.png`)});

    // Option A: visibility-triggered HTML animation, while full scene art
    // and touch scrolling remain unmodified and accessible.
    const invitationIntro=page.locator('#invitation .invitation-section-intro');
    await invitationIntro.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      ()=>document.querySelector('#invitation .invitation-section-intro')?.classList.contains('is-visible'),
      {timeout:2600}
    );
    const motionState=await page.evaluate(()=>({
      enabled:document.documentElement.classList.contains('motion-enabled'),
      imageAnimated:getComputedStyle(document.querySelector('.hero-master')).animationName,
      revealCount:document.querySelectorAll('.motion-reveal').length
    }));
    assert(motionState.enabled&&motionState.revealCount>=8,
      'Motion system should enhance live text only: '+JSON.stringify(motionState));
    assert(motionState.imageAnimated==='none','The painted garden must never animate');

    const blessingToggle=page.locator('#blessingToggle');
    await blessingToggle.scrollIntoViewIfNeeded();
    assert.equal(await blessingToggle.getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('#invitationBlessing').isVisible(),false);
    await blessingToggle.click();
    assert.equal(await blessingToggle.getAttribute('aria-expanded'),'true','Blessing must open on tap');
    assert.equal(await page.locator('#invitationBlessing').isVisible(),true,'Blessing wording should appear');
    await blessingToggle.click();
    assert.equal(await blessingToggle.getAttribute('aria-expanded'),'false','Blessing must close on second tap');
    assert.equal(await page.locator('#invitationBlessing').isVisible(),false,'Blessing should collapse cleanly');

    for(const event of ['ceremony','reception']) {
      const link=page.locator('.event-panel-hotspot--'+event);
      await link.scrollIntoViewIfNeeded();
      const touchAction=await link.evaluate(el=>getComputedStyle(el).touchAction);
      assert(touchAction.includes('pan-y'),'Tapping event artwork must not disable finger scrolling');
      await link.click();
      await page.waitForFunction(id=>location.hash==='#'+id,event+'Details',{timeout:2800});
      await page.waitForTimeout(550);
      const placement=await page.locator('#'+event+'Details').evaluate(el=>el.getBoundingClientRect().top);
      assert(placement>-130&&placement<175,
        'Tapping the painted '+event+' frame should reach readable details: '+placement);
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(
      ()=>!document.documentElement.classList.contains('motion-enabled'),
      {timeout:1800}
    );
    const reducedState=await page.evaluate(()=>[...document.querySelectorAll('.motion-reveal')].every(el=>{
      const style=getComputedStyle(el);
      return style.opacity==='1'&&style.transform==='none';
    }));
    assert(reducedState,'Reduced motion must leave all invitation details visible');
    // Even guests with reduced motion can use the butterfly control, receiving
    // a static highlight instead of forced flying or wing flapping.
    await replay.scrollIntoViewIfNeeded();
    await replay.click();
    assert.equal(await replay.evaluate(el=>el.classList.contains('is-still-magic')),true,
      'Reduced-motion butterfly tap must receive non-moving feedback');
    assert.equal(await replay.evaluate(el=>el.classList.contains('is-flying')),false,
      'Reduced-motion butterfly must not fly');
    await page.waitForTimeout(650);
    assert.equal(await replay.evaluate(el=>el.classList.contains('is-still-magic')),false,
      'Static butterfly feedback must reset');


    console.log('PASS',size.width+'x'+size.height,JSON.stringify({...metrics,scrollDelta:Math.round(after-before),touchScrollDelta:Math.round(touchAfter-touchBefore)}));
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
