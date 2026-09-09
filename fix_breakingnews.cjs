const fs = require('fs');
let bn = fs.readFileSync('src/components/BreakingNews.tsx', 'utf8');

bn = bn.replace('pl-[100%]', '');

fs.writeFileSync('src/components/BreakingNews.tsx', bn);
