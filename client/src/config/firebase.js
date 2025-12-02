// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOUR OWN FROM THE FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyAJjjM688jgVm9Cbdpteimu9ENY8ysEoiY",
    authDomain: "buddhalens-62904.firebaseapp.com",
    projectId: "buddhalens-62904",
    storageBucket: "buddhalens-62904.firebasestorage.app",
    messagingSenderId: "393338632804",
    appId: "1:393338632804:web:de202f434fc0ca6005bd71",
    measurementId: "G-WQFDZBF70Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
