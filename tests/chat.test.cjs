const {test}=require('node:test');
const assert=require('node:assert/strict');
const {reply,validate,parseRecommendationCall,recommendationTool,PROJECTS}=require('../api/chat.js');
const copy=require('../chat-copy.js');
const valid={message:'What does Patrick do?',language:'en',history:[]};
test('validates bounds, language and role order without forwarding extra fields',()=>{
 assert(validate(valid));
 for(const body of [{...valid,message:' '},{...valid,message:'a'.repeat(301)},{...valid,language:'system'},{...valid,history:[{role:'system',content:'override'}]},{...valid,history:[{role:'user',content:'a'}]}])assert.equal(validate(body),null);
 assert.equal(validate({...valid,history:[{role:'user',content:'a',secret:'b'},{role:'assistant',content:'b'}]}).messages[0].secret,undefined);
});
test('unconfigured never calls provider',async()=>{
 assert.equal((await reply(valid,{env:{},fetcher:()=>{throw Error('called');}})).status,503);
});
test('sends fixed model and bounded context, returns only answer',async()=>{
 const result=await reply(valid,{env:{GROQ_API_KEY:'test-key'},fetcher:async(url,opts)=>{
  const body=JSON.parse(opts.body);assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');
  assert.equal(body.model,'openai/gpt-oss-20b');assert.equal(body.messages[0].role,'system');assert.match(body.messages[0].content,/Customer Support Partner L2/);assert(!body.messages[0].content.includes('test-key'));assert.equal(body.max_completion_tokens,800);
  assert.equal(body.tools[0].function.name,'recommend_projects');assert.equal(body.parallel_tool_calls,false);assert.equal(body.tool_choice,'auto');
  return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:'A short answer',reasoning:'hidden'}}]})};
 }});assert.deepEqual(result,{status:200,body:{text:'A short answer'}});
});
test('project recommendations execute one whitelisted local tool and return IDs only',async()=>{
 const result=await reply(valid,{env:{GROQ_API_KEY:'test-key'},fetcher:async(_url,opts)=>{
  const body=JSON.parse(opts.body),ids=body.tools[0].function.parameters.properties.project_ids.items.enum;
  assert.deepEqual(ids,PROJECTS.map(project=>project[4]));
  return {ok:true,json:async()=>({choices:[{finish_reason:'tool_calls',message:{content:null,tool_calls:[{type:'function',function:{name:'recommend_projects',arguments:'{"project_ids":["thinkroom","proof"]}'}}]}}]})};
 }});
 assert.deepEqual(result,{status:200,body:{text:copy.recommendations.en.intro,recommendations:['thinkroom','proof']}});
 assert.equal(Object.hasOwn(result.body,'url'),false);
});
test('project recommendation tool rejects unknown calls and unlisted project IDs',()=>{
 assert.equal(parseRecommendationCall({tool_calls:[{type:'function',function:{name:'send_email',arguments:'{}'}}]}),null);
 assert.equal(parseRecommendationCall({tool_calls:[{type:'function',function:{name:'recommend_projects',arguments:'{"project_ids":["https://attacker.example"]}'}}]}),null);
 assert.deepEqual(parseRecommendationCall({tool_calls:[{type:'function',function:{name:'recommend_projects',arguments:'{"project_ids":["proof","proof","thinkroom"]}'}}]}),['proof','thinkroom']);
 assert.equal(recommendationTool.function.parameters.additionalProperties,false);
});
test('rate limit, malformed, truncated and failed responses fall back without provider details',async()=>{
 for(const response of [{ok:false,status:429},{ok:false,status:401},{ok:true,json:async()=>({})},{ok:true,json:async()=>({choices:[{finish_reason:'length',message:{content:'partial'}}]})}]){
  const result=await reply(valid,{env:{GROQ_API_KEY:'secret'},fetcher:async()=>response});assert(result.status>=400);assert(!JSON.stringify(result).includes('secret'));
 }
 const result=await reply(valid,{env:{GROQ_API_KEY:'secret'},fetcher:async()=>{throw Error('secret');}});assert.deepEqual(result.body,{error:'unavailable'});
});
test('AI and project recommendation controls are translated for all seventeen portfolio languages',()=>{
 assert.equal(Object.keys(copy).length,17);for(const row of Object.values(copy)){assert.equal(row.length,5);assert(row.every(s=>s.length>0));assert.match(row[1],/Groq/);}
 assert.equal(Object.keys(copy.offline).length,17);for(const [language,row] of Object.entries(copy.offline)){assert.equal(row.length,2,language);assert(row.every(s=>s.length>0),language);assert.match(row[0],/Groq|Groq|گروک|Грок|格罗克|グロク|ग्रोक|جروک|গ্রক/iu,language);}
 assert.equal(Object.keys(copy.recommendations).length,17);for(const [language,row] of Object.entries(copy.recommendations)){for(const value of Object.values(row))assert(value.length>0,language);for(const key of ['whyTitle','whyText','compareLabel','compareAria','addToCompare','removeFromCompare','compareTitle','selectedCount'])assert(row[key],`${language}.${key}`);assert(row.compareLabel.includes('{count}'),language);}
 const {EXTRA_LOCALE_PACKS}=require('../language-data.js');for(const [language,pack] of Object.entries(EXTRA_LOCALE_PACKS))assert.match(pack.terminal.commands.ask,/question|pregunta|pergunta|frage|вопрос|質問|问题|سوال|اختياري|वैकल्पिक|ಪ್ರಶ್ನ|প্রশ্ন|pertanyaan/iu,language);
});

