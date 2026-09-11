# Reading Tracker v3.2 — self-contained build

Use this build instead of v3.1.

The app JavaScript, seeded reading data, and CSS are all embedded directly inside `index.html`.
That removes the possibility of GitHub Pages / an old service worker failing to load `app-v3-1.js`,
`data-v3-1.js`, or the stylesheet.

## Replace these files on the hosted site
- index.html
- manifest.json
- service-worker.js
- icon-192.png
- icon-512.png

`reading-data.json` is included as a human-readable backup, but the app does not depend on it to start.

After uploading, open the normal hosted URL in Chrome and refresh once.
If you still see an error banner, this build will display the actual JavaScript error rather than only a generic message.
