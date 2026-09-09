const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes('isBreaking')) {
  types = types.replace(
    'videoUrl?: string;',
    'videoUrl?: string;\n  isBreaking?: boolean;'
  );
  fs.writeFileSync('src/types.ts', types);
}
