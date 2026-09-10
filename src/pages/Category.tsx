import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDistanceToNow } from "date-fns";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import AdBanner from "../components/AdBanner";
import { collection, query, where, orderBy } from "firebase/firestore";
import { getCachedDocs } from "../lib/cache";
import { db } from "../lib/firebase";

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = id ? id.replace(/-/g, ' ').toUpperCase() : '';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "news"), where("category", "==", categoryName));
        // Note: orderBy("publicationDate", "desc") requires a composite index if where() is used.
        // We'll fetch and sort in client to avoid index requirement for now.
        const snap = await getCachedDocs(q, `category-${id}`);
        const fetchedArticles = (snap || []) as NewsArticle[];
        
        fetchedArticles.sort((a, b) => (new Date(b.publicationDate || 0)).getTime() - (new Date(a.publicationDate || 0)).getTime());
        setArticles(fetchedArticles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [categoryName]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 animate-pulse">{language === 'hi' ? `${categoryName} समाचार लोड हो रहे हैं...` : `Loading ${categoryName} news...`}</div>;
  }

  
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="flex flex-col items-center justify-center border-b-2 border-slate-900 dark:border-white pb-8 mb-12">
        <span className="text-red-700 dark:text-red-500 text-sm font-black uppercase tracking-[0.3em] mb-4">
          Category
        </span>
        <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-wider text-center">
          {category?.replace('-', ' ')}
        </h1>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {news.map((article) => (
            <Link key={article.id} to={`/article/${article.id}`} className="group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-5 bg-slate-100 dark:bg-slate-900">
                <img 
                  src={article.featuredImage || "https://picsum.photos/seed/news/800/600"} 
                  alt={getLocalizedText(article, 'headline', language)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-700 dark:text-red-500 text-[10px] font-black uppercase tracking-widest">
                  {article.category?.replace('-', ' ')}
                </span>
                <span className="text-slate-300 dark:text-slate-700 text-[10px]">•</span>
                <span className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">
                  {formatDistanceToNow(article.publicationDate, { addSuffix: true, locale: language === 'hi' ? hi : undefined })}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-slate-100 leading-snug mb-3 group-hover:text-red-700 dark:group-hover:text-red-500 transition-colors line-clamp-3">
                {getLocalizedText(article, 'headline', language)}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                {getLocalizedText(article, 'shortSummary', language)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

}
