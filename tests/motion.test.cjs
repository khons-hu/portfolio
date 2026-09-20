const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8').split("document.addEventListener('visibilitychange'")[0];
function setup(reduced){
 const classes=new Set(),attrs={},saved={};let click,change;
 const button={setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,f)=>click=f};
 const media={matches:reduced,addEventListener:(k,f)=>change=f};
 vm.runInNewContext(source,{document:{documentElement:{classList:{toggle:(k,v)=>v?classes.add(k):classes.delete(k)}},querySelector:()=>button},matchMedia:()=>media,localStorage:{getItem:()=>null,setItem:(k,v)=>saved[k]=v}});
 return {button,classes,attrs,saved,click,media,change};
}
test('motion control remains usable under system reduced motion without enabling animation',()=>{
 const x=setup(true);assert.equal(x.button.disabled,false);assert.match(x.button.textContent,/system.*reduced/);
 x.click();assert.equal(x.button.textContent,'Motion: off');assert.equal(x.saved['khonsu-motion'],'off');
 x.click();assert.match(x.button.textContent,/system.*reduced/);assert(x.classes.has('motion-off'));assert(!x.classes.has('js-motion'));
 x.media.matches=false;x.change();assert(!x.classes.has('motion-off'));assert(x.classes.has('js-motion'));
});
test('motion off and system toggle normally and persist',()=>{
 const x=setup(false);assert(x.classes.has('js-motion'));x.click();assert(x.classes.has('motion-off'));x.click();assert(x.classes.has('js-motion'));assert.equal(x.saved['khonsu-motion'],'system');
});
