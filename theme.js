// Set language and reading direction before first paint, so Arabic and Urdu do not flip once the
// deferred locale scripts arrive. i18n.js makes the final choice; keep this list in sync with LANGUAGE_NAMES.
(function(){
 const supported=['en','sk','hu','pl','de','es','cs','pt','fr','zh','hi','ar','bn','ru','ur','id','ja'];
 const pick=value=>{const tag=String(value||'').toLowerCase().replace(/_/g,'-');if(/^zh-(?:hant|tw|hk|mo)(?:-|$)/.test(tag))return null;const lang=tag.split('-')[0];return supported.includes(lang)?lang:null;};
 let saved;try{saved=localStorage.getItem('khonsu-language');}catch{}
 const nav=typeof navigator!=='undefined'?navigator:{};
 const lang=pick(saved)||(nav.languages||[nav.language]).map(pick).find(Boolean)||'en';
 const root=document.documentElement;root.lang=lang;root.dir=['ar','ur'].includes(lang)?'rtl':'ltr';
 // JavaScript is running: controls that need it may show (see html:not(.js) in style.css).
 root.classList.add('js');
 // Start fetching an added language's pack now, in parallel with the page. language-data.js reuses this request.
 // Standalone pages (404) carry their own short copy and skip the pack.
 if(['pt','fr','zh','hi','ar','bn','ru','ur','id','ja'].includes(lang)&&document.head&&!root.hasAttribute('data-standalone')){
  const script=document.createElement('script');
  const version=document.currentScript?new URL(document.currentScript.src).search:'';
  script.src='/locales/'+lang+'.js'+version;script.async=true;script.dataset.locale=lang;
  script.onerror=()=>{script.dataset.failed='1';};
  document.head.append(script);
 }
})();
// Apply the saved theme before styles load. User clicks are queued, never discarded.
(function(){
 const preference=matchMedia('(prefers-color-scheme: light)');
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let saved;try{saved=localStorage.getItem('khonsu-theme');}catch{}
 if(saved!=='light'&&saved!=='dark')saved=null;
 let desired=saved||(preference.matches?'light':'dark'),busy=false,timer;
 function apply(theme){
  root.dataset.theme=theme;
  const button=document.querySelector('#theme-toggle');
  if(button){button.textContent=theme==='light'?'☾':'☀';const label=theme==='light'?'Switch to dark mode':'Switch to light mode';button.setAttribute('aria-label',globalThis.PortfolioI18n?.t(label)||label);button.title=button.getAttribute('aria-label');}
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#e9e6df':'#090f16');
 }
 function motionAllowed(){return !root.classList.contains('motion-off')&&!document.hidden&&(root.classList.contains('motion-force-on')||!reduced.matches);}
 function finish(){clearTimeout(timer);busy=false;root.classList.remove('theme-changing');document.querySelector('#theme-toggle')?.removeAttribute('aria-busy');if(root.dataset.theme!==desired)change();}
 function change(){
  if(busy||root.dataset.theme===desired)return;
  // Keep a short transition window even without animation, so rapid clicks cannot strobe.
  busy=true;
  const button=document.querySelector('#theme-toggle');button?.setAttribute('aria-busy','true');
  if(motionAllowed()){
   root.classList.add('theme-changing');
   // Establish transition properties before changing the CSS variables.
   void document.body.offsetWidth;
  }
  apply(desired);
  timer=setTimeout(finish,520);
 }
 function settle(){clearTimeout(timer);busy=false;root.classList.remove('theme-changing');document.querySelector('#theme-toggle')?.removeAttribute('aria-busy');apply(desired);}
 reduced.addEventListener('change',settle);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
 preference.addEventListener('change',()=>{if(!saved){desired=preference.matches?'light':'dark';settle();}});
 window.addEventListener('storage',event=>{if(event.key==='khonsu-theme'){saved=event.newValue==='light'||event.newValue==='dark'?event.newValue:null;desired=saved||(preference.matches?'light':'dark');settle();}});
 window.addEventListener('portfolio:language',()=>apply(root.dataset.theme||desired));
 apply(desired);
 document.addEventListener('DOMContentLoaded',()=>{
  apply(desired);
  document.querySelector('#theme-toggle')?.addEventListener('click',()=>{
   desired=desired==='light'?'dark':'light';saved=desired;
   try{localStorage.setItem('khonsu-theme',saved);}catch{}
   change();
  });
 });
})();
