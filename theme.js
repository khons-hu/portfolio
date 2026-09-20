// Run before styles to avoid flashing the wrong saved theme.
(function(){
 const preference=matchMedia('(prefers-color-scheme: light)');
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let nextSwitch=0,effectTimer;
 const clearEffect=()=>{clearTimeout(effectTimer);root.classList.remove('theme-changing');};
 reduced.addEventListener('change',clearEffect);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearEffect();});
 let saved;try{saved=localStorage.getItem('khonsu-theme');}catch{}
 function apply(theme){
  document.documentElement.dataset.theme=theme;
  const button=document.querySelector('#theme-toggle');
  if(button){button.textContent=theme==='light'?'☾':'☀';button.setAttribute('aria-label',theme==='light'?'Switch to dark mode':'Switch to light mode');button.title=button.getAttribute('aria-label');}
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#f0f4f7':'#090f16');
 }
 apply(saved==='light'||saved==='dark'?saved:preference.matches?'light':'dark');
 preference.addEventListener('change',()=>{if(!saved)apply(preference.matches?'light':'dark');});
 document.addEventListener('DOMContentLoaded',()=>{
  apply(document.documentElement.dataset.theme);
  document.querySelector('#theme-toggle').addEventListener('click',()=>{
   const now=performance.now();if(now<nextSwitch)return;nextSwitch=now+1200;
   clearEffect();
   if(!reduced.matches&&!root.classList.contains('motion-off')&&!document.hidden){root.classList.add('theme-changing');effectTimer=setTimeout(clearEffect,850);}
   saved=document.documentElement.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('khonsu-theme',saved);}catch{}apply(saved);});
 });
})();
