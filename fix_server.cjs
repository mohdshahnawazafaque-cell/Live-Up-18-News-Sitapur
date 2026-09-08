const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

// I clearly messed up the regex replace for /api/admin/ingest-rss
// Let's replace the broken part with a clean version.

const brokenPartRegex = /app\.post\("\/api\/admin\/add-news", async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: error\.message \}\);\n  \}\n\}\);\n    \}\n    const result = await processRssFeed\(url\);\n    res\.json\(result\);\n  \} catch \(error: any\) \{\n    console\.error\("Ingestion Error:", error\);\n    res\.status\(500\)\.json\(\{ error: error\.message \}\);\n  \}/g;

serverContent = serverContent.replace(brokenPartRegex, `app.post("/api/admin/add-news", async (req, res) => {
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
console.log("Fixed server.ts syntax");
