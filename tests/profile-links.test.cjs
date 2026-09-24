const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const {LANGUAGE_NAMES}=require('../language-data.js');
for(const code of ['pt','fr','zh','hi','ar','bn','ru','ur','id','ja'])require(`../locales/${code}.js`);
const {answer,ui}=require('../guide.js');
const LINKEDIN='https://www.linkedin.com/in/patrick-obrtal/';

test('LinkedIn sits with the other contact links and opens safely',()=>{
 const html=read('index.html');
 const links=html.match(/<div class="social-links">([\s\S]*?)<\/div>/)[1];
 const anchor=links.match(new RegExp(`<a href="${LINKEDIN}"[^>]*>LinkedIn <span aria-hidden="true">↗</span></a>`));
 assert(anchor,'LinkedIn row');
 assert.match(anchor[0],/target="_blank" rel="noopener noreferrer"/);
 assert(links.indexOf('github.com/khons-hu')<links.indexOf(LINKEDIN)&&links.indexOf(LINKEDIN)<links.indexOf('x.com/ptr1337_'));
 assert.equal(html.split(LINKEDIN).length-1,1,'one LinkedIn link on the page');
});

test('the terminal contact command lists the LinkedIn handle',()=>{
 assert.match(read('terminal.js'),/'GitHub: khons-hu\\nLinkedIn: patrick-obrtal\\nX: @ptr1337_\\nDiscord: khons\.hu\\n\\n'/);
});

test('the guide mentions LinkedIn when asked, in every language',()=>{
 const languages=Object.keys(LANGUAGE_NAMES);assert.equal(languages.length,17);
 for(const language of languages){
  const result=answer('linkedin',language);
  assert.match(result.text,/LinkedIn/,language);assert.equal(result.section,'contact',language);
 }
});

test('guide suggestions ask about Patrick, never address him as the guide',()=>{
 const html=read('index.html');
 assert.match(html,/data-question="What does Patrick do at Luigi’s Box\?"/);
 assert.match(html,/data-question="Who is Patrick\?">About Patrick</);
 assert.doesNotMatch(html,/data-question="(Who are you\?|What do you do[^"]*)"/);
 for(const language of Object.keys(LANGUAGE_NAMES)){
  const label=ui(language)[10];
  assert(/Patrick|Патрик/.test(label),`${language}: ${label}`);
 }
 assert.match(answer('Who is Patrick?','en').text,/^Patrick Obrtal/);
 assert.match(answer('What does Patrick do at Luigi’s Box?','en').text,/Customer Support Partner L2/);
});

test('the public portfolio repository is linked and never described as private',()=>{
 const SOURCE='https://github.com/khons-hu/portfolio';
 const html=read('index.html'),readme=read('README.md');
 assert.match(html,new RegExp(`data-project="portfolio"[\\s\\S]*?<a class="project-live" data-kind="source" href="${SOURCE}" target="_blank" rel="noopener noreferrer">View source ↗</a>`));
 assert.match(read('app.js'),new RegExp(`The source is public on GitHub.'\\], url: '${SOURCE}'`));
 const {SITE}=require('../api/chat.js');assert(SITE.includes(SOURCE));assert.doesNotMatch(SITE,/private/);
 assert.doesNotMatch(readme,/private repository|source remains private/i);assert(readme.includes(SOURCE));
 const {PROJECT_NOTES}=require('../site-locales.js');
 for(const language of Object.keys(LANGUAGE_NAMES)){
  const note=PROJECT_NOTES[language].portfolio.join(' ');
  assert.doesNotMatch(note,/private|privat|priv[ée]|súkromn|soukrom|prywatn|非公開|私有|निजी|خاص|ব্যক্তিগত|закрыт|نجی/i,language);
  assert.match(note,/GitHub/,language);
 }
});
