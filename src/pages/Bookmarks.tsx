import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';

export default function Bookmarks() {
  const { savedArticles, toggleBookmark } = useBookmarks();
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[70vh]">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Bookmark className="text-red-600" size={32} />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
          {language === 'hi' ? 'सेव की गई ख़बरें' : 'Saved News'}
        </h1>
      </div>

      {!Array.isArray(savedArticles) || savedArticles.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Bookmark className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={64} />
          <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'आपने अभी तक कोई खबर सेव नहीं की है।' : 'You have not saved any news yet.'}
          </h2>
          <Link to="/" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-colors">
            {language === 'hi' ? 'होम पर जाएँ' : 'Go to Home'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(savedArticles || []).filter(Boolean).map(article => (
            <div key={article.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden flex flex-col group border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
              <Link to={`/article/${article.id}`} className="relative h-48 overflow-hidden block">
                <img 
                  src={article.featuredImage || "https://picsum.photos/seed/news/800/600"} 
                  alt={getLocalizedText(article, 'headline', language)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase rounded shadow">
                  {(article.category || '').replace('-', ' ')}
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/article/${article.id}`} className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {getLocalizedText(article, 'headline', language)}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Clock size={14} className="mr-1" />
                    {(() => {
                      try {
                        const d = article.publicationDate ? new Date(article.publicationDate) : null;
                        if (!d || isNaN(d.getTime())) return '';
                        return formatDistanceToNow(d, { 
                          addSuffix: true,
                          locale: language === 'hi' ? hi : undefined
                        });
                      } catch {
                        return '';
                      }
                    })()}
                  </div>
                  <button 
                    onClick={() => toggleBookmark(article)}
                    className="text-red-600 hover:text-red-800 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full"
                  >
                    {language === 'hi' ? 'हटाएं' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
