# khonsu / personal portfolio

Published on Vercel Hobby: https://khons-hu.vercel.app/

Deployed via Vercel Drop to Deploy on 2026-09-20 in NextWave (next-wave10), project khonsu. The GitHub repository is public: https://github.com/khons-hu/portfolio. GitHub autodeploy is connected to khons-hu/portfolio. Pushes to main create Production deployments and update khons-hu.vercel.app. Verified with commit 26466a4 on 2026-09-20. The initial khonsu-ochre.vercel.app address redirects to the clean address.

Static HTML, CSS, and JavaScript, without a frontend framework or build step. No analytics or background model calls. Project artwork is illustrative. Some project dialogs also include screenshots. The contact form sends only the visitor’s email and message through FormSubmit when submitted.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then visit http://127.0.0.1:4173.

## Vercel

The public repository khons-hu/portfolio is connected to the existing Vercel project. Static files deploy without a build step. Vercel provides the `vercel.app` address. No paid services are needed for this static personal site within Hobby limits.

## Interaction

`/` opens the terminal. Commands: `help`, `about`, `projects`, `work`, `now`, `contact`, `status`, `lore`, `theme`, `ask`, `email`, `open <project>`, `clear`, `close`. The project list and live links follow the cards on the page. Try `open receipts` or `open khonrelay`. Suggested commands appear as you type. Tab completes unambiguous commands and project names, arrows recall session history while preserving your unfinished input, and Escape closes dialogs. The `projects` result has clickable notes. `clear` removes this terminal’s output and history.

Terminal, Ask khonsu and Email are tabs in one panel frame, so the frame and tabs stay in place when switching. Switching keeps the current conversation and email draft in their separate panels, and keyboard focus lands on the matching tab. The command field stays visible while results scroll. `help` is an aligned command table in every supported language; command words stay untranslated. Touch screens hide the keyboard-only hint.

Ordinary navigation works throughout. Compact project cards (three, two or one per row) show a small lunar tile, the title, a tagline and a one-line description. Each card has on-page **Notes →** and, where one exists, one outside link: a filled pill for a hosted demo or playable build, an outlined pill for source, a download page or a playlist. Across the site ↗ leaves the site and → stays on the page. Search by name, technology or topic, together with the tools, games and earlier-work filters. Search is local and is not stored or sent anywhere.

Cards open keyboard-accessible notes. The notes put their outside links (demo, playlist or itch.io page, public source, Android preview) above the longer text. “Copy project link” gives a direct address such as https://khons-hu.vercel.app/#project/khonrelay. It opens those notes on arrival. If clipboard access is unavailable, the address remains selectable. Shared links exclude query parameters.

## Motion and resource use

When motion is allowed: dialogs and tool panels fade in and out with their backdrop (discrete transitions where supported, a simple entrance elsewhere), switching Terminal / Ask khonsu / Email keeps the frame still and only fades the content, filter chips morph the project grid with View Transitions where supported (typing in search stays instant), the About accordion grows by height, terminal and guide output fades in, and cards lift 2 px on hover. The page behind an open dialog no longer scrolls. Motion Off, the system reduced-motion setting (unless Motion is On) and hidden tabs switch everything instantly.

Finite entrance and reveal transitions. Hover effects use transform. No animation loop, canvas, video, WebGL, page-scroll handler, polling or third-party font. Visual viewport events keep the terminal and email panel within the available screen height. Reveals stop observing after their first appearance. Hidden-tab motion is disabled. Motion has three saved choices: System follows the OS, On explicitly enables the small transitions, and Off disables them. Preferences are stored for this site in the visitor’s browser. Terminal output and history are bounded.

## Sharing, 404 and weight

Link previews use Open Graph and Twitter card tags with `assets/og-image.jpg` (1200×630, made from the hero photo and wordmark). Direct project links share the same card. `404.html` is a small page in the site style with a home link; its short copy is in `not-found.js` for all 17 languages, and it loads no language packs. The hero photo is served as AVIF (`assets/moonlight.avif`, about 54 KB) with the JPEG as fallback. A visit in English downloads no extra language files.

The floating guide button steps aside while a small link or button sits under it, using an IntersectionObserver sized to the button, with no scroll handler. Keyboard focus always brings it back. Without JavaScript, controls that need it (Notes, terminal, guide, theme, motion, language) are hidden; content, outside links and email stay available.

## Listening now (Spotify)

`api/now-playing.js` is a Vercel Node function that asks Spotify what is playing and returns only the track title, artists and its `open.spotify.com` link. It never returns history, artwork, device, playlist or progress details, and it refuses tokens with anything beyond read-only playback scopes. Answers are cached on the CDN for 30–60 seconds (up to 5 minutes when rate-limited or unconfigured), so visitors share one Spotify request. `now-playing.js` shows one quiet line in On my desk only while a track is confirmed playing and fresh; paused, private session, podcasts, ads, local files, errors and anything older than the track's end or 150 seconds stay hidden. It polls once a minute only while the tab is visible and stops for the visit if the server is unconfigured. The page never plays audio.

