const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const api=require('../api/now-playing.js');
const client=require('../now-playing.js');

const env={SPOTIFY_CLIENT_ID:'client-id',SPOTIFY_CLIENT_SECRET:'client-secret-value',SPOTIFY_REFRESH_TOKEN:'refresh-token-value'};
const json=(status,body,headers={})=>({ok:status>=200&&status<300,status,headers:{get:k=>headers[k.toLowerCase()]??null},json:async()=>body});
const playing={is_playing:true,currently_playing_type:'track',progress_ms:60000,timestamp:1,device:{name:'Private laptop'},context:{uri:'spotify:playlist:secret'},item:{type:'track',is_local:false,name:'Night Drive',duration_ms:200000,artists:[{name:'Artist One'},{name:'Artist Two'}],album:{name:'Album',images:[{url:'https://i.scdn.co/image/x'}]},external_urls:{spotify:'https://open.spotify.com/track/abc123?si=tracking'}}};
function spotify(responses,{scope='user-read-currently-playing'}={}){
 const calls=[];
 const fetcher=async(url,options={})=>{
  calls.push({url,options});
  if(url.includes('/api/token'))return json(200,{access_token:'access-token-'+calls.length,expires_in:3600,scope});
  const next=responses.shift();return typeof next==='function'?next():next;
 };
 return {fetcher,calls};
}
const run=async(responses,opts)=>{api._reset();const s=spotify(responses,opts);const out=await api.nowPlaying({env,fetcher:s.fetcher,now:()=>1000});return {...out,calls:s.calls};};

test('unconfigured server says so without calling Spotify',async()=>{
 const calls=[];const out=await api.nowPlaying({env:{},fetcher:async()=>{calls.push(1);},now:()=>0});
 assert.deepEqual(out.body,{state:'unconfigured'});assert.equal(calls.length,0);assert(out.maxAge>=60);
});
test('a playing track is reduced to public title, artists and link',async()=>{
 const out=await run([json(200,playing)]);
 assert.deepEqual(Object.keys(out.body).sort(),['artists','fetchedAt','remainingMs','state','title','url']);
 assert.equal(out.body.state,'playing');assert.equal(out.body.title,'Night Drive');assert.deepEqual(out.body.artists,['Artist One','Artist Two']);
 assert.equal(out.body.url,'https://open.spotify.com/track/abc123','tracking query removed');assert.equal(out.body.remainingMs,140000);
 const text=JSON.stringify(out.body);
 for(const secret of ['client-secret-value','refresh-token-value','access-token','Private laptop','playlist','i.scdn.co','Album'])assert(!text.includes(secret),secret);
 assert.equal(out.maxAge,30);
 const tokenCall=out.calls[0];assert.match(tokenCall.options.headers.Authorization,/^Basic /);assert.match(tokenCall.options.body,/grant_type=refresh_token/);
});
test('paused, empty, private-session, podcast, ad and local tracks all stay hidden',async()=>{
 for(const response of [json(204,null),json(200,{...playing,is_playing:false}),json(200,{...playing,currently_playing_type:'episode',item:{...playing.item,type:'episode'}}),json(200,{...playing,currently_playing_type:'ad',item:null}),json(200,{...playing,item:{...playing.item,is_local:true,external_urls:{}}}),json(200,{...playing,item:{...playing.item,external_urls:{spotify:'https://evil.example/track/1'}}})]){
  const out=await run([response]);assert.equal(out.body.state,'idle',JSON.stringify(out.body));assert(!('title' in out.body));
 }
});
test('an expired access token is refreshed once, then the request is retried',async()=>{
 const out=await run([json(401,{}),json(200,playing)]);
 assert.equal(out.body.state,'playing');assert.equal(out.calls.filter(c=>c.url.includes('/api/token')).length,2);
});
test('rate limits and failures become a quiet unavailable state with a bounded cache',async()=>{
 assert.deepEqual((await run([json(429,{}, {'retry-after':'120'})])).body,{state:'unavailable'});
 assert.equal((await run([json(429,{}, {'retry-after':'120'})])).maxAge,120);
 assert.equal((await run([json(429,{}, {'retry-after':'9999'})])).maxAge,300);
 assert.equal((await run([json(503,{})])).body.state,'unavailable');
 assert.equal((await run([()=>{throw new Error('offline');}])).body.state,'unavailable');
});
test('a token with write scopes is refused, and nothing secret is logged',async()=>{
 const warnings=[];const original=console.warn;console.warn=(...args)=>warnings.push(args.join(' '));
 try{
  const out=await run([json(200,playing)],{scope:'user-read-currently-playing playlist-modify-private'});
  assert.deepEqual(out.body,{state:'unavailable'});
  api._reset();
  const failing=await api.nowPlaying({env,fetcher:async()=>json(400,{error:'invalid_grant',secret:'refresh-token-value'}),now:()=>0});
  assert.deepEqual(failing.body,{state:'unavailable'});
 }finally{console.warn=original;}
 assert(warnings.length>=1);for(const line of warnings)for(const secret of ['client-secret-value','refresh-token-value','access-token','invalid_grant'])assert(!line.includes(secret),line);
});
test('the access token is reused while valid instead of refreshing on every request',async()=>{
 api._reset();const s=spotify([json(200,playing),json(204,null)]);
 await api.nowPlaying({env,fetcher:s.fetcher,now:()=>1000});await api.nowPlaying({env,fetcher:s.fetcher,now:()=>2000});
 assert.equal(s.calls.filter(c=>c.url.includes('/api/token')).length,1);
});
test('handler sets a short shared cache, keeps browsers revalidating and rejects other methods',async()=>{
 const make=method=>{const headers={};return {req:{method},res:{headers,setHeader(k,v){headers[k.toLowerCase()]=v;},end(body){this.body=body;}}};};
 const saved={...process.env};for(const k of Object.keys(env))delete process.env[k];
 try{
  const get=make('GET');await api(get.req,get.res);
  assert.equal(get.res.statusCode,200);assert.deepEqual(JSON.parse(get.res.body),{state:'unconfigured'});
  assert.match(get.res.headers['cache-control'],/max-age=0, s-maxage=300/);
  const post=make('POST');await api(post.req,post.res);assert.equal(post.res.statusCode,405);
 }finally{Object.assign(process.env,saved);}
});

