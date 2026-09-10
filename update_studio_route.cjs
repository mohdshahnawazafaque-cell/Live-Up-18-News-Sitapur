const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import LiveStudio')) {
    code = code.replace(
        'import Districts from "./pages/Districts";',
        'import Districts from "./pages/Districts";\nimport LiveStudio from "./pages/LiveStudio";'
    );
    
    code = code.replace(
        '<Route path="/admin" element={<Admin />} />',
        '<Route path="/admin" element={<Admin />} />\n              <Route path="/live-studio" element={<LiveStudio />} />'
    );
    
    fs.writeFileSync('src/App.tsx', code);
}
