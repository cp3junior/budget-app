import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_lJwqBDGnFsPyuH9Vqz0OBoewakxpIxY",
  authDomain: "dollardazzle-92581.firebaseapp.com",
  projectId: "dollardazzle-92581",
  storageBucket: "dollardazzle-92581.firebasestorage.app",
  messagingSenderId: "478553979225",
  appId: "1:478553979225:web:eb9f09c17aa4c0e01c7448",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
