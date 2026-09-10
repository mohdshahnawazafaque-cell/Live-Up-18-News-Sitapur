import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { NewsArticle, TeamMember } from "../types";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { Share2, MessageCircle, Link2, ArrowLeft, Send, Tag } from "lucide-react";
import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";
import { useBookmarks } from "../context/BookmarkContext";
import { Bookmark, ThumbsUp, Flame, ThumbsDown, Tag } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';
import AdBanner from "../components/AdBanner";
import ShareButtons from "../components/ShareButtons";
import ReadAloudButton from "../components/ReadAloudButton";
import Comments from "../components/Comments";
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { getCachedDoc, getCachedDocs } from "../lib/cache";
import { db } from "../lib/firebase";
import YouTubeGallery from "../components/YouTubeGallery";
import TVNewsFrame from "../components/TVNewsFrame";
import SEO from "../components/SEO";


const ReadingProgressBar = () => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[60]">
      <div 
        className="h-full bg-red-600 transition-all duration-150 ease-out" 
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
};

export default function Article() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [reporter, setReporter] = useState<TeamMember | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState({ like: 0, fire: 0, comment: 0 });
  const [hasReacted, setHasReacted] = useState(false);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  
  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as NewsArticle;
          setArticle(data);
          
          // Increment views asynchronously
          if (data.id) {
            updateDoc(doc(db, "news", data.id), {
                views: increment(1)
            }).catch(e => console.error("Could not update views:", e));
          }
          setComments((data as any).comments || []);
          
          // Fetch related
          const q = query(collection(db, "news"), where("category", "==", data.category), limit(5));
          const relatedSnap = await getCachedDocs(q, 'related-' + data.category);
          const relatedArticles: NewsArticle[] = [];
          relatedSnap.forEach((rDoc: any) => {
            if (rDoc.id !== id) {
              relatedArticles.push(rDoc as NewsArticle);
            }
          });
          setRelated(relatedArticles);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || "LIVE UP 18 NEWS";
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    }
  };

  const handleShareToPlatform = (platform: string) => {
    const url = window.location.href;
    const titleText = article?.title || "LIVE UP 18 NEWS";
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(titleText + " - " + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titleText)}`, '_blank');
    }
  };

    const handleReaction = (type: 'like' | 'fire' | 'comment') => {
    if(hasReacted) return;
    setReactions(prev => ({...prev, [type]: prev[type] + 1}));
    setHasReacted(true);
  };
  
  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 dark:text-slate-400 animate-pulse">{language === 'hi' ? 'लेख लोड हो रहा है...' : 'Loading article...'}</div>;
  }

  if (!article) {
    return <div className="py-20 text-center font-bold text-slate-500 dark:text-slate-400">{language === 'hi' ? 'लेख नहीं मिला।' : 'Article not found.'}</div>;
  }

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const title = getLocalizedText(article, 'headline', language);
    const summary = getLocalizedText(article, 'shortSummary', language);
    const message = `*LIVE UP 18 NEWS*

*${title}*

${summary.substring(0, 100)}...

पूरी खबर पढ़ने और वीडियो देखने के लिए यहाँ क्लिक करें 👇
${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(language === 'hi' ? 'लिंक कॉपी कर लिया गया है!' : 'Link copied to clipboard!');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !id) return;
    
    setIsSubmitting(true);
    try {
      const newComment = {
         id: Date.now().toString(),
         name: newCommentName,
         text: newCommentText,
         date: new Date().toISOString()
      };
      const docRef = doc(db, "news", id);
      await updateDoc(docRef, {
         comments: arrayUnion(newComment)
      });
      
      setComments([...comments, newComment]);
      setNewCommentName("");
      setNewCommentText("");
      sessionStorage.clear(); // Clear cache to reflect comment globally if needed
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'टिप्पणी जोड़ने में त्रुटि हुई' : 'Error posting comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-16">
      <ReadingProgressBar />
      <SEO 
        title={`${getLocalizedText(article, 'headline', language)} | LIVE UP 18 NEWS`}
        description={getLocalizedText(article, 'content', language).substring(0, 150) + '...'}
        image={article.featuredImage}
      />
      
      {/* Premium Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-col items-center text-center">
          <Link to={`/category/${article.category}`} className="text-red-700 dark:text-red-500 text-[11px] font-black uppercase tracking-[0.2em] mb-6 hover:underline">
            {article.category?.replace('-', ' ')}
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-slate-900 dark:text-white leading-[1.15] mb-8">
            {getLocalizedText(article, 'headline', language)}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 border-y border-slate-200 dark:border-slate-800 w-full py-4">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{article.author || 'LIVE UP 18 Desk'}</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <time dateTime={article.publicationDate}>
                {format(new Date(article.publicationDate), "dd MMMM yyyy, p", { 
                  locale: language === 'hi' ? hi : enUS 
                })}
              </time>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleBookmark(article)}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${isBookmarked(article.id) ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'hover:text-slate-900 dark:hover:text-white'}`}
                title={isBookmarked(article.id) ? 'Remove Bookmark' : 'Save for later'}
              >
                <Bookmark size={18} fill={isBookmarked(article.id) ? 'currentColor' : 'none'} />
              </button>
              <ShareButtons url={window.location.href} title={getLocalizedText(article, 'headline', language)} />
              <ReadAloudButton title={getLocalizedText(article, 'headline', language)} content={getLocalizedText(article, 'content', language)} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-900">
          <img 
            src={article.featuredImage || "https://picsum.photos/seed/news/1200/800"} 
            alt={getLocalizedText(article, 'headline', language)} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="lg:w-2/3">
          <article className="prose prose-lg dark:prose-invert max-w-none font-sans text-slate-800 dark:text-slate-300 leading-relaxed mb-12 prose-headings:font-heading prose-headings:font-black prose-a:text-red-600">
            {getLocalizedText(article, 'content', language).split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6">{paragraph}</p>
            ))}
          </article>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-8 mt-8 flex-wrap">
              <Tag size={18} className="text-slate-400" />
              {getLocalizedArray(article, 'tags', language).map(tag => (
                <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-8">
          <AdBanner position="article_sidebar" />
          <TrendingWidget currentArticleId={article.id} />
        </aside>
      </div>
    </div>
  );

}
