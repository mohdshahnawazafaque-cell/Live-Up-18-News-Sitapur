const fs = require('fs');
let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// Reset to a clean state
const match = article.match(/(<\/aside>\s*<\/div>)(.*?)(\s*\);\s*\})/s);
if (match) {
  article = article.replace(
    match[0],
    `</aside>
    </div>
    <div className="mt-12 w-full max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8">
      <YouTubeGallery />
    </div>
    </>
  );
}`
  );
  
  // Need to wrap the main return in a fragment if it's not already
  if (!article.includes('return (\n    <>')) {
      article = article.replace('return (\n    <div className', 'return (\n    <>\n    <div className');
  }
}

fs.writeFileSync('src/pages/Article.tsx', article);
