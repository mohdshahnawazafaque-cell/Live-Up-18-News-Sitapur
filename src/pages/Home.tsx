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
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<{ [key: string]: NewsArticle[] }>({});
  const [visibleNewsCount, setVisibleNewsCount] = useState(12);

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
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(100));
        const articles = await getCachedDocs(q, 'home-news');

        if (!isMounted) return;

        // Filter out drafts for public view
        const publishedArticles = (articles || []).filter((a: any) => a.status !== 'draft');
        const videoArticles = publishedArticles.filter((a: any) => a.videoUrl);
        setVideos(videoArticles.map((a: any) => ({
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
          publishedArticles.forEach((article: any) => {
            if (article.category) {
              if (!cats[article.category]) cats[article.category] = [];
              if (cats[article.category].length < 4) {
                cats[article.category].push(article);
              }
            }
          });
          setCategories(cats);
        }
      } catch (err: any) {
        console.error("Error fetching news:", err);
        if (isMounted) {
          setError(err?.message || "Failed to load news.");
        }
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
  }, []);

  return (
    <div className="space-y-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Top Ad/Banner Section */}
      <AdBanner position="home_top" />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-700 text-red-900 p-4 mb-8">
          <p className="font-bold">Error loading news</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded-lg w-full"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-6"></div>
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex gap-4 pb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                </div>
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Premium Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-slate-200 dark:border-slate-800 pb-16">
            {/* Main Featured (Left) */}
            <div className="lg:col-span-8">
              {featuredNews ? (
                <Link to={`/article/${featuredNews.id}`} className="group flex flex-col gap-6">
                  <div className="relative overflow-hidden rounded-lg aspect-video shadow-sm">
                    <img loading="lazy" 
                      src={featuredNews.featuredImage || "https://picsum.photos/seed/news/800/600"} 
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
                        {formatDate(featuredNews.publicationDate)}
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
              ) : (
                <div className="p-8 text-center text-slate-500">
                  {language === 'hi' ? 'कोई खबर उपलब्ध नहीं है' : 'No news articles available'}
                </div>
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
                {(topHeadlines.length > 0 ? topHeadlines : latestNews.slice(0, 4)).map((article, index) => (
                  <div key={article.id} className={`group flex flex-col gap-3 ${index !== 3 ? 'border-b border-slate-200 dark:border-slate-800 pb-6' : ''}`}>
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

          {/* Structured Category / Latest News Rows with Sidebar */}
          {latestNews.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              {/* Main Content Area (Left 8 cols) */}
              <div className="lg:col-span-8 space-y-12">
                <div>
                  <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-8">
                    <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {language === 'hi' ? 'विशेष कवरेज' : 'Special Coverage'}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {latestNews.slice(0, visibleNewsCount).map((article) => (
                      <Link key={article.id} to={`/article/${article.id}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img 
                            src={article.featuredImage || "https://picsum.photos/seed/news/800/600"} 
                            alt={getLocalizedText(article, 'headline', language)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-red-700 dark:text-red-400 text-[11px] font-black uppercase tracking-widest mb-1.5 block">
                              {article.category?.replace('-', ' ')}
                            </span>
                            <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                              {getLocalizedText(article, 'headline', language)}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                              {getLocalizedText(article, 'shortSummary', language)}
                            </p>
                          </div>
                          <span className="text-slate-400 text-xs">
                            {formatDate(article.publicationDate)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {latestNews.length > visibleNewsCount && (
                    <div className="text-center mt-8">
                      <button 
                        onClick={() => setVisibleNewsCount(prev => prev + 12)}
                        className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'और ख़बरें देखें' : 'Load More News'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Category Highlights */}
                {Object.keys(categories).length > 0 && (
                  <div className="space-y-10 pt-4">
                    {Object.entries(categories).slice(0, 3).map(([catName, catArticles]) => (
                      <div key={catName} className="space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-red-700 pb-2">
                          <h4 className="text-xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-wider">
                            {catName.replace('-', ' ')}
                          </h4>
                          <Link 
                            to={`/category/${catName.toLowerCase().replace(/\s+/g, '-')}`} 
                            className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline uppercase"
                          >
                            {language === 'hi' ? 'सभी देखें →' : 'View All →'}
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {catArticles.map((art) => (
                            <Link key={art.id} to={`/article/${art.id}`} className="group flex gap-3 items-center bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                              <img 
                                src={art.featuredImage || "https://picsum.photos/seed/news/800/600"} 
                                alt={getLocalizedText(art, 'headline', language)}
                                className="w-20 h-20 object-cover rounded flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                                  {getLocalizedText(art, 'headline', language)}
                                </h5>
                                <span className="text-[11px] text-slate-400 block mt-1">
                                  {formatDate(art.publicationDate)}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar (Right 4 cols) */}
              <div className="lg:col-span-4 space-y-8">
                <LiveTVWidget />
                <TrendingWidget />
                <PollWidget />
                <AdBanner position="home_sidebar" />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
