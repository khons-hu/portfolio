# khonsu / personal portfolio

Published on Vercel Hobby: https://khons-hu.vercel.app/

Deployed via Vercel Drop to Deploy on 2026-09-20 in NextWave (next-wave10), project khonsu. GitHub source remains private. GitHub autodeploy is connected to khons-hu/portfolio. Pushes to main create Production deployments and update khons-hu.vercel.app. Verified with commit 26466a4 on 2026-09-20. The initial khonsu-ochre.vercel.app address redirects to the clean address.

Static HTML, CSS, and JavaScript. No dependencies, build step, analytics, server functions, or ongoing API calls. Content is based on Patrick's approved public GitHub biography and the personal Spotify automation. Project artwork is illustrative, not a screenshot of the software.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then visit http://127.0.0.1:4173.

## Vercel

The private repository khons-hu/portfolio is connected to the existing Vercel project. Static files deploy without a build step. Vercel provides the `vercel.app` address. No paid services are needed for this static personal site within Hobby limits.

## Interaction

`/` opens the terminal. Available commands: `help`, `about`, `projects`, `work`, `now`, `contact`, `clear`, `close`. Tab completes unambiguous commands, arrows navigate session history, Escape closes dialogs. All sections also have ordinary navigation. Project cards open native, keyboard-accessible dialogs.

## Motion and resource use

Finite entrance and reveal transitions. Hover effects use transform. No animation loop, canvas, video, WebGL, scroll listener, polling, third-party font, or network integration. Reveals stop observing after their first appearance. Hidden-tab motion is disabled. OS reduced motion and a persistent manual motion toggle are respected. Terminal output and history are bounded.

## Content updates

Edit index.html for the page and app.js for project notes and terminal summaries. No private client details, CV download, invented results, or unpublished source links are included.

## Verified locally

Desktop and 390px viewport visually reviewed. No horizontal overflow on mobile. Verified project modal, Escape, terminal autocomplete, command execution, history, unknown-command handling, clear, and navigation closing the terminal. No browser console warnings or errors observed. OS reduced-motion preference is active on the test machine and correctly disables motion. Normal-motion timing and numerical CPU profiling have not been measured. Static site payload is approximately 289 KiB before HTTP compression.

## Ask khonsu guide

Local rule-based chat in guide.js, with prepared English, Slovak, Hungarian, Polish, Czech and German answers. No API calls, model downloads, tracking, or persisted chat history. The language selector translates the guide interface and chooses the reply language. Only the language preference is saved locally. Supports project dialogs and section navigation, caps history at 30 messages, and safely renders visitor text with textContent. Unknown questions receive a fallback. Edit the topic records when public profile facts change.

Verified: topic routing, Slovak accents, unknown/private-question fallbacks, opening a project from chat, clearing conversation, and mobile dialog layout.

## Appearance

Light/dark toggle in the header. Initially follows the system theme, then remembers the visitor’s choice locally. Both themes retain the lunar artwork and respect reduced motion.


## Contact email

Ask Khonsu contains a separate six-language contact form addressed only to ptr.obrtal@gmail.com. It sends the reply email and message through FormSubmit. It never includes guide questions or chat history. No API key or email credentials are bundled.

The recipient is activated and FormSubmit accepted the publication test on 20 September 2026. Sending is enabled. The mailto fallback remains available. A successful provider response means submission accepted, not proven inbox delivery; inbox receipt has not been independently checked.

Run `node --test tests/*.test.cjs` for validation, payload isolation, activation/failure handling and the theme regression checks. FormSubmit provides spam filtering. The local honeypot is only an extra signal, not a server-side abuse guarantee.
