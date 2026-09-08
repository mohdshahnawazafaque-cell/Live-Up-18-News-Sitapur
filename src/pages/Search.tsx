import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { language } = useLanguage();
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Let's just fetch all and filter client side for simplicity, or we can use an endpoint if one exists
    fetch("/api/news?limit=100")
      .then(res => res.json())
      .then(data => {
        const articles = data.articles || [];
        if (query) {
          const lowerQuery = query.toLowerCase();
          const filtered = articles.filter((a: NewsArticle) => {
             const titleMatch = (a.headline || "").toLowerCase().includes(lowerQuery) || (a.headlineEn || "").toLowerCase().includes(lowerQuery);
             const contentMatch = (a.shortSummary || "").toLowerCase().includes(lowerQuery) || (a.shortSummaryEn || "").toLowerCase().includes(lowerQuery);
             return titleMatch || contentMatch;
          });
          setResults(filtered);
        } else {
          setResults([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
        {language === 'hi' ? `"${query}" के लिए खोज परिणाम` : `Search Results for "${query}"`}
      </h1>
      
      {loading ? (
        <div className="text-center py-20 animate-pulse text-slate-500">Loading...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((news) => (
            <Link key={news.id} to={`/article/${news.id}`} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 flex flex-col h-full">
              <div className="aspect-video overflow-hidden relative bg-slate-100 dark:bg-slate-700">
                {news.featuredImage && (
                  <img 
                    src={news.featuredImage} 
                    alt={getLocalizedText(news, 'headline', language)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {news.isBreaking && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
                    {language === 'hi' ? 'ब्रेकिंग' : 'Breaking'}
                  </span>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <span className="text-red-600 font-bold text-xs mb-2 uppercase">{news.category}</span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3 mb-2">
                  {getLocalizedText(news, 'headline', language)}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-auto">
                  {getLocalizedText(news, 'shortSummary', language)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          {language === 'hi' ? 'कोई परिणाम नहीं मिला।' : 'No results found.'}
        </div>
      )}
    </div>
  );
}
