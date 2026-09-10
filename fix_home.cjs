const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Remove YouTubeGallery import
code = code.replace('import YouTubeGallery from "../components/YouTubeGallery";\n', '');

// 2. Set latestNews to take everything after top 5
code = code.replace(
    'setLatestNews(articles.slice(5, 15));',
    'setLatestNews(articles.slice(5));' // take the rest
);

// 3. Remove .slice(0, 4) from rendering latestNews
code = code.replace(
    '{latestNews.slice(0, 4).map(news => (',
    '{latestNews.map(news => ('
);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Fixed Home.tsx");
