// Import the Firebase SDK for JavaScript
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0IT0zG_SPn2y66J_TQP4IV8lQwWqzgIw",
  authDomain: "aph96-reading-app.firebaseapp.com",
  projectId: "aph96-reading-app",
  storageBucket: "aph96-reading-app.firebasestorage.app",
  messagingSenderId: "371521364319",
  appId: "1:371521364319:web:e317c969a6d9b2d351d6ea",
  measurementId: "G-BYEQWXWTRS",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();

// Export the database reference
export default db;
