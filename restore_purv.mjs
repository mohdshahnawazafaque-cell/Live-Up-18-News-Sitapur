import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || '(default)');

const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
const articles = Array.isArray(data) ? data : (data.articles || data.news || Object.values(data));
const purvNews = articles.find(n => n.headline && n.headline.includes("तम्बौर के पूर्व चेयरमैन"));

async function restore() {
  if (purvNews) {
    const newsRef = doc(collection(db, "news"), purvNews.id || "purv_chairman_news");
    // Ensure it has required fields
    const toSave = { ...purvNews };
    if (!toSave.featuredImage) toSave.featuredImage = "https://picsum.photos/seed/chairman/800/450";
    if (!toSave.publicationDate) toSave.publicationDate = new Date().toISOString();
    
    // Give it a fresh date so it appears at the top
    toSave.publicationDate = new Date().toISOString();
    toSave.isBreaking = true; // make it visible maybe

    await setDoc(newsRef, toSave);
    console.log("Restored:", toSave.headline);
  } else {
    console.log("News not found");
  }
  process.exit(0);
}

restore().catch(console.error);
