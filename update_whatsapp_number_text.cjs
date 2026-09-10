const fs = require('fs');
let content = fs.readFileSync('src/components/BreakingNews.tsx', 'utf8');
content = content.replace(/9956078419/g, '9838416560');
fs.writeFileSync('src/components/BreakingNews.tsx', content);
