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
test('system reduced remains accessible and explicit On can override it',()=>{
 const x=setup(true);assert.match(x.button.textContent,/system.*reduced/);assert(x.classes.has('motion-off'));
 x.click();assert.equal(x.button.textContent,'Motion: on');assert(!x.classes.has('motion-off'));assert(x.classes.has('motion-force-on'));
 x.click();assert.equal(x.button.textContent,'Motion: off');assert(x.classes.has('motion-off'));
 x.click();assert.match(x.button.textContent,/system.*reduced/);assert.equal(x.saved['khonsu-motion'],'system');
});
test('system, on and off cycle normally and persist',()=>{
 const x=setup(false);assert(x.classes.has('js-motion'));x.click();assert(x.classes.has('motion-force-on'));x.click();assert(x.classes.has('motion-off'));x.click();assert(x.classes.has('js-motion'));assert.equal(x.saved['khonsu-motion'],'system');
});
