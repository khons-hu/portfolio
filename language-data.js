/* One language registry for the page, guide, terminal and browser preference matching. */
const LANGUAGE_NAMES = {
  en:'English', sk:'Slovenčina', hu:'Magyar', pl:'Polski', de:'Deutsch', es:'Español', cs:'Čeština',
  pt:'Português', fr:'Français', zh:'简体中文', hi:'हिन्दी', ar:'العربية', bn:'বাংলা',
  ru:'Русский', ur:'اردو', id:'Bahasa Indonesia', ja:'日本語'
};
const EXTRA_LOCALE_PACKS = typeof module !== 'undefined' && module.exports
  ? {...require('./extra-locales-west.js'), ...require('./extra-locales-asia.js')}
  : {...EXTRA_LOCALES_WEST, ...EXTRA_LOCALES_ASIA};
const languageDirection = language => ['ar','ur'].includes(language) ? 'rtl' : 'ltr';
// Isolate Latin names, code terms and addresses inside authored RTL prose.
// Stored translations stay plain text. User drafts and guide questions are never rewritten.
// A run ends on a letter, digit, + or _ so sentence punctuation and brackets stay with the RTL
// sentence, stacks such as "TypeScript / RSS" stay in reading order, and {placeholders} stay intact.
const LATIN_TOKEN = "[A-Za-z0-9@](?:[A-Za-z0-9@_+./:'’\\-]*[A-Za-z0-9+_])?";
const LATIN_RUN = new RegExp(`(\\{[a-z]+\\})|${LATIN_TOKEN}(?:(?: *[/·&,] *| +)${LATIN_TOKEN})*`, 'g');
const directionalText = (text,language) => languageDirection(language) === 'rtl'
  ? String(text).replace(LATIN_RUN, (value, placeholder) => placeholder ? value : '\u2066'+value+'\u2069') : text;
if (typeof module !== 'undefined' && module.exports) module.exports = {LANGUAGE_NAMES, EXTRA_LOCALE_PACKS, languageDirection, directionalText};
