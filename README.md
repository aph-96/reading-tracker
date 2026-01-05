# 📚 Reading Tracker

A simple, mobile-friendly **reading tracker web app** that helps you keep track of books you’ve read and how many times you’ve reread them.

This project is designed to be:

* **Offline-first** (uses `localStorage`)
* **Mobile-friendly** (works well when added to a phone home screen)
* **Data-safe** (export/import backups supported)

---

## ✨ Features

* ➕ Add book titles
* 🔁 Track rereads (increments count per book)
* 🗑️ Delete books
* 📊 Automatic stats:

  * Total reads
  * Number of new books
* 💾 Persistent storage using browser `localStorage`
* 📤 Export your data to a `.json` file
* 📥 Import data from a backup file
* 📱 Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

* **HTML** – Structure
* **CSS** – Styling & responsive layout
* **Vanilla JavaScript** – Logic & storage
* **Browser localStorage** – Data persistence

No frameworks, no build tools, no dependencies.

---

## 🚀 How to Use

### 1. Open the app

You can run it locally by opening `index.html` in your browser, or host it using GitHub Pages.

> ⚠️ Important: Always open the app from the **same URL**. Opening the same project from different links (e.g. `file://`, localhost, GitHub Pages) creates separate `localStorage` data.

---

### 2. Add to Home Screen (Mobile – Recommended)

For best results on mobile:

1. Open the app in your mobile browser
2. Use **“Add to Home Screen”**
3. Always open the app from that icon

This keeps `localStorage` stable and prevents data loss.

---

### 3. Backing Up Your Data (Highly Recommended)

#### Export

* Tap **Export Data**
* A file called `reading-tracker-backup.json` will download

#### Import

* Tap **Import Data**
* Select a previously exported `.json` file
* Your data will be restored

> 💡 Tip: Export regularly or after large updates to your list.

---

## 📂 Project Structure

```
reading-tracker/
├── index.html   # App structure
├── style.css    # Styling & responsive layout
├── script.js    # App logic & localStorage handling
└── README.md    # Project documentation
```

---

## 🧠 Data Storage Details

* All data is stored under a single `localStorage` key:

```js
readingTrackerBooks
```

* Data format:

```json
[
  { "title": "Book Title", "count": 1 },
  { "title": "Another Book", "count": 3 }
]
```

This simple structure makes exporting, importing, and future cloud sync easy.

---

## ☁️ Future Improvements (Optional)

Planned or possible enhancements:

* GitHub-based cloud backup
* Firebase / account-based syncing
* Search & filtering
* Reading stats by month or year
* PWA offline install support

---

## ❤️ Why This Exists

This project was created to be a **lightweight, personal reading log** without ads, accounts, or tracking — and to avoid losing data after learning the hard way.

Happy reading 📖✨

---

## 📜 License

This project is free to use, modify, and adapt for personal use.
