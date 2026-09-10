const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const regex = /<span className="hidden sm:inline">\|<\/span>\s*<a href="https:\/\/chat\.whatsapp\.com"[\s\S]*?<\/a>/;
code = code.replace(regex, "");

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Removed WhatsApp Group Link.");
