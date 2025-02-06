import {
  createUserWithEmailAndPassword,
  NextOrObserver,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

export const authStateListener = (
  callback: NextOrObserver<User>
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};
