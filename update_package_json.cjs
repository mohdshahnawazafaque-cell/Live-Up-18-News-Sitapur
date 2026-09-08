const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log("Updated package.json");
