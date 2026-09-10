const fs = require('fs');
let code = fs.readFileSync('src/pages/Category.tsx', 'utf8');

code = code.replace(
    'fetchedArticles.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());',
    'fetchedArticles.sort((a, b) => (new Date(b.publicationDate || 0)).getTime() - (new Date(a.publicationDate || 0)).getTime());'
);

fs.writeFileSync('src/pages/Category.tsx', code);
