const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

footer = footer.replace(
  "<li>{language === 'hi' ? 'संपादक/रिपोर्टर' : 'Editor/Reporter'}: मो० शाहनवाज़</li>",
  "<li>{language === 'hi' ? 'प्रधान संपादक (Editor-in-Chief)' : 'Editor-in-Chief'}: मो० शाहनवाज़ (Mohd Shahnawaz)</li>"
);

fs.writeFileSync('src/components/Footer.tsx', footer);
