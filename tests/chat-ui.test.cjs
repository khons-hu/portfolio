const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const {LANGUAGE_NAMES}=require('../language-data.js');
const {PROJECT_NOTES}=require('../site-locales.js');
const {answer,tidy}=require('../guide.js');
const languages=Object.keys(LANGUAGE_NAMES);

test('model replies stay plain text: Markdown markers are removed, never rendered',()=>{
 const reply='Here is a rundown:\n\n**1. Spotify tool**  \nA local script.\n\n- first\n* second\n## Heading\n| Project | Stack |\n|---|---|\n| Dots | React |\n\n---\n\nSee `guide.js` or [the site](https://khons-hu.vercel.app).';
 assert.equal(tidy(reply),'Here is a rundown:\n\n1. Spotify tool\nA local script.\n\n• first\n• second\nHeading\nProject · Stack\nDots · React\n\nSee guide.js or the site (https://khons-hu.vercel.app).');
 for(const plain of ['C++ and Counter-Strike got me started.','2 * 3 * 4 = 24','<b>not markup</b> & stays literal','Customer Support Partner L2 at Luigi’s Box.'])assert.equal(tidy(plain),plain);
 assert.equal(tidy('a\n\n\n\nb  '),'a\n\nb');
});

test('the guide no longer describes itself as local-only in any language',()=>{
 const html=read('index.html');
 assert.doesNotMatch(html,/not an AI model|NO API|NO CHAT STORAGE/);
 assert.match(html,/<span id="guide-status" class="sr-only" role="status"/);
 assert.equal(languages.length,17);
 for(const language of languages){
  const note=PROJECT_NOTES[language].portfolio[0];
  assert.match(note,/Groq/,`${language} portfolio note`);
  assert.doesNotMatch(note,/API/,`${language} portfolio note`);
  const site=answer('this site',language).text;
  assert.match(site,/Groq/,`${language} site answer`);
 }
 assert.match(read('app.js'),/a small guide in multiple languages\. It answers with an AI model through Groq/);
});

test('waiting states never loop and busy controls stay focusable',()=>{
 const css=read('style.css'),guide=read('guide.js');
 assert.doesNotMatch(css,/infinite/);
 assert.match(css,/\.js-motion \.guide-message\.pending\{animation:[^}]*\.3s both\}/);
 assert.match(css,/\.guide-message p\{[^}]*white-space:pre-line/);
 assert.doesNotMatch(guide,/submit\.disabled/);
 assert.match(guide,/setAttribute\('aria-disabled'/);
});

test('follow-ups respect the server spacing instead of triggering a refusal',()=>{
 const server=read('api/chat.js'),guide=read('guide.js');
 const serverGap=Number(server.match(/now-\(recent\.get\(key\)\|\|0\)<(\d+)/)[1]);
 const clientGap=Number(guide.match(/SPACING=(\d+)/)[1]);
 assert(clientGap>serverGap,`client spacing ${clientGap} must exceed server spacing ${serverGap}`);
 assert.match(server,/Retry-After/);
 assert.match(guide,/headers\.get\('Retry-After'\)/);
});
