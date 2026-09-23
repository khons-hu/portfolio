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
  // The committed language: text on the page is always in this one, even while another pack loads.
  let language = 'en';
  const ready = typeof isLocaleReady === 'function' ? isLocaleReady : () => true;
  const load = typeof loadLocale === 'function' ? loadLocale : () => Promise.resolve();
  // Packs loaded after site-locales.js ran still need to join the page catalogs.
  const adopt = lang => {
    const pack = typeof EXTRA_LOCALE_PACKS === 'undefined' ? null : EXTRA_LOCALE_PACKS[lang];
    if (pack) { SITE_LOCALES[lang] ||= pack.site; PROJECT_NOTES[lang] ||= pack.notes; }
  };
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
  function commit(next,persist){
    adopt(next);
    language=next;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);selector.value=language;
    if(current)current.textContent=language.toUpperCase();
    if(persist)try{localStorage.setItem('khonsu-language',language);}catch{}
    bindings.forEach(update=>update());
    window.dispatchEvent(new CustomEvent('portfolio:language',{detail:language}));
  }
  let request=0;
  // Built-in and already loaded languages switch at once. Others switch when their pack arrives;
  // if it cannot load, the page stays in the current language instead of mixing catalogs.
  function apply(value,persist=true){
    const next=resolve(value), token=++request;
    if(ready(next)){commit(next,persist);return Promise.resolve(next);}
    document.documentElement.setAttribute('aria-busy','true');
    return load(next).then(()=>{if(token===request)commit(next,persist);return next;},()=>{
      if(token===request){selector.value=language;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);}
      return language;
    }).finally(()=>{if(token===request)document.documentElement.removeAttribute('aria-busy');});
  }
  window.PortfolioI18n={t,get language(){return language;},resolve,choose,names,load:lang=>load(lang).then(()=>adopt(lang)),notes:id=>(PROJECT_NOTES[language]?.[id]||PROJECT_NOTES.en[id])?.map(text=>directionalText(text,language))};
  selector.addEventListener('change',()=>apply(selector.value));
  window.addEventListener('storage',e=>{if(e.key==='khonsu-language')apply(choose(e.newValue),false);});
  apply(choose(saved),false);
})();
