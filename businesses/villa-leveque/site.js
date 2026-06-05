
const header=document.querySelector('.site-header');
const nav=document.querySelector('.nav-links');
document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>nav?.classList.toggle('open')));
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>24),{passive:true});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8%'});
if(!reduce){document.querySelectorAll('.reveal,.card,.media,.tile,.service,.stat').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
document.querySelectorAll('form[data-static-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const n=f.querySelector('.form-note');if(n)n.textContent='Thank you — this concept is ready for a booking enquiry endpoint before launch.';}));
document.querySelectorAll('[data-video-placeholder]').forEach(b=>b.addEventListener('click',()=>{const p=b.closest('.film')?.querySelector('.film-note p');if(p)p.textContent='Video coming soon — full villa tour file to be added at assets/video/villa-tour.mp4';}));
const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<button aria-label="Close">×</button><img alt=""><p></p>';document.body.appendChild(lb);const lbi=lb.querySelector('img'),cap=lb.querySelector('p');
document.querySelectorAll('.tile img').forEach(img=>img.addEventListener('click',()=>{lbi.src=img.src;lbi.alt=img.alt;cap.textContent=img.alt;lb.classList.add('open');}));
lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('open');});
