/* A restrained, always-living garden made from transparent leaf/flower
 * overlays. Never moves the approved master painting or intercepts touches.
 * No timers/spawn loops: a fixed set of compositor-friendly CSS animations.
 */
'use strict';
(function createAmbientGarden(){
  const stage=document.getElementById('gardenAmbient');
  if(!stage || new URLSearchParams(location.search).get('artReview')==='1')return;
  const skin=window.INVITATION_ACTIVE_SKIN;
  const leafPaths=skin?.leaves || [
    '23_leaf_golden_teak.png','24_leaf_copper_teak.png','25_leaf_burgundy_teak.png',
    '26_leaf_golden_bodhi.png','27_leaf_orange_bodhi.png','28_leaf_small_russet.png'
  ];
  const places=[
    {x:5,y:27,drift:19,dur:12,delay:-5},
    {x:91,y:39,drift:-16,dur:16,delay:-9},
    {x:7,y:67,drift:13,dur:14,delay:-2},
    {x:93,y:76,drift:-12,dur:18,delay:-10},
    {x:14,y:87,drift:22,dur:17,delay:-6},
    {x:86,y:13,drift:-18,dur:15,delay:-11}
  ];
  places.forEach((p,index)=>{
    const img=document.createElement('img');
    img.className='garden-ambient-leaf';
    img.src=leafPaths[index % leafPaths.length];
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.decoding='async';
    img.loading='lazy';
    img.style.setProperty('--x',p.x+'%');
    img.style.setProperty('--y',p.y+'%');
    img.style.setProperty('--drift',p.drift+'px');
    img.style.setProperty('--duration',p.dur+'s');
    img.style.setProperty('--delay',p.delay+'s');
    stage.appendChild(img);
  });
  const flower=skin?.floral || '18_hanging_flower_sprig.png';
  for(let i=0;i<4;i++){
    const img=document.createElement('img');
    img.className='garden-ambient-flower '+(i%2===0?'is-left':'is-right');
    img.src=flower;
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.loading='lazy';
    img.decoding='async';
    img.style.setProperty('--top',(i<2?20:67)+'%');
    img.style.setProperty('--delay',(-2-i*1.75)+'s');
    stage.appendChild(img);
  }
})();
