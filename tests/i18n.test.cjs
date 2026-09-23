const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {SITE_LOCALES,PROJECT_NOTES}=require('../site-locales.js');
const {answer,topics}=require('../guide.js');
test('all six translation catalogs cover the same authored strings and all project notes',()=>{
 const keys=Object.keys(SITE_LOCALES.sk).sort();
 for(const [lang,strings] of Object.entries(SITE_LOCALES)){
  assert.deepEqual(Object.keys(strings).sort(),keys,lang);
  assert(Object.values(strings).every(x=>typeof x==='string'&&x.trim()));
  assert.deepEqual(Object.keys(PROJECT_NOTES[lang]).sort(),Object.keys(PROJECT_NOTES.en).sort());
  for(const [id,notes] of Object.entries(PROJECT_NOTES.en))assert.equal(PROJECT_NOTES[lang][id].length,notes.length);
 }
});
test('locale resolver, storage failure and switching preserve bindings and fallback',()=>{
 const events={},select={addEventListener:(k,v)=>events[k]=v},root={lang:''},node={nodeValue:' Work ',parentElement:{closest:()=>null}},written={};let step=0;
 const context={SITE_LOCALES,PROJECT_NOTES,navigator:{language:'hu-HU'},localStorage:{getItem(){throw Error('blocked')},setItem:(k,v)=>written[k]=v},NodeFilter:{SHOW_TEXT:4},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail}},document:{body:{},documentElement:root,createTreeWalker:()=>({nextNode:()=>step++===0,currentNode:node}),querySelector:()=>select,querySelectorAll:()=>[]},window:{addEventListener(){},dispatchEvent(){}}};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../i18n.js'),'utf8'),context);
 assert.equal(root.lang,'hu');assert.equal(node.nodeValue,' Munkák ');
 select.value='pl';events.change();assert.equal(root.lang,'pl');assert.equal(written['khonsu-language'],'pl');assert.equal(node.nodeValue,' Projekty ');
 const api=context.window.PortfolioI18n; context.navigator.languages=['fr-FR','pl-PL']; assert.equal(api.choose(null),'pl'); assert.equal(api.choose('de'),'de'); assert.equal(api.choose('unsupported'),'pl'); context.navigator.languages=['ja-JP']; assert.equal(api.choose(null),'en'); context.navigator.languages=['hu_HU']; assert.equal(api.choose(null),'hu');assert.equal(api.resolve('es-MX'),'es');assert.equal(api.resolve('__proto__'),'en');assert.equal(api.t('unmapped'),'unmapped');assert.equal(api.notes('new-project'),undefined);
 select.value='en';events.change();assert.equal(node.nodeValue,' Work ');
});
test('Spanish guide covers every topic and preserves private-data refusal',()=>{
 for(const topic of topics)assert(topic.es?.trim(),topic.id);
 assert.match(answer('hola','es').text,/Hola/);
 assert.match(answer('contraseña','es').text,/privad/);
 assert.match(answer('trabajo','es').text,/Customer Support Partner L2/);
});
