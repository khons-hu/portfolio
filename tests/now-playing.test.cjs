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
 assert.deepEqual(Object.keys(out.body).sort(),['artists','durationMs','fetchedAt','progressMs','remainingMs','state','title','url']);
 assert.equal(out.body.progressMs,60000);assert.equal(out.body.durationMs,200000);
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

test('position and duration are validated on the server: null, negative, strings and non-finite values never become 0',()=>{
 const p=api.position;
 assert.deepEqual(p(200000,60000),{durationMs:200000,progressMs:60000});
 for(const bad of [null,undefined,-5,NaN,Infinity,'60000'])assert.equal(p(200000,bad).progressMs,null,String(bad));
 assert.equal(p(200000,250000).progressMs,200000,'clamped at the end');
 for(const bad of [0,-1,null,Infinity,'200000',7*3600000])assert.deepEqual(p(bad,1000),{durationMs:null,progressMs:null},String(bad));
 const noProgress=api.publicTrack({...playing,progress_ms:null});
 assert.equal(noProgress.progressMs,null);assert.equal(noProgress.remainingMs,null,'a missing position is not read as the start');
 assert.equal(api.publicTrack({...playing,progress_ms:200000}).remainingMs,null);
});

test('the page estimates the position honestly from the last answer',()=>{
 const d={state:'playing',progressMs:60000,durationMs:200000};
 assert.deepEqual(client.progress(d,20000),{elapsed:80000,total:200000,ended:false});
 assert.deepEqual(client.progress(d,150000),null,'too old to extrapolate');
 assert.deepEqual(client.progress({...d,progressMs:195000},client.PROGRESS_MAX_AGE_MS),{elapsed:200000,total:200000,ended:true},'clamped');
 for(const bad of [{...d,progressMs:null},{...d,progressMs:-1},{...d,progressMs:NaN},{...d,progressMs:Infinity},{...d,progressMs:'60000'},{...d,progressMs:250000},{...d,durationMs:0},{...d,durationMs:null},{...d,state:'idle'},null])assert.equal(client.progress(bad,0),null,JSON.stringify(bad));
 for(const age of [-1,NaN,Infinity,undefined])assert.equal(client.progress(d,age),null,String(age));
 assert.equal(client.arrivalAge('20',300),20150,'CDN age plus half the round trip');
 assert.equal(client.arrivalAge(null,0),0);assert.equal(client.arrivalAge('-5',100),50);assert.equal(client.arrivalAge('soon',100),50);assert.equal(client.arrivalAge('',NaN),0);
 assert.equal(client.formatTime(0),'0:00');assert.equal(client.formatTime(83999),'1:23');assert.equal(client.formatTime(3725000),'1:02:05');assert.equal(client.formatTime(-5),'0:00');
});

test('only a validated Spotify track address reaches the embed',()=>{
 assert.equal(client.embedUrl('https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC'),'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC');
 for(const bad of ['javascript:alert(1)','https://open.spotify.com.evil.com/track/abc','https://open.spotify.com/track/abc?si=1','https://open.spotify.com/track/abc/../x','https://open.spotify.com/track/ab%2Fc','http://open.spotify.com/track/abc','https://open.spotify.com/episode/abc','https://open.spotify.com/track/'+'a'.repeat(65),' https://open.spotify.com/track/abc',null,42]){
  assert.equal(client.embedUrl(bad),null,String(bad));assert.equal(client.view({state:'playing',title:'T',artists:['A'],url:bad},0),null,String(bad));
 }
});

