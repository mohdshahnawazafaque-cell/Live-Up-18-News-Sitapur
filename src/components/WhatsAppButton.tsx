import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const OPTIONS = [
  { id: 'ad', text: { hi: 'विज्ञापन देने के लिए', en: 'For Advertisement' } },
  { id: 'news', text: { hi: 'ख़बर देने के लिए', en: 'To Give News/Information' } },
  { id: 'feedback', text: { hi: 'सुझाव या शिकायत', en: 'Feedback or Complaint' } },
  { id: 'other', text: { hi: 'अन्य जानकारी', en: 'Other Information' } }
];

export default function WhatsAppButton() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const phoneNumber = '919838416560';

  const handleOptionClick = (optionId: string) => {
    let message = '';
    if (optionId === 'ad') {
      message = 'Hello Live UP 18 News, I want to give an advertisement.';
    } else if (optionId === 'news') {
      message = 'Hello Live UP 18 News, I have some news to share.';
    } else if (optionId === 'feedback') {
      message = 'Hello Live UP 18 News, I have a feedback/complaint.';
    } else {
      message = 'Hello Live UP 18 News, I want to connect with you.';
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={menuRef}>
      
      {/* Options Menu */}
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 w-64 origin-bottom-right animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#128C7E] text-white p-4">
            <h3 className="font-bold text-lg leading-tight">Live UP 18 News</h3>
            <p className="text-xs text-[#DCF8C6] opacity-90 mt-1">
              {language === 'hi' ? 'आप किस संबंध में बात करना चाहते हैं?' : 'How can we help you today?'}
            </p>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {OPTIONS.map(opt => (
              <button 
                key={opt.id}
                onClick={() => handleOptionClick(opt.id)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between group"
              >
                <span>{language === 'hi' ? opt.text.hi : opt.text.en}</span>
                <span className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 relative before:absolute before:inset-0 before:rounded-full before:bg-[#25D366] before:animate-ping before:opacity-75 focus:outline-none"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        )}
      </span>
      {!isOpen && (
        <div className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-bold py-2 px-4 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
          WhatsApp Chat
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
        </div>
      )}
      </button>
    </div>
  );
}
