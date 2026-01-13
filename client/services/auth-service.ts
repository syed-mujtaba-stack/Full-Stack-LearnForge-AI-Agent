import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const authService = {
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        if (!auth) return () => { };
        return onAuthStateChanged(auth, callback);
    },

    signUp: async (email: string, pass: string) => {
        if (!auth) throw new Error("Firebase not initialized");
        return createUserWithEmailAndPassword(auth, email, pass);
    },

    signIn: async (email: string, pass: string) => {
        if (!auth) throw new Error("Firebase not initialized");
        return signInWithEmailAndPassword(auth, email, pass);
    },

    signInWithGoogle: async (useRedirect: boolean = false) => {
        if (!auth) throw new Error("Firebase not initialized");
        const provider = new GoogleAuthProvider();
        if (useRedirect) {
            return signInWithRedirect(auth, provider);
        }
        return signInWithPopup(auth, provider);
    },

    signOut: async () => {
        if (!auth) return;
        return firebaseSignOut(auth);
    }
};
