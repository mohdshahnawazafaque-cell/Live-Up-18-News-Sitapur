const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /<option value="article_sidebar">Article Page \(Sidebar\)<\/option>/;
const newOption = `<option value="header_cover">Header Cover Image (Top)</option>
                  <option value="article_sidebar">Article Page (Sidebar)</option>`;

if (content.match(regex)) {
  content = content.replace(regex, newOption);
  fs.writeFileSync('src/pages/Admin.tsx', content);
  console.log("Added header_cover option");
} else {
  console.log("Could not find regex!");
}
