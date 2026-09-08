const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldVideoStart = /\/\/ Demo videos[\s\S]*?\}\]\);/
const newVideoStart = `// Videos will be extracted from news articles with videoUrl`;
content = content.replace(oldVideoStart, newVideoStart);

const queryBlock = /if \(articles\.length > 0\) \{/
const replaceQueryBlock = `
        const videoArticles = articles.filter(a => a.videoUrl);
        setVideos(videoArticles.map(a => ({
          id: a.id,
          title: a.headline,
          titleEn: a.headlineEn || a.headline,
          url: a.videoUrl,
          date: a.publicationDate
        })));

        if (articles.length > 0) {`
content = content.replace(queryBlock, replaceQueryBlock);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx videos");
