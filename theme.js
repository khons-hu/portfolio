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
// Effects, strongest first, only while motion is allowed:
//  sweep: a View Transition reveals the new theme as a disc rising from the toggle (one root snapshot, clip-path only);
//  fade:  where View Transitions are missing, listed surfaces fade their colours;
//  arc:   touch screens on the System setting keep only the small arc at the control.
// Sweep and fade run on precise pointers, or anywhere once the visitor explicitly chose Motion: on.
(function(){
 const preference=matchMedia('(prefers-color-scheme: light)');
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
 const EFFECTS=['theme-changing','theme-fade','theme-sweep'],PLAIN_MS=520,SWEEP_LIMIT_MS=1400;
 let saved;try{saved=localStorage.getItem('khonsu-theme');}catch{}
 if(saved!=='light'&&saved!=='dark')saved=null;
 let desired=saved||(preference.matches?'light':'dark'),busy=false,timer,sweep=null,active=0,runs=0;
 function apply(theme){
  root.dataset.theme=theme;
  const button=document.querySelector('#theme-toggle');
  if(button){button.textContent=theme==='light'?'☾':'☀';const label=theme==='light'?'Switch to dark mode':'Switch to light mode';button.setAttribute('aria-label',globalThis.PortfolioI18n?.t(label)||label);button.title=button.getAttribute('aria-label');}
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#e9e6df':'#090f16');
 }
 function motionAllowed(){return !root.classList.contains('motion-off')&&!document.hidden&&(root.classList.contains('motion-force-on')||!reduced.matches);}
 function richMotion(){return fine.matches||root.classList.contains('motion-force-on');}
 function clear(){clearTimeout(timer);timer=undefined;busy=false;active=0;sweep=null;root.classList.remove(...EFFECTS);document.querySelector('#theme-toggle')?.removeAttribute('aria-busy');}
 // Stale completions (a skipped or superseded run) are ignored, so they cannot end a newer change early.
 function finish(id){if(id!==active)return;clear();if(root.dataset.theme!==desired)change();}
 // The disc starts at the toggle's centre and grows to the farthest viewport corner. When the toggle is out of
 // view (the terminal's theme command after scrolling), the start is clamped inside the viewport, so the disc
 // still forms visibly, in line with the toggle, instead of arriving from far offscreen.
 function origin(){
  const box=document.querySelector('#theme-toggle')?.getBoundingClientRect?.(),w=globalThis.innerWidth||0,h=globalThis.innerHeight||0,inset=24;
  const rtl=root.dir==='rtl',clamp=(value,max)=>max>2*inset?Math.min(max-inset,Math.max(inset,value)):max/2;
  const x=clamp(box&&box.width?box.left+box.width/2:(rtl?inset:w-inset),w),y=clamp(box&&box.height?box.top+box.height/2:inset,h);
  const r=Math.ceil(Math.hypot(Math.max(x,w-x),Math.max(y,h-y)));
  root.style?.setProperty('--theme-x',Math.round(x)+'px');root.style?.setProperty('--theme-y',Math.round(y)+'px');root.style?.setProperty('--theme-r',r+'px');
 }
 function change(){
  if(busy||root.dataset.theme===desired)return;
  // Keep a short window even without animation, so rapid clicks cannot strobe.
  busy=true;const id=active=++runs,target=desired;
  document.querySelector('#theme-toggle')?.setAttribute('aria-busy','true');
  if(motionAllowed()){
   root.classList.add('theme-changing');
   if(richMotion()&&typeof document.startViewTransition==='function'){
    origin();root.classList.add('theme-sweep');
    try{
     // If this run was cancelled before the snapshot, the callback still lands on the latest choice.
     sweep=document.startViewTransition(()=>apply(id===active?target:desired));
     Promise.resolve(sweep?.finished).then(()=>finish(id),()=>finish(id));
     timer=setTimeout(()=>{if(id===active){sweep?.skipTransition?.();finish(id);}},SWEEP_LIMIT_MS);
     return;
    }catch{sweep=null;root.classList.remove('theme-sweep');}
   }
   if(richMotion())root.classList.add('theme-fade');
   // Establish transition properties before changing the CSS variables.
   void document.body.offsetWidth;
  }
  apply(target);
  timer=setTimeout(()=>finish(id),PLAIN_MS);
 }
 // Motion Off, reduced motion, a hidden tab or an outside change end any effect at once and show the latest choice.
 function settle(){const running=sweep;clear();running?.skipTransition?.();apply(desired);}
 reduced.addEventListener('change',settle);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
 window.addEventListener('portfolio:motion',()=>{if(busy&&!motionAllowed())settle();});
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
