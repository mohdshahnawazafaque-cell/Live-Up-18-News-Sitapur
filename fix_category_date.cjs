const fs = require('fs');
let code = fs.readFileSync('src/pages/Category.tsx', 'utf8');

code = code.replace(
    "{news.publicationDate ? formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true }) : \"\"}",
    "{(() => { try { return news.publicationDate ? formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true }) : \"\" } catch(e) { return \"\" } })()}"
);

fs.writeFileSync('src/pages/Category.tsx', code);
console.log("Fixed Category date bug");
