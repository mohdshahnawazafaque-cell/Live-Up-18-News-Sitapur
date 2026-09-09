const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace(
  'UCUcciGZnnAxPBldVagiGY1Q',
  'UCUcciGZnnAxPBldVagiGY1Z'
);

fs.writeFileSync('src/pages/Home.tsx', home);
console.log("Fixed ID");
