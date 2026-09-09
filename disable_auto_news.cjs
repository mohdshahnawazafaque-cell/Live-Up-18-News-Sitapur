const fs = require('fs');

try {
  // If post_news.cjs exists, let's remove it so we don't accidentally run it or it gets executed.
  if (fs.existsSync('post_news.cjs')) fs.unlinkSync('post_news.cjs');
  if (fs.existsSync('post_news.js')) fs.unlinkSync('post_news.js');
  console.log("Auto-news scripts disabled.");
} catch(e) {
  console.log("No scripts found to remove.");
}
