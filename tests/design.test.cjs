const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('index.html');
const {SITE_LOCALES}=require('../site-locales.js');
const {LANGUAGE_NAMES,EXTRA_LOCALE_PACKS}=require('../language-data.js');

class Element {
 constructor(tag='div',text=''){this.tag=tag;this.text=text;this.children=[];this.events={};this.value='';this.open=true;this.hidden=false;this.attributes={};}
 set textContent(value){this.text=value;this.children=[];}
 get textContent(){return this.text+this.children.map(child=>typeof child==='string'?child:child.textContent).join('');}
 append(...children){for(const child of children){if(typeof child!=='string')child.parent=this;this.children.push(child);}}
 replaceChildren(...children){this.text='';this.children=[];this.append(...children);}
 get firstElementChild(){return this.children[0];}
 remove(){this.parent.children.splice(this.parent.children.indexOf(this),1);}
 addEventListener(type,fn){this.events[type]=fn;}
 focus(){this.focused=true;}
 scrollIntoView(){}
 close(){this.open=false;}
}
const walk=(node,found=[])=>{if(node&&typeof node==='object'){found.push(node);(node.children||[]).forEach(child=>walk(child,found));}return found;};
function terminal(language='en'){
 const nodes=new Map();const node=key=>{if(!nodes.has(key))nodes.set(key,new Element());return nodes.get(key);};
 const projects={signal:{title:'Khonrelay',live:true,url:'https://example.com/relay'},dots:{title:'Dots',live:true,url:'https://example.com/dots'}};
 const cards=Object.keys(projects).map(id=>({dataset:{project:id},querySelector:()=>new Element('p',id+' description')}));
 const i18n={language};
 const context=vm.createContext({projects,EXTRA_LOCALE_PACKS,t:value=>value,PortfolioI18n:i18n,matchMedia:()=>({matches:false}),showProject(){},
  document:{querySelector:node,querySelectorAll:selector=>selector==='[data-project]'?cards:[],addEventListener(){},createElement:tag=>new Element(tag),createTextNode:text=>new Element('text',text)},
  window:{PortfolioPanels:{open(){}}}});
 vm.runInContext(read('terminal.js'),context);
 return {context,node,i18n};
}

test('help lists every command with a description in all supported languages',()=>{
 const s=terminal();
 // Built-in copy lives in terminal.js; added languages come from their packs.
 const languages=[...new Set([...vm.runInContext('Object.keys(terminalCopy)',s.context),...Object.keys(LANGUAGE_NAMES)])];
 assert.deepEqual([...languages].sort(),Object.keys(LANGUAGE_NAMES).sort());
 for(const language of languages){
  s.i18n.language=language;s.node('#terminal-output').replaceChildren();
  s.context.run('help');
  const list=walk(s.node('#terminal-output')).find(el=>el.className==='terminal-help');
  const terms=list.children.filter(el=>el.tag==='dt').map(el=>el.textContent);
  const details=list.children.filter(el=>el.tag==='dd').map(el=>el.textContent);
  assert.deepEqual(terms,['about','projects','work','now','contact','status','lore','theme','open <project>','ask','email','clear','close'],language);
  assert(details.every(text=>typeof text==='string'&&text.trim()&&!text.includes('undefined')),language);
 }
});

test('terminal keeps ↗ for outside links and uses → for on-page destinations',()=>{
 const s=terminal();
 s.context.run('about');s.context.run('status');s.context.run('projects');
 const links=walk(s.node('#terminal-output')).filter(el=>el.tag==='a');
 const about=links.find(a=>a.href==='#about');const outside=links.find(a=>a.href==='https://example.com/relay');
 assert.match(about.textContent,/→$/);assert.doesNotMatch(about.textContent,/↗/);
 assert.match(outside.textContent,/↗$/);assert.equal(outside.target,'_blank');
 const projectButtons=walk(s.node('#terminal-output')).filter(el=>el.className==='terminal-project');
 assert(projectButtons.length===2&&projectButtons.every(button=>!button.textContent.includes('↗')));
});

