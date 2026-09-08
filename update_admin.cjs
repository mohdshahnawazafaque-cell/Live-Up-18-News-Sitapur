const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

content = content.replace(
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
  `import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport { collection, query, orderBy, limit, getDocs, deleteDoc, doc, addDoc, setDoc } from "firebase/firestore";\nimport { db } from "../lib/firebase";`
);

// Update login
const oldLogin = /const handleLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?  \};/;
const newLogin = `const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (email === "liveup18news@gmail.com" && password === "Sh@sahiba9653") {
      localStorage.setItem("adminToken", "admin-auth-token-123");
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid credentials");
    }
  };`;
content = content.replace(oldLogin, newLogin);

// Update fetchData
const oldFetchData = /const fetchData = async \(\) => \{[\s\S]*?  \};/;
const newFetchData = `const fetchData = async () => {
    try {
      const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(100));
      const snap = await getDocs(q);
      const articles: NewsArticle[] = [];
      snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));
      setNews(articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`;
content = content.replace(oldFetchData, newFetchData);

// Delete unused handlers (handleDeleteSource, handleAddSource, handleTriggerAIFetch)
const unusedRegex = /const handleAddSource = async \(\) => \{[\s\S]*?const handleDeleteNews = async/g;
content = content.replace(unusedRegex, "const handleDeleteNews = async");

// Update handleDeleteNews
const oldDeleteNews = /const handleDeleteNews = async \(id: string\) => \{[\s\S]*?  \};/;
const newDeleteNews = `const handleDeleteNews = async (id: string) => {
    if(!confirm("Are you sure you want to delete this news?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };`;
content = content.replace(oldDeleteNews, newDeleteNews);

// Update the add news form API call
const oldAddNewsCall = /await fetch\("\/api\/admin\/add-news", \{[\s\S]*?\}\);/g;
const newAddNewsCall = `await setDoc(doc(db, "news", crypto.randomUUID()), newsItem);`;
content = content.replace(oldAddNewsCall, newAddNewsCall);

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Updated Admin.tsx");
