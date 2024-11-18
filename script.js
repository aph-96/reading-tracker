// JavaScript code to track books and save to Local Storage
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const bookList = document.getElementById("bookList");
  const bookInput = document.getElementById("bookInput");
  const totalBooksElement = document.getElementById("totalBooks");

  // Load saved books from Local Storage
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Function to display books and update counters
  function displayBooks() {
    bookList.innerHTML = ""; // Clear current list

    let totalReads = 0;
    let newBooksCount = 0;

    books.forEach((book, index) => {
      const li = document.createElement("li");

      // Create the book info and actions div
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

      totalReads += book.count; // Add to total reads

      // Increment newBooksCount if this is the first read
      if (book.count === 1) {
        newBooksCount += 1;
      }
    });

    // Update the total reads and new books count in the DOM
    totalBooksElement.innerHTML = `
      Total Reads: ${totalReads}<br>
      New Books: ${newBooksCount}`;
  }

  // Function to delete a specific book
  window.deleteBook = function (index) {
    books.splice(index, 1); // Remove the book at the specified index
    localStorage.setItem("books", JSON.stringify(books)); // Update Local Storage
    displayBooks(); // Update the display
  };

  // Function to increment read count
  window.incrementReadCount = function (index) {
    books[index].count += 1;
    localStorage.setItem("books", JSON.stringify(books)); // Update Local Storage
    displayBooks();
  };

  // Event delegation to handle button clicks
  bookList.addEventListener("click", (e) => {
    if (e.target.classList.contains("mark-read")) {
      const index = e.target.dataset.index;
      incrementReadCount(index); // Call increment function
    } else if (e.target.classList.contains("delete-book")) {
      const index = e.target.dataset.index;
      deleteBook(index); // Call delete function
    }
  });

  // Add new book to list and Local Storage
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = bookInput.value.trim();
    if (title) {
      const existingBook = books.find((book) => book.title === title);
      if (existingBook) {
        existingBook.count += 1;
      } else {
        books.push({ title: title, count: 1 });
      }
      localStorage.setItem("books", JSON.stringify(books)); // Save updated books to Local Storage
      bookInput.value = "";
      displayBooks();
    }
  });

  // Initial display of books on page load
  displayBooks();
});
