# Reading Tracker v3.6

Adds the purchased Kindle books supplied by the user.

Years used:
- Hurt Me Not through The Queen's Heart: 2025
- From Bad to Cursed through all Price of Silence books: 2024

This update contains an in-app migration. Existing localStorage is preserved:
- missing books are added
- existing matching books receive one historical read event
- ratings, spice, verdicts, notes and favourites already saved locally remain intact
- migration is idempotent and will not add the same purchased read again on every load

A full JSON backup is also included, but updating the app files is the safer route than importing a partial JSON.
