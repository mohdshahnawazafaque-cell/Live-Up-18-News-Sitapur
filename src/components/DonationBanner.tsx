import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DonationModal from './DonationModal';

export default function DonationBanner() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-slate-900 rounded-2xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-xl border border-red-700/50">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-950/50 px-3 py-1.5 rounded-full border border-red-500/30 text-red-200 text-xs font-bold uppercase tracking-widest mb-2">
              <Heart size={14} className="animate-pulse text-red-500" fill="currentColor" />
              <span>{language === 'hi' ? 'सहयोग करें' : 'Support Us'}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight">
              {language === 'hi' ? 'आपकी छोटी-सी मदद,' : 'Your small help,'}<br />
              <span className="text-red-400">{language === 'hi' ? 'जनता की बड़ी आवाज़' : 'A big voice for the people'}</span>
            </h2>
            
            <p className="text-red-100 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
              {language === 'hi' 
                ? 'Live UP 18 News की स्वतंत्र और जमीनी पत्रकारिता को आगे बढ़ाने में आपका सहयोग महत्वपूर्ण है। आप अपनी इच्छानुसार सहयोग राशि देकर जनहित की खबरों और स्वतंत्र पत्रकारिता को मजबूत करने में योगदान दे सकते हैं।' 
                : 'Your support is crucial in advancing the independent and grassroots journalism of Live UP 18 News. You can contribute to strengthening public interest news and independent journalism by donating an amount of your choice.'}
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-white hover:bg-slate-100 text-red-800 px-8 py-4 rounded-xl font-black text-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-3 group"
            >
              <Heart size={20} className="text-red-600 group-hover:scale-110 transition-transform" fill="currentColor" /> 
              {language === 'hi' ? 'अभी सहयोग करें' : 'Donate Now'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