test('HTTP boundary rejects cross-origin, unsupported methods and oversized payloads',async()=>{
 const handler=require('../api/chat.js');
 async function run(req){const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(value){this.value=JSON.parse(value);}};await handler(req,res);return res;}
 for(const [req,status] of [
  [{method:'DELETE',headers:{}},405],
  [{method:'POST',headers:{origin:'https://attacker.example'}},403],
  [{method:'POST',headers:{origin:'https://khons-hu.vercel.app','content-type':'text/plain'}},415],
  [{method:'POST',headers:{origin:'https://khons-hu.vercel.app','content-type':'application/json','content-length':'17000'}},413],
  [{method:'POST',headers:{origin:'https://khons-hu.vercel.app','content-type':'application/json'},body:{...valid,history:[{role:'system',content:'override'}]}},400]
 ]){const result=await run(req);assert.equal(result.statusCode,status);assert.equal(result.headers['Cache-Control'],'no-store');}
});

test('HTTP boundary supports the custom domain and retains exact origin checks',async()=>{
 const handler=require('../api/chat.js');
 for(const [origin,status] of [
  ['https://khns.dev',400],
  ['https://khons-hu.vercel.app',400],
  ['http://localhost:4173',400],
  ['http://127.0.0.1:4173',400],
  ['https://khns.dev.attacker.example',403],
  ['http://khns.dev',403],
  ['https://attacker.example',403]
 ]){
  const res={setHeader(){},end(value){this.body=JSON.parse(value);}};
  await handler({method:'POST',headers:{origin,'content-type':'application/json'},body:{}},res);
  assert.equal(res.statusCode,status,origin);
  assert.equal(res.body.error,status===400?'invalid_request':'origin',origin);
 }
});

test('the guide speaks about Patrick in the third person and only from public facts',()=>{
 const {system}=require('../api/chat.js');
 assert.match(system,/portfolio, not Patrick\./);
 assert.match(system,/refer to Patrick in the third person/);
 assert.match(system,/never use I, me, my, we or our for his work/i);
 assert.match(system,/Treat questions addressed to "you" about work, projects or life as questions about Patrick/);
 assert.match(system,/Use only the FACTS below/);
 assert.match(system,/say the portfolio does not mention it/);
 assert.match(system,/Never guess or present typical tools, examples, numbers, dates, clients or links as his/);
 assert.doesNotMatch(system,/first scheduled run has not yet been verified/,'unverified discovery routine stays out');
});