Credentials live only in Vercel environment variables: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN` (authorised with `user-read-currently-playing` only). To create the token, run `SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-now-playing-token.mjs` on your Mac; it opens Spotify's consent page, copies the refresh token to the clipboard without printing it, and is excluded from deployment. The redirect URI `http://127.0.0.1:8888/callback` must be listed in the Spotify app's settings. Add the three variables to the Production environment and redeploy. The local playlist tool (`com.khonsu.playlists`) keeps its own separate authorisation.

## Content updates

Edit index.html for the page and project groups, app.js for project notes, project-links.js for public link slugs, and site-locales.js for translations. Edit terminal.js for commands and panels.js for the shared tool navigation. The terminal derives its project catalog from the cards. No private client details, CV download, invented results, or unpublished source links are included.

## Verified locally

2026-09-23 notebook refresh: `node --test tests/*.test.cjs` (40 tests) plus a scripted Chrome pass (52 checks) against the local server: search and filters, empty state, card notes versus outside links, deep links and hash reset, Escape and focus return, terminal completion, history with draft, help, clear, panel frame and draft isolation, empty-form validation with FormSubmit blocked at the network layer, five rapid theme toggles, motion cycling, header tab order, language picker and 320px layout. Screenshots compared before and after at 1440, 390 and 320px, both themes, all seven languages for visible labels. Chrome headless only; no physical device, Safari, Firefox or BrowserStack pass. No email was sent.

Earlier pass:


Desktop, 390px and 320px layouts visually reviewed. Search, combined filters, empty results, direct project links, copy feedback, Escape and restored focus checked in the browser. English, German and Hungarian UI exercised. Both themes reviewed. The updated terminal, shared navigation and email panel were also checked in English and Slovak at 390px and 320px. Command suggestions, project completion, clickable results, draft retention and separation from the page contact form were verified. No test email was sent during this UI pass. Clipboard failure and unknown links covered by automated tests. These are browser viewport checks, not real-device or BrowserStack tests. No horizontal overflow on mobile. Verified project modal, Escape, terminal autocomplete, command execution, history, unknown-command handling, clear, and navigation closing the terminal. No browser console warnings or errors observed. OS reduced-motion preference is active on the test machine and correctly disables motion. Normal-motion timing and numerical CPU profiling have not been measured.

## Ask khonsu guide

guide.js answers through the optional AI endpoint (see Optional AI guide) and keeps a rule-based guide with prepared answers in every language for when AI is not configured or a request fails. No model downloads, tracking, or persisted chat history. The language selector translates the guide interface and chooses the reply language. Only the language preference is saved locally. Supports project dialogs and section navigation, caps the visible log at 30 messages, and renders every message as plain text with textContent. Unknown questions receive a fallback. Edit the topic records when public profile facts change.

Chat interface: a waiting line (a still crescent, shown only after 300 ms) marks a pending reply and is announced through a status region. Replies keep their paragraphs; light Markdown markers from the model are removed, never rendered. Long replies open at their first line. While a reply is pending, send and the suggestions rest (`aria-disabled`, so focus stays), the field stays editable, and Clear cancels. A follow-up sent within five seconds waits out the server's per-visitor spacing, and one `Retry-After` 429 is retried once; other failures show a labelled prepared answer and keep the recent context.

Verified: topic routing, Slovak accents, unknown/private-question fallbacks, opening a project from chat, clearing conversation, and mobile dialog layout.

## Appearance

Light/dark toggle in the header. Initially follows the system theme, then remembers the visitor’s choice locally. Dark is midnight and ice; light is a warm paper tone rather than white, with the hero photo shown as a soft daylight negative. Switching fades colours for about 0.4 s with one small arc at the toggle; motion Off, reduced motion and hidden tabs skip it. System fonts only: Georgia for the opening title, Avenir Next / Segoe UI / system UI for everything else, and ui-monospace / Menlo inside the terminal. Styles live in one token-based `style.css`.


## Contact email

