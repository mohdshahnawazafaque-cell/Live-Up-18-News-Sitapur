import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import AdBanner from "../components/AdBanner";
import PollWidget from "../components/PollWidget";
import TrendingWidget from "../components/TrendingWidget";
import LiveTVWidget from "../components/LiveTVWidget";
import DonationBanner from "../components/DonationBanner";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { getCachedDocs } from "../lib/cache";
import { db } from "../lib/firebase";

export default function Home() {
  const { language } = useLanguage();
  const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null);
  const [topHeadlines, setTopHeadlines] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ [key: string]: NewsArticle[] }>({});
  const [visibleNewsCount, setVisibleNewsCount] = useState(8);

  useEffect(() => {
    // Videos will be extracted from news articles with videoUrl

    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(100));
        const articles = await getCachedDocs(q, 'home-news');

        
        // Filter out drafts for public view
        const publishedArticles = articles.filter(a => a.status !== 'draft');
        const videoArticles = publishedArticles.filter(a => a.videoUrl);
        setVideos(videoArticles.map(a => ({
          id: a.id,
          title: a.headline,
          titleEn: a.headlineEn || a.headline,
          url: a.videoUrl,
          date: a.publicationDate
        })));

        if (publishedArticles.length > 0) {
          setFeaturedNews(publishedArticles[0]);
          setTopHeadlines(publishedArticles.slice(1, 5));
          setLatestNews(publishedArticles.slice(5));
          
          const cats: { [key: string]: NewsArticle[] } = {};
          publishedArticles.forEach(article => {
            if (!cats[article.category]) cats[article.category] = [];
            if (cats[article.category].length < 4) {
              cats[article.category].push(article);
            }
          });
          setCategories(cats);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message || "Failed to load news.");
      }
    };

    fetchNews();
  }, []);

  
  return (
    <div className="space-y-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Top Ad/Banner Section */}
      <AdBanner position="home_top" />
      
      {error && <div className="bg-red-50 border-l-4 border-red-700 text-red-900 p-4 mb-8"><p className="font-bold">Error loading news</p><p>{error}</p></div>}
      
      {/* Premium Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-slate-200 dark:border-slate-800 pb-16">
        {/* Main Featured (Left) */}
        <div className="lg:col-span-8">
          {featuredNews && (
            <Link to={`/article/${featuredNews.id}`} className="group flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-lg aspect-video shadow-sm">
                <img loading="lazy" 
                  src={featuredNews.featuredImage} 
                  alt={getLocalizedText(featuredNews, 'headline', language)}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-red-700 dark:text-red-500 text-xs font-black uppercase tracking-[0.15em]">
                    {featuredNews.category?.replace('-', ' ')}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">•</span>
                  <span className="text-slate-500 text-xs font-medium">
                    {formatDistanceToNow(featuredNews.publicationDate, { 
                      addSuffix: true,
                      locale: language === 'hi' ? hi : undefined
                    })}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-slate-50 leading-[1.1] mb-4 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                  {getLocalizedText(featuredNews, 'headline', language)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl line-clamp-3 leading-relaxed max-w-4xl font-medium">
                  {getLocalizedText(featuredNews, 'shortSummary', language)}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Top Stories (Right) */}
        <div className="lg:col-span-4 flex flex-col border-l border-slate-200 dark:border-slate-800 lg:pl-8">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-6">
            <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'hi' ? 'ताज़ा ख़बरें' : 'Top Stories'}
            </h3>
          </div>
          
          <div className="flex flex-col gap-6">
            {latestNews.slice(0, 5).map((article, index) => (
              <div key={article.id} className={`group flex flex-col gap-3 ${index !== 4 ? 'border-b border-slate-200 dark:border-slate-800 pb-6' : ''}`}>
                <Link to={`/article/${article.id}`} className="flex gap-4">
                  <div className="flex-1 flex flex-col">
                    <span className="text-red-700 dark:text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">
                      {article.category?.replace('-', ' ')}
                    </span>
                    <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                      {getLocalizedText(article, 'headline', language)}
                    </h4>
                  </div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded">
                    <img 
                      src={article.featuredImage || "https://picsum.photos/seed/news/800/600"} 
                      alt={getLocalizedText(article, 'headline', language)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Banner */}
      <section className="py-4">
        <DonationBanner />
      </section>

      {/* Structured Category Rows */}
      <section>
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-8">
          <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'hi' ? 'विशेष कवरेज' : 'Special Coverage'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.slice(5).map((article) => (
            <Link key={article.id} to={`/article/${article.id}`} className="group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img 
                  src={article.featuredImage || "https://picsum.photos/seed/news/800/600"} 
                  alt={getLocalizedText(article, 'headline', language)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-red-700 dark:text-red-500 text-[11px] font-black uppercase tracking-widest mb-2">
                {article.category?.replace('-', ' ')}
              </span>
              <h4 className="font-heading font-bold text-xl text-slate-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-red-700 transition-colors line-clamp-3">
                {getLocalizedText(article, 'headline', language)}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                {getLocalizedText(article, 'shortSummary', language)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );

}
