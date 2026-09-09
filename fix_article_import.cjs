const fs = require('fs');
let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');

if (!article.includes('import YouTubeGallery')) {
  article = article.replace(
    'import { db } from "../lib/firebase";',
    'import { db } from "../lib/firebase";\nimport YouTubeGallery from "../components/YouTubeGallery";'
  );
  fs.writeFileSync('src/pages/Article.tsx', article);
}
