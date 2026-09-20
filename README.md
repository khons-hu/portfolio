# khonsu / personal portfolio

Local review draft. Not deployed or published.

Static HTML, CSS, and JavaScript. No dependencies, build step, analytics, server functions, or ongoing API calls. Content is based on Patrick's approved public GitHub biography and the personal Spotify automation. Project artwork is illustrative, not a screenshot of the software.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then visit http://127.0.0.1:4173.

## Vercel

Import this directory as its own GitHub repository when approved. Select framework **Other**, no build command, output directory `.`. Vercel provides the `vercel.app` address. No paid services are needed for this static personal site within Hobby limits.

## Interaction

`/` opens the terminal. Available commands: `help`, `about`, `projects`, `work`, `now`, `contact`, `clear`, `close`. Tab completes unambiguous commands, arrows navigate session history, Escape closes dialogs. All sections also have ordinary navigation. Project cards open native, keyboard-accessible dialogs.

## Motion and resource use

Finite entrance and reveal transitions. Hover effects use transform. No animation loop, canvas, video, WebGL, scroll listener, polling, third-party font, or network integration. Reveals stop observing after their first appearance. Hidden-tab motion is disabled. OS reduced motion and a persistent manual motion toggle are respected. Terminal output and history are bounded.

## Content updates

Edit index.html for the page and app.js for project notes and terminal summaries. No private client details, CV download, invented results, or unpublished source links are included.

## Verified locally

Desktop and 390px viewport visually reviewed. No horizontal overflow on mobile. Verified project modal, Escape, terminal autocomplete, command execution, history, unknown-command handling, clear, and navigation closing the terminal. No browser console warnings or errors observed. OS reduced-motion preference is active on the test machine and correctly disables motion. Normal-motion timing and numerical CPU profiling have not been measured. Static site payload is approximately 289 KiB before HTTP compression.
