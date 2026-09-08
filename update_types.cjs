const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace('isBreaking?: boolean;', 'isBreaking?: boolean;\n  videoUrl?: string;');
fs.writeFileSync('src/types.ts', content);
