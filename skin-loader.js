/* Swap approved artwork paths, keeping shared HTML data and animations. */
'use strict';
(function loadSkin() {
  const catalog=window.INVITATION_SKINS;
  if(!catalog?.packs)return;
  const requested=new URLSearchParams(location.search).get('skin');
  const id=Object.prototype.hasOwnProperty.call(catalog.packs,requested)
    ? requested : catalog.defaultId;
  const skin=catalog.packs[id];
  if(!skin)return;
  window.INVITATION_ACTIVE_SKIN=skin;
  document.documentElement.dataset.skin=id;
  // The original image paths stay in the HTML/CSS, even without JavaScript.
  if(id===catalog.defaultId)return;
  function swap(selector,src){
    if(!src)return;
    document.querySelectorAll(selector).forEach(img=>{
      if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    });
  }
  function picture(selector,art){
    if(!art?.png||!art.webp)return;
    const wrapper=document.querySelector(selector);
    if(!wrapper)return;
    wrapper.querySelector('source[type="image/webp"]')?.setAttribute('srcset',art.webp);
    wrapper.querySelector('img')?.setAttribute('src',art.png);
  }
  picture('.hero-scene picture',skin.hero);
  picture('.ceremony-master-scene picture',skin.events);
  const paper=document.querySelector('.heritage-invitation');
  if(paper&&skin.family?.png){
    const png='url("'+skin.family.png+'")';
    const webp='url("'+skin.family.webp+'")';
    const webpSet='image-set('+webp+' type("image/webp"),'+png+' type("image/png"))';
    paper.style.borderImageSource=window.CSS?.supports?.('border-image-source',webpSet)?webpSet:png;
  }
  swap('.opening-card-art',skin.envelope);
  swap('.wax-seal-art',skin.seal);
  swap('.butterfly .wing--left, .hero-butterfly-wing--left',skin.butterfly?.left);
  swap('.butterfly .wing--right, .hero-butterfly-wing--right',skin.butterfly?.right);
  swap('.butterfly .butterfly-body, .hero-butterfly-body',skin.butterfly?.body);
  swap('.divider-art, .story-ornament',skin.divider);
  swap('.story-corner, .paper-corner',skin.corner);
  for(let i=0;i<5;i++)swap('.cover-leaf.c'+(i+1),skin.leaves?.[i]);
})();