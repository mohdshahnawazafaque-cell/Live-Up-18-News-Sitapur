const fs = require('fs');
const dataPath = './data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

if (data.newsArticles && data.articles) {
  data.articles.unshift(...data.newsArticles);
  delete data.newsArticles;
} else if (data.newsArticles) {
  data.articles = data.newsArticles;
  delete data.newsArticles;
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("Fixed data.json");
