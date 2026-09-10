const fs = require('fs');
let code = fs.readFileSync('src/components/BreakingNews.tsx', 'utf8');

if (!code.includes('getCachedDocs')) {
    code = code.replace(
        'import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";',
        'import { collection, query, orderBy, limit, where } from "firebase/firestore";\nimport { getCachedDocs } from "../lib/cache";'
    );
    
    code = code.replace(
        `        const snap = await getDocs(q);
        const articles: NewsArticle[] = [];
        snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));`,
        `        let articles = await getCachedDocs(q, 'breaking-news');`
    );
    
    code = code.replace(
        `          const snap2 = await getDocs(q2);
          snap2.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));`,
        `          articles = await getCachedDocs(q2, 'latest-news-fallback');`
    );
    fs.writeFileSync('src/components/BreakingNews.tsx', code);
}