function dialog(){
 const nodes=new Map();
 const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{textContent:'',hidden:false,open:false,scrollTop:0,attributes:{},replaceChildren(){},showModal(){this.open=true;},removeAttribute(key){delete this.attributes[key];delete this[key];},setAttribute(key,value){this.attributes[key]=String(value);},getAttribute(key){return this.attributes[key]??null;}});return nodes.get(selector);};
 const document={querySelector:selector=>selector.includes('.dialog-preview-hidden')||selector.includes('.project-info p')?null:node(selector),querySelectorAll:()=>[],createElement:()=>({textContent:''})};
 const source=read('app.js');const context=vm.createContext({document,t:x=>x});
 vm.runInContext(source.slice(source.indexOf('const projects = {'),source.indexOf("window.addEventListener('portfolio:language'",source.indexOf('const projects = {'))),context);
 return {link:()=>node('#project-link'),source:()=>node('#project-source'),show:id=>vm.runInContext(`showProject(${JSON.stringify(id)})`,context)};
}
test('project notes label the main outside link by what it is',()=>{
 const d=dialog();
 const expect={signal:['live','Open app ↗',/quiet-signal/],receipts:['live','Play on itch.io ↗',/itch\.io/],'save-democracy':['external','View on itch.io ↗',/itch\.io/],rotation:['external','Open playlist ↗',/open\.spotify\.com/]};
 for(const [id,[kind,label,href]] of Object.entries(expect)){d.show(id);assert.equal(d.link().attributes['data-kind'],kind,id);assert.equal(d.link().textContent,label,id);assert.match(d.link().href,href,id);assert.equal(d.link().hidden,false,id);}
 d.show('calculator');assert.equal(d.link().hidden,true);assert.equal(d.source().hidden,false);
 d.show('portfolio');assert.equal(d.link().hidden,true);assert.equal(d.source().hidden,true);
});

test('every card separates on-page notes from a typed outside link',()=>{
 const cards=html.match(/<article class="project-card[\s\S]*?<\/article>/g);
 assert.equal(cards.length,13);
 for(const card of cards){
  assert.match(card,/<span class="details-label">Notes<\/span><\/div><\/button>/);
  for(const [,kind,href] of card.matchAll(/<a class="project-live" data-kind="(\w+)" href="([^"]+)"/g)){
   assert(['live','source','external'].includes(kind),kind);
   if(href.includes('github.com'))assert.equal(kind,'source',href);
   if(kind==='live')assert.doesNotMatch(href,/github\.com/);
  }
 }
 assert.equal((html.match(/class="project-live"/g)||[]).length,12);
});

test('visible card labels and taglines are translated in every catalog',()=>{
 const labels=new Set(['Notes']);
 for(const [,text] of html.matchAll(/class="project-live"[^>]*>([^<]+)<\/a>/g))labels.add(text.trim());
 for(const [,text] of html.matchAll(/<span class="art-tag">([^<]+)<\/span>/g))if(/[a-z]{3}/i.test(text)&&!/·|AFTER DARK/.test(text))labels.add(text.trim());
 for(const [lang,strings] of Object.entries(SITE_LOCALES))for(const label of labels)assert(strings[label]?.trim(),`${lang}: ${label}`);
});

test('all local assets share one cache version',()=>{
 const versions=[...html.matchAll(/(?:src|href)="\/[\w-]+\.(?:js|css)\?v=([\w-]+)"/g)].map(match=>match[1]);
 const unversioned=[...html.matchAll(/(?:src|href)="(\/[\w-]+\.(?:js|css))"/g)].map(match=>match[1]);
 assert.equal(unversioned.length,0,unversioned.join(','));
 assert(versions.length>=11);assert.equal(new Set(versions).size,1);
});

