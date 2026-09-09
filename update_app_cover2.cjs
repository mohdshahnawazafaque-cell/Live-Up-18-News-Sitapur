const fs = require('fs');
let content = fs.readFileSync('src/components/AdBanner.tsx', 'utf8');

// For header_cover, we shouldn't show the placeholder if there's no ad, because it looks bad at the very top of the app to have a big dotted placeholder.
content = content.replace(
  /if \(ad\) \{/g,
  `if (position === 'header_cover' && !ad) return null;
  if (ad) {`
);

fs.writeFileSync('src/components/AdBanner.tsx', content);
console.log("Updated AdBanner for header_cover");
