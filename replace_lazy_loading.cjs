const fs = require('fs');

function addLazyLoading(file) {
  let code = fs.readFileSync(file, 'utf8');
  // Simple regex to add loading="lazy" to imgs that don't have it
  code = code.replace(/<img(?![^>]*\bloading=["']lazy["'])([^>]*?)>/g, '<img loading="lazy"$1>');
  fs.writeFileSync(file, code);
}

addLazyLoading('src/pages/Article.tsx');
addLazyLoading('src/pages/Home.tsx');
addLazyLoading('src/pages/Category.tsx');
addLazyLoading('src/pages/Search.tsx');
addLazyLoading('src/components/AdBanner.tsx');

