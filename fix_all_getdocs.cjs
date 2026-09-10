const fs = require('fs');

const filesToFix = [
  'src/components/Comments.tsx',
  'src/components/PollWidget.tsx',
  'src/components/AdBanner.tsx',
  'src/pages/Search.tsx',
  'src/pages/Article.tsx',
  'src/pages/Category.tsx',
  'src/pages/Team.tsx',
  'src/pages/EPaperPage.tsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('await getDocs(q)')) {
    // Add import if missing
    if (!code.includes('getCachedDocs')) {
      const importLevel = file.startsWith('src/pages') ? '../lib/cache' : '../lib/cache';
      code = code.replace(
        "import {", 
        `import { getCachedDocs } from "${importLevel}";\nimport {`
      );
    }
    
    // Some basic regex replacement for getDocs -> getCachedDocs
    code = code.replace(/await getDocs\(q\)/g, "await getCachedDocs(q, 'cache-' + Date.now())");
    code = code.replace(/await getDocs\(q2\)/g, "await getCachedDocs(q2, 'cache2-' + Date.now())");
    fs.writeFileSync(file, code);
    console.log("Fixed", file);
  }
});

