const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('og:image')) {
  html = html.replace(
    '</head>',
    `
    <meta name="description" content="उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत। तेज़, विश्वसनीय और निष्पक्ष रिपोर्टिंग।" />
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://liveup18news.com/" />
    <meta property="og:title" content="Live UP 18 News" />
    <meta property="og:description" content="उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत। तेज़, विश्वसनीय और निष्पक्ष रिपोर्टिंग।" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=630&fit=crop&q=80" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://liveup18news.com/" />
    <meta property="twitter:title" content="Live UP 18 News" />
    <meta property="twitter:description" content="उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत। तेज़, विश्वसनीय और निष्पक्ष रिपोर्टिंग।" />
    <meta property="twitter:image" content="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=630&fit=crop&q=80" />
    
    <!-- PWA -->
    <meta name="theme-color" content="#dc2626" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Live UP 18" />
  </head>`
  );
  fs.writeFileSync('index.html', html);
}
