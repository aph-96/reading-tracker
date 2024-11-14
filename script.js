// Array to store books
let books = [];

// Function to add a new book or increment count
function addBook() {
  const bookName = document.getElementById("bookName").value.trim();
  if (!bookName) return;

  // Check if the book already exists
  const existingBook = books.find(
    (book) => book.name.toLowerCase() === bookName.toLowerCase()
  );

  if (existingBook) {
    // Increment the read count if it already exists
    existingBook.readCount += 1;
  } else {
    // Otherwise, add a new book with readCount of 1
    books.push({ name: bookName, readCount: 1 });
  }

  // Clear the input field
  document.getElementById("bookName").value = "";

  // Update the UI
  updateBookList();
  updateTotalBooksRead();
}

// Function to update the displayed book list
function updateBookList() {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = ""; // Clear existing list

  // Add each book as a list item
  books.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.name} - `;

    // Show read count
    const readCount = document.createElement("span");
    readCount.className = "book-count";
    readCount.textContent = `Read ${book.readCount} time(s)`;
    li.appendChild(readCount);

    bookList.appendChild(li);
  });
}

// Function to update the total books read
function updateTotalBooksRead() {
  // Sum up the read count of all books
  const total = books.reduce((sum, book) => sum + book.readCount, 0);
  document.getElementById("totalBooksRead").textContent = total;
}
