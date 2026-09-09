const fs = require('fs');

// 2. Update Admin.tsx to include isBreaking checkbox
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
if (!admin.includes('name="isBreaking"')) {
  admin = admin.replace(
    '<select name="category"',
    '<label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="isBreaking" className="w-4 h-4 accent-red-600" /> Mark as Breaking News (Ticker)</label>\n                <select name="category"'
  );
  admin = admin.replace(
    'videoUrl: finalVideoUrl ? getEmbedUrl(finalVideoUrl) : null,',
    'videoUrl: finalVideoUrl ? getEmbedUrl(finalVideoUrl) : null,\n                    isBreaking: (form.isBreaking as HTMLInputElement).checked,'
  );
  fs.writeFileSync('src/pages/Admin.tsx', admin);
}

// 3. Update Article.tsx (Reporter Info & Related News)
let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');

// Imports
if (!article.includes('TeamMember')) {
  article = article.replace(
    'import { NewsArticle } from "../types";',
    'import { NewsArticle, TeamMember } from "../types";'
  );
  article = article.replace(
    'const [article, setArticle] = useState<NewsArticle | null>(null);',
    'const [article, setArticle] = useState<NewsArticle | null>(null);\n  const [reporter, setReporter] = useState<TeamMember | null>(null);\n  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);'
  );

  // Fetch logic
  const fetchLogic = `
        // Fetch Reporter Info
        if (fetchedArticle.author) {
          const rq = query(collection(db, "team"), where("name", "==", fetchedArticle.author), limit(1));
          const rSnap = await getDocs(rq);
          if (!rSnap.empty) {
            setReporter({ id: rSnap.docs[0].id, ...rSnap.docs[0].data() } as TeamMember);
          }
        }

        // Fetch Related News
        const relatedQ = query(collection(db, "news"), where("category", "==", fetchedArticle.category), orderBy("publicationDate", "desc"), limit(4));
        const relatedSnap = await getDocs(relatedQ);
        const rel = [];
        relatedSnap.forEach(d => {
          if (d.id !== fetchedArticle.id) {
            rel.push({ id: d.id, ...d.data() });
          }
        });
        setRelatedNews(rel.slice(0, 3));
  `;
  
  article = article.replace(
    'setArticle(fetchedArticle);',
    'setArticle(fetchedArticle);\n' + fetchLogic
  );

  // Render logic at bottom of article
  const renderLogic = `
          {/* Reporter Info Card */}
          {reporter && (
            <div className="my-8 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-sm">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 border-4 border-white dark:border-slate-700 shadow-md">
                {reporter.photoUrl ? (
                  <img src={reporter.photoUrl} alt={reporter.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-700 font-bold text-2xl">{reporter.name.charAt(0)}</div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase mb-2 inline-block dark:bg-red-900/30 dark:text-red-400">{reporter.role}</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{reporter.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{reporter.details}</p>
                <a href={"tel:+91" + reporter.mobile.replace(/\\D/g,'')} className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                  📞 {reporter.mobile}
                </a>
              </div>
            </div>
          )}
          
          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-12 mb-8">
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {language === 'hi' ? 'मिलती-जुलती खबरें' : 'Related News'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedNews.map(news => (
                  <Link key={news.id} to={\`/article/\${news.id}\`} className="group flex flex-col gap-3">
                    <div className="aspect-video w-full overflow-hidden rounded-lg relative">
                      <img src={news.featuredImage} alt={getLocalizedText(news, 'headline', language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-md">
                        {news.category}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {getLocalizedText(news, 'headline', language)}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
`;
  
  article = article.replace(
    '</article>\n          <Comments articleId={article.id} />',
    '</article>\n' + renderLogic + '\n          <Comments articleId={article.id} />'
  );

  fs.writeFileSync('src/pages/Article.tsx', article);
}
