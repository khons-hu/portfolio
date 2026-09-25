const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('viewport bursts touch only open panels, once per frame, and skip unchanged sizes',()=>{
 const frames=[],events={},writes=[];
 const panels=Object.fromEntries(['terminal-dialog','guide-dialog','email-dialog'].map(id=>{
  const values={};
  return [id,{open:false,addEventListener(){},style:{getPropertyValue:k=>values[k],setProperty(k,v){values[k]=v;writes.push([id,k,v]);}}}];
 }));
 const document={getElementById:id=>panels[id],querySelectorAll:()=>[]};
 const window={addEventListener(){},visualViewport:{height:500,offsetTop:0,addEventListener:(k,fn)=>events[k]=fn}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../panels.js'),'utf8'),{document,window,t:s=>s,requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},clearTimeout(){},setTimeout(){}});
 events.scroll();assert.equal(frames.length,0);
 panels['guide-dialog'].open=true;
 events.scroll();events.resize();events.scroll();
 assert.equal(frames.length,1);frames.shift()();
 assert.equal(writes.length,2);assert(writes.every(w=>w[0]==='guide-dialog'));
 events.resize();frames.shift()();assert.equal(writes.length,2);
 window.visualViewport.height=300;
 events.resize();frames.shift()();assert.equal(writes.length,3);
});
