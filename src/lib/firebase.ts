import { initializeApp } from "firebase/app";
import { initializeFirestore, getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId || '(default)');

// Enable offline persistence to handle network drops and quota limits gracefully
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Firebase persistence: Multiple tabs open, persistence disabled.");
    } else if (err.code === 'unimplemented') {
      console.warn("Firebase persistence: Browser doesn't support persistence.");
    }
  });
} catch (e) {
  console.warn("Firebase persistence setup failed", e);
}

export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = async () => {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  }
  return null;
};

