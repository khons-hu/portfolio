const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const css=read('style.css');
const app=read('app.js');

function header(){
 const observers=[];
 class IntersectionObserver{constructor(callback,options={}){this.callback=callback;this.options=options;this.targets=[];observers.push(this);}observe(target){this.targets.push(target);}unobserve(){}disconnect(){}}
 const classes=new Set();
 const link=href=>({href,attributes:{},getAttribute(key){return key==='href'?href:this.attributes[key];},setAttribute(key,value){this.attributes[key]=value;},removeAttribute(key){delete this.attributes[key];}});
 const links=['#projects','#about','#contact'].map(link);
 const siteHeader={querySelectorAll:selector=>selector==='nav a[href^="#"]'?links:[]};
 const sections=['','projects','field-notes','about','shipped','now','contact'].map(id=>({id}));
 const prepended=[];
 const document={
  documentElement:{classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key),contains:key=>classes.has(key)}},
  body:{prepend:node=>prepended.push(node)},
  createElement:()=>({attributes:{},setAttribute(key,value){this.attributes[key]=value;}}),
  querySelector:selector=>selector==='.site-header'?siteHeader:null,
  querySelectorAll:selector=>selector==='main>section'?sections:[]
 };
 const source=app.slice(app.indexOf('// Moonlit header'));
 vm.runInNewContext(source,{document,IntersectionObserver,window:{IntersectionObserver},matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>fn()});
 const current=()=>links.filter(item=>item.attributes['aria-current']==='true').map(item=>item.href);
 return {observers,classes,links,prepended,sections,current};
}

test('the header turns to glass from an observer, never a scroll handler',()=>{
 assert.doesNotMatch(app,/addEventListener\(\s*['"]scroll['"]/,'no scroll listener anywhere in app.js');
 assert.notEqual(app.indexOf('// Moonlit header'),-1,'the header block is marked for this test');
 const h=header();
 assert.equal(h.prepended.length,1,'one sentinel at the top of the page');
 assert.equal(h.prepended[0].attributes['aria-hidden'],'true');
 const stuck=h.observers.find(observer=>observer.targets.includes(h.prepended[0]));
 assert(stuck,'the sentinel is observed');
 stuck.callback([{isIntersecting:false}]);assert(h.classes.has('header-stuck'),'glass once the page moves under the header');
 stuck.callback([{isIntersecting:true}]);assert(!h.classes.has('header-stuck'),'clear again at the top');
});

test('the nav marks the section in view, grouping work and personal sections',()=>{
 const h=header();
 const view=h.observers.find(observer=>h.sections.every(section=>observer.targets.includes(section)));
 assert(view,'every section is observed');
 assert.match(view.options.rootMargin,/%/,'a thin band across the viewport decides the section');
 const show=id=>{view.callback([{isIntersecting:true,target:{id}}]);return h.current();};
 assert.deepEqual(show('projects'),['#projects']);
 assert.deepEqual(show('field-notes'),['#projects'],'field notes belong to Work');
 assert.deepEqual(show('about'),['#about']);
 assert.deepEqual(show('shipped'),['#about']);
 assert.deepEqual(show('now'),['#about'],'the desk notes belong to About');
 assert.deepEqual(show('contact'),['#contact']);
 assert.deepEqual(show(''),[],'nothing is marked over the hero');
});

test('the header is fixed and gains glass only when stuck, with a folding nav on phones',()=>{
 assert.match(css,/\.site-header\{position:fixed;/);
 assert.match(css,/html\.header-stuck \.site-header\{[^}]*backdrop-filter:blur/);
 assert.match(css,/html\{[^}]*scroll-padding-top:calc\(var\(--header-stuck-h\)/,'anchors land below the stuck header');
 assert.match(css,/html\.header-stuck \.site-header nav\{height:0;overflow:hidden\}/);
 assert.match(css,/html\.header-stuck \.site-header:focus-within nav\{height:auto/,'keyboard focus unfolds the section links');
 assert.match(css,/\.site-header nav a\[aria-current\]::after/);
});

test('each section label carries a moon that waxes down the page',()=>{
 const order=['projects','field-notes','about','shipped','now','contact'];
 const phases=order.map(id=>{const match=css.match(new RegExp(`#${id}\\{--phase:(-?[\\d.]+)px\\}`));assert(match,`${id} has a phase`);return Number(match[1]);});
 for(let i=1;i<phases.length;i++)assert(phases[i]<phases[i-1],`${order[i]} is fuller than ${order[i-1]}`);
 assert(phases.at(-1)<=-9,'a full moon at Contact');
 for(const id of order)assert(html(id),`#${id} exists in the page`);
});
function html(id){return read('index.html').includes(`id="${id}"`);}

test('project cards catch a soft light only on hover-capable pointers',()=>{
 assert.match(css,/@property --spot-now\{syntax:'<color>'/);
 assert.match(css,/@media\(hover:hover\)\{[^@]*\.project-card:hover\{[^}]*--spot-now:var\(--spot\)/);
 assert.match(app,/matchMedia\('\(hover:hover\) and \(pointer:fine\)'\)/,'pointer tracking stays off on touch');
 assert.match(app,/requestAnimationFrame/,'one style write per frame at most');
});

test('without JavaScript or on paper nothing covers, hides or splits the content',()=>{
 assert.match(css,/html:not\(\.js\) \.site-header\{position:absolute\}/,'with no observer the header never turns to glass');
 assert.match(css,/html:not\(\.js\) \.details-label\{visibility:hidden\}/,'the hidden Notes label keeps the row the outside link sits in');
 assert.doesNotMatch(css,/html:not\(\.js\) :is\([^)]*\.details-label/,'removing the label would pull the link over the stack line');
 const at=css.indexOf('@media print{');
 assert.notEqual(at,-1,'the page has print rules');
 const print=css.slice(at,css.indexOf('\n}',at));
 assert.match(print,/\.site-header\{position:absolute\}/,'a fixed header would repeat over every printed page');
 assert.match(print,/\.js-motion \.reveal,\.js-motion \.project-card\.reveal\{opacity:1;transform:none;transition:none\}/,'sections not yet scrolled into view still print, cards included');
 assert.match(print,/\.project-card,\.skill-card\{break-inside:avoid\}/,'a page break never cuts a card in half');
 assert.match(print,/#guide-launcher\{display:none\}/);
});

test('phones open project notes as a bottom sheet',()=>{
 const block=css.slice(css.indexOf('@media(max-width:600px){'));
 assert.match(block,/#project-dialog\{[^}]*margin:auto 0 0;[^}]*border-radius:22px 22px 0 0/);
});
