/** Final guest workflow check with real browser + safely injected example data.
 * No customer information is committed to the repository.
 */
'use strict';
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const base=process.env.QA_URL||'http://127.0.0.1:4173';
let server,browser;
async function available(){
  for(let n=0;n<40;n++){
    try{const r=await fetch(base+'/index.html');if(r.ok)return true;}catch{}
    await new Promise(resolve=>setTimeout(resolve,280));
  }
  return false;
}
async function verify(skin,validMap){
  const context=await browser.newContext({
    viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'
  });
  const errors=[];
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  const custom={
    skin,
    couple:{
      firstName:'Mya Thazin Aung',
      secondName:'Min Khant Kyaw',
      firstFamily:'Daw Khin Khin',
      secondFamily:'U Tun Myint',
      weddingDateISO:'2030-10-20T17:30:00+08:00',
      displayDate:'20 OCTOBER 2030'
    },
    story:{
      introduction:'A couple-approved story introduction.',
      chapters:[
        {title:'Our First Meeting',text:'We met at a community gathering.'},
        {title:'Our Memories',text:'We celebrated with our families.'},
        {title:'Our New Chapter',text:'We look forward to celebrating together.'}
      ]
    },
    events:{
      ceremony:{
        dateLabel:'20 OCTOBER 2030',
        dateISO:'2030-10-20',
        time:'5:30 PM',
        venue:'Example Ceremony Hall',
        address:'123 Test Street, Example Town',
        venueConfirmed:true,
        mapUrl:validMap?'https://maps.google.com/maps?cid=12345':'https://maps.google.com.evil.example/maps?cid=12345'
      },
      reception:{
        dateLabel:'21 OCTOBER 2030',
        dateISO:'2030-10-21',
        venue:'Unconfirmed Reception Hall',
        venueConfirmed:false,
        mapUrl:'https://maps.google.com/maps?cid=98765'
      }
    }
  };
  await context.route('**/wedding-config.js',r=>r.fulfill({
    status:200,contentType:'application/javascript',
    body:'window.WEDDING_CUSTOMIZATION = '+JSON.stringify(custom)+';'
  }));
  try{
    await page.goto(base+'/index.html?skin='+skin+'&heroPreview=1#home',{waitUntil:'load'});
    await page.waitForFunction(()=>document.body.classList.contains('has-opened'));
    const state=await page.evaluate(()=>{
      const first=document.querySelector('#closing [data-name="first"]');
      const second=document.querySelector('#closing [data-name="second"]');
      return {
        names:[first?.textContent,second?.textContent],
        family:[document.querySelector('[data-family="first"]')?.textContent,
          document.querySelector('[data-family="second"]')?.textContent],
        chapters:[0,1,2].map(i=>document.querySelector('[data-story-text="'+i+'"]')?.textContent),
        storyIntro:document.querySelector('[data-story-intro]')?.textContent,
        ceremonyDate:document.querySelector('#ceremonyDetails [data-event-field="date"]')?.textContent,
        ceremonyDateTime:document.querySelector('#ceremonyDetails time')?.dateTime,
        ceremonyVenue:document.querySelector('#ceremonyDetails [data-event-field="venue"]')?.textContent,
        ceremonyAddress:document.querySelector('#ceremonyDetails [data-event-field="address"]')?.textContent,
        receptionHidden:document.querySelector('#receptionDetails [data-event-link]')?.hidden,
        mapHidden:document.querySelector('#ceremonyDetails [data-event-link]')?.hidden,
        mapHref:document.querySelector('#ceremonyDetails [data-event-link]')?.getAttribute('href'),
        countdownNote:document.querySelector('.countdown-footnote')?.textContent,
        countdownAria:document.querySelector('.countdown-grid')?.getAttribute('aria-label'),
        days:document.getElementById('days')?.textContent,
        bodyOverflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        activeSkin:document.documentElement.dataset.skin
      };
    });
    assert.deepEqual(state.names,['Mya Thazin Aung','Min Khant Kyaw']);
    assert.deepEqual(state.family,['Daw Khin Khin','U Tun Myint']);
    assert(state.chapters.every(c=>c.includes('We ')));
    assert.equal(state.storyIntro,'A couple-approved story introduction.');
    assert.equal(state.ceremonyDate,'20 OCTOBER 2030');
    assert.equal(state.ceremonyDateTime,'2030-10-20');
    assert.equal(state.ceremonyVenue,'Example Ceremony Hall');
    assert.equal(state.ceremonyAddress,'123 Test Street, Example Town');
    assert.equal(state.receptionHidden,true,'Unconfirmed reception must not link');
    assert.equal(state.mapHidden,!validMap,'Only approved Google Maps link is allowed');
    if(validMap)assert(state.mapHref.includes('maps.google.com/maps?cid=12345'));
    else assert.equal(state.mapHref,null,'Reject lookalike map URL');
    assert(!/sample|myanmar time/i.test(state.countdownNote),
      'Customized date may not retain sample-country timezone note');
    assert(!/sample/i.test(state.countdownAria),'Countdown a11y text must be customer-safe');
    assert(Number(state.days)>0,'Future custom date must initialize the countdown');
    assert.equal(state.bodyOverflow,0,'Customization introduced horizontal drag');
    assert.equal(state.activeSkin,skin);
    await page.locator('#shareButton').click();
    assert.match(await page.locator('#toast').textContent(),/local preview/i,
      'Local URL must not be copied as a guest link');
    await page.locator('#closing .back-to-top').click();
    await page.waitForFunction(()=>location.hash==='#home');
    assert.deepEqual(errors,[],'Unexpected page errors');
    console.log('PASS release guest workflow',skin,validMap?'approved map':'blocked spoofed map');
  }finally{
    await context.close();
  }
}
async function main(){
  if(!await available()){
    server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'ignore'});
    if(!await available())throw Error('Local server unavailable');
  }
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  await verify('golden-autumn',true);
  await verify('moonlit-amethyst',false);
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  await browser?.close();server?.kill();
});
