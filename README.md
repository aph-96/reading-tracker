# Reading Tracker v3.7
Fixes startup error:
`Cannot access 'PURCHASED_READS_V36' before initialization`

The purchased-book migration data is now declared before `loadData()` / `normalizeData()` can run.

All v3.6 purchased-book additions are retained.
