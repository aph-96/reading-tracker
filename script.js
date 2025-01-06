import db from "./firebase.js"; // Assuming 'firebase.js' is in the same directory

// JavaScript code to track books and save to Firebase Firestore
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const bookList = document.getElementById("bookList");
  const bookInput = document.getElementById("bookInput");
  const totalBooksElement = document.getElementById("totalBooks");

  // Function to display books and update counters
  function displayBooks() {
    bookList.innerHTML = ""; // Clear current list

    let totalReads = 0;
    let newBooksCount = 0;

    // Fetch books from Firestore
    db.collection("books")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const book = doc.data();
          const li = document.createElement("li");

          // Create the book info and actions div
          li.innerHTML = `
            <div class="book-info">
              ${book.title} <span class="book-count">${book.count}</span> time(s)
            </div>
            <div class="book-actions">
              <button class="mark-read" data-doc-id="${doc.id}">Re-read</button>
              <button class="delete-book" data-doc-id="${doc.id}">Delete</button>
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
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  }

  // Function to delete a specific book
  window.deleteBook = function (docId) {
    db.collection("books")
      .doc(docId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        displayBooks(); // Update the display
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  // Function to increment read count
  window.incrementReadCount = function (docId) {
    db.collection("books")
      .doc(docId)
      .update({
        count: firebase.firestore.FieldValue.increment(1),
      })
      .then(() => {
        console.log("Document successfully updated!");
        displayBooks();
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  // Event delegation to handle button clicks
  bookList.addEventListener("click", (e) => {
    if (e.target.classList.contains("mark-read")) {
      const docId = e.target.dataset.docId;
      incrementReadCount(docId); // Call increment function
    } else if (e.target.classList.contains("delete-book")) {
      const docId = e.target.dataset.docId;
      deleteBook(docId); // Call delete function
    }
  });

  // Initial display of books on page load
  displayBooks();
});
