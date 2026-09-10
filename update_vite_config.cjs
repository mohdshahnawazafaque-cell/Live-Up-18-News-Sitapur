const fs = require('fs');
let config = fs.readFileSync('vite.config.ts', 'utf8');

if (!config.includes('VitePWA')) {
  config = config.replace(
    "import {defineConfig} from 'vite';",
    "import {defineConfig} from 'vite';\nimport { VitePWA } from 'vite-plugin-pwa';"
  );
  
  const pluginsMatch = "plugins: [react(), tailwindcss()],";
  const pwaConfig = `VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        id: '/',
        name: 'Live UP 18 News',
        short_name: 'Live UP 18',
        description: 'उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत।',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=192&h=192&fit=crop&q=80',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=512&h=512&fit=crop&q=80',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    })`;
  
  config = config.replace(pluginsMatch, `plugins: [react(), tailwindcss(), ${pwaConfig}],`);
  fs.writeFileSync('vite.config.ts', config);
}
