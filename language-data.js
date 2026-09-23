/* One language registry for the page, guide, terminal and browser preference matching. */
const LANGUAGE_NAMES = {
  en:'English', sk:'Slovenčina', hu:'Magyar', pl:'Polski', de:'Deutsch', es:'Español', cs:'Čeština',
  pt:'Português', fr:'Français', zh:'简体中文', hi:'हिन्दी', ar:'العربية', bn:'বাংলা',
  ru:'Русский', ur:'اردو', id:'Bahasa Indonesia', ja:'日本語'
};
// These languages ship as separate files in /locales and load only when chosen.
const LAZY_LANGUAGES = ['pt','fr','zh','hi','ar','bn','ru','ur','id','ja'];
const IS_NODE = typeof module !== 'undefined' && module.exports;
// In the browser this is the live registry that /locales/<lang>.js files write into.
// In Node (tests) every pack is loaded, with its guide keywords merged back in.
const GUIDE_KEYWORDS = IS_NODE ? require('./locales/guide-keywords.js') : (globalThis.KHONSU_GUIDE_KEYWORDS || {});
const EXTRA_LOCALE_PACKS = IS_NODE
  ? Object.fromEntries(LAZY_LANGUAGES.map(lang => {
      const pack = JSON.parse(JSON.stringify(require(`./locales/${lang}.js`)));
      pack.guide.keywords = GUIDE_KEYWORDS[lang] || {};
      return [lang, pack];
    }))
  : (globalThis.KHONSU_LOCALE_PACKS = globalThis.KHONSU_LOCALE_PACKS || {});
const languageDirection = language => ['ar','ur'].includes(language) ? 'rtl' : 'ltr';
// Isolate Latin names, code terms and addresses inside authored RTL prose.
// Stored translations stay plain text. User drafts and guide questions are never rewritten.
// A run ends on a letter, digit, + or _ so sentence punctuation and brackets stay with the RTL
// sentence, stacks such as "TypeScript / RSS" stay in reading order, and {placeholders} stay intact.
const LATIN_TOKEN = "[A-Za-z0-9@](?:[A-Za-z0-9@_+./:'’\\-]*[A-Za-z0-9+_])?";
const LATIN_RUN = new RegExp(`(\\{[a-z]+\\})|${LATIN_TOKEN}(?:(?: *[/·&,] *| +)${LATIN_TOKEN})*`, 'g');
const directionalText = (text,language) => languageDirection(language) === 'rtl'
  ? String(text).replace(LATIN_RUN, (value, placeholder) => placeholder ? value : '⁦'+value+'⁩') : text;

// Fetch one language pack on demand. theme.js may already have started the request in <head>.
// Resolves at once when the language is built in or already loaded; rejects if the file fails.
const LOCALE_VERSION = !IS_NODE && document.currentScript ? new URL(document.currentScript.src).search : '';
const localeRequests = {};
function loadLocale(language) {
  if (!LAZY_LANGUAGES.includes(language) || EXTRA_LOCALE_PACKS[language]) return Promise.resolve();
  if (localeRequests[language]) return localeRequests[language];
  const request = new Promise((resolve, reject) => {
    let script = document.querySelector(`script[data-locale="${language}"]`);
    if (script?.dataset.failed) script.remove(), script = null;
    const done = () => EXTRA_LOCALE_PACKS[language] ? resolve() : reject(new Error('locale ' + language));
    if (!script) {
      script = document.createElement('script');
      script.src = `/locales/${language}.js${LOCALE_VERSION}`;
      script.dataset.locale = language;
      document.head.append(script);
    }
    script.addEventListener('load', done, {once: true});
    script.addEventListener('error', () => { script.dataset.failed = '1'; done(); }, {once: true});
  });
  // A failed request can be retried later, for example after the connection returns.
  localeRequests[language] = request.catch(error => { delete localeRequests[language]; throw error; });
  return localeRequests[language];
}
const isLocaleReady = language => !LAZY_LANGUAGES.includes(language) || Boolean(EXTRA_LOCALE_PACKS[language]);
if (IS_NODE) module.exports = {LANGUAGE_NAMES, LAZY_LANGUAGES, EXTRA_LOCALE_PACKS, GUIDE_KEYWORDS, languageDirection, directionalText, loadLocale, isLocaleReady};
