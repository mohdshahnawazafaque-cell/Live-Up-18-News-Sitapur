import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Parser from "rss-parser";
import crypto from "crypto";
import cron from "node-cron";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for the news
let newsArticles: any[] = [];
let isBreakingNewsEnabled = true;

// Managed RSS Sources
let rssSources = [
  "https://zeenews.india.com/hindi/india.xml",
  "https://rss.jagran.com/rss/news/national.xml",
  "https://hindi.news18.com/rss/khabar/nation/nation.xml",
  "https://www.livehindustan.com/rss/national",
  "https://www.livehindustan.com/rss/sports",
  "https://www.livehindustan.com/rss/entertainment",
  "https://www.livehindustan.com/rss/business",
  "https://www.livehindustan.com/rss/uttar-pradesh",
  "https://rss.jagran.com/rss/news/state.xml",
  "https://rss.jagran.com/rss/sports/cricket.xml",
  "https://rss.jagran.com/rss/entertainment/bollywood.xml"
];

// File based persistence so data isn't lost on restart during dev
const DATA_FILE = path.join(process.cwd(), 'data.json');

const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      newsArticles = data.articles || [];
      rssSources = data.sources || rssSources;
    } catch (e) {
      console.error("Failed to load data", e);
    }
  } else {
    seedRealNews();
  }
};

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    articles: newsArticles,
    sources: rssSources
  }, null, 2));
};

const getCategoryFromTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('cricket') || t.includes('ipl') || t.includes('match') || t.includes('स्पोर्ट्स') || t.includes('खेल') || t.includes('क्रिकेट')) return 'SPORTS';
  if (t.includes('movie') || t.includes('film') || t.includes('actor') || t.includes('bollywood') || t.includes('सिनेमा') || t.includes('बॉलीवुड')) return 'ENTERTAINMENT';
  if (t.includes('business') || t.includes('market') || t.includes('economy') || t.includes('व्यापार') || t.includes('बाजार') || t.includes('शेयर')) return 'BUSINESS';
  if (t.includes('tech') || t.includes('mobile') || t.includes('app') || t.includes('तकनीक') || t.includes('स्मार्टफोन')) return 'TECHNOLOGY';
  if (t.includes('health') || t.includes('hospital') || t.includes('स्वास्थ्य') || t.includes('अस्पताल')) return 'HEALTH';
  if (t.includes('election') || t.includes('modi') || t.includes('bjp') || t.includes('congress') || t.includes('चुनाव') || t.includes('राजनीति')) return 'POLITICS';
  if (t.includes('up ') || t.includes('uttar pradesh') || t.includes('yogi') || t.includes('यूपी') || t.includes('उत्तर प्रदेश')) return 'UTTAR PRADESH';
  return 'INDIA';
};

const extractImageUrl = (content: string) => {
  const match = content?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/800/450';
};

const stripHtml = (html: string) => {
  return html ? html.replace(/<[^>]*>?/gm, '') : '';
};

// Initialize real news data
const seedRealNews = async () => {
  console.log("Seeding real news...");
  for (const source of rssSources) {
    try {
      await processRssFeed(source);
    } catch (e) {
      console.error("Error seeding from", source, e);
    }
  }
};

loadData();

// API Routes
app.get("/api/videos", (req, res) => {
  res.json({ success: true, videos: [{
    id: 'v1', 
    title: 'LIVE UP 18 - Daily News Bulletin (AI Generated)', 
    titleEn: 'LIVE UP 18 - Daily News Bulletin (AI Generated)', 
    url: 'https://www.youtube.com/embed/jfKfPfyJRdk', 
    date: new Date().toISOString()
  }] });
});

app.get("/api/news", (req, res) => {
  const { category, state, isBreaking, limit, sort } = req.query;
  let filteredNews = [...newsArticles];

  if (category) {
    filteredNews = filteredNews.filter(n => n.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (state) {
    filteredNews = filteredNews.filter(n => n.state === state);
  }
  if (isBreaking === 'true') {
    filteredNews = filteredNews.filter(n => n.isBreaking);
  }

  if (sort === 'views') {
    filteredNews.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    // Default sort by date desc
    filteredNews.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
  }

  if (limit) {
    filteredNews = filteredNews.slice(0, parseInt(limit as string));
  }

  res.json({ articles: filteredNews, breakingNewsEnabled: isBreakingNewsEnabled });
});

app.get("/api/news/:id", (req, res) => {
  const article = newsArticles.find(n => n.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: "Article not found" });
  }
});

