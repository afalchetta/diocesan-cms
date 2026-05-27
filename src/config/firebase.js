// src/config/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/functions"; // ✅ Add this line

const firebaseConfig = {
  apiKey: "AIzaSyAL_1ln1uHbQh4gVpnZjsn5ePIKZl0nvIw",
  authDomain: "diocesan-cms.firebaseapp.com",
  projectId: "diocesan-cms",
  storageBucket: "diocesan-cms.firebasestorage.app",
  messagingSenderId: "148728265273",
  appId: "1:148728265273:web:98a981c23f168c05c7abe8"
};

firebase.initializeApp(firebaseConfig);

// Make sure functions and firestore are initialized
firebase.firestore();
firebase.functions(); // ✅ important

export default firebase;