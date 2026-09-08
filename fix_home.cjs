const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Find the state variables
if (!content.includes('const [videos,')) {
  content = content.replace(
    'const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);',
    `const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [videos, setVideos] = useState<any[]>([]);`
  );
}

if (!content.includes('fetch("/api/videos")')) {
  content = content.replace(
    'useEffect(() => {',
    `useEffect(() => {
    fetch("/api/videos").then(res => res.json()).then(data => setVideos(data.videos || [])).catch(console.error);`
  );
}

// Fix Property 'map' does not exist on type 'unknown' which is probably related to categories.
// Let's replace 'unknown' with any if needed, or check where categories is used.
content = content.replace(/Object\.entries\(categories\)\.map/g, 'Object.entries(categories as any).map');

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Fixed Home.tsx");
