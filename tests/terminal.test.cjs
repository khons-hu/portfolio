const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {EXTRA_LOCALE_PACKS}=require('../language-data.js');

class Element {
 constructor(tag='div',text=''){this.tag=tag;this.text=text;this.children=[];this.events={};this.value='';this.open=true;this.hidden=false;}
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
function setup(){
 const nodes=new Map(),opened=[],panels=[];
 const node=key=>{if(!nodes.has(key))nodes.set(key,new Element());return nodes.get(key);};
 const projects={signal:{title:'Khonrelay',live:true,url:'https://example.com/relay'},dots:{title:'Dots',live:true,url:'https://example.com/dots'}};
 const cards=Object.keys(projects).map(id=>({dataset:{project:id},querySelector:()=>new Element('p',id+' description')}));
 const context=vm.createContext({projects,EXTRA_LOCALE_PACKS,t:value=>value,PortfolioI18n:{language:'en'},matchMedia:()=>({matches:false}),showProject:id=>opened.push(id),
 document:{querySelector:node,querySelectorAll:selector=>selector==='[data-project]'?cards:[],addEventListener(){},createElement:tag=>new Element(tag),createTextNode:text=>new Element('text',text)},
 window:{PortfolioPanels:{open:(...args)=>panels.push(args)}}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../terminal.js'),'utf8'),context);
 return {context,node,opened,panels,run:context.run,key(key){let prevented=false;node('#command').events.keydown({key,shiftKey:false,preventDefault(){prevented=true;}});return prevented;}};
}
test('terminal completes project names and offers bounded clickable suggestions',()=>{
 const s=setup();s.node('#command').value='open khonre';s.node('#command').events.input();
 assert.equal(s.node('#terminal-suggestions').textContent,'open khonrelay');assert(s.key('Tab'));
 assert.equal(s.node('#command').value,'open khonrelay');s.run(s.node('#command').value);assert.deepEqual(s.opened,['signal']);
 s.node('#command').value='o';s.node('#command').events.input();assert(s.node('#terminal-suggestions').children.length<=5);
});
test('project results open notes rather than navigating away',()=>{
 const s=setup();s.run('projects');
 const entry=s.node('#terminal-output').children[0];const list=entry.children.find(child=>child.className==='terminal-projects');
 assert.equal(list.children.length,2);assert.match(list.children[0].textContent,/Khonrelay.*signal description/);
 list.children[0].events.click();assert.deepEqual(s.opened,['signal']);
});
test('history restores an unfinished command and clear empties output and history',()=>{
 const s=setup();s.run('about');s.node('#command').value='unfinished';s.key('ArrowUp');assert.equal(s.node('#command').value,'about');
 s.key('ArrowDown');assert.equal(s.node('#command').value,'unfinished');s.run('clear');
 assert.equal(s.node('#terminal-output').children.length,0);assert.equal(vm.runInContext('history.length',s.context),0);
});
test('ask and email only switch panels and unknown input remains inert',()=>{
 const s=setup();s.run('ask');s.run('email');assert.deepEqual(s.panels,[['guide-dialog'],['email-dialog','input[type="email"]']]);
 for(const input of ['constructor','__proto__','open constructor','<img src=x onerror=alert(1)>'])assert.doesNotThrow(()=>s.run(input));
 assert.equal(s.opened.length,0);assert.match(s.node('#terminal-output').textContent,/<img src=x onerror=alert\(1\)>/);
});
test('output and history stay bounded during a long session',()=>{
 const s=setup();for(let i=0;i<80;i++)s.run('lore');
 assert.equal(s.node('#terminal-output').children.length,40);assert.equal(vm.runInContext('history.length',s.context),60);
});
