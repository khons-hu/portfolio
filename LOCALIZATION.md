# Languages

The interface supports English, Slovak, Hungarian, Polish, German, Spanish and Czech. It starts with the browser language, falls back to English and remembers an explicit choice in `khonsu-language`. Storage being blocked does not prevent switching.

`site-locales.js` contains authored UI translations and project notes. `i18n.js` binds existing authored text nodes once, then updates those bindings on selection. It does not observe mutations, translate arbitrary rendered data or call a translation service. New dynamic UI uses `PortfolioI18n.t()` explicitly. Keep all catalogs aligned and run `node --test tests/*.test.cjs`.

The guide and contact form use their existing catalogs, including Spanish. Changing the site language also changes the guide. A separate guide-language choice is remembered until the visitor changes the site language again. Typed questions, contact drafts, links, handles, project names and terminal command keywords are not translated. Existing conversation and terminal history keep the language they were written in.

Public role names and technology names stay as authored. Upstream or user-authored content is never passed through a model. Localized project notes preserve the same availability and notification limits.
