# khonsu / personal portfolio

Published on Vercel Hobby: https://khons-hu.vercel.app/

Deployed via Vercel Drop to Deploy on 2026-09-20 in NextWave (next-wave10), project khonsu. GitHub source remains private. GitHub autodeploy is connected to khons-hu/portfolio. Pushes to main create Production deployments and update khons-hu.vercel.app. Verified with commit 26466a4 on 2026-09-20. The initial khonsu-ochre.vercel.app address redirects to the clean address.

Static HTML, CSS, and JavaScript, without a frontend framework or build step. No analytics or background model calls. Project artwork is illustrative. Some project dialogs also include screenshots. The contact form sends only the visitor’s email and message through FormSubmit when submitted.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then visit http://127.0.0.1:4173.

## Vercel

The private repository khons-hu/portfolio is connected to the existing Vercel project. Static files deploy without a build step. Vercel provides the `vercel.app` address. No paid services are needed for this static personal site within Hobby limits.

## Interaction

`/` opens the terminal. Commands: `help`, `about`, `projects`, `work`, `now`, `contact`, `status`, `lore`, `theme`, `open <project>`, `clear`, `close`. The project list and live links follow the cards on the page. Try `open receipts` or `open khonrelay`. Tab completes unambiguous commands, arrows recall session history, and Escape closes dialogs.

Ordinary navigation works throughout. Compact project cards put the descriptions ahead of the artwork. Search by name, technology or topic, together with the tools, games and earlier-work filters. Search is local and is not stored or sent anywhere.

Cards open keyboard-accessible notes, with separate links to available demos, playlists or public source. “Copy project link” gives a direct address such as https://khons-hu.vercel.app/#project/khonrelay. It opens those notes on arrival. If clipboard access is unavailable, the address remains selectable. Shared links exclude query parameters.

## Motion and resource use

Finite entrance and reveal transitions. Hover effects use transform. No animation loop, canvas, video, WebGL, scroll listener, polling or third-party font. Reveals stop observing after their first appearance. Hidden-tab motion is disabled. Motion has three saved choices: System follows the OS, On explicitly enables the small transitions, and Off disables them. Preferences are stored for this site in the visitor’s browser. Terminal output and history are bounded.

## Content updates

Edit index.html for the page and project groups, app.js for project notes, project-links.js for public link slugs, and site-locales.js for translations. The terminal derives its project catalog from the cards. No private client details, CV download, invented results, or unpublished source links are included.

## Verified locally

Desktop, 390px and 320px layouts visually reviewed. Search, combined filters, empty results, direct project links, copy feedback, Escape and restored focus checked in the browser. English, German and Hungarian UI exercised. Both themes reviewed. Clipboard failure and unknown links covered by automated tests. These are browser viewport checks, not real-device or BrowserStack tests. No horizontal overflow on mobile. Verified project modal, Escape, terminal autocomplete, command execution, history, unknown-command handling, clear, and navigation closing the terminal. No browser console warnings or errors observed. OS reduced-motion preference is active on the test machine and correctly disables motion. Normal-motion timing and numerical CPU profiling have not been measured.

## Ask khonsu guide

Local rule-based chat in guide.js, with prepared English, Slovak, Hungarian, Polish, Czech, German and Spanish answers. No API calls, model downloads, tracking, or persisted chat history. The language selector translates the guide interface and chooses the reply language. Only the language preference is saved locally. Supports project dialogs and section navigation, caps history at 30 messages, and safely renders visitor text with textContent. Unknown questions receive a fallback. Edit the topic records when public profile facts change.

Verified: topic routing, Slovak accents, unknown/private-question fallbacks, opening a project from chat, clearing conversation, and mobile dialog layout.

## Appearance

Light/dark toggle in the header. Initially follows the system theme, then remembers the visitor’s choice locally. Both themes retain the lunar artwork and respect reduced motion.


## Contact email

Both the contact section and Ask Khonsu offer a separate multilingual contact form addressed only to ptr.obrtal@gmail.com. It sends the reply email and message through FormSubmit. It never includes guide questions or chat history. No API key or email credentials are bundled.

The recipient is activated and FormSubmit accepted the publication test on 20 September 2026. Sending is enabled. The mailto fallback remains available. A successful provider response means submission accepted, not proven inbox delivery; inbox receipt has not been independently checked.

Run `node --test tests/*.test.cjs` for validation, payload isolation, activation/failure handling and the theme regression checks. FormSubmit provides spam filtering. The local honeypot is only an extra signal, not a server-side abuse guarantee.
