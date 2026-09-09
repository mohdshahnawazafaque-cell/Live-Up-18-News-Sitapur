const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// I will just replace the problematic sections entirely

const oldStr = `        {/* Top Headlines Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PollWidget />

          <div className="bg-slate-900 text-white p-4">
            <h3 className="text-xl font-black uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              {language === 'hi' ? 'प्रमुख खबरें' : 'Top Headlines'}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700 flex-1 flex flex-col">
            {topHeadlines.map(news => (
              <Link key={news.id} to={\`/article/\${news.id}\`} className="p-4 group hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-1 flex flex-col justify-center">
                <span className="text-red-600 text-xs font-bold uppercase mb-1 block">
                  {news.category}
                </span>
                <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-snug group-hover:text-red-700 transition-colors line-clamp-3">
                  {getLocalizedText(news, 'headline', language)}
                </h4>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                  {formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Horizontal Strip */}`;

// Actually let's just use regex to replace everything from "Top Headlines Sidebar" to "Latest News Horizontal Strip"
const regex = /\{\/\* Top Headlines Sidebar \*\/\}[\s\S]*?\{\/\* Latest News Horizontal Strip \*\/\}/;

const fixedStr = `{/* Top Headlines Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PollWidget />
          <TrendingWidget />
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {language === 'hi' ? 'प्रमुख खबरें' : 'Top Headlines'}
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 flex-1 flex flex-col">
              {topHeadlines.map(news => (
                <Link key={news.id} to={\`/article/\${news.id}\`} className="p-4 group hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-1 flex flex-col justify-center">
                  <span className="text-red-600 text-xs font-bold uppercase mb-1 block">
                    {news.category}
                  </span>
                  <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-snug group-hover:text-red-700 transition-colors line-clamp-3">
                    {getLocalizedText(news, 'headline', language)}
                  </h4>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                    {formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Horizontal Strip */}`;

home = home.replace(regex, fixedStr);

// Also remove extra closing tag if it exists at the bottom
home = home.replace(/<\/div>\s*<\/div>\s*<\/section>\s*\{\/\* Videos Section \*\/\}/g, '</div>\n      </section>\n\n      {/* Videos Section */}');

fs.writeFileSync('src/pages/Home.tsx', home);
