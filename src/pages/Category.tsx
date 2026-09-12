import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import AdBanner from "../components/AdBanner";
import { collection, query, limit } from "firebase/firestore";
import { getCachedDocs } from "../lib/cache";
import { db } from "../lib/firebase";
import { ArrowLeft } from "lucide-react";

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const categorySlug = (id || '').toLowerCase().replace(/[-_]/g, ' ').trim();
  const displayTitle = (id || '').replace(/[-_]/g, ' ').toUpperCase();

  const formatDate = (dateInput: any) => {
    try {
      if (!dateInput) return '';
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return '';
      return formatDistanceToNow(d, {
        addSuffix: true,
        locale: language === 'hi' ? hi : undefined
      });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "news"), limit(200));
        const snap = await getCachedDocs(q, 'all-news-for-category');
        const fetchedArticles = (Array.isArray(snap) ? snap : []) as NewsArticle[];
        
        // Filter by category slug safely
        const filtered = fetchedArticles.filter((article) => {
          if (!article || article.status === 'draft') return false;
          const artCat = (article.category || '').toLowerCase().replace(/[-_]/g, ' ').trim();
          const artDist = (article.district || '').toLowerCase().replace(/[-_]/g, ' ').trim();

          if (categorySlug === 'video news') {
            return Boolean(article.videoUrl) || artCat === 'video news';
          }
          if (categorySlug === 'photo gallery') {
            return Boolean(article.featuredImage) || artCat === 'photo gallery';
          }

          return artCat === categorySlug || (artDist && artDist === categorySlug);
        });

        filtered.sort((a, b) => (new Date(b.publicationDate || 0)).getTime() - (new Date(a.publicationDate || 0)).getTime());
        if (isMounted) {
          setArticles(filtered);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchNews();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-slate-500 animate-pulse">
        {language === 'hi' ? `${displayTitle} समाचार लोड हो रहे हैं...` : `Loading ${displayTitle} news...`}
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 rounded-full font-bold text-sm transition-all shadow-sm cursor-pointer group active:scale-95"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'hi' ? '← मुख्य पृष्ठ / वापस जाएं' : '← Back to Home'}</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center border-b-2 border-slate-900 dark:border-white pb-8 mb-12">
        <span className="text-red-700 dark:text-red-500 text-sm font-black uppercase tracking-[0.3em] mb-4">
          Category
        </span>
        <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-wider text-center">
          {displayTitle}
        </h1>
      </div>

      {!Array.isArray(articles) || articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            {language === 'hi' ? 'इस श्रेणी में कोई समाचार नहीं मिला।' : 'No articles found in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(articles || []).filter(Boolean).map((article) => (
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
                  {formatDate(article.publicationDate)}
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
