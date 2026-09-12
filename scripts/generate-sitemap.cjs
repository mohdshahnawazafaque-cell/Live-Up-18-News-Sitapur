const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://liveup18news.netlify.app';

// Static Routes
const staticRoutes = [
  { path: '', changefreq: 'hourly', priority: '1.0' },
  { path: '/districts', changefreq: 'daily', priority: '0.8' },
  { path: '/live-studio', changefreq: 'daily', priority: '0.8' },
  { path: '/team', changefreq: 'monthly', priority: '0.6' },
  { path: '/shorts', changefreq: 'daily', priority: '0.8' },
  { path: '/install', changefreq: 'monthly', priority: '0.5' },
];

// Main Categories
const categories = [
  'india',
  'uttar-pradesh',
  'politics',
  'crime',
  'weather',
  'business',
  'sports',
  'entertainment',
  'technology',
  'education',
  'health',
  'world',
  'video-news',
  'photo-gallery',
];

// UP Districts
let districts = [];
try {
  const districtsPath = path.join(__dirname, '../up_districts.json');
  if (fs.existsSync(districtsPath)) {
    districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));
  }
} catch (e) {
  console.warn('Could not load districts:', e);
}

// Articles from data.json
let articles = [];
try {
  const dataJsonPath = path.join(__dirname, '../data.json');
  if (fs.existsSync(dataJsonPath)) {
    const data = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
    articles = data.articles || [];
  }
} catch (e) {
  console.warn('Could not load data.json:', e);
}

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static pages
staticRoutes.forEach(route => {
  const fullPath = route.path ? `${BASE_URL}${route.path}` : `${BASE_URL}/`;
  xml += `  <url>
    <loc>${fullPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
});

// Add categories
categories.forEach(cat => {
  xml += `  <url>
    <loc>${BASE_URL}/category/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add districts
districts.forEach(dist => {
  const slug = dist.toLowerCase().trim().replace(/\s+/g, '-');
  xml += `  <url>
    <loc>${BASE_URL}/category/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

// Add articles
articles.forEach(article => {
  if (article.id) {
    const pubDate = article.publicationDate 
      ? new Date(article.publicationDate).toISOString().split('T')[0]
      : today;
    xml += `  <url>
    <loc>${BASE_URL}/article/${article.id}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  }
});

xml += `</urlset>`;

// Write sitemap.xml to public/
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
console.log('Successfully generated public/sitemap.xml with', staticRoutes.length + categories.length + districts.length + articles.length, 'URLs');

// Also generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://liveup18news.netlify.app/sitemap.xml
Sitemap: https://liveup18news.com/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
console.log('Successfully generated public/robots.txt');
