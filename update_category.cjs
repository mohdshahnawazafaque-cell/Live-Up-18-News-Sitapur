const fs = require('fs');

let content = fs.readFileSync('src/pages/Category.tsx', 'utf8');

content = content.replace(
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
  `import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport { collection, query, where, orderBy, getDocs } from "firebase/firestore";\nimport { db } from "../lib/firebase";`
);

const oldEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[categoryName\]\);/;
const newEffect = `useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "news"), where("category", "==", categoryName));
        // Note: orderBy("publicationDate", "desc") requires a composite index if where() is used.
        // We'll fetch and sort in client to avoid index requirement for now.
        const snap = await getDocs(q);
        const fetchedArticles: NewsArticle[] = [];
        snap.forEach(doc => fetchedArticles.push({ id: doc.id, ...doc.data() } as NewsArticle));
        
        fetchedArticles.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        setArticles(fetchedArticles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [categoryName]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/Category.tsx', content);
console.log("Updated Category.tsx");
