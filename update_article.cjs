const fs = require('fs');
let code = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// Add import
if (!code.includes('TVNewsFrame')) {
    code = code.replace(
        'import YouTubeGallery from "../components/YouTubeGallery";',
        'import YouTubeGallery from "../components/YouTubeGallery";\nimport TVNewsFrame from "../components/TVNewsFrame";'
    );
}

// Replace the video render logic
const oldVideoLogic = `{article.videoUrl ? (
            article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
              <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden shadow-md">
                <iframe src={getEmbedUrl(article.videoUrl)} className="w-full h-[400px] md:h-[500px]" allowFullScreen></iframe>
              </div>
            ) : (
              <video src={article.videoUrl} controls className="w-full h-auto rounded-xl shadow-md max-h-[500px] bg-black" />
            )
          ) : !article.featuredImage.includes('picsum') && (
            <img loading="lazy" src={article.featuredImage} alt={getLocalizedText(article, 'headline', language)} className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" />
          )}`;

const newVideoLogic = `{article.videoUrl ? (
            <TVNewsFrame article={article} />
          ) : !article.featuredImage.includes('picsum') && (
            <img loading="lazy" src={article.featuredImage} alt={getLocalizedText(article, 'headline', language)} className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" />
          )}`;

code = code.replace(oldVideoLogic, newVideoLogic);
fs.writeFileSync('src/pages/Article.tsx', code);
