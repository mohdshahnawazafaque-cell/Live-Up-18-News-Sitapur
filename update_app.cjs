const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import Districts')) {
    code = code.replace(
        'import Category from "./pages/Category";',
        'import Category from "./pages/Category";\nimport Districts from "./pages/Districts";'
    );
    
    code = code.replace(
        '<Route path="/team" element={<Team />} />',
        '<Route path="/team" element={<Team />} />\n              <Route path="/districts" element={<Districts />} />'
    );
    
    fs.writeFileSync('src/App.tsx', code);
}
