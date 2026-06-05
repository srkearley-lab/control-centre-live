const header=document.querySelector('.site-header');
const nav=document.querySelector('.nav-links');
document.querySelectorAll('[data-menu]').forEach(button=>button.addEventListener('click',()=>nav?.classList.toggle('open')));
window.addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',window.scrollY>24),{passive:true});
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const revealItems=document.querySelectorAll('.section,.card,.fact,.service,.tile,.image-frame,.editorial,.split');
  revealItems.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${Math.min(i%6,5)*70}ms`)});
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  revealItems.forEach(el=>io.observe(el));
  document.querySelectorAll('.hero-img img,.page-hero-img img').forEach(img=>img.classList.add('slow-zoom'));
}
document.querySelectorAll('form[data-static-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const note=form.querySelector('.form-note');if(note)note.textContent='Thank you — this static preview is ready for a form endpoint before launch.';}));
// Lightweight gallery overlay inspired by PhotoSwipe/GLightbox patterns, without adding a heavy dependency.
const lightbox=document.createElement('div');
lightbox.className='lightbox';
lightbox.innerHTML='<button aria-label="Close gallery">×</button><img alt="Villa Leveque gallery image"><span></span>';
document.body.appendChild(lightbox);
const lightImg=lightbox.querySelector('img'),lightCaption=lightbox.querySelector('span');
document.querySelectorAll('.tile img').forEach(img=>img.addEventListener('click',()=>{lightImg.src=img.currentSrc||img.src;lightImg.alt=img.alt||'Villa Leveque image';lightCaption.textContent=img.alt||'';lightbox.classList.add('open')}));
lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.tagName==='BUTTON')lightbox.classList.remove('open')});
