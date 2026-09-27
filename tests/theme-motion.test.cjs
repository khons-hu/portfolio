// Theme sweep and motion language: behaviour under rapid toggles, cancellation, fallbacks and offscreen toggles.
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));

function page({fine=true,forced=false,reduced=false,vt=true,vtThrows=false,rect={left:1000,top:20,width:38,height:38},size=[1280,800],dir='ltr'}={}){
 const classes=new Set(forced?['motion-force-on']:[]),props={},events={},windowEvents={},clicks={},attributes={},timers=new Map(),transitions=[];let nextTimer=1;
 const root={dir,dataset:{},style:{setProperty:(k,v)=>props[k]=v},classList:{add:(...x)=>x.forEach(c=>classes.add(c)),remove:(...x)=>x.forEach(c=>classes.delete(c)),contains:x=>classes.has(x)}};
 const button={textContent:'',addEventListener:(k,f)=>clicks[k]=f,setAttribute:(k,v)=>attributes[k]=v,removeAttribute:k=>delete attributes[k],getAttribute:k=>attributes[k],getBoundingClientRect:()=>rect};
 const document={documentElement:root,body:{offsetWidth:1},hidden:false,querySelector:s=>s==='#theme-toggle'?button:{setAttribute(){}},addEventListener:(k,f)=>events[k]=f};
 // A browser runs the update callback after capturing the old view, then resolves `finished` when the animation ends.
 if(vt)document.startViewTransition=update=>{
  if(vtThrows)throw Error('InvalidStateError');
  let done;const t={skipped:false,ran:false,finished:new Promise(resolve=>done=resolve),
   run(){if(!t.ran){t.ran=true;update();}},end(){t.run();done();},skipTransition(){t.skipped=true;t.run();done();}};
  transitions.push(t);return t;};
 const media=q=>({matches:q.includes('reduced')?reduced:q.includes('pointer')?fine:false,addEventListener(k,f){if(q.includes('reduced'))events.reduced=f;}});
 const context={document,window:{addEventListener:(k,f)=>windowEvents[k]=f},matchMedia:media,innerWidth:size[0],innerHeight:size[1],
  localStorage:{getItem:key=>key==='khonsu-language'?(dir==='rtl'?'ar':'en'):'dark',setItem(){}},setTimeout:f=>{const id=nextTimer++;timers.set(id,f);return id;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(read('theme.js'),context);events.DOMContentLoaded();
 return {root,classes,props,attributes,transitions,document,
  click:()=>clicks.click(),theme:()=>root.dataset.theme,
  motion(off){off?classes.add('motion-off'):classes.delete('motion-off');windowEvents['portfolio:motion']?.();},
  hide(){document.hidden=true;events.visibilitychange();},
  timeout(){const due=[...timers.values()];timers.clear();due.forEach(f=>f());},
  effects:()=>['theme-changing','theme-fade','theme-sweep'].filter(c=>classes.has(c))};
}

test('a sweep reveals the chosen theme from the toggle and cleans up when it finishes',async()=>{
 const p=page();p.click();
 assert.deepEqual(p.effects(),['theme-changing','theme-sweep']);
 assert.equal(p.props['--theme-x'],'1019px');assert.equal(p.props['--theme-y'],'39px');
 assert(Number.parseInt(p.props['--theme-r'])>=Math.hypot(1019,800-39),'the disc reaches the farthest corner');
 assert.equal(p.theme(),'dark','the old view is captured before the theme changes');
 p.transitions[0].run();assert.equal(p.theme(),'light');
 p.transitions[0].end();await flush();
 assert.deepEqual(p.effects(),[]);assert.equal(p.attributes['aria-busy'],undefined);
});

test('rapid toggles settle on the final choice with at most one follow-up sweep',async()=>{
 const odd=page();odd.click();odd.click();odd.click();
 assert.equal(odd.transitions.length,1,'clicks during a sweep are queued, not stacked');
 odd.transitions[0].end();await flush();
 assert.equal(odd.theme(),'light');assert.equal(odd.transitions.length,1);assert.deepEqual(odd.effects(),[]);
 const even=page();even.click();even.click();
 even.transitions[0].end();await flush();
 assert.equal(even.transitions.length,2,'the page returns to the final choice with one more sweep');
 even.transitions[1].end();await flush();
 assert.equal(even.theme(),'dark');assert.deepEqual(even.effects(),[]);
});

test('Motion Off mid-sweep skips it and shows the latest choice at once',async()=>{
 const p=page();p.click();p.click();
 p.motion(true);
 assert(p.transitions[0].skipped);assert.equal(p.theme(),'dark','the latest choice, not the cancelled target');
 assert.deepEqual(p.effects(),[]);assert.equal(p.attributes['aria-busy'],undefined);
 p.click();assert.equal(p.theme(),'light','with motion off the switch is immediate');
 assert.equal(p.transitions.length,1);assert.deepEqual(p.effects(),[]);
});

test('a hidden tab ends a running sweep',()=>{
 const p=page();p.click();p.hide();
 assert(p.transitions[0].skipped);assert.equal(p.theme(),'light');assert.deepEqual(p.effects(),[]);
});

test('a stale completion cannot end a newer sweep',async()=>{
 const p=page();p.click();p.motion(true);p.motion(false);
 p.click();assert.equal(p.transitions.length,2);
 await flush();// the skipped first sweep resolves now
 assert.deepEqual(p.effects(),['theme-changing','theme-sweep'],'the second sweep keeps running');
 p.transitions[1].end();await flush();assert.deepEqual(p.effects(),[]);assert.equal(p.theme(),'dark');
});

test('a sweep that never finishes is skipped by the safety limit',()=>{
 const p=page();p.click();p.transitions[0].run();p.timeout();
 assert(p.transitions[0].skipped);assert.deepEqual(p.effects(),[]);assert.equal(p.theme(),'light');
});

test('without View Transitions, or when one refuses to start, colours fade and the theme still changes',()=>{
 for(const options of [{vt:false},{vtThrows:true}]){
  const p=page(options);p.click();
  assert.equal(p.theme(),'light',JSON.stringify(options));assert.deepEqual(p.effects(),['theme-changing','theme-fade']);
  p.timeout();assert.deepEqual(p.effects(),[]);
 }
});

test('touch on System keeps only the arc; explicit Motion On brings the sweep to touch and reduced-motion systems',()=>{
 const touch=page({fine:false});touch.click();
 assert.deepEqual(touch.effects(),['theme-changing']);assert.equal(touch.transitions.length,0);assert.equal(touch.theme(),'light');
 const touchOn=page({fine:false,forced:true});touchOn.click();assert.equal(touchOn.transitions.length,1);
 const reduced=page({reduced:true});reduced.click();assert.deepEqual(reduced.effects(),[]);assert.equal(reduced.transitions.length,0);assert.equal(reduced.theme(),'light');
 const reducedOn=page({reduced:true,forced:true});reducedOn.click();assert.equal(reducedOn.transitions.length,1);
});

test('an offscreen toggle still starts the disc inside the viewport',()=>{
 const scrolled=page({rect:{left:1000,top:-2400,width:38,height:38}});scrolled.click();
 assert.equal(scrolled.props['--theme-x'],'1019px','in line with the toggle');assert.equal(scrolled.props['--theme-y'],'24px');
 const wide=page({rect:{left:5000,top:5000,width:38,height:38},size:[390,700]});wide.click();
 assert.equal(wide.props['--theme-x'],'366px');assert.equal(wide.props['--theme-y'],'676px');
 const rtl=page({rect:{left:0,top:0,width:0,height:0},dir:'rtl',size:[390,700]});rtl.click();
 assert.equal(rtl.props['--theme-x'],'24px','no box: the reading-direction end of the top edge');
});

test('changing the Motion setting notifies running effects',()=>{
 const source=read('app.js').split("document.addEventListener('visibilitychange'")[0];
 const sent=[],classes=new Set();let click;
 class CustomEvent{constructor(type,init){this.type=type;this.detail=init?.detail;}}
 vm.runInNewContext(source,{CustomEvent,window:{dispatchEvent:event=>sent.push(event)},document:{documentElement:{classList:{toggle:(k,v)=>v?classes.add(k):classes.delete(k)}},querySelector:()=>({setAttribute(){},addEventListener:(k,f)=>click=f})},matchMedia:()=>({matches:false,addEventListener(){}}),localStorage:{getItem:()=>null,setItem(){}}});
 click();click();
 assert.deepEqual(sent.map(e=>[e.type,e.detail.disabled,e.detail.forced]),[['portfolio:motion',false,false],['portfolio:motion',false,true],['portfolio:motion',true,false]]);
});

test('replay steps settle in their direction only when motion is allowed',()=>{
 const {mount}=require('../field-notes.js');
 const run=motion=>{
  const nodes=new Map(),calls=[];
  const node=id=>{if(!nodes.has(id))nodes.set(id,{id,textContent:'',hidden:true,disabled:false,dataset:{},events:{},addEventListener(k,f){this.events[k]=f;},replaceChildren(){},append(){},animate(frames){calls.push([id,frames[0].transform]);}});return nodes.get(id);};
  const doc={documentElement:{classList:{contains:c=>motion&&c==='js-motion'}},querySelector:node,getElementById:node,querySelectorAll:()=>[],createElement:()=>({append(){}})};
  mount(doc);const before=calls.length;
  node('#replay-next').events.click();const forward=calls.slice(before);
  node('#replay-prev').events.click();const back=calls.slice(before+forward.length);
  node('#replay-prev').events.click();
  return {before,forward,back,total:calls.length};
 };
 const on=run(true);
 assert.equal(on.before,0,'the first render does not animate');
 assert.deepEqual(on.forward.map(c=>c[0]),['#replay-title','#replay-copy','#replay-evidence']);
 assert(on.forward.every(c=>c[1]==='translateX(8px)'));assert(on.back.every(c=>c[1]==='translateX(-8px)'));
 assert.equal(on.total,6,'staying on the first step does not animate');
 assert.equal(run(false).total,0);
});

test('Motion Off, a hidden tab and a new step cancel replay animations; a hidden tab starts none',()=>{
 const {mount}=require('../field-notes.js');
 const nodes=new Map(),made=[],listeners={},classes=new Set(['js-motion']);
 const node=id=>{if(!nodes.has(id))nodes.set(id,{id,textContent:'',hidden:true,disabled:false,dataset:{},events:{},addEventListener(k,f){this.events[k]=f;},replaceChildren(){},append(){},animate(){const a={cancelled:false,cancel(){a.cancelled=true;}};made.push(a);return a;}});return nodes.get(id);};
 const doc={hidden:false,documentElement:{classList:{contains:c=>classes.has(c)}},defaultView:{addEventListener:(k,f)=>listeners[k]=f},addEventListener:(k,f)=>listeners[k]=f,
  querySelector:node,getElementById:node,querySelectorAll:()=>[],createElement:()=>({append(){}})};
 mount(doc);const next=()=>node('#replay-next').events.click();
 next();const first=made.slice();assert.equal(first.length,3);
 next();assert(first.every(a=>a.cancelled),'a new step replaces the previous settle');
 const second=made.slice(3);
 classes.delete('js-motion');listeners['portfolio:motion']();
 assert(second.every(a=>a.cancelled),'Motion Off stops it at once');
 next();assert.equal(made.length,6,'no new animation while motion is off');
 classes.add('js-motion');next();const third=made.slice(6);assert.equal(third.length,3);
 doc.hidden=true;listeners.visibilitychange();assert(third.every(a=>a.cancelled),'a hidden tab stops it');
 node('#replay-prev').events.click();assert.equal(made.length,9,'a hidden tab starts nothing');
});
