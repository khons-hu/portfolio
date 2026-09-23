const {test}=require('node:test');
const assert=require('node:assert/strict');
const {reply,validate}=require('../api/chat.js');
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
  assert.equal(body.model,'openai/gpt-oss-20b');assert.equal(body.messages[0].role,'system');assert.match(body.messages[0].content,/Customer Support Partner L2/);assert(!body.messages[0].content.includes('test-key'));assert.equal(body.max_completion_tokens,1024);
  return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:'A short answer',reasoning:'hidden'}}]})};
 }});assert.deepEqual(result,{status:200,body:{text:'A short answer'}});
});
test('rate limit, malformed, truncated and failed responses fall back without provider details',async()=>{
 for(const response of [{ok:false,status:429},{ok:false,status:401},{ok:true,json:async()=>({})},{ok:true,json:async()=>({choices:[{finish_reason:'length',message:{content:'partial'}}]})}]){
  const result=await reply(valid,{env:{GROQ_API_KEY:'secret'},fetcher:async()=>response});assert(result.status>=400);assert(!JSON.stringify(result).includes('secret'));
 }
 const result=await reply(valid,{env:{GROQ_API_KEY:'secret'},fetcher:async()=>{throw Error('secret');}});assert.deepEqual(result.body,{error:'unavailable'});
});
test('AI disclosure exists for all seventeen portfolio languages',()=>{
 assert.equal(Object.keys(copy).length,17);for(const row of Object.values(copy)){assert.equal(row.length,5);assert(row.every(s=>s.length>0));assert.match(row[1],/Groq/);}
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
