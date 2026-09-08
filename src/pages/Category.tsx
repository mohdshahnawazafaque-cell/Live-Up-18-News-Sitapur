import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDistanceToNow } from "date-fns";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = id ? id.replace(/-/g, ' ').toUpperCase() : '';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news?category=${categoryName}`)
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 animate-pulse">{language === 'hi' ? `${categoryName} समाचार लोड हो रहे हैं...` : `Loading ${categoryName} news...`}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8 border-b-4 border-red-600 pb-4">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{categoryName}</h1>
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {language === 'hi' ? 'इस श्रेणी में कोई समाचार उपलब्ध नहीं है।' : 'No news available in this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-8 flex flex-col gap-8">
            {articles.map((news, idx) => (
              <Link key={news.id} to={`/article/${news.id}`} className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-slate-200 last:border-0">
                <div className="sm:w-2/5 flex-shrink-0 overflow-hidden rounded-xl aspect-[4/3]">
                  {news.featuredImage ? (
                    <img 
                      src={news.featuredImage} 
                      alt={getLocalizedText(news, 'headline', language)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center border border-slate-200 transition-transform duration-500 group-hover:scale-105">
                      <span className="text-slate-300 font-bold text-lg">LIVE UP 18</span>
                    </div>
                  )}
                </div>
                <div className="sm:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    {news.state && (
                      <span className="text-xs font-bold text-slate-500 uppercase">{news.state}</span>
                    )}
                    {news.state && news.district && <span className="text-slate-300">•</span>}
                    {news.district && (
                      <span className="text-xs font-bold text-slate-500 uppercase">{news.district}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-red-700 transition-colors">
                    {getLocalizedText(news, 'headline', language)}
                  </h2>
                  <p className="text-slate-600 line-clamp-2 mb-4">
                    {getLocalizedText(news, 'shortSummary', language)}
                  </p>
                  <div className="text-xs text-slate-400 mt-auto">
                    {formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true })}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="md:col-span-4">
             <div className="sticky top-24 bg-slate-100 rounded-xl p-6 h-[400px] flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-300">
                {language === 'hi' ? 'विज्ञापन स्थान' : 'Advertisement Space'}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
