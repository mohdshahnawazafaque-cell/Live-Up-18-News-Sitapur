import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

async function publish() {
  try {
    const newsItem = {
      headline: "आईबीपी सोशल वेलफेयर फाउंडेशन ने एसडीएम अभिषेक प्रियदर्शी को किया सम्मानित",
      category: "uttar-pradesh", // Defaulting to UP since it's Sitapur
      content: "सीतापुर।आईबीपी सोशल वेलफेयर फाउंडेशन की ओर से महमूदाबाद के उपजिलाधिकारी (एसडीएम) अभिषेक प्रियदर्शी के सम्मान में एक विशेष कार्यक्रम का आयोजन किया गया। इस दौरान फाउंडेशन के पदाधिकारियों एवं सदस्यों ने एसडीएम को स्मृति चिह्न भेंटकर उनका नागरिक अभिनंदन किया और जनसेवा के प्रति उनके समर्पण की सराहना की।कार्यक्रम के दौरान फाउंडेशन की राष्ट्रीय महासचिव अंजू सिंह ने कहा कि उपजिलाधिकारी अभिषेक प्रियदर्शी का व्यक्तित्व बेहद सरल, सौम्य और प्रेरणादायी है।प्रशासनिक क्षेत्र में उनकी जनहितैषी कार्यशैली और आम जनता की समस्याओं के त्वरित समाधान की प्रतिबद्धता सराहनीय है। फाउंडेशन परिवार ने उनके उज्ज्वल भविष्य, उत्तम स्वास्थ्य और प्रशासनिक सेवा के क्षेत्र में निरंतर नई ऊंचाइयां हासिल करने की मंगलकामना की।इस सम्मान समारोह के दौरान संस्था के पदाधिकारियों ने सामाजिक सरोकारों, जनसेवा तथा प्रशासनिक सहयोग से जुड़े विभिन्न पहलुओं पर भी विचार-विमर्श किया। उपजिलाधिकारी ने फाउंडेशन द्वारा समाज हित में किए जा रहे कार्यों की प्रशंसा करते हुए सभी पदाधिकारियों का आभार व्यक्त किया।इस अवसर पर मुख्य रूप से आईबीपी सोशल वेलफेयर फाउंडेशन की राष्ट्रीय महासचिव अंजू सिंह, प्रदेश उपाध्यक्ष लेखा गुप्ता, जिला सचिव अंजना कौर, जिला संगठन मंत्री गुड्डी वर्मा एवं जिला सचिव शर्मिष्ठा शर्मा सहित संस्था के अनेक सम्मानित पदाधिकारी व सदस्य उपस्थित रहे।",
      featuredImage: "https://generativelanguage.googleapis.com/v1beta/files/swh749a2y9a2", // Using one of the uploaded images
      videoUrl: null,
      isBreaking: true,
      publicationDate: new Date().toISOString(),
      author: "मो० शाहनवाज़",
      sourceAttribution: "LIVE UP 18 NEWS"
    };

    const docRef = await addDoc(collection(db, "news"), newsItem);
    console.log("News published with ID: ", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("Error adding document: ", e);
    process.exit(1);
  }
}

publish();
