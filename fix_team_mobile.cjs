const fs = require('fs');
let code = fs.readFileSync('src/pages/Team.tsx', 'utf8');

if (code) {
    code = code.replace(
        'member.mobile.replace',
        '(member.mobile || "").replace'
    );
    fs.writeFileSync('src/pages/Team.tsx', code);
    console.log("Fixed Team mobile replace bug");
}
