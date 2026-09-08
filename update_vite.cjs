const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const serverRegex = /server: \{/;
content = content.replace(serverRegex, `server: {\n      port: 3000,\n      host: '0.0.0.0',`);

fs.writeFileSync('vite.config.ts', content);
console.log("Updated vite.config.ts");
