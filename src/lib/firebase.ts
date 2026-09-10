import { initializeApp } from "firebase/app";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Enable offline persistence to handle network drops and quota limits gracefully
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.warn("Firebase persistence: Multiple tabs open, persistence disabled.");
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn("Firebase persistence: Browser doesn't support persistence.");
    }
  });
} catch (e) {
  console.warn("Firebase persistence setup failed", e);
}

export const auth = getAuth(app);
export const storage = getStorage(app);
