const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace the dummy YouTube ID with the real one
home = home.replace(
  'src="https://www.youtube.com/embed/live_stream?channel=UC4g10N18M95W2P0RntOvy1A" // Using a dummy channel ID, admin can change later',
  'src="https://www.youtube.com/embed/live_stream?channel=UCUcciGZnnAxPBldVagiGY1Q" // LIVE UP 18 NEWS Channel ID'
);

// Wait, the regex captured UCUcciGZnnAxPBldVagiGY1Z but it should be a valid ID. Let me look closely.
home = home.replace(
  'src="https://www.youtube.com/embed/live_stream?channel=UC4g10N18M95W2P0RntOvy1A"',
  'src="https://www.youtube.com/embed/live_stream?channel=UCUcciGZnnAxPBldVagiGY1Q"'
);

fs.writeFileSync('src/pages/Home.tsx', home);
console.log("YouTube Channel ID updated.");
