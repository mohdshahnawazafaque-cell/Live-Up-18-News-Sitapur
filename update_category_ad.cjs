const fs = require('fs');
let content = fs.readFileSync('src/pages/Category.tsx', 'utf8');

content = content.replace(
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
  'import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport AdBanner from "../components/AdBanner";'
);

const oldAd = /<div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 h-\[250px\] flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-300 mb-8">\s*\{language === 'hi' \? 'विज्ञापन स्थान' : 'Advertisement Space'\}\s*<\/div>/;

const newAd = `<AdBanner position="home_middle" className="h-[250px] mb-8" />`;

content = content.replace(oldAd, newAd);
fs.writeFileSync('src/pages/Category.tsx', content);
console.log("Updated Category.tsx Ad banner");
