const fs = require('fs');
let code = fs.readFileSync('src/pages/Category.tsx', 'utf8');

if (!code.includes('getCachedDocs')) {
    code = code.replace(
        'import { collection, query, where, orderBy, getDocs } from "firebase/firestore";',
        'import { collection, query, where, orderBy } from "firebase/firestore";\nimport { getCachedDocs } from "../lib/cache";'
    );
    
    code = code.replace(
        `        const snap = await getDocs(q);
        const articles: NewsArticle[] = [];
        snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));`,
        `        const articles = await getCachedDocs(q, \`cat-\${id}\`);`
    );
    fs.writeFileSync('src/pages/Category.tsx', code);
}
