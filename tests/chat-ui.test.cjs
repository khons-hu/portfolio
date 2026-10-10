const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const {LANGUAGE_NAMES}=require('../language-data.js');
const {PROJECT_NOTES}=require('../site-locales.js');
const CHAT_COPY=require('../chat-copy.js');
const {answer,tidy,rankProjectResults}=require('../guide.js');
const languages=Object.keys(LANGUAGE_NAMES);

test('model replies stay plain text: Markdown markers are removed, never rendered',()=>{
 const reply='Here is a rundown:\n\n**1. Spotify tool**  \nA local script.\n\n- first\n* second\n## Heading\n| Project | Stack |\n|---|---|\n| Dots | React |\n\n---\n\nSee `guide.js` or [the site](https://khons-hu.vercel.app).';
 assert.equal(tidy(reply),'Here is a rundown:\n\n1. Spotify tool\nA local script.\n\n• first\n• second\nHeading\nProject · Stack\nDots · React\n\nSee guide.js or the site (https://khons-hu.vercel.app).');
 for(const plain of ['C++ and Counter-Strike got me started.','2 * 3 * 4 = 24','<b>not markup</b> & stays literal','Customer Support Partner L2 at Luigi’s Box.'])assert.equal(tidy(plain),plain);
 assert.equal(tidy('a\n\n\n\nb  '),'a\n\nb');
});

test('the guide no longer describes itself as local-only in any language',()=>{
 const html=read('index.html');
 assert.doesNotMatch(html,/not an AI model|NO API|NO CHAT STORAGE/);
 assert.match(html,/<span id="guide-status" class="sr-only" role="status"/);
 assert.equal(languages.length,17);
 for(const language of languages){
  const note=PROJECT_NOTES[language].portfolio[0];
  assert.match(note,/Groq/,`${language} portfolio note`);
  assert.doesNotMatch(note,/API/,`${language} portfolio note`);
  const site=answer('this site',language).text;
  assert.match(site,/Groq/,`${language} site answer`);
 }
 assert.match(read('app.js'),/a small guide in multiple languages\. It answers with an AI model through Groq/);
});

test('waiting states never loop and busy controls stay focusable',()=>{
 const css=read('style.css'),guide=read('guide.js');
 assert.doesNotMatch(css,/infinite/);
 assert.match(css,/\.js-motion \.guide-message\.pending\{animation:[^}]*\.3s both\}/);
 assert.match(css,/\.guide-message p\{[^}]*white-space:pre-line/);
 assert.doesNotMatch(guide,/submit\.disabled/);
 assert.match(guide,/setAttribute\('aria-disabled'/);
});

test('follow-ups respect the server spacing instead of triggering a refusal',()=>{
 const server=read('api/chat.js'),guide=read('guide.js');
 const serverGap=Number(server.match(/now-\(recent\.get\(key\)\|\|0\)<(\d+)/)[1]);
 const clientGap=Number(guide.match(/SPACING=(\d+)/)[1]);
 assert(clientGap>serverGap,`client spacing ${clientGap} must exceed server spacing ${serverGap}`);
 assert.match(server,/Retry-After/);
 assert.match(guide,/headers\.get\('Retry-After'\)/);
});

test('prepared project answers choose relevant fallback recommendations',()=>{
 assert.deepEqual(answer('Recommend a coding project','en').recommendations,['thinkroom','proof','calculator']);
 assert.deepEqual(answer('Recommend agent projects','en').recommendations,['proof','signal','thinkroom']);
 assert.deepEqual(answer('Show me game projects','en').recommendations,['receipts','dots','save-democracy']);
 assert.deepEqual(answer('Show me projects','en').recommendations,['proof','signal','thinkroom','market']);
 const guide=read('guide.js');
 assert.match(guide,/aria-roledescription','carousel'/);
 assert.match(guide,/join\(' · '\)/,'project metadata keeps a readable separator');
 assert.match(guide,/CHAT_COPY\.offline\?\.\[lang\.value\]/,'unavailable AI state is described accurately in every supported language');
 assert.match(read('style.css'),/scroll-snap-type:x mandatory/);
 assert.match(read('style.css'),/\.guide-recommendation-track\{[^}]*overflow-x:auto[^}]*scroll-snap-type:x mandatory/);
});

