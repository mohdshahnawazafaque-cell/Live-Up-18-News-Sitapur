const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(
    "{news.publicationDate ? formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true }) : \"\"}",
    "{(() => { try { return news.publicationDate ? formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true }) : \"\" } catch(e) { return \"\" } })()}"
);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Fixed Home date bug");
