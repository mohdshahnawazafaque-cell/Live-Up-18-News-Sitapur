import YouTubeGallery from "../components/YouTubeGallery";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDistanceToNow } from "date-fns";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import AdBanner from "../components/AdBanner";
import PollWidget from "../components/PollWidget";
import TrendingWidget from "../components/TrendingWidget";
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

  useEffect(() => {
    // Videos will be extracted from news articles with videoUrl

    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(100));
        const articles = await getCachedDocs(q, 'home-news');

        
        const videoArticles = articles.filter(a => a.videoUrl);
        setVideos(videoArticles.map(a => ({
          id: a.id,
          title: a.headline,
          titleEn: a.headlineEn || a.headline,
          url: a.videoUrl,
          date: a.publicationDate
        })));

        if (articles.length > 0) {
          setFeaturedNews(articles[0]);
          setTopHeadlines(articles.slice(1, 5));
          setLatestNews(articles.slice(5, 15));
          
          const cats: { [key: string]: NewsArticle[] } = {};
          articles.forEach(article => {
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
    <div className="space-y-12">
      
      {/* Top Ad/Banner Section */}
      <section className="w-full">
        <a href="#" className="block w-full overflow-hidden rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <img loading="lazy" src="/banner1.png" alt="Live Up 18 News Promo" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </a>
      </section>

      
      {/* Live TV Section (Placeholder / Configurable) */}
      <section className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <div className="bg-red-600 text-white p-3 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase flex items-center gap-2">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            LIVE TV
          </h2>
        </div>
        <div className="w-full bg-black flex items-center justify-center relative">
          <div className="w-full max-w-4xl mx-auto aspect-video">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/lHRd4ug_Yq8"
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
          </div>
        </div>
      </section>

      {error && <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-8" role="alert"><p className="font-bold">Error loading news</p><p>{error}</p></div>}
      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured */}
        <div className="lg:col-span-8">
          {featuredNews && (
            <Link to={`/article/${featuredNews.id}`} className="group block relative overflow-hidden rounded-xl shadow-lg">
              <img loading="lazy" 
                src={featuredNews.featuredImage} 
                alt={getLocalizedText(featuredNews, 'headline', language)}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6 md:p-10">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm w-max mb-4 uppercase">
                  {featuredNews.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-red-400 transition-colors">
                  {getLocalizedText(featuredNews, 'headline', language)}
                </h2>
                <p className="text-slate-200 text-lg line-clamp-2 md:line-clamp-3 max-w-3xl">
                  {getLocalizedText(featuredNews, 'shortSummary', language)}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Top Headlines Sidebar */}
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
                <Link key={news.id} to={`/article/${news.id}`} className="p-4 group hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-1 flex flex-col justify-center">
                  <span className="text-red-600 text-xs font-bold uppercase mb-1 block">
                    {news.category}
                  </span>
                  <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-snug group-hover:text-red-700 transition-colors line-clamp-3">
                    {getLocalizedText(news, 'headline', language)}
                  </h4>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                    {(() => { try { return news.publicationDate ? formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true }) : "" } catch(e) { return "" } })()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Horizontal Strip */}
      <section>
        <div className="flex items-center justify-between border-b-2 border-slate-900 mb-6 pb-2">
          <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">{language === 'hi' ? 'ताज़ा खबरें' : 'Latest News'}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.slice(0, 4).map(news => (
            <Link key={news.id} to={`/article/${news.id}`} className="group flex flex-col gap-3">
              <div className="overflow-hidden rounded-lg aspect-video relative">
                <img loading="lazy" 
                  src={news.featuredImage} 
                  alt={getLocalizedText(news, 'headline', language)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                  {getLocalizedText(news, 'headline', language)}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

            <YouTubeGallery />

      {/* Middle Ad/Banner Section */}
      <section className="w-full my-8">
        <a href="#" className="block w-full overflow-hidden rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <img loading="lazy" src="/banner2.png" alt="Live Up 18 News Promo" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </a>
      </section>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([catName, articles]: [string, any]) => (
          <section key={catName} className="flex flex-col">
            <div className="flex items-center justify-between border-b-2 border-red-600 mb-4 pb-2">
              <h3 className="text-xl font-black uppercase text-slate-900 dark:text-white">
                {language === 'hi' ? 
                  (catName === 'INDIA' ? 'भारत' : 
                   catName === 'UTTAR PRADESH' ? 'उत्तर प्रदेश' : 
                   catName === 'POLITICS' ? 'राजनीति' : 
                   catName === 'CRIME' ? 'क्राइम' :
                   catName === 'WEATHER' ? 'मौसम' : 
                   catName === 'SPORTS' ? 'खेल' : 
                   catName === 'ENTERTAINMENT' ? 'मनोरंजन' : catName) 
                  : catName}
              </h3>
              <Link to={`/category/${catName.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-red-600 hover:text-slate-900 dark:text-white uppercase">
                {language === 'hi' ? 'सभी देखें' : 'See All'}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {articles.map((news, idx) => (
                <Link key={news.id} to={`/article/${news.id}`} className={`group flex gap-4 ${idx !== 0 ? 'items-center' : 'flex-col'}`}>
                  <div className={`overflow-hidden rounded-lg relative flex-shrink-0 ${idx === 0 ? 'w-full aspect-video' : 'w-24 h-24'}`}>
                    {news.featuredImage ? (
                      <img loading="lazy" 
                        src={news.featuredImage} 
                        alt={getLocalizedText(news, 'headline', language)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-transform duration-500 group-hover:scale-110">
                        <span className="text-slate-300 font-bold text-sm">LIVE UP 18</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold text-slate-900 dark:text-white leading-snug group-hover:text-red-700 transition-colors ${idx === 0 ? 'text-lg mt-2 line-clamp-2' : 'text-sm line-clamp-3'}`}>
                      {getLocalizedText(news, 'headline', language)}
                    </h4>
                  </div>
                </Link>
              ))}
              {articles.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-sm">{language === 'hi' ? 'इस श्रेणी में अभी तक कोई समाचार उपलब्ध नहीं है।' : 'No news available in this category yet.'}</p>}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}
