const fs = require('fs');
let code = fs.readFileSync('src/components/TrendingWidget.tsx', 'utf8');
if (!code.includes('getCachedDocs')) {
    code = code.replace(
        "import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';",
        "import { collection, query, orderBy, limit } from 'firebase/firestore';\nimport { getCachedDocs } from '../lib/cache';"
    );
    code = code.replace(
        `        const snap = await getDocs(q);
        const articles: NewsArticle[] = [];
        snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));`,
        `        const articles = await getCachedDocs(q, 'trending-news');`
    );
    fs.writeFileSync('src/components/TrendingWidget.tsx', code);
}
