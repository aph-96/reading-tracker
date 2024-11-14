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
      li.innerHTML = `${book.title} - Read <span class="book-count">${book.count}</span> time(s)
                      <button onclick="incrementReadCount(${index})">Mark as Re-read</button>`;
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
  function deleteBook(index) {
    books.splice(index, 1); // Remove the book at the specified index
    localStorage.setItem("books", JSON.stringify(books)); // Update Local Storage
    displayBooks(); // Update the display
  }

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

  // Function to increment read count
  window.incrementReadCount = (index) => {
    books[index].count += 1;
    localStorage.setItem("books", JSON.stringify(books)); // Update Local Storage
    displayBooks();
  };

  // Initial display of books on page load
  displayBooks();
});
