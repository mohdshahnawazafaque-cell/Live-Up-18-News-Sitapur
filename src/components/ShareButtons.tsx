import React from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const { language } = useLanguage();
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert(language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-slate-200 dark:border-slate-800 my-6">
      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Share2 size={18} /> {language === 'hi' ? 'शेयर करें:' : 'Share:'}
      </span>
      {navigator.share && (
        <button 
          onClick={handleShare}
          className="bg-indigo-600 text-white p-2 px-4 rounded-full hover:scale-105 transition-transform text-sm font-bold flex items-center gap-2"
        >
          <Share2 size={16} />
          {language === 'hi' ? 'सीधे शेयर करें' : 'Share directly'}
        </button>
      )}
      <a 
        href={`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-2 rounded-full hover:scale-110 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937s-3.113 6.937-6.938 6.937z"/></svg>
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#1877F2] text-white p-2 rounded-full hover:scale-110 transition-transform"
      >
        <Facebook size={20} />
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-black text-white p-2 rounded-full hover:scale-110 transition-transform"
      >
        <Twitter size={20} />
      </a>
      <button 
        onClick={handleShare}
        className="bg-slate-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
        title={language === 'hi' ? 'कॉपी करें' : 'Copy link'}
      >
        <LinkIcon size={20} />
      </button>
    </div>
  );
}