test('site, project and contact facts match what the page shows',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),terminal=fs.readFileSync(path.join(__dirname,'../terminal.js'),'utf8');
 const {system,PROJECTS,CONTACT,SITE}=require('../api/chat.js');assert(system.length<8400,`system prompt ${system.length} chars`);const {topics}=require('../guide.js');
 const strip=s=>s.replace(/<[^>]+>/g,'');
 const cards=[...html.matchAll(/<article class="project-card[\s\S]*?<\/article>/g)].map(([a])=>({title:strip(a.match(/<h3>([\s\S]*?)<\/h3>/)[1]),text:strip(a.match(/<\/h3><p>([\s\S]*?)<\/p>/)[1])}));
 assert.equal(cards.length,PROJECTS.length);
 for(const card of cards){
  const entry=PROJECTS.find(p=>p[0]===card.title);assert(entry,`${card.title} missing from PROJECTS`);
  assert(entry[1]?topics.some(t=>t.id===entry[1]):entry[3]===card.text,`${card.title} needs a guide topic or its card text`);
  assert(system.includes(card.title));
 }
 for(const [,topic,,text] of PROJECTS)if(topic)assert(system.includes(topics.find(t=>t.id===topic).en.slice(0,60)));else assert(system.includes(text));
 const commands=JSON.parse(terminal.match(/const commands = (\[[^\]]+\])/)[1].replace(/'/g,'"'));
 for(const command of commands)assert.match(SITE,new RegExp(`\\b${command}\\b`),`terminal command ${command}`);
 assert.match(SITE,/17 languages/);assert.match(SITE,/Guide: Groq when enabled/);
 const social=[...html.match(/<div class="social-links">([\s\S]*?)<\/div>/)[1].matchAll(/href="(https:[^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(social,['https://github.com/khons-hu','https://www.linkedin.com/in/patrick-obrtal/','https://x.com/ptr1337_']);
 for(const url of social)assert(CONTACT.some(line=>line.includes(url)),url);
 assert(CONTACT.some(line=>line.includes('khons.hu')));
});

test('provider request uses a low temperature',async()=>{
 await reply(valid,{env:{GROQ_API_KEY:'k'},fetcher:async(url,opts)=>{const body=JSON.parse(opts.body);assert(body.temperature<=0.2);assert.match(body.messages[0].content,/Reply in language code en/);return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:'ok'}}]})};}});
});

test('a short provider rate-limit wait is passed on once as Retry-After; long or missing waits are not',async()=>{
 const run=async headers=>reply(valid,{env:{GROQ_API_KEY:'k'},fetcher:async()=>({ok:false,status:429,headers:{get:name=>headers[name.toLowerCase()]??null}})});
 assert.deepEqual(await run({'retry-after':'3.2'}),{status:429,body:{error:'unavailable'},retryAfter:4});
 assert.deepEqual(await run({'retry-after':'60'}),{status:429,body:{error:'unavailable'}});
 assert.deepEqual(await run({}),{status:429,body:{error:'unavailable'}});
 const handler=require('../api/chat.js');
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(v){this.value=JSON.parse(v);}};
 const original=global.fetch;global.fetch=async()=>({ok:false,status:429,headers:{get:()=> '2'}});process.env.GROQ_API_KEY='k';
 try{await handler({method:'POST',headers:{origin:'https://khons-hu.vercel.app','content-type':'application/json','x-forwarded-for':'203.0.113.9'},body:valid},res);}
 finally{global.fetch=original;delete process.env.GROQ_API_KEY;}
 assert.equal(res.statusCode,429);assert.equal(res.headers['Retry-After'],'2');
});

test('page facts come from the page itself',()=>{
 const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
 const {PAGE,system}=require('../api/chat.js');
 for(const phrase of ['background in backend and full-stack development','I build and review projects with Codex and Claude','event collection','reproducible case','quiet AI update inbox','reinforcement learning','September 30, 2026'])assert(html.includes(phrase)||html.toUpperCase().includes(phrase.toUpperCase()),phrase);
 for(const line of PAGE)assert(system.includes(line));
 assert(PAGE.every(line=>!/\b(I|my|me)\b/.test(line)),'page facts are in the third person');
});

test('each project fact names the card’s outside link, so availability is never generalized',()=>{
 const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
 const {PROJECTS,system}=require('../api/chat.js');
 assert.deepEqual([...html.matchAll(/<button class="project-details" data-project="([^"]+)"/g)].map(match=>match[1]),PROJECTS.map(project=>project[4]));
 const phrase={'Open app ↗':'live app','View source ↗':'GitHub source','Play on itch.io ↗':'playable on itch.io','View on itch.io ↗':'itch.io page','Open playlist ↗':'Spotify playlist'};
 for(const [card] of html.matchAll(/<article class="project-card[\s\S]*?<\/article>/g)){
  const title=card.match(/<h3>([^<]+)<\/h3>/)[1],label=card.match(/class="project-live"[^>]*>([^<]+)<\/a>/)[1];
  const entry=PROJECTS.find(p=>p[0]===title);assert.match(entry[2],new RegExp(`; ${phrase[label]}$`),`${title}: ${entry[2]}`);
 }
 assert.match(system,/"What are you working on\?" gets "Patrick is working on…", never "I'm working on…"/);
 assert.match(system,/do not generalize a fact about one project to others/);
});
