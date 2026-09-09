const fs = require('fs');

// Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
if (!appContent.includes('EPaperPage')) {
  appContent = appContent.replace(
    'import Team from "./pages/Team";',
    'import Team from "./pages/Team";\nimport EPaperPage from "./pages/EPaperPage";'
  );
  appContent = appContent.replace(
    '<Route path="/team" element={<Team />} />',
    '<Route path="/team" element={<Team />} />\n              <Route path="/epaper" element={<EPaperPage />} />'
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

// Update Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
if (!header.includes('E-PAPER')) {
  header = header.replace(
    '{ en: "TEAM", hi: "हमारी टीम", path: "/team" }',
    '{ en: "TEAM", hi: "हमारी टीम", path: "/team" },\n  { en: "E-PAPER", hi: "ई-पेपर", path: "/epaper" }'
  );
  fs.writeFileSync('src/components/Header.tsx', header);
}
