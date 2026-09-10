const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (!code.includes('quota-banner')) {
  code += `
.quota-banner {
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
  color: #991b1b;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}
`;
  fs.writeFileSync('src/index.css', code);
}
