const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

const imgBlock = /\{!article\.featuredImage\.includes\('picsum'\) && \([\s\S]*?className="w-full h-auto rounded-xl shadow-md object-cover max-h-\[500px\]" \/>\n          \)\}/;

const replaceWith = `
          {article.videoUrl ? (
            article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
              <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden shadow-md">
                <iframe src={article.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} className="w-full h-[400px] md:h-[500px]" allowFullScreen></iframe>
              </div>
            ) : (
              <video src={article.videoUrl} controls className="w-full h-auto rounded-xl shadow-md max-h-[500px] bg-black" />
            )
          ) : !article.featuredImage.includes('picsum') && (
            <img src={article.featuredImage} alt={getLocalizedText(article, 'headline', language)} className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" />
          )}
`;

content = content.replace(imgBlock, replaceWith);
fs.writeFileSync('src/pages/Article.tsx', content);
console.log("Updated Article to handle videoUrl");
