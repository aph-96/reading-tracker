# Reading Tracker v3.4

Changes:
- This Year now sorts most-recent-first.
- The original 2026 backup order is preserved and reversed for display, because those imported reads do not have exact finish dates.
- Future dated reads sort by date descending.
- Future undated rereads sort by when you add them.
- Long library titles wrap safely on narrow phone screens.
- The malformed Goodreads-link title for `6 Times We Almost Kissed [and One Time We Did]` is migrated into the clean book record.
- Existing localStorage is migrated in place, so this update does not require resetting the app and should preserve ratings/notes you add.

Replace index.html, service-worker.js and manifest.json on the hosted site.
The icons can stay the same, but copies are included.
