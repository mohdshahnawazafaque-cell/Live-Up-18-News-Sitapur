import React, { useEffect, useState } from 'react';
import { getCachedDocs } from "../lib/cache";
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Comment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Comments({ articleId }: { articleId: string }) {
  const { language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, "comments"), where("articleId", "==", articleId));
        const snap = await getCachedDocs(q, `comments-${articleId}`);
        const fetched = (snap || []) as Comment[];
        fetched.sort((a, b) => (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime());
        setComments(fetched);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;
    setLoading(true);
    try {
      const commentData = {
        articleId,
        text: newComment,
        authorName: name,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "comments"), commentData);
      setComments([{ id: docRef.id, ...commentData } as Comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert("Error posting comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-slate-50 rounded-xl p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare size={24} className="text-red-600" /> 
        {language === 'hi' ? 'जनता की राय (कमेंट्स)' : 'Public Comments'}
        <span className="bg-slate-200 text-slate-700 text-sm py-1 px-2 rounded-full ml-2">{comments.length}</span>
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3">
        <input 
          type="text" 
          placeholder={language === 'hi' ? 'अपना नाम लिखें...' : 'Your Name...'} 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 w-full md:w-1/2"
        />
        <div className="relative">
          <textarea 
            placeholder={language === 'hi' ? 'इस खबर पर अपनी राय लिखें...' : 'Write your opinion on this news...'} 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows={3}
            className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 w-full resize-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute bottom-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:bg-slate-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {!Array.isArray(comments) || comments.length === 0 ? (
          <p className="text-slate-500 italic">
            {language === 'hi' ? 'अभी तक कोई कमेंट नहीं है। अपनी राय देने वाले पहले व्यक्ति बनें!' : 'No comments yet. Be the first to share your opinion!'}
          </p>
        ) : (
          (comments || []).map(c => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800">{c.authorName}</span>
                <span className="text-xs text-slate-400">{c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : ""}</span>
              </div>
              <p className="text-slate-700 text-sm">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
