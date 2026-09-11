import React, { useState, useEffect } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InstallPWA({ className }: { className?: string }) {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Provide a clearer message, especially if they are in an iframe
      if (window.self !== window.top) {
         alert(language === 'ur' ? 'ایپ انسٹال کرنے کے لیے براہ کرم اسے نئے ٹیب میں کھولیں۔' : (language === 'hi' ? 'ऐप इंस्टॉल करने के लिए, कृपया इसे पहले एक नए टैब (New Tab) में खोलें। (ऊपर दाईं ओर वाले तीर के बटन पर क्लिक करें)' : 'To install the app, please open it in a New Tab first (click the arrow icon top-right).'));
         return;
      }

      alert(language === 'ur' ? 'ایپ انسٹال کرنے کے لیے براہ کرم اسے نئے ٹیب میں کھولیں۔' : (language === 'hi' ? 'ऐप इंस्टॉल करने के लिए, कृपया इसे पहले एक नए टैब (New Tab) में खोलें। (ऊपर दाईं ओर वाले तीर के बटन पर क्लिक करें)' : 'To install the app, please open it in a New Tab first (click the arrow icon top-right).'));
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error with PWA install prompt:', err);
    }
  };

  if (isStandalone) return null;

  return (
    <button onClick={handleInstall} className={className || "flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-xs md:text-sm transition-colors shadow-lg animate-pulse mx-2 border border-red-500"}>
      {window.self !== window.top ? <ExternalLink size={14} /> : <Download size={14} />} 
      {language === 'ur' ? 'ایپ انسٹال کریں' : (language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App')}
    </button>
  );
}
