# Reading Tracker PWA

## Easiest setup
Upload the contents of this folder to your existing GitHub Pages / Netlify reading-tracker site.

The app is already seeded with `reading-data.json` via `data.js`, so on a fresh install you do NOT need to import anything manually.

## Important
If you already have an older version of the app installed, the new app uses a new localStorage key (`readingTrackerDataV3`) and a bumped service-worker cache (`reading-tracker-v3-20260911`) to avoid the stale-cache problem.

## Included
- Current-year reading goal that automatically follows the calendar year
- Full library + historical reading records
- Separate Add Book and Add Historical Book flows
- Optional stars, spice, verdict and notes
- Reread counts and Mark as Reread
- Reread Picks
- Year history
- Search / filters / Needs Details
- JSON import/export
- PWA manifest + service worker + icons

## Data rules used
- 2026 tracker entries are counted as 2026 reads.
- Goodreads `date read` is used where available.
- Kindle Unlimited `Borrowed on` is used when Goodreads does not already represent that same read.
- Duplicate Kindle page entries with the same book/date are collapsed.
- Explicit lifetime reread counts from the bookshelf list override missing source history by adding unknown-year historical read records.
- Unknown years remain unknown rather than being guessed.

`reading-data.json` is also included as a standalone backup/import file.


## FIXED BUILD v3.1
This build deliberately uses versioned filenames:
- app-v3-1.js
- data-v3-1.js
- styles-v3-1.css

This prevents an older installed service worker from serving a previous app.js file against the new page.

When updating your hosted site, replace ALL existing tracker files with the contents of this folder, including service-worker.js.
If the tracker is already installed on your phone, open the hosted website once in Chrome after uploading the fixed files, refresh it, then reopen the installed app.
