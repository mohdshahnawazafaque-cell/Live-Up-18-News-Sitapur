import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { getCachedDocs } from '../lib/cache';
import { db } from '../lib/firebase';
import { NewsArticle } from '../types';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrendingWidget() {
  const { language } = useLanguage();
  const [trending, setTrending] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Just pulling recent news and shuffling to simulate 'trending' if view count isn't robustly tracked due to quota.
        // Ideally: orderBy("views", "desc")
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(20));
        const articles = await getCachedDocs(q, 'trending-news');
        
        if (Array.isArray(articles)) {
          // Sort locally by views (descending)
          const sorted = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));
          setTrending(sorted.slice(0, 5));
        } else {
          setTrending([]);
        }
      } catch (err) {
        console.error(err);
        setTrending([]);
      }
    };
    fetchTrending();
  }, []);

  if (!Array.isArray(trending) || trending.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-4">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <TrendingUp className="text-red-600" />
          {language === 'hi' ? 'ट्रेंडिंग न्यूज़' : 'Trending News'}
        </h3>
      </div>
      <div className="divide-y divide-slate-100 flex-1 flex flex-col p-4">
        {(Array.isArray(trending) ? trending : []).map((news, idx) => (
          <Link key={news.id} to={`/article/${news.id}`} className="py-3 group flex items-start gap-4">
            <span className="text-4xl font-black text-slate-200 group-hover:text-red-200 transition-colors">
              {idx + 1}
            </span>
            <div>
              <span className="text-red-600 text-[10px] font-bold uppercase mb-1 block">
                {news.category}
              </span>
              <h4 className="text-slate-800 font-bold text-sm leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                {getLocalizedText(news, 'headline', language)}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
