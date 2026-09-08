const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add videos state
content = content.replace(
  'const [categories, setCategories] = useState<Record<string, NewsArticle[]>>({});',
  `const [categories, setCategories] = useState<Record<string, NewsArticle[]>>({});
  const [videos, setVideos] = useState<any[]>([]);`
);

// 2. Fetch videos in useEffect
content = content.replace(
  'fetch("/api/news?limit=50")',
  `fetch("/api/videos").then(res => res.json()).then(data => setVideos(data.videos || [])).catch(console.error);
    fetch("/api/news?limit=50")`
);

// 3. Add Video Section HTML before "Middle Ad/Banner Section"
const videoSection = `      {/* AI Video News Section */}
      <section className="bg-slate-900 dark:bg-black rounded-xl p-6 text-white my-8 border border-slate-800">
        <div className="flex items-center justify-between border-b-2 border-red-600 mb-6 pb-2">
          <h3 className="text-2xl font-black uppercase flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
            {language === 'hi' ? 'AI वीडियो न्यूज़ गैलरी' : 'AI Video News Gallery'}
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {videos.length > 0 ? (
            <>
              {/* Main Video */}
              <div className="lg:col-span-2">
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={videos[0].url} 
                    title={language === 'hi' ? videos[0].title : videos[0].titleEn} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <h4 className="font-bold text-xl mt-4 line-clamp-2">
                  {language === 'hi' ? videos[0].title : videos[0].titleEn}
                </h4>
              </div>
              {/* Sidebar Videos */}
              <div className="flex flex-col gap-4">
                {videos.slice(1).map((vid, idx) => (
                  <div key={idx} className="flex gap-4 group cursor-pointer">
                    <div className="w-32 aspect-video bg-slate-800 rounded-md overflow-hidden flex-shrink-0 relative">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={vid.url} 
                        title={language === 'hi' ? vid.title : vid.titleEn} 
                        frameBorder="0"
                        className="pointer-events-none"
                      ></iframe>
                      <div className="absolute inset-0 bg-transparent"></div> {/* Overlay to prevent clicking iframe */}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm group-hover:text-red-400 transition-colors line-clamp-3">
                        {language === 'hi' ? vid.title : vid.titleEn}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <div className="col-span-full py-12 text-center text-slate-400">
               {language === 'hi' ? 'AI द्वारा जनरेट किए गए ताज़ा वीडियो लोड हो रहे हैं...' : 'Loading latest AI generated videos...'}
             </div>
          )}
        </div>
      </section>

      {/* Middle Ad/Banner Section */}`;

content = content.replace('{/* Middle Ad/Banner Section */}', videoSection);

// Update dark mode classes
content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
content = content.replace(/bg-white/g, 'bg-white dark:bg-slate-800');
content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
content = content.replace(/divide-slate-100/g, 'divide-slate-100 dark:divide-slate-700');
content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
content = content.replace(/hover:bg-slate-50/g, 'hover:bg-slate-50 dark:hover:bg-slate-700');

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx");
