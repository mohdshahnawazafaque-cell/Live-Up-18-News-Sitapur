const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!home.includes('TrendingWidget')) {
  home = home.replace(
    'import PollWidget from "../components/PollWidget";',
    'import PollWidget from "../components/PollWidget";\nimport TrendingWidget from "../components/TrendingWidget";'
  );

  home = home.replace(
    '<PollWidget />',
    '<PollWidget />\n          <TrendingWidget />'
  );
  fs.writeFileSync('src/pages/Home.tsx', home);
}
