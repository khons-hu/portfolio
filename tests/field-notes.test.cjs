const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {steps,clamp,copySkill,mount}=require('../field-notes.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function harness(clipboard){
 const nodes=new Map();
 function node(id){if(!nodes.has(id))nodes.set(id,{textContent:'',hidden:true,disabled:false,dataset:{},children:[],events:{},addEventListener(k,f){this.events[k]=f;},append(x){this.children.push(x);},replaceChildren(...xs){this.children=xs;},focus(){this.focused=true;},closest(){return node('details');}});return nodes.get(id);}
 const button=node('copy');button.dataset.copySkill='skill-source';node('skill-source').textContent='original skill\n';
 const doc={querySelector:node,getElementById:node,querySelectorAll:()=>[button],createElement:()=>({children:[],append(x){this.children.push(x);}})};
 mount(doc,clipboard);return {node,click:id=>node(id).events.click()};
}
test('replay navigates its boundaries, resets, and never changes the recorded result',()=>{
 const {node,click}=harness();assert(node('#replay-prev').disabled);assert.equal(node('.replay-controls').hidden,false);
 click('#replay-prev');assert.match(node('#replay-count').textContent,/01 \/ 05/);
 for(let i=0;i<4;i++)click('#replay-next');assert(node('#replay-next').disabled);assert.match(node('#replay-copy').textContent,/not a corrected run/);
 click('#replay-next');assert.match(node('#replay-count').textContent,/05 \/ 05/);
 click('#replay-prev');assert.equal(node('#replay-title').textContent,'Completed request. Failed check.');
 click('#replay-reset');assert(node('#replay-prev').disabled);assert(!node('#replay-next').disabled);
 assert.equal(clamp(-1),0);assert.equal(clamp(99),steps.length-1);
});
test('copy success is reported only after writing, and failure exposes the original source',async()=>{
 let copied;const ok=harness({writeText:async text=>copied=text});await ok.click('copy');assert.equal(copied,'original skill\n');assert.match(ok.node('#skill-copy-status').textContent,/Skill copied/);assert(!ok.node('copy').disabled);
 const denied=harness({writeText:async()=>{throw Error('denied');}});await denied.click('copy');assert.equal(denied.node('details').open,true);assert(denied.node('skill-source').focused);assert.match(denied.node('#skill-copy-status').textContent,/manual copying/);assert(!denied.node('copy').disabled);
 assert.equal(await copySkill('text',undefined),false);
});
test('replay is grounded in the unchanged published report, including failure and scope',()=>{
 // Public source: khons-hu/khonproof@a82360c7f37915cd4edac1d138a228f7ec8410d7/public/reports/benchmark.json
 const bytes=fs.readFileSync(path.join(__dirname,'fixtures/khonproof-benchmark.json'));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'fe9b53ff86d8e726d19823c258517f5a0598fcf966c24a1cfb2db3df1e8a8e0e');
 const report=JSON.parse(bytes),run=report.runs.find(r=>r.taskId==='18'&&r.method==='Jev 1.13.0');
 assert.equal(run.passed,false);assert.equal(run.choice,'0');assert.equal(run.expected,'1');
 assert(steps[2].evidence.includes(`Elapsed: ${run.elapsedMs} ms`));
 assert(steps[2].evidence.includes(`Input: ${run.inputTokens} tokens · Output: ${run.outputTokens} tokens`));
 assert.match(report.scope,/No browser execution/);assert.match(steps[4].copy,/proposed follow-up/);
});
test('all three downloadable skills exactly match the readable source and stay usable without JavaScript',()=>{
 for(const slug of ['choose-an-action','check-a-claim','verify-a-change']){
  const file=fs.readFileSync(path.join(__dirname,'../skills',slug,'SKILL.md'),'utf8');
  const escaped=file.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
  assert(html.includes('<code>'+escaped+'</code>'),slug);
  assert(html.includes(`href="/skills/${slug}/SKILL.md" download`));
  assert.match(file,/## Limits/);
 }
 assert.match(html,/<noscript>[\s\S]*No corrected rerun/);
});
test('all public profile and prepared guide copy drops obsolete positioning',()=>{
 const {SITE_LOCALES,PROJECT_NOTES}=require('../site-locales.js'),{topics}=require('../guide.js');
 const {EXTRA_LOCALE_PACKS}=require('../language-data.js');
 for(const value of [html,JSON.stringify(SITE_LOCALES),JSON.stringify(PROJECT_NOTES),JSON.stringify(EXTRA_LOCALE_PACKS),require('../api/chat.js').system])assert.doesNotMatch(value,/C\+\+|Counter-Strike|CS2/);
 for(const topic of topics)for(const [key,value] of Object.entries(topic))if(typeof value==='string')assert.doesNotMatch(value,/C\+\+|Counter-Strike|CS2/);
});
