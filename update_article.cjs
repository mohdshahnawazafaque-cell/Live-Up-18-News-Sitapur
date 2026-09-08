const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// Update dark mode classes
content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
content = content.replace(/bg-white/g, 'bg-white dark:bg-slate-800');
content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-900');
content = content.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');
content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
content = content.replace(/divide-slate-100/g, 'divide-slate-100 dark:divide-slate-700');
content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-200');
content = content.replace(/hover:bg-slate-50/g, 'hover:bg-slate-50 dark:hover:bg-slate-700');

fs.writeFileSync('src/pages/Article.tsx', content);
console.log("Updated Article.tsx");
