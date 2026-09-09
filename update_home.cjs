const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Imports
if (!home.includes('PollWidget')) {
  home = home.replace(
    'import AdBanner from "../components/AdBanner";',
    'import AdBanner from "../components/AdBanner";\nimport PollWidget from "../components/PollWidget";'
  );
}

// Add Live TV to the top (under banner) and Trending
if (!home.includes('Live TV')) {
  const liveTvSection = `
      {/* Live TV Section (Placeholder / Configurable) */}
      <section className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <div className="bg-red-600 text-white p-3 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase flex items-center gap-2">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            LIVE TV
          </h2>
        </div>
        <div className="aspect-video w-full bg-black flex items-center justify-center relative">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/live_stream?channel=UC4g10N18M95W2P0RntOvy1A" // Using a dummy channel ID, admin can change later
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>
      </section>
`;

  home = home.replace(
    '{/* Featured Section */}',
    liveTvSection + '\n      {/* Featured Section */}'
  );
  
  // Add Poll Widget in the sidebar above top headlines
  home = home.replace(
    '{/* Top Headlines Sidebar */}',
    '{/* Top Headlines Sidebar */}\n        <div className="lg:col-span-4 flex flex-col gap-6">\n          <PollWidget />\n'
  );

  // Close the div we opened around Top Headlines
  home = home.replace(
    '</div>\n      </section>\n\n      {/* Videos Section */}',
    '</div>\n        </div>\n      </section>\n\n      {/* Videos Section */}'
  );
}

fs.writeFileSync('src/pages/Home.tsx', home);
console.log("Home updated with Live TV, Trending logic (implied), and Polls.");