// A small DOM double: enough for now-playing.js to render, tick, poll and load its player.
function browser({hidden=false,responses=[]}={}){
 const timers=[];let clockMs=0;const fetches=[];const listeners={};const created=[];
 const doc={hidden,activeElement:null};
 const el=(tag='span')=>{const node={tag,hidden:false,textContent:'',href:'',title:'',src:'',children:[],attrs:{},listeners:{},style:{props:{},setProperty(k,v){this.props[k]=v;}},
  setAttribute(k,v){this.attrs[k]=String(v);},getAttribute(k){return this.attrs[k]??null;},replaceChildren(...c){this.children=c;},
  addEventListener(k,f){this.listeners[k]=f;},click(){this.listeners.click?.();},focus(){doc.activeElement=node;}};return node;};
 const parts={};for(const s of ['.listening-link','.listening-title','.listening-artist','.listening-progress','.listening-bar','.listening-fill','.listening-elapsed','.listening-total','.listening-listen'])parts[s]=el();
 parts['.listening-progress'].hidden=true;parts['.listening-listen'].hidden=true;
 const box=Object.assign(el('div'),{hidden:true,querySelector:s=>parts[s]});
 const playerParts={};for(const s of ['.listening-frame','.listening-player-open','.listening-close'])playerParts[s]=el();
 const player=Object.assign(el('div'),{hidden:true,querySelector:s=>playerParts[s]});
 const noteLink=el('a');
 Object.assign(doc,{getElementById:id=>({'now-listening':box,'listening-player':player})[id],querySelector:s=>s==='.listening-note a'?noteLink:null,
  createElement:tag=>{const node=el(tag);created.push(node);return node;},addEventListener:(k,f)=>listeners[k]=f});
 const root={document:doc,performance:{now:()=>clockMs},
  setTimeout:(fn,ms)=>{timers.push({fn,at:clockMs+ms});return timers.length;},clearTimeout:id=>{if(timers[id-1])timers[id-1].cancelled=true;},
  fetch:async url=>{fetches.push({url,at:clockMs});const r=responses.shift()||{state:'idle'};if(r==='offline')throw new Error('offline');return {ok:true,headers:{get:k=>k==='age'?String(r.age||0):null},json:async()=>r.body||r};}};
 root.globalThis=root;
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../now-playing.js'),'utf8').replace(/\}\)\(globalThis\);\s*$/,'})(root);'),{root,module:undefined});
 const flush=async()=>{for(let i=0;i<4;i++)await new Promise(r=>setImmediate(r));};
 const advance=async ms=>{const end=clockMs+ms;for(let guard=0;guard<2000;guard++){const due=timers.filter(t=>!t.cancelled&&!t.done&&t.at<=end).sort((a,b)=>a.at-b.at)[0];if(!due)break;clockMs=Math.max(clockMs,due.at);due.done=true;due.fn();await flush();}clockMs=end;};
 const pending=()=>timers.filter(t=>!t.cancelled&&!t.done).length;
 return {box,parts,player,playerParts,noteLink,doc,created,fetches,flush,advance,pending,respond:r=>responses.push(r),setHidden(v){doc.hidden=v;listeners.visibilitychange();}};
}
const track={state:'playing',title:'Night Drive',artists:['A','B'],url:'https://open.spotify.com/track/abc123',remainingMs:140000,progressMs:60000,durationMs:200000};
const other={...track,title:'Morning Walk',url:'https://open.spotify.com/track/xyz789',progressMs:1000,remainingMs:199000};