test('private project recommendations and comparisons keep notes without external links',()=>{
 const element=tagName=>({tagName,children:[],dataset:{},attributes:{},events:{},
  append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},
  setAttribute(name,value){this.attributes[name]=String(value);},addEventListener(name,callback){this.events[name]=callback;}
 });
 const descendants=node=>[node,...node.children.flatMap(descendants)];
 const byClass=(node,name)=>descendants(node).filter(child=>child.className===name);
 const project=(id,href)=>({
  querySelector(selector){return {
   '.project-details':{dataset:{project:id}},'.project-info h3':{textContent:id},
   '.project-info p':{textContent:`Notes about ${id}`},
   '.project-live':href===undefined?null:{href,textContent:'View source ↗',dataset:{kind:'source'}}
  }[selector];},
  querySelectorAll(){return [{textContent:href===undefined?'PRIVATE PROTOTYPE':'PUBLIC PROJECT'},{textContent:'JavaScript'}];}
 });
 const opened=[],dialog={close(){}},cards=[project('private'),project('public','https://example.com/source')];
 const source=read('guide.js'),start=source.indexOf('  function renderRecommendations('),end=source.indexOf('  // A reply taller',start);
 assert(start>=0&&end>start);
 const context={CHAT_COPY,URL,location:{href:'https://example.com/'},dialog,busy:false,
  localeData:{languageDirection:()=> 'ltr',directionalText:text=>text},
  document:{querySelectorAll:()=>cards,createElement:element,createDocumentFragment:()=>element('fragment'),createTextNode:text=>({...element('text'),textContent:text})},
  window:{PortfolioProjects:{open:id=>opened.push(id)}},requestAnimationFrame:callback=>callback(),reveal(){}
 };
 require('node:vm').runInNewContext(source.slice(start,end),context);
 const row=element('div');context.renderRecommendations(row,['private','public'],'en');
 const slides=byClass(row,'guide-recommendation-card');
 assert.equal(slides.length,2,'a private card without an outside link stays recommended');
 assert.equal(descendants(slides[0]).filter(node=>node.tagName==='a').length,0);
 const publicLink=descendants(slides[1]).find(node=>node.tagName==='a');
 assert.equal(publicLink.href,'https://example.com/source');
 assert.equal(publicLink.target,'_blank');assert.equal(publicLink.rel,'noopener noreferrer');
 byClass(slides[0],'guide-recommendation-notes')[0].events.click();
 assert.deepEqual(opened,['private']);
 byClass(row,'guide-recommendation-compare-toggle').forEach(toggle=>toggle.events.click());
 const compare=byClass(row,'guide-recommendation-compare')[0];assert.equal(compare.disabled,false);compare.events.click();
 const comparison=byClass(row,'guide-comparison')[0];assert.equal(comparison.hidden,false);
 const actions=byClass(comparison,'guide-comparison-actions');assert.equal(actions.length,4,'table and compact comparison both render');
 for(const [index,action] of actions.entries()){
  const links=descendants(action).filter(node=>node.tagName==='a');
  assert.equal(links.length,index%2,`only the public project has an external link in action ${index}`);
  if(links.length)assert.equal(links[0].href,'https://example.com/source');
 }
 byClass(actions[0],'guide-comparison-notes')[0].events.click();assert.deepEqual(opened,['private','private']);
 for(const href of ['http://example.com/','javascript:alert(1)','https://[invalid','']){
  cards.splice(0,cards.length,project('invalid',href));
  const invalidRow=element('div');
  assert.doesNotThrow(()=>context.renderRecommendations(invalidRow,['invalid'],'en'));
  assert.equal(invalidRow.children.length,0,`reject the supplied invalid/non-HTTPS URL: ${href}`);
 }
});

test('project autocomplete ranks local card facts without matching every keystroke to Groq',()=>{
 const projects=[
  {id:'proof',title:'Trialkeep',summary:'Agent decision evaluation',meta:'JavaScript · Browser tasks'},
  {id:'signal',title:'Feedcairn',summary:'AI news and releases',meta:'TypeScript · RSS / Atom'},
  {id:'dots',title:'Dots',summary:'A small React game',meta:'React · Spring Boot'}
 ];
 assert.deepEqual(rankProjectResults(projects,'feedcairn').map(item=>item.id),['signal']);
 assert.deepEqual(rankProjectResults(projects,'rss atom').map(item=>item.id),['signal']);
 assert.equal(rankProjectResults(projects,'dots').at(0).id,'dots');
 assert.deepEqual(rankProjectResults(projects,'no such project'),[]);
 assert.deepEqual(rankProjectResults(projects,''),[]);
 assert.equal(rankProjectResults(projects,'agent',1).length,1);
 const html=read('index.html'),guide=read('guide.js');
 assert.match(html,/role="combobox" aria-autocomplete="list"/);
 assert.match(html,/role="listbox"/);
 assert.match(guide,/projectSearch\.addEventListener\('keydown'/);
 assert.match(guide,/aria-activedescendant/);
});

test('guided AI path and comparison copy cover every supported chatbot language',()=>{
 const featureCopy=CHAT_COPY.assistant;
 assert.deepEqual(Object.keys(featureCopy).sort(),languages.slice().sort());
 for(const language of languages){
  const copy=featureCopy[language];
  for(const key of ['searchLabel','searchPlaceholder','searchEmpty','pathLaunch','pathTitle','pathQuestion','pathBack','compareProject','compareHint','compareExplain','compareFallback'])assert(copy[key],`${language}.${key}`);
  assert.equal(copy.pathSubjects.length,3,`${language} subject options`);
  assert.equal(copy.pathAngles.length,3,`${language} branch options`);
  assert(copy.pathAngles.every(options=>options.length===2),`${language} branch choices`);
  assert.equal(copy.compareRows.length,3,`${language} comparison rows`);
  assert.equal(copy.pathFallback.length,3,`${language} prepared path answers`);
 }
 const guide=read('guide.js'),html=read('index.html'),css=read('style.css');
 assert.match(html,/id="guide-path-open"/);
 assert.match(guide,/Explain how RAG retrieves and reranks source chunks/);
 assert.match(guide,/Compare only these public portfolio projects/);
 assert.match(css,/\.guide-comparison-table/);
 assert.match(css,/\.guide-searching \.guide-path-launch/);
});
