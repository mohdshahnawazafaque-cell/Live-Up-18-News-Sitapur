const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  'Object.entries(categories as any).map(([catName, articles]) => (',
  'Object.entries(categories).map(([catName, articles]: [string, any]) => ('
);

fs.writeFileSync('src/pages/Home.tsx', content);
