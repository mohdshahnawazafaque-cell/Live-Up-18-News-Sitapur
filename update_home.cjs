const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add Firebase imports
content = content.replace(
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
  `import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport { collection, query, orderBy, limit, getDocs } from "firebase/firestore";\nimport { db } from "../lib/firebase";`
);

// Replace fetch("/api/videos") and fetch("/api/news")
const oldEffect = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;

const newEffect = `useEffect(() => {
    // Demo videos
    setVideos([{
      id: 'v1', 
      title: 'LIVE UP 18 - Daily News Bulletin', 
      titleEn: 'LIVE UP 18 - Daily News Bulletin', 
      url: 'https://www.youtube.com/embed/jfKfPfyJRdk', 
      date: new Date().toISOString()
    }]);

    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(25));
        const querySnapshot = await getDocs(q);
        const articles: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          articles.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });

        if (articles.length > 0) {
          setFeaturedNews(articles[0]);
          setTopHeadlines(articles.slice(1, 5));
          setLatestNews(articles.slice(5, 15));
          
          const cats: { [key: string]: NewsArticle[] } = {};
          articles.forEach(article => {
            if (!cats[article.category]) cats[article.category] = [];
            if (cats[article.category].length < 4) {
              cats[article.category].push(article);
            }
          });
          setCategories(cats);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx");
