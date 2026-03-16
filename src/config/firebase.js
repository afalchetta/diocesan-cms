import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAL_1ln1uHbQh4gVpnZjsn5ePIKZl0nvIw",
  authDomain: "diocesan-cms.firebaseapp.com",
  projectId: "diocesan-cms",
  storageBucket: "diocesan-cms.firebasestorage.app",
  messagingSenderId: "148728265273",
  appId: "1:148728265273:web:98a981c23f168c05c7abe8"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