test('switching panels focuses the matching tab unless a field was requested',()=>{
 const make=id=>{const tab={dataset:{panel:id},focus(){focused.push(id+':tab');}};const field={focus(){focused.push(id+':field');}};const classes=new Set();
  return {id,open:false,listeners:{},tab,field,classes,classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)},showModal(){this.open=true;},close(){this.open=false;pending.push(()=>this.listeners.close?.());},addEventListener(k,fn){this.listeners[k]=fn;},querySelector(selector){return selector===`[data-panel="${id}"]`?tab:field;},style:{setProperty(){}}};};
 const focused=[],pending=[];const flush=()=>pending.splice(0).forEach(fire=>fire());const dialogs=Object.fromEntries(['terminal-dialog','guide-dialog','email-dialog'].map(id=>[id,make(id)]));
 const timers=[];const context={t:x=>x,setTimeout:fn=>timers.push(fn),clearTimeout(){},window:{addEventListener(){}},document:{getElementById:id=>dialogs[id],activeElement:{isConnected:true,closest:()=>null,focus(){focused.push('page');}},querySelector:selector=>selector==='dialog[open]'?Object.values(dialogs).find(d=>d.open)||null:null,querySelectorAll:selector=>selector==='dialog[open]'?Object.values(dialogs).filter(d=>d.open):selector==='dialog'?Object.values(dialogs):[]}};
 vm.runInNewContext(read('panels.js'),context);
 const {open}=context.window.PortfolioPanels;
 // Dialog close events are queued by browsers, so the next panel is already open when they fire.
 open('terminal-dialog','#command');flush();open('guide-dialog');flush();open('email-dialog','input[type="email"]');flush();
 assert.deepEqual(focused,['terminal-dialog:field','guide-dialog:tab','email-dialog:field']);
 assert.equal(Object.values(dialogs).filter(d=>d.open).length,1);
 dialogs['email-dialog'].close();flush();assert.equal(focused.at(-1),'page');
});

test('tab switches keep the frame still and hand-offs close the previous panel at once',()=>{
 const focused=[],pending=[];const flush=()=>pending.splice(0).forEach(fire=>fire());
 const make=id=>{const classes=new Set();return {id,open:false,listeners:{},classes,classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k),remove:k=>classes.delete(k)},showModal(){this.open=true;this.openedWith=[...classes];},close(){this.open=false;this.closedWith=[...classes];pending.push(()=>this.listeners.close?.());},addEventListener(k,fn){this.listeners[k]=fn;},querySelector:()=>({focus(){}}),style:{setProperty(){}}};};
 const dialogs=Object.fromEntries(['terminal-dialog','guide-dialog','email-dialog','project-dialog'].map(id=>[id,make(id)]));
 const timers=[];const context={t:x=>x,setTimeout:fn=>timers.push(fn),clearTimeout(){},window:{addEventListener(){}},document:{getElementById:id=>dialogs[id],activeElement:{isConnected:true,closest:()=>null,focus(){}},querySelector:s=>s==='dialog[open]'?Object.values(dialogs).find(d=>d.open)||null:null,querySelectorAll:s=>s==='dialog[open]'?Object.values(dialogs).filter(d=>d.open):s==='dialog'?Object.values(dialogs):[]}};
 vm.runInNewContext(read('panels.js'),context);
 const {open}=context.window.PortfolioPanels;
 open('terminal-dialog');flush();
 assert(!dialogs['terminal-dialog'].openedWith.includes('panel-switch'),'first open animates normally');
 assert(!dialogs['terminal-dialog'].openedWith.includes('dialog-instant'));
 open('guide-dialog');flush();
 assert(dialogs['terminal-dialog'].closedWith.includes('dialog-instant'),'previous panel closes without a fade');
 assert(dialogs['guide-dialog'].openedWith.includes('panel-switch'),'new panel appears without the pop');
 timers.splice(0).forEach(fn=>fn());
 assert(!dialogs['guide-dialog'].classes.has('panel-switch'),'normal close fade returns afterwards');
 dialogs['guide-dialog'].close();flush();
 assert(!dialogs['guide-dialog'].closedWith.includes('dialog-instant'),'Escape still fades out');
});

