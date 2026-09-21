'use strict';
const t = text => globalThis.PortfolioI18n?.t(text) || text;
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let motionPreference;
try { motionPreference = localStorage.getItem('khonsu-motion'); } catch {}
function updateMotion() {
  const disabled = reducedMotion.matches || motionPreference === 'off';
  root.classList.toggle('motion-off', disabled);
  root.classList.toggle('js-motion', !disabled);
  motionButton.textContent = t(motionPreference === 'off' ? 'Motion: off' : `Motion: system${reducedMotion.matches ? ' (reduced)' : ''}`);
  motionButton.title = t(reducedMotion.matches ? 'Your system requests reduced motion. Animations stay off. Click to switch between system preference and always off.' : 'Click to switch between system preference and always off.');
  motionButton.setAttribute('aria-pressed', String(disabled));
  motionButton.disabled = false;
}
updateMotion();
reducedMotion.addEventListener('change', updateMotion);
motionButton.addEventListener('click', () => {
  motionPreference = motionPreference === 'off' ? 'system' : 'off';
  try { localStorage.setItem('khonsu-motion', motionPreference); } catch {}
  updateMotion();
});
document.addEventListener('visibilitychange', () => root.classList.toggle('page-hidden', document.hidden));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));

const projects = {
  proof: {"title":"Khonproof","category":"CURRENT PROJECT · JAVASCRIPT","description":"A small lab for agent decisions, browser tasks, skill comparisons, deploy checks and claims.","notes":["20 browser tasks and measured report imports. Published Jev and keyword-baseline results include failures.","Model tests run locally with your own API key. A small sample, not a general model ranking."],"url":"https://github.com/khons-hu/khonproof"},
  calculator: {"title": "Arduino calculator", "category": "UNIVERSITY TEAM PROJECT · C/C++ / ARDUINO", "description": "A calculator with a keypad, an LCD and a small bomb-defusal game. A university team build.", "notes": ["Built with a team at TUKE using an Arduino Uno, a keypad and an LCD. It evaluates arithmetic expressions with brackets and keeps calculation history.", "The repository includes the source and circuit diagram. There is also a small bomb-defusal game. This is earlier hardware work, not a browser demo."], "url": "https://github.com/khons-hu/Scientific-Calculator-Simplified---Semestral-Hardware-project"},
  steam: {"title": "Khonstash", "category": "CURRENT PROJECT · JAVASCRIPT / STEAM MARKET", "description": "A small Steam item watchlist with room for your own reasoning.", "notes": ["Check EUR listing prices, record purchase costs and see estimated Steam Wallet proceeds after fees. No Steam login or trading.", "Keep up to 12 items, target-price notices, local notes and your own observation history. Export a backup to move between browsers.", "Price checks are manual and depend on an undocumented Steam endpoint. No background monitoring or closed-app notifications. Source is public; hosted deployment is awaiting GitHub access setup."], "url": "https://github.com/khons-hu/khonstash"},
  market: { title: 'Khonodds', category: 'CURRENT PROJECT · JAVASCRIPT / PUBLIC DATA', description: 'A read-only desk for Polymarket wallet research.', notes: ['Leaderboard filters, wallet positions, activity, watchlists and local notes. Published rankings are a starting point for research, not proof of repeatable returns.', 'Trade alerts work while the page is open. The AI company notebook links official news and SEC searches, without claiming any IPO date.', 'No wallet connection or trading. The live app reads public Polymarket data through a bounded API.'], live: true, url: 'https://market-watch-khonsu.vercel.app/', source: 'https://github.com/khons-hu/khonodds', android: 'https://github.com/khons-hu/khonodds/releases/tag/android-v1.0.0-preview.1' },
  signal: { title: 'Khonrelay', category: 'CURRENT PROJECT · TYPESCRIPT / RSS', description: 'A small inbox for AI updates, without the endless feed.', notes: ['Official OpenAI and DeepMind news, coding-tool releases, service status, combined RSS and OPML export.', 'Save links, mark updates read and choose what matters. The importance labels explain their rules. Optional Jev reading order uses precomputed scores without changing alerts. Tibo’s X account is linked directly, not automatically monitored.', 'An optional daily digest runs on the server. Register each device separately. Web Push was tested in Brave on macOS. Phone delivery has not been tested.'], live: true, url: 'https://quiet-signal-khonsu.vercel.app/', source: 'https://github.com/khons-hu/khonrelay', android: 'https://github.com/khons-hu/khonrelay/releases/tag/android-v1.0.0-preview.1' },
  thinkroom: { title: 'Khonsolve', category: 'CURRENT PROJECT · JAVASCRIPT / BROWSER SANDBOX', description: 'A small practice workshop for thinking through problems yourself.', notes: ['Fifteen original exercises across coding, debugging, logic, prompt design and agent skills. Write an approach, try it, reveal hints gradually, and reflect.', 'JavaScript, TypeScript and Python sample checks run locally with a time limit. C and C++ have an experimental local compiler for running full programs. Go has saved drafts, downloads and an external playground link. Written exercises use self-review checklists.', 'Free to use, with public source code. No account or paid AI calls.'], live: true, url: 'https://thinkroom-khonsu.vercel.app/', source: 'https://github.com/khons-hu/khonsolve', android: 'https://github.com/khons-hu/khonsolve/releases/tag/android-v1.0.0-preview.1' },
  discovery: { title: 'Discovery routines', category: 'PERSONAL EXPERIMENT · SCHEDULED WORKFLOWS', description: 'A small set of weekly workflows for finding people whose work I want to follow.', notes: ['On X, the workflow prepares relevant account and notification recommendations. On GitHub, it is configured to follow up to three relevant developers per week after checking their projects and existing follows.', 'The topics include C++, developer tools, coding agents, AI research and CS2 tools. Each run is bounded, with duplicate checks and a short explanation of each selection.', 'These scheduled workflows use an AI agent to review candidates. The first scheduled run has not yet been verified.'] },
  portfolio: { title: 'This little corner of the web', category: 'CURRENT PROJECT · HTML / CSS / JAVASCRIPT', description: 'My personal portfolio, built with coding-agent assistance and plain browser tools.', notes: ['Terminal navigation, project notes, and a small guide with prepared answers in English, Slovak, Hungarian, Polish, Czech and German. The guide runs locally, without an AI API.', 'Light and dark themes, reduced-motion support, and animations that pause when the tab is hidden. No frontend framework or model download.', 'Deployed on Vercel, with updates published from GitHub. The source repository is private.'] },
  rotation: {"title": "Spotify rotation", "category": "PERSONAL EXPERIMENT · PYTHON / SPOTIFY API", "description": "A personal rotation and mood playlists on request. Built locally with Python.", "notes": ["A local Python script builds a private rotation from favourites and recent listening, without recurring AI calls.", "On request, it also searches by mood, activity or artist and favours familiar artists in the results. Mood matching is approximate, not audio analysis.", "The playlist is saved privately and checked after writing. This is a personal tool running on my Mac. The source is not published."]},
  dots: { title: 'Dots', category: '2023 GAME · REACT / SPRING BOOT', description: "My 2023 React game, adapted for browser-only play with its original look.", notes: ["Originally built with React and Spring Boot in 2023. The browser edition reuses the original React screens and dot images, with local game logic.", "Five levels, a power-up shop and guest play. No login or shared leaderboard. Play the browser edition online or explore the original source."], url: 'https://dots-khonsu.vercel.app/', source: 'https://github.com/khons-hu/Dots', live: true },
  bot: { title: 'CSLYS Discord Bot', category: 'EARLIER PROJECT · JAVASCRIPT', description: 'A JavaScript Discord bot with music playback.', notes: ['An earlier personal project combining JavaScript, Discord commands, and music playback.', 'The repository is historical. Music services and Discord APIs have changed since it was built.'], url: 'https://github.com/khons-hu/CSLYS-Discord-Bot' },
  ipc: { title: 'Between processes', category: 'UNIVERSITY TEAM PROJECT · C++', description: 'A team project exploring inter-process communication.', notes: ['Work from university, focused on how processes exchange information and coordinate.', 'Included as a snapshot of my C++ background.'], url: 'https://github.com/khons-hu/Inter-process-communication' }
};
const projectDialog = document.querySelector('#project-dialog');
let activeProject = null;
function showProject(id) {
  const project = projects[id];
  if (!project) return;
  activeProject = id;
  document.querySelector('#project-title').textContent = t(project.title);
  document.querySelector('#project-category').textContent = project.category.split(' · ').map(t).join(' · ');
  document.querySelector('#project-description').textContent = document.querySelector(`[data-project="${id}"] .project-info p`)?.textContent || t(project.description);
  document.querySelector('#project-notes').replaceChildren(...(globalThis.PortfolioI18n?.notes(id) || project.notes).map(note => { const p = document.createElement('p'); p.textContent = note; return p; }));
  const preview = document.querySelector('#project-preview');
  const previewUrl = document.querySelector(`[data-project="${id}"] .dialog-preview-hidden`)?.getAttribute('src');
  preview.hidden = !previewUrl;
  if (previewUrl) preview.src = previewUrl;
  else preview.removeAttribute('src');
  const link = document.querySelector('#project-link');
  const liveUrl = project.live ? project.url : null;
  link.hidden = !liveUrl;
  if (liveUrl) link.href = liveUrl; else link.removeAttribute('href');
  link.textContent = t('Open app ↗');
  document.querySelector('#project-source').textContent = t('Source on GitHub ↗');
  document.querySelector('#project-android').textContent = t('Android preview ↗');
  const source = document.querySelector('#project-source');
  const sourceUrl = project.source || (!project.live ? project.url : null);
  source.hidden = !sourceUrl || sourceUrl === liveUrl;
  if (!source.hidden) source.href = sourceUrl; else source.removeAttribute('href');
  const android = document.querySelector('#project-android');
  android.hidden = !project.android;
  if (project.android) android.href = project.android; else android.removeAttribute('href');
  if (!projectDialog.open) {
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
  }
}
window.addEventListener('portfolio:language',()=>{const status=document.querySelector('#copy-status');if(status.dataset.message)status.textContent=t(status.dataset.message);updateMotion();if(projectDialog.open && activeProject)showProject(activeProject);});
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => showProject(button.dataset.project)));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
});

