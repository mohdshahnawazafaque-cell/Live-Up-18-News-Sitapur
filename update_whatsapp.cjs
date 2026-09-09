const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('WhatsAppButton')) {
  content = content.replace(
    'import Footer from "./components/Footer";',
    'import Footer from "./components/Footer";\nimport WhatsAppButton from "./components/WhatsAppButton";'
  );
  
  content = content.replace(
    '</Router>',
    '  <WhatsAppButton />\n    </Router>'
  );
  fs.writeFileSync('src/App.tsx', content);
}
