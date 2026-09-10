const fs = require('fs');
let code = fs.readFileSync('src/pages/Article.tsx', 'utf8');

code = code.replace(
    'article.category.toLowerCase().replace',
    '(article.category || "").toLowerCase().replace'
);

fs.writeFileSync('src/pages/Article.tsx', code);
console.log("Fixed Article category replace bug");
