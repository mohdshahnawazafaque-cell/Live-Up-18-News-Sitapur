const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!header.includes('import PWAInstallButton')) {
  header = header.replace(
    "import { useLanguage } from '../context/LanguageContext';",
    "import { useLanguage } from '../context/LanguageContext';\nimport PWAInstallButton from './PWAInstallButton';"
  );
  
  header = header.replace(
    "className=\"p-2 text-white hover:bg-slate-800 rounded-full transition-colors\"",
    "className=\"p-2 text-white hover:bg-slate-800 rounded-full transition-colors\""
  );
  
  // Find where to insert it in the top bar. Right next to the language toggle.
  header = header.replace(
    '<button \n            onClick={toggleLanguage}',
    '<PWAInstallButton />\n          <button \n            onClick={toggleLanguage}'
  );
  
  fs.writeFileSync('src/components/Header.tsx', header);
}
