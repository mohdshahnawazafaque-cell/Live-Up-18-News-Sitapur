const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!code.includes('import { useNavigate }') && !code.includes('useNavigate } from')) {
    code = code.replace(
        'import React from "react";',
        'import React from "react";\nimport { useNavigate } from "react-router-dom";'
    );
    fs.writeFileSync('src/pages/Admin.tsx', code);
}
