import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, db, googleProvider } from "../firebase";

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await get(ref(db, `users/${firebaseUser.uid}`));
        const profile = snap.exists() ? snap.val() : {};
        setUser({ ...firebaseUser, ...profile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = email.split("@")[0];
    await updateProfile(cred.user, { displayName });
    await set(ref(db, `users/${cred.user.uid}`), {
      email, displayName,
      accountCreated: Date.now(),
      reputation: "New",
      reviewCount: 0,
    });
    return cred.user;
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const isNew = cred._tokenResponse?.isNewUser;
    if (isNew) {
      await set(ref(db, `users/${cred.user.uid}`), {
        email: cred.user.email,
        displayName: cred.user.displayName,
        accountCreated: Date.now(),
        reputation: "New",
        reviewCount: 0,
      });
    }
    return cred.user;
  };

  const forgotPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  return { user, loading, login, signup, loginWithGoogle, logout, forgotPassword };
}