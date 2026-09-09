const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace(
  'src="https://www.youtube.com/embed/live_stream?channel=UCUcciGZnnAxPBldVagiGY1Z" // LIVE UP 18 NEWS Channel ID',
  'src="https://www.youtube.com/embed/lHRd4ug_Yq8"'
);

fs.writeFileSync('src/pages/Home.tsx', home);
console.log("YouTube Video ID updated.");
