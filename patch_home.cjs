const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add import
home = home.replace(
  'import { getEmbedUrl } from \'../lib/youtube\';',
  'import { getEmbedUrl } from \'../lib/youtube\';\nimport YouTubeGallery from \'../components/YouTubeGallery\';'
);

// 2. Remove the old manual Video News Gallery
const startIdx = home.indexOf('{/* Video News Section */}');
if (startIdx !== -1) {
  const endMarker = '</section>';
  const endIdx = home.indexOf(endMarker, startIdx);
  if (endIdx !== -1) {
    const oldSection = home.substring(startIdx, endIdx + endMarker.length);
    home = home.replace(oldSection, '<YouTubeGallery />');
  }
}

fs.writeFileSync('src/pages/Home.tsx', home);
