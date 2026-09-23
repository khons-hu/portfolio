const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {SITE_LOCALES,PROJECT_NOTES}=require('../site-locales.js');
const {LANGUAGE_NAMES,EXTRA_LOCALE_PACKS,languageDirection,directionalText}=require('../language-data.js');
const {answer,topics}=require('../guide.js');
test('all translation catalogs cover the same authored strings and all project notes',()=>{
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
 const context={SITE_LOCALES,PROJECT_NOTES,LANGUAGE_NAMES,languageDirection,directionalText,navigator:{language:'hu-HU'},localStorage:{getItem(){throw Error('blocked')},setItem:(k,v)=>written[k]=v},NodeFilter:{SHOW_TEXT:4},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail}},document:{body:{},documentElement:root,createTreeWalker:()=>({nextNode:()=>step++===0,currentNode:node}),querySelector:()=>select,querySelectorAll:()=>[]},window:{addEventListener(){},dispatchEvent(){}}};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../i18n.js'),'utf8'),context);
 assert.equal(root.lang,'hu');assert.equal(node.nodeValue,' Munkák ');
 select.value='pl';events.change();assert.equal(root.lang,'pl');assert.equal(written['khonsu-language'],'pl');assert.equal(node.nodeValue,' Projekty ');
 const api=context.window.PortfolioI18n; context.navigator.languages=['xx-XX','fr-FR','pl-PL']; assert.equal(api.choose(null),'fr'); assert.equal(api.choose('de'),'de'); assert.equal(api.choose('unsupported'),'fr'); context.navigator.languages=['ja-JP']; assert.equal(api.choose(null),'ja'); context.navigator.languages=['fi-FI']; assert.equal(api.choose(null),'en'); context.navigator.languages=['hu_HU']; assert.equal(api.choose(null),'hu');assert.equal(api.resolve('es-MX'),'es');assert.equal(api.resolve('__proto__'),'en');assert.equal(api.t('unmapped'),'unmapped');assert.equal(api.notes('new-project'),undefined);
 select.value='ar';events.change();assert.equal(root.dir,'rtl');select.value='ur';events.change();assert.equal(root.dir,'rtl');select.value='pt';events.change();assert.equal(root.dir,'ltr');
 assert.equal(api.resolve('pt-BR'),'pt');assert.equal(api.resolve('pt_PT'),'pt');assert.equal(api.resolve('zh-CN'),'zh');assert.equal(api.resolve('zh-Hans-SG'),'zh');assert.equal(api.resolve('zh-Hant-TW'),'en');assert.equal(api.resolve('zh-TW'),'en');
 context.navigator.languages=['zh-TW','en-US'];assert.equal(api.choose(null),'en');
 select.value='en';events.change();assert.equal(node.nodeValue,' Work ');
});
test('Spanish guide covers every topic and preserves private-data refusal',()=>{
 for(const topic of topics)assert(topic.es?.trim(),topic.id);
 assert.match(answer('hola','es').text,/Hola/);
 assert.match(answer('contraseña','es').text,/privad/);
 assert.match(answer('trabajo','es').text,/Customer Support Partner L2/);
});

test('pickers, page, terminal packs and guide share the complete language list',()=>{
 const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
 for(const id of ['site-language','guide-language']) {
  const select=html.match(new RegExp('<select[^>]*id="'+id+'"[^>]*>([\\s\\S]*?)</select>'))[1];
  assert.deepEqual([...select.matchAll(/value="([^"]+)"/g)].map(x=>x[1]).sort(),Object.keys(LANGUAGE_NAMES).sort(),id);
 }
 for(const [lang,pack] of Object.entries(EXTRA_LOCALE_PACKS)) {
  assert.equal(pack.guide.ui.length,13,lang);
  assert.equal(pack.contact.length,11,lang);
  assert(pack.contact[4].includes('ptr.obrtal@gmail.com'),lang);
  assert(pack.contact.every(text=>typeof text==='string'&&text.trim()),lang);
  assert.deepEqual(Object.keys(pack.guide.answers).sort(),topics.map(t=>t.id).sort(),lang);
  for(const topic of topics) assert(topic.translations?.[lang]?.trim(),lang+':'+topic.id);
  for(const text of Object.values(pack.site)) assert(!/[\u202a-\u202e\u2066-\u2069]/u.test(text),'Bidi controls must not be embedded in copy');
  assert.equal(pack.site['{count} projects'].includes('{count}'),true,lang);
  assert(pack.guide.answers.work.includes('Customer Support Partner L2'),lang);
  assert(pack.site['Now I work as a Customer Support Partner L2 at Luigi’s Box'].includes('Customer Support Partner L2'),lang);
 }
});
test('guide matches native scripts and uses the selected answer language',()=>{
 for(const [lang,query,topic] of [
  ['pt','projetos','projects'],['fr','projets','projects'],['ru','проекты','projects'],
  ['id','proyek','projects'],['ja','プロジェクトを見せて','projects'],['zh','有哪些项目？','projects'],
  ['hi','परियोजनाएं','projects'],['bn','প্রকল্প','projects'],['ar','مشاريع','projects'],['ur','منصوبے','projects']
 ]) assert.equal(answer(query,lang).text,topics.find(t=>t.id===topic).translations[lang],lang+': '+query);
 for(const [lang,query] of [['pt','senha'],['zh','密码'],['ja','パスワード'],['hi','पासवर्ड'],['ar','كلمة المرور'],['ur','پاس ورڈ'],['bn','পাসওয়ার্ড'],['fr','mot de passe'],['ru','пароль'],['id','kata sandi']])
  assert.equal(answer(query,lang).text,EXTRA_LOCALE_PACKS[lang].guide.privacy,lang);
 assert.equal(answer('blahxyz','ar').text,EXTRA_LOCALE_PACKS.ar.guide.fallback);
 assert.equal(answer('hi','hi').text,EXTRA_LOCALE_PACKS.hi.guide.greeting);
});

test('RTL display isolates technical names without changing source copy',()=>{
 const prose='يعمل مع C++ وCounter-Strike وLuigi’s Box.';
 const displayed=directionalText(prose,'ar');
 assert(displayed.includes('\u2066C++\u2069'));
 assert(displayed.includes('\u2066Counter-Strike\u2069'));
 assert(displayed.includes('\u2066Luigi’s Box.\u2069'));
 assert.equal(displayed.replace(/[\u2066\u2069]/g,''),prose);
 assert.equal(directionalText(prose,'en'),prose);
});
