/* Bind authored text once. Dynamic content uses t() explicitly; user text is never scanned. */
(function () {
  const names = LANGUAGE_NAMES;
  const match = value => {
    const tag=String(value || '').toLowerCase().replace(/_/g,'-');
    // Simplified Chinese is available. Do not silently label it as Traditional Chinese.
    if (/^zh-(?:hant|tw|hk|mo)(?:-|$)/.test(tag)) return null;
    const lang=tag.split('-')[0]; return Object.hasOwn(names,lang) ? lang : null;
  };
  const resolve = value => match(value) || 'en';
  const choose = saved => match(saved) || (navigator.languages || [navigator.language]).map(match).find(Boolean) || 'en';
  let saved;
  try { saved=localStorage.getItem('khonsu-language'); } catch {}
  let language = choose(saved);
  const t = (text,lang=language) => directionalText(SITE_LOCALES[lang]?.[text] || text,lang);
  const bindings=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()) {
    const node=walker.currentNode, parent=node.parentElement;
    if(!parent || parent.closest('script,style,select,#guide-dialog,#terminal-output,#project-notes'))continue;
    const key=node.nodeValue.trim();
    if(!Object.hasOwn(SITE_LOCALES.sk,key))continue;
    const leading=node.nodeValue.match(/^\s*/)[0], trailing=node.nodeValue.match(/\s*$/)[0];
    bindings.push(()=>{node.nodeValue=leading+t(key)+trailing;});
  }
  document.querySelectorAll('[aria-label],[title],[alt]').forEach(el=>{
    if(el.closest('#guide-dialog'))return;
    for(const attr of ['aria-label','title','alt']){const key=el.getAttribute(attr);if(key && Object.hasOwn(SITE_LOCALES.sk,key))bindings.push(()=>el.setAttribute(attr,t(key)));}
  });
  const selector=document.querySelector('#site-language');
  const current=document.querySelector('.lang-current');
  function apply(value,persist=true){
    language=resolve(value);document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);selector.value=language;
    if(current)current.textContent=language.toUpperCase();
    if(persist)try{localStorage.setItem('khonsu-language',language);}catch{}
    bindings.forEach(update=>update());
    window.dispatchEvent(new CustomEvent('portfolio:language',{detail:language}));
  }
  window.PortfolioI18n={t,get language(){return language;},resolve,choose,names,notes:id=>(PROJECT_NOTES[language]?.[id]||PROJECT_NOTES.en[id])?.map(text=>directionalText(text,language))};
  selector.addEventListener('change',()=>apply(selector.value));
  window.addEventListener('storage',e=>{if(e.key==='khonsu-language')apply(choose(e.newValue),false);});
  apply(language,false);
})();
