const fs = require('fs');
let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// The regex replace is tricky because there are multiple </div> tags.
// Instead, let's insert it right after the </aside> tag.

const asideEnd = '</aside>';
const replacement = `</aside>
    </div>
    <div className="mt-12 w-full max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8">
      <h3 className="text-xl font-bold mb-4 uppercase text-slate-800 dark:text-white">Related Videos</h3>
      <YouTubeGallery />
    </div>`;

article = article.replace(asideEnd, replacement);
fs.writeFileSync('src/pages/Article.tsx', article);
