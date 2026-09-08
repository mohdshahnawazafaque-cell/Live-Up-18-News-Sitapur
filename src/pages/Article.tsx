import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { NewsArticle } from "../types";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { Share2, MessageCircle, Link2, ArrowLeft, Send } from "lucide-react";
import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  
  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news/${id}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        setComments(data.comments || []);
        if (data && data.category) {
          return fetch(`/api/news?category=${data.category}&limit=5`);
        }
        return Promise.resolve(null);
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.articles) {
          setRelated(data.articles.filter((a: NewsArticle) => a.id !== id).slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
      
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 dark:text-slate-400 animate-pulse">{language === 'hi' ? 'लेख लोड हो रहा है...' : 'Loading article...'}</div>;
  }

  if (!article) {
    return <div className="py-20 text-center font-bold text-slate-500 dark:text-slate-400">{language === 'hi' ? 'लेख नहीं मिला।' : 'Article not found.'}</div>;
  }

  const handleShare = async () => {
    const url = window.location.href;
    const title = getLocalizedText(article, 'headline', language);
    const text = getLocalizedText(article, 'shortSummary', language);

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const title = getLocalizedText(article, 'headline', language);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(language === 'hi' ? 'लिंक कॉपी कर लिया गया है!' : 'Link copied to clipboard!');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/news/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCommentName, text: newCommentText })
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
        setNewCommentName("");
        setNewCommentText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <article className="lg:col-span-8">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors mr-2"
              title={language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            >
              <ArrowLeft size={20} />
            </button>
            <Link to={`/category/${article.category.toLowerCase().replace(/ /g, '-')}`} className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase hover:bg-red-700 transition-colors">
              {article.category}
            </Link>
            {article.state && (
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase px-2 border-l border-slate-300">
                {article.state}
              </span>
            )}
            {article.district && (
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase px-2 border-l border-slate-300">
                {article.district}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            {getLocalizedText(article, 'headline', language)}
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-6">
            {getLocalizedText(article, 'shortSummary', language)}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-y border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">{language === 'hi' ? 'द्वारा' : 'By'} {article.author}</span>
              <span>{language === 'hi' ? 'अपडेट:' : 'Updated:'} {format(new Date(article.updatedDate), "MMM d, yyyy, h:mm a")}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold mr-2">{language === 'hi' ? 'शेयर करें:' : 'Share:'}</span>
              <button onClick={handleWhatsAppShare} className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="WhatsApp">
                <MessageCircle size={16} />
              </button>
              <button onClick={handleShare} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors" title="Share Options">
                <Share2 size={16} />
              </button>
              <button onClick={handleCopyLink} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors" title="Copy Link">
                <Link2 size={16} />
              </button>
            </div>
          </div>
        </header>

        <figure className="mb-8">
          {!article.featuredImage.includes('picsum') && (
            <img src={article.featuredImage} alt={getLocalizedText(article, 'headline', language)} className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" />
          )}
          <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">{language === 'hi' ? 'स्रोत:' : 'Source:'} {article.sourceAttribution}</figcaption>
        </figure>

        {getLocalizedArray(article, 'keyPoints', language).length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-red-600 p-6 rounded-r-xl mb-8">
            <h3 className="font-black text-lg mb-3 uppercase text-slate-900 dark:text-white">{language === 'hi' ? 'मुख्य बिंदु' : 'Key Points'}</h3>
            <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700 dark:text-slate-300">
              {getLocalizedArray(article, 'keyPoints', language).map((point, idx) => (
                <li key={idx} className="pl-2">{point}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-a:text-red-600 pb-12 border-b border-slate-200 dark:border-slate-700">
          <p className="whitespace-pre-line text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            {getLocalizedText(article, 'content', language)}
          </p>
          {article.sourceUrl && (
            <div className="mt-8 pt-6">
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-md hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                {language === 'hi' ? 'पूरी खबर मूल वेबसाइट पर पढ़ें' : 'Read Full Article on Source'}
                <Link2 size={18} />
              </a>
            </div>
          )}
        </div>

      
        {/* Comments Section */}
        <section className="mt-12 mb-8 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageCircle size={24} className="text-red-600" />
            {language === 'hi' ? 'टिप्पणियाँ' : 'Comments'} ({comments.length})
          </h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-8 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{language === 'hi' ? 'आपका नाम' : 'Your Name'}</label>
              <input 
                type="text" 
                required
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{language === 'hi' ? 'आपकी टिप्पणी' : 'Your Comment'}</label>
              <textarea 
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={language === 'hi' ? 'इस खबर के बारे में अपनी राय साझा करें...' : 'Share your thoughts on this news...'}
                className="w-full px-4 py-2 border border-slate-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              {isSubmitting ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Posting...') : (language === 'hi' ? 'टिप्पणी करें' : 'Post Comment')}
            </button>
          </form>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.slice().reverse().map((c: any) => (
                <div key={c.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(c.date), "MMM d, yyyy")}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4 italic">
                {language === 'hi' ? 'अभी तक कोई टिप्पणी नहीं। अपनी राय साझा करने वाले पहले व्यक्ति बनें!' : 'No comments yet. Be the first to share your thoughts!'}
              </p>
            )}
          </div>
        </section>
      </article>

      <aside className="lg:col-span-4 flex flex-col gap-8">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 h-[300px] flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-300">
          {language === 'hi' ? 'विज्ञापन स्थान' : 'Advertisement Space'}
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-4">
            <h3 className="text-lg font-black uppercase">{language === 'hi' ? 'संबंधित समाचार' : 'Related News'}</h3>
          </div>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700 p-4">
            {related.map(news => (
              <Link key={news.id} to={`/article/${news.id}`} className="py-4 group flex gap-4 first:pt-0 last:pb-0">
                {news.featuredImage ? (
                  <img src={news.featuredImage} alt={getLocalizedText(news, 'headline', language)} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <span className="text-slate-400 font-bold text-[10px] text-center px-1">LIVE UP 18</span>
                  </div>
                )}
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-3 text-sm">
                  {getLocalizedText(news, 'headline', language)}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}
