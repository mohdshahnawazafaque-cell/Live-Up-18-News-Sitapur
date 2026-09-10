const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
if (!code.includes("import { useState, useEffect }")) {
  code = 'import { useState, useEffect } from "react";\n' + code;
  fs.writeFileSync('src/App.tsx', code);
}
