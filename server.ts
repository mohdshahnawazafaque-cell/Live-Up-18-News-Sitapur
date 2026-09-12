import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Explicit XML Sitemap & Robots.txt routes
  app.get("/sitemap.xml", (req, res) => {
    const sitemapFile = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist/sitemap.xml" : "public/sitemap.xml");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.sendFile(sitemapFile);
  });

  app.get("/robots.txt", (req, res) => {
    const robotsFile = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist/robots.txt" : "public/robots.txt");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.sendFile(robotsFile);
  });

  // Dynamic binary article image proxy for WhatsApp / social preview scrapers
  app.get("/api/article-image/:id", async (req, res) => {
    try {
      const articleId = req.params.id;
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0319583234/databases/ai-studio-liveup18news-6a9c02cc-41a6-4f64-ab51-964a11eec3b9/documents/news/${articleId}`;
      const dbRes = await fetch(firestoreUrl);
      if (!dbRes.ok) {
        return res.redirect("/logo.png");
      }
      const data = await dbRes.json();
      const rawImage = data.fields?.featuredImage?.stringValue;
      if (!rawImage) {
        return res.redirect("/logo.png");
      }
      const match = rawImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1] || 'image/jpeg';
        const buffer = Buffer.from(match[2], 'base64');
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Length", buffer.length);
        res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
        return res.send(buffer);
      }
      if (rawImage.startsWith("http")) {
        return res.redirect(rawImage);
      }
      return res.redirect("/logo.png");
    } catch {
      return res.redirect("/logo.png");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
