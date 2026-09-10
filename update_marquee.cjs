const fs = require('fs');
let code = fs.readFileSync('src/components/TVNewsFrame.tsx', 'utf8');
code = code.replace('animate-[marquee_20s_linear_infinite]', 'animate-marquee');
fs.writeFileSync('src/components/TVNewsFrame.tsx', code);
