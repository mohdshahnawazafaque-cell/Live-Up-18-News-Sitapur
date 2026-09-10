const fs = require('fs');
let code = fs.readFileSync('src/pages/Article.tsx', 'utf8');

code = code.replace(
    "{article.updatedDate ? format(new Date(article.updatedDate), \"MMM d, yyyy, h:mm a\") : format(new Date(article.publicationDate || Date.now()), \"MMM d, yyyy, h:mm a\")}",
    "{(() => { try { return article.updatedDate ? format(new Date(article.updatedDate), \"MMM d, yyyy, h:mm a\") : format(new Date(article.publicationDate || Date.now()), \"MMM d, yyyy, h:mm a\") } catch(e) { return \"\" } })()}"
);

code = code.replace(
    "{c.date ? format(new Date(c.date), \"MMM d, yyyy\") : \"Unknown date\"}",
    "{(() => { try { return c.date ? format(new Date(c.date), \"MMM d, yyyy\") : \"Unknown date\" } catch(e) { return \"\" } })()}"
);

fs.writeFileSync('src/pages/Article.tsx', code);
console.log("Fixed Article date bug");
