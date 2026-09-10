import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import { collection, query, orderBy, limit, where } from "firebase/firestore";
import { getCachedDocs } from "../lib/cache";
import { db } from "../lib/firebase";

export default function BreakingNews() {
  const { language } = useLanguage();
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const q = query(collection(db, "news"), where("isBreaking", "==", true), orderBy("publicationDate", "desc"), limit(5));
        let articles = await getCachedDocs(q, 'breaking-news');
        
        if (articles.length === 0) {
          const q2 = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(5));
          articles = await getCachedDocs(q2, 'latest-news-fallback');
        }
        setBreakingNews(articles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBreaking();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-slate-900 border-b border-red-700 py-1 flex items-center h-12 shadow-inner overflow-hidden">
      <div className="bg-red-600 text-white font-black text-sm uppercase px-4 h-full flex items-center shadow-lg whitespace-nowrap z-20 relative">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
        {language === 'hi' ? 'ताज़ा ख़बरें' : 'LATEST NEWS'}
      </div>
      
      <div className="flex-1 h-full relative text-white flex items-center overflow-hidden">
        {/* We use a wide container and CSS animation to scroll right to left */}
        
        <div className="flex w-full group overflow-hidden">
          <div className="whitespace-nowrap animate-marquee group-hover:pause flex shrink-0 items-center">
            
          
          <span className="font-bold text-yellow-400 flex items-center gap-2 mx-8 text-sm md:text-base">
            <span className="text-red-500 text-xl">•</span>
            विज्ञापन एवं समाचार के लिए व्हाट्सऐप पर संपर्क करें — अपने प्रतिष्ठान का विज्ञापन करवाएँ या अपने क्षेत्र की महत्वपूर्ण खबर हम तक पहुँचाएँ। Live UP 18 News | व्हाट्सऐप चैट: 
            <a 
              href="https://wa.me/919838416560?text=Hello%20Live%20UP%2018%20News" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] font-black underline decoration-[#25D366]/50 hover:text-green-300 ml-1"
            >
              9838416560
            </a>
          </span>

          {breakingNews.map((news) => (
            <Link key={news.id} to={`/article/${news.id}`} className="font-semibold text-sm md:text-base hover:text-red-400 transition-colors flex items-center gap-2 mx-8">
              <span className="text-red-500 text-xl">•</span>
              {getLocalizedText(news, 'headline', language)}
            </Link>
          ))}
          
          {/* Duplicate the ad message at the end so it loops cleanly if there aren't many news items */}
          <span className="font-bold text-yellow-400 flex items-center gap-2 mx-8 text-sm md:text-base pr-8">
            <span className="text-red-500 text-xl">•</span>
            विज्ञापन एवं समाचार के लिए व्हाट्सऐप पर संपर्क करें — अपने प्रतिष्ठान का विज्ञापन करवाएँ या अपने क्षेत्र की महत्वपूर्ण खबर हम तक पहुँचाएँ। Live UP 18 News | व्हाट्सऐप चैट: 
            <a 
              href="https://wa.me/919838416560?text=Hello%20Live%20UP%2018%20News" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] font-black underline decoration-[#25D366]/50 hover:text-green-300 ml-1"
            >
              9838416560
            </a>
          </span>
          
        
          </div>
          <div className="whitespace-nowrap animate-marquee group-hover:pause flex shrink-0 items-center" aria-hidden="true">
            
          
          <span className="font-bold text-yellow-400 flex items-center gap-2 mx-8 text-sm md:text-base">
            <span className="text-red-500 text-xl">•</span>
            विज्ञापन एवं समाचार के लिए व्हाट्सऐप पर संपर्क करें — अपने प्रतिष्ठान का विज्ञापन करवाएँ या अपने क्षेत्र की महत्वपूर्ण खबर हम तक पहुँचाएँ। Live UP 18 News | व्हाट्सऐप चैट: 
            <a 
              href="https://wa.me/919838416560?text=Hello%20Live%20UP%2018%20News" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] font-black underline decoration-[#25D366]/50 hover:text-green-300 ml-1"
            >
              9838416560
            </a>
          </span>

          {breakingNews.map((news) => (
            <Link key={news.id} to={`/article/${news.id}`} className="font-semibold text-sm md:text-base hover:text-red-400 transition-colors flex items-center gap-2 mx-8">
              <span className="text-red-500 text-xl">•</span>
              {getLocalizedText(news, 'headline', language)}
            </Link>
          ))}
          
          {/* Duplicate the ad message at the end so it loops cleanly if there aren't many news items */}
          <span className="font-bold text-yellow-400 flex items-center gap-2 mx-8 text-sm md:text-base pr-8">
            <span className="text-red-500 text-xl">•</span>
            विज्ञापन एवं समाचार के लिए व्हाट्सऐप पर संपर्क करें — अपने प्रतिष्ठान का विज्ञापन करवाएँ या अपने क्षेत्र की महत्वपूर्ण खबर हम तक पहुँचाएँ। Live UP 18 News | व्हाट्सऐप चैट: 
            <a 
              href="https://wa.me/919838416560?text=Hello%20Live%20UP%2018%20News" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] font-black underline decoration-[#25D366]/50 hover:text-green-300 ml-1"
            >
              9838416560
            </a>
          </span>
          
        
          </div>
        </div>

      </div>
    </div>
  );
}