test('client shows only fresh, valid playing data',()=>{
 const data={state:'playing',title:'Night Drive',artists:['A'],url:'https://open.spotify.com/track/abc123',remainingMs:60000};
 assert.deepEqual(client.view(data,0),{title:'Night Drive',artists:['A'],url:data.url});
 assert.equal(client.view(data,70000),null,'past the end of the track');
 assert.equal(client.view({...data,remainingMs:undefined},client.MAX_AGE_MS+1),null,'too old to be "now"');
 assert.equal(client.view({...data,state:'idle'},0),null);
 assert.equal(client.view({...data,url:'javascript:alert(1)'},0),null);
 assert.equal(client.view({...data,artists:[]},0),null);
 assert.equal(client.view({state:'unconfigured'},0),null);
});

function browser({hidden=false,responses=[]}={}){
 const timers=[];let clockMs=0;const fetches=[];const listeners={};
 const el=()=>({textContent:'',href:'',hidden:true});
 const box={hidden:true,parts:{a:el(),'.listening-title':el(),'.listening-artist':el()},querySelector(s){return this.parts[s];}};
 const doc={hidden,getElementById:()=>box,addEventListener:(k,f)=>listeners[k]=f};
 const root={document:doc,performance:{now:()=>clockMs},
  setTimeout:(fn,ms)=>{timers.push({fn,at:clockMs+ms});return timers.length;},clearTimeout:id=>{if(timers[id-1])timers[id-1].cancelled=true;},
  fetch:async url=>{fetches.push(url);const r=responses.shift()||{state:'idle'};return {ok:true,headers:{get:k=>k==='age'?String(r.age||0):null},json:async()=>r.body||r};}};
 root.globalThis=root;
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../now-playing.js'),'utf8').replace(/\}\)\(globalThis\);\s*$/,'})(root);'),{root,module:undefined});
 const flush=()=>new Promise(r=>setImmediate(r));
 const advance=async ms=>{clockMs+=ms;for(let guard=0;guard<50;guard++){const due=timers.find(t=>!t.cancelled&&!t.done&&t.at<=clockMs);if(!due)break;due.done=true;due.fn();await flush();await flush();}};
 return {box,doc,fetches,listeners,flush,advance,timers,setHidden(v){doc.hidden=v;listeners.visibilitychange();}};
}
const track={state:'playing',title:'Night Drive',artists:['A','B'],url:'https://open.spotify.com/track/abc123',remainingMs:30000};
test('client polls once a minute while visible and never while hidden',async()=>{
 const b=browser({responses:[track]});await b.flush();await b.flush();
 assert.equal(b.fetches.length,1);assert.equal(b.box.hidden,false);assert.equal(b.box.parts['.listening-title'].textContent,'Night Drive');assert.equal(b.box.parts['.listening-artist'].textContent,'A, B');
 await b.advance(20000);assert.equal(b.fetches.length,1,'no per-second updates');
 b.setHidden(true);await b.advance(600000);assert(b.fetches.length<=2,'hidden tab does not poll: '+b.fetches.length);
});
test('a track stops showing once it should have ended, and a stale CDN answer does not cause a request loop',async()=>{
 const stale={body:{...track,remainingMs:1000},age:20};
 const b=browser({responses:[stale,stale,stale,stale,stale]});await b.flush();await b.flush();
 assert.equal(b.box.hidden,true,'already over when it arrived');
 const before=b.fetches.length;await b.advance(30000);assert(b.fetches.length-before<=1,'no rapid refetching: '+(b.fetches.length-before));
});
test('an unconfigured server stops polling for the rest of the visit',async()=>{
 const b=browser({responses:[{state:'unconfigured'}]});await b.flush();await b.flush();
 await b.advance(3600000);assert.equal(b.fetches.length,1);assert.equal(b.box.hidden,true);
});
test('a background tab does not fetch until it becomes visible',async()=>{
 const b=browser({hidden:true,responses:[track]});await b.flush();assert.equal(b.fetches.length,0);
 b.setHidden(false);await b.flush();await b.flush();assert.equal(b.fetches.length,1);assert.equal(b.box.hidden,false);
});
