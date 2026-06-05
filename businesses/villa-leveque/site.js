const header=document.querySelector('.site-header');
const nav=document.querySelector('.nav-links');
document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>nav?.classList.toggle('open')));
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>20),{passive:true});
const page=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active');a.addEventListener('click',()=>nav?.classList.remove('open'));});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -8%'});document.querySelectorAll('.reveal,.card,.media,.tile,.service,.facts>div').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
document.querySelectorAll('form[data-static-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const n=f.querySelector('.form-note');if(n)n.textContent='Thank you — this static concept is ready for a booking enquiry endpoint before launch.';}));
const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<button aria-label="Close">×</button><img alt=""><p></p>';document.body.appendChild(lb);const lbi=lb.querySelector('img'),cap=lb.querySelector('p');
document.querySelectorAll('.tile img,.gallery-band .media img').forEach(img=>img.addEventListener('click',()=>{lbi.src=img.src;lbi.alt=img.alt;cap.textContent=img.alt;lb.classList.add('open');}));
lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('open');});
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open');});
