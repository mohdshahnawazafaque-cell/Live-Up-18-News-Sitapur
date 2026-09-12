import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getEmbedUrl } from '../lib/youtube';

interface YouTubeVideo {
  title: string;
  link: string;
  pubDate: string;
  guid: string;
  thumbnail: string;
}

export default function YouTubeGallery() {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const CHANNEL_ID = 'UCRTXiJsiEqYUdWzzA6RQAEQ';
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D${CHANNEL_ID}`);
        const data = await res.json();
        if (data && data.status === 'ok' && Array.isArray(data.items)) {
          setVideos(data.items);
        }
      } catch (err) {
        console.error("Error fetching YouTube videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!Array.isArray(videos) || videos.length === 0) return null;

  return (
    <section className="bg-slate-900 dark:bg-black rounded-xl p-4 sm:p-6 text-white my-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-red-600 mb-6 pb-3 gap-4">
        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
          <span className="text-red-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </span>
          {language === 'hi' ? 'चैनल की सभी वीडियोस' : 'Channel Videos'}
        </h3>
        <a 
          href="https://www.youtube.com/@liveup18news" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors flex items-center gap-2"
        >
          {language === 'hi' ? 'यूट्यूब पर सब्सक्राइब करें' : 'Subscribe on YouTube'}
        </a>
      </div>

      {/* Embedded Playlist Player (Shows latest video and has a playlist menu) */}
      <div className="mb-8 bg-black rounded-xl overflow-hidden border border-slate-700 w-full" ref={topRef}>
        <div className="w-full max-w-4xl mx-auto aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}?autoplay=1` : `https://www.youtube.com/embed/videoseries?list=UURTXiJsiEqYUdWzzA6RQAEQ`}
            title="LIVE UP 18 NEWS Playlist"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-4 bg-slate-800 text-center">
          <p className="font-bold text-slate-300">👆 {language === 'hi' ? 'प्लेलिस्ट से कोई भी वीडियो चुनें' : 'Select any video from the playlist menu above'}</p>
        </div>
      </div>

      {/* Grid of latest videos fetched from RSS */}
      <h4 className="text-xl font-bold mb-4 uppercase">{language === 'hi' ? 'लेटेस्ट वीडियोस' : 'Latest Videos'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(Array.isArray(videos) ? videos : []).map((vid, idx) => {
          const videoId = (vid?.guid || '').split(':')[2] || vid?.link?.split('v=')[1] || '';
          return (
            <div key={idx} className="flex flex-col bg-slate-800 rounded-lg overflow-hidden border border-slate-700 group hover:border-red-500 transition-colors">
              <button onClick={() => { setCurrentVideoId(videoId); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="relative aspect-video block w-full overflow-hidden text-left focus:outline-none">
                <img src={vid.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                   <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
                   </div>
                </div>
              </button>
              <div className="p-4 flex flex-col flex-1">
                <button onClick={() => { setCurrentVideoId(videoId); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="font-bold text-sm leading-snug line-clamp-3 hover:text-red-400 mb-2 text-left">
                  {vid.title}
                </button>
                <div className="mt-auto text-xs text-slate-400 font-semibold">
                  {new Date(vid.pubDate).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
