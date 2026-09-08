import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
const articles = Array.isArray(data) ? data : (data.articles || data.news || Object.values(data));
const found = articles.filter(n => {
  const t = JSON.stringify(n);
  return t.includes("पूर्व") || t.includes("purv") || t.includes("chairman") || t.includes("चेयरमैन");
});
console.log(found.map(n => n.headline));
