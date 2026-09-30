const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');

function setup(hash='',clipboardFails=false){
 const nodes=new Map(),events={},opened=[],writes=[];
 const node=key=>{if(!nodes.has(key))nodes.set(key,{hidden:true,textContent:'',addEventListener(k,fn){this[k]=fn;},focus(){this.focused=true;},select(){this.selected=true;}});return nodes.get(key);};
 const dialog={open:false,addEventListener(k,fn){this['on'+k]=fn;},close(){this.open=false;this.onclose?.();}};
 const location={hash,origin:'https://example.com',pathname:'/',search:'?private-notes=do-not-share'};
 const context={URL,location,projectDialog:dialog,activeProject:null,t:x=>x,navigator:{clipboard:{async writeText(value){if(clipboardFails)throw Error('unavailable');writes.push(value);}}},
 document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener:(k,fn)=>events[k]=fn,history:{state:{existing:true},replaceState(state,title,url){location.hash=new URL(url,location.origin).hash;}}},
 showProject(id){context.activeProject=id;dialog.open=true;opened.push(id);}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../project-links.js'),'utf8'),context);
 return {node,dialog,location,context,opened,writes,events};
}

test('shared links open known project notes and closing returns to the project shelf',()=>{
 const s=setup('#project/feedcairn');assert.deepEqual(s.opened,['signal']);
 s.dialog.close();assert.equal(s.location.hash,'#projects');assert.equal(s.node('[data-project="signal"]').focused,true);
});
test('unknown and malformed links do not open arbitrary content',()=>{
 for(const hash of ['#project/__proto__','#project/discovery','#project/%E0%A4%A','#projects'])assert.deepEqual(setup(hash).opened,[]);
});
test('previous project links still open the same notes and copy the new public name',async()=>{
 for(const [oldName,newName,id] of [['khonrelay','feedcairn','signal'],['khonproof','trialkeep','proof'],['khonsolve','reasonrook','thinkroom'],['khonodds','stakeglass','market'],['khonstash','lootlatch','steam']]){
  const s=setup('#project/'+oldName);assert.deepEqual(s.opened,[id]);
  await s.node('#project-copy-link').click();assert.deepEqual(s.writes,['https://example.com/#project/'+newName]);
 }
});
test('copy links omit query parameters and use public names',async()=>{
 const s=setup('#project/feedcairn');await s.node('#project-copy-link').click();
 assert.deepEqual(s.writes,['https://example.com/#project/feedcairn']);
 assert.equal(s.node('#project-share-status').textContent,'Link copied.');
});
test('clipboard failure leaves a selectable address without claiming success',async()=>{
 const s=setup('#project/receipts-after-dark',true);await s.node('#project-copy-link').click();
 assert.equal(s.node('#project-share-address').value,'https://example.com/#project/receipts-after-dark');
 assert.equal(s.node('#project-share-address').hidden,false);assert.equal(s.node('#project-share-address').selected,true);
 assert.equal(s.node('#project-share-status').textContent,'Copy the address below.');
});
test('back or section navigation closes linked notes without overwriting the destination',()=>{
 const s=setup('#project/reasonrook');s.location.hash='#about';s.events.hashchange();
 assert.equal(s.dialog.open,false);assert.equal(s.location.hash,'#about');
});
