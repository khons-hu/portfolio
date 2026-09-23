const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function setup(){
 const nodes=new Map();
 function node(selector){
  if(!nodes.has(selector))nodes.set(selector,{textContent:'',hidden:false,open:false,scrollTop:180,attributes:{},replaceChildren(){},showModal(){this.open=true;},removeAttribute(key){delete this.attributes[key];delete this[key];},getAttribute(key){return this.attributes[key]??null;}});
  return nodes.get(selector);
 }
 const document={querySelector(selector){
  if(selector.includes('.dialog-preview-hidden'))return selector.includes('thinkroom')?{getAttribute:()=> 'assets/previews/khonsolve.webp'}:null;
  if(selector.includes('.project-info p'))return null;
  return node(selector);
 },createElement:()=>({textContent:''})};
 const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const context=vm.createContext({document,t:x=>x});
 vm.runInContext(source.slice(source.indexOf('const projects = {'),source.indexOf("window.addEventListener('portfolio:language'",source.indexOf('const projects = {'))),context);
 return {node,show:id=>vm.runInContext(`showProject(${JSON.stringify(id)})`,context)};
}
test('new project opens at the top and a source-only project clears the prior preview and demo',()=>{
 const {node,show}=setup();show('thinkroom');
 assert.equal(node('#project-dialog').scrollTop,0);
 assert.equal(node('#project-preview').hidden,false);
 assert.match(node('#project-link').href,/thinkroom/);
 node('#project-dialog').open=false;node('#project-dialog').scrollTop=240;show('calculator');
 assert.equal(node('#project-dialog').scrollTop,0);
 assert.equal(node('#project-preview').hidden,true);
 assert.equal(node('#project-preview').src,undefined);
 assert.equal(node('#project-link').hidden,true);
 assert.equal(node('#project-link').href,undefined);
 assert.match(node('#project-source').href,/Scientific-Calculator/);
});
test('rerendering an already open project preserves the reading position',()=>{
 const {node,show}=setup();show('thinkroom');node('#project-dialog').scrollTop=170;show('thinkroom');assert.equal(node('#project-dialog').scrollTop,170);
});
test('project filters select groups and refresh translated counts',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const cards=['tools','games','earlier','games'].map(projectGroup=>({dataset:{projectGroup},hidden:false}));
 const buttons=['all','tools','games','earlier'].map(projectFilter=>({dataset:{projectFilter},attributes:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this[k]=fn;}}));
 const count={textContent:''},group={hidden:true},events={};let translated=false;
 const context={document:{querySelectorAll:selector=>selector==='[data-project-group]'?cards:buttons,querySelector:selector=>selector==='#project-count'?count:group},window:{addEventListener:(key,fn)=>events[key]=fn},t:text=>translated?'Počet projektov: {count}':text};
 vm.runInNewContext(source.slice(source.indexOf('const projectCards ='),source.indexOf('const projects = {')),context);
 assert.equal(group.hidden,false);assert.equal(count.textContent,'4 projects');
 buttons[2].click();assert.deepEqual(cards.map(card=>card.hidden),[true,false,true,false]);assert.equal(buttons[2].attributes['aria-pressed'],'true');assert.equal(count.textContent,'2 projects');
 translated=true;events['portfolio:language']();assert.equal(count.textContent,'Počet projektov: 2');
 buttons[0].click();assert(cards.every(card=>!card.hidden));
});
