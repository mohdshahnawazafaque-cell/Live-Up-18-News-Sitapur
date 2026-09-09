const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  '0% { transform: translateX(100%); }',
  '0% { transform: translateX(100vw); }'
);

fs.writeFileSync('src/index.css', css);
