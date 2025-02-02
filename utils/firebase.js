import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
// 
const firebaseConfig = {
    apiKey: "AIzaSyBdQXOaSg2qOhek7RNwDeShk2jlhVnDH64",
    authDomain: "fir-authentication-1a877.firebaseapp.com",
    projectId: "fir-authentication-1a877",
    storageBucket: "fir-authentication-1a877.appspot.com",
    messagingSenderId: "580874850390",
    appId: "1:580874850390:web:f220bbabf4deee709b6bf7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);






export {
    auth, db, getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, collection, addDoc, doc, setDoc, getDoc, query, where, getDocs, deleteDoc,
    storage, ref, uploadBytesResumable, getDownloadURL
}   