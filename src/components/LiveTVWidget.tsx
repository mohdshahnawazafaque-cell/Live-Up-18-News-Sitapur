import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getEmbedUrl } from '../lib/youtube';
import { useLanguage } from '../context/LanguageContext';
import { Radio } from 'lucide-react';

export default function LiveTVWidget() {
  const { language } = useLanguage();
  const [liveUrl, setLiveUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveTV = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'siteConfig', 'global'));
        if (configDoc.exists() && configDoc.data().liveTvUrl) {
          setLiveUrl(configDoc.data().liveTvUrl);
        }
      } catch (error) {
        console.error("Error fetching live TV config:", error);
      }
    };
    fetchLiveTV();
  }, []);

  if (!liveUrl) return null;

  const isYoutube = liveUrl.includes('youtube.com') || liveUrl.includes('youtu.be');

  return (
    <div className="mb-12">
      <div className="bg-red-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black uppercase flex items-center gap-2 tracking-widest">
           <Radio className="animate-pulse" /> {language === 'hi' ? 'लाइव टीवी' : 'LIVE TV'}
        </h2>
      </div>
      <div className="relative w-full aspect-video bg-black rounded-b-xl overflow-hidden shadow-2xl group font-sans">
        {/* The Video Player */}
        {isYoutube ? (
          <iframe 
            src={getEmbedUrl(liveUrl) + "?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0"} 
            className="absolute inset-0 w-full h-full z-0 pointer-events-auto" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            src={liveUrl} 
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-auto" 
          />
        )}
        
        {/* Graphic Overlays */}
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none p-4 flex justify-between items-start">
          <div className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 font-bold text-xs md:text-sm animate-pulse shadow-lg tracking-wider">
            <Radio size={16} /> {language === 'hi' ? 'लाइव' : 'LIVE'}
          </div>
          
          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-2 border-red-600">
            <span className="text-slate-900 font-black text-sm md:text-lg leading-none tracking-tight">LIVE UP 18</span>
            <span className="text-red-600 font-bold text-[10px] md:text-xs leading-none tracking-widest mt-0.5">NEWS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
