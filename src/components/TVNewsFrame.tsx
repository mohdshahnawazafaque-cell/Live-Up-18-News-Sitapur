import React from 'react';
import { NewsArticle } from '../types';
import { getEmbedUrl } from '../lib/youtube';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { Radio } from 'lucide-react';

export default function TVNewsFrame({ article }: { article: NewsArticle }) {
  const { language } = useLanguage();
  const headline = getLocalizedText(article, 'headline', language);
  const isYoutube = article.videoUrl?.includes('youtube.com') || article.videoUrl?.includes('youtu.be');

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group font-sans">
      {/* 1. The Video Player */}
      {isYoutube ? (
        <iframe 
          src={getEmbedUrl(article.videoUrl) + "?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0"} 
          className="absolute inset-0 w-full h-full z-0 pointer-events-auto" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video 
          src={article.videoUrl!} 
          controls={false}
          autoPlay
          loop
          className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-auto" 
        />
      )}

      {/* 2. TV Graphics Overlays (Pointer events none so user can click video if needed, but Youtube controls are hidden above) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        
        {/* Top Section: Live Badge & Logo */}
        <div className="flex justify-between items-start p-4 md:p-6">
          <div className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 font-bold text-xs md:text-sm animate-pulse shadow-lg tracking-wider">
            <Radio size={16} /> {language === 'hi' ? 'लाइव' : 'LIVE'}
          </div>
          
          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-2 border-red-600">
            <span className="text-slate-900 font-black text-sm md:text-lg leading-none tracking-tight">LIVE UP 18</span>
            <span className="text-red-600 font-bold text-[10px] md:text-xs leading-none tracking-widest mt-0.5">NEWS</span>
          </div>
        </div>

        {/* Bottom Section: Lower Thirds & Ticker */}
        <div className="flex flex-col">
          {/* Location/Reporter Badge */}
          <div className="flex px-4 md:px-8 mb-[-1px] z-20">
            <div className="bg-blue-700 text-white px-4 py-1 font-bold text-xs md:text-sm uppercase shadow-lg border-l-4 border-red-600 rounded-tr-lg">
              {(article.category || '').replace('-', ' ')}
            </div>
            {article.author && (
              <div className="bg-red-600 text-white px-4 py-1 font-bold text-xs md:text-sm shadow-lg rounded-tr-lg ml-1">
                {article.author}
              </div>
            )}
          </div>

          {/* Main Headline Bar */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white px-4 py-2 md:py-4 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10 border-t-2 border-white/20">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-black uppercase tracking-wide leading-tight drop-shadow-md line-clamp-2 md:line-clamp-1">
              {headline}
            </h2>
          </div>

          {/* Breaking News Ticker */}
          <div className="bg-white text-black flex items-center h-8 md:h-10 relative overflow-hidden z-20 shadow-lg">
            <div className="bg-black text-yellow-400 font-bold px-3 md:px-6 h-full flex items-center whitespace-nowrap z-30 uppercase text-xs md:text-sm tracking-wider">
              {language === 'hi' ? 'ताज़ा ख़बर' : 'LATEST'}
            </div>
            <div className="flex-1 overflow-hidden h-full relative">
              <div className="animate-marquee whitespace-nowrap h-full flex items-center font-bold text-sm md:text-base px-4 text-red-700">
                • {headline} • LIVE UP 18 NEWS - {language === 'hi' ? 'उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत' : 'Your trusted source for the latest news from Uttar Pradesh, India, and around the world.'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
