import React, { useState, useEffect } from 'react';
import { Volume2, Square, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ReadAloudButtonProps {
  title: string;
  content: string;
  className?: string;
}

export default function ReadAloudButton({ title, content, className = '' }: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { language } = useLanguage();
  
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    
    // Stop playing when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToSpeak = `${title}. ${content.replace(/<[^>]*>?/gm, '')}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Try to set appropriate voice based on language
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice = null;
      
      if (language === 'hi') {
        preferredVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
      } else {
        preferredVoice = voices.find(v => v.lang.includes('en') && (v.lang.includes('IN') || v.lang.includes('US') || v.lang.includes('GB')));
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9; // Slightly slower for better news reading

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) return null;

  return (
    <button 
      onClick={toggleSpeech}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
        isPlaying 
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
      } ${className}`}
      title={language === 'hi' ? 'ख़बर सुनें' : 'Listen to Article'}
    >
      {isPlaying ? (
        <>
          <Square size={16} fill="currentColor" />
          {language === 'hi' ? 'सुनना बंद करें' : 'Stop Listening'}
        </>
      ) : (
        <>
          <Volume2 size={16} />
          {language === 'hi' ? 'ख़बर सुनें' : 'Listen'}
        </>
      )}
    </button>
  );
}
