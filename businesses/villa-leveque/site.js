const header=document.querySelector('.site-header');const nav=document.querySelector('.nav-links');
document.querySelectorAll('[data-menu]').forEach(btn=>btn.addEventListener('click',()=>nav?.classList.toggle('open')));
addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>18),{passive:true});
const current=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active');a.addEventListener('click',()=>nav?.classList.remove('open'));});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target);}})},{threshold:.12,rootMargin:'0px 0px -8%'});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
document.querySelectorAll('form[data-static-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const note=form.querySelector('.form-note');if(note)note.textContent='This static form is ready for a real enquiry endpoint before launch.';}));
const lightbox=document.createElement('div');lightbox.className='lightbox';lightbox.innerHTML='<button type="button" aria-label="Close gallery">×</button><img alt=""><p></p>';document.body.appendChild(lightbox);const lightboxImage=lightbox.querySelector('img');const lightboxCaption=lightbox.querySelector('p');
document.querySelectorAll('.gallery-item img,.preview-wall img').forEach(image=>image.addEventListener('click',()=>{lightboxImage.src=image.currentSrc||image.src;lightboxImage.alt=image.alt;lightboxCaption.textContent=image.alt;lightbox.classList.add('open');}));
lightbox.addEventListener('click',event=>{if(event.target===lightbox||event.target.tagName==='BUTTON')lightbox.classList.remove('open');});
addEventListener('keydown',event=>{if(event.key==='Escape')lightbox.classList.remove('open');});
