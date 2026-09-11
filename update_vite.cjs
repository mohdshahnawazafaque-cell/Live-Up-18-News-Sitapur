const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

const iconsRegex = /icons:\s*\[[\s\S]*?\]/;
const newIcons = `icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=192&h=192&fit=crop&q=80',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=512&h=512&fit=crop&q=80',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          }
        ]`;

code = code.replace(iconsRegex, newIcons);
fs.writeFileSync('vite.config.ts', code);
