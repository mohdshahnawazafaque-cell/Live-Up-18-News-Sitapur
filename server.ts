import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Razorpay Order Creation Route
  app.post("/api/create-razorpay-order", async (req, res) => {
    try {
      const { amount, receipt } = req.body;
      
      const key_id = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!key_id || !key_secret) {
        return res.status(500).json({ error: "Razorpay API keys are missing in backend." });
      }

      const Razorpay = require('razorpay');
      
      const instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
      });

      const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: receipt,
      };

      const order = await instance.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Razorpay Order API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
