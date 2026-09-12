import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { getCachedDocs } from '../lib/cache';
import { db } from '../lib/firebase';
import { NewsArticle } from '../types';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Shorts() {
  const [shorts, setShorts] = useState<NewsArticle[]>([]);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(20));
        const articles = await getCachedDocs(q, 'shorts-news');
        const filtered = (articles || []).filter((a: any) => a.status !== 'draft' && a.featuredImage);
        setShorts(filtered as NewsArticle[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  const handleShare = async (id: string) => {
    const url = `${window.location.origin}/article/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Live UP 18 News', url });
      } catch (e: any) {
        // Ignored or user dismissed share dialog
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white animate-pulse">Loading Shorts...</div>;

  return (
    <div className="h-screen bg-black overflow-y-scroll snap-y snap-mandatory relative hide-scrollbar">
      <Link to="/" className="fixed top-4 left-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur border border-white/20">
        <ArrowLeft size={24} />
      </Link>
      
      {shorts.map((article, index) => (
        <div key={article.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
          <img 
            src={article.featuredImage || "https://picsum.photos/seed/news/800/1200"} 
            alt="Short" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 inline-block rounded mb-3 uppercase tracking-wider">
              {article.category?.replace('-', ' ')}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 text-shadow-lg">
              {getLocalizedText(article, 'headline', language)}
            </h2>
            <p className="text-white/80 line-clamp-3 text-sm md:text-base mb-6">
              {getLocalizedText(article, 'content', language).replace(/<[^>]*>?/gm, '')}
            </p>
            <div className="flex gap-4">
              <Link to={`/article/${article.id}`} className="flex-1 bg-white text-black font-bold py-3 text-center rounded-full hover:bg-slate-200 transition-colors">
                {language === 'hi' ? 'पूरी खबर पढ़ें' : 'Read Full Article'}
              </Link>
              <button onClick={() => handleShare(article.id!)} className="bg-black/50 backdrop-blur text-white p-3 rounded-full border border-white/20">
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