test('client polls every 30 s while playing, never per second and never while hidden',async()=>{
 const b=browser({responses:[track]});await b.flush();
 assert.equal(b.fetches.length,1);assert.equal(b.box.hidden,false);assert.equal(b.parts['.listening-title'].textContent,'Night Drive');assert.equal(b.parts['.listening-artist'].textContent,'A, B');
 await b.advance(20000);assert.equal(b.fetches.length,1,'no per-second requests');
 await b.advance(10500);assert.equal(b.fetches.length,2,'one poll after 30 s');
 b.setHidden(true);await b.advance(600000);assert.equal(b.fetches.length,2,'hidden tab does not poll');
});
test('the position starts from the CDN age and ticks locally once a second',async()=>{
 const b=browser({responses:[{body:track,age:20}]});await b.flush();
 const e=b.parts['.listening-elapsed'],bar=b.parts['.listening-bar'];
 assert.equal(b.parts['.listening-progress'].hidden,false);
 assert.equal(e.textContent,'1:20','60 s + 20 s of CDN age');assert.equal(b.parts['.listening-total'].textContent,'3:20');
 assert.equal(bar.attrs['aria-valuenow'],'80');assert.equal(bar.attrs['aria-valuemax'],'200');assert.equal(bar.attrs['aria-valuetext'],'about 1:20 of 3:20');
 assert.equal(b.parts['.listening-fill'].style.props['--listening-progress'],'0.4');
 await b.advance(1100);assert.equal(e.textContent,'1:21');
 await b.advance(9000);assert.equal(e.textContent,'1:30');assert.equal(b.fetches.length,1,'ticking makes no requests');
});
test('a missing or unusable position hides only the bar and starts no ticking',async()=>{
 for(const body of [{...track,progressMs:null,remainingMs:null},{...track,progressMs:-5},{...track,progressMs:'60000'},{...track,durationMs:0},{...track,progressMs:Infinity}]){
  const b=browser({responses:[body]});await b.flush();
  assert.equal(b.box.hidden,false,JSON.stringify(body));assert.equal(b.parts['.listening-progress'].hidden,true,JSON.stringify(body));
  const before=b.parts['.listening-elapsed'].textContent;await b.advance(5000);assert.equal(b.parts['.listening-elapsed'].textContent,before);
 }
});
test('the bar clamps at the total and stops ticking',async()=>{
 const b=browser({responses:[{...track,progressMs:198500,remainingMs:1500},'offline']});await b.flush();
 await b.advance(3000);assert.equal(b.parts['.listening-elapsed'].textContent,'3:20');assert.equal(b.parts['.listening-fill'].style.props['--listening-progress'],'1');
 assert.equal(b.box.hidden,false,'still inside the grace period');await b.advance(4000);assert.equal(b.box.hidden,true,'then gone: no endless progress');
});
test('at the end one check looks for the next track, and a stale copy cannot loop',async()=>{
 const ending={...track,progressMs:195000,remainingMs:5000};
 const b=browser({responses:[ending,{body:ending,age:20},{body:ending,age:25},{body:ending,age:28}]});await b.flush();
 await b.advance(4900);assert.equal(b.parts['.listening-elapsed'].textContent,'3:19');assert.equal(b.fetches.length,1);
 await b.advance(200);assert.equal(b.fetches.length,2,'one check at the expected end');
 assert.equal(b.box.hidden,true,'the CDN copy is 20 s old, so that play has already finished');
 await b.advance(29000);assert.equal(b.fetches.length,2,'the stale copy of the same track does not trigger more checks');
});
test('a new track replaces the finished one with its own position',async()=>{
 const ending={...track,progressMs:198000,remainingMs:2000};
 const b=browser({responses:[ending,other]});await b.flush();
 await b.advance(2500);await b.flush();
 assert.equal(b.parts['.listening-title'].textContent,'Morning Walk');assert.equal(b.parts['.listening-elapsed'].textContent,'0:01');
});
test('a background tab cancels every timer, makes no requests, and resumes on return',async()=>{
 const b=browser({responses:[track,track]});await b.flush();
 assert(b.pending()>0);b.setHidden(true);assert.equal(b.pending(),0,'no timers while hidden');
 const shown=b.parts['.listening-elapsed'].textContent;await b.advance(600000);
 assert.equal(b.fetches.length,1);assert.equal(b.parts['.listening-elapsed'].textContent,shown,'nothing ticks in the background');
 b.setHidden(false);await b.flush();assert.equal(b.fetches.length,2,'a fresh check on return');assert(b.pending()>0);
});
test('a background tab does not fetch until it becomes visible',async()=>{
 const b=browser({hidden:true,responses:[track]});await b.flush();assert.equal(b.fetches.length,0);assert.equal(b.pending(),0);
 b.setHidden(false);await b.flush();assert.equal(b.fetches.length,1);assert.equal(b.box.hidden,false);
});
test('Spotify’s player loads only after a click, without autoplay',async()=>{
 const b=browser({responses:[track]});await b.flush();
 const listen=b.parts['.listening-listen'];
 assert.equal(b.created.length,0,'no frame before the click');assert.equal(b.player.hidden,true);assert.equal(listen.hidden,false);assert.equal(listen.textContent,'Listen here');
 listen.click();
 assert.equal(b.created.length,1);const frame=b.created[0];
 assert.equal(frame.tag,'iframe');assert.equal(frame.src,'https://open.spotify.com/embed/track/abc123');
 assert.doesNotMatch(frame.attrs.allow,/autoplay/);assert.match(frame.attrs.allow,/encrypted-media/);assert.match(frame.title,/Night Drive/);
 assert.deepEqual(b.playerParts['.listening-frame'].children,[frame]);assert.equal(b.player.hidden,false);
 assert.equal(b.playerParts['.listening-player-open'].href,track.url,'Open in Spotify stays available');
 assert.equal(listen.hidden,true,'no second button for the track already loaded');assert.equal(b.doc.activeElement,b.player,'focus moves into the player');
});
test('polls keep the visitor’s player: no reload, no silent switch, not even when Patrick stops',async()=>{
 const b=browser({responses:[track,track,other,{state:'idle'}]});await b.flush();
 b.parts['.listening-listen'].click();const frame=b.created[0];
 await b.advance(30500);assert.equal(b.fetches.length,2);assert.equal(b.playerParts['.listening-frame'].children[0],frame,'same track: untouched');
 await b.advance(30500);assert.equal(b.parts['.listening-title'].textContent,'Morning Walk');
 assert.equal(b.playerParts['.listening-frame'].children[0],frame,'new track: the visitor keeps listening');assert.equal(b.created.length,1);
 assert.match(frame.title,/Night Drive · A, B/,'the frame still names the visitor’s track');
 const listen=b.parts['.listening-listen'];assert.equal(listen.hidden,false);assert.equal(listen.textContent,'Switch to this track');
 await b.advance(30500);assert.equal(b.box.hidden,true,'Patrick stopped');assert.equal(b.player.hidden,false);assert.equal(b.playerParts['.listening-frame'].children[0],frame);
});
test('switching tracks happens only on the visitor’s click',async()=>{
 const b=browser({responses:[track,other]});await b.flush();
 b.parts['.listening-listen'].click();await b.advance(30500);
 b.parts['.listening-listen'].click();
 assert.equal(b.created.length,2);assert.equal(b.created[1].src,'https://open.spotify.com/embed/track/xyz789');assert.deepEqual(b.playerParts['.listening-frame'].children,[b.created[1]]);
});
test('closing the player unloads the embed and returns focus',async()=>{
 const b=browser({responses:[track,{state:'idle'}]});await b.flush();
 const listen=b.parts['.listening-listen'];listen.click();
 b.playerParts['.listening-close'].click();
 assert.deepEqual(b.playerParts['.listening-frame'].children,[]);assert.equal(b.player.hidden,true);
 assert.equal(listen.hidden,false);assert.equal(listen.textContent,'Listen here');assert.equal(b.doc.activeElement,listen);
 listen.click();await b.advance(30500);assert.equal(b.box.hidden,true);
 b.playerParts['.listening-close'].click();assert.equal(b.doc.activeElement,b.noteLink,'focus falls back to the playlist link when the live line is gone');
});
test('an unconfigured server stops polling for the rest of the visit',async()=>{
 const b=browser({responses:[{state:'unconfigured'}]});await b.flush();
 await b.advance(3600000);assert.equal(b.fetches.length,1);assert.equal(b.box.hidden,true);
});
test('an unsafe track address never shows and never offers the player',async()=>{
 const b=browser({responses:[{...track,url:'https://evil.example/track/abc123'}]});await b.flush();
 assert.equal(b.box.hidden,true);assert.equal(b.parts['.listening-listen'].hidden,true);assert.equal(b.created.length,0);
});
test('player and progress copy exists in every language, and only Spotify may be framed',()=>{
 const {LANGUAGE_NAMES}=require('../language-data.js');
 for(const code of ['pt','fr','zh','hi','ar','bn','ru','ur','id','ja'])require(`../locales/${code}.js`);
 const {SITE_LOCALES}=require('../site-locales.js');
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const keys=['Listen here','Switch to this track','Close player','Spotify player','Open in Spotify ↗','Spotify decides whether you hear a preview or the full track.','Track progress','Estimated between checks with Spotify','about {elapsed} of {total}'];
 for(const key of keys.filter(k=>!k.includes('{')&&k!=='Switch to this track'))assert(html.includes(key),`index.html: ${key}`);
 for(const lang of Object.keys(LANGUAGE_NAMES).filter(l=>l!=='en'))for(const key of keys){
  const value=SITE_LOCALES[lang][key];assert(value&&value.trim(),`${lang}: ${key}`);
  if(key.includes('{'))assert(value.includes('{elapsed}')&&value.includes('{total}'),`${lang}: placeholders`);
 }
 const csp=JSON.parse(fs.readFileSync(path.join(__dirname,'../vercel.json'),'utf8')).headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
 assert.match(csp,/frame-src https:\/\/open\.spotify\.com(;|$)/);assert.match(csp,/frame-ancestors 'none'/);assert.match(csp,/script-src 'self';/);
 assert.doesNotMatch(html,/<iframe/i,'no frame in the page until a visitor asks for one');
 assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../now-playing.js'),'utf8'),/autoplay;/);
});
