const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
if (!code.includes('event.preventDefault()')) {
    code = code.replace(
        "if (event.reason?.message?.includes('Quota limit exceeded')) {",
        "if (event.reason?.message?.includes('Quota limit exceeded')) {\n        event.preventDefault();"
    );
    fs.writeFileSync('src/App.tsx', code);
}
