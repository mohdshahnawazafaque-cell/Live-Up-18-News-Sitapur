import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { getCachedDocs } from '../lib/cache';
import { db } from '../lib/firebase';
import { Poll } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BarChart2 } from 'lucide-react';

export default function PollWidget() {
  const { language } = useLanguage();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const q = query(collection(db, "polls"), where("active", "==", true));
        const snap = await getCachedDocs(q, 'PollWidget-data');
        if (snap && snap.length > 0) {
          const pollData = snap[0] as Poll;
          if (pollData && Array.isArray(pollData.options)) {
            setPoll(pollData);
            
            let total = 0;
            pollData.options.forEach(opt => total += (opt?.votes || 0));
            setTotalVotes(total);

            // Check local storage
            if (localStorage.getItem(`poll_voted_${pollData.id}`)) {
              setHasVoted(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPoll();
  }, []);

  const handleVote = async (optionId: string) => {
    if (!poll || hasVoted || !Array.isArray(poll.options)) return;
    
    try {
      // Optimistic update
      setHasVoted(true);
      const newOptions = poll.options.map(opt => 
        opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
      );
      setPoll({ ...poll, options: newOptions });
      setTotalVotes(totalVotes + 1);
      localStorage.setItem(`poll_voted_${poll.id}`, 'true');

      const pollRef = doc(db, "polls", poll.id);
      await updateDoc(pollRef, {
        options: newOptions
      });
      
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  if (!poll || !Array.isArray(poll.options) || poll.options.length === 0) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 uppercase">
        <BarChart2 className="text-red-600" />
        {language === 'hi' ? 'जनता की राय (POLL)' : 'Public Poll'}
      </h3>
      <p className="text-slate-800 font-bold text-lg mb-6 leading-snug">
        {poll.question}
      </p>
      
      <div className="flex flex-col gap-3">
        {(Array.isArray(poll.options) ? poll.options : []).map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          
          return (
            <div key={option.id} className="relative">
              {hasVoted ? (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden relative p-3 flex justify-between items-center z-10">
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-red-100 -z-10 transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <span className="font-bold text-slate-800">{option.text}</span>
                  <span className="font-bold text-red-600">{percentage}%</span>
                </div>
              ) : (
                <button
                  onClick={() => handleVote(option.id)}
                  className="w-full text-left bg-white border border-slate-300 hover:border-red-600 hover:bg-red-50 p-3 rounded-lg font-bold text-slate-800 transition-colors shadow-sm"
                >
                  {option.text}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {hasVoted && (
        <div className="text-xs text-slate-500 text-center mt-4">
          {totalVotes} {language === 'hi' ? 'लोगों ने वोट किया' : 'total votes'}
        </div>
      )}
    </div>
  );
}
