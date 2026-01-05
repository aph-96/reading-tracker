document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "readingTrackerBooks";

  const bookForm = document.getElementById("bookForm");
  const bookList = document.getElementById("bookList");
  const bookInput = document.getElementById("bookInput");
  const totalBooksElement = document.getElementById("totalBooks");
  const exportBtn = document.getElementById("exportBtn");
  const importInput = document.getElementById("importInput");

  let books = loadBooks();

  function loadBooks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function displayBooks() {
    bookList.innerHTML = "";

    let totalReads = 0;
    let newBooksCount = 0;

    books.forEach((book, index) => {
      totalReads += book.count;
      if (book.count === 1) newBooksCount++;

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="book-info">
          ${book.title} <span class="book-count">${book.count}</span> time(s)
        </div>
        <div class="book-actions">
          <button class="mark-read" data-index="${index}">Re-read</button>
          <button class="delete-book" data-index="${index}">Delete</button>
        </div>
      `;
      bookList.appendChild(li);
    });

    totalBooksElement.innerHTML = `Total Reads: ${totalReads} | New Books: ${newBooksCount}`;
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = bookInput.value.trim();
    if (!title) return;

    const existing = books.find(
      (b) => b.title.toLowerCase() === title.toLowerCase()
    );

    if (existing) {
      existing.count++;
    } else {
      books.push({ title, count: 1 });
    }

    saveBooks();
    bookInput.value = "";
    displayBooks();
  });

  bookList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("mark-read")) {
      books[index].count++;
    }
    if (e.target.classList.contains("delete-book")) {
      books.splice(index, 1);
    }
    saveBooks();
    displayBooks();
  });

  /* EXPORT */

  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(books, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reading-tracker-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  /* IMPORT */

  importInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (Array.isArray(imported)) {
          books = imported;
          saveBooks();
          displayBooks();
        } else {
          alert("Invalid file format.");
        }
      } catch {
        alert("Could not read file.");
      }
    };
    reader.readAsText(file);
  });

  displayBooks();
});
