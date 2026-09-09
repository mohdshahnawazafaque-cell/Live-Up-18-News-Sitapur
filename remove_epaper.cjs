const fs = require('fs');

// 1. Remove EPaper from Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(',\n  { en: "E-PAPER", hi: "ई-पेपर", path: "/epaper" }', '');
fs.writeFileSync('src/components/Header.tsx', header);

// 2. Remove EPaper from App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace('\nimport EPaperPage from "./pages/EPaperPage";', '');
appContent = appContent.replace('\n              <Route path="/epaper" element={<EPaperPage />} />', '');
fs.writeFileSync('src/App.tsx', appContent);

// 3. Remove EPaper from Admin.tsx
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
// Use regex to remove the E-Paper Manager block
const epaperRegex = /\{\/\* E-Paper Manager \*\/\}.*?(?=\{\/\* Poll Manager \*\/})/s;
admin = admin.replace(epaperRegex, '');
fs.writeFileSync('src/pages/Admin.tsx', admin);

console.log("E-Paper removed successfully.");
