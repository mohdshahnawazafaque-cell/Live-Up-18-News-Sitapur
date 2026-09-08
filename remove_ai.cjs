const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

// Remove cron
serverContent = serverContent.replace(/import cron from "node-cron";\n/, '');
serverContent = serverContent.replace(/import Parser from "rss-parser";\n/, '');

const cronRegex = /\/\/ Autonomous Fetcher - CRON Scheduler[\s\S]*?console\.log\("News Fetcher: Completed news fetching cycle\."\);\n}\);\n/g;
serverContent = serverContent.replace(cronRegex, '');

const rssFuncRegex = /async function processRssFeed\([\s\S]*?return \{ success: false, message: "No items found" \};\n\}/g;
serverContent = serverContent.replace(rssFuncRegex, '');

const seedRegex = /\/\/ Initialize real news data[\s\S]*?console\.error\("Error seeding from", source, e\);\n    \}\n  \}\n\};/g;
serverContent = serverContent.replace(seedRegex, '');

// Disable ingest-rss
serverContent = serverContent.replace(/app\.post\("\/api\/admin\/ingest-rss", async \(req, res\) => \{[\s\S]*?\}\);/, `app.post("/api/admin/add-news", async (req, res) => {
  try {
    const newsItem = req.body;
    newsItem.id = crypto.randomUUID();
    newsArticles.unshift(newsItem);
    saveData();
    res.json({ success: true, article: newsItem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});`);

fs.writeFileSync('server.ts', serverContent);
console.log("Removed AI and CRON from server.ts");
