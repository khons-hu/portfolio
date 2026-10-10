const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function setup(){
 const nodes=new Map();
 function node(selector){
  if(!nodes.has(selector))nodes.set(selector,{textContent:'',hidden:false,open:false,scrollTop:180,attributes:{},children:[],replaceChildren(...children){this.children=children;},showModal(){this.open=true;},removeAttribute(key){delete this.attributes[key];delete this[key];},setAttribute(key,value){this.attributes[key]=String(value);},getAttribute(key){return this.attributes[key]??null;}});
  return nodes.get(selector);
 }
 const document={querySelector(selector){
  if(selector.includes('.dialog-preview-hidden'))return selector.includes('thinkroom')?{getAttribute:()=> 'assets/previews/reasonrook.webp'}:null;
  if(selector.includes('.project-info p'))return null;
  return node(selector);
 },querySelectorAll:()=>[],createElement:()=>({textContent:'',children:[],append(...children){this.children.push(...children);},setAttribute(key,value){this[key]=String(value);}})};
 const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const context=vm.createContext({document,t:x=>x});
 vm.runInContext(source.slice(source.indexOf('const projects = {'),source.indexOf("window.addEventListener('portfolio:language'",source.indexOf('const projects = {'))),context);
 return {node,show:id=>vm.runInContext(`showProject(${JSON.stringify(id)})`,context)};
}
test('new project opens at the top and a source-only project clears the prior preview and demo',()=>{
 const {node,show}=setup();show('thinkroom');
 assert.equal(node('#project-dialog').scrollTop,0);
 assert.equal(node('#project-preview').hidden,false);
 assert.equal(node('#project-link').href,'https://solve.khns.dev/');
 node('#project-dialog').open=false;node('#project-dialog').scrollTop=240;show('calculator');
 assert.equal(node('#project-dialog').scrollTop,0);
 assert.equal(node('#project-preview').hidden,true);
 assert.equal(node('#project-preview').src,undefined);
 assert.equal(node('#project-link').hidden,true);
 assert.equal(node('#project-link').href,undefined);
 assert.match(node('#project-source').href,/Scientific-Calculator/);
});
test('private project notes clear every previous public destination',()=>{
 const {node,show}=setup();
 for(const id of ['queuefolk','moonshift','moonhold','lantern-divide','feled','last-credit','pager-panic','human-loop']){
  show('thinkroom');show(id);
  assert.match(node('#project-category').textContent,/PRIVATE/,id);
  for(const selector of ['#project-link','#project-source','#project-android']){
   assert.equal(node(selector).hidden,true,`${id}: ${selector}`);
   assert.equal(node(selector).href,undefined,`${id}: stale destination`);
  }
  assert(node('#project-notes').children.length>0,id);
 }
});
test('rerendering an already open project preserves the reading position',()=>{
 const {node,show}=setup();show('thinkroom');node('#project-dialog').scrollTop=170;show('thinkroom');assert.equal(node('#project-dialog').scrollTop,170);
});
test('switching project links resets the notes to their beginning',()=>{
 const {node,show}=setup();show('thinkroom');node('#project-dialog').scrollTop=170;show('calculator');assert.equal(node('#project-dialog').scrollTop,0);
});
test('detail media have captions, local full-size targets and clear when another project opens',()=>{
 const {node,show}=setup();show('moonlight');
 const gallery=node('#project-gallery');
 assert.equal(gallery.hidden,false);
 assert.equal(gallery.children.length,11);
 let videoLinks=0;
 for(const figure of gallery.children){
  const [link,caption]=figure.children;
  const image=link.children[0];
  const mediaPath=new URL(link.href,'https://khns.dev/').pathname;
  if(mediaPath.endsWith('.mp4')){
   videoLinks++;
   assert(fs.existsSync(path.join(__dirname,'..',mediaPath)));
   assert.match(link['aria-label'],/^Watch video:/);
  }else assert.equal(image.src,link.href);
  assert.equal(link.target,'_blank');
  assert.equal(link.rel,'noopener noreferrer');
  assert.equal(image.alt,caption.textContent);
  assert(caption.textContent.length>0);
  assert(fs.existsSync(path.join(__dirname,'..',image.src)));
 }
 assert.equal(videoLinks,3);
 show('calculator');
 assert.equal(gallery.hidden,true);
 assert.equal(gallery.children.length,0);
});
function filters(){
 const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const cards=[['tools','Reasonrook Python coding'],['games','Dots React game'],['earlier','Calculator C++ Arduino'],['games','Receipts Godot game']].map(([projectGroup,textContent])=>({dataset:{projectGroup},textContent,hidden:false}));
 const buttons=['all','tools','games','earlier'].map(projectFilter=>({dataset:{projectFilter},attributes:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this[k]=fn;}}));
 const nodes=new Map();
 function node(key){if(!nodes.has(key))nodes.set(key,{value:'',hidden:true,textContent:'',disabled:false,dataset:{},addEventListener(k,fn){this[k]=fn;},focus(){this.focused=true;}});return nodes.get(key);}
 const events={};let translated=false;
 const context={document:{querySelectorAll:selector=>selector==='[data-project-group]'?cards:buttons,querySelector:node},window:{addEventListener:(key,fn)=>events[key]=fn},t:text=>translated?'Počet projektov: {count}':text};
 vm.runInNewContext(source.slice(source.indexOf('const projectCards ='),source.indexOf('const projects = {')),context);
 return {cards,buttons,node,language(){translated=true;events['portfolio:language']();},search(value){node('#project-search').value=value;node('#project-search').input();}};
}
test('project filters select groups and refresh translated counts',()=>{
 const {cards,buttons,node,language}=filters();
 assert.equal(node('.project-filters').hidden,false);assert.equal(node('#project-count').textContent,'4 projects');
 buttons[2].click();assert.deepEqual(cards.map(card=>card.hidden),[true,false,true,false]);assert.equal(buttons[2].attributes['aria-pressed'],'true');assert.equal(node('#project-count').textContent,'2 projects');
 language();assert.equal(node('#project-count').textContent,'Počet projektov: 2');
 buttons[0].click();assert(cards.every(card=>!card.hidden));
});
test('search combines words and categories, preserves C++, and recovers from no matches',()=>{
 const {cards,buttons,node,search}=filters();
 search('  C++ arduino ');assert.deepEqual(cards.map(card=>card.hidden),[true,true,false,true]);
 buttons[2].click();assert(cards.every(card=>card.hidden));assert.equal(node('#project-empty').hidden,false);
 node('#project-reset').click();assert(cards.every(card=>!card.hidden));assert.equal(node('#project-search').value,'');assert.equal(node('#project-search').focused,true);
 search('games');assert.deepEqual(cards.map(card=>card.hidden),[true,false,true,false]);
 search('PYTHON');assert.equal(cards[0].hidden,false);assert.equal(node('#project-count').textContent,'1 project');
 node('#project-search-clear').click();assert(cards.every(card=>!card.hidden));assert.equal(node('#project-search-clear').disabled,true);
 search('<script>alert(1)</script>');assert(cards.every(card=>card.hidden));
});
test('search matches translated text without accents and keeps original technology terms',()=>{
 const {cards,search,language}=filters();
 cards[0].textContent='Cvičenia na kód';language();search('cvicenia');assert.equal(cards[0].hidden,false);
 search('python');assert.equal(cards[0].hidden,false);
});
