const fs = require('fs');
let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// We need to add the YouTube gallery below the article to show related videos.
// We'll just import YouTubeGallery and put it at the bottom.

if (!article.includes('import YouTubeGallery')) {
  article = article.replace(
    'import { formatDistanceToNow } from "date-fns";',
    'import { formatDistanceToNow } from "date-fns";\nimport YouTubeGallery from "../components/YouTubeGallery";'
  );
  
  // Find the closing main tag
  const mainEnd = '</main>';
  article = article.replace(
    '</article>\n    </main>',
    '</article>\n      <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">\n        <YouTubeGallery />\n      </div>\n    </main>'
  );
  
  fs.writeFileSync('src/pages/Article.tsx', article);
}

