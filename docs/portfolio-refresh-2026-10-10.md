# Portfolio refresh, 10 October 2026

Status: implemented and verified locally. Not pushed, not deployed.
Branch: claude/portfolio-refresh-2026-7f2316 (baseline 36756f4). Preview: `python3 -m http.server 4173 --bind 127.0.0.1`, then http://127.0.0.1:4173

## Design
- Direction: working artifacts by moonlight. Same Moonlight palette and Georgia/Avenir pairing. "Patrick. Or khonsu." and the landscape stay, in a shorter hero.
- Hero: two paragraphs of plain first-person copy (role first, evenings second) and a glass "Lately" index with three dated artifacts that link to the stories. This replaces the "Start with" pills.
- Work (#projects) opens with three stories, each with its own layout:
  - Moonlight: a large real VS Code screenshot with the real demo poster overlapping it. The MP4 opens only on click.
  - Haiku/Luna: a full-width band with an outcome ledger generated from results.csv (4 rows × 48 runs, shape plus colour for pass, fail and timeout), one inspectable late-timeout run, caveats next to the data and the evidence downloads. `#haiku-luna-evaluation` now points here.
  - Feedcairn: a framed browser window with the real screenshot.
- All 14 projects remain in a compact searchable "full shelf" of hairline rows. Monogram tiles and boxed cards are gone. Search, filters, Notes dialogs and slugs are unchanged.
- The light theme moved from cream to a cool moon-paper grey (theme-color updated).
- About was rewritten (TUKE, Moon Knight about 2022, evenings) and the interest pills were removed. Shipped entries were shortened. Meta descriptions and the terminal `about` text were updated.
- Self-critique: the glass index is the one card-like element in the hero, kept because it is the main route into the work. The ledger is data, not decoration. The rotated Feedcairn window is the only playful touch, and it straightens on hover with motion on.

## Files
index.html, style.css, theme.js, terminal.js, site-locales.js, locales/*.js (19 new keys × 16 languages), 404.html (cache key `refresh-20261010`), tests/chat.test.cjs (grounded phrase follows the new About copy), docs/. Report evidence files are untouched.

## Checks
- `node --test tests/*.test.cjs`: 130 pass, 0 fail.
- Chrome (in-app browser) at 1440, 1280 and 375 px: dark and light themes, Arabic RTL (date isolation fixed), Hungarian, no horizontal overflow, the `#project/feedcairn` link opens notes and Escape closes them with focus returned to the shelf card, keyboard focus ring on the index links.
- Console errors are only 404s for /api/now-playing and /api/chat, because those are Vercel functions the static server does not run. The Spotify line showed "Updating…" during these failures, which is existing behaviour.
- Screenshots: docs/portfolio-refresh-2026-10-10/*.png.

## Not verified
Safari, Firefox, a physical phone, print output, the axe audit, a contact form send (deliberately not sent) and the live API functions.

## Proposed GitHub profile line (not applied)
L2 technical support at Luigi's Box. After hours: Khonsu Moonlight, Feedcairn and evaluations of coding-agent workflows.
