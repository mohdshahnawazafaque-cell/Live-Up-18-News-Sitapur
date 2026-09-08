import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";

export default function BreakingNews() {
  const { language } = useLanguage();
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/news?isBreaking=true&limit=5")
      .then(res => res.json())
      .then(data => {
        setBreakingNews(data.articles || []);
        setEnabled(data.breakingNewsEnabled ?? true);
      })
      .catch(console.error);
  }, []);

  if (!enabled || breakingNews.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 mr-4 animate-pulse whitespace-nowrap flex-shrink-0 relative overflow-hidden">
          {language === 'hi' ? 'ब्रेकिंग न्यूज़' : 'BREAKING NEWS'}
          <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 relative flex items-center">
          <div className="animate-[marquee_20s_linear_infinite] hover:pause inline-block">
            {breakingNews.map((news, idx) => (
              <span key={news.id} className="mx-8">
                <Link to={`/article/${news.id}`} className="text-slate-800 font-semibold hover:text-red-600 transition-colors">
                  {getLocalizedText(news, 'headline', language)}
                </Link>
                {idx < breakingNews.length - 1 && <span className="text-slate-300 ml-8">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
