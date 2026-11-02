/* Bride & Groom Gallery — optional, approved local customer photos only.
 * No external image hosting, unsafe paths or broken preview image icons.
 * The default prototype deliberately uses decorative placeholders.
 */
'use strict';
(function initCoupleGallery(){
  const section=document.getElementById('gallery');
  const grid=document.getElementById('coupleGalleryGrid');
  const dialog=document.getElementById('galleryLightbox');
  if(!section||!grid||!dialog)return;
  const config=window.WEDDING_CUSTOMIZATION?.gallery||{};
  // Only upload-to-repo assets under photos/. This avoids leaking customer
  // photos to third-party CDNs and prevents protocol/traversal injection.
  function safePhotoPath(path){
    return typeof path==='string' && path.length<220 &&
      /^photos\/[a-z0-9_-]+\.(webp|png|jpe?g|avif)$/i.test(path) &&
      !path.includes('..') && !path.includes('//') && !path.includes('/./');
  }
  const stringOr=(value,fallback)=>typeof value==='string'&&value.trim()?value.trim():fallback;
  const roles=[
    ['bride','first','The Bride'],
    ['groom','second','The Groom']
  ];
  for(const [role,coupleKey,label] of roles){
    const details=config[role]||{};
    const nameNode=section.querySelector('[data-gallery-name="'+role+'"]');
    const coupleName=document.querySelector('[data-name="'+coupleKey+'"]')?.textContent||label;
    const name=stringOr(details.name,coupleName);
    if(nameNode)nameNode.textContent=name;
    const caption=section.querySelector('[data-gallery-caption="'+role+'"]');
    if(caption)caption.textContent=stringOr(details.caption,'');
    const img=section.querySelector('[data-gallery-portrait="'+role+'"]');
    const placeholder=section.querySelector('[data-gallery-placeholder="'+role+'"]');
    if(img && safePhotoPath(details.photo)){
      // Hidden lazy-loaded images may never request their source.
      // Portraits are only two small assets, so resolve them eagerly first.
      img.loading='eager';
      img.alt='Portrait of '+name;
      img.addEventListener('load',()=>{
        img.hidden=false;
        if(placeholder)placeholder.hidden=true;
      },{once:true});
      img.addEventListener('error',()=>{
        img.hidden=true;img.removeAttribute('src');
        if(placeholder)placeholder.hidden=false;
      },{once:true});
      img.src=details.photo;
    }
  }

  const entries=Array.isArray(config.photos)?config.photos.slice(0,8):[];
  const photos=entries.filter(entry=>entry && safePhotoPath(entry.src)).map((entry,index)=>({
    src:entry.src,
    alt:stringOr(entry.alt,'Bride and groom gallery photograph '+(index+1)),
    caption:stringOr(entry.caption,'Our cherished moment '+(index+1))
  }));
  let activeIndex=0, lastTrigger=null;
  const largeImage=document.getElementById('galleryLightboxImage');
  const largeCaption=document.getElementById('galleryLightboxCaption');
  const closeButton=dialog.querySelector('[data-gallery-close]');
  const prevButton=dialog.querySelector('[data-gallery-prev]');
  const nextButton=dialog.querySelector('[data-gallery-next]');

  function showImage(index){
    if(!photos.length)return;
    activeIndex=(index+photos.length)%photos.length;
    const item=photos[activeIndex];
    largeImage.src=item.src;
    largeImage.alt=item.alt;
    largeCaption.textContent=item.caption;
    prevButton.hidden=nextButton.hidden=photos.length<2;
  }
  function openImage(index,button){
    if(typeof dialog.showModal!=='function')return;
    lastTrigger=button;
    showImage(index);
    dialog.showModal();
    closeButton.focus();
  }
  function makePlaceholder(index){
    const tile=document.createElement('div');
    tile.className='couple-gallery-placeholder';
    const text=document.createElement('span');
    text.textContent='PHOTO '+String(index+1).padStart(2,'0')+' · Coming soon';
    tile.appendChild(text);
    return tile;
  }
  if(!photos.length){
    for(let i=0;i<4;i++)grid.appendChild(makePlaceholder(i));
    section.querySelector('[data-gallery-demo-note]')?.removeAttribute('hidden');
  }else{
    for(const [index,item] of photos.entries()){
      const figure=document.createElement('figure');
      figure.className='couple-gallery-tile';
      const button=document.createElement('button');
      button.className='couple-gallery-photo-button';
      button.type='button';
      button.setAttribute('aria-label','View photo '+(index+1)+': '+item.caption);
      const img=document.createElement('img');
      img.src=item.src;
      img.alt=item.alt;
      img.loading='lazy';
      img.decoding='async';
      img.addEventListener('error',()=>{
        figure.replaceWith(makePlaceholder(index));
        // Keep any remaining photos navigable in the dialog.
        const active=photos.indexOf(item);
        if(active>=0)photos.splice(active,1);
      },{once:true});
      button.appendChild(img);
      button.addEventListener('click',()=>openImage(photos.indexOf(item),button));
      const caption=document.createElement('figcaption');
      caption.textContent=item.caption;
      figure.appendChild(button);
      figure.appendChild(caption);
      grid.appendChild(figure);
    }
    for(let i=photos.length;i<4;i++)grid.appendChild(makePlaceholder(i));
  }

  closeButton.addEventListener('click',()=>dialog.close());
  prevButton.addEventListener('click',()=>showImage(activeIndex-1));
  nextButton.addEventListener('click',()=>showImage(activeIndex+1));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();showImage(activeIndex-1);}
    if(event.key==='ArrowRight'){event.preventDefault();showImage(activeIndex+1);}
  });
  dialog.addEventListener('close',()=>{
    largeImage.removeAttribute('src');
    if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
  });
})();
