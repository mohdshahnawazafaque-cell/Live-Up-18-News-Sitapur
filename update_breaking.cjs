const fs = require('fs');

let content = fs.readFileSync('src/components/BreakingNews.tsx', 'utf8');

content = content.replace(
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
  `import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport { collection, query, orderBy, limit, getDocs } from "firebase/firestore";\nimport { db } from "../lib/firebase";`
);

const oldEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const newEffect = `useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(5));
        const snap = await getDocs(q);
        const articles: NewsArticle[] = [];
        snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));
        setBreakingNews(articles);
        // hardcode breaking enabled to true for simplicity
        setEnabled(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNews();
  }, []);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/BreakingNews.tsx', content);
console.log("Updated BreakingNews.tsx");
