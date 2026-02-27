import { useState } from "react";

// Fake auth state — simulates a logged-out user by default
// TO INTEGRATE FIREBASE: replace this entire hook with:
//
//   import { useAuthState } from "react-firebase-hooks/auth";
//   import { auth } from "../firebase";
//   export function useAuth() {
//     const [user, loading] = useAuthState(auth);
//     return { user, loading };
//   }

let _fakeUser = null; // null = logged out
const _listeners = new Set();

function setFakeUser(user) {
  _fakeUser = user;
  _listeners.forEach((fn) => fn(user));
}

export function useAuth() {
  const [user, setUser] = useState(_fakeUser);

  // Subscribe to fake auth changes
  useState(() => {
    _listeners.add(setUser);
    return () => _listeners.delete(setUser);
  });

  const login = (email) => {
    const fakeUser = {
      email,
      displayName: email.split("@")[0],
      photoURL: null,
      accountAgeDays: 1,
    };
    setFakeUser(fakeUser);
  };

  const logout = () => setFakeUser(null);

  return { user, login, logout };
}