'use strict';
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let motionPreference;
try { motionPreference = localStorage.getItem('khonsu-motion'); } catch {}
function updateMotion() {
  const disabled = reducedMotion.matches || motionPreference === 'off';
  root.classList.toggle('motion-off', disabled);
  root.classList.toggle('js-motion', !disabled);
  motionButton.textContent = reducedMotion.matches ? 'Motion: reduced' : `Motion: ${disabled ? 'off' : 'on'}`;
  motionButton.setAttribute('aria-pressed', String(disabled));
  motionButton.disabled = reducedMotion.matches;
}
updateMotion();
reducedMotion.addEventListener('change', updateMotion);
motionButton.addEventListener('click', () => {
  motionPreference = root.classList.contains('motion-off') ? 'on' : 'off';
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
  discovery: { title: 'Discovery routines', category: 'PERSONAL EXPERIMENT · SCHEDULED WORKFLOWS', description: 'A small set of weekly workflows for finding people whose work I want to follow.', notes: ['On X, the workflow prepares relevant account and notification recommendations. On GitHub, it is configured to follow up to three relevant developers per week after checking their projects and existing follows.', 'The topics include C++, developer tools, coding agents, AI research and CS2 tools. Each run is bounded, with duplicate checks and a short explanation of each selection.', 'These scheduled workflows use an AI agent to review candidates. The first scheduled run has not yet been verified.'] },
  portfolio: { title: 'This little corner of the web', category: 'CURRENT PROJECT · HTML / CSS / JAVASCRIPT', description: 'My personal portfolio, built with coding-agent assistance and plain browser tools.', notes: ['Terminal navigation, project notes, and a small guide with prepared answers in English, Slovak, Hungarian, Polish, Czech and German. The guide runs locally, without an AI API.', 'Light and dark themes, reduced-motion support, and animations that pause when the tab is hidden. No frontend framework or model download.', 'Deployed on Vercel, with updates published from GitHub. The source repository is private.'] },
  rotation: { title: 'Spotify rotation', category: 'PERSONAL EXPERIMENT · PYTHON / SPOTIFY API', description: 'A local automation that builds a private Spotify playlist from my recent listening and favourites.', notes: ['The script combines short-term and medium-term favourites with recently played tracks, removes duplicates, and limits repetition by artist.', 'A local scheduler checks when an update is due. The recurring job uses the Spotify API directly, without ongoing LLM calls.', 'This is a personal experiment. The source is not published.'] },
  dots: { title: 'Dots', category: 'EARLIER PROJECT · REACT / SPRING BOOT', description: 'A web game built with a React frontend and Spring Boot backend.', notes: ['An earlier example of my full-stack work, connecting an interactive browser interface with a Java backend.', 'This repository is an archive of that stage of my development, not a recently maintained product.'], url: 'https://github.com/khons-hu/Dots' },
  bot: { title: 'CSLYS Discord Bot', category: 'EARLIER PROJECT · JAVASCRIPT', description: 'A JavaScript Discord bot with music playback.', notes: ['An earlier personal project combining JavaScript, Discord commands, and music playback.', 'The repository is historical. Music services and Discord APIs have changed since it was built.'], url: 'https://github.com/khons-hu/CSLYS-Discord-Bot' },
  ipc: { title: 'Between processes', category: 'UNIVERSITY TEAM PROJECT · C++', description: 'A team project exploring inter-process communication.', notes: ['Work from university, focused on how processes exchange information and coordinate.', 'Included as a snapshot of my C++ background.'], url: 'https://github.com/khons-hu/Inter-process-communication' }
};
const projectDialog = document.querySelector('#project-dialog');
function showProject(id) {
  const project = projects[id];
  if (!project) return;
  document.querySelector('#project-title').textContent = project.title;
  document.querySelector('#project-category').textContent = project.category;
  document.querySelector('#project-description').textContent = project.description;
  document.querySelector('#project-notes').replaceChildren(...project.notes.map(note => { const p = document.createElement('p'); p.textContent = note; return p; }));
  const link = document.querySelector('#project-link');
  link.hidden = !project.url;
  if (project.url) link.href = project.url; else link.removeAttribute('href');
  projectDialog.showModal();
}
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
    const a = document.createElement('a'); a.textContent = text; a.href = target;
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
    about: ['Patrick Obrtal. Online, khonsu.\nC++ roots, a master’s in Computer Science from TUKE,\nI now work as a Customer Support Partner L2 at Luigi’s Box.', [['Read about me ↗', '#about']]],
    projects: ['discovery · weekly X & GitHub workflows\nportfolio · this site, terminal & local guide\nrotation  · local Spotify automation\ndots      · React + Spring Boot web game\nbot       · JavaScript Discord music bot\nipc       · C++ inter-process communication\n\nChoose a project card on the page for its notes.', [['Explore selected work ↗', '#projects']]],
    work: ['Customer Support Partner L2 at Luigi’s Box.\nBrowser debugging, APIs, feeds, audits, and analytics.\nReproduce → trace → fix → verify.', [['More about my work ↗', '#about']]],
    now: ['Agents and coding tools. New model capabilities.\nAGI and recursive self-improvement.\nI use coding agents and try new tools in my own projects.', [['On my desk ↗', '#now']]],
    contact: ['GitHub: khons-hu\nX: @ptr1337_\nDiscord: khons.hu', [['Open contact links ↗', '#contact']]]
  };
  if (command === 'clear') output.replaceChildren();
  else if (command === 'close') terminal.close();
  else if (responses[command]) write(command, ...responses[command]);
  else write(raw.trim(), `Unknown command. Try “help”.`);
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
  try { await navigator.clipboard.writeText('khons.hu'); status.textContent = 'Copied khons.hu. See you on Discord.'; }
  catch { status.textContent = 'Find me on Discord: khons.hu'; }
});
