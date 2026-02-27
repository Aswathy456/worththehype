import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA_HG2B1IBqdfpNnt7rFlsutO7RqYeFZSc",
  authDomain: "worththehype-79187.firebaseapp.com",
  projectId: "worththehype-79187",
  storageBucket: "worththehype-79187.firebasestorage.app",
  messagingSenderId: "48474312205",
  appId: "1:48474312205:web:12d718c8ba273b3d2b0f44",
  databaseURL: "https://worththehype-79187-default-rtdb.firebaseio.com",
};

const app        = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();