import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InstallPWA({ className }: { className?: string }) {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert(language === 'hi' 
        ? "ऐप इंस्टॉल करने के लिए अपने ब्राउज़र मेनू से 'Add to Home Screen' चुनें।" 
        : "To install the app, select 'Add to Home Screen' from your browser menu.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <button onClick={handleInstall} className={className || "flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-xs md:text-sm transition-colors shadow-lg animate-pulse mx-2 border border-red-500"}>
      <Download size={14} /> {language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
    </button>
  );
}
