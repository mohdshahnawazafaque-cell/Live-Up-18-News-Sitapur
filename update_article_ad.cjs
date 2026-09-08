const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// Add import
content = content.replace(
  'import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";',
  'import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";\nimport AdBanner from "../components/AdBanner";'
);

const oldAd = /<div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 h-\[300px\] flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-300">\s*\{language === 'hi' \? 'विज्ञापन स्थान' : 'Advertisement Space'\}\s*<\/div>/;

const newAd = `<AdBanner position="article_sidebar" className="h-[300px]" />`;

content = content.replace(oldAd, newAd);
fs.writeFileSync('src/pages/Article.tsx', content);
console.log("Updated Article.tsx Ad banner");
