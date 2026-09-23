'use strict';
const terminal = document.querySelector('#terminal-dialog');
const input = document.querySelector('#command');
const output = document.querySelector('#terminal-output');
const commands = ['help', 'about', 'projects', 'work', 'now', 'contact', 'status', 'lore', 'theme', 'ask', 'email', 'open', 'clear', 'close'];
const projectAliases = {proof:'proof',khonproof:'proof',khonsolve:'thinkroom',thinkroom:'thinkroom',khonrelay:'signal',signal:'signal',khonodds:'market',market:'market',khonstash:'steam',steam:'steam',dots:'dots',receipts:'receipts','receipts-after-dark':'receipts','save-democracy':'save-democracy',save:'save-democracy',portfolio:'portfolio',spotify:'rotation',rotation:'rotation',calculator:'calculator',arduino:'calculator',bot:'bot',ipc:'ipc'};
const publicProjectIds = [...document.querySelectorAll('[data-project]')].map(card => card.dataset.project);
const projectCommand = id => 'open ' + (Object.keys(projectAliases).find(key => key.startsWith('khon') && projectAliases[key] === id) || id);
const completionCommands = [...commands.filter(command => command !== 'open'), ...publicProjectIds.map(projectCommand)];
const terminalCopy = {
  en: { welcome: "A few shortcuts around here.", hint: "Projects, a bit about me, or a message. Start below or type help.", status: 'Public builds, kept deliberately small.', lore: 'khonsu came from a Moon Knight reference around 2022.\nIt stuck, so I kept it.', theme: 'Theme switched.', open: 'Choose a project after open. Try: open khonrelay.', help: 'status · live public builds\nlore · why khonsu\ntheme · switch light / dark\nopen <project> · project notes' },
  sk: { welcome: "Pár skratiek po tomto webe.", hint: "Projekty, niečo o mne alebo správa. Vyber si nižšie alebo napíš help.", status: 'Verejné projekty, zámerne malé.', lore: 'khonsu vzniklo z odkazu na Moon Knight okolo roku 2022.\nOstalo to, tak som si to nechal.', theme: 'Téma prepnutá.', open: 'Za open vyber projekt. Skús: open khonrelay.', help: 'status · živé verejné projekty\nlore · prečo khonsu\ntheme · prepne svetlú / tmavú tému\nopen <project> · poznámky k projektu' },
  hu: { welcome: "Néhány rövid út az oldalon.", hint: "Projektek, pár szó rólam vagy egy üzenet. Válassz alább, vagy írd be: help.", status: 'Nyilvános projektek, szándékosan kicsik.', lore: 'a khonsu név egy 2022 körüli Moon Knight utalásból jött.\nMegmaradt, ezért megtartottam.', theme: 'Téma váltva.', open: 'Az open után válassz projektet. Példa: open khonrelay.', help: 'status · élő nyilvános projektek\nlore · miért khonsu\ntheme · világos / sötét téma\nopen <project> · projektjegyzetek' },
  pl: { welcome: "Kilka skrótów po tej stronie.", hint: "Projekty, trochę o mnie albo wiadomość. Wybierz niżej lub wpisz help.", status: 'Publiczne projekty, celowo niewielkie.', lore: 'khonsu pochodzi od odniesienia do Moon Knight około 2022 roku.\nZostało ze mną, więc je zachowałem.', theme: 'Motyw przełączony.', open: 'Po open wybierz projekt. Spróbuj: open khonrelay.', help: 'status · publiczne projekty na żywo\nlore · skąd khonsu\ntheme · jasny / ciemny motyw\nopen <project> · notatki o projekcie' },
  de: { welcome: "Ein paar Abkürzungen durch die Seite.", hint: "Projekte, etwas über mich oder eine Nachricht. Wähle unten oder tippe help.", status: 'Öffentliche Projekte, bewusst klein gehalten.', lore: 'khonsu stammt von einer Moon-Knight-Referenz um 2022.\nDer Name blieb, also habe ich ihn behalten.', theme: 'Theme gewechselt.', open: 'Wähle ein Projekt nach open. Versuch: open khonrelay.', help: 'status · öffentliche Live-Projekte\nlore · warum khonsu\ntheme · helles / dunkles Theme\nopen <project> · Projektnotizen' },
  es: { welcome: "Algunos atajos por aquí.", hint: "Proyectos, un poco sobre mí o un mensaje. Elige abajo o escribe help.", status: 'Proyectos públicos, deliberadamente pequeños.', lore: 'khonsu viene de una referencia a Moon Knight alrededor de 2022.\nSe quedó, así que lo mantuve.', theme: 'Tema cambiado.', open: 'Elige un proyecto después de open. Prueba: open khonrelay.', help: 'status · proyectos públicos en vivo\nlore · por qué khonsu\ntheme · tema claro / oscuro\nopen <project> · notas del proyecto' },
  cs: { welcome: "Pár zkratek po tomto webu.", hint: "Projekty, něco o mně nebo zpráva. Vyber si níže nebo napiš help.", status: 'Veřejné projekty, záměrně malé.', lore: 'khonsu vzniklo z odkazu na Moon Knight kolem roku 2022.\nZůstalo to, tak jsem si to nechal.', theme: 'Motiv přepnut.', open: 'Za open vyber projekt. Zkus: open khonrelay.', help: 'status · živé veřejné projekty\nlore · proč khonsu\ntheme · světlý / tmavý motiv\nopen <project> · poznámky k projektu' }
};
function terminalStrings() { return terminalCopy[globalThis.PortfolioI18n?.language] || terminalCopy.en; }
function updateTerminalWelcome() {
  const welcome = document.querySelector('#terminal-welcome');
  const copy = terminalStrings();
  welcome.replaceChildren(copy.welcome, document.createElement('br'));
  const hint = document.createElement('span'); hint.textContent = copy.hint;
  welcome.append(hint);
  input.placeholder = t('Type a command…');
  renderSuggestions();
}
const history = [];
let historyPosition = 0;
let draft = '';
function openTerminal() { window.PortfolioPanels.open('terminal-dialog', matchMedia('(pointer: coarse)').matches ? null : '#command'); }
document.querySelectorAll('[data-terminal]').forEach(button => button.addEventListener('click', openTerminal));
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,[contenteditable="true"]') && !document.querySelector('dialog[open]')) {
    event.preventDefault(); openTerminal();
  }
});
function write(command, message, links = [], projectItems = []) {
  const entry = document.createElement('div'); entry.className = 'terminal-entry';
  const prompt = document.createElement('strong'); prompt.textContent = `❯ ${command}`;
  entry.append(prompt, document.createTextNode(message));
  links.forEach(([text, target]) => {
    const a = document.createElement('a'); a.textContent = t(text); a.href = target;
    if (target.startsWith('#')) a.addEventListener('click', () => terminal.close());
    else { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    entry.append(document.createTextNode('\n'), a);
  });
  if (projectItems.length) {
    const list = document.createElement('div'); list.className = 'terminal-projects';
    for (const item of projectItems) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'terminal-project';
      const title = document.createElement('span'); title.textContent = t(item.title) + ' ↗';
      const description = document.createElement('small'); description.textContent = item.description;
      button.append(title, description);
      button.addEventListener('click', () => { terminal.close(); showProject(item.id); });
      list.append(button);
    }
    entry.append(list);
  }
  output.append(entry);
  while (output.children.length > 40) output.firstElementChild.remove();
  entry.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function renderSuggestions() {
  const host = document.querySelector('#terminal-suggestions');
  const prefix = input.value.trim().toLowerCase();
  const matches = prefix ? completionCommands.filter(command => command.startsWith(prefix) && command !== prefix).slice(0,5) : [];
  host.replaceChildren(...matches.map(command => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = command;
    button.addEventListener('click', () => { input.value = command; renderSuggestions(); input.focus(); });
    return button;
  }));
  host.hidden = !matches.length;
}
function run(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  const [verb, ...arguments_] = command.split(/\s+/);
  const argument = arguments_.join(' ');
  history.push(raw.trim()); if (history.length > 60) history.shift();
  historyPosition = history.length; draft = ''; input.value = '';
  renderSuggestions();
  const catalog = [...document.querySelectorAll('[data-project]')].map(card => ({
    id: card.dataset.project,
    title: projects[card.dataset.project].title,
    description: card.querySelector('.project-info p').textContent
  }));
  const responses = {
    help: ['about     the person behind the handle\nprojects  selected builds & experiments\nwork      Customer Support Partner L2\nnow       what I’m exploring\ncontact   find me elsewhere\nclear     clear terminal output and history\nclose     back to the page'],
    about: ['Patrick Obrtal. Online, khonsu.\nThe name dates to around 2022, inspired by Moon Knight.\nC++ roots, a master’s in Computer Science from TUKE,\nI now work as a Customer Support Partner L2 at Luigi’s Box.', [['Read about me ↗', '#about']]],
    projects: [t('Pick a project to read its notes.'), [], catalog],
    work: ['Customer Support Partner L2 at Luigi’s Box.\nBrowser debugging, APIs, feeds, audits, and analytics.\nReproduce → trace → fix → verify.', [['More about my work ↗', '#about']]],
    now: [[...document.querySelectorAll('.now-grid article p')].map(p => p.textContent).join('\n\n'), [['On my desk ↗', '#now']]],
    contact: ['GitHub: khons-hu\nX: @ptr1337_\nDiscord: khons.hu\n\n' + t('Use email to write me, or ask to open the guide.'), [['Open contact links ↗', '#contact']]],
    status: [terminalStrings().status, catalog.filter(item => projects[item.id].live).map(item => [item.title + ' ↗', projects[item.id].url])],
    lore: [terminalStrings().lore]
  };
  responses.help[0] += '\n' + terminalStrings().help;
  if(globalThis.PortfolioI18n?.language !== 'en') {
    const sectionText = selector => [...document.querySelectorAll(selector)].map(p=>p.textContent).join('\n\n');
    responses.about[0] = sectionText('.about-intro > p:not(.eyebrow)');
    responses.work[0] = sectionText('.work-detail > p:not(.eyebrow)');
    responses.help = [['about · '+t('ABOUT ME'),'projects · '+t('SELECTED WORK'),'work · Customer Support Partner L2','now · '+t('ON MY DESK'),'contact · '+t('Contact'),terminalStrings().help,'clear · '+t('Clear chat'),'close · '+t('Close terminal')].join('\n')];
  }
  responses.help[0] += '\nask · ' + t('Ask khonsu') + '\nemail · ' + t('Email Patrick');
  if (verb === 'open') {
    const id = (Object.hasOwn(projectAliases, argument) ? projectAliases[argument] : null) || (catalog.some(item => item.id === argument) ? argument : null);
    if (!id) write(raw.trim(), terminalStrings().open);
    else { terminal.close(); showProject(id); }
  }
  else if (command === 'ask') window.PortfolioPanels.open('guide-dialog');
  else if (command === 'email') window.PortfolioPanels.open('email-dialog', 'input[type="email"]');
  else if (command === 'theme') { document.querySelector('#theme-toggle').click(); write(command, terminalStrings().theme); }
  else if (command === 'clear') { output.replaceChildren(); history.length = 0; historyPosition = 0; draft = ''; }
  else if (command === 'close') terminal.close();
  else if (Object.hasOwn(responses, command)) write(command, ...responses[command]);
  else write(raw.trim(), t(`Unknown command. Try “help”.`));
}
document.querySelector('#terminal-form').addEventListener('submit', event => { event.preventDefault(); run(input.value); });
document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => { run(button.dataset.command); if (terminal.open && !matchMedia('(pointer: coarse)').matches) input.focus(); }));
input.addEventListener('input', renderSuggestions);
input.addEventListener('keydown', event => {
  if (event.key === 'Tab' && !event.shiftKey) {
    const prefix = input.value.trim().toLowerCase();
    const matches = prefix ? completionCommands.filter(command => command.startsWith(prefix)) : [];
    if (matches.length === 1) { event.preventDefault(); input.value = matches[0]; renderSuggestions(); }
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault(); if (historyPosition === history.length) draft = input.value;
    historyPosition = Math.max(0, historyPosition - 1); input.value = history[historyPosition] || draft;
    renderSuggestions();
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault(); historyPosition = Math.min(history.length, historyPosition + 1);
    input.value = historyPosition === history.length ? draft : history[historyPosition];
    renderSuggestions();
  }
});
updateTerminalWelcome();