Contact links: email, GitHub, LinkedIn (https://www.linkedin.com/in/patrick-obrtal/), X and a copyable Discord handle. The terminal `contact` command and the guide's contact answer (all 17 languages) name the same channels, and `tests/profile-links.test.cjs` keeps them aligned.

The contact section has a multilingual contact form addressed only to ptr.obrtal@gmail.com. The same form is available in the Email panel from the terminal or Ask khonsu. Their drafts are separate and remain only for the current page session. It sends the reply email and message through FormSubmit. It never includes guide questions or chat history. No API key or email credentials are bundled.

The recipient is activated and FormSubmit accepted the publication test on 20 September 2026. Sending is enabled. The mailto fallback remains available. A successful provider response means submission accepted, not proven inbox delivery; inbox receipt has not been independently checked.

Run `node --test tests/*.test.cjs` for contact validation, payload isolation, activation/failure handling, theme and project navigation regressions, and terminal completion, safe text rendering, history and output limits. FormSubmit provides spam filtering. The local honeypot is only an extra signal, not a server-side abuse guarantee.


### Languages

The page, project notes, terminal help and local guide support English, Slovak, Hungarian, Polish, German, Spanish, Czech, Portuguese, French, Simplified Chinese, Hindi, Arabic, Bengali, Russian, Urdu, Indonesian and Japanese. The native picker keeps the header compact. Saved choices take priority, followed by supported browser preferences, then English. Portuguese regional tags share one Portuguese catalog. Traditional Chinese is not relabelled as Simplified Chinese.

Arabic and Urdu use right-to-left layouts, set before first paint by `theme.js` so the page never flips after loading. The hero photo is mirrored and on-page arrows point left. Handles, email addresses, technology stacks and terminal commands keep their original direction; sentence punctuation and `{count}` placeholders stay outside those isolated runs. All copy ships as local JavaScript. No translation API, tracking or model download is used. Without AI, the guide matches prepared topics; with AI enabled it answers from the public facts in `api/chat.js` (see Optional AI guide). The new translations are model-assisted and have not had native-speaker review.

`language-data.js` holds the common registry and loads packs on demand. English, Slovak, Hungarian, Polish, German, Spanish and Czech are built in (`site-locales.js`, `guide-locales.js`). The other ten live in `locales/<code>.js` and load only when chosen: `theme.js` starts the request in `<head>` for a saved or browser language, and switching waits for the pack before changing any text, so the page never mixes languages. If a pack cannot load, the page stays in the current language. `locales/guide-keywords.js` is always loaded so the guide matches a question in any script. Run `node --test tests/*.test.cjs` when changing a catalog or the language list.

Language expansion validation: 45 Node tests, all ten added locales checked at 320px in both themes, Portuguese desktop layout and saved selection, Arabic guide/terminal/email panels, Chinese guide input, and Portuguese project notes. No real email was sent. These checks used a Chromium preview, not physical mobile devices.

## Optional AI guide

`api/chat.js` uses Groq's `openai/gpt-oss-20b` only when a visitor submits a question. Add `GROQ_API_KEY` to Vercel Production and redeploy to enable it. Keep that Groq account on the Free plan, without a billing upgrade. The provider quota is shared by all visitors. No paid fallback is configured. Vercel Hobby usage limits still apply.

Without the key, the existing local guide works unchanged. With the key, the panel discloses Groq processing in all 17 languages. It sends the current question and at most two prior exchanges, holds chat history in tab memory, and renders plain text only. Clear cancels an outstanding reply and discards the browser history. Neither endpoint nor client logs or stores chat contents. Groq's own data policy applies: https://console.groq.com/docs/your-data

The server supplies public facts only: the guide topics (except the unverified discovery routine), every project card on the page, a description of this site and its features, and the public contact links. `tests/chat.test.cjs` keeps the project list, terminal commands and contact links in step with the page. The prompt makes the guide speak about Patrick in the third person, never as him, treats "you" questions as questions about Patrick, and tells it to say when the portfolio does not mention something instead of guessing tools, dates or clients. Temperature is 0.2 and replies are capped at 800 completion tokens. The system prompt is about 6,900 characters (roughly 1,600 tokens). Groq's Free plan counts each request's prompt plus its declared maximum output against 8K tokens per minute (and 200K per day), so a burst of more than about three questions a minute across all visitors gets labelled prepared answers until the budget refills. When Groq asks for a wait of 10 seconds or less, the endpoint passes it on as `Retry-After` and the page retries that question once. The server also rejects custom roles and oversized histories, limits output, times out requests, and returns a labelled prepared answer on failures. The warm-instance throttle is best effort, not a distributed abuse or spending cap. Provider Free-plan limits remain essential. There are no tools, account access, email sending or browser access in the model. Prompt instructions reduce unsupported claims but cannot guarantee factual answers.

Verify after setup: ask a follow-up, try Slovak and another language, clear during a pending request, and check that a missing/invalid key falls back honestly. Run `node --test tests/*.test.cjs` for regression checks. Live on 2026-09-23: verified English answers, a contextual follow-up, a Slovak answer, and clearing the conversation. Groq billing showed the $0 Free plan. Missing-key, provider failures, limits and malformed requests are covered by automated tests.
