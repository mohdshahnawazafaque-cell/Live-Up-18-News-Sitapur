const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import AdBanner')) {
  content = content.replace(
    'import Header from "./components/Header";',
    'import Header from "./components/Header";\nimport AdBanner from "./components/AdBanner";'
  );
}

const headerRegex = /<div className="flex-1 bg-slate-50 dark:bg-slate-900 transition-colors">/;
const newHeader = `<div className="flex-1 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2 hidden md:block">
          <AdBanner position="header_cover" className="h-[120px]" />
        </div>`;

if (!content.includes('header_cover')) {
  content = content.replace(headerRegex, newHeader);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Added cover banner to App.tsx");
} else {
  console.log("Already present!");
}
