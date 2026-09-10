const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes('getCachedDocs')) {
    code = code.replace(
        'import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";',
        'import { collection, query, orderBy, limit } from "firebase/firestore";\nimport { getCachedDocs } from "../lib/cache";'
    );
    
    code = code.replace(
        `        const querySnapshot = await getDocs(q);
        const articles: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          articles.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });`,
        `        const articles = await getCachedDocs(q, 'home-news');`
    );
    fs.writeFileSync('src/pages/Home.tsx', code);
}
