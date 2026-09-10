const fs = require('fs');
let code = fs.readFileSync('src/pages/Article.tsx', 'utf8');

code = code.replace(
    "!article.featuredImage.includes('picsum') &&",
    "(article.featuredImage && !article.featuredImage.includes('picsum')) &&"
);

fs.writeFileSync('src/pages/Article.tsx', code);
console.log("Fixed image includes bug");
