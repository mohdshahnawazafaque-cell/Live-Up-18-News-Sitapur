const fs = require('fs');
let code = fs.readFileSync('src/components/TVNewsFrame.tsx', 'utf8');

code = code.replace(
    "{article.category.replace('-', ' ')}",
    "{(article.category || '').replace('-', ' ')}"
);

fs.writeFileSync('src/components/TVNewsFrame.tsx', code);
console.log("Fixed TVNewsFrame category replace bug");
