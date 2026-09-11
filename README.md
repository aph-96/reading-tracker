# Reading Tracker v3.3

This build fixes the startup error:

`Cannot access 'clone' before initialization`

Cause: `loadData()` was called before the `clone` constant had been initialized.
Fix: `clone()` is now a hoisted function declaration before startup runs.

The app remains self-contained: CSS, JavaScript and bundled reading data are all inside `index.html`.

Replace:
- index.html
- service-worker.js
- manifest.json
- icon-192.png
- icon-512.png

`reading-data.json` is included as a standalone backup.

After uploading, open the hosted URL with `?v=3.3` once if needed, e.g.
`your-site-url/?v=3.3`, then refresh.
