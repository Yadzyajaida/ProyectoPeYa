import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYBZufFQ6qAMWqDJQKW7ALfyz38Hkfb1U",
  authDomain: "id-tracker1.firebaseapp.com",
  projectId: "id-tracker1",
  storageBucket: "id-tracker1.firebasestorage.app",
  messagingSenderId: "1007966939139",
  appId: "1:1007966939139:web:036e8d657b49ce585fc636",
  measurementId: "G-M118F3Z3NL"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, signOut, collection, addDoc, query, where, getDocs, orderBy };
