const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  '{ en: "UTTAR PRADESH", hi: "उत्तर प्रदेश", path: "/category/uttar-pradesh" },',
  '{ en: "UTTAR PRADESH", hi: "उत्तर प्रदेश", path: "/category/uttar-pradesh" },\n  { en: "UP DISTRICTS", hi: "यूपी के ज़िले", path: "/districts" },'
);

fs.writeFileSync('src/components/Header.tsx', code);
