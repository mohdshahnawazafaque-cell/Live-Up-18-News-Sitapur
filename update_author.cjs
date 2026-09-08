const fs = require('fs');

let dataContent = fs.readFileSync('data.json', 'utf8');
dataContent = dataContent.replace(/"author":\s*"LIVE UP 18 NEWS"/g, '"author": "मो० शाहनवाज़"');
dataContent = dataContent.replace(/रिपोर्ट: LIVE UP 18 NEWS/g, 'रिपोर्ट: मो० शाहनवाज़');
dataContent = dataContent.replace(/Report: LIVE UP 18 NEWS/g, 'Report: Mohd. Shahnawaz');

// Add editor/reporter mention in footer
let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footerContent = footerContent.replace(
  `{language === 'hi' ? 'ईमेल' : 'Email'}: liveup18news@gmail.com</li>`,
  `<li>{language === 'hi' ? 'संपादक/रिपोर्टर' : 'Editor/Reporter'}: मो० शाहनवाज़</li>
              <li>{language === 'hi' ? 'ईमेल' : 'Email'}: liveup18news@gmail.com</li>`
);
fs.writeFileSync('data.json', dataContent);
fs.writeFileSync('src/components/Footer.tsx', footerContent);

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(/LIVE UP 18 NEWS/g, 'LIVE UP 18 NEWS'); // Just testing regex

console.log("Updated data.json and Footer");
