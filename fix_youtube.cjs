const fs = require('fs');

// Create a robust youtube parser helper
const helperCode = `
export function getEmbedUrl(url: string | undefined): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return 'https://www.youtube.com/embed/' + match[2];
  }
  return url;
}
`;

fs.writeFileSync('src/lib/youtube.ts', helperCode);

// 1. Update Home.tsx
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
home = home.replace('import { useLanguage, getLocalizedText } from \'../context/LanguageContext\';', 'import { useLanguage, getLocalizedText } from \'../context/LanguageContext\';\nimport { getEmbedUrl } from \'../lib/youtube\';');
home = home.replace(/src=\{videos\[0\].url\}/g, 'src={getEmbedUrl(videos[0].url)}');
home = home.replace(/src=\{vid.url\}/g, 'src={getEmbedUrl(vid.url)}');
fs.writeFileSync('src/pages/Home.tsx', home);

// 2. Update Article.tsx
let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');
article = article.replace('import { useLanguage, getLocalizedText } from \'../context/LanguageContext\';', 'import { useLanguage, getLocalizedText } from \'../context/LanguageContext\';\nimport { getEmbedUrl } from \'../lib/youtube\';');
// Replace the inline replace logic
const inlineLogic = `article.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')`;
article = article.replace(inlineLogic, 'getEmbedUrl(article.videoUrl)');
fs.writeFileSync('src/pages/Article.tsx', article);

// 3. Update Admin.tsx so it also saves cleanly just in case
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
admin = admin.replace('import { NewsArticle } from "../types";', 'import { NewsArticle } from "../types";\nimport { getEmbedUrl } from "../lib/youtube";');
admin = admin.replace('videoUrl: finalVideoUrl || null,', 'videoUrl: finalVideoUrl ? getEmbedUrl(finalVideoUrl) : null,');
fs.writeFileSync('src/pages/Admin.tsx', admin);

console.log("YouTube parsing logic added!");
