/** Dependency-free functional checks for Golden Autumn Heritage Section 1.
 * Run: node tests/hero-interaction.cjs
 * Simulates keyboard controls, opening state, and reduced motion without a browser.
 * It does NOT replace actual phone screenshot, assistive-technology, or Lighthouse QA.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const script=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function simulate(mode){
  const pending=[],nodes={};
  let focused=null;
  function element(id){
    const classNames=new Set(id==='body'?['not-opened']:[]);
    const attributes={};
    return {
      id, events:{}, children:[], disabled:false, inert:false, attributes,
      classList:{
        add(name){classNames.add(name);},
        remove(name){classNames.delete(name);},
        contains(name){return classNames.has(name);}
      },
      style:{setProperty(){}},
      setAttribute(name,value){attributes[name]=String(value);},
      removeAttribute(name){delete attributes[name];},
      focus(){focused=this;},
      addEventListener(event,handler){this.events[event]=handler;},
      appendChild(node){this.children.push(node);},
      remove(){}
    };
  }
  for(const id of [
    'body','openingCover','openInvitation','skipOpening','leafField','mainContent',
    'heroTitle','days','hours','minutes','seconds','countdownStatus',
    'shareButton','envelope','countdown-grid'
  ]) nodes[id]=element(id);
  const doc={
    body:nodes.body,
    documentElement:{clientWidth:390},
    getElementById(id){return nodes[id]||null;},
    querySelector(selector){
      if(selector==='.envelope')return nodes.envelope;
      if(selector==='.countdown-grid')return nodes['countdown-grid'];
      return null;
    },
    querySelectorAll(){return [];},
    createElement:element,
    get activeElement(){return focused;}
  };
  const context={
    document:doc,
    window:{
      location:{search:mode==='preview'?'?heroPreview=1':''},
      setTimeout(callback){pending.push(callback);return pending.length;}
    },
    navigator:{},
    matchMedia(){return {matches:mode==='reduced-motion'};},
    URLSearchParams:class {
      constructor(text){this.text=text;}
      get(key){return this.text.includes(key+'=1')?'1':null;}
    },
    setInterval(){return 1;},
    setTimeout(callback){pending.push(callback);return pending.length;},
    clearTimeout(){},
    Date,Math,URL,console
  };
  new Function(...Object.keys(context),script)(...Object.values(context));
  assert.equal(nodes.mainContent.inert,mode!=='preview','Initial page must remain locked');
  if(mode==='normal'){
    assert.equal(focused,nodes.openInvitation,'Modal should initially focus Open');
    nodes.openInvitation.events.click();
    nodes.openInvitation.events.click();
    assert.equal(nodes.leafField.children.length,19,'Opening effects must only run once');
    assert.equal(pending.length,1,'Opening should schedule only one finish');
    pending.shift()();
  }else if(mode==='skip'){
    nodes.skipOpening.events.click();
    assert.equal(nodes.leafField.children.length,0,'Skip should not create gust leaves');
  }else if(mode==='escape'){
    nodes.openingCover.events.keydown({key:'Escape',preventDefault(){}});
  }else if(mode==='reduced-motion'){
    nodes.openInvitation.events.click();
    assert.equal(nodes.leafField.children.length,0,'Reduced motion should skip gust');
  }else if(mode==='tab'){
    nodes.skipOpening.focus();
    nodes.openingCover.events.keydown({key:'Tab',shiftKey:false,preventDefault(){}});
    assert.equal(focused,nodes.envelope,'Tab after Skip should wrap to butterfly');
    nodes.openingCover.events.keydown({key:'Tab',shiftKey:true,preventDefault(){}});
    assert.equal(focused,nodes.skipOpening,'Shift+Tab from butterfly should wrap to Skip');
    nodes.skipOpening.events.click();
  }
  assert.equal(nodes.mainContent.inert,false,'Main should unlock after opening');
  assert.equal(nodes.openingCover.inert,true,'Closed dialog should become inert');
  assert.equal(focused,nodes.heroTitle,'Hero title should receive focus');
  assert.equal(nodes.body.classList.contains('not-opened'),false,'Page should no longer be locked');
}
for(const mode of ['normal','skip','escape','reduced-motion','preview','tab']){
  simulate(mode);
  console.log('PASS hero interaction:',mode);
}
