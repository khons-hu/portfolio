const {test}=require('node:test');
const assert=require('node:assert/strict');
const {reply}=require('../api/chat.js');
const valid={message:'Tell me about Patrick',language:'hu',history:[]};
const streamResponse=chunks=>new Response(new ReadableStream({start(controller){for(const chunk of chunks)controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`));controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));controller.close();}}),{headers:{'Content-Type':'text/event-stream'}});
test('streams visible text before completion without exposing reasoning',async()=>{
  const shown=[];
  const result=await reply(valid,{env:{GROQ_API_KEY:'fixture'},onText:delta=>shown.push(delta),fetcher:async(_url,options)=>{
    assert.equal(JSON.parse(options.body).stream,true);
    return streamResponse([{choices:[{delta:{reasoning:'private',content:'Szia '},finish_reason:null}]},{choices:[{delta:{content:'世界'},finish_reason:null}]},{choices:[{delta:{},finish_reason:'stop'}]}]);
  }});
  assert.deepEqual(shown,['Szia ','世界']);assert.deepEqual(result,{status:200,body:{text:'Szia 世界'}});
});
test('reassembles streamed tool arguments and rejects a truncated answer',async()=>{
  const result=await reply(valid,{env:{GROQ_API_KEY:'fixture'},onText:()=>{},fetcher:async()=>streamResponse([
    {choices:[{delta:{tool_calls:[{index:0,type:'function',function:{name:'recommend_projects',arguments:'{"project_ids":['}}]},finish_reason:null}]},
    {choices:[{delta:{tool_calls:[{index:0,function:{arguments:'"moonshift","proof"]}'}}]},finish_reason:'tool_calls'}]}
  ])});
  assert.equal(result.status,200);assert.deepEqual(result.body.recommendations,['moonshift','proof']);
  const truncated=await reply(valid,{env:{GROQ_API_KEY:'fixture'},onText:()=>{},fetcher:async()=>streamResponse([{choices:[{delta:{content:'partial'},finish_reason:'length'}]}])});
  assert.deepEqual(truncated,{status:503,body:{error:'unavailable'}});
});
test('availability is shared-cacheable while chat remains private',async()=>{
  const handler=require('../api/chat.js');
  const res={headers:{},setHeader(key,value){this.headers[key]=value;},end(raw){this.body=JSON.parse(raw);}};
  await handler({method:'GET',headers:{}},res);
  assert.equal(res.headers['Cache-Control'],'public, max-age=0, s-maxage=300');
});
test('event reader preserves split multilingual bytes and fragmented CRLF boundaries',async()=>{
  const {readEventStream}=require('../guide.js'),events=[];
  const bytes=new TextEncoder().encode('event: text\r\ndata: {"delta":"árvíztűrő 世界"}\r\n\r\nevent: result\ndata: {"text":"done"}\n\n');
  const body=new ReadableStream({start(controller){for(const byte of bytes)controller.enqueue(Uint8Array.of(byte));controller.close();}});
  await readEventStream(body,frame=>events.push([frame.event,JSON.parse(frame.data)]));
  assert.deepEqual(events,[['text',{delta:'árvíztűrő 世界'}],['result',{text:'done'}]]);
});
test('HTTP streaming sends a generic error after truncated text and never caches it',async()=>{
  const handler=require('../api/chat.js'),saved=process.env.GROQ_API_KEY,original=global.fetch;
  process.env.GROQ_API_KEY='fixture';global.fetch=async()=>streamResponse([{choices:[{delta:{content:'partial',reasoning:'private'},finish_reason:'length'}]}]);
  const res={headers:{},chunks:[],setHeader(key,value){this.headers[key]=value;},write(raw){this.chunks.push(raw);},end(raw){if(raw)this.chunks.push(raw);}};
  try{await handler({method:'POST',headers:{origin:'https://khns.dev','content-type':'application/json',accept:'text/event-stream','x-forwarded-for':'203.0.113.11'},body:valid},res);}
  finally{global.fetch=original;if(saved===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=saved;}
  assert.equal(res.headers['Cache-Control'],'no-store');assert.match(res.headers['Content-Type'],/^text\/event-stream/);
  assert.match(res.chunks.join(''),/event: text\ndata: {"delta":"partial"}/);assert.match(res.chunks.join(''),/event: error\ndata: {"error":"unavailable"}/);
  assert.doesNotMatch(res.chunks.join(''),/private|fixture|event: result/);
});
