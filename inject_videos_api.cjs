const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('app.get("/api/videos"')) {
  content = content.replace(
    'app.get("/api/news", (req, res) => {',
    `app.get("/api/videos", (req, res) => {
  res.json({ success: true, videos: db.data.videos || [] });
});

app.get("/api/news", (req, res) => {`
  );
  fs.writeFileSync('server.ts', content);
  console.log("Success");
}
