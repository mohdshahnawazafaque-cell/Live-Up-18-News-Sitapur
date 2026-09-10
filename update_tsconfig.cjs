const fs = require('fs');
let tsconfig = fs.readFileSync('tsconfig.json', 'utf8');

if (!tsconfig.includes('vite-plugin-pwa/client')) {
  tsconfig = tsconfig.replace(
    '"types": [',
    '"types": ["vite/client", "vite-plugin-pwa/client",'
  );
  
  if (!tsconfig.includes('"types":')) {
      tsconfig = tsconfig.replace(
        '"skipLibCheck": true,',
        '"skipLibCheck": true,\n    "types": ["vite/client", "vite-plugin-pwa/client"],'
      );
  }
  
  fs.writeFileSync('tsconfig.json', tsconfig);
}
