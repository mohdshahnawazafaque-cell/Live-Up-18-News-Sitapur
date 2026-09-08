import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || '(default)');

async function check() {
  const snap = await getDocs(query(collection(db, "news"), limit(3)));
  snap.forEach(doc => console.log(doc.id));
  process.exit(0);
}
check();