// Add comment to article
app.post("/api/news/:id/comments", (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) {
    return res.status(400).json({ error: "Name and text are required" });
  }
  const article = newsArticles.find(n => n.id === req.params.id);
  if (article) {
    if (!article.comments) article.comments = [];
    article.comments.push({
      id: Math.random().toString(36).substring(7),
      name,
      text,
      date: new Date().toISOString()
    });
    saveData();
    res.json({ success: true, comments: article.comments });
  } else {
    res.status(404).json({ error: "Article not found" });
  }
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "liveup18news@gmail.com" && password === "Sh@sahiba9653") {
    res.json({ success: true, token: "admin-auth-token-123" });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

// Admin toggle breaking news
app.post("/api/admin/toggle-breaking", (req, res) => {
  isBreakingNewsEnabled = !isBreakingNewsEnabled;
  res.json({ isBreakingNewsEnabled });
});

// RSS Ingestion & AI Processing Endpoint (Triggered by CRON or Admin)
app.post("/api/admin/ingest-rss", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "RSS URL is required" });
    }
    const result = await processRssFeed(url);
    res.json(result);
  } catch (error: any) {
    console.error("Ingestion Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/sources", (req, res) => {
  res.json({ sources: rssSources });
});

app.post("/api/admin/sources", (req, res) => {
  const { url } = req.body;
  if (url && !rssSources.includes(url)) {
    rssSources.push(url);
    saveData();
  }
  res.json({ sources: rssSources });
});

app.delete("/api/admin/sources", (req, res) => {
  const { url } = req.body;
  rssSources = rssSources.filter(s => s !== url);
  saveData();
  res.json({ sources: rssSources });
});

app.delete("/api/admin/news/:id", (req, res) => {
  newsArticles = newsArticles.filter(n => n.id !== req.params.id);
  saveData();
  res.json({ success: true });
});

// Chatbot API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY missing for chat");
      return res.status(500).json({ error: "Chat service unavailable" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are a helpful assistant for a news portal named "Live Up 18 News". 
    Never mention that you are an AI or an AI assistant. Act as the "Live Up 18 Desk" representative.
    Answer user queries politely. 
    You can answer in Hindi or English depending on the user's language. 
    Keep your answers concise, informative, and professional. 
    If asked about the website, explain that it's a premier source for news in Uttar Pradesh, India, and globally.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nUser Message: " + message }] }
      ],
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
});

async function processRssFeed(url: string) {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  let addedCount = 0;
  
  if (feed.items.length > 0) {
    // Process all items in the feed
    for (const item of feed.items) {
      // Check duplicate by title or link
      if (newsArticles.some(n => n.sourceUrl === item.link || n.headline === item.title)) {
        continue; // skip duplicate
      }
      
      const category = getCategoryFromTitle(item.title || '');
      const imageUrl = extractImageUrl(item.content || item.contentSnippet || '');
      const plainContent = stripHtml(item.content || item.contentSnippet || 'Content not available.');
      
      const newArticle = {
        id: crypto.randomUUID(),
        category: category,
        state: category === 'UTTAR PRADESH' ? 'Uttar Pradesh' : undefined,
        district: undefined,
        headline: item.title || 'Breaking News',
        headlineEn: item.title,
        featuredImage: imageUrl,
        publicationDate: item.isoDate || item.pubDate || new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        author: 'मो० शाहनवाज़',
        shortSummary: plainContent.substring(0, 150) + '...',
        shortSummaryEn: plainContent.substring(0, 150) + '...',
        keyPoints: [],
        keyPointsEn: [],
        content: plainContent,
        contentEn: plainContent,
        sourceAttribution: feed.title || 'News Feed',
        sourceUrl: item.link,
        isBreaking: addedCount < 5, // make the first few breaking
        views: Math.floor(Math.random() * 5000)
      };
      
      newsArticles.unshift(newArticle);
      addedCount++;
    }
    
    if (addedCount > 0) saveData();
    return { success: true, addedCount };
  }
  return { success: false, message: "No items found" };
}

// Autonomous Fetcher - CRON Scheduler (Runs every 1 hour)
cron.schedule("*/30 * * * *", async () => {
  console.log("News Fetcher: Waking up to fetch news...");
  for (const source of rssSources) {
    try {
      console.log("News Fetcher: Fetching", source);
      await processRssFeed(source);
    } catch (err) {
      console.error("News Fetcher Error with source:", source, err);
    }
  }
  console.log("News Fetcher: Completed news fetching cycle.");
});

async function startServer() {
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
    console.log(`Server running on http://localhost:\${PORT}`);
  });
}

startServer();