const terminal = document.querySelector('#terminal-dialog');
const input = document.querySelector('#command');
const output = document.querySelector('#terminal-output');
const commands = ['help', 'about', 'projects', 'work', 'now', 'contact', 'clear', 'close'];
const history = [];
let historyPosition = 0;
let draft = '';
function openTerminal() { if (!terminal.open) terminal.showModal(); input.focus(); }
document.querySelectorAll('[data-terminal]').forEach(button => button.addEventListener('click', openTerminal));
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,[contenteditable="true"]') && !document.querySelector('dialog[open]')) {
    event.preventDefault(); openTerminal();
  }
});
function write(command, message, links = []) {
  const entry = document.createElement('div'); entry.className = 'terminal-entry';
  const prompt = document.createElement('strong'); prompt.textContent = `❯ ${command}`;
  entry.append(prompt, document.createTextNode(message));
  links.forEach(([text, target]) => {
    const a = document.createElement('a'); a.textContent = t(text); a.href = target;
    a.addEventListener('click', () => terminal.close());
    entry.append(document.createTextNode('\n'), a);
  });
  output.append(entry);
  while (output.children.length > 40) output.firstElementChild.remove();
  input.scrollIntoView({ block: 'nearest', behavior: 'instant' });
}
function run(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  history.push(raw.trim()); if (history.length > 60) history.shift();
  historyPosition = history.length; draft = ''; input.value = '';
  const responses = {
    help: ['about     the person behind the handle\nprojects  selected builds & experiments\nwork      Customer Support Partner L2\nnow       what I’m exploring\ncontact   find me elsewhere\nclear     clear this session\nclose     back to the page'],
    about: ['Patrick Obrtal. Online, khonsu.\nThe name dates to around 2022, inspired by Moon Knight.\nC++ roots, a master’s in Computer Science from TUKE,\nI now work as a Customer Support Partner L2 at Luigi’s Box.', [['Read about me ↗', '#about']]],
    projects: ['Khonproof · agent testing lab (source available)\nKhonodds · Polymarket research desk\nKhonrelay · AI news & RSS inbox\nKhonsolve · coding & reasoning practice\nKhonstash · Steam item watchlist (source available)\ncalculator · Arduino team project\nportfolio · this site, terminal & local guide\nrotation  · Spotify rotation & mood playlists\ndots      · original React game, browser edition (live)\nbot       · JavaScript Discord music bot\nipc       · C++ inter-process communication\n\nChoose a project card on the page for its notes.', [['Explore selected work ↗', '#projects']]],
    work: ['Customer Support Partner L2 at Luigi’s Box.\nBrowser debugging, APIs, feeds, audits, and analytics.\nReproduce → trace → fix → verify.', [['More about my work ↗', '#about']]],
    now: ['Agents and coding tools. New model capabilities.\nAGI and recursive self-improvement.\nI use coding agents and try new tools in my own projects.', [['On my desk ↗', '#now']]],
    contact: ['GitHub: khons-hu\nX: @ptr1337_\nDiscord: khons.hu', [['Open contact links ↗', '#contact']]]
  };
  if(globalThis.PortfolioI18n?.language !== 'en') {
    const sectionText = selector => [...document.querySelectorAll(selector)].map(p=>p.textContent).join('\n\n');
    responses.about[0] = sectionText('.about-intro > p:not(.eyebrow)');
    responses.work[0] = sectionText('.work-detail > p:not(.eyebrow)');
    responses.now[0] = sectionText('.now-grid article p');
    responses.projects[0] = [...document.querySelectorAll('.project-info')].map(p=>p.querySelector('h3').textContent+'\n'+p.querySelector('p').textContent).join('\n\n');
    responses.help = [['about · '+t('ABOUT ME'),'projects · '+t('SELECTED WORK'),'work · Customer Support Partner L2','now · '+t('ON MY DESK'),'contact · '+t('Contact'),'clear · '+t('Clear chat'),'close · '+t('Close terminal')].join('\n')];
  }
  if (command === 'clear') output.replaceChildren();
  else if (command === 'close') terminal.close();
  else if (responses[command]) write(command, ...responses[command]);
  else write(raw.trim(), t(`Unknown command. Try “help”.`));
}
document.querySelector('#terminal-form').addEventListener('submit', event => { event.preventDefault(); run(input.value); });
document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => { run(button.dataset.command); input.focus(); }));
input.addEventListener('keydown', event => {
  if (event.key === 'Tab' && !event.shiftKey) {
    const prefix = input.value.trim().toLowerCase();
    const matches = prefix ? commands.filter(command => command.startsWith(prefix)) : [];
    if (matches.length === 1) { event.preventDefault(); input.value = matches[0]; }
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault(); if (historyPosition === history.length) draft = input.value;
    historyPosition = Math.max(0, historyPosition - 1); input.value = history[historyPosition] || draft;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault(); historyPosition = Math.min(history.length, historyPosition + 1);
    input.value = historyPosition === history.length ? draft : history[historyPosition];
  }
});
document.querySelector('#copy-discord').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('khons.hu'); status.dataset.message='Copied khons.hu. See you on Discord.'; status.textContent = t(status.dataset.message); }
  catch { status.dataset.message='Find me on Discord: khons.hu'; status.textContent = t(status.dataset.message); }
});
