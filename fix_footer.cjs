const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace('<li><li>', '<li>');

fs.writeFileSync('src/components/Footer.tsx', content);
