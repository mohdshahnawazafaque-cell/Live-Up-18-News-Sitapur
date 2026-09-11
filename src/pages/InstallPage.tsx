import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Smartphone, 
  Bell, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

export default function InstallPage() {
  const { language } = useLanguage();
  const { isInstallable, isInstalled, isIOS, isInAppBrowser, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const installUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/install` 
    : 'https://liveup18news.com/install';

  const shareText = language === 'hi'
    ? `🔴 LIVE UP 18 NEWS - आधिकारिक मोबाइल ऐप!\n\nउत्तर प्रदेश, भारत और दुनिया भर की ताज़ा व सटीक ख़बरें सबसे पहले पाने के लिए नीचे दिए गए लिंक पर टच करके हमारी ऐप तुरंत इंस्टॉल करें:\n\n👉 ${installUrl}`
    : `🔴 LIVE UP 18 NEWS - Official Mobile App!\n\nStay updated with breaking news from UP & India. Tap the link to install our official app directly:\n\n👉 ${installUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(installUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = installUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LIVE UP 18 NEWS App',
          text: shareText,
          url: installUrl,
        });
      } catch (err) {
        // Ignored or dismissed
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleInstallClick = async () => {
    const res = await install();
    if (res) {
      setInstallSuccess(true);
    }
  };

  const openInChromeIntent = () => {
    if (typeof window !== 'undefined') {
      const cleanHostAndPath = window.location.host + window.location.pathname;
      window.location.href = `intent://${cleanHostAndPath}#Intent;scheme=https;package=com.android.chrome;end`;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      <SEO 
        title={language === 'hi' ? "ऐप इंस्टॉल करें - LIVE UP 18 NEWS" : "Install App - LIVE UP 18 NEWS"} 
        description="LIVE UP 18 NEWS की आधिकारिक मोबाइल ऐप इंस्टॉल करें और ताज़ा तरीन ख़बरें सबसे पहले पाएं।"
      />

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-white shadow-2xl mb-4 overflow-hidden flex items-center justify-center border-2 border-red-200">
              <img 
                src="/logo.png" 
                alt="LIVE UP 18 NEWS Logo" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e: any) => { e.currentTarget.src = "/pwa-192x192.png"; }}
              />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-red-950/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 border border-red-400/30">
              <ShieldCheck size={14} className="text-emerald-400" />
              {language === 'hi' ? 'आधिकारिक डिजिटल न्यूज़ ऐप' : 'Official Digital News App'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight mb-2">
              LIVE UP 18 NEWS
            </h1>
            <p className="text-red-100 text-sm sm:text-base max-w-lg">
              {language === 'hi' 
                ? 'उत्तर प्रदेश और देश की सबसे तेज़ और सटीक खबरें अब सीधे आपके मोबाइल पर!' 
                : 'Uttar Pradesh and India’s fastest news portal directly on your mobile device!'}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Status & Primary Install Action */}
          <div className="text-center space-y-4">
            {installSuccess || isInstalled ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-5 text-center">
                <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full mb-3">
                  <Check size={28} />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  {language === 'hi' ? 'ऐप आपके फ़ोन में इंस्टॉल है!' : 'App is already installed!'}
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4">
                  {language === 'hi' ? 'आप इसे अपने फ़ोन के होम स्क्रीन से कभी भी खोल सकते हैं।' : 'You can open it anytime from your device home screen.'}
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-md"
                >
                  {language === 'hi' ? 'ताज़ा ख़बरें पढ़ें' : 'Read Latest News'}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                {/* Notice for In-App Browser (WhatsApp, Instagram, FB) */}
                {isInAppBrowser && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-4 text-left mb-4">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                      ⚠️ {language === 'hi' ? 'आप WhatsApp या सोशल ब्राउज़र में हैं' : 'You are inside WhatsApp / Social browser'}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                      {language === 'hi' 
                        ? '1-क्लिक में ऐप इंस्टॉल करने के लिए इसे Chrome ब्राउज़र में खोलें:' 
                        : 'To install the app in 1 tap, please open in Chrome browser:'}
                    </p>
                    <button
                      onClick={openInChromeIntent}
                      className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors"
                    >
                      <ExternalLink size={16} />
                      {language === 'hi' ? 'Chrome ब्राउज़र में खोलें' : 'Open in Chrome'}
                    </button>
                  </div>
                )}

                {/* Main Big Install Button */}
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black py-4 px-8 rounded-xl text-lg transition-all shadow-xl shadow-red-600/30 hover:scale-[1.02] cursor-pointer"
                >
                  <Download size={24} className="animate-bounce" />
                  <span>{language === 'hi' ? 'अभी ऐप इंस्टॉल करें' : 'Install App Now'}</span>
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' 
                    ? '✓ मुफ़्त • ⚡ 1 सेकंड में इंस्टॉल • 📱 प्ले स्टोर लॉगिन की ज़रूरत नहीं' 
                    : '✓ 100% Free • ⚡ Instant Install • 📱 No App Store Login Required'}
                </p>
              </>
            )}
          </div>

          {/* Share Section - Specifically requested by user */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 size={20} className="text-red-600" />
                  {language === 'hi' ? 'यह ऐप लिंक दूसरों को शेयर करें' : 'Share This Install Link'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'hi' 
                    ? 'जिसको भी आप यह लिंक भेजेंगे, वह सीधे टच करके ऐप इंस्टॉल कर सकेगा:' 
                    : 'Anyone who taps this link can instantly install the app on their phone:'}
                </p>
              </div>
            </div>

            {/* Share Link Box */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 mb-4">
              <input 
                type="text" 
                readOnly 
                value={installUrl} 
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex-shrink-0 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                {copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'कॉपी' : 'Copy')}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
              >
                <FaWhatsapp size={18} />
                {language === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
              </button>

              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
              >
                <Share2 size={16} />
                {language === 'hi' ? 'अन्य ऐप्स पर शेयर करें' : 'Share via Other Apps'}
              </button>
            </div>
          </div>

          {/* Manual Instructions Guide (Fallback for iOS & Android) */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white">
              {language === 'hi' ? 'मैन्युअल इंस्टॉल करने का तरीका' : 'Manual Install Steps'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Android Steps */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-3">
                  <Smartphone size={18} className="text-emerald-600" />
                  <span>Android (Chrome / Browser)</span>
                </div>
                <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-decimal pl-4">
                  <li>
                    {language === 'hi' 
                      ? 'ऊपर दिया गया लाल रंग का "अभी ऐप इंस्टॉल करें" बटन दबाएं।' 
                      : 'Click the red "Install App Now" button above.'}
                  </li>
                  <li>
                    {language === 'hi' 
                      ? 'अगर बटन से न हो, तो ब्राउज़र के ऊपरी कोने में 3 डॉट्स (⋮) पर टैप करें।' 
                      : 'Or tap the 3 dots (⋮) in your Chrome browser menu.'}
                  </li>
                  <li>
                    {language === 'hi' 
                      ? '"Install app" या "Add to Home screen" चुनें।' 
                      : 'Select "Install app" or "Add to Home screen".'}
                  </li>
                </ol>
              </div>

              {/* iPhone / iPad Steps */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-3">
                  <Smartphone size={18} className="text-blue-600" />
                  <span>iPhone / iPad (Safari)</span>
                </div>
                <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-decimal pl-4">
                  <li>
                    {language === 'hi' 
                      ? 'सफारी (Safari) ब्राउज़र के नीचे शेयर आइकॉन (📤) पर टैप करें।' 
                      : 'Tap the Share icon (📤) at the bottom of Safari.'}
                  </li>
                  <li>
                    {language === 'hi' 
                      ? 'नीचे स्क्रॉल करके "Add to Home Screen" (➕) पर टैप करें।' 
                      : 'Scroll down and tap "Add to Home Screen" (➕).'}
                  </li>
                  <li>
                    {language === 'hi' 
                      ? 'ऊपर दाएँ कोने में "Add" पर टैप करें। ऐप स्क्रीन पर आ जाएगी।' 
                      : 'Tap "Add" at the top right to complete installation.'}
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
              {language === 'hi' ? 'LIVE UP 18 NEWS ऐप की खूबियां' : 'App Features'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Zap size={20} className="text-amber-500 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'सुपर फ़ास्ट' : 'Super Fast'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'hi' ? '1 MB से भी कम' : '< 1 MB Size'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Bell size={20} className="text-red-600 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'ताज़ा अलर्ट्स' : 'Instant Alerts'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'ब्रेकिंग न्यूज़ सीधे' : 'Breaking Updates'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Smartphone size={20} className="text-blue-500 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'नो प्ले स्टोर' : 'Direct Install'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'सीधा 1-टच में' : 'No Store Login'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <ShieldCheck size={20} className="text-emerald-500 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? '100% मुफ़्त' : '100% Free'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'सुरक्षित व निष्पक्ष' : 'Safe & Verified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
