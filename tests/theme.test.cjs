const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup({reduced=false,off=false,saved='dark',storageFails=false}={}){
 const classes=new Set(off?['motion-off']:[]),events={},windowEvents={},clicks={},attributes={},stored={};let timer,changes=0;
 const root={dataset:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}};
 const button={addEventListener:(k,f)=>clicks[k]=f,setAttribute:(k,v)=>attributes[k]=v,removeAttribute:k=>delete attributes[k],getAttribute:k=>attributes[k]};
 const context={document:{documentElement:root,body:{offsetWidth:1200},hidden:false,querySelector:s=>s==='#theme-toggle'?button:{setAttribute(){}},addEventListener:(k,f)=>events[k]=f},window:{addEventListener:(k,f)=>windowEvents[k]=f},matchMedia:q=>({matches:q.includes('reduced')?reduced:false,addEventListener(){}}),localStorage:{getItem(){if(storageFails)throw Error();return saved;},setItem(k,v){if(storageFails)throw Error();stored[k]=v;}},setTimeout:f=>(timer=f,1),clearTimeout(){timer=null;}};
 vm.runInNewContext(fs.readFileSync('theme.js','utf8'),context);events.DOMContentLoaded();
 return {root,classes,stored,attributes,context,click:()=>clicks.click(),tick:()=>{const f=timer;timer=null;f?.();},storage:value=>windowEvents.storage({key:'khonsu-theme',newValue:value})};
}
test('normal motion switches, animates, persists and cleans up',()=>{const x=setup();x.click();assert.equal(x.root.dataset.theme,'light');assert(x.classes.has('theme-changing'));assert.equal(x.stored['khonsu-theme'],'light');assert.equal(x.attributes['aria-label'],'Switch to dark mode');x.tick();assert(!x.classes.has('theme-changing'));assert.equal(x.attributes['aria-busy'],undefined);});
test('rapid even clicks are queued rather than dropped',()=>{const x=setup();x.click();x.click();assert.equal(x.root.dataset.theme,'light');assert.equal(x.stored['khonsu-theme'],'dark');x.tick();assert.equal(x.root.dataset.theme,'dark');x.tick();assert.equal(x.attributes['aria-busy'],undefined);});
test('rapid odd clicks settle to final requested theme',()=>{const x=setup();x.click();x.click();x.click();x.tick();assert.equal(x.root.dataset.theme,'light');assert.equal(x.attributes['aria-busy'],undefined);});
for(const mode of [{reduced:true},{off:true}])test('motion preference suppresses effect but preserves queued switching '+JSON.stringify(mode),()=>{const x=setup(mode);x.click();x.click();assert(!x.classes.has('theme-changing'));x.tick();assert.equal(x.root.dataset.theme,'dark');});
test('storage events keep tabs in sync and invalid preference follows system',()=>{const x=setup();x.storage('light');assert.equal(x.root.dataset.theme,'light');x.storage(null);assert.equal(x.root.dataset.theme,'dark');});
test('unavailable storage does not break toggle',()=>{const x=setup({storageFails:true});x.click();assert.equal(x.root.dataset.theme,'light');x.tick();});