test('filter chips morph only when motion is allowed, and typing never waits for a transition',()=>{
 const source=read('app.js');
 const run=(motion,supported)=>{
  const cards=[['tools','Alpha'],['games','Beta']].map(([projectGroup,textContent])=>({dataset:{projectGroup},textContent,hidden:false}));
  const buttons=['all','games'].map(projectFilter=>({dataset:{projectFilter},attributes:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this[k]=fn;}}));
  const nodes=new Map();const node=key=>{if(!nodes.has(key))nodes.set(key,{value:'',hidden:true,textContent:'',disabled:false,dataset:{},addEventListener(k,fn){this[k]=fn;},focus(){}});return nodes.get(key);};
  const calls=[];
  const document={hidden:false,querySelectorAll:s=>s==='[data-project-group]'?cards:buttons,querySelector:node,documentElement:{classList:{contains:k=>k==='js-motion'&&motion}}};
  if(supported)document.startViewTransition=update=>{calls.push('morph');update();};
  vm.runInNewContext(source.slice(source.indexOf('const projectCards ='),source.indexOf('const projects = {')),{document,window:{addEventListener(){}},t:x=>x});
  buttons[1].click();
  node('#project-search').value='zz';node('#project-search').input();
  return {calls,hidden:cards.map(card=>card.hidden),filtered:Object.hasOwn(node('#project-grid').dataset,'filtered')};
 };
 const smooth=run(true,true);
 assert.deepEqual(smooth.calls,['morph'],'one morph for the chip, none for typing');
 assert.deepEqual(smooth.hidden,[true,true]);assert.equal(smooth.filtered,true);
 assert.deepEqual(run(false,true).calls,[],'motion off updates directly');
 assert.deepEqual(run(true,false).hidden,[true,true],'unsupported browsers still filter');
});

test('the project count keeps its number in right-to-left languages',()=>{
 const {directionalText}=require('../language-data.js');
 const source=read('app.js');
 const cards=[['tools','Alpha'],['games','Beta']].map(([projectGroup,textContent])=>({dataset:{projectGroup},textContent,hidden:false}));
 const nodes=new Map();const node=key=>{if(!nodes.has(key))nodes.set(key,{value:'',hidden:true,textContent:'',disabled:false,dataset:{},addEventListener(k,fn){this[k]=fn;},focus(){}});return nodes.get(key);};
 const catalog={'{count} projects':'{count} مشاريع','1 project':'مشروع واحد'};
 vm.runInNewContext(source.slice(source.indexOf('const projectCards ='),source.indexOf('const projects = {')),{document:{querySelectorAll:s=>s==='[data-project-group]'?cards:[],querySelector:node},window:{addEventListener(){}},t:text=>directionalText(catalog[text]||text,'ar')});
 assert.equal(node('#project-count').textContent,'2 مشاريع');
});

test('reading direction is set before first paint and matches the language registry',()=>{
 const {LANGUAGE_NAMES}=require('../language-data.js');
 const source=read('theme.js');
 const listed=JSON.parse(source.match(/const supported=(\[[^\]]+\])/)[1].replace(/'/g,'"'));
 assert.deepEqual(listed,Object.keys(LANGUAGE_NAMES),'theme.js language list drifted from language-data.js');
 const early=source.slice(0,source.indexOf('// Apply the saved theme'));
 const run=(saved,languages)=>{const classes=new Set(),head=[];const root={classList:{add:c=>classes.add(c)},hasAttribute:()=>false};vm.runInNewContext(early,{URL,document:{documentElement:root,head:{append:el=>head.push(el)},createElement:()=>({dataset:{}}),currentScript:{src:'https://example.com/theme.js?v=test'}},localStorage:{getItem:()=>saved},navigator:{languages}});run.last={classes,head};return root.lang+'/'+root.dir;};
 assert.equal(run('ar',['en-US']),'ar/rtl');
 assert.equal(run(null,['ur-PK','en']),'ur/rtl');
 assert.equal(run(null,['zh-TW','de-DE']),'de/ltr','Traditional Chinese is not relabelled');
 assert.equal(run('xx',['ja-JP']),'ja/ltr');
 assert.equal(run(null,['fr-CA']),'fr/ltr');
 assert(run.last.classes.has('js'),'the js class marks JavaScript-only controls as usable');
 assert.equal(run.last.head[0].src,'/locales/fr.js?v=test','an added language starts loading in <head> with the page version');
 run(null,['sk-SK']);assert.equal(run.last.head.length,0,'built-in languages need no extra request');
});
