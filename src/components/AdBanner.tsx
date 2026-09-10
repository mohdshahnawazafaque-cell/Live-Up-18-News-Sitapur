import React, { useEffect, useState } from 'react';
import { getCachedDocs } from "../lib/cache";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Advertisement } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function AdBanner({ position, className = "" }: { position: string, className?: string }) {
  const { language } = useLanguage();
  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const q = query(
          collection(db, "ads"), 
          where("position", "==", position),
          where("active", "==", true)
        );
        const snap = await getCachedDocs(q, `ad-${position}`);
        if (snap && snap.length > 0) {
          // If multiple ads for the same position, pick a random one
          const ads = snap as Advertisement[];
          const randomAd = ads[Math.floor(Math.random() * ads.length)];
          setAd(randomAd);
        }
      } catch (err) {
        console.error("Error fetching ad for position", position, err);
      }
    };
    fetchAd();
  }, [position]);

  if (position === 'header_cover' && !ad) return null;
  if (ad) {
    return (
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className={`block w-full overflow-hidden rounded-xl shadow-sm ${className}`}>
        <img loading="lazy" src={ad.imageUrl} alt="Advertisement" className="w-full h-full object-cover" />
      </a>
    );
  }

  return (
    <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl p-6 flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-300 ${className}`}>
      {language === 'hi' ? 'विज्ञापन स्थान' : 'Advertisement Space'}
    </div>
  );
}
