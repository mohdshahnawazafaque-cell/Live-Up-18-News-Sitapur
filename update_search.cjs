const fs = require('fs');

let content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

content = content.replace(
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
  `import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport { collection, query as fsQuery, orderBy, limit, getDocs } from "firebase/firestore";\nimport { db } from "../lib/firebase";`
);

const oldEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[query\]\);/;
const newEffect = `useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const q = fsQuery(collection(db, "news"), orderBy("publicationDate", "desc"), limit(100));
        const snap = await getDocs(q);
        const articles: NewsArticle[] = [];
        snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          const filtered = articles.filter((a: NewsArticle) => { 
             const titleMatch = (a.headline || "").toLowerCase().includes(lowerQuery) || (a.headlineEn || "").toLowerCase().includes(lowerQuery);
             const contentMatch = (a.shortSummary || "").toLowerCase().includes(lowerQuery) || (a.shortSummaryEn || "").toLowerCase().includes(lowerQuery);
             return titleMatch || contentMatch;
          });
          setResults(filtered);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [query]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/Search.tsx', content);
console.log("Updated Search.tsx");
